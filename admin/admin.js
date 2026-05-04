import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const config = window.CF_ADMIN_SUPABASE_CONFIG || {};
const loginForm = document.getElementById('loginForm');
const loginPanel = document.getElementById('loginPanel');
const dashboard = document.getElementById('dashboard');
const adminEmail = document.getElementById('adminEmail');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const loginStatus = document.getElementById('loginStatus');
const deviceSearch = document.getElementById('deviceSearch');
const deviceList = document.getElementById('deviceList');
const deviceDetail = document.getElementById('deviceDetail');
const totalDevicesStat = document.getElementById('totalDevicesStat');
const onlineDevicesStat = document.getElementById('onlineDevicesStat');
const premiumDevicesStat = document.getElementById('premiumDevicesStat');
const unreadMessagesStat = document.getElementById('unreadMessagesStat');
const blockedDevicesStat = document.getElementById('blockedDevicesStat');
const pendingCommandsStat = document.getElementById('pendingCommandsStat');
const deviceListCount = document.getElementById('deviceListCount');
const deviceFilters = document.getElementById('deviceFilters');

let supabase = null;
let devices = [];
let selectedDeviceId = null;
let unreadCounts = new Map();
let pendingCommandCounts = new Map();
let adminTypingTimeoutId = null;
let adminTypingLastSentAt = 0;
let lastUnreadTotal = 0;
let currentDeviceFilter = 'all';

function setLoginStatus(message, type = '') {
  loginStatus.textContent = message;
  loginStatus.hidden = !message;
  loginStatus.className = type ? `status ${type}` : 'status';
}

function assertConfig() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    setLoginStatus('Configure admin/supabase-config.js com a URL e anon key do Supabase.', 'error');
    return false;
  }

  return true;
}

