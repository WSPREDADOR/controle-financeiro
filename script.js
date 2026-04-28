
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const STORAGE_KEY = 'payment-plans-v1';
const USER_NAME_KEY = 'cf-user-name-v1';
const USER_ID_KEY = 'cf-user-id-v1';

const resultsSection = document.getElementById('resultsSection');
const statusMessage = document.getElementById('statusMessage');
const monthlyContainer = document.getElementById('monthlyContainer');
const plansPanel = document.querySelector('.plans-panel');
const currentDate = document.getElementById('currentDate');
const appVersionLabel = document.getElementById('appVersionLabel');
const appExpirationLabel = document.getElementById('appExpirationLabel');
const updateBanner = document.getElementById('updateBanner');
const updateBannerTitle = document.getElementById('updateBannerTitle');
const updateBannerMessage = document.getElementById('updateBannerMessage');
const updatePrimaryBtn = document.getElementById('updatePrimaryBtn');
const updateNativeBtn = document.getElementById('updateNativeBtn');
const updateProgress = document.getElementById('updateProgress');
const updateProgressLabel = document.getElementById('updateProgressLabel');
const updateProgressPercent = document.getElementById('updateProgressPercent');
const updateProgressBar = document.getElementById('updateProgressBar');
const notificationBanner = document.getElementById('notificationBanner');
const notificationBannerTitle = document.getElementById('notificationBannerTitle');
const notificationBannerMessage = document.getElementById('notificationBannerMessage');
const permissionChecklist = document.getElementById('permissionChecklist');
const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');
const dismissNotificationsBtn = document.getElementById('dismissNotificationsBtn');
const openAppSettingsModalBtn = document.getElementById('openAppSettingsModalBtn');
const appSettingsModal = document.getElementById('appSettingsModal');
const closeAppSettingsModalBtn = document.getElementById('closeAppSettingsModalBtn');
const settingsPermissionChecklist = document.getElementById('settingsPermissionChecklist');
const openNativeAppSettingsBtn = document.getElementById('openNativeAppSettingsBtn');
const togglePermissionsBtn = document.getElementById('togglePermissionsBtn');
const appDetailsSection = document.getElementById('appDetailsSection');
const permissionsSection = document.getElementById('permissionsSection');
const settingsAppVersion = document.getElementById('settingsAppVersion');
const settingsAppRelease = document.getElementById('settingsAppRelease');
const contactDevBtn = document.getElementById('contactDevBtn');
const onboardingModal = document.getElementById('onboardingModal');
const userNameInput = document.getElementById('userNameInput');
const saveOnboardingBtn = document.getElementById('saveOnboardingBtn');
const onboardingStatus = document.getElementById('onboardingStatus');
const userGreeting = document.getElementById('userGreeting');
const displayUserName = document.getElementById('displayUserName');
const settingsUserId = document.getElementById('settingsUserId');
const plansList = document.getElementById('plansList');
const selectedPlanTitle = document.getElementById('selectedPlanTitle');
const selectedPlanSubtitle = document.getElementById('selectedPlanSubtitle');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const plansFilterNav = document.getElementById('plansFilterNav');
const openReorderModalBtn = document.getElementById('openReorderModalBtn');
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
const closeDetailsModalBtn = document.getElementById('closeDetailsModalBtn');

// Novos campos financeiros
const createTotalValueInput = document.getElementById('createTotalValue');
const createInstallmentValueInput = document.getElementById('createInstallmentValue');
const editTotalValueInput = document.getElementById('editTotalValue');
const editInstallmentValueInput = document.getElementById('editInstallmentValue');
const toggleSinglePaymentBtn = document.getElementById('toggleSinglePaymentBtn');
const singlePaymentToggleContainer = document.getElementById('singlePaymentToggleContainer');

let isSinglePaymentMode = false;

let plans = loadPlans();
let currentPlanFilter = 'all';
let selectedPlanId = plans[0]?.id ?? null;
let editingPlanId = null;
let pendingDeletePlanId = null;
let reorderDraftPlanIds = [];
let draggedReorderPlanId = null;
let reorderActivePointerId = null;
let reorderActiveDragItem = null;
let reorderAutoScrollFrameId = null;
let reorderAutoScrollPointerY = null;
let reorderSavedOrderSignature = '';
let planFocusFrameId = null;
let availableUpdate = null;
let updateCheckIntervalId = null;
let isUpdateCheckInFlight = false;
let isUpdateInstallInFlight = false;
let updateBannerHoldUntil = 0;
let notificationSyncTimeoutId = null;
let paymentNotificationListenersRegistered = false;
let notificationBannerMode = 'notification';
const PENDING_UPDATE_VERSION_KEY = 'pending-app-update-version';
const WEB_BUNDLE_STORAGE_KEY = 'cf-active-web-bundle';
const MAX_WEB_BUNDLE_CHARS = 1024 * 1024;
const NOTIFICATION_PREFERENCE_KEY = 'payment-notifications-preference-v1';
const NOTIFICATION_RELIABILITY_PROMPT_KEY = 'payment-notifications-reliability-dismissed-v1';
const NOTIFICATION_EXACT_SCREEN_OPENED_KEY = 'payment-notifications-exact-screen-opened-v1';
const NOTIFICATION_BATTERY_SCREEN_OPENED_KEY = 'payment-notifications-battery-screen-opened-v1';
const NOTIFICATION_VENDOR_AUTOSTART_KEY = 'payment-notifications-vendor-autostart-opened-v1';
const NOTIFICATION_VENDOR_LOCKSCREEN_KEY = 'payment-notifications-vendor-lockscreen-opened-v1';
const SCHEDULED_NOTIFICATION_IDS_KEY = 'payment-notification-ids-v1';
const NOTIFICATION_CHANNEL_ID = 'payment-reminders-v2';
const NOTIFICATION_SOUND_FILE = 'payment_reminder.wav';
const PAYMENT_NOTIFICATION_LIMIT = 120;
const PAYMENT_NOTIFICATION_HOUR = 9;

// ─── Armazenamento Persistente (protegido contra limpeza do Android) ───────────
// Usa Capacitor Preferences quando disponível (armazenamento nativo),
// com fallback para localStorage (navegador/desktop).
const Storage = {
  _prefs: () => window.Capacitor?.Plugins?.Preferences ?? null,

  async get(key) {
    try {
      const prefs = this._prefs();
      if (prefs) {
        const result = await prefs.get({ key });
        return result?.value ?? null;
      }
    } catch (_) {}
    return localStorage.getItem(key);
  },

  async set(key, value) {
    try {
      const prefs = this._prefs();
      if (prefs) {
        await prefs.set({ key, value });
        // Mantém localStorage como espelho para compatibilidade
        localStorage.setItem(key, value);
        return;
      }
    } catch (_) {}
    localStorage.setItem(key, value);
  },

  async remove(key) {
    try {
      const prefs = this._prefs();
      if (prefs) {
        await prefs.remove({ key });
      }
    } catch (_) {}
    localStorage.removeItem(key);
  },

  // Migra dados do localStorage para Preferences (executa uma vez)
  async migrate(key) {
    try {
      const prefs = this._prefs();
      if (!prefs) return;
      const existing = await prefs.get({ key });
      if (!existing?.value) {
        const local = localStorage.getItem(key);
        if (local) {
          await prefs.set({ key, value: local });
        }
      }
    } catch (_) {}
  }
};
const defaultUpdateConfig = {
  currentVersion: '1.9.4',
  bundleManifestUrl: 'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-manifest.json',
  bundleManifestFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-manifest.json',
  releaseApiUrl: 'https://api.github.com/repos/WSPREDADOR/controle-financeiro/releases/latest',
  checkOnStartup: true,
  requestTimeoutMs: 6000,
  recheckIntervalMs: 45000
};

currentDate.textContent = formatDate(normalizeDate(new Date()));
updateDisplayedAppVersion();
renderPlansList();
updateResultsNavigation();

// Migra dados do localStorage para armazenamento nativo (executa em background)
(async () => {
  await Storage.migrate(STORAGE_KEY);
  await Storage.migrate(NOTIFICATION_PREFERENCE_KEY);
  await Storage.migrate(PENDING_UPDATE_VERSION_KEY);
  await Storage.migrate(USER_NAME_KEY);
  await Storage.migrate(USER_ID_KEY);

  await checkOnboarding();

  // Recarrega planos do armazenamento nativo (pode ter dados mais recentes)
  const migratedPlans = await loadPlansAsync();
  if (migratedPlans.length > 0 && plans.length === 0) {
    plans = migratedPlans;
    selectedPlanId = plans[0]?.id ?? null;
    renderPlansList();
    if (selectedPlanId) {
      renderPlanDetails(getSelectedPlan(), { resetTimelineScroll: true });
    }
  }
})();


if (selectedPlanId) {
  renderPlanDetails(getSelectedPlan(), { resetTimelineScroll: true });
}

const installedUpdateVersion = announceInstalledUpdate();
initializeUpdateCheck(installedUpdateVersion);
initializePaymentNotifications();

createForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const planType = document.querySelector('input[name="createPlanType"]:checked')?.value || 'debt';
  const isExpense = planType === 'expense';

  const planName = createPlanNameInput.value.trim();
  const startInput = createStartDateInput.value;
  let monthsInput, countMode;

  if (isExpense) {
    monthsInput = 1200; // 100 years para simular continuo
    countMode = 'start_month';
  } else if (isSinglePaymentMode) {
    monthsInput = 1;
    countMode = 'start_month';
  } else {
    monthsInput = Number.parseInt(createTotalMonthsInput.value, 10);
    countMode = createCountModeInput.value;
    if (Number.isNaN(monthsInput) || monthsInput <= 0) {
      setCreateStatus('Preencha o nome do compromisso, uma data válida e um total de meses maior que zero.', 'error');
      return;
    }
  }

  if (!planName || !startInput) {
    setCreateStatus('Preencha o nome do compromisso e uma data de início.', 'error');
    return;
  }

  const nextPlan = {
    id: createPlanId(),
    name: planName,
    startDate: startInput,
    totalMonths: monthsInput,
    countMode: isValidCountMode(countMode) ? countMode : 'start_month',
    isExpense: isExpense,
    isSinglePayment: isSinglePaymentMode,
    totalValue: parseCurrencyToNumber(createTotalValueInput?.value),
    installmentValue: parseCurrencyToNumber(createInstallmentValueInput?.value),
    manualMonthValues: {},
    paidMonths: []
  };

  plans.unshift(nextPlan);

  selectedPlanId = nextPlan.id;
  savePlans();
  renderPlansList();
  renderPlanDetails(nextPlan, { resetTimelineScroll: true });
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
    renderPlanDetails(planToEdit, { resetTimelineScroll: true });
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
  openDetailsModal(selectedPlan, { resetTimelineScroll: true });
  setStatus(`Exibindo os cálculos de "${selectedPlan.name}".`, 'success');
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
  schedulePlanFocusUpdate();
});

