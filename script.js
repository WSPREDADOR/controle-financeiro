const MS_PER_DAY = 1000 * 60 * 60 * 24;
const STORAGE_KEY = 'payment-plans-v1';

const resultsSection = document.getElementById('resultsSection');
const statusMessage = document.getElementById('statusMessage');
const monthlyContainer = document.getElementById('monthlyContainer');
const plansPanel = document.querySelector('.plans-panel');
const currentDate = document.getElementById('currentDate');
const mobileCurrentDate = document.getElementById('mobileCurrentDate');
const updateBanner = document.getElementById('updateBanner');
const updateBannerTitle = document.getElementById('updateBannerTitle');
const updateBannerMessage = document.getElementById('updateBannerMessage');
const updatePrimaryBtn = document.getElementById('updatePrimaryBtn');
const plansList = document.getElementById('plansList');
const selectedPlanTitle = document.getElementById('selectedPlanTitle');
const selectedPlanSubtitle = document.getElementById('selectedPlanSubtitle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
const mobileOptionsDrawer = document.getElementById('mobileOptionsDrawer');
const closeMobileDrawerBtn = document.getElementById('closeMobileDrawerBtn');
const goToFormBtn = document.getElementById('goToFormBtn');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const openReorderModalBtn = document.getElementById('openReorderModalBtn');
const backToListBtn = document.getElementById('backToListBtn');
const backToTopBtn = document.getElementById('backToTopBtn');
const plansTotalCount = document.getElementById('plansTotalCount');
const plansVisibleCount = document.getElementById('plansVisibleCount');
const plansSelectedCount = document.getElementById('plansSelectedCount');
const createModal = document.getElementById('createModal');
const createForm = document.getElementById('createPlanForm');
const createPlanNameInput = document.getElementById('createPlanName');
const createStartDateInput = document.getElementById('createStartDate');
const createTotalMonthsInput = document.getElementById('createTotalMonths');
const createCountModeInput = document.getElementById('createCountMode');
const createStatusMessage = document.getElementById('createStatusMessage');
const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
const cancelCreateModalBtn = document.getElementById('cancelCreateModalBtn');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editPlanForm');
const editPlanNameInput = document.getElementById('editPlanName');
const editStartDateInput = document.getElementById('editStartDate');
const editTotalMonthsInput = document.getElementById('editTotalMonths');
const editCountModeInput = document.getElementById('editCountMode');
const editStatusMessage = document.getElementById('editStatusMessage');
const editModalSubtitle = document.getElementById('editModalSubtitle');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');
const deleteModal = document.getElementById('deleteModal');
const deletePlanName = document.getElementById('deletePlanName');
const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
const cancelDeleteModalBtn = document.getElementById('cancelDeleteModalBtn');
const confirmDeleteModalBtn = document.getElementById('confirmDeleteModalBtn');
const reorderModal = document.getElementById('reorderModal');
const reorderList = document.getElementById('reorderList');
const closeReorderModalBtn = document.getElementById('closeReorderModalBtn');
const cancelReorderModalBtn = document.getElementById('cancelReorderModalBtn');

let plans = loadPlans();
let selectedPlanId = plans[0]?.id ?? null;
let editingPlanId = null;
let pendingDeletePlanId = null;
let reorderDraftPlanIds = [];
let draggedReorderPlanId = null;
let availableUpdate = null;
let updateCheckIntervalId = null;
let isUpdateCheckInFlight = false;
let updateBannerHoldUntil = 0;
const PENDING_UPDATE_VERSION_KEY = 'pending-app-update-version';
const WEB_BUNDLE_STORAGE_KEY = 'cf-active-web-bundle';
const defaultUpdateConfig = {
  currentVersion: '1.4.12',
  bundleManifestUrl: 'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-manifest.json',
  bundleManifestFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-manifest.json',
  checkOnStartup: true,
  requestTimeoutMs: 6000,
  recheckIntervalMs: 45000
};

currentDate.textContent = formatDate(normalizeDate(new Date()));
if (mobileCurrentDate) {
  mobileCurrentDate.textContent = currentDate.textContent;
}
renderPlansList();
updateResultsNavigation();

if (selectedPlanId) {
  renderPlanDetails(getSelectedPlan());
}

const installedUpdateVersion = announceInstalledUpdate();
initializeUpdateCheck(installedUpdateVersion);

createForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const planName = createPlanNameInput.value.trim();
  const startInput = createStartDateInput.value;
  const monthsInput = Number.parseInt(createTotalMonthsInput.value, 10);
  const countMode = createCountModeInput.value;

  if (!planName || !startInput || Number.isNaN(monthsInput) || monthsInput <= 0) {
    setCreateStatus('Preencha o nome do compromisso, uma data válida e um total de meses maior que zero.', 'error');
    return;
  }

  const nextPlan = {
    id: createPlanId(),
    name: planName,
    startDate: startInput,
    totalMonths: monthsInput,
    countMode: isValidCountMode(countMode) ? countMode : 'start_month',
    paidMonths: []
  };

  plans.unshift(nextPlan);

  selectedPlanId = nextPlan.id;
  savePlans();
  renderPlansList();
  renderPlanDetails(nextPlan);
  closeCreateModal();
  setStatus(`Compromisso "${nextPlan.name}" cadastrado com sucesso. Para editar depois, use o botão Editar na lista.`, 'success');
  scrollToSection(plansPanel);
});

