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
const unreadMessagesStat = document.getElementById('unreadMessagesStat');
const blockedDevicesStat = document.getElementById('blockedDevicesStat');

let supabase = null;
let devices = [];
let selectedDeviceId = null;
let unreadCounts = new Map();
let adminTypingTimeoutId = null;
let adminTypingLastSentAt = 0;
let lastUnreadTotal = 0;

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
  if (unreadMessagesStat) unreadMessagesStat.textContent = String(unreadTotal);
  if (blockedDevicesStat) blockedDevicesStat.textContent = String(devices.filter((device) => device.license_status === 'blocked').length);
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
  const query = deviceSearch.value.trim().toLowerCase();
  const filtered = devices.filter((device) => {
    const haystack = `${device.support_id} ${device.user_name || ''} ${device.device_name || ''}`.toLowerCase();
    return haystack.includes(query);
  });

  deviceList.innerHTML = filtered.map((device) => {
    const online = isDeviceOnline(device);
    const statusClass = device.license_status === 'blocked' ? 'blocked' : online ? 'online' : 'offline';
    const unread = unreadCounts.get(device.id) || 0;
    const typing = isUserTyping(device);
    return `
      <button type="button" class="device-card ${device.id === selectedDeviceId ? 'is-active' : ''}" data-device-id="${device.id}">
        <span class="device-card-top">
          <strong>${escapeHtml(device.user_name || 'Sem nome')}</strong>
          ${unread ? `<span class="unread-badge">${unread}</span>` : ''}
        </span>
        <small>${escapeHtml(device.support_id)}</small>
        <small class="${statusClass}"><span class="presence-dot ${online ? 'is-online' : ''}"></span>${online ? 'Online agora' : `Visto ${formatDate(device.last_seen_at)}`} - ${escapeHtml(device.license_status || 'free')}</small>
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

  deviceDetail.innerHTML = `
    <div>
      <span class="kicker">${online ? 'Online agora' : 'Ultimo acesso'}</span>
      <h2>${escapeHtml(device.user_name || 'Usuario sem nome')}</h2>
      <p class="muted">${escapeHtml(device.support_id)} - ${escapeHtml(device.device_name || 'Dispositivo nao informado')}</p>
      <p class="presence-line">${typing ? 'Usuario digitando...' : online ? 'Usuario online' : `Visto por ultimo ${formatDate(device.last_seen_at)}`}</p>
    </div>

    <div class="detail-grid">
      <div class="detail-item"><span>Licenca</span><strong>${escapeHtml(device.license_status || 'free')}</strong></div>
      <div class="detail-item"><span>Ultimo acesso</span><strong>${formatDate(device.last_seen_at)}</strong></div>
      <div class="detail-item"><span>Versao</span><strong>${escapeHtml(device.app_version || '-')}</strong></div>
      <div class="detail-item"><span>Plataforma</span><strong>${escapeHtml(device.platform || '-')}</strong></div>
      <div class="detail-item"><span>Modelo</span><strong>${escapeHtml(device.device_model || '-')}</strong></div>
      <div class="detail-item"><span>Criado em</span><strong>${formatDate(device.created_at)}</strong></div>
    </div>

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
      <label>
        Status da licenca
        <select id="licenseStatusInput">
          ${['free', 'trial', 'premium', 'blocked'].map((status) => `<option value="${status}" ${device.license_status === status ? 'selected' : ''}>${status}</option>`).join('')}
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
    <div class="command-item">
      <strong>${escapeHtml(command.command_type)}</strong>
      <small class="muted"> ${escapeHtml(command.status)} - ${formatDate(command.created_at)}</small>
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