window.addEventListener('resize', () => {
  schedulePlanFocusUpdate();
});

const REORDER_AUTO_SCROLL_EDGE = 68;
const REORDER_AUTO_SCROLL_MAX_STEP = 18;

function handleReorderStart(id, element, pointerId = null) {
  draggedReorderPlanId = id;
  reorderActivePointerId = pointerId;
  reorderActiveDragItem = element;
  element.classList.add('is-dragging');
  reorderList.classList.add('is-reordering');
}

function getReorderDragItemFromTarget(target) {
  return target instanceof Element
    ? target.closest('.reorder-item')
    : null;
}

function autoScrollReorderList(clientY) {
  if (reorderList.scrollHeight <= reorderList.clientHeight) {
    return 0;
  }

  const rect = reorderList.getBoundingClientRect();
  let scrollStep = 0;

  if (clientY < rect.top + REORDER_AUTO_SCROLL_EDGE) {
    const distance = rect.top + REORDER_AUTO_SCROLL_EDGE - clientY;
    scrollStep = -Math.ceil((distance / REORDER_AUTO_SCROLL_EDGE) * REORDER_AUTO_SCROLL_MAX_STEP);
  } else if (clientY > rect.bottom - REORDER_AUTO_SCROLL_EDGE) {
    const distance = clientY - (rect.bottom - REORDER_AUTO_SCROLL_EDGE);
    scrollStep = Math.ceil((distance / REORDER_AUTO_SCROLL_EDGE) * REORDER_AUTO_SCROLL_MAX_STEP);
  }

  if (scrollStep !== 0) {
    reorderList.scrollTop += scrollStep;
  }

  return scrollStep;
}

function scheduleReorderAutoScroll(clientY) {
  reorderAutoScrollPointerY = clientY;

  if (reorderAutoScrollFrameId) {
    return;
  }

  const tick = () => {
    reorderAutoScrollFrameId = null;

    if (!draggedReorderPlanId || reorderAutoScrollPointerY === null) {
      return;
    }

    const scrollStep = autoScrollReorderList(reorderAutoScrollPointerY);

    if (scrollStep !== 0) {
      handleReorderMove(reorderAutoScrollPointerY);
      reorderAutoScrollFrameId = window.requestAnimationFrame(tick);
    }
  };

  reorderAutoScrollFrameId = window.requestAnimationFrame(tick);
}

function stopReorderAutoScroll() {
  if (reorderAutoScrollFrameId) {
    window.cancelAnimationFrame(reorderAutoScrollFrameId);
  }

  reorderAutoScrollFrameId = null;
  reorderAutoScrollPointerY = null;
}

function handleReorderMove(clientY) {
  if (!draggedReorderPlanId) return;
  const draggedItem = reorderList.querySelector(`.reorder-item[data-plan-id="${draggedReorderPlanId}"]`);
  if (!draggedItem) return;

  const nextItem = getReorderInsertTarget(clientY);
  if (!nextItem) {
    reorderList.appendChild(draggedItem);
  } else if (nextItem !== draggedItem) {
    reorderList.insertBefore(draggedItem, nextItem);
  }
  syncReorderNumbersFromDom();
}

function handleReorderEnd() {
  if (!draggedReorderPlanId) return;
  saveReorderFromDom({ silentWhenUnchanged: true });
  clearReorderDragState();
}

reorderList.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;

  const dragItem = getReorderDragItemFromTarget(event.target);
  if (!dragItem?.dataset.planId) return;

  handleReorderStart(dragItem.dataset.planId, dragItem, event.pointerId);
  dragItem.setPointerCapture?.(event.pointerId);
  event.preventDefault();
});

reorderList.addEventListener('pointermove', (event) => {
  if (event.pointerId !== reorderActivePointerId || !draggedReorderPlanId) return;

  autoScrollReorderList(event.clientY);
  scheduleReorderAutoScroll(event.clientY);
  handleReorderMove(event.clientY);
  event.preventDefault();
});

function finishReorderPointerDrag(event) {
  if (event.pointerId !== reorderActivePointerId) return;

  if (reorderActiveDragItem?.hasPointerCapture?.(event.pointerId)) {
    reorderActiveDragItem.releasePointerCapture(event.pointerId);
  }

  handleReorderEnd();
  event.preventDefault();
}

reorderList.addEventListener('pointerup', finishReorderPointerDrag);
reorderList.addEventListener('pointercancel', finishReorderPointerDrag);


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
  const totalVal = parseCurrencyToNumber(editTotalValueInput?.value);
  const instVal = parseCurrencyToNumber(editInstallmentValueInput?.value);

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
    paidMonths: sanitizePaidMonths(existingPlan.paidMonths ?? [], monthsInput),
    totalValue: totalVal,
    installmentValue: instVal,
    isSinglePayment: isSinglePaymentMode,
  };

  plans[existingPlanIndex] = updatedPlan;
  selectedPlanId = updatedPlan.id;
  savePlans();
  renderPlansList();
  renderPlanDetails(updatedPlan, { resetTimelineScroll: true });
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

closeDetailsModalBtn.addEventListener('click', () => {
  closeDetailsModal();
});

openAppSettingsModalBtn?.addEventListener('click', () => {
  openAppSettingsModal();
});

closeAppSettingsModalBtn?.addEventListener('click', () => {
  closeAppSettingsModal();
});

openNativeAppSettingsBtn?.addEventListener('click', async () => {
  await getNotificationPermissionsPlugin()?.openAppSettings?.();
});

togglePermissionsBtn?.addEventListener('click', () => {
  const showingPermissions = !permissionsSection.hidden;
  
  if (showingPermissions) {
    permissionsSection.hidden = true;
    appDetailsSection.hidden = false;
    togglePermissionsBtn.textContent = 'Permissões';
    togglePermissionsBtn.classList.remove('btn-secondary');
    togglePermissionsBtn.classList.add('btn-primary');
  } else {
    appDetailsSection.hidden = true;
    permissionsSection.hidden = false;
    togglePermissionsBtn.textContent = 'Voltar aos Detalhes';
    togglePermissionsBtn.classList.remove('btn-primary');
    togglePermissionsBtn.classList.add('btn-secondary');
  }
});

contactDevBtn?.addEventListener('click', async () => {
  const phone = '5594992592305'; 
  const name = (await Storage.get(USER_NAME_KEY)) || '(seu nome aqui)';
  const message = encodeURIComponent(`Olá Sr Werbert Silva, me chamo ${name}, vim através do seu app Controle de Dívidas!`);
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
});

// ─── Onboarding e Identidade do Usuário ──────────────────────────────────────
function generateSupportId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const gen = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `CF-${gen()}-${gen()}`;
}

async function checkOnboarding() {
  const name = await Storage.get(USER_NAME_KEY);
  let id = await Storage.get(USER_ID_KEY);

  if (!id) {
    id = generateSupportId();
    await Storage.set(USER_ID_KEY, id);
  }

  if (!name) {
    onboardingModal.hidden = false;
    document.body.classList.add('modal-open');
    window.setTimeout(() => {
      userNameInput?.focus();
    }, 100);
    return;
  }

  updateUserInfoUI(name, id);
}

function updateUserInfoUI(name, id) {
  document.querySelectorAll('.display-user-name-placeholder').forEach((el) => {
    el.textContent = name;
  });
  if (displayUserName) displayUserName.textContent = name;
  if (userGreeting) userGreeting.hidden = false;
  if (settingsUserId) settingsUserId.textContent = id;
}

saveOnboardingBtn?.addEventListener('click', async () => {
  const name = userNameInput.value.trim();
  if (!name) {
    onboardingStatus.hidden = false;
    return;
  }

  await Storage.set(USER_NAME_KEY, name);
  const id = await Storage.get(USER_ID_KEY);
  updateUserInfoUI(name, id);
  
  onboardingModal.hidden = true;
  document.body.classList.remove('modal-open');
});

userNameInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveOnboardingBtn?.click();
  }
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

appSettingsModal?.addEventListener('click', (event) => {
  if (event.target === appSettingsModal) {
    closeAppSettingsModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !createModal.hidden) {
    closeCreateModal();
    return;
  }

  if (event.key === 'Escape' && !editModal.hidden) {
    closeEditModal();
    return;
  }

  if (event.key === 'Escape' && !deleteModal.hidden) {
    closeDeleteModal();
    return;
  }

  if (event.key === 'Escape' && !reorderModal.hidden) {
    closeReorderModal();
    return;
  }

  if (event.key === 'Escape' && appSettingsModal && !appSettingsModal.hidden) {
    closeAppSettingsModal();
    return;
  }

  if (event.key === 'Escape' && !resultsSection.hidden) {
    closeDetailsModal();
  }

});

if (window.Capacitor?.Plugins?.App) {
  window.Capacitor.Plugins.App.addListener('backButton', () => {
    if (!createModal.hidden) {
      closeCreateModal();
    } else if (!editModal.hidden) {
      closeEditModal();
    } else if (!deleteModal.hidden) {
      closeDeleteModal();
    } else if (!reorderModal.hidden) {
      closeReorderModal();
    } else if (appSettingsModal && !appSettingsModal.hidden) {
      closeAppSettingsModal();
    } else if (!resultsSection.hidden) {
      closeDetailsModal();
    } else {
      window.Capacitor.Plugins.App.exitApp();
    }
  });

  window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
    if (state?.isActive) {
      queuePaymentNotificationSync();
    }
  });
}

plansFilterNav?.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    plansFilterNav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentPlanFilter = event.target.dataset.filter;
    renderPlansList();
  }
});