plansList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-plan-id]');
  const editButton = event.target.closest('[data-edit-plan-id]');

  if (deleteButton) {
    const planToDelete = plans.find((plan) => plan.id === deleteButton.dataset.deletePlanId);

    if (!planToDelete) {
      return;
    }

    openDeleteModal(planToDelete);
    return;
  }

  if (editButton) {
    const planToEdit = plans.find((plan) => plan.id === editButton.dataset.editPlanId);

    if (!planToEdit) {
      return;
    }

    selectedPlanId = planToEdit.id;
    renderPlansList();
    renderPlanDetails(planToEdit);
    openEditModal(planToEdit);
    return;
  }

  const planButton = event.target.closest('[data-plan-id]');

  if (!planButton) {
    return;
  }

  selectedPlanId = planButton.dataset.planId;
  const selectedPlan = getSelectedPlan();

  if (!selectedPlan) {
    return;
  }

  renderPlansList();
  renderPlanDetails(selectedPlan);
  setStatus(`Exibindo os cálculos de "${selectedPlan.name}".`, 'success');
  scrollToSection(resultsSection);
});

monthlyContainer.addEventListener('click', (event) => {
  const toggleButton = event.target.closest('[data-toggle-paid]');

  if (!toggleButton) {
    return;
  }

  const monthIndex = Number.parseInt(toggleButton.dataset.monthIndex, 10);

  if (Number.isNaN(monthIndex)) {
    return;
  }

  toggleMonthPaid(monthIndex);
});

plansList.addEventListener('scroll', () => {
  const visibleNumber = getVisiblePlanNumber();
  updatePlansSummary(visibleNumber);
  updateFocusedPlanCard(visibleNumber);
});

reorderList.addEventListener('dragstart', (event) => {
  const dragHandle = event.target.closest('[data-reorder-plan-id]');

  if (!dragHandle) {
    event.preventDefault();
    return;
  }

  const dragItem = dragHandle.closest('.reorder-item');

  if (!dragItem) {
    event.preventDefault();
    return;
  }

  draggedReorderPlanId = dragHandle.dataset.reorderPlanId;
  dragItem.classList.add('is-dragging');
  reorderList.classList.add('is-reordering');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedReorderPlanId);
  event.dataTransfer.setDragImage(dragItem, 40, 24);
});

reorderList.addEventListener('dragover', (event) => {
  if (!draggedReorderPlanId) {
    return;
  }

  event.preventDefault();
  const draggedItem = reorderList.querySelector(`.reorder-item[data-plan-id="${draggedReorderPlanId}"]`);

  if (!draggedItem) {
    return;
  }

  const nextItem = getReorderInsertTarget(event.clientY);

  if (!nextItem) {
    reorderList.appendChild(draggedItem);
    syncReorderNumbersFromDom();
    return;
  }

  if (nextItem !== draggedItem) {
    reorderList.insertBefore(draggedItem, nextItem);
    syncReorderNumbersFromDom();
  }
});

reorderList.addEventListener('drop', (event) => {
  if (!draggedReorderPlanId) {
    return;
  }

  event.preventDefault();
  saveReorderFromDom();
  clearReorderDragState();
});

reorderList.addEventListener('dragend', () => {
  clearReorderDragState();
});

openCreateModalBtn.addEventListener('click', () => {
  openCreateModal();
});

editForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!editingPlanId) {
    closeEditModal();
    return;
  }

  const planName = editPlanNameInput.value.trim();
  const startInput = editStartDateInput.value;
  const monthsInput = Number.parseInt(editTotalMonthsInput.value, 10);
  const countMode = editCountModeInput.value;

  if (!planName || !startInput || Number.isNaN(monthsInput) || monthsInput <= 0) {
    setEditStatus('Preencha o nome do compromisso, uma data válida e um total de meses maior que zero.', 'error');
    return;
  }

  const existingPlanIndex = plans.findIndex((plan) => plan.id === editingPlanId);

  if (existingPlanIndex < 0) {
    closeEditModal();
    setStatus('Não foi possível localizar esse compromisso para editar.', 'error');
    return;
  }

  const existingPlan = plans[existingPlanIndex];
  const updatedPlan = {
    ...existingPlan,
    name: planName,
    startDate: startInput,
    totalMonths: monthsInput,
    countMode: isValidCountMode(countMode) ? countMode : 'start_month',
    paidMonths: sanitizePaidMonths(existingPlan.paidMonths ?? [], monthsInput)
  };

  plans[existingPlanIndex] = updatedPlan;
  selectedPlanId = updatedPlan.id;
  savePlans();
  renderPlansList();
  renderPlanDetails(updatedPlan);
  closeEditModal();
  setStatus(`Compromisso "${updatedPlan.name}" atualizado com sucesso.`, 'success');
});

closeEditModalBtn.addEventListener('click', () => {
  closeEditModal();
});

cancelEditModalBtn.addEventListener('click', () => {
  closeEditModal();
});

closeDeleteModalBtn.addEventListener('click', () => {
  closeDeleteModal();
});

cancelDeleteModalBtn.addEventListener('click', () => {
  closeDeleteModal();
});

confirmDeleteModalBtn.addEventListener('click', () => {
  if (!pendingDeletePlanId) {
    closeDeleteModal();
    return;
  }

  const planId = pendingDeletePlanId;
  closeDeleteModal();
  deletePlan(planId);
});