function formatDate(value) {
  if (!value) return 'Nunca';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return 'Nunca';
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatRelative(value) {
  if (!value) return 'Nunca';
  const diffMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diffMs)) return 'Data invalida';
  const seconds = Math.max(0, Math.floor(diffMs / 1000));
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `ha ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `ha ${hours} h`;
  const days = Math.floor(hours / 24);
  return `ha ${days} d`;
}

function isRecent(value, seconds) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() < seconds * 1000;
}

function isDeviceOnline(device) {
  return isRecent(device.last_seen_at, 180);
}

function isUserTyping(device) {
  return isRecent(device.user_typing_at, 8);
}

function getLicenseLabel(status) {
  const labels = {
    free: 'Gratuito',
    trial: 'Teste',
    premium: 'Premium',
    blocked: 'Bloqueado'
  };
  return labels[status] || labels.free;
}

function getCommandTypeLabel(type) {
  const labels = {
    show_message: 'Aviso no app',
    force_update: 'Busca de atualizacao'
  };
  return labels[type] || type;
}

function getCommandStatusLabel(status) {
  const labels = {
    pending: 'Aguardando app',
    done: 'Executado',
    failed: 'Falhou'
  };
  return labels[status] || status;
}

function getDeviceTitle(device) {
  return device.user_name || 'Usuario sem nome';
}

function getDeviceSubtitle(device) {
  return [
    device.device_name,
    device.platform,
    device.app_version ? `v${device.app_version}` : ''
  ].filter(Boolean).join(' - ') || 'Dispositivo nao informado';
}

function getFilteredDevices() {
  const query = deviceSearch.value.trim().toLowerCase();
  return devices.filter((device) => {
    const unread = unreadCounts.get(device.id) || 0;
    const online = isDeviceOnline(device);
    const haystack = [
      device.support_id,
      device.user_name,
      device.device_name,
      device.device_model,
      device.platform,
      device.app_version,
      device.license_status,
      device.admin_note
    ].filter(Boolean).join(' ').toLowerCase();

    if (query && !haystack.includes(query)) {
      return false;
    }

    if (currentDeviceFilter === 'online') return online;
    if (currentDeviceFilter === 'unread') return unread > 0;
    if (currentDeviceFilter === 'premium') return device.license_status === 'premium';
    if (currentDeviceFilter === 'blocked') return device.license_status === 'blocked';
    return true;
  });
}

async function init() {
  try {
    if (!assertConfig()) return;

    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      showDashboard();
      await loadDevices();
    }
  } catch (error) {
    setLoginStatus(`Falha ao iniciar painel: ${error?.message || 'verifique a conexao.'}`, 'error');
  }
}

function showDashboard() {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showLogin() {
  dashboard.hidden = true;
  loginPanel.hidden = false;
  window.setTimeout(() => adminEmail?.focus(), 20);
}

async function login() {
  try {
    if (!assertConfig()) return;
    if (!supabase) supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    setLoginStatus('Entrando...');
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail.value.trim(),
      password: adminPassword.value
    });

    if (error) {
      setLoginStatus(error.message, 'error');
      return;
    }

    setLoginStatus('');
    showDashboard();
    await loadDevices();
  } catch (error) {
    setLoginStatus(`Erro ao entrar: ${error?.message || 'sem resposta do Supabase.'}`, 'error');
  }
}

async function logout() {
  await supabase?.auth.signOut();
  devices = [];
  selectedDeviceId = null;
  unreadCounts = new Map();
  pendingCommandCounts = new Map();
  renderDevices();
  showLogin();
}

async function loadDevices(options = {}) {
  const { data, error } = await supabase
    .from('support_devices')
    .select('*')
    .order('last_seen_at', { ascending: false, nullsFirst: false });

  if (error) {
    deviceList.innerHTML = `<p class="status error">${error.message}</p>`;
    return;
  }

  devices = data || [];
  await loadUnreadCounts();
  await loadPendingCommandCounts();
  updateDashboardStats();
  renderDevices();
  updateUnreadTitle();

  if (selectedDeviceId && !options.skipDetail) {
    await refreshDeviceChat(selectedDeviceId, { silent: true });
  }
}

async function loadUnreadCounts() {
  const { data } = await supabase
    .from('support_messages')
    .select('device_id')
    .eq('sender', 'user')
    .is('read_at', null);

  unreadCounts = new Map();
  (data || []).forEach((item) => {
    unreadCounts.set(item.device_id, (unreadCounts.get(item.device_id) || 0) + 1);
  });
}

async function loadPendingCommandCounts() {
  const { data } = await supabase
    .from('support_commands')
    .select('device_id')
    .eq('status', 'pending');

  pendingCommandCounts = new Map();
  (data || []).forEach((item) => {
    pendingCommandCounts.set(item.device_id, (pendingCommandCounts.get(item.device_id) || 0) + 1);
  });
}

function updateUnreadTitle() {
  const total = [...unreadCounts.values()].reduce((sum, count) => sum + count, 0);
  if (total > lastUnreadTotal) {
    flashUnreadNotification(total - lastUnreadTotal);
  }
  lastUnreadTotal = total;
  document.title = total > 0
    ? `(${total}) Painel Admin - Controle de Dividas`
    : 'Painel Admin - Controle de Dividas';
}

function updateDashboardStats() {
  const unreadTotal = [...unreadCounts.values()].reduce((sum, count) => sum + count, 0);
  if (totalDevicesStat) totalDevicesStat.textContent = String(devices.length);
  if (onlineDevicesStat) onlineDevicesStat.textContent = String(devices.filter(isDeviceOnline).length);
  if (premiumDevicesStat) premiumDevicesStat.textContent = String(devices.filter((device) => device.license_status === 'premium').length);
  if (unreadMessagesStat) unreadMessagesStat.textContent = String(unreadTotal);
  if (blockedDevicesStat) blockedDevicesStat.textContent = String(devices.filter((device) => device.license_status === 'blocked').length);
  if (pendingCommandsStat) pendingCommandsStat.textContent = String([...pendingCommandCounts.values()].reduce((sum, count) => sum + count, 0));
}

function flashUnreadNotification(count) {
  if (count <= 0 || document.hidden === false) {
    return;
  }

  try {
    const originalTitle = document.title;
    document.title = `Nova mensagem (${count})`;
    window.setTimeout(() => {
      document.title = originalTitle;
    }, 1800);
  } catch (_) {}
}

function renderDevices() {
  const filtered = getFilteredDevices();
  if (deviceListCount) {
    const total = devices.length;
    deviceListCount.textContent = `${filtered.length} de ${total} dispositivo${total === 1 ? '' : 's'}`;
  }

  deviceList.innerHTML = filtered.map((device) => {
    const online = isDeviceOnline(device);
    const statusClass = device.license_status === 'blocked' ? 'blocked' : online ? 'online' : 'offline';
    const unread = unreadCounts.get(device.id) || 0;
    const pending = pendingCommandCounts.get(device.id) || 0;
    const typing = isUserTyping(device);
    return `
      <button type="button" class="device-card ${device.id === selectedDeviceId ? 'is-active' : ''}" data-device-id="${device.id}">
        <span class="device-card-top">
          <strong>${escapeHtml(getDeviceTitle(device))}</strong>
          <span class="device-badges">
            ${unread ? `<span class="unread-badge">${unread}</span>` : ''}
            ${pending ? `<span class="pending-badge">${pending}</span>` : ''}
          </span>
        </span>
        <small class="device-support-id">${escapeHtml(device.support_id)}</small>
        <small>${escapeHtml(getDeviceSubtitle(device))}</small>
        <small class="${statusClass}"><span class="presence-dot ${online ? 'is-online' : ''}"></span>${online ? 'Online agora' : `Visto ${formatRelative(device.last_seen_at)}`} - ${escapeHtml(getLicenseLabel(device.license_status))}</small>
        ${typing ? '<small class="typing-line">Digitando...</small>' : ''}
      </button>
    `;
  }).join('') || '<p class="muted">Nenhum dispositivo encontrado.</p>';
}

async function renderDeviceDetail(deviceId) {
  selectedDeviceId = deviceId;
  renderDevices();
  const device = devices.find((item) => item.id === deviceId);
  if (!device) return;

  await setAdminPresence(device.id, { online: true });
  const online = isDeviceOnline(device);
  const typing = isUserTyping(device);
  const unread = unreadCounts.get(device.id) || 0;
  const pending = pendingCommandCounts.get(device.id) || 0;
  const license = device.license_status || 'free';

  deviceDetail.innerHTML = `
    <div class="device-hero">
      <div>
        <span class="kicker">${online ? 'Online agora' : 'Ultimo acesso'}</span>
        <h2>${escapeHtml(getDeviceTitle(device))}</h2>
        <p class="muted">${escapeHtml(getDeviceSubtitle(device))}</p>
        <p class="presence-line">${typing ? 'Usuario digitando...' : online ? 'Usuario online' : `Visto por ultimo ${formatDate(device.last_seen_at)}`}</p>
      </div>
      <div class="device-hero-actions">
        <span class="license-pill is-${escapeHtml(license)}">${escapeHtml(getLicenseLabel(license))}</span>
        <button type="button" class="secondary compact" id="copySupportIdBtn">Copiar ID</button>
      </div>
    </div>

    <div class="detail-overview">
      <article>
        <span>Mensagens novas</span>
        <strong>${unread}</strong>
      </article>
      <article>
        <span>Comandos pendentes</span>
        <strong>${pending}</strong>
      </article>
      <article>
        <span>Ultimo contato</span>
        <strong>${formatRelative(device.last_seen_at)}</strong>
      </article>
      <article>
        <span>Versao do app</span>
        <strong>${escapeHtml(device.app_version || '-')}</strong>
      </article>
    </div>

    <section class="info-section">
      <div class="section-heading-row">
        <div>
          <span class="kicker">Identificacao</span>
          <h3>Usuario e suporte</h3>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-item"><span>Nome do usuario</span><strong>${escapeHtml(device.user_name || '-')}</strong></div>
        <div class="detail-item"><span>ID de suporte</span><strong>${escapeHtml(device.support_id)}</strong></div>
        <div class="detail-item"><span>Nome do dispositivo</span><strong>${escapeHtml(device.device_name || '-')}</strong></div>
        <div class="detail-item"><span>Licenca atual</span><strong>${escapeHtml(getLicenseLabel(license))}</strong></div>
      </div>
    </section>

    <section class="info-section">
      <div class="section-heading-row">
        <div>
          <span class="kicker">Aparelho</span>
          <h3>Dados tecnicos</h3>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-item"><span>Plataforma</span><strong>${escapeHtml(device.platform || '-')}</strong></div>
        <div class="detail-item"><span>Versao instalada</span><strong>${escapeHtml(device.app_version || '-')}</strong></div>
        <div class="detail-item wide"><span>Modelo / navegador</span><strong>${escapeHtml(device.device_model || '-')}</strong></div>
        <div class="detail-item"><span>Criado em</span><strong>${formatDate(device.created_at)}</strong></div>
        <div class="detail-item"><span>Atualizado em</span><strong>${formatDate(device.updated_at)}</strong></div>
        <div class="detail-item"><span>Ultimo acesso</span><strong>${formatDate(device.last_seen_at)}</strong></div>
      </div>
    </section>

    <section class="chat-panel ${unreadCounts.get(device.id) ? 'has-unread' : ''}">
      <div class="chat-heading">
        <div>
          <span class="kicker">Conversa</span>
          <h3>Atendimento pelo app</h3>
        </div>
        <span id="chatPresenceLabel">${typing ? 'Usuario digitando...' : online ? 'Online agora' : 'Offline'}</span>
      </div>
      <div class="chat-messages" id="adminChatMessages" aria-live="polite"></div>
      <div class="chat-compose">
        <input type="text" id="adminChatInput" maxlength="1200" placeholder="Responder usuario">
        <button type="button" id="adminChatSendBtn">Enviar</button>
      </div>
      <p class="status" id="adminChatStatus" hidden></p>
    </section>

    <div class="actions-panel">
      <div class="section-heading-row">
        <div>
          <span class="kicker">Controle remoto</span>
          <h3>Licenca, aviso e comandos</h3>
        </div>
      </div>
      <div class="action-form-grid">
        <label>
          Status da licenca
          <select id="licenseStatusInput">
            ${['free', 'trial', 'premium', 'blocked'].map((status) => `<option value="${status}" ${license === status ? 'selected' : ''}>${getLicenseLabel(status)}</option>`).join('')}
          </select>
        </label>
        <label>
          Aviso exibido no app
          <textarea id="remoteMessageInput" rows="3" placeholder="Mensagem para este usuario">${escapeHtml(device.remote_message || '')}</textarea>
        </label>
        <label>
          Nota interna
          <textarea id="adminNoteInput" rows="3" placeholder="Observacao privada">${escapeHtml(device.admin_note || '')}</textarea>
        </label>
      </div>
      <div class="actions-row">
        <button type="button" id="saveDeviceBtn">Salvar alteracoes</button>
        <button type="button" class="secondary" id="sendMessageCommandBtn">Enviar aviso agora</button>
        <button type="button" class="secondary" id="forceUpdateCommandBtn">Forcar busca de atualizacao</button>
        <button type="button" class="danger" id="blockDeviceBtn">Bloquear</button>
      </div>
      <div>
        <span class="kicker">Comandos recentes</span>
        <div class="command-list" id="commandList"></div>
      </div>
    </div>
  `;

  document.getElementById('copySupportIdBtn').addEventListener('click', () => copyToClipboard(device.support_id, 'ID copiado.'));
  document.getElementById('saveDeviceBtn').addEventListener('click', () => saveDevice(device.id));
  document.getElementById('sendMessageCommandBtn').addEventListener('click', () => sendCommand(device.id, 'show_message', {
    message: document.getElementById('remoteMessageInput').value.trim()
  }));
  document.getElementById('forceUpdateCommandBtn').addEventListener('click', () => sendCommand(device.id, 'force_update', {}));
  document.getElementById('blockDeviceBtn').addEventListener('click', async () => {
    document.getElementById('licenseStatusInput').value = 'blocked';
    await saveDevice(device.id);
  });

  const adminChatInput = document.getElementById('adminChatInput');
  document.getElementById('adminChatSendBtn').addEventListener('click', () => sendAdminMessage(device.id));
  adminChatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendAdminMessage(device.id);
    }
  });
  adminChatInput.addEventListener('input', () => queueAdminTyping(device.id));

  await refreshDeviceChat(device.id);
  await renderCommands(device.id);
}

async function refreshDeviceChat(deviceId, options = {}) {
  const messagesEl = document.getElementById('adminChatMessages');
  if (!messagesEl) return;

  await setAdminPresence(deviceId, { online: true });

  const { data, error } = await supabase
    .from('support_messages')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) {
    if (!options.silent) setAdminChatStatus(error.message, 'error');
    return;
  }

  const shouldStickToBottom = messagesEl.scrollTop + messagesEl.clientHeight >= messagesEl.scrollHeight - 24;
  messagesEl.innerHTML = (data || []).map((message) => `
    <div class="chat-message ${message.sender === 'admin' ? 'is-admin' : 'is-user'}">
      ${message.message_type === 'image' && message.image_data_url ? `<img class="chat-image" src="${escapeHtml(message.image_data_url)}" alt="Imagem enviada pelo usuario" data-open-image="${escapeHtml(message.image_data_url)}">` : ''}
      <span>${escapeHtml(message.message)}</span>
      <small>${message.sender === 'admin' ? 'ADM' : 'Usuario'} - ${formatDate(message.created_at)}</small>
    </div>
  `).join('') || '<p class="muted">Nenhuma mensagem ainda.</p>';

  if (shouldStickToBottom) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  await supabase
    .from('support_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('device_id', deviceId)
    .eq('sender', 'user')
    .is('read_at', null);

  await loadUnreadCounts();
  updateDashboardStats();
  renderDevices();
  updateUnreadTitle();
}

async function renderCommands(deviceId) {
  const commandList = document.getElementById('commandList');
  if (!commandList) return;

  const { data } = await supabase
    .from('support_commands')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(10);

  commandList.innerHTML = (data || []).map((command) => `
    <div class="command-item is-${escapeHtml(command.status)}">
      <div>
        <strong>${escapeHtml(getCommandTypeLabel(command.command_type))}</strong>
        <small class="muted">Criado ${formatDate(command.created_at)}</small>
      </div>
      <span>${escapeHtml(getCommandStatusLabel(command.status))}</span>
      <small class="command-meta">
        ${command.seen_at ? `Visto ${formatDate(command.seen_at)}` : 'Ainda nao visto pelo app'}
        ${command.executed_at ? ` - Executado ${formatDate(command.executed_at)}` : ''}
        ${command.result ? ` - ${escapeHtml(command.result)}` : ''}
      </small>
    </div>
  `).join('') || '<p class="muted">Nenhum comando enviado.</p>';
}

async function setAdminPresence(deviceId, options = {}) {
  const payload = {
    admin_last_seen_at: new Date().toISOString()
  };

  if (options.typing !== undefined) {
    payload.admin_typing_at = options.typing ? new Date().toISOString() : null;
  }

  await supabase.from('support_devices').update(payload).eq('id', deviceId);
}

function queueAdminTyping(deviceId) {
  const now = Date.now();
  if (now - adminTypingLastSentAt > 2500) {
    adminTypingLastSentAt = now;
    setAdminPresence(deviceId, { typing: true });
  }

  if (adminTypingTimeoutId) {
    window.clearTimeout(adminTypingTimeoutId);
  }

  adminTypingTimeoutId = window.setTimeout(() => {
    setAdminPresence(deviceId, { typing: false });
  }, 3500);
}

async function sendAdminMessage(deviceId) {
  const input = document.getElementById('adminChatInput');
  const button = document.getElementById('adminChatSendBtn');
  const message = input?.value.trim();

  if (!message) return;

  button.disabled = true;
  const { error } = await supabase.from('support_messages').insert({
    device_id: deviceId,
    sender: 'admin',
    message
  });

  if (error) {
    setAdminChatStatus(error.message, 'error');
  } else {
    input.value = '';
    await setAdminPresence(deviceId, { typing: false });
    await refreshDeviceChat(deviceId);
    setAdminChatStatus('');
  }

  button.disabled = false;
}

function setAdminChatStatus(message, type = '') {
  const status = document.getElementById('adminChatStatus');
  if (!status) return;
  status.textContent = message;
  status.hidden = !message;
  status.className = type ? `status ${type}` : 'status';
}

async function saveDevice(deviceId) {
  const payload = {
    license_status: document.getElementById('licenseStatusInput').value,
    remote_message: document.getElementById('remoteMessageInput').value.trim() || null,
    admin_note: document.getElementById('adminNoteInput').value.trim() || null
  };

  const { error } = await supabase.from('support_devices').update(payload).eq('id', deviceId);
  if (error) {
    alert(error.message);
    return;
  }

  await loadDevices();
}

async function sendCommand(deviceId, commandType, payload) {
  const { error } = await supabase.from('support_commands').insert({
    device_id: deviceId,
    command_type: commandType,
    payload
  });

  if (error) {
    alert(error.message);
    return;
  }

  await renderCommands(deviceId);
}

async function copyToClipboard(text, successMessage = 'Copiado.') {
  try {
    await navigator.clipboard.writeText(text || '');
    setAdminChatStatus(successMessage);
  } catch (_) {
    window.prompt('Copie manualmente:', text || '');
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  login();
});
adminEmail.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    adminPassword.focus();
  }
});
adminPassword.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    login();
  }
});
loginBtn.addEventListener('click', (event) => {
  event.preventDefault();
  login();
});
logoutBtn.addEventListener('click', logout);
refreshBtn.addEventListener('click', () => loadDevices());
deviceSearch.addEventListener('input', renderDevices);
deviceFilters?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  currentDeviceFilter = button.dataset.filter || 'all';
  deviceFilters.querySelectorAll('button').forEach((item) => {
    item.classList.toggle('is-active', item === button);
  });
  renderDevices();
});
deviceList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-device-id]');
  if (button) renderDeviceDetail(button.dataset.deviceId);
});

deviceDetail.addEventListener('click', (event) => {
  const image = event.target.closest('[data-open-image]');
  if (image?.dataset.openImage) {
    window.open(image.dataset.openImage, '_blank', 'noopener,noreferrer');
  }
});

window.setInterval(() => {
  if (!dashboard.hidden && supabase) {
    loadDevices({ skipDetail: false });
  }
}, 6000);

init();