const debtSpecificFields = document.getElementById('debtSpecificFields');
const createStartDateLabel = document.getElementById('createStartDateLabel');
document.querySelectorAll('input[name="createPlanType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'expense') {
      debtSpecificFields.style.display = 'none';
      createTotalMonthsInput.removeAttribute('required');
      createCountModeInput.removeAttribute('required');
      createPlanNameInput.placeholder = 'Ex.: Conta de energia, Internet';
      if (createStartDateLabel) createStartDateLabel.textContent = 'Data de pagamento';
    } else {
      debtSpecificFields.style.display = 'contents';
      createTotalMonthsInput.setAttribute('required', 'required');
      createCountModeInput.setAttribute('required', 'required');
      createPlanNameInput.placeholder = 'Ex.: Parcelas da moto ou Energia';
      if (createStartDateLabel) createStartDateLabel.textContent = 'Data de início';
    }
  });
});

updatePrimaryBtn?.addEventListener('click', () => {
  if (updateBannerTitle?.textContent === 'Instalador encontrado!') {
    installLocalApk();
    return;
  }

  if (availableUpdate?.apkUrl) {
    startApkUpdate(availableUpdate);
    return;
  }

  if (availableUpdate?.bundleUrl) {
    startAppUpdate(availableUpdate);
  }
});

enableNotificationsBtn?.addEventListener('click', () => {
  handleNotificationBannerPrimaryAction();
});

dismissNotificationsBtn?.addEventListener('click', () => {
  if (notificationBannerMode === 'reliability') {
    localStorage.setItem(NOTIFICATION_RELIABILITY_PROMPT_KEY, 'dismissed');
  } else {
    localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'dismissed');
  }

  hideNotificationBanner();
});

permissionChecklist?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-permission-action]');

  if (!button) {
    return;
  }

  openPermissionAction(button.dataset.permissionAction);
});

settingsPermissionChecklist?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-permission-action]');

  if (!button) {
    return;
  }

  openPermissionAction(button.dataset.permissionAction);
});

function renderPlanDetails(plan, options = {}) {
  if (!plan) {
    closeDetailsModal();
    return;
  }

  const shouldShowDetails = Boolean(options.openDetails || !resultsSection.hidden);
  const today = normalizeDate(new Date());
  const startDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
  const endDate = addMonths(effectiveStartDate, plan.totalMonths);
  const totalDays = Math.max(1, daysBetween(effectiveStartDate, endDate));
  const paidMonths = getPaidMonths(plan);
  const completedMonths = paidMonths.length;
  const remainingMonths = Math.max(plan.totalMonths - completedMonths, 0);
  // Lógica de pontuações e porcentagens nos valores
  const financials = calculatePlanFinancials(plan);
  const percent = financials.progressPercent;
  const remainingLabel = buildRemainingLabel(remainingMonths);

  selectedPlanTitle.textContent = plan.name;
  selectedPlanSubtitle.textContent = `Cálculo individual do compromisso "${plan.name}".`;
  resultsSection.hidden = !shouldShowDetails;

  const isExpense = Boolean(plan.isExpense);
  resultsSection.classList.toggle('is-expense-mode', isExpense);

  document.getElementById('summaryStart').textContent = formatDate(effectiveStartDate);

  if (isExpense) {
    document.getElementById('planStatus').textContent = 'Despesa Contínua';
    document.getElementById('completedMonths').textContent = `${completedMonths}`;
    document.getElementById('summaryPaidValue').textContent = formatCurrency(financials.totalPaid);
    document.getElementById('summaryRemainingValue').parentElement.style.display = 'none';
  } else {
    document.getElementById('percentage').textContent = `${percent}%`;
    document.getElementById('remainingTime').textContent = remainingLabel;
    document.getElementById('completedMonths').textContent = `${completedMonths}/${plan.totalMonths}`;
    document.getElementById('summaryMonths').textContent = String(plan.totalMonths);
    document.getElementById('summaryDays').textContent = `${totalDays} dias no total`;
    document.getElementById('summaryEnd').textContent = formatDate(endDate);
    document.getElementById('planStatus').textContent = buildPlanStatus(completedMonths, plan.totalMonths);
    document.getElementById('countModeLabel').textContent = getCountModeLabel(plan.countMode);
    document.getElementById('progressFill').style.width = `${percent}%`;

    document.getElementById('summaryPaidValue').textContent = formatCurrency(financials.totalPaid);
    document.getElementById('summaryRemainingValue').textContent = formatCurrency(financials.remainingValue);
    document.getElementById('summaryRemainingValue').parentElement.style.display = 'flex';
  }

  renderMonthlyTimeline(plan, effectiveStartDate, today, options);

  updateResultsNavigation();

  if (shouldShowDetails) {
    syncModalBodyState();
  }
}