openReorderModalBtn.addEventListener('click', () => {
  if (plans.length === 0) {
    setStatus('Cadastre pelo menos um compromisso para reorganizar a lista.', 'error');
    return;
  }

  openReorderModal();
});

closeReorderModalBtn.addEventListener('click', () => {
  closeReorderModal();
});

cancelReorderModalBtn.addEventListener('click', () => {
  closeReorderModal();
});

closeCreateModalBtn.addEventListener('click', () => {
  closeCreateModal();
});

cancelCreateModalBtn.addEventListener('click', () => {
  closeCreateModal();
});

createModal.addEventListener('click', (event) => {
  if (event.target === createModal) {
    closeCreateModal();
  }
});

editModal.addEventListener('click', (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

deleteModal.addEventListener('click', (event) => {
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});

reorderModal.addEventListener('click', (event) => {
  if (event.target === reorderModal) {
    closeReorderModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !createModal.hidden) {
    closeCreateModal();
  }

  if (event.key === 'Escape' && !editModal.hidden) {
    closeEditModal();
  }

  if (event.key === 'Escape' && !deleteModal.hidden) {
    closeDeleteModal();
  }

  if (event.key === 'Escape' && !reorderModal.hidden) {
    closeReorderModal();
  }

  if (event.key === 'Escape' && mobileOptionsDrawer && !mobileOptionsDrawer.hidden) {
    closeMobileDrawer();
  }
});

goToFormBtn.addEventListener('click', () => {
  openCreateModal();
});

backToListBtn.addEventListener('click', () => {
  scrollToSection(plansList);
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updatePrimaryBtn?.addEventListener('click', () => {
  if (availableUpdate?.bundleUrl) {
    startAppUpdate(availableUpdate);
  }
});

mobileMenuBtn?.addEventListener('click', () => {
  openMobileDrawer();
});

closeMobileDrawerBtn?.addEventListener('click', () => {
  closeMobileDrawer();
});

mobileDrawerBackdrop?.addEventListener('click', () => {
  closeMobileDrawer();
});

mobileOptionsDrawer?.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-mobile-action]');

  if (!actionButton) {
    return;
  }

  const { mobileAction } = actionButton.dataset;
  closeMobileDrawer();

  if (mobileAction === 'add') {
    openCreateModal();
    return;
  }

  if (mobileAction === 'reorder') {
    if (plans.length === 0) {
      setStatus('Cadastre pelo menos um compromisso para reorganizar a lista.', 'error');
      return;
    }

    openReorderModal();
    return;
  }

  if (mobileAction === 'results') {
    const selectedPlan = getSelectedPlan();

    if (!selectedPlan) {
      setStatus('Selecione um compromisso para ver o resultado detalhado.', 'error');
      return;
    }

    scrollToSection(resultsSection);
    return;
  }

  if (mobileAction === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

});

function renderPlanDetails(plan) {
  if (!plan) {
    resultsSection.hidden = true;
    return;
  }

  const today = normalizeDate(new Date());
  const startDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
  const endDate = addMonths(effectiveStartDate, plan.totalMonths);
  const totalDays = Math.max(1, daysBetween(effectiveStartDate, endDate));
  const paidMonths = getPaidMonths(plan);
  const completedMonths = paidMonths.length;
  const remainingMonths = Math.max(plan.totalMonths - completedMonths, 0);
  const percent = Math.round((completedMonths / plan.totalMonths) * 100);
  const remainingLabel = buildRemainingLabel(remainingMonths);

  selectedPlanTitle.textContent = plan.name;
  selectedPlanSubtitle.textContent = `Cálculo individual do compromisso "${plan.name}".`;
  resultsSection.hidden = false;

  document.getElementById('percentage').textContent = `${percent}%`;
  document.getElementById('remainingTime').textContent = remainingLabel;
  document.getElementById('completedMonths').textContent = `${completedMonths}/${plan.totalMonths}`;
  document.getElementById('summaryStart').textContent = formatDate(effectiveStartDate);
  document.getElementById('summaryMonths').textContent = String(plan.totalMonths);
  document.getElementById('summaryDays').textContent = `${totalDays} dias no total`;
  document.getElementById('summaryEnd').textContent = formatDate(endDate);
  document.getElementById('planStatus').textContent = buildPlanStatus(completedMonths, plan.totalMonths);
  document.getElementById('countModeLabel').textContent = getCountModeLabel(plan.countMode);
  document.getElementById('progressFill').style.width = `${percent}%`;

  renderMonthlyTimeline(plan, effectiveStartDate, today);

  setStatus(buildSummaryMessage(plan.name, completedMonths, plan.totalMonths), 'success');
  updateResultsNavigation();
}

function renderPlansList() {
  plansList.innerHTML = '';

  if (plans.length === 0) {
    plansList.innerHTML = `
      <div class="empty-state">
        Nenhum compromisso salvo ainda. Cadastre algo como parcelas da moto, do carro ou da casa.
      </div>
    `;
    resultsSection.hidden = true;
    updatePlansSummary(0);
    updateResultsNavigation();
    return;
  }

  plans.forEach((plan, index) => {
    const planStartDate = parseDateInput(plan.startDate);
    const planEndDate = addMonths(getEffectiveStartDate(planStartDate, plan.countMode), plan.totalMonths);
    const paidCount = getPaidMonths(plan).length;
    const progressRatio = plan.totalMonths > 0 ? clamp(paidCount / plan.totalMonths, 0, 1) : 0;
    const progressPercent = Math.round(progressRatio * 100);
    const item = document.createElement('div');
    item.className = 'plan-entry';
    item.dataset.planNumber = String(index + 1);
    item.dataset.planId = plan.id;
    item.innerHTML = `
      <article class="plan-item${plan.id === selectedPlanId ? ' active' : ''}" style="--plan-progress:${progressRatio};" data-plan-number="${String(index + 1)}" data-plan-id="${plan.id}">
        <button type="button" class="plan-select-btn" data-plan-id="${plan.id}">
          <div class="plan-item-head">
            <span class="plan-item-tag">${String(index + 1).padStart(2, '0')}</span>
            <span class="plan-duration-pill">${plan.totalMonths} ${plan.totalMonths === 1 ? 'mês' : 'meses'}</span>
          </div>
          <strong class="plan-item-name">${escapeHtml(plan.name)}</strong>
          <div class="plan-progress-meta">
            <span class="plan-progress-label">Andamento</span>
            <strong class="plan-progress-value">${progressPercent}%</strong>
          </div>
          <div class="plan-progress" aria-hidden="true">
            <span class="plan-progress-fill"></span>
          </div>
          <div class="plan-stat-grid">
            <div class="plan-stat-card">
              <span class="plan-stat-label">Início</span>
              <strong class="plan-stat-value">${formatDateShort(planStartDate)}</strong>
            </div>
            <div class="plan-stat-card">
              <span class="plan-stat-label">Pagos</span>
              <strong class="plan-stat-value">${paidCount}/${plan.totalMonths}</strong>
            </div>
            <div class="plan-stat-card plan-stat-card-end">
              <span class="plan-stat-label">Fim</span>
              <strong class="plan-stat-value">${formatMonthYearCompact(planEndDate)}</strong>
            </div>
          </div>
        </button>
        <div class="plan-item-actions">
          <button type="button" class="plan-edit-btn" data-edit-plan-id="${plan.id}">Editar</button>
          <button
            type="button"
            class="plan-delete-btn"
            data-delete-plan-id="${plan.id}"
            aria-label="Excluir ${escapeHtml(plan.name)}"
          >
            Excluir
          </button>
        </div>
      </article>
    `;
    plansList.appendChild(item);
  });

  const visibleNumber = getVisiblePlanNumber();
  updatePlansSummary(visibleNumber);
  updateFocusedPlanCard(visibleNumber);
  updateResultsNavigation();
}

function renderMonthlyTimeline(plan, startDate, today) {
  monthlyContainer.innerHTML = '';
  const paidMonths = new Set(getPaidMonths(plan));

  for (let monthIndex = 1; monthIndex <= plan.totalMonths; monthIndex += 1) {
    const periodStart = addMonths(startDate, monthIndex - 1);
    const dueDate = addMonths(startDate, monthIndex);
    const periodEnd = addDays(dueDate, -1);
    const monthDays = Math.max(1, daysBetween(periodStart, dueDate));
    const monthElapsed = clamp(daysBetween(periodStart, today), 0, monthDays);
    const isPaid = paidMonths.has(monthIndex);
    const progress = isPaid ? 100 : Math.round((monthElapsed / monthDays) * 100);
    const status = getMonthStatus(today, periodStart, dueDate, isPaid);
    const cardStateClass =
      isPaid
        ? ' is-paid'
        : status.className === 'overdue'
          ? ' is-overdue'
          : status.className === 'current'
            ? ' is-current'
            : '';

    const card = document.createElement('article');
    card.className = `month-card${cardStateClass}`;
    card.innerHTML = `
      <div class="month-card-header">
        <div class="month-card-heading">
          <strong class="month-index">${formatMonthYear(periodStart)}</strong>
          <span class="month-date-label">Período</span>
          <span class="month-date">${formatDate(periodStart)}</span>
        </div>
        <span class="month-status ${status.className}">${status.label}</span>
      </div>
      <div class="month-card-body">
        <div class="month-progress" aria-hidden="true">
          <div class="month-progress-bar" style="width:${progress}%"></div>
        </div>
        <div class="month-card-footer">
          <strong class="month-progress-label">${progress}% desta etapa</strong>
          <span class="month-days">${monthDays} dias previstos</span>
        </div>
      </div>
      <button
        type="button"
        class="month-toggle-btn"
        data-toggle-paid="true"
        data-month-index="${monthIndex}"
      >
        ${isPaid ? 'Desfazer pagamento' : 'Marcar como pago'}
      </button>
    `;

    monthlyContainer.appendChild(card);
  }
}

function getMonthStatus(today, periodStart, dueDate, isPaid) {
  if (isPaid) {
    return { label: 'Pago', className: 'paid' };
  }

  if (today >= dueDate) {
    return { label: 'Não pago', className: 'overdue' };
  }

  if (today >= periodStart && today < dueDate) {
    return { label: 'Aguardando', className: 'current' };
  }

  return { label: 'Aguardando', className: 'pending' };
}

function buildRemainingLabel(remainingMonths) {
  if (remainingMonths === 0) {
    return 'Plano concluído';
  }

  return `${remainingMonths} ${remainingMonths === 1 ? 'mês restante' : 'meses restantes'}`;
}

function buildPlanStatus(completedMonths, totalMonths) {
  if (completedMonths === 0) {
    return 'Aguardando pagamentos';
  }

  if (completedMonths >= totalMonths) {
    return 'Finalizado';
  }

  return 'Pagamentos em andamento';
}

function buildSummaryMessage(planName, completedMonths, totalMonths) {
  if (completedMonths >= totalMonths) {
    return `Tudo certo: todas as ${totalMonths} faturas de "${planName}" foram marcadas como pagas.`;
  }

  const remainingMonths = totalMonths - completedMonths;
  return `Painel atualizado com sucesso. Você marcou ${completedMonths} de ${totalMonths} faturas como pagas e ainda faltam ${remainingMonths}.`;
}

function parseDateInput(value) {
  return normalizeDate(new Date(`${value}T00:00:00`));
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return normalizeDate(result);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return normalizeDate(result);
}

function daysBetween(startDate, endDate) {
  return Math.round((normalizeDate(endDate) - normalizeDate(startDate)) / MS_PER_DAY);
}

function normalizeDate(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';

  if (type) {
    statusMessage.classList.add(type);
  }
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatDateShort(date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

function formatMonthYear(date) {
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}

function formatMonthYearCompact(date) {
  return date.toLocaleDateString('pt-BR', {
    month: '2-digit',
    year: 'numeric'
  });
}

function openCreateModal() {
  createForm.reset();
  setCreateStatus('', '');
  createModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => {
    createPlanNameInput.focus();
  }, 20);
}

function closeCreateModal() {
  createForm.reset();
  setCreateStatus('', '');
  createModal.hidden = true;
  syncModalBodyState();
}

function openEditModal(plan) {
  editingPlanId = plan.id;
  editPlanNameInput.value = plan.name;
  editStartDateInput.value = plan.startDate;
  editTotalMonthsInput.value = String(plan.totalMonths);
  editCountModeInput.value = isValidCountMode(plan.countMode) ? plan.countMode : 'start_month';
  editModalSubtitle.textContent = `Atualize os dados do compromisso "${plan.name}" e salve as alterações.`;
  setEditStatus('', '');
  editModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => {
    editPlanNameInput.focus();
    editPlanNameInput.select();
  }, 20);
}

function closeEditModal() {
  editingPlanId = null;
  editForm.reset();
  setEditStatus('', '');
  editModal.hidden = true;
  syncModalBodyState();
}

function openDeleteModal(plan) {
  pendingDeletePlanId = plan.id;
  deletePlanName.textContent = plan.name;
  deleteModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => {
    confirmDeleteModalBtn.focus();
  }, 20);
}

function closeDeleteModal() {
  pendingDeletePlanId = null;
  deletePlanName.textContent = 'este compromisso';
  deleteModal.hidden = true;
  syncModalBodyState();
}

function openReorderModal() {
  reorderDraftPlanIds = plans.map((plan) => plan.id);
  renderReorderList();
  reorderModal.hidden = false;
  syncModalBodyState();
}

function closeReorderModal() {
  reorderDraftPlanIds = [];
  clearReorderDragState();
  reorderList.innerHTML = '';
  reorderModal.hidden = true;
  syncModalBodyState();
}

function renderReorderList() {
  reorderList.innerHTML = '';

  const orderedPlans = reorderDraftPlanIds
    .map((id) => plans.find((plan) => plan.id === id))
    .filter(Boolean);

  if (orderedPlans.length === 0) {
    reorderList.innerHTML = '<div class="empty-state">Nenhum compromisso disponível para reorganizar no momento.</div>';
    return;
  }

  orderedPlans.forEach((plan, index) => {
    const reorderItem = document.createElement('article');
    reorderItem.className = 'reorder-item';
    reorderItem.dataset.planId = plan.id;
    reorderItem.dataset.planNumber = String(index + 1);
    reorderItem.innerHTML = `
      <button
        type="button"
        class="reorder-drag-handle"
        draggable="true"
        data-reorder-plan-id="${plan.id}"
        aria-label="Arrastar para reordenar ${escapeHtml(plan.name)}"
        title="Arrastar para reordenar"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <span class="reorder-item-number">${String(index + 1).padStart(2, '0')}</span>
      <div class="reorder-item-content">
        <strong class="reorder-item-name">${escapeHtml(plan.name)}</strong>
        <span class="reorder-item-meta">${plan.totalMonths} meses • Início ${formatDate(parseDateInput(plan.startDate))}</span>
      </div>
    `;
    reorderList.appendChild(reorderItem);
  });
}

function syncModalBodyState() {
  document.body.classList.toggle('modal-open', !createModal.hidden || !editModal.hidden || !deleteModal.hidden || !reorderModal.hidden);
}

function setCreateStatus(message, type) {
  if (!message) {
    createStatusMessage.hidden = true;
    createStatusMessage.className = 'status-message';
    return;
  }

  createStatusMessage.hidden = false;
  createStatusMessage.textContent = message;
  createStatusMessage.className = 'status-message';

  if (type) {
    createStatusMessage.classList.add(type);
  }
}

function setEditStatus(message, type) {
  if (!message) {
    editStatusMessage.hidden = true;
    editStatusMessage.className = 'status-message';
    return;
  }

  editStatusMessage.hidden = false;
  editStatusMessage.textContent = message;
  editStatusMessage.className = 'status-message';

  if (type) {
    editStatusMessage.classList.add(type);
  }
}

function getSelectedPlan() {
  return plans.find((plan) => plan.id === selectedPlanId) ?? null;
}

function createPlanId() {
  return `plan-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function savePlans() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

function loadPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    
    return Array.isArray(parsed)
      ? parsed.filter(isValidPlan)
      : [];
  } catch {
    return [];
  }
}

function isValidPlan(plan) {
  return Boolean(
    plan &&
    typeof plan.id === 'string' &&
    typeof plan.name === 'string' &&
    typeof plan.startDate === 'string' &&
    Number.isInteger(plan.totalMonths) &&
    plan.totalMonths > 0 &&
    isValidCountMode(plan.countMode ?? 'start_month') &&
    isValidPaidMonths(plan.paidMonths, plan.totalMonths)
  );
}

function getEffectiveStartDate(startDate, countMode) {
  if (countMode === 'next_month') {
    return addMonths(startDate, 1);
  }

  return startDate;
}

function isValidCountMode(value) {
  return value === 'next_month' || value === 'start_month';
}

function getCountModeLabel(value) {
  if (value === 'next_month') {
    return 'Comeca a partir do proximo mes';
  }

  return 'Comeca no mes informado';
}

function getPaidMonths(plan) {
  return Array.isArray(plan.paidMonths) ? [...plan.paidMonths].sort((a, b) => a - b) : [];
}

function sanitizePaidMonths(paidMonths, totalMonths) {
  if (!Array.isArray(paidMonths)) {
    return [];
  }

  return [...new Set(paidMonths)].filter((month) => Number.isInteger(month) && month >= 1 && month <= totalMonths);
}

function isValidPaidMonths(paidMonths, totalMonths) {
  if (paidMonths == null) {
    return true;
  }

  return sanitizePaidMonths(paidMonths, totalMonths).length === paidMonths.length;
}

function toggleMonthPaid(monthIndex) {
  const selectedPlan = getSelectedPlan();

  if (!selectedPlan) {
    return;
  }

  const paidMonths = new Set(getPaidMonths(selectedPlan));

  if (paidMonths.has(monthIndex)) {
    paidMonths.delete(monthIndex);
  } else {
    paidMonths.add(monthIndex);
  }

  selectedPlan.paidMonths = [...paidMonths].sort((a, b) => a - b);
  savePlans();
  renderPlansList();
  renderPlanDetails(selectedPlan);
}

function deletePlan(planId) {
  const planToDelete = plans.find((plan) => plan.id === planId);

  if (!planToDelete) {
    return;
  }

  plans = plans.filter((plan) => plan.id !== planId);

  if (selectedPlanId === planId) {
    selectedPlanId = plans[0]?.id ?? null;
  }

  if (editingPlanId === planId) {
    closeEditModal();
  }

  savePlans();
  renderPlansList();

  const nextSelectedPlan = getSelectedPlan();

  if (nextSelectedPlan) {
    renderPlanDetails(nextSelectedPlan);
  } else {
    resultsSection.hidden = true;
    updateResultsNavigation();
  }

  setStatus(`O compromisso "${planToDelete.name}" foi excluído com sucesso.`, 'success');
  scrollToSection(plansList);
}

function updateResultsNavigation() {
  const hasSelectedPlan = Boolean(selectedPlanId && getSelectedPlan());

  backToListBtn.disabled = !hasSelectedPlan;
  const mobileResultsButton = mobileOptionsDrawer?.querySelector('[data-mobile-action="results"]');

  if (mobileResultsButton) {
    mobileResultsButton.disabled = !hasSelectedPlan;
  }
}

function openMobileDrawer() {
  if (!mobileOptionsDrawer || !mobileDrawerBackdrop || !mobileMenuBtn) {
    return;
  }

  mobileOptionsDrawer.hidden = false;
  mobileDrawerBackdrop.hidden = false;
  document.body.classList.add('mobile-drawer-open');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
}

function closeMobileDrawer() {
  if (!mobileOptionsDrawer || !mobileDrawerBackdrop || !mobileMenuBtn) {
    return;
  }

  mobileOptionsDrawer.hidden = true;
  mobileDrawerBackdrop.hidden = true;
  document.body.classList.remove('mobile-drawer-open');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

function initializeUpdateCheck(installedVersion = null) {
  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };

  if (!config.bundleManifestUrl) {
    hideUpdateBanner();
    return;
  }

  if (!installedVersion) {
    hideUpdateBanner();
  }

  if (installedVersion) {
    updateBannerHoldUntil = Date.now() + 12000;
  }

  if (config.checkOnStartup) {
    const initialDelayMs = installedVersion ? 12000 : 0;
    window.setTimeout(() => {
      checkForUpdates({ force: true });
    }, initialDelayMs);
  }

  window.addEventListener('online', () => {
    checkForUpdates({ force: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForUpdates({ force: true });
    }
  });

  window.addEventListener('focus', () => {
    checkForUpdates({ force: true });
  });

  if (updateCheckIntervalId) {
    window.clearInterval(updateCheckIntervalId);
  }

  const recheckIntervalMs = Number(config.recheckIntervalMs);

  if (Number.isFinite(recheckIntervalMs) && recheckIntervalMs >= 15000) {
    updateCheckIntervalId = window.setInterval(() => {
      checkForUpdates();
    }, recheckIntervalMs);
  }
}

async function checkForUpdates(options = {}) {
  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };

  if (!config.bundleManifestUrl) {
    hideUpdateBanner();
    return;
  }

  if (isUpdateCheckInFlight) {
    return;
  }

  isUpdateCheckInFlight = true;

  try {
    const currentVersion = getCurrentAppVersion(config);

    cleanupUpdateState(currentVersion);

    const release = await fetchBundleManifest(
      buildManifestUrls(config),
      config.requestTimeoutMs ?? 6000,
      currentVersion
    );

    if (release?.version && isRemoteVersionNewer(release.version, currentVersion)) {
      availableUpdate = release;
      showUpdateBanner(
        `Atualizar interface para ${release.version}`,
        release.notes || 'Uma nova interface foi encontrada. Toque no botão verde para aplicar a atualização sem reinstalar o app.',
        release.version
      );
      return;
    }

    availableUpdate = null;

    if (Date.now() >= updateBannerHoldUntil) {
      hideUpdateBanner();
    }
  } catch (error) {
    availableUpdate = null;

    if (Date.now() >= updateBannerHoldUntil) {
      hideUpdateBanner();
    }
  } finally {
    isUpdateCheckInFlight = false;
  }
}

function buildManifestUrls(config) {
  const urls = [
    config.bundleManifestUrl,
    config.bundleManifestFallbackUrl
  ].filter(Boolean);

  return urls.map((url, index) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}app=${encodeURIComponent(config.currentVersion || defaultUpdateConfig.currentVersion)}&t=${Date.now()}-${index}`;
  });
}

async function fetchBundleManifest(urls, timeoutMs, currentVersion) {
  const responses = await Promise.allSettled(
    urls.map((url) => fetchManifestCandidate(url, timeoutMs))
  );

  const manifests = responses
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
    .filter((manifest) => manifest?.version);

  if (manifests.length === 0) {
    const rejection = responses.find((result) => result.status === 'rejected');
    throw rejection?.reason ?? new Error('Manifesto web indisponível.');
  }

  return manifests.reduce((latest, manifest) => {
    if (!latest) {
      return manifest;
    }

    if (isRemoteVersionNewer(manifest.version, latest.version)) {
      return manifest;
    }

    if (
      currentVersion &&
      latest.version === currentVersion &&
      manifest.version === currentVersion &&
      manifest.bundleFallbackUrl &&
      !latest.bundleFallbackUrl
    ) {
      return manifest;
    }

    return latest;
  }, null);
}

async function fetchManifestCandidate(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Manifesto web indisponível.');
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRemoteVersionNewer(remoteVersion, currentVersion) {
  const remote = remoteVersion.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const current = currentVersion.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const maxLength = Math.max(remote.length, current.length);

  for (let index = 0; index < maxLength; index += 1) {
    const remoteValue = remote[index] ?? 0;
    const currentValue = current[index] ?? 0;

    if (remoteValue > currentValue) {
      return true;
    }

    if (remoteValue < currentValue) {
      return false;
    }
  }

  return false;
}

function showUpdateBanner(title, message, version) {
  if (!updateBanner || !updateBannerTitle || !updateBannerMessage || !updatePrimaryBtn) {
    return;
  }

  updateBanner.hidden = false;
  updateBannerTitle.textContent = title;
  updateBannerMessage.textContent = message;
  updatePrimaryBtn.hidden = false;
  updatePrimaryBtn.textContent = `Atualizar para ${version}`;
}

function showUpdatedBanner(version) {
  if (!updateBanner || !updateBannerTitle || !updateBannerMessage || !updatePrimaryBtn) {
    return;
  }

  updateBanner.hidden = false;
  updateBannerTitle.textContent = `Aplicativo atualizado para ${version}`;
  updateBannerMessage.textContent = 'A nova versão foi instalada com sucesso. Tudo certo para continuar usando o app.';
  updatePrimaryBtn.hidden = true;
}

function hideUpdateBanner() {
  if (!updateBanner || !updatePrimaryBtn) {
    return;
  }

  updateBanner.hidden = true;
  updatePrimaryBtn.hidden = true;
  updatePrimaryBtn.textContent = 'Atualizar app';
}

function announceInstalledUpdate() {
  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };
  const currentVersion = getCurrentAppVersion(config);
  const pendingVersion = localStorage.getItem(PENDING_UPDATE_VERSION_KEY);

  if (!pendingVersion || pendingVersion !== currentVersion) {
    return null;
  }

  localStorage.removeItem(PENDING_UPDATE_VERSION_KEY);
  availableUpdate = null;
  updateBannerHoldUntil = Date.now() + 12000;
  showUpdatedBanner(currentVersion);
  return currentVersion;
}