function renderPlansList() {
  plansList.innerHTML = '';

  const filteredPlans = getFilteredPlans();

  if (filteredPlans.length === 0) {
    plansList.innerHTML = `
      <div class="empty-state">
        ${plans.length === 0 ? 'Nenhum compromisso salvo ainda. Cadastre algo como parcelas da moto, do carro ou da casa.' : 'Nenhum compromisso encontrado para este filtro.'}
      </div>
    `;
    if (plans.length === 0) closeDetailsModal();
    updatePlansSummary(0);
    updateResultsNavigation();
    return;
  }

  filteredPlans.forEach((plan, index) => {
    const planStartDate = parseDateInput(plan.startDate);
    const planEndDate = addMonths(getEffectiveStartDate(planStartDate, plan.countMode), plan.totalMonths);
    const financials = calculatePlanFinancials(plan);
    const progressRatio = financials.progressRatio;
    const progressPercent = financials.progressPercent;
    const paidMonthsCount = getPaidMonths(plan).length;
    const currentInstallment = plan.manualMonthValues?.[paidMonthsCount + 1] || plan.installmentValue || 0;
    const valueDisplay = currentInstallment > 0 ? `<div class="plan-item-value" style="font-family: 'Space Grotesk'; color: var(--primary); font-weight: 700; font-size: 0.95rem; white-space: nowrap;">${formatCurrencyRaw(currentInstallment)}</div>` : '';

    const item = document.createElement('div');
    item.className = `plan-entry${plan.isExpense ? ' is-expense-entry' : ''}`;
    item.dataset.planNumber = String(index + 1);
    item.dataset.planId = plan.id;
    item.innerHTML = `
      <article class="plan-item${plan.id === selectedPlanId ? ' active' : ''}" style="--plan-progress:${progressRatio};" data-plan-number="${String(index + 1)}" data-plan-id="${plan.id}">
        <button type="button" class="plan-select-btn" data-plan-id="${plan.id}">
          <div class="plan-item-head">
            <span class="plan-item-tag">${String(index + 1).padStart(2, '0')}</span>
            <span class="plan-duration-pill">${plan.isExpense ? 'Despesa' : `${plan.totalMonths} ${plan.totalMonths === 1 ? 'mês' : 'meses'}`}</span>
          </div>
          <div class="plan-item-main-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 6px; gap: 12px;">
            <strong class="plan-item-name" style="margin: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(plan.name)}</strong>
            ${valueDisplay}
          </div>

          <div class="plan-progress-meta">
            <span class="plan-progress-label">Andamento</span>

          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
            <div class="plan-progress" aria-hidden="true" style="flex: 1; margin: 0; ${plan.isExpense ? 'opacity: 0.2;' : ''}">
            <span class="plan-progress-fill" ${plan.isExpense ? 'style="width: 100%; background: var(--text-muted);"' : ''}></span>
            </div>
            <strong class="plan-progress-value" style="font-size: 0.85rem; min-width: 35px; text-align: right;">${plan.isExpense ? '∞' : `${progressPercent}%`}</strong>
          </div>
          <div class="plan-stat-grid">
            <div class="plan-stat-card">
              <span class="plan-stat-label">Início</span>
              <strong class="plan-stat-value">${formatDateShort(planStartDate)}</strong>
            </div>
            <div class="plan-stat-card">
              <span class="plan-stat-label">Pagos</span>
              <strong class="stat-value">${plan.isExpense ? paidMonthsCount : `${paidMonthsCount}/${plan.totalMonths}`}</strong>
            </div>
            <div class="plan-stat-card plan-stat-card-end">
              <span class="plan-stat-label">Fim</span>
              <strong class="plan-stat-value">${plan.isExpense ? 'Livre' : formatMonthYearCompact(planEndDate)}</strong>
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
  schedulePlanFocusUpdate();
}

function renderMonthlyTimeline(plan, startDate, today, options = {}) {
  monthlyContainer.innerHTML = '';
  const paidMonths = new Set(getPaidMonths(plan));
  
  const diffMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
  const elapsedMonths = Math.max(0, diffMonths);
  const displayMonths = plan.isExpense ? Math.min(plan.totalMonths, elapsedMonths + 12) : plan.totalMonths;

  for (let monthIndex = 1; monthIndex <= displayMonths; monthIndex += 1) {
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

    const manualValue = plan.manualMonthValues?.[monthIndex];
    const displayValue = manualValue !== undefined ? manualValue : (plan.installmentValue || 0);
    const valueHtml = displayValue > 0 ? `
      <div class="installment-value-row">
        <span class="installment-amount-display">R$ ${displayValue.toFixed(2)}</span>
        <button type="button" class="edit-installment-btn" data-edit-value-month="${monthIndex}" title="Editar valor desta parcela">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    ` : '';

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
        ${valueHtml}
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

  if (options.resetTimelineScroll) {
    // On narrow screens the timeline becomes a horizontal scroller.
    // Resetting it keeps the first visible card aligned with the plan start month.
    monthlyContainer.scrollLeft = 0;
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
  const defaultRadio = document.querySelector('input[name="createPlanType"][value="debt"]');
  if (defaultRadio) {
    defaultRadio.checked = true;
    defaultRadio.dispatchEvent(new Event('change'));
  }
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

function openDetailsModal(plan, options = {}) {
  if (!plan) {
    return;
  }

  renderPlanDetails(plan, { ...options, openDetails: true });
  resultsSection.hidden = false;
  syncModalBodyState();

  window.setTimeout(() => {
    closeDetailsModalBtn?.focus();
  }, 20);
}

function closeDetailsModal() {
  resultsSection.hidden = true;
  syncModalBodyState();
}

function openEditModal(plan) {
  editingPlanId = plan.id;
  editPlanNameInput.value = plan.name;
  editStartDateInput.value = plan.startDate;
  editTotalMonthsInput.value = String(plan.totalMonths);
  editCountModeInput.value = isValidCountMode(plan.countMode) ? plan.countMode : 'start_month';
  editTotalValueInput.value = plan.totalValue > 0 ? formatCurrencyRaw(plan.totalValue) : '';
  editInstallmentValueInput.value = plan.installmentValue > 0 ? formatCurrencyRaw(plan.installmentValue) : '';
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
  reorderSavedOrderSignature = getPlanOrderSignature(plans);
  renderReorderList();
  reorderModal.hidden = false;
  syncModalBodyState();
}

function closeReorderModal() {
  reorderDraftPlanIds = [];
  reorderSavedOrderSignature = '';
  clearReorderDragState();
  reorderList.innerHTML = '';
  reorderModal.hidden = true;
  syncModalBodyState();
}

async function openAppSettingsModal() {
  if (!appSettingsModal) {
    return;
  }

  appDetailsSection.hidden = false;
  permissionsSection.hidden = true;
  togglePermissionsBtn.textContent = 'Permissões';
  togglePermissionsBtn.classList.remove('btn-secondary');
  togglePermissionsBtn.classList.add('btn-primary');

  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };
  if (settingsAppVersion) settingsAppVersion.textContent = `v${getCurrentAppVersion(config)}`;
  if (settingsAppRelease) settingsAppRelease.textContent = config.expirationDate || '28/04/2026';

  appSettingsModal.hidden = false;
  syncModalBodyState();
  await refreshSettingsPermissionChecklist();
  window.setTimeout(() => {
    closeAppSettingsModalBtn?.focus();
  }, 20);
}

function closeAppSettingsModal() {
  if (!appSettingsModal) {
    return;
  }

  appSettingsModal.hidden = true;
  syncModalBodyState();
}

async function refreshSettingsPermissionChecklist() {
  if (!settingsPermissionChecklist) {
    return;
  }

  const needs = await getPaymentReliabilityNeeds(getLocalNotificationsPlugin(), {
    respectOpenedFlags: false
  });
  renderPermissionChecklist(settingsPermissionChecklist, needs);
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
    reorderItem.setAttribute('aria-label', `Arrastar para reordenar ${plan.name}`);
    reorderItem.innerHTML = `
      <span class="reorder-drag-handle" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </span>
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
  document.body.classList.toggle(
    'modal-open',
    !createModal.hidden ||
      !editModal.hidden ||
      !deleteModal.hidden ||
      !reorderModal.hidden ||
      Boolean(appSettingsModal && !appSettingsModal.hidden) ||
      !resultsSection.hidden
  );
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

function getFilteredPlans() {
  if (currentPlanFilter === 'debt') {
    return plans.filter((plan) => !plan.isExpense);
  }

  if (currentPlanFilter === 'expense') {
    return plans.filter((plan) => plan.isExpense);
  }

  return plans;
}

function createPlanId() {
  return `plan-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function savePlans() {
  const data = JSON.stringify(plans);
  Storage.set(STORAGE_KEY, data); // persiste nativamente no Android
  queuePaymentNotificationSync();
}

async function loadPlansAsync() {
  try {
    // Migra dados existentes do localStorage para Preferences
    await Storage.migrate(STORAGE_KEY);
    const raw = await Storage.get(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidPlan) : [];
  } catch {
    return [];
  }
}

function loadPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidPlan) : [];
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

  const wasDetailsOpen = !resultsSection.hidden;
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
    renderPlanDetails(nextSelectedPlan, {
      resetTimelineScroll: true,
      openDetails: wasDetailsOpen
    });
  } else {
    closeDetailsModal();
    updateResultsNavigation();
  }

  setStatus(`O compromisso "${planToDelete.name}" foi excluído com sucesso.`, 'success');
  scrollToSection(plansList);
}

function updateResultsNavigation() {
}

function updateDisplayedAppVersion() {
  if (!appVersionLabel) {
    return;
  }

  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };
  const version = getCurrentAppVersion(config);
  appVersionLabel.textContent = `v${version}`;

  if (appExpirationLabel) {
    const expiration = config.expirationDate || '21/04/2026';
    appExpirationLabel.textContent = expiration;
  }
}

async function initializePaymentNotifications() {
  if (!notificationBanner || !enableNotificationsBtn || !dismissNotificationsBtn) {
    return;
  }

  const plugin = getLocalNotificationsPlugin();

  if (!plugin) {
    hideNotificationBanner();
    return;
  }

  try {
    const permission = await getPaymentNotificationPermissionState();

    if (permission === 'granted') {
      localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'enabled');
      await createPaymentNotificationChannel();
      await showPaymentReliabilityPromptIfNeeded(plugin);
      queuePaymentNotificationSync();
      registerPaymentNotificationListeners();
      return;
    }

    if (localStorage.getItem(NOTIFICATION_PREFERENCE_KEY) === 'dismissed') {
      hideNotificationBanner();
      return;
    }

    showNotificationBanner(
      'Ativar notificações de pagamento',
      'Receba um aviso quando chegar o mês de pagar um compromisso ainda pendente.',
      true,
      'notification',
      'Ativar notificações'
    );
  } catch (_) {
    hideNotificationBanner();
  }
}

function handleNotificationBannerPrimaryAction() {
  if (notificationBannerMode === 'reliability') {
    requestAndSyncPaymentReliabilityAccess();
    return;
  }

  enablePaymentNotifications();
}

async function enablePaymentNotifications() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin) {
    setStatus('Notificações locais não estão disponíveis neste dispositivo.', 'error');
    return;
  }

  enableNotificationsBtn.disabled = true;
  enableNotificationsBtn.textContent = 'Ativando...';

  try {
    const permission = await requestPaymentNotificationPermission();

    if (permission !== 'granted') {
      localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'denied');
      showNotificationBanner(
        'Permissão de notificação bloqueada',
        'Ative as notificações nas configurações do app para receber lembretes de pagamento.',
        true,
        'notification',
        'Ativar notificações'
      );
      setStatus('Não foi possível ativar os lembretes porque a permissão de notificação não foi concedida.', 'error');
      return;
    }

    localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'enabled');
    await createPaymentNotificationChannel();
    await requestPaymentReliabilityAccess(plugin);
    const scheduledCount = await syncPaymentNotifications();
    registerPaymentNotificationListeners();
    showNotificationBanner(
      'Notificações ativadas',
      scheduledCount > 0
        ? `${scheduledCount} lembretes de pagamento foram programados.`
        : 'Tudo pronto. Os próximos compromissos pendentes serão lembrados automaticamente.',
      false,
      'notification'
    );
    setStatus('Notificações de pagamento ativadas com sucesso.', 'success');
    window.setTimeout(() => hideNotificationBanner(), 3600);
  } catch (_) {
    setStatus('Não foi possível ativar as notificações agora. Tente novamente em alguns instantes.', 'error');
  } finally {
    enableNotificationsBtn.disabled = false;
    enableNotificationsBtn.textContent = 'Ativar notificações';
  }
}

function getLocalNotificationsPlugin() {
  return window.Capacitor?.Plugins?.LocalNotifications ?? null;
}

function getNotificationPermissionsPlugin() {
  return window.Capacitor?.Plugins?.NotificationPermissions ?? null;
}

function getFilesystemPlugin() {
  return window.Capacitor?.Plugins?.Filesystem ?? null;
}

async function getPaymentNotificationPermissionState() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin?.checkPermissions) {
    return 'denied';
  }

  const permission = await plugin.checkPermissions();
  return permission?.display ?? 'denied';
}

async function requestPaymentNotificationPermission() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin?.requestPermissions) {
    return 'denied';
  }

  const permission = await plugin.requestPermissions();
  return permission?.display ?? 'denied';
}

async function createPaymentNotificationChannel() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin?.createChannel) {
    return;
  }

  try {
    await plugin.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Lembretes de pagamento',
      description: 'Avisos sonoros mensais dos compromissos pendentes.',
      importance: 4,
      visibility: 1,
      sound: NOTIFICATION_SOUND_FILE,
      lights: true,
      lightColor: '#55d4cb',
      vibration: true
    });
  } catch (_) {}
}

async function requestPaymentReliabilityAccess(plugin) {
  const needs = await getPaymentReliabilityNeeds(plugin);

  if (needs.exactAlarm) {
    await requestExactNotificationAccess(plugin);
    return;
  }

  if (needs.batteryOptimization) {
    await requestBatteryOptimizationAccess();
    return;
  }

  if (needs.vendorAutostart) {
    await requestVendorAutostartAccess();
    return;
  }

  if (needs.vendorLockScreen) {
    await requestVendorLockScreenAccess();
  }
}

async function requestAndSyncPaymentReliabilityAccess() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin) {
    setStatus('Notificações locais não estão disponíveis neste dispositivo.', 'error');
    return;
  }

  enableNotificationsBtn.disabled = true;
  enableNotificationsBtn.textContent = 'Abrindo...';

  try {
    localStorage.removeItem(NOTIFICATION_RELIABILITY_PROMPT_KEY);
    await openNextPermissionStep(plugin);
    const scheduledCount = await syncPaymentNotifications();
    await showPaymentReliabilityPromptIfNeeded(plugin);

    setStatus(
      scheduledCount > 0
        ? `${scheduledCount} lembretes foram reprogramados com as permissões atuais.`
        : 'Permissões revisadas. Os próximos lembretes serão programados automaticamente.',
      'success'
    );
  } catch (_) {
    setStatus('Não foi possível abrir os ajustes de permissões agora.', 'error');
  } finally {
    enableNotificationsBtn.disabled = false;
    enableNotificationsBtn.textContent = 'Ajustar permissões';
  }
}

async function openNextPermissionStep(plugin) {
  const needs = await getPaymentReliabilityNeeds(plugin);

  if (needs.notification) {
    await enablePaymentNotifications();
    return;
  }

  if (needs.exactAlarm) {
    await openPermissionAction('exact');
    return;
  }

  if (needs.batteryOptimization) {
    await openPermissionAction('battery');
    return;
  }

  if (needs.vendorAutostart) {
    await openPermissionAction('autostart');
    return;
  }

  if (needs.vendorLockScreen) {
    await openPermissionAction('lockscreen');
  }
}

async function showPaymentReliabilityPromptIfNeeded(plugin) {
  if (localStorage.getItem(NOTIFICATION_RELIABILITY_PROMPT_KEY) === 'dismissed') {
    hideNotificationBanner();
    return false;
  }

  const needs = await getPaymentReliabilityNeeds(plugin);
  renderPermissionChecklist(permissionChecklist, needs);

  if (!needs.notification && !needs.exactAlarm && !needs.batteryOptimization && !needs.vendorAutostart && !needs.vendorLockScreen) {
    hideNotificationBanner();
    return false;
  }

  const pendingLabels = [];

  if (needs.notification) {
    pendingLabels.push('notificações');
  }

  if (needs.exactAlarm) {
    pendingLabels.push('alarmes exatos');
  }

  if (needs.batteryOptimization) {
    pendingLabels.push('bateria em segundo plano');
  }

  if (needs.vendorAutostart) {
    pendingLabels.push('início automático');
  }

  if (needs.vendorLockScreen) {
    pendingLabels.push('tela de bloqueio');
  }

  showNotificationBanner(
    'Concluir permissões de lembrete',
    `Pendências: ${pendingLabels.join(', ')}. Use os botões abaixo e habilite o Controle de Dívidas quando a tela do Android aparecer.`,
    true,
    'reliability',
    'Abrir próxima'
  );
  return true;
}

async function getPaymentReliabilityNeeds(plugin, options = {}) {
  const respectOpenedFlags = options.respectOpenedFlags !== false;
  const needs = {
    notification: false,
    exactAlarm: false,
    batteryOptimization: false,
    vendorAutostart: false,
    vendorLockScreen: false,
    storage: false
  };

  try {
    needs.notification = await getPaymentNotificationPermissionState() !== 'granted';
  } catch (_) {}

  try {
    if (plugin?.checkExactNotificationSetting) {
      const exactStatus = await plugin.checkExactNotificationSetting();
      needs.exactAlarm = exactStatus?.exact_alarm !== 'granted'
        && (!respectOpenedFlags || localStorage.getItem(NOTIFICATION_EXACT_SCREEN_OPENED_KEY) !== 'opened');
    }
  } catch (_) {}

  const nativePermissions = getNotificationPermissionsPlugin();

  try {
    if (nativePermissions?.getStatus) {
      const nativeStatus = await nativePermissions.getStatus();
      needs.batteryOptimization = nativeStatus?.batteryOptimizationIgnored === false
        && (!respectOpenedFlags || localStorage.getItem(NOTIFICATION_BATTERY_SCREEN_OPENED_KEY) !== 'opened');
      needs.vendorAutostart = Boolean(nativeStatus?.hasManufacturerPermissionScreens)
        && (!respectOpenedFlags || localStorage.getItem(NOTIFICATION_VENDOR_AUTOSTART_KEY) !== 'opened');
      needs.vendorLockScreen = Boolean(nativeStatus?.hasManufacturerPermissionScreens)
        && (!respectOpenedFlags || localStorage.getItem(NOTIFICATION_VENDOR_LOCKSCREEN_KEY) !== 'opened');
    }
  } catch (_) {}

  try {
    const fs = getFilesystemPlugin();
    if (fs) {
      const status = await fs.checkPermissions();
      needs.storage = status.publicStorage !== 'granted';
    }
  } catch (_) {}

  return needs;
}

function renderPermissionChecklist(target, needs = {}) {
  if (!target) {
    return;
  }

  const items = [
    { action: 'notification', label: 'Notificações', ok: !needs.notification },
    { action: 'exact', label: 'Alarmes', ok: !needs.exactAlarm },
    { action: 'battery', label: 'Bateria', ok: !needs.batteryOptimization },
    { action: 'autostart', label: 'Início auto', ok: !needs.vendorAutostart },
    { action: 'lockscreen', label: 'Tela bloqueio', ok: !needs.vendorLockScreen },
    { action: 'storage', label: 'Armazenamento', ok: !needs.storage },
    { action: 'test', label: 'Teste', ok: true }
  ];

  target.hidden = false;
  target.innerHTML = items.map((item) => `
    <button type="button" class="permission-step-btn${item.ok ? ' is-ok' : ''}" data-permission-action="${item.action}">
      <span>${item.label}</span>
      <strong class="permission-step-state">${item.ok ? 'OK' : 'Abrir'}</strong>
    </button>
  `).join('');
}

function hidePermissionChecklist() {
  if (!permissionChecklist) {
    return;
  }

  permissionChecklist.hidden = true;
  permissionChecklist.innerHTML = '';
}

async function openPermissionAction(action) {
  const localNotifications = getLocalNotificationsPlugin();
  const nativePermissions = getNotificationPermissionsPlugin();

  if (!nativePermissions && action !== 'notification' && action !== 'test') {
    alert('Erro: Plugin de permissões nativas não encontrado. Por favor, reinstale o app v1.9.1.');
  }

  switch (action) {
    case 'notification':
      await enablePaymentNotifications();
      return;
    case 'exact':
      await requestExactNotificationAccess(localNotifications);
      break;
    case 'battery':
      await requestBatteryOptimizationAccess();
      break;
    case 'autostart':
      await requestVendorAutostartAccess();
      break;
    case 'lockscreen':
      await requestVendorLockScreenAccess();
      break;
    case 'storage':
      await requestStorageAccess();
      break;
    case 'test':
      await scheduleTestNotification();
      return;
    default:
      await nativePermissions?.openAppSettings?.();
      return;
  }

  window.setTimeout(() => {
    showPaymentReliabilityPromptIfNeeded(localNotifications).catch(() => {});
    refreshSettingsPermissionChecklist().catch(() => {});
  }, 800);
}

async function requestExactNotificationAccess(plugin) {
  if (!plugin?.checkExactNotificationSetting || !plugin?.changeExactNotificationSetting) {
    return 'granted';
  }

  try {
    const currentStatus = await plugin.checkExactNotificationSetting();

    if (currentStatus?.exact_alarm === 'granted') {
      return 'granted';
    }

    localStorage.setItem(NOTIFICATION_EXACT_SCREEN_OPENED_KEY, 'opened');
    setStatus('O Android vai abrir Alarmes e lembretes. Se não houver opção para ativar, volte ao app para continuar.', 'success');
    const nextStatus = await plugin.changeExactNotificationSetting();
    return nextStatus?.exact_alarm ?? 'denied';
  } catch (_) {
    const nativePermissions = getNotificationPermissionsPlugin();
    await nativePermissions?.openExactAlarmSettings?.();
    return 'denied';
  }
}

async function requestBatteryOptimizationAccess() {
  const plugin = getNotificationPermissionsPlugin();

  if (!plugin?.getStatus || !plugin?.requestBatteryOptimizationExemption) {
    return;
  }

  try {
    const status = await plugin.getStatus();

    if (status?.batteryOptimizationIgnored) {
      return;
    }

    localStorage.setItem(NOTIFICATION_BATTERY_SCREEN_OPENED_KEY, 'opened');
    setStatus('Permita o funcionamento em segundo plano. Se não aparecer um botão, abra Bateria nos detalhes do app e escolha Sem restrições.', 'success');
    const nextStatus = await plugin.requestBatteryOptimizationExemption();

    if (nextStatus?.batteryOptimizationIgnored === false) {
      await plugin.openManufacturerBatterySettings?.();
    }
  } catch (_) {}
}

async function requestVendorAutostartAccess() {
  const plugin = getNotificationPermissionsPlugin();

  if (!plugin?.openManufacturerAutostartSettings) {
    return;
  }

  localStorage.setItem(NOTIFICATION_VENDOR_AUTOSTART_KEY, 'opened');
  setStatus('Na tela do sistema, ative o início automático do Controle de Dívidas, se essa opção aparecer.', 'success');
  await plugin.openManufacturerAutostartSettings();
}

async function requestVendorLockScreenAccess() {
  const plugin = getNotificationPermissionsPlugin();

  localStorage.setItem(NOTIFICATION_VENDOR_LOCKSCREEN_KEY, 'opened');
  setStatus('Na tela de notificações, confira som, pop-up e tela de bloqueio. Se não aparecer, volte e ajuste nas permissões especiais.', 'success');

  if (plugin.openNotificationChannelSettings) {
    await plugin.openNotificationChannelSettings({ channelId: NOTIFICATION_CHANNEL_ID });
    return;
  }

  await plugin.openManufacturerAppPermissionsSettings();
}

async function requestStorageAccess() {
  const plugin = getNotificationPermissionsPlugin();
  
  if (!plugin) {
    const fs = getFilesystemPlugin();
    if (!fs) return 'granted';
    try {
      return (await fs.requestPermissions()).publicStorage;
    } catch (_) { return 'denied'; }
  }
  
  try {
    // Chamada que abre o POP-UP padrão (Imagem 2)
    await plugin.requestStoragePermission();
    
    const fs = getFilesystemPlugin();
    const status = await fs?.checkPermissions();
    
    // Se for Android 11+ e o pop-up não foi suficiente, abre a tela de acesso total
    if (status?.publicStorage !== 'granted') {
      await plugin.openAllFilesAccessSettings();
    }
    
    return status?.publicStorage ?? 'denied';
  } catch (e) {
    await plugin.openAppSettings();
    return 'denied';
  }
}

async function scheduleTestNotification() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin) {
    setStatus('Notificações locais não estão disponíveis neste dispositivo.', 'error');
    return;
  }

  const permission = await requestPaymentNotificationPermission();

  if (permission !== 'granted') {
    setStatus('Permita notificações para testar o aviso.', 'error');
    return;
  }

  await createPaymentNotificationChannel();
  const notifyAt = new Date(Date.now() + 10000);
  await plugin.schedule({
    notifications: [{
      id: 990001,
      title: 'Teste de lembrete',
      body: 'Se este aviso apareceu, as notificações do Controle de Dívidas estão funcionando.',
      schedule: {
        at: notifyAt,
        allowWhileIdle: true
      },
      channelId: NOTIFICATION_CHANNEL_ID,
      sound: NOTIFICATION_SOUND_FILE,
      autoCancel: true
    }]
  });
  setStatus('Teste programado para daqui a 10 segundos.', 'success');
}

function queuePaymentNotificationSync() {
  if (localStorage.getItem(NOTIFICATION_PREFERENCE_KEY) !== 'enabled') {
    return;
  }

  if (notificationSyncTimeoutId) {
    window.clearTimeout(notificationSyncTimeoutId);
  }

  notificationSyncTimeoutId = window.setTimeout(() => {
    syncPaymentNotifications().catch(() => {});
  }, 250);
}

async function syncPaymentNotifications() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin || localStorage.getItem(NOTIFICATION_PREFERENCE_KEY) !== 'enabled') {
    return 0;
  }

  const permission = await getPaymentNotificationPermissionState();

  if (permission !== 'granted') {
    return 0;
  }

  await createPaymentNotificationChannel();
  await cancelScheduledPaymentNotifications();

  const notifications = buildPaymentNotifications();

  if (notifications.length === 0) {
    storeScheduledNotificationIds([]);
    return 0;
  }

  const result = await plugin.schedule({ notifications });
  const scheduledIds = result?.notifications?.map((notification) => notification.id) ?? notifications.map((notification) => notification.id);
  storeScheduledNotificationIds(scheduledIds);
  return scheduledIds.length;
}

function buildPaymentNotifications() {
  const now = new Date();
  const notifications = [];

  plans.forEach((plan) => {
    const effectiveStartDate = getEffectiveStartDate(parseDateInput(plan.startDate), plan.countMode);
    const paidMonths = new Set(getPaidMonths(plan));

    for (let monthIndex = 1; monthIndex <= plan.totalMonths; monthIndex += 1) {
      if (paidMonths.has(monthIndex)) {
        continue;
      }

      const paymentDate = addMonths(effectiveStartDate, monthIndex - 1);
      const notifyAt = new Date(paymentDate);
      notifyAt.setHours(PAYMENT_NOTIFICATION_HOUR, 0, 0, 0);

      if (notifyAt <= now) {
        continue;
      }

      notifications.push({
        id: createPaymentNotificationId(plan.id, monthIndex),
        title: `Pagamento: ${plan.name}`,
        body: `Chegou o mês de pagar "${plan.name}". Marque como pago no app quando concluir.`,
        largeBody: `Chegou o mês de pagar "${plan.name}". Abra o Controle de Dívidas para marcar como pago e manter seus compromissos atualizados.`,
        summaryText: 'Lembrete de pagamento',
        schedule: {
          at: notifyAt,
          allowWhileIdle: true
        },
        channelId: NOTIFICATION_CHANNEL_ID,
        sound: NOTIFICATION_SOUND_FILE,
        autoCancel: true,
        extra: {
          planId: plan.id,
          monthIndex
        }
      });
    }
  });

  return notifications
    .sort((left, right) => left.schedule.at - right.schedule.at)
    .slice(0, PAYMENT_NOTIFICATION_LIMIT);
}

async function cancelScheduledPaymentNotifications() {
  const plugin = getLocalNotificationsPlugin();
  const ids = loadScheduledNotificationIds();

  if (!plugin?.cancel || ids.length === 0) {
    return;
  }

  try {
    await plugin.cancel({
      notifications: ids.map((id) => ({ id }))
    });
  } catch (_) {}

  storeScheduledNotificationIds([]);
}

function loadScheduledNotificationIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCHEDULED_NOTIFICATION_IDS_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((id) => Number.isInteger(id))
      : [];
  } catch (_) {
    return [];
  }
}

function storeScheduledNotificationIds(ids) {
  localStorage.setItem(SCHEDULED_NOTIFICATION_IDS_KEY, JSON.stringify(ids));
}

function createPaymentNotificationId(planId, monthIndex) {
  const source = `${planId}:${monthIndex}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index);
    hash |= 0;
  }

  return 100000 + ((hash >>> 0) % 2000000000);
}

function registerPaymentNotificationListeners() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin?.addListener || paymentNotificationListenersRegistered) {
    return;
  }

  paymentNotificationListenersRegistered = true;
  plugin.addListener('localNotificationActionPerformed', (event) => {
    const planId = event?.notification?.extra?.planId;
    const plan = plans.find((item) => item.id === planId);

    if (!plan) {
      return;
    }

    selectedPlanId = plan.id;
    renderPlansList();
    openDetailsModal(plan, { resetTimelineScroll: true });
  });
}