async function startAppUpdate(update) {
  if (!update?.bundleUrl) {
    return;
  }

  localStorage.setItem(PENDING_UPDATE_VERSION_KEY, update.version || '');

  try {
    const bundle = await fetchBundlePayload(update, window.APP_UPDATE_CONFIG?.currentVersion || defaultUpdateConfig.currentVersion);

    localStorage.setItem(WEB_BUNDLE_STORAGE_KEY, JSON.stringify(bundle));
    location.reload();
  } catch (error) {
    localStorage.removeItem(PENDING_UPDATE_VERSION_KEY);
  }
}

function buildBundleUrls(update, currentVersion) {
  const urls = [
    update.bundleUrl,
    update.bundleFallbackUrl
  ].filter(Boolean);

  return urls.map((url, index) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}target=${encodeURIComponent(update.version || '')}&base=${encodeURIComponent(currentVersion || '')}&t=${Date.now()}-${index}`;
  });
}

async function fetchBundlePayload(update, currentVersion) {
  let lastError = null;

  for (const url of buildBundleUrls(update, currentVersion)) {
    try {
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Bundle web indisponível.');
      }

      const bundle = await response.json();

      if (!bundle?.html || !bundle?.version) {
        throw new Error('Bundle web inválido.');
      }

      if (update.version && bundle.version !== update.version) {
        throw new Error(`Bundle fora de sincronia. Esperado ${update.version} e recebido ${bundle.version}.`);
      }

      return bundle;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('Bundle web indisponível.');
}

function getCurrentAppVersion(config) {
  try {
    const rawBundle = localStorage.getItem(WEB_BUNDLE_STORAGE_KEY);

    if (rawBundle) {
      const parsedBundle = JSON.parse(rawBundle);
      if (parsedBundle?.version && !isRemoteVersionNewer(parsedBundle.version, config.currentVersion || defaultUpdateConfig.currentVersion)) {
        return config.currentVersion || defaultUpdateConfig.currentVersion;
      }
      if (parsedBundle?.version) {
        return parsedBundle.version;
      }
    }
  } catch (_) {}

  return window.APP_UPDATE_CONFIG?.currentVersion || config.currentVersion || defaultUpdateConfig.currentVersion;
}

function cleanupUpdateState(currentVersion) {
  const pendingVersion = localStorage.getItem(PENDING_UPDATE_VERSION_KEY);

  if (pendingVersion && !isRemoteVersionNewer(pendingVersion, currentVersion)) {
    localStorage.removeItem(PENDING_UPDATE_VERSION_KEY);
  }

  try {
    const rawBundle = localStorage.getItem(WEB_BUNDLE_STORAGE_KEY);

    if (!rawBundle) {
      return;
    }

    const bundle = JSON.parse(rawBundle);

    if (!bundle?.html || !bundle?.version) {
      localStorage.removeItem(WEB_BUNDLE_STORAGE_KEY);
    }
  } catch (_) {
    localStorage.removeItem(WEB_BUNDLE_STORAGE_KEY);
  }
}

function openUpdateUrl(url) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function updatePlansSummary(visibleNumber = 0) {
  plansTotalCount.textContent = String(plans.length);
  plansVisibleCount.textContent = String(visibleNumber || 0);
  plansSelectedCount.textContent = String(getSelectedPlanNumber());
}

function updateFocusedPlanCard(visibleNumber = 0) {
  const items = [...plansList.querySelectorAll('.plan-item')];

  items.forEach((item) => {
    const planNumber = Number.parseInt(item.dataset.planNumber ?? '0', 10);
    item.classList.remove('is-focus', 'is-dimmed');

    if (!visibleNumber) {
      return;
    }

    if (planNumber === visibleNumber) {
      item.classList.add('is-focus');
      return;
    }

    item.classList.add('is-dimmed');
  });
}

function getSelectedPlanNumber() {
  if (!selectedPlanId) {
    return 0;
  }

  const selectedIndex = plans.findIndex((plan) => plan.id === selectedPlanId);
  return selectedIndex >= 0 ? selectedIndex + 1 : 0;
}

function getVisiblePlanNumber() {
  const items = [...plansList.querySelectorAll('.plan-item')];

  if (items.length === 0) {
    return 0;
  }

  const listRect = plansList.getBoundingClientRect();
  const listCenter = listRect.top + (listRect.height / 2);
  let nearestItem = items[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.top + (itemRect.height / 2);
    const distance = Math.abs(itemCenter - listCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestItem = item;
    }
  });

  return Number.parseInt(nearestItem.dataset.planNumber ?? '0', 10) || 0;
}

function getReorderInsertTarget(pointerY) {
  const items = [...reorderList.querySelectorAll('.reorder-item:not(.is-dragging)')];

  return items.find((item) => {
    const rect = item.getBoundingClientRect();
    return pointerY < rect.top + (rect.height / 2);
  }) ?? null;
}

function syncReorderNumbersFromDom() {
  [...reorderList.querySelectorAll('.reorder-item')].forEach((item, index) => {
    item.dataset.planNumber = String(index + 1);
    const number = item.querySelector('.reorder-item-number');

    if (number) {
      number.textContent = String(index + 1).padStart(2, '0');
    }
  });
}

function persistReorderDraftFromDom() {
  reorderDraftPlanIds = [...reorderList.querySelectorAll('.reorder-item')]
    .map((item) => item.dataset.planId)
    .filter(Boolean);
}

function getOrderedPlansFromReorderDom() {
  const orderedIds = [...reorderList.querySelectorAll('.reorder-item')]
    .map((item) => item.dataset.planId)
    .filter(Boolean);

  return orderedIds
    .map((id) => plans.find((plan) => plan.id === id))
    .filter(Boolean);
}

function saveReorderFromDom() {
  persistReorderDraftFromDom();
  const orderedPlans = getOrderedPlansFromReorderDom();

  if (orderedPlans.length !== plans.length) {
    renderReorderList();
    setStatus('Não foi possível salvar a nova ordem dos compromissos.', 'error');
    return;
  }

  plans = orderedPlans;
  savePlans();
  renderPlansList();

  const selectedPlan = getSelectedPlan();

  if (selectedPlan) {
    renderPlanDetails(selectedPlan);
  }

  setStatus('Ordem dos compromissos atualizada automaticamente.', 'success');
}

function clearReorderDragState() {
  draggedReorderPlanId = null;
  reorderList.classList.remove('is-reordering');
  [...reorderList.querySelectorAll('.reorder-item')].forEach((item) => {
    item.classList.remove('is-dragging');
  });
}


function scrollToSection(element) {
  if (!element || element.hidden) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