function showNotificationBanner(title, message, canRequest, mode = 'notification', primaryLabel = 'Ativar notificações') {
  if (!notificationBanner || !notificationBannerTitle || !notificationBannerMessage || !enableNotificationsBtn || !dismissNotificationsBtn) {
    return;
  }

  notificationBannerMode = mode;
  notificationBanner.hidden = false;
  notificationBannerTitle.textContent = title;
  notificationBannerMessage.textContent = message;
  enableNotificationsBtn.hidden = !canRequest;
  dismissNotificationsBtn.hidden = !canRequest;
  enableNotificationsBtn.textContent = primaryLabel;

  if (mode !== 'reliability') {
    hidePermissionChecklist();
  }
}

function hideNotificationBanner() {
  if (!notificationBanner) {
    return;
  }

  notificationBanner.hidden = true;
  hidePermissionChecklist();
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

    const release = await fetchLatestAvailableUpdate(
      config,
      currentVersion
    );

    if (release?.version && isRemoteVersionNewer(release.version, currentVersion)) {
      availableUpdate = release;
      showUpdateBanner(
        `Nova versão v${release.version} disponível`,
        release.notes || 'Uma nova versão do aplicativo está disponível para download. Toque no botão abaixo para baixar o instalador (APK) e atualizar.',
        release.version,
        release.apkUrl
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

  // Novo: Scaneia por APK já baixado se não houver banner de atualização remota
  if (!availableUpdate && (updateBanner && updateBanner.hidden)) {
    await scanForDownloadedUpdate();
  }
}

async function scanForDownloadedUpdate() {
  const fs = getFilesystemPlugin();
  if (!fs) return;

  try {
    // Verifica se temos permissão
    const status = await fs.checkPermissions();
    if (status.publicStorage !== 'granted') return;

    // Tentamos listar a pasta de Downloads
    const result = await fs.readdir({
      path: 'Download',
      directory: 'EXTERNAL_STORAGE'
    }).catch(() => null);

    if (!result?.files) return;

    // Procuramos por app-release.apk ou similar
    const apkFile = result.files.find(f => f.name.toLowerCase() === 'app-release.apk');
    
    if (apkFile) {
       showUpdateBanner(
         'Instalador encontrado!',
         'Encontramos o arquivo de atualização (APK) na sua pasta de Downloads. Deseja instalar agora?',
         'Local',
         null
       );
    }
  } catch (_) {}
}

async function installLocalApk() {
  const fs = getFilesystemPlugin();
  const installer = window.Capacitor?.Plugins?.UpdateInstaller;
  if (!fs || !installer?.installApk) return;

  try {
    const uriResult = await fs.getUri({
      path: 'Download/app-release.apk',
      directory: 'EXTERNAL_STORAGE'
    });

    if (uriResult?.uri) {
      await installer.installApk({ path: uriResult.uri });
    }
  } catch (error) {
    console.error('Falha ao instalar APK local:', error);
    setStatus('Falha ao abrir o instalador. Verifique as permissões de armazenamento.', 'error');
  }
}

function buildManifestUrls(config) {
  const urls = [
    config.bundleManifestUrl,
    config.bundleManifestFallbackUrl
  ].filter(Boolean);

  return urls.map((url, index) => {
    const separator = url.includes('?') ? '&' : '?';
    // Adicionamos um timestamp e um número aleatório para garantir que o GitHub não entregue nada do cache
    return `${url}${separator}app=${encodeURIComponent(config.currentVersion || defaultUpdateConfig.currentVersion)}&cache_bust=${Date.now()}_${Math.random().toString(36).substring(7)}&t=${index}`;
  });
}

async function fetchLatestAvailableUpdate(config, currentVersion) {
  const timeoutMs = config.requestTimeoutMs ?? 6000;
  const candidates = [];

  try {
    const manifestCandidate = await fetchBundleManifest(
      buildManifestUrls(config),
      timeoutMs,
      currentVersion
    );

    if (manifestCandidate?.version) {
      candidates.push(manifestCandidate);
    }
  } catch (_) {}

  try {
    const releaseCandidate = await fetchReleaseApiCandidate(config.releaseApiUrl, timeoutMs);

    if (releaseCandidate?.version) {
      candidates.push(releaseCandidate);
    }
  } catch (_) {}

  if (candidates.length === 0) {
    throw new Error('Nenhuma fonte de atualização respondeu.');
  }

  return candidates.reduce((latest, candidate) => {
    if (!latest) {
      return candidate;
    }

    if (isRemoteVersionNewer(candidate.version, latest.version)) {
      return candidate;
    }

    if (
      candidate.version === latest.version &&
      getUpdateCandidateScore(candidate) > getUpdateCandidateScore(latest)
    ) {
      return candidate;
    }

    return latest;
  }, null);
}

function getUpdateCandidateScore(candidate) {
  const apkUrl = String(candidate?.apkUrl || '');

  if (/github\.com\/[^/]+\/[^/]+\/releases\/download\/v/i.test(apkUrl)) {
    return 3;
  }

  if (apkUrl.includes('raw.githubusercontent.com')) {
    return 2;
  }

  if (apkUrl.includes('cdn.jsdelivr.net')) {
    return 1;
  }

  return 0;
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

async function fetchReleaseApiCandidate(url, timeoutMs) {
  if (!url) {
    throw new Error('API de release indisponivel.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Release do GitHub indisponivel.');
    }

    const release = await response.json();
    const tagName = String(release?.tag_name || '').trim().replace(/^v/i, '');

    if (!tagName) {
      throw new Error('Release do GitHub invalida.');
    }

    return {
      version: tagName,
      notes: String(release?.body || '').trim() || 'Uma nova interface foi encontrada. Toque no botao verde para aplicar a atualização sem reinstalar o app.',
      bundleUrl: 'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-bundle.json',
      bundleFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-bundle.json',
      apkUrl: `https://github.com/WSPREDADOR/controle-financeiro/releases/download/v${tagName}/app-release.apk`
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchManifestCandidate(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal
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

function showUpdateBanner(title, message, version, apkUrl = null) {
  if (!updateBanner || !updateBannerTitle || !updateBannerMessage || !updatePrimaryBtn) {
    return;
  }

  updateBanner.hidden = false;
  updateBannerTitle.textContent = title;
  updateBannerMessage.textContent = message;
  
  updatePrimaryBtn.hidden = false;
  updatePrimaryBtn.disabled = false;
  if (version === 'Local') {
    updatePrimaryBtn.textContent = 'Instalar Agora';
  } else {
    updatePrimaryBtn.textContent = apkUrl ? 'Baixar Atualização (APK)' : `Atualizar para ${version}`;
  }

  if (updateNativeBtn) {
    updateNativeBtn.hidden = true;
  }
  
  resetUpdateProgress();
}

function showUpdatedBanner(version) {
  if (!updateBanner || !updateBannerTitle || !updateBannerMessage || !updatePrimaryBtn) {
    return;
  }

  updateBanner.hidden = false;
  updateBannerTitle.textContent = `Aplicativo atualizado para ${version}`;
  updateBannerMessage.textContent = 'A nova versão foi instalada com sucesso. Tudo certo para continuar usando o app.';
  updatePrimaryBtn.disabled = false;
  updatePrimaryBtn.hidden = true;
  setUpdateProgress('Atualização concluída', 100);
}

function hideUpdateBanner() {
  if (!updateBanner || !updatePrimaryBtn) {
    return;
  }

  updateBanner.hidden = true;
  updatePrimaryBtn.hidden = true;
  updatePrimaryBtn.disabled = false;
  updatePrimaryBtn.textContent = 'Atualizar app';
  resetUpdateProgress();
}

function showUpdateError(message) {
  if (!updateBanner || !updateBannerTitle || !updateBannerMessage || !updatePrimaryBtn) {
    return;
  }

  updateBannerHoldUntil = Date.now() + 15000;
  updateBanner.hidden = false;
  updateBannerTitle.textContent = 'Atualização não concluída';
  updateBannerMessage.textContent = message || 'Não foi possível aplicar a atualização agora. Confira a conexão e tente novamente.';
  updatePrimaryBtn.hidden = false;
  updatePrimaryBtn.disabled = false;
  updatePrimaryBtn.textContent = availableUpdate?.version
    ? `Tentar ${availableUpdate.version} novamente`
    : 'Tentar novamente';
  setUpdateProgress('Falha na atualização', 0);
}

async function startApkUpdate(update) {
  const apkUrl = update?.apkUrl;

  if (!apkUrl) {
    return;
  }

  const installer = window.Capacitor?.Plugins?.UpdateInstaller;

  if (!installer?.downloadAndInstall) {
    openUpdateUrl(apkUrl);
    hideUpdateBanner();
    return;
  }

  setUpdateProgress('Iniciando download do APK...', 1);

  try {
    const result = await installer.downloadAndInstall({
      apkUrl,
      version: update.version || ''
    });

    if (result?.requiresPermission) {
      showUpdateError('Permita a instalação por fontes desconhecidas para este app e toque em atualizar novamente.');
      return;
    }

    setUpdateProgress('Baixado, verifique em suas notificações', 100);

    // Notificar o usuário
    const localNotifications = getLocalNotificationsPlugin();
    if (localNotifications) {
      localNotifications.schedule({
        notifications: [{
          id: 999,
          title: 'Atualização Baixada',
          body: 'Toque para instalar a nova versão do app.',
          schedule: { at: new Date(Date.now() + 500) }
        }]
      });
    }

    if (updateBannerMessage) {
      updateBannerMessage.textContent = 'Download concluído! Verifique suas notificações para instalar.';
    }
  } catch (_) {
    openUpdateUrl(apkUrl);
    hideUpdateBanner();
  }
}

function resetUpdateProgress() {
  if (!updateProgress || !updateProgressLabel) {
    return;
  }

  updateProgress.hidden = true;
  updateProgressLabel.textContent = 'Baixando...';
}

function setUpdateProgress(message, percent = null) {
  if (updatePrimaryBtn) {
    updatePrimaryBtn.hidden = false;
    updatePrimaryBtn.disabled = true;
    updatePrimaryBtn.textContent = message || 'Baixando atualização...';
  }

  if (!updateProgress || !updateProgressLabel) {
    return;
  }

  updateProgress.hidden = false;
  updateProgressLabel.textContent = message || 'Baixando...';
  
  if (updateProgressBar && percent !== null) {
    updateProgressBar.style.width = `${percent}%`;
  }
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
  if (!update?.bundleUrl || isUpdateInstallInFlight) {
    return;
  }

  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };
  let didStartApply = false;
  isUpdateInstallInFlight = true;
  setUpdateProgress('Preparando atualização...', 1);

  try {
    await Storage.set(PENDING_UPDATE_VERSION_KEY, update.version || '');

    const bundle = await fetchBundlePayload(
      update,
      config.currentVersion || defaultUpdateConfig.currentVersion,
      config.requestTimeoutMs ?? defaultUpdateConfig.requestTimeoutMs,
      (percent) => setUpdateProgress('Baixando atualização...', percent)
    );

    setUpdateProgress('Salvando atualização...', 82);
    persistWebBundle(bundle);
    setUpdateProgress('Aplicando atualização...', 96);
    didStartApply = true;
    
    // Notificar o usuário que baixou
    const localNotifications = getLocalNotificationsPlugin();
    if (localNotifications) {
      localNotifications.schedule({
        notifications: [{
          id: 1000,
          title: 'Atualização Concluída',
          body: 'O app foi atualizado para a versão ' + (update.version || 'mais recente') + '.',
          schedule: { at: new Date(Date.now() + 500) }
        }]
      });
    }

    window.setTimeout(() => {
      try {
        setUpdateProgress('Baixado, verifique em suas notificações', 100);
        window.setTimeout(() => {
          applyWebBundle(bundle);
        }, 1500);
      } catch (error) {
        isUpdateInstallInFlight = false;
        Storage.remove(PENDING_UPDATE_VERSION_KEY).finally(() => {
          showUpdateError(error?.message);
        });
      }
    }, 80);
  } catch (error) {
    await Storage.remove(PENDING_UPDATE_VERSION_KEY);
    showUpdateError(error?.message);
  } finally {
    if (!didStartApply) {
      isUpdateInstallInFlight = false;
    }
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

async function fetchBundlePayload(update, currentVersion, timeoutMs = 10000, onProgress = null) {
  let lastError = null;

  for (const url of buildBundleUrls(update, currentVersion)) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Bundle web indisponível.');
      }

      const bundleText = await readResponseText(response, onProgress);
      clearTimeout(timeoutId);

      const bundle = JSON.parse(bundleText);

      if (!bundle?.version) {
        throw new Error('Bundle web inválido: sem versão.');
      }

      // Aceita formato html (legado) e css+js (novo)
      const hasHtml = Boolean(bundle.html);
      const hasCssJs = bundle.css !== undefined && bundle.js !== undefined;
      if (!hasHtml && !hasCssJs) {
        throw new Error('Bundle web inválido: sem conteúdo.');
      }

      // Aceitar qualquer bundle mais novo que a versão atual do app.
      // Não exige match exato com o manifesto — CDNs podem ter lag.
      if (!isRemoteVersionNewer(bundle.version, currentVersion)) {
        throw new Error(`Bundle (${bundle.version}) não é mais recente que a versão atual (${currentVersion}).`);
      }

      assertBundleSize(bundle);
      return bundle;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError ?? new Error('Bundle web indisponível.');
}

async function readResponseText(response, onProgress = null) {
  if (!response.body?.getReader) {
    const text = await response.text();
    onProgress?.(70);
    return text;
  }

  const contentLength = Number.parseInt(response.headers.get('content-length') || '0', 10);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks = [];
  let receivedLength = 0;
  let fallbackProgress = 8;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(decoder.decode(value, { stream: true }));
    receivedLength += value.length;

    if (contentLength > 0) {
      onProgress?.(Math.min(70, Math.max(8, (receivedLength / contentLength) * 70)));
    } else {
      fallbackProgress = Math.min(68, fallbackProgress + 4);
      onProgress?.(fallbackProgress);
    }
  }

  chunks.push(decoder.decode());
  onProgress?.(75);
  return chunks.join('');
}

function assertBundleSize(bundle) {
  const serializedBundle = JSON.stringify(bundle);

  if (serializedBundle.length > MAX_WEB_BUNDLE_CHARS) {
    throw new Error('Bundle web grande demais para aplicar com segurança no celular.');
  }
}

function persistWebBundle(bundle) {
  if (!bundle?.version) {
    throw new Error('Bundle web inválido.');
  }

  const hasHtml = Boolean(bundle.html);
  const hasCssJs = bundle.css !== undefined && bundle.js !== undefined;
  if (!hasHtml && !hasCssJs) {
    throw new Error('Bundle web inválido: sem conteúdo.');
  }

  const serializedBundle = JSON.stringify(bundle);

  if (serializedBundle.length > MAX_WEB_BUNDLE_CHARS) {
    throw new Error('Bundle web grande demais para aplicar com segurança no celular.');
  }

  localStorage.setItem(WEB_BUNDLE_STORAGE_KEY, serializedBundle);
}

function applyWebBundle(bundle) {
  if (!bundle?.version) {
    throw new Error('Bundle web inválido.');
  }

  // O bundle já foi salvo no localStorage por persistWebBundle().
  // Ao recarregar, o web-runtime.js do APK detecta o bundle e aplica
  // via document.write() de forma síncrona no <head> — que é confiável.
  window.location.reload();
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
  const filteredPlans = getFilteredPlans();
  plansTotalCount.textContent = String(filteredPlans.length);
  plansVisibleCount.textContent = String(visibleNumber || 0);
  plansSelectedCount.textContent = String(getSelectedPlanNumber());
}

function schedulePlanFocusUpdate() {
  if (planFocusFrameId) {
    window.cancelAnimationFrame(planFocusFrameId);
  }

  planFocusFrameId = window.requestAnimationFrame(() => {
    planFocusFrameId = null;
    const visibleNumber = getVisiblePlanNumber();
    updatePlansSummary(visibleNumber);
    updateFocusedPlanCard(visibleNumber);
  });
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

  const selectedIndex = getFilteredPlans().findIndex((plan) => plan.id === selectedPlanId);
  return selectedIndex >= 0 ? selectedIndex + 1 : 0;
}

function getVisiblePlanNumber() {
  const items = [...plansList.querySelectorAll('.plan-item')];

  if (items.length === 0) {
    return 0;
  }

  const listRect = plansList.getBoundingClientRect();
  const isHorizontal = plansList.scrollWidth > plansList.clientWidth + 1;
  const listStart = isHorizontal ? listRect.left : listRect.top;
  let focusedItem = items[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const visibleWidth = Math.max(0, Math.min(itemRect.right, listRect.right) - Math.max(itemRect.left, listRect.left));
    const visibleHeight = Math.max(0, Math.min(itemRect.bottom, listRect.bottom) - Math.max(itemRect.top, listRect.top));
    const visibleArea = visibleWidth * visibleHeight;
    const itemArea = Math.max(1, itemRect.width * itemRect.height);
    const visibleRatio = visibleArea / itemArea;
    const itemStart = isHorizontal ? itemRect.left : itemRect.top;
    const startDistance = Math.abs(itemStart - listStart);
    const score = (visibleRatio * 1000) - startDistance;

    if (score > bestScore) {
      bestScore = score;
      focusedItem = item;
    }
  });

  return Number.parseInt(focusedItem.dataset.planNumber ?? '0', 10) || 0;
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

function getPlanOrderSignature(items) {
  return items.map((plan) => plan.id).join('|');
}

function saveReorderFromDom(options = {}) {
  persistReorderDraftFromDom();
  const orderedPlans = getOrderedPlansFromReorderDom();

  if (orderedPlans.length !== plans.length) {
    renderReorderList();
    setStatus('Não foi possível salvar a nova ordem dos compromissos.', 'error');
    return;
  }

  const nextOrderSignature = getPlanOrderSignature(orderedPlans);

  if (nextOrderSignature === reorderSavedOrderSignature) {
    if (!options.silentWhenUnchanged) {
      setStatus('A ordem dos compromissos já está atualizada.', 'success');
    }
    return;
  }

  plans = orderedPlans;
  reorderSavedOrderSignature = nextOrderSignature;
  savePlans();
  renderPlansList();

  const selectedPlan = getSelectedPlan();

  if (selectedPlan) {
    renderPlanDetails(selectedPlan, { resetTimelineScroll: true });
  }

  setStatus('Ordem dos compromissos salva automaticamente.', 'success');
}

function clearReorderDragState() {
  stopReorderAutoScroll();
  draggedReorderPlanId = null;
  reorderActivePointerId = null;
  reorderActiveDragItem = null;
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

function initFinancialLogic() {
  // Aplicar máscara de moeda nos inputs
  document.querySelectorAll('.currency-input').forEach(input => {
    input.addEventListener('input', handleCurrencyInput);
  });

  // Listeners para troca de tipo (Dívida vs Despesa)
  document.querySelectorAll('input[name="createPlanType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isExpense = e.target.value === 'expense';
      const totalValueField = document.getElementById('createTotalValue')?.parentElement;
      const installmentLabel = document.querySelector('label[for="createInstallmentValue"] span');
      
      if (isExpense) {
        if (totalValueField) totalValueField.style.display = 'none';
        if (installmentLabel) installmentLabel.textContent = 'Valor Mensal (Opcional)';
        if (singlePaymentToggleContainer) singlePaymentToggleContainer.style.display = 'none';
        isSinglePaymentMode = false;
      } else {
        if (totalValueField) totalValueField.style.display = 'flex';
        if (installmentLabel) installmentLabel.textContent = 'Valor da Parcela (Opcional)';
        if (singlePaymentToggleContainer) singlePaymentToggleContainer.style.display = 'block';
      }
      updateSinglePaymentUI();
    });
  });

  // Toggle Valor Único
  toggleSinglePaymentBtn?.addEventListener('click', () => {
    isSinglePaymentMode = !isSinglePaymentMode;
    updateSinglePaymentUI();
  });

  // Cálculo automático: Total -> Parcela
  [createTotalValueInput, editTotalValueInput].forEach(input => {
    input?.addEventListener('input', (e) => {
      const isEdit = e.target === editTotalValueInput;
      const totalVal = parseCurrencyToNumber(e.target.value);
      const monthsInput = isEdit ? editTotalMonthsInput : createTotalMonthsInput;
      const installmentInput = isEdit ? editInstallmentValueInput : createInstallmentValueInput;
      const months = parseInt(monthsInput.value) || 1;

      if (!isNaN(totalVal) && totalVal > 0 && months > 0 && !isSinglePaymentMode) {
        installmentInput.value = formatCurrencyRaw(totalVal / months);
      }
    });
  });

  // Cálculo automático: Parcela -> Total
  [createInstallmentValueInput, editInstallmentValueInput].forEach(input => {
    input?.addEventListener('input', (e) => {
      const isEdit = e.target === editInstallmentValueInput;
      const instVal = parseCurrencyToNumber(e.target.value);
      const monthsInput = isEdit ? editTotalMonthsInput : createTotalMonthsInput;
      const totalInput = isEdit ? editTotalValueInput : createTotalValueInput;
      const months = parseInt(monthsInput.value) || 1;

      if (!isNaN(instVal) && instVal > 0 && months > 0 && !isSinglePaymentMode) {
        totalInput.value = formatCurrencyRaw(instVal * months);
      }
    });
  });

  // Cálculo automático ao mudar os meses
  [createTotalMonthsInput, editTotalMonthsInput].forEach(input => {
    input?.addEventListener('input', (e) => {
      const isEdit = e.target === editTotalMonthsInput;
      const totalInput = isEdit ? editTotalValueInput : createTotalValueInput;
      const installmentInput = isEdit ? editInstallmentValueInput : createInstallmentValueInput;
      const months = parseInt(e.target.value) || 0;
      
      const totalVal = parseCurrencyToNumber(totalInput.value);
      const instVal = parseCurrencyToNumber(installmentInput.value);

      if (months > 0 && !isSinglePaymentMode) {
        if (totalVal > 0) {
          // Se tem total, ajusta a parcela
          installmentInput.value = formatCurrencyRaw(totalVal / months);
        } else if (instVal > 0) {
          // Se não tem total mas tem parcela, ajusta o total
          totalInput.value = formatCurrencyRaw(instVal * months);
        }
      }
    });
  });

  // Listener para o lápis de editar parcela
  monthlyContainer?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-value-month]');
    if (!editBtn) return;
    
    const monthIndex = parseInt(editBtn.dataset.editValueMonth);
    const plan = getSelectedPlan();
    if (!plan) return;

    openValuePrompt(plan, monthIndex);
  });

  // Listeners do modal de prompt de valor
  const promptValueModal = document.getElementById('promptValueModal');
  const promptValueInput = document.getElementById('promptValueInput');
  const confirmBtn = document.getElementById('confirmPromptValueBtn');
  const cancelBtn = document.getElementById('cancelPromptValueBtn');

  let currentPromptMonth = null;

  function openValuePrompt(plan, monthIndex) {
    currentPromptMonth = monthIndex;
    const currentVal = plan.manualMonthValues?.[monthIndex] || plan.installmentValue || 0;
    promptValueInput.value = currentVal > 0 ? formatCurrencyRaw(currentVal) : '';
    promptValueModal.hidden = false;
    syncModalBodyState();
    window.setTimeout(() => promptValueInput.focus(), 20);
  }

  cancelBtn?.addEventListener('click', () => {
    promptValueModal.hidden = true;
    syncModalBodyState();
  });

  confirmBtn?.addEventListener('click', () => {
    const newVal = parseCurrencyToNumber(promptValueInput.value);
    const plan = getSelectedPlan();
    if (plan && currentPromptMonth) {
      if (!plan.manualMonthValues) plan.manualMonthValues = {};
      plan.manualMonthValues[currentPromptMonth] = isNaN(newVal) ? 0 : newVal;
      savePlans();
      renderPlansList();
      renderPlanDetails(plan);
    }
    promptValueModal.hidden = true;
    syncModalBodyState();
  });
}

function handleCurrencyInput(e) {
  let value = e.target.value.replace(/\D/g, "");
  if (!value) {
    e.target.value = "";
    return;
  }
  value = (parseInt(value) / 100).toFixed(2);
  e.target.value = formatCurrencyRaw(parseFloat(value));
}

function parseCurrencyToNumber(value) {
  if (!value) return 0;
  const cleanValue = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleanValue) || 0;
}

function formatCurrencyRaw(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function updateSinglePaymentUI() {
  if (isSinglePaymentMode) {
    createModal?.classList.add('mode-single-payment');
    editModal?.classList.add('mode-single-payment');
    toggleSinglePaymentBtn?.classList.add('active');
    if (createTotalMonthsInput) createTotalMonthsInput.value = '1';
  } else {
    createModal?.classList.remove('mode-single-payment');
    editModal?.classList.remove('mode-single-payment');
    toggleSinglePaymentBtn?.classList.remove('active');
  }
}

// Chamar inicialização
initFinancialLogic();


function calculatePlanFinancials(plan) {
  const paidMonthsList = getPaidMonths(plan);
  let totalPaid = 0;

  paidMonthsList.forEach(monthIdx => {
    const manualVal = plan.manualMonthValues?.[monthIdx];
    totalPaid += (manualVal !== undefined) ? manualVal : (plan.installmentValue || 0);
  });

  const totalValue = plan.totalValue || (plan.totalMonths * (plan.installmentValue || 0)) || 0;
  
  let progressRatio = 0;
  if (plan.isExpense) {
     // Despesas não tem um "fim" financeiro óbvio, usamos progresso de meses ou 0
     progressRatio = 0; 
  } else if (totalValue > 0) {
    progressRatio = clamp(totalPaid / totalValue, 0, 1);
  } else if (plan.totalMonths > 0) {
    progressRatio = clamp(paidMonthsList.length / plan.totalMonths, 0, 1);
  }

  return {
    totalPaid,
    totalValue,
    remainingValue: Math.max(0, totalValue - totalPaid),
    progressRatio,
    progressPercent: Math.round(progressRatio * 100)
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function escapeHtml(value) {
  if (typeof value !== 'string') return value;
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
