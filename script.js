
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MONEY_EPSILON = 0.005;
const STORAGE_KEY = 'payment-plans-v1';
const MONTHLY_BALANCES_KEY = 'monthly-balances-v1';
const USER_NAME_KEY = 'cf-user-name-v1';
const USER_ID_KEY = 'cf-user-id-v1';
const SUPPORT_DEVICE_TOKEN_KEY = 'cf-support-device-token-v1';
const SUPPORT_LAST_CHECKIN_KEY = 'cf-support-last-checkin-v1';
const SUPPORT_LICENSE_STATUS_KEY = 'cf-support-license-status-v1';
const SUPPORT_REMOTE_MESSAGE_KEY = 'cf-support-remote-message-v1';
const SUPPORT_CHAT_LAST_OPEN_KEY = 'cf-support-chat-last-open-v1';
const SUPPORT_LAST_NOTIFIED_MESSAGE_KEY = 'cf-support-last-notified-message-v1';
const TUTORIAL_COMPLETED_KEY = 'cf-tutorial-completed-v1';
const DEFAULT_COUNT_MODE = 'start_month';
const PLAN_TYPE_DEBT = 'debt';
const PLAN_TYPE_EXPENSE = 'expense';
const PLAN_TYPE_ACCOUNT = 'account';
const CONTINUOUS_EXPENSE_MONTHS = 1200;

const resultsSection = document.getElementById('resultsSection');
const statusMessage = document.getElementById('statusMessage');
const startupScreen = document.getElementById('startupScreen');
const monthlyContainer = document.getElementById('monthlyContainer');
const plansPanel = document.querySelector('.plans-panel');
const currentDate = document.getElementById('currentDate');
const appVersionLabel = document.getElementById('appVersionLabel');
const appReleaseDateLabel = document.getElementById('appReleaseDateLabel');
const updateBanner = document.getElementById('updateBanner');
const updateBannerTitle = document.getElementById('updateBannerTitle');
const updateBannerMessage = document.getElementById('updateBannerMessage');
const updatePrimaryBtn = document.getElementById('updatePrimaryBtn');
const updateNativeBtn = document.getElementById('updateNativeBtn');
const updateProgress = document.getElementById('updateProgress');
const updateProgressLabel = document.getElementById('updateProgressLabel');
const updateProgressPercent = document.getElementById('updateProgressPercent');
const updateProgressBar = document.getElementById('updateProgressBar');
const openAppSettingsModalBtn = document.getElementById('openAppSettingsModalBtn');
const appSettingsModal = document.getElementById('appSettingsModal');
const closeAppSettingsModalBtn = document.getElementById('closeAppSettingsModalBtn');
const appDetailsSection = document.getElementById('appDetailsSection');
const settingsAppVersion = document.getElementById('settingsAppVersion');
const settingsAppRelease = document.getElementById('settingsAppRelease');
const contactDevBtn = document.getElementById('contactDevBtn');
const openNativeAppSettingsBtn = document.getElementById('openNativeAppSettingsBtn');
const shareAppBtn = document.getElementById('shareAppBtn');
const shareOptionsPanel = document.getElementById('shareOptionsPanel');
const nativeShareAppBtn = document.getElementById('nativeShareAppBtn');
const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
const shareTelegramBtn = document.getElementById('shareTelegramBtn');
const shareEmailBtn = document.getElementById('shareEmailBtn');
const shareSmsBtn = document.getElementById('shareSmsBtn');
const copyAppLinkBtn = document.getElementById('copyAppLinkBtn');
const shareCopyStatus = document.getElementById('shareCopyStatus');
const notificationBanner = document.getElementById('notificationBanner');
const notificationBannerTitle = document.getElementById('notificationBannerTitle');
const notificationBannerMessage = document.getElementById('notificationBannerMessage');
const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');
const dismissNotificationsBtn = document.getElementById('dismissNotificationsBtn');
const permissionChecklist = document.getElementById('permissionChecklist');
const settingsPermissionChecklist = document.getElementById('settingsPermissionChecklist');
const onboardingModal = document.getElementById('onboardingModal');
const userNameInput = document.getElementById('userNameInput');
const saveOnboardingBtn = document.getElementById('saveOnboardingBtn');
const onboardingStatus = document.getElementById('onboardingStatus');
const userGreeting = document.getElementById('userGreeting');
const displayUserName = document.getElementById('displayUserName');
const settingsUserId = document.getElementById('settingsUserId');
const openSupportModalBtn = document.getElementById('openSupportModalBtn');
const supportModal = document.getElementById('supportModal');
const closeSupportModalBtn = document.getElementById('closeSupportModalBtn');
const supportLicenseBadge = document.getElementById('supportLicenseBadge');
const supportConnectionStatus = document.getElementById('supportConnectionStatus');
const supportLastCheckIn = document.getElementById('supportLastCheckIn');
const supportRemoteMessage = document.getElementById('supportRemoteMessage');
const supportAdminPresence = document.getElementById('supportAdminPresence');
const supportChatMessages = document.getElementById('supportChatMessages');
const supportAdminTyping = document.getElementById('supportAdminTyping');
const supportChatInput = document.getElementById('supportChatInput');
const supportChatSendBtn = document.getElementById('supportChatSendBtn');
const supportChatImageBtn = document.getElementById('supportChatImageBtn');
const supportChatImageInput = document.getElementById('supportChatImageInput');
const supportChatStatus = document.getElementById('supportChatStatus');
const restartTutorialBtn = document.getElementById('restartTutorialBtn');
const plansList = document.getElementById('plansList');
const selectedPlanTitle = document.getElementById('selectedPlanTitle');
const selectedPlanSubtitle = document.getElementById('selectedPlanSubtitle');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const openStatementImportModalBtn = document.getElementById('openStatementImportModalBtn');
const statementImportModal = document.getElementById('statementImportModal');
const closeStatementImportModalBtn = document.getElementById('closeStatementImportModalBtn');
const cancelStatementImportBtn = document.getElementById('cancelStatementImportBtn');
const backStatementImportBtn = document.getElementById('backStatementImportBtn');
const analyzeStatementFileBtn = document.getElementById('analyzeStatementFileBtn');
const confirmStatementImportBtn = document.getElementById('confirmStatementImportBtn');
const statementFileInput = document.getElementById('statementFileInput');
const statementFileName = document.getElementById('statementFileName');
const statementFileStage = document.getElementById('statementFileStage');
const statementReadingStage = document.getElementById('statementReadingStage');
const statementReviewStage = document.getElementById('statementReviewStage');
const statementDetectedBank = document.getElementById('statementDetectedBank');
const statementDetectedCount = document.getElementById('statementDetectedCount');
const statementDetectedTotal = document.getElementById('statementDetectedTotal');
const statementDetectedList = document.getElementById('statementDetectedList');
const statementImportStatus = document.getElementById('statementImportStatus');
const openBankImportModalBtn = document.getElementById('openBankImportModalBtn');
const bankImportModal = document.getElementById('bankImportModal');
const closeBankImportModalBtn = document.getElementById('closeBankImportModalBtn');
const cancelBankImportBtn = document.getElementById('cancelBankImportBtn');
const backBankImportBtn = document.getElementById('backBankImportBtn');
const continueBankConsentBtn = document.getElementById('continueBankConsentBtn');
const simulateBankReadBtn = document.getElementById('simulateBankReadBtn');
const confirmBankImportBtn = document.getElementById('confirmBankImportBtn');
const bankSelectStage = document.getElementById('bankSelectStage');
const bankConsentStage = document.getElementById('bankConsentStage');
const bankReadingStage = document.getElementById('bankReadingStage');
const bankReviewStage = document.getElementById('bankReviewStage');
const bankPickerGrid = document.getElementById('bankPickerGrid');
const bankConsentTitle = document.getElementById('bankConsentTitle');
const bankConsentDescription = document.getElementById('bankConsentDescription');
const bankPermissionsGrid = document.getElementById('bankPermissionsGrid');
const bankDetectedList = document.getElementById('bankDetectedList');
const bankConfirmedCount = document.getElementById('bankConfirmedCount');
const bankReviewCount = document.getElementById('bankReviewCount');
const bankDetectedTotal = document.getElementById('bankDetectedTotal');
const bankImportStatus = document.getElementById('bankImportStatus');
const plansFilterNav = document.getElementById('plansFilterNav');
const openReorderModalBtn = document.getElementById('openReorderModalBtn');
const openMonthlyBalanceModalBtn = document.getElementById('openMonthlyBalanceModalBtn');
const openMonthlyOverviewModalBtn = document.getElementById('openMonthlyOverviewModalBtn');
const monthlyBalanceModal = document.getElementById('monthlyBalanceModal');
const monthlyBalanceInput = document.getElementById('monthlyBalanceInput');
const monthlyBalanceValue = document.getElementById('monthlyBalanceValue');
const monthlyBalanceRemaining = document.getElementById('monthlyBalanceRemaining');
const monthlyBalanceCurrentValue = document.getElementById('monthlyBalanceCurrentValue');
const monthlyBalanceStatus = document.getElementById('monthlyBalanceStatus');
const closeMonthlyBalanceModalBtn = document.getElementById('closeMonthlyBalanceModalBtn');
const cancelMonthlyBalanceBtn = document.getElementById('cancelMonthlyBalanceBtn');
const saveMonthlyBalanceBtn = document.getElementById('saveMonthlyBalanceBtn');
const replaceMonthlyBalanceBtn = document.getElementById('replaceMonthlyBalanceBtn');
const monthlyOverviewModal = document.getElementById('monthlyOverviewModal');
const closeMonthlyOverviewModalBtn = document.getElementById('closeMonthlyOverviewModalBtn');
const monthlyOverviewPeriod = document.getElementById('monthlyOverviewPeriod');
const overviewBalanceValue = document.getElementById('overviewBalanceValue');
const overviewDebtValue = document.getElementById('overviewDebtValue');
const overviewAvailableValue = document.getElementById('overviewAvailableValue');
const overviewAvailableCard = document.getElementById('overviewAvailableCard');
const overviewOpenCount = document.getElementById('overviewOpenCount');
const monthlyBalanceChart = document.getElementById('monthlyBalanceChart');
const monthlyBalanceChartCenter = document.getElementById('monthlyBalanceChartCenter');
const monthlyDebtBreakdownList = document.getElementById('monthlyDebtBreakdownList');
const monthlyHistoryList = document.getElementById('monthlyHistoryList');
const monthlyPaymentHistoryList = document.getElementById('monthlyPaymentHistoryList');
const plansTotalCount = document.getElementById('plansTotalCount');
const plansVisibleCount = document.getElementById('plansVisibleCount');
const plansSelectedCount = document.getElementById('plansSelectedCount');
const createModal = document.getElementById('createModal');
const createForm = document.getElementById('createPlanForm');
const createPlanNameInput = document.getElementById('createPlanName');
const createStartDateInput = document.getElementById('createStartDate');
const createTotalMonthsInput = document.getElementById('createTotalMonths');
const createStatusMessage = document.getElementById('createStatusMessage');
const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
const cancelCreateModalBtn = document.getElementById('cancelCreateModalBtn');
const createPastMonthsGroup = document.getElementById('createPastMonthsGroup');
const createPastMonthsHint = document.getElementById('createPastMonthsHint');
const debtSpecificFields = document.getElementById('debtSpecificFields');
const createStartDateLabel = document.getElementById('createStartDateLabel');
const createInstallmentValueLabel = document.getElementById('createInstallmentValueLabel');
const createTotalValueLabel = document.getElementById('createTotalValueLabel');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editPlanForm');
const editPlanNameInput = document.getElementById('editPlanName');
const editStartDateInput = document.getElementById('editStartDate');
const editTotalMonthsInput = document.getElementById('editTotalMonths');
const editStatusMessage = document.getElementById('editStatusMessage');
const editModalSubtitle = document.getElementById('editModalSubtitle');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');
const editPastMonthsGroup = document.getElementById('editPastMonthsGroup');
const editPastMonthsHint = document.getElementById('editPastMonthsHint');
const editDebtSpecificFields = document.getElementById('editDebtSpecificFields');
const editStartDateLabel = document.getElementById('editStartDateLabel');
const editInstallmentValueLabel = document.getElementById('editInstallmentValueLabel');
const editTotalValueLabel = document.getElementById('editTotalValueLabel');
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
const promptValueModal = document.getElementById('promptValueModal');
const promptValueInput = document.getElementById('promptValueInput');
const confirmPromptValueBtn = document.getElementById('confirmPromptValueBtn');
const cancelPromptValueBtn = document.getElementById('cancelPromptValueBtn');

let plans = loadPlans();
let monthlyBalances = loadMonthlyBalances();
let currentPlanFilter = 'all';
let selectedPlanId = plans[0]?.id ?? null;
let editingPlanId = null;
let currentPromptMonth = null;
let currentMonthlyDebtTotal = 0;
let pendingDeletePlanId = null;
let reorderDraftPlanIds = [];
let draggedReorderPlanId = null;
let reorderActivePointerId = null;
let reorderActiveDragItem = null;
let reorderAutoScrollFrameId = null;
let reorderAutoScrollPointerY = null;
let reorderAutosaveTimeoutId = null;
let reorderSavedOrderSignature = '';
let planFocusFrameId = null;
let availableUpdate = null;
let updateCheckIntervalId = null;
let isUpdateCheckInFlight = false;
let isUpdateInstallInFlight = false;
let updateBannerHoldUntil = 0;
let notificationSyncTimeoutId = null;
let supportSyncIntervalId = null;
let supportChatIntervalId = null;
let supportTypingTimeoutId = null;
let supportLastTypingSentAt = 0;
let isSupportSyncInFlight = false;
let isSupportChatInFlight = false;
let isNativeAppActive = true;
let paymentNotificationListenersRegistered = false;
let notificationBannerMode = 'notification';
let bulkPaymentModalMode = 'create';
let currentTutorialStep = 0;
let bankDetectedItems = [];
let selectedBankId = null;
let currentBankImportStage = 'select';
let statementDetectedItems = [];
let statementImportFile = null;
let statementImportStage = 'file';
let statementImportBankName = '--';

const BANK_PERMISSION_LABELS = {
  cards: 'Faturas de cartão',
  credit: 'Operações de crédito',
  account: 'Transações de conta'
};

const BANK_IMPORT_PROVIDERS = [
  {
    id: 'nubank',
    name: 'Nubank',
    shortName: 'Nu',
    permissions: ['cards', 'credit', 'account'],
    description: 'Cartões, conta digital e empréstimos disponíveis no fluxo simulado.',
    items: [
      {
        id: 'nubank-card-2026-05',
        name: 'Fatura Nubank',
        bank: 'Nubank',
        kind: 'Cartão de crédito',
        dueDate: '2026-05-10',
        amount: 842.31,
        confidence: 98,
        status: 'confirmed',
        evidence: 'Fatura aberta com vencimento e total informados pela API de cartão.'
      },
      {
        id: 'nubank-loan-2026-05',
        name: 'Empréstimo Nubank',
        bank: 'Nubank',
        kind: 'Operação de crédito',
        dueDate: '2026-05-18',
        amount: 389.9,
        confidence: 94,
        status: 'confirmed',
        evidence: 'Contrato ativo com próxima parcela e saldo devedor disponíveis.'
      },
      {
        id: 'nubank-card-open-2026-05',
        name: 'Fatura Nubank em fechamento',
        bank: 'Nubank',
        kind: 'Cartão de crédito',
        dueDate: '2026-05-22',
        amount: 217.48,
        confidence: 72,
        status: 'review',
        evidence: 'Há compras recentes e vencimento provável, mas a fatura ainda não fechou.'
      }
    ]
  },
  {
    id: 'itau',
    name: 'Itaú',
    shortName: 'Itaú',
    permissions: ['cards', 'credit', 'account'],
    description: 'Cartão, conta corrente e contratos de crédito.',
    items: [
      {
        id: 'itau-card-2026-05',
        name: 'Fatura Itaú',
        bank: 'Itaú',
        kind: 'Cartão de crédito',
        dueDate: '2026-05-15',
        amount: 654.2,
        confidence: 96,
        status: 'confirmed',
        evidence: 'Fatura fechada com valor total e vencimento retornados pela API.'
      },
      {
        id: 'itau-credit-2026-05',
        name: 'Parcela Crédito Pessoal Itaú',
        bank: 'Itaú',
        kind: 'Operação de crédito',
        dueDate: '2026-05-27',
        amount: 512.75,
        confidence: 91,
        status: 'confirmed',
        evidence: 'Contrato ativo com próxima parcela em aberto.'
      }
    ]
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    shortName: 'BB',
    permissions: ['cards', 'credit', 'account'],
    description: 'Conta, cartão e crédito consignado/pessoal.',
    items: [
      {
        id: 'bb-card-2026-05',
        name: 'Fatura Banco do Brasil',
        bank: 'Banco do Brasil',
        kind: 'Cartão de crédito',
        dueDate: '2026-05-20',
        amount: 328.64,
        confidence: 95,
        status: 'confirmed',
        evidence: 'Fatura fechada identificada no endpoint de cartão.'
      },
      {
        id: 'bb-future-card-2026-06',
        name: 'Fatura parcial Banco do Brasil',
        bank: 'Banco do Brasil',
        kind: 'Cartão de crédito',
        dueDate: '2026-06-20',
        amount: 109.99,
        confidence: 68,
        status: 'review',
        evidence: 'Valor parcial de compras futuras; fatura ainda aberta.'
      }
    ]
  },
  {
    id: 'caixa',
    name: 'Caixa',
    shortName: 'Caixa',
    permissions: ['credit', 'account'],
    description: 'Conta e contratos ativos; cartão depende da disponibilidade da instituição.',
    items: [
      {
        id: 'caixa-housing-2026-05',
        name: 'Financiamento Caixa',
        bank: 'Caixa',
        kind: 'Operação de crédito',
        dueDate: '2026-05-12',
        amount: 735.18,
        confidence: 93,
        status: 'confirmed',
        evidence: 'Próxima parcela de contrato ativo retornada no compartilhamento.'
      }
    ]
  },
  {
    id: 'santander',
    name: 'Santander',
    shortName: 'SAN',
    permissions: ['cards', 'credit', 'account'],
    description: 'Cartões, conta e empréstimos.',
    items: [
      {
        id: 'santander-card-2026-05',
        name: 'Fatura Santander',
        bank: 'Santander',
        kind: 'Cartão de crédito',
        dueDate: '2026-05-08',
        amount: 476.53,
        confidence: 97,
        status: 'confirmed',
        evidence: 'Fatura aberta para pagamento com vencimento definido.'
      }
    ]
  },
  {
    id: 'inter',
    name: 'Inter',
    shortName: 'Inter',
    permissions: ['cards', 'account'],
    description: 'Cartão e conta digital.',
    items: [
      {
        id: 'inter-card-2026-05',
        name: 'Fatura Inter',
        bank: 'Inter',
        kind: 'Cartão de crédito',
        dueDate: '2026-05-25',
        amount: 286.41,
        confidence: 96,
        status: 'confirmed',
        evidence: 'Fatura fechada disponível no compartilhamento de cartão.'
      }
    ]
  }
];

const bulkPaymentModal = document.getElementById('bulkPaymentModal');
const bulkPaymentValueInput = document.getElementById('bulkPaymentValue');
const bulkPaymentStatus = document.getElementById('bulkPaymentStatus');
const confirmBulkPaymentBtn = document.getElementById('confirmBulkPaymentBtn');
const cancelBulkPaymentBtn = document.getElementById('cancelBulkPaymentBtn');
const openBulkPaymentBtn = document.getElementById('openBulkPaymentBtn');
const bulkPaymentHistoryActions = document.getElementById('bulkPaymentHistoryActions');
const adjustLastBulkPaymentBtn = document.getElementById('adjustLastBulkPaymentBtn');
const deleteLastBulkPaymentBtn = document.getElementById('deleteLastBulkPaymentBtn');

const PENDING_UPDATE_VERSION_KEY = 'pending-app-update-version';
const WEB_BUNDLE_STORAGE_KEY = 'cf-active-web-bundle';
const MAX_WEB_BUNDLE_CHARS = 1024 * 1024;
const NOTIFICATION_PREFERENCE_KEY = 'payment-notifications-preference-v1';

const SCHEDULED_NOTIFICATION_IDS_KEY = 'payment-notification-ids-v1';
const NOTIFICATION_CHANNEL_ID = 'payment-reminders-v2';
const SUPPORT_NOTIFICATION_CHANNEL_ID = 'support-messages-v1';
const NOTIFICATION_SOUND_FILE = 'payment_reminder.wav';
const PAYMENT_NOTIFICATION_LIMIT = 120;
const PAYMENT_NOTIFICATION_HOUR = 9;
const BULK_PAYMENT_HISTORY_LIMIT = 10;
const APP_APK_FILE_NAME = 'Controle.de.Dividas.apk';
const APP_APK_FILE_URL_NAME = encodeURIComponent(APP_APK_FILE_NAME);
const APP_SHARE_URL = `https://github.com/WSPREDADOR/controle-financeiro/releases/latest/download/${APP_APK_FILE_URL_NAME}`;

const FIRST_USE_TUTORIAL_STEPS = [
  {
    element: '.topbar-brand',
    kicker: 'Boas-vindas!',
    title: 'Olá! Que bom te ver.',
    description: 'Este é o seu Controle de Dívidas. Vamos te mostrar como dar os primeiros passos para organizar sua vida financeira.',
    position: 'bottom'
  },
  {
    element: '.finance-hub',
    kicker: 'Visão Geral',
    title: 'Resumo do Mês',
    description: 'Aqui em cima você acompanha o total que tem para pagar este mês, o saldo que informou e quanto sobrará (projeção).',
    position: 'bottom'
  },
  {
    element: '#openMonthlyBalanceModalBtn',
    kicker: 'Configuração',
    title: 'Informe seu Saldo',
    description: 'Toque no ícone do lápis para informar quanto você recebeu ou tem disponível para pagar as contas deste mês.',
    position: 'bottom'
  },
  {
    element: '.calculator-card',
    kicker: 'Cadastro',
    title: 'Adicione Compromissos',
    description: 'Use o botão Adicionar para cadastrar novas dívidas, parcelas, contas fixas ou despesas eventuais.',
    position: 'top'
  },
  {
    element: '.plans-panel',
    kicker: 'Gestão',
    title: 'Sua Lista',
    description: 'Aqui aparecerão todos os seus compromissos. Você pode filtrar por tipo e tocar neles para ver detalhes e marcar pagamentos.',
    position: 'top'
  },
  {
    element: '#openAppSettingsModalBtn',
    kicker: 'Personalização',
    title: 'Ajustes e Mais',
    description: 'Nas configurações você pode ver o seu ID de suporte único ou rever este tutorial sempre que precisar.',
    position: 'bottom'
  }
];

let tourOverlay = null;
let tourPopover = null;
let tourBackdrop = null;

function createTourUI() {
  if (tourOverlay) return;

  tourOverlay = document.createElement('div');
  tourOverlay.className = 'tour-overlay';
  tourOverlay.id = 'tourOverlay';
  tourOverlay.innerHTML = `
    <div class="tour-backdrop" id="tourBackdrop"></div>
    <div class="tour-popover" id="tourPopover">
      <div class="tour-header">
        <img src="logo.png" alt="" class="tour-mascot-mini">
        <div class="tour-heading">
          <span class="section-kicker" id="tourKicker"></span>
          <h3 id="tourTitle"></h3>
        </div>
      </div>
      <p class="tour-description" id="tourDescription"></p>
      <div class="tour-footer">
        <div class="tour-dots" id="tourDots"></div>
        <div class="tour-actions">
          <button type="button" class="tour-btn tour-btn-skip" id="tourSkipBtn">Pular</button>
          <button type="button" class="tour-btn tour-btn-prev" id="tourPrevBtn">Voltar</button>
          <button type="button" class="tour-btn tour-btn-next" id="tourNextBtn">Próximo</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tourOverlay);

  tourBackdrop = document.getElementById('tourBackdrop');
  tourPopover = document.getElementById('tourPopover');

  document.getElementById('tourSkipBtn').addEventListener('click', () => closeAppTutorial());
  document.getElementById('tourPrevBtn').addEventListener('click', showPreviousAppTutorialStep);
  document.getElementById('tourNextBtn').addEventListener('click', showNextAppTutorialStep);
}

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
    let localMirrorUpdated = false;

    try {
      localStorage.setItem(key, value);
      localMirrorUpdated = true;
    } catch (_) {}

    try {
      const prefs = this._prefs();
      if (prefs) {
        await prefs.set({ key, value });
        return;
      }
    } catch (_) {}

    if (!localMirrorUpdated) {
      localStorage.setItem(key, value);
    }
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
  currentVersion: '2.3.9',
  bundleManifestUrl: 'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-manifest.json',
  bundleManifestFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-manifest.json',
  releaseApiUrl: 'https://api.github.com/repos/WSPREDADOR/controle-financeiro/releases/latest',
  checkOnStartup: true,
  requestTimeoutMs: 6000,
  recheckIntervalMs: 45000
};

function finishStartupScreen() {
  document.body.classList.remove('app-booting');
  document.body.classList.add('app-ready');

  if (!startupScreen) {
    return;
  }

  startupScreen.setAttribute('aria-hidden', 'true');

  const shouldReduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  window.setTimeout(() => {
    startupScreen.hidden = true;
  }, shouldReduceMotion ? 80 : 520);
}

function scheduleStartupFinish() {
  const shouldReduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const delay = shouldReduceMotion ? 40 : 260;

  window.setTimeout(() => {
    window.requestAnimationFrame?.(finishStartupScreen) ?? finishStartupScreen();
  }, delay);
}

currentDate.textContent = formatDate(normalizeDate(new Date()));
updateDisplayedAppVersion();
renderPlansList();
updateResultsNavigation();

// Migra dados do localStorage para armazenamento nativo (executa em background)
(async () => {
  try {
    await Storage.migrate(STORAGE_KEY);
    await Storage.migrate(MONTHLY_BALANCES_KEY);
    await Storage.migrate(NOTIFICATION_PREFERENCE_KEY);
    await Storage.migrate(PENDING_UPDATE_VERSION_KEY);
    await Storage.migrate(USER_NAME_KEY);
    await Storage.migrate(USER_ID_KEY);
    await Storage.migrate(SUPPORT_DEVICE_TOKEN_KEY);
    await Storage.migrate(SUPPORT_LAST_CHECKIN_KEY);
    await Storage.migrate(SUPPORT_LICENSE_STATUS_KEY);
    await Storage.migrate(SUPPORT_REMOTE_MESSAGE_KEY);
    await Storage.migrate(SUPPORT_CHAT_LAST_OPEN_KEY);
    await Storage.migrate(SUPPORT_LAST_NOTIFIED_MESSAGE_KEY);
    await Storage.migrate(TUTORIAL_COMPLETED_KEY);

    await checkOnboarding();
    await initializeSupportSync();

    monthlyBalances = await loadMonthlyBalancesAsync();
    updateMonthlyBalanceSummary(currentMonthlyDebtTotal);

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
  } catch (error) {
    console.warn('Nao foi possivel concluir a preparacao inicial do app.', error);
  } finally {
    scheduleStartupFinish();
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

  const planType = getSelectedCreatePlanType();
  const isExpense = planType === PLAN_TYPE_EXPENSE;
  const isAccount = planType === PLAN_TYPE_ACCOUNT;

  const planName = createPlanNameInput.value.trim();
  const startInput = createStartDateInput.value;
  const installmentValue = parseCurrencyToNumber(createInstallmentValueInput?.value);
  let monthsInput, countMode;

  if (isExpense) {
    monthsInput = CONTINUOUS_EXPENSE_MONTHS;
    countMode = DEFAULT_COUNT_MODE;
  } else if (isAccount) {
    monthsInput = 1;
    countMode = DEFAULT_COUNT_MODE;
  } else {
    monthsInput = Number.parseInt(createTotalMonthsInput.value, 10);
    countMode = DEFAULT_COUNT_MODE;
    if (Number.isNaN(monthsInput) || monthsInput <= 0) {
      setCreateStatus('Preencha o nome do compromisso, uma data válida e um total de meses maior que zero.', 'error');
      return;
    }
  }

  if (!planName || !startInput) {
    setCreateStatus('Preencha o nome do compromisso e uma data de início.', 'error');
    return;
  }

  if (isAccount && installmentValue <= MONEY_EPSILON) {
    setCreateStatus('Preencha o nome da conta, a data de pagamento e o valor que será pago.', 'error');
    return;
  }

  const totalValue = isAccount
    ? installmentValue
    : parseCurrencyToNumber(createTotalValueInput?.value);
  const nextPlan = {
    id: createPlanId(),
    name: planName,
    startDate: startInput,
    totalMonths: monthsInput,
    countMode: DEFAULT_COUNT_MODE,
    planType,
    isExpense,
    totalValue,
    installmentValue,
    manualMonthValues: {},
    partialMonthCredits: {},
    paidMonths: (isExpense || isAccount) ? [] : buildInitialPaidMonths(startInput, countMode, monthsInput)
  };

  plans.unshift(nextPlan);

  selectedPlanId = nextPlan.id;
  savePlans();
  renderPlansList();
  renderPlanDetails(nextPlan, { resetTimelineScroll: true });
  closeCreateModal();
  const historyMessage = nextPlan.paidMonths.length > 0
    ? ` ${nextPlan.paidMonths.length} ${nextPlan.paidMonths.length === 1 ? 'parcela anterior foi marcada como paga.' : 'parcelas anteriores foram marcadas como pagas.'}`
    : '';
  const successMessage = isAccount
    ? `Conta "${nextPlan.name}" cadastrada com sucesso.`
    : `Compromisso "${nextPlan.name}" cadastrado com sucesso.${historyMessage}`;
  setStatus(`${successMessage} Para editar depois, use o botão Editar na lista.`, 'success');
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
  setStatus('', '');
});

monthlyContainer.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-value-month]');

  if (editButton) {
    openInstallmentValuePrompt(event, editButton.dataset.editValueMonth);
    return;
  }

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

cancelPromptValueBtn?.addEventListener('click', closeInstallmentValuePrompt);
confirmPromptValueBtn?.addEventListener('click', saveInstallmentValuePrompt);
openMonthlyBalanceModalBtn?.addEventListener('click', openMonthlyBalanceModal);
closeMonthlyBalanceModalBtn?.addEventListener('click', closeMonthlyBalanceModal);
cancelMonthlyBalanceBtn?.addEventListener('click', closeMonthlyBalanceModal);
saveMonthlyBalanceBtn?.addEventListener('click', saveMonthlyBalanceModal);
replaceMonthlyBalanceBtn?.addEventListener('click', replaceMonthlyBalanceModal);
openMonthlyOverviewModalBtn?.addEventListener('click', openMonthlyOverviewModal);
closeMonthlyOverviewModalBtn?.addEventListener('click', closeMonthlyOverviewModal);
monthlyBalanceInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    saveMonthlyBalanceModal();
  }
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

  const previousOrderSignature = getReorderDomOrderSignature();
  const nextItem = getReorderInsertTarget(clientY);

  if (!nextItem) {
    reorderList.appendChild(draggedItem);
  } else if (nextItem !== draggedItem) {
    reorderList.insertBefore(draggedItem, nextItem);
  }

  syncReorderNumbersFromDom();

  if (getReorderDomOrderSignature() !== previousOrderSignature) {
    scheduleReorderAutosave();
  }
}

function handleReorderEnd() {
  if (!draggedReorderPlanId) return;
  flushReorderAutosave({ silentWhenUnchanged: true });
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

openStatementImportModalBtn?.addEventListener('click', openStatementImportModal);
closeStatementImportModalBtn?.addEventListener('click', closeStatementImportModal);
cancelStatementImportBtn?.addEventListener('click', closeStatementImportModal);
backStatementImportBtn?.addEventListener('click', () => setStatementImportStage('file'));
analyzeStatementFileBtn?.addEventListener('click', analyzeStatementImportFile);
confirmStatementImportBtn?.addEventListener('click', confirmStatementDetectedItems);
statementFileInput?.addEventListener('change', handleStatementFileSelection);

statementImportModal?.addEventListener('click', (event) => {
  if (event.target === statementImportModal) {
    closeStatementImportModal();
  }
});

openBankImportModalBtn?.addEventListener('click', openBankImportModal);
closeBankImportModalBtn?.addEventListener('click', closeBankImportModal);
cancelBankImportBtn?.addEventListener('click', closeBankImportModal);
backBankImportBtn?.addEventListener('click', goBackBankImportStage);
continueBankConsentBtn?.addEventListener('click', continueBankImportConsent);
simulateBankReadBtn?.addEventListener('click', simulateBankImportRead);
confirmBankImportBtn?.addEventListener('click', confirmBankDetectedItems);

bankImportModal?.addEventListener('click', (event) => {
  if (event.target === bankImportModal) {
    closeBankImportModal();
  }
});

editForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!editingPlanId) {
    closeEditModal();
    return;
  }

  const planName = editPlanNameInput.value.trim();
  const startInput = editStartDateInput.value;
  const totalVal = parseCurrencyToNumber(editTotalValueInput?.value);
  const instVal = parseCurrencyToNumber(editInstallmentValueInput?.value);

  const existingPlanIndex = plans.findIndex((plan) => plan.id === editingPlanId);

  if (existingPlanIndex < 0) {
    closeEditModal();
    setStatus('Não foi possível localizar esse compromisso para editar.', 'error');
    return;
  }

  const existingPlan = plans[existingPlanIndex];
  const existingPlanType = getPlanType(existingPlan);
  const isExpense = existingPlanType === PLAN_TYPE_EXPENSE;
  const isAccount = existingPlanType === PLAN_TYPE_ACCOUNT;
  const monthsInput = isExpense
    ? getPlanMonthLimit(existingPlan) || CONTINUOUS_EXPENSE_MONTHS
    : isAccount
      ? 1
      : Number.parseInt(editTotalMonthsInput.value, 10);

  if (!planName || !startInput || Number.isNaN(monthsInput) || monthsInput <= 0) {
    setEditStatus('Preencha o nome do compromisso, uma data válida e um total de meses maior que zero.', 'error');
    return;
  }

  if (isAccount && instVal <= MONEY_EPSILON) {
    setEditStatus('Preencha o nome da conta, a data de pagamento e o valor que será pago.', 'error');
    return;
  }

  const countMode = isValidCountMode(existingPlan.countMode) ? existingPlan.countMode : DEFAULT_COUNT_MODE;
  const updatedPlan = {
    ...existingPlan,
    name: planName,
    startDate: startInput,
    totalMonths: monthsInput,
    countMode,
    planType: existingPlanType,
    isExpense,
    paidMonths: sanitizePaidMonths(existingPlan.paidMonths ?? [], monthsInput),
    totalValue: isAccount ? instVal : totalVal,
    installmentValue: instVal,
  };

  applyPastMonthsEditStatus(updatedPlan);
  cleanupPartialMonthCredits(updatedPlan);

  plans[existingPlanIndex] = updatedPlan;
  selectedPlanId = updatedPlan.id;
  savePlans();
  renderPlansList();
  renderPlanDetails(updatedPlan, { resetTimelineScroll: true });
  const editHistoryMessage = buildEditPastMonthsStatusMessage();
  closeEditModal();
  setStatus(`Compromisso "${updatedPlan.name}" atualizado com sucesso.${editHistoryMessage}`, 'success');
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

openSupportModalBtn?.addEventListener('click', () => {
  openSupportModal();
});

closeSupportModalBtn?.addEventListener('click', () => {
  closeSupportModal();
});

openNativeAppSettingsBtn?.addEventListener('click', async () => {
  await getNotificationPermissionsPlugin()?.openAppSettings?.();
});

contactDevBtn?.addEventListener('click', async () => {
  const phone = '5594992592305'; 
  const name = (await Storage.get(USER_NAME_KEY)) || '(seu nome aqui)';
  const message = encodeURIComponent(`Olá Sr Werbert Silva, me chamo ${name}, vim através do seu app Controle de Dívidas!`);
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
});

shareAppBtn?.addEventListener('click', () => {
  toggleShareOptionsPanel();
});

restartTutorialBtn?.addEventListener('click', () => {
  closeAppSettingsModal();
  openAppTutorial();
});

supportChatSendBtn?.addEventListener('click', () => {
  sendSupportChatMessage();
});

supportChatImageBtn?.addEventListener('click', () => {
  supportChatImageInput?.click();
});

supportChatImageInput?.addEventListener('change', () => {
  const file = supportChatImageInput.files?.[0];
  if (file) {
    sendSupportChatImage(file);
  }
  supportChatImageInput.value = '';
});

supportChatInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendSupportChatMessage();
  }
});

supportChatInput?.addEventListener('input', () => {
  queueSupportTypingState();
});

supportChatMessages?.addEventListener('click', (event) => {
  const image = event.target.closest('[data-support-open-image]');
  if (image?.dataset.supportOpenImage) {
    window.open(image.dataset.supportOpenImage, '_blank', 'noopener,noreferrer');
  }
});

nativeShareAppBtn?.addEventListener('click', async () => {
  await shareAppWithSystem();
});

shareWhatsappBtn?.addEventListener('click', () => {
  window.open(`https://wa.me/?text=${encodeURIComponent(getAppShareMessage())}`, '_blank');
});

shareTelegramBtn?.addEventListener('click', () => {
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(APP_SHARE_URL)}&text=${encodeURIComponent('Controle de Dívidas')}`,
    '_blank'
  );
});

shareEmailBtn?.addEventListener('click', () => {
  const subject = encodeURIComponent('Controle de Dívidas');
  const body = encodeURIComponent(getAppShareMessage());
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

shareSmsBtn?.addEventListener('click', () => {
  window.location.href = `sms:?body=${encodeURIComponent(getAppShareMessage())}`;
});

copyAppLinkBtn?.addEventListener('click', async () => {
  const copied = await copyTextToClipboard(APP_SHARE_URL);
  setShareCopyStatus(
    copied ? 'Link copiado.' : 'Não foi possível copiar o link.',
    copied ? 'success' : 'error'
  );
});

function getAppShareMessage() {
  return `Baixe o app Controle de Dívidas: ${APP_SHARE_URL}`;
}

function toggleShareOptionsPanel() {
  if (!shareOptionsPanel) {
    return;
  }

  const shouldShow = shareOptionsPanel.hidden;
  shareOptionsPanel.hidden = !shouldShow;
  setShareCopyStatus('');

  if (shouldShow) {
    window.setTimeout(() => {
      nativeShareAppBtn?.focus();
    }, 20);
  }
}

async function shareAppWithSystem() {
  const nativeShare = getNativeSharePlugin();
  const payload = {
    title: 'Controle de Dívidas',
    text: 'Baixe o app Controle de Dívidas.',
    url: APP_SHARE_URL
  };

  if (isNativeAndroidApp() && nativeShare?.share) {
    try {
      await nativeShare.share(payload);
      setShareCopyStatus('');
      return;
    } catch (_) {}
  }

  if (navigator.share) {
    try {
      await navigator.share(payload);
      setShareCopyStatus('');
      return;
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }
    }
  }

  const copied = await copyTextToClipboard(APP_SHARE_URL);
  setShareCopyStatus(
    copied ? 'Link copiado.' : 'Compartilhamento indisponível neste dispositivo.',
    copied ? 'success' : 'error'
  );
}

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}

  try {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    return copied;
  } catch (_) {
    return false;
  }
}

function setShareCopyStatus(message, type = '') {
  if (!shareCopyStatus) {
    return;
  }

  shareCopyStatus.textContent = message;
  shareCopyStatus.hidden = !message;
  shareCopyStatus.className = 'share-copy-status';

  if (type === 'error') {
    shareCopyStatus.classList.add('error');
  }
}

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
    syncModalBodyState();
    window.setTimeout(() => {
      userNameInput?.focus();
    }, 100);
    return;
  }

  updateUserInfoUI(name, id);
  await maybeShowFirstUseTutorial();
}

function updateUserInfoUI(name, id) {
  document.querySelectorAll('.display-user-name-placeholder').forEach((el) => {
    el.textContent = name;
  });
  if (displayUserName) displayUserName.textContent = name;
  if (userGreeting) userGreeting.hidden = false;
  if (settingsUserId) settingsUserId.textContent = id;
}

function getSupportConfig() {
  return {
    enabled: false,
    supabaseUrl: '',
    supabaseAnonKey: '',
    checkInIntervalMs: 30000,
    requestTimeoutMs: 8000,
    ...(window.CF_SUPPORT_CONFIG || {})
  };
}

function isSupportConfigured(config = getSupportConfig()) {
  return Boolean(config.enabled && config.supabaseUrl && config.supabaseAnonKey);
}

async function initializeSupportSync() {
  await refreshSupportUi();
  registerPaymentNotificationListeners();

  const config = getSupportConfig();
  if (!isSupportConfigured(config)) {
    return;
  }

  syncSupportCheckIn({ reason: 'startup' });

  if (supportSyncIntervalId) {
    window.clearInterval(supportSyncIntervalId);
  }

  supportSyncIntervalId = window.setInterval(() => {
    syncSupportCheckIn({ reason: 'interval' });
  }, Math.max(30000, Number(config.checkInIntervalMs) || 120000));

  loadSupportChatMessages();

  if (supportChatIntervalId) {
    window.clearInterval(supportChatIntervalId);
  }

  supportChatIntervalId = window.setInterval(() => {
    loadSupportChatMessages({ silent: true });
  }, 5000);
}

async function refreshSupportUi() {
  const config = getSupportConfig();
  const lastCheckIn = await Storage.get(SUPPORT_LAST_CHECKIN_KEY);
  const licenseStatus = await Storage.get(SUPPORT_LICENSE_STATUS_KEY) || 'free';
  const remoteMessage = await Storage.get(SUPPORT_REMOTE_MESSAGE_KEY) || '';

  updateSupportLicenseBadge(licenseStatus);

  if (supportConnectionStatus) {
    supportConnectionStatus.textContent = isSupportConfigured(config)
      ? 'Sincronização ativa quando houver internet'
      : 'Suporte remoto não configurado';
  }

  if (supportLastCheckIn) {
    supportLastCheckIn.textContent = lastCheckIn ? formatDateTime(new Date(lastCheckIn)) : 'Nunca';
  }

  if (supportRemoteMessage) {
    supportRemoteMessage.textContent = remoteMessage || 'Nenhum aviso.';
  }

  if (supportChatInput) supportChatInput.disabled = !isSupportConfigured(config);
  if (supportChatSendBtn) supportChatSendBtn.disabled = !isSupportConfigured(config);
  if (supportChatImageBtn) supportChatImageBtn.disabled = !isSupportConfigured(config);

  applySupportLicenseStatus(licenseStatus, remoteMessage);
}

function updateSupportLicenseBadge(status) {
  if (!supportLicenseBadge) {
    return;
  }

  const normalizedStatus = normalizeLicenseStatus(status);
  const labels = {
    free: 'Gratuito',
    trial: 'Teste',
    premium: 'Premium',
    blocked: 'Bloqueado'
  };

  supportLicenseBadge.textContent = labels[normalizedStatus] || labels.free;
  supportLicenseBadge.className = `support-license-badge is-${normalizedStatus}`;
}

function normalizeLicenseStatus(status) {
  return ['free', 'trial', 'premium', 'blocked'].includes(status) ? status : 'free';
}

async function syncSupportCheckIn(options = {}) {
  const config = getSupportConfig();
  if (!isSupportConfigured(config) || isSupportSyncInFlight) {
    return;
  }

  const supportId = await Storage.get(USER_ID_KEY);
  const userName = await Storage.get(USER_NAME_KEY);

  if (!supportId || !userName) {
    return;
  }

  isSupportSyncInFlight = true;
  if (options.showFeedback && supportConnectionStatus) {
    supportConnectionStatus.textContent = 'Sincronizando...';
  }

  try {
    const deviceToken = await getSupportDeviceToken();
    const deviceInfo = await getSupportDeviceInfo();
    const updateConfig = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };
    const result = await callSupportRpc('app_check_in', {
      p_support_id: supportId,
      p_device_token: deviceToken,
      p_user_name: userName,
      p_device_name: deviceInfo.deviceName,
      p_device_model: deviceInfo.deviceModel,
      p_platform: deviceInfo.platform,
      p_app_version: getCurrentAppVersion(updateConfig)
    }, config);

    if (!result?.ok) {
      throw new Error(result?.error || 'Falha ao sincronizar suporte.');
    }

    const now = new Date().toISOString();
    await Storage.set(SUPPORT_LAST_CHECKIN_KEY, now);
    await handleSupportDeviceState(result.device || {});
    await handleSupportCommands(result.commands || [], { supportId, deviceToken });
    await refreshSupportUi();

    if (options.showFeedback) {
      setStatus('Suporte sincronizado com sucesso.', 'success');
    }
  } catch (error) {
    if (supportConnectionStatus) {
      supportConnectionStatus.textContent = 'Sem conexão com o suporte';
    }

    if (options.showFeedback) {
      setStatus('Não foi possível sincronizar o suporte agora.', 'error');
    }
  } finally {
    isSupportSyncInFlight = false;
  }
}

async function getSupportDeviceToken() {
  let token = await Storage.get(SUPPORT_DEVICE_TOKEN_KEY);
  if (token) {
    return token;
  }

  token = generateSecureToken();
  await Storage.set(SUPPORT_DEVICE_TOKEN_KEY, token);
  return token;
}

function generateSecureToken() {
  const bytes = new Uint8Array(24);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

async function getSupportDeviceInfo() {
  const capacitorPlatform = window.Capacitor?.getPlatform?.();
  const devicePlugin = window.Capacitor?.Plugins?.Device;

  if (devicePlugin?.getInfo) {
    try {
      const info = await devicePlugin.getInfo();
      return {
        deviceName: info.name || info.model || info.manufacturer || 'Dispositivo Android',
        deviceModel: [info.manufacturer, info.model, info.osVersion].filter(Boolean).join(' ') || navigator.userAgent,
        platform: info.platform || info.operatingSystem || capacitorPlatform || navigator.platform || 'web'
      };
    } catch (_) {}
  }

  return {
    deviceName: navigator.platform || capacitorPlatform || 'Dispositivo',
    deviceModel: navigator.userAgent || 'Modelo não informado',
    platform: capacitorPlatform || navigator.platform || 'web'
  };
}

async function callSupportRpc(functionName, payload, config = getSupportConfig()) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), Number(config.requestTimeoutMs) || 8000);

  try {
    const baseUrl = config.supabaseUrl.replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || `Erro ${response.status}`);
    }

    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function handleSupportDeviceState(device) {
  const status = normalizeLicenseStatus(device.license_status);
  const message = typeof device.remote_message === 'string' ? device.remote_message : '';
  await Storage.set(SUPPORT_LICENSE_STATUS_KEY, status);
  await Storage.set(SUPPORT_REMOTE_MESSAGE_KEY, message);
  updateSupportLicenseBadge(status);
  if (supportRemoteMessage) {
    supportRemoteMessage.textContent = message || 'Nenhum aviso.';
  }
  applySupportLicenseStatus(status, message);
}

function applySupportLicenseStatus(status, message = '') {
  const normalizedStatus = normalizeLicenseStatus(status);

  if (normalizedStatus === 'blocked') {
    showSupportBlockedOverlay(message);
    return;
  }

  hideSupportBlockedOverlay();
}

function showSupportBlockedOverlay(message = '') {
  let overlay = document.getElementById('supportBlockedOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'supportBlockedOverlay';
    overlay.className = 'support-blocked-overlay';
    overlay.innerHTML = `
      <section class="support-blocked-card" role="dialog" aria-modal="true" aria-labelledby="supportBlockedTitle">
        <span class="section-kicker">Licença</span>
        <h2 id="supportBlockedTitle">Acesso pausado</h2>
        <p id="supportBlockedMessage"></p>
        <strong id="supportBlockedId"></strong>
        <button type="button" class="btn-whatsapp" id="supportBlockedContactBtn">Falar com o suporte</button>
      </section>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#supportBlockedContactBtn')?.addEventListener('click', async () => {
      const phone = '5594992592305';
      const id = await Storage.get(USER_ID_KEY);
      const name = await Storage.get(USER_NAME_KEY);
      const text = encodeURIComponent(`Olá Sr Werbert Silva, sou ${name || 'usuário'} e meu ID é ${id || 'não informado'}. Preciso verificar meu acesso.`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  }

  overlay.hidden = false;
  overlay.querySelector('#supportBlockedMessage').textContent = message || 'Entre em contato com o suporte para regularizar seu acesso.';
  Storage.get(USER_ID_KEY).then((id) => {
    const idElement = overlay.querySelector('#supportBlockedId');
    if (idElement) idElement.textContent = id ? `ID: ${id}` : '';
  });
}

function hideSupportBlockedOverlay() {
  const overlay = document.getElementById('supportBlockedOverlay');
  if (overlay) {
    overlay.hidden = true;
  }
}

async function handleSupportCommands(commands, identity) {
  for (const command of commands) {
    try {
      await executeSupportCommand(command);
      await acknowledgeSupportCommand(command.id, identity, 'done', 'Executado');
    } catch (error) {
      await acknowledgeSupportCommand(command.id, identity, 'failed', error?.message || 'Falha ao executar');
    }
  }
}

async function executeSupportCommand(command) {
  const payload = command?.payload || {};

  if (command.command_type === 'show_message') {
    const message = String(payload.message || '').trim();
    if (message) {
      await Storage.set(SUPPORT_REMOTE_MESSAGE_KEY, message);
      if (supportRemoteMessage) supportRemoteMessage.textContent = message;
      setStatus(message, 'success');
    }
    return;
  }

  if (command.command_type === 'force_update') {
    checkForUpdates({ force: true });
  }
}

async function acknowledgeSupportCommand(commandId, identity, status, result) {
  if (!commandId) {
    return;
  }

  await callSupportRpc('app_ack_command', {
    p_support_id: identity.supportId,
    p_device_token: identity.deviceToken,
    p_command_id: commandId,
    p_status: status,
    p_result: result
  });
}

async function getSupportIdentity() {
  const supportId = await Storage.get(USER_ID_KEY);
  const deviceToken = await getSupportDeviceToken();

  if (!supportId || !deviceToken) {
    return null;
  }

  return { supportId, deviceToken };
}

function isSupportChatVisible() {
  return Boolean(
    supportModal &&
    !supportModal.hidden &&
    document.visibilityState !== 'hidden' &&
    isNativeAppActive
  );
}

async function handleSupportAdminMessageNotifications(messages, options = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return;
  }

  const adminMessages = messages
    .filter((message) => message?.sender === 'admin')
    .sort((left, right) => new Date(left.created_at) - new Date(right.created_at));

  const latestAdminMessage = adminMessages[adminMessages.length - 1];
  if (!latestAdminMessage?.id) {
    return;
  }

  if (options.markRead || isSupportChatVisible()) {
    await Storage.set(SUPPORT_LAST_NOTIFIED_MESSAGE_KEY, latestAdminMessage.id);
    await Storage.set(SUPPORT_CHAT_LAST_OPEN_KEY, new Date().toISOString());
    return;
  }

  const unreadAdminMessages = adminMessages.filter((message) => !message.read_at);
  const messageToNotify = unreadAdminMessages[unreadAdminMessages.length - 1];
  if (!messageToNotify?.id) {
    return;
  }

  const lastNotifiedMessageId = await Storage.get(SUPPORT_LAST_NOTIFIED_MESSAGE_KEY);
  if (lastNotifiedMessageId === messageToNotify.id) {
    return;
  }

  showSupportMessagePopup(messageToNotify, unreadAdminMessages.length);
  await scheduleSupportMessageNotification(messageToNotify, unreadAdminMessages.length);
  await Storage.set(SUPPORT_LAST_NOTIFIED_MESSAGE_KEY, messageToNotify.id);
}

function getSupportMessagePreview(message) {
  if (message?.message_type === 'image') {
    return 'O suporte enviou uma imagem.';
  }

  return String(message?.message || 'Nova resposta do suporte.').trim().slice(0, 180);
}

function showSupportMessagePopup(message, unreadCount = 1) {
  if (!message?.id || !isNativeAppActive || document.visibilityState === 'hidden' || isSupportChatVisible()) {
    return;
  }

  let popup = document.getElementById('supportMessagePopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'supportMessagePopup';
    popup.className = 'support-message-popup';
    popup.innerHTML = `
      <section class="support-message-popup-card" role="dialog" aria-modal="false" aria-labelledby="supportMessagePopupTitle">
        <button type="button" class="support-message-popup-close" id="supportMessagePopupClose" aria-label="Fechar aviso" title="Fechar">×</button>
        <span class="section-kicker">Suporte</span>
        <h2 id="supportMessagePopupTitle"></h2>
        <p id="supportMessagePopupText"></p>
        <div class="support-message-popup-actions">
          <button type="button" class="btn-secondary" id="supportMessagePopupLater">Depois</button>
          <button type="button" class="btn-primary" id="supportMessagePopupOpen">Ver mensagem</button>
        </div>
      </section>
    `;
    document.body.appendChild(popup);
    popup.querySelector('#supportMessagePopupClose')?.addEventListener('click', hideSupportMessagePopup);
    popup.querySelector('#supportMessagePopupLater')?.addEventListener('click', hideSupportMessagePopup);
    popup.querySelector('#supportMessagePopupOpen')?.addEventListener('click', () => {
      hideSupportMessagePopup();
      openSupportModal();
    });
    popup.addEventListener('click', (event) => {
      if (event.target === popup) {
        hideSupportMessagePopup();
      }
    });
  }

  const title = unreadCount > 1 ? `${unreadCount} mensagens do suporte` : 'Resposta do suporte';
  popup.querySelector('#supportMessagePopupTitle').textContent = title;
  popup.querySelector('#supportMessagePopupText').textContent = getSupportMessagePreview(message);
  popup.dataset.messageId = message.id;
  popup.hidden = false;
  window.setTimeout(() => popup.classList.add('is-visible'), 20);
}

function hideSupportMessagePopup() {
  const popup = document.getElementById('supportMessagePopup');
  if (!popup) {
    return;
  }

  popup.classList.remove('is-visible');
  window.setTimeout(() => {
    if (!popup.classList.contains('is-visible')) {
      popup.hidden = true;
    }
  }, 180);
}

async function scheduleSupportMessageNotification(message, unreadCount = 1) {
  const plugin = getLocalNotificationsPlugin();
  if (!plugin) {
    return;
  }

  const permission = await requestPaymentNotificationPermission();
  if (permission !== 'granted') {
    return;
  }

  await createSupportNotificationChannel();

  const body = getSupportMessagePreview(message);

  try {
    await plugin.schedule({
      notifications: [{
        id: createSupportNotificationId(message.id),
        title: unreadCount > 1 ? `${unreadCount} mensagens do suporte` : 'Resposta do suporte',
        body,
        largeBody: body,
        summaryText: 'Falar com suporte',
        channelId: SUPPORT_NOTIFICATION_CHANNEL_ID,
        autoCancel: true,
        extra: {
          type: 'support_chat',
          messageId: message.id
        }
      }]
    });
  } catch (_) {}
}

async function createSupportNotificationChannel() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin?.createChannel) {
    return;
  }

  try {
    await plugin.createChannel({
      id: SUPPORT_NOTIFICATION_CHANNEL_ID,
      name: 'Mensagens do suporte',
      description: 'Avisos quando o suporte responder no chat.',
      importance: 4,
      visibility: 1,
      lights: true,
      lightColor: '#55d4cb',
      vibration: true
    });
  } catch (_) {}
}

function createSupportNotificationId(messageId) {
  const source = `support:${messageId}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index);
    hash |= 0;
  }

  return 300000000 + ((hash >>> 0) % 1200000000);
}

async function loadSupportChatMessages(options = {}) {
  const config = getSupportConfig();
  if (!isSupportConfigured(config) || isSupportChatInFlight) {
    return;
  }

  const identity = await getSupportIdentity();
  if (!identity) {
    return;
  }

  isSupportChatInFlight = true;
  const markRead = options.markRead ?? isSupportChatVisible();

  try {
    const result = await listSupportMessagesRpc(identity, markRead, config);

    if (!result?.ok) {
      throw new Error(result?.error || 'Falha ao carregar conversa.');
    }

    await handleSupportDeviceState(result.device || {});
    await handleSupportAdminMessageNotifications(result.messages || [], { markRead });
    renderSupportChatMessages(result.messages || []);
    updateSupportAdminPresence(result.device || {});

    if (!options.silent) {
      setSupportChatStatus('');
    }
  } catch (_) {
    if (!options.silent) {
      setSupportChatStatus('Não foi possível atualizar a conversa agora.', 'error');
    }
  } finally {
    isSupportChatInFlight = false;
  }
}

async function listSupportMessagesRpc(identity, markRead, config) {
  const payload = {
    p_support_id: identity.supportId,
    p_device_token: identity.deviceToken,
    p_mark_read: markRead
  };

  try {
    return await callSupportRpc('app_list_support_messages', payload, config);
  } catch (error) {
    const message = String(error?.message || '').toLowerCase();
    const canRetryWithoutMarkRead =
      message.includes('p_mark_read') ||
      message.includes('schema cache') ||
      message.includes('could not find') ||
      message.includes('function');

    if (!canRetryWithoutMarkRead) {
      throw error;
    }

    return await callSupportRpc('app_list_support_messages', {
      p_support_id: identity.supportId,
      p_device_token: identity.deviceToken
    }, config);
  }
}

function renderSupportChatMessages(messages) {
  if (!supportChatMessages) {
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    supportChatMessages.innerHTML = '<p class="support-chat-empty">Nenhuma mensagem ainda.</p>';
    return;
  }

  const shouldStickToBottom = supportChatMessages.scrollTop + supportChatMessages.clientHeight >= supportChatMessages.scrollHeight - 24;
  supportChatMessages.innerHTML = messages.map((message) => `
    <div class="support-chat-message ${message.sender === 'admin' ? 'is-admin' : 'is-user'}">
      ${message.message_type === 'image' && message.image_data_url ? `<img class="support-chat-image" src="${escapeHtml(message.image_data_url)}" alt="Imagem enviada no suporte" data-support-open-image="${escapeHtml(message.image_data_url)}">` : ''}
      <span class="support-chat-text">${escapeHtml(String(message.message || ''))}</span>
      <small class="support-chat-meta">${message.sender === 'admin' ? 'Suporte' : 'Você'} • ${formatTime(new Date(message.created_at))}</small>
    </div>
  `).join('');

  if (shouldStickToBottom) {
    supportChatMessages.scrollTop = supportChatMessages.scrollHeight;
  }
}

function updateSupportAdminPresence(device) {
  if (supportAdminPresence) {
    const isOnline = Boolean(device.admin_online);
    supportAdminPresence.textContent = isOnline
      ? 'ADM online'
      : device.admin_last_seen_at
        ? `ADM visto por último ${formatDateTime(new Date(device.admin_last_seen_at))}`
        : 'ADM offline';
    supportAdminPresence.classList.toggle('is-online', isOnline);
  }

  if (supportAdminTyping) {
    supportAdminTyping.hidden = !device.admin_typing;
  }
}

async function sendSupportChatMessage() {
  const config = getSupportConfig();
  const message = supportChatInput?.value.trim();

  if (!isSupportConfigured(config) || !message) {
    return;
  }

  const identity = await getSupportIdentity();
  if (!identity) {
    return;
  }

  supportChatSendBtn.disabled = true;

  try {
    const result = await callSupportRpc('app_send_support_message', {
      p_support_id: identity.supportId,
      p_device_token: identity.deviceToken,
      p_message: message
    }, config);

    if (!result?.ok) {
      throw new Error(result?.error || 'Falha ao enviar mensagem.');
    }

    supportChatInput.value = '';
    await setSupportTypingState(false);
    await loadSupportChatMessages();
    setSupportChatStatus('');
  } catch (_) {
    setSupportChatStatus('Não foi possível enviar a mensagem.', 'error');
  } finally {
    supportChatSendBtn.disabled = false;
  }
}

async function sendSupportChatImage(file) {
  const config = getSupportConfig();

  if (!isSupportConfigured(config)) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    setSupportChatStatus('Escolha um arquivo de imagem.', 'error');
    return;
  }

  const identity = await getSupportIdentity();
  if (!identity) {
    return;
  }

  supportChatImageBtn.disabled = true;
  setSupportChatStatus('Otimizando imagem para envio...');

  try {
    const image = await compressSupportImage(file);
    const result = await callSupportRpc('app_send_support_image', {
      p_support_id: identity.supportId,
      p_device_token: identity.deviceToken,
      p_caption: supportChatInput?.value.trim() || '',
      p_image_data_url: image.dataUrl,
      p_image_mime: image.mime
    }, config);

    if (!result?.ok) {
      throw new Error(result?.error || 'Falha ao enviar imagem.');
    }

    if (supportChatInput) supportChatInput.value = '';
    await setSupportTypingState(false);
    await loadSupportChatMessages();
    setSupportChatStatus('');
  } catch (error) {
    const isLarge = error?.message === 'image_too_large';
    setSupportChatStatus(isLarge ? 'A imagem ficou grande demais. Tente outra imagem.' : 'Não foi possível enviar a imagem.', 'error');
  } finally {
    supportChatImageBtn.disabled = false;
  }
}

function compressSupportImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 1280;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        if (!context) {
          reject(new Error('canvas_unavailable'));
          return;
        }

        context.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        let quality = 0.78;
        let dataUrl = canvas.toDataURL(mime, quality);

        while (dataUrl.length > 1700000 && quality > 0.42 && mime === 'image/jpeg') {
          quality -= 0.08;
          dataUrl = canvas.toDataURL(mime, quality);
        }

        resolve({ dataUrl, mime });
      };
      img.onerror = () => reject(new Error('image_load_failed'));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('file_read_failed'));
    reader.readAsDataURL(file);
  });
}

function queueSupportTypingState() {
  const now = Date.now();

  if (now - supportLastTypingSentAt > 2500) {
    supportLastTypingSentAt = now;
    setSupportTypingState(true);
  }

  if (supportTypingTimeoutId) {
    window.clearTimeout(supportTypingTimeoutId);
  }

  supportTypingTimeoutId = window.setTimeout(() => {
    setSupportTypingState(false);
  }, 3500);
}

async function setSupportTypingState(isTyping) {
  const config = getSupportConfig();
  if (!isSupportConfigured(config)) {
    return;
  }

  const identity = await getSupportIdentity();
  if (!identity) {
    return;
  }

  try {
    await callSupportRpc('app_set_support_typing', {
      p_support_id: identity.supportId,
      p_device_token: identity.deviceToken,
      p_is_typing: Boolean(isTyping)
    }, config);
  } catch (_) {}
}

function setSupportChatStatus(message, type = '') {
  if (!supportChatStatus) {
    return;
  }

  supportChatStatus.textContent = message;
  supportChatStatus.hidden = !message;
  supportChatStatus.className = 'support-chat-status';

  if (type) {
    supportChatStatus.classList.add(type);
  }
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
  syncModalBodyState();
  await initializeSupportSync();
  await maybeShowFirstUseTutorial({ delayMs: 140 });
});

userNameInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveOnboardingBtn?.click();
  }
});

function renderAppTutorialStep() {
  if (FIRST_USE_TUTORIAL_STEPS.length === 0) return;

  createTourUI();

  const lastIndex = FIRST_USE_TUTORIAL_STEPS.length - 1;
  currentTutorialStep = Math.min(Math.max(currentTutorialStep, 0), lastIndex);
  const step = FIRST_USE_TUTORIAL_STEPS[currentTutorialStep];
  const isLastStep = currentTutorialStep === lastIndex;

  // Limpa estados anteriores
  document.querySelectorAll('.tour-highlighted').forEach(el => el.classList.remove('tour-highlighted'));
  tourPopover.classList.remove('is-visible');

  // Atualiza conteúdo
  document.getElementById('tourKicker').textContent = step.kicker;
  document.getElementById('tourTitle').textContent = step.title;
  document.getElementById('tourDescription').textContent = step.description;
  document.getElementById('tourNextBtn').textContent = isLastStep ? 'Concluir' : 'Próximo';
  document.getElementById('tourPrevBtn').disabled = currentTutorialStep === 0;

  // Atualiza pontos
  const dotsContainer = document.getElementById('tourDots');
  dotsContainer.innerHTML = '';
  FIRST_USE_TUTORIAL_STEPS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `tour-dot${i === currentTutorialStep ? ' active' : ''}`;
    dotsContainer.appendChild(dot);
  });

  // Posicionamento e destaque
  const target = document.querySelector(step.element);
  
  if (target && target.offsetParent !== null) {
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    document.documentElement.style.scrollBehavior = originalScrollBehavior;

    window.requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      
      // Spotlight
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const r = Math.max(rect.width, rect.height) / 2 + 10;

      tourBackdrop.style.setProperty('--spotlight-x', `${x}px`);
      tourBackdrop.style.setProperty('--spotlight-y', `${y}px`);
      tourBackdrop.style.setProperty('--spotlight-r', `${r}px`);

      // Popover
      tourPopover.setAttribute('data-position', step.position);
      tourPopover.style.transform = '';
      
      let popoverTop, popoverLeft;
      const gap = 24;
      const viewportPadding = window.matchMedia('(max-width: 480px)').matches ? 16 : 12;

      if (step.position === 'bottom') {
        popoverTop = rect.bottom + gap;
      } else {
        popoverTop = rect.top - tourPopover.offsetHeight - gap;
      }

      popoverLeft = rect.left + rect.width / 2 - tourPopover.offsetWidth / 2;

      // Ajustes de borda da tela
      popoverLeft = Math.max(viewportPadding, Math.min(popoverLeft, window.innerWidth - tourPopover.offsetWidth - viewportPadding));
      popoverTop = Math.max(viewportPadding, Math.min(popoverTop, window.innerHeight - tourPopover.offsetHeight - viewportPadding));
      
      tourPopover.style.top = `${popoverTop}px`;
      tourPopover.style.left = `${popoverLeft}px`;

      // Seta com margem de segurança para não sair da borda arredondada
      const arrowMargin = 28; 
      const targetCenter = rect.left + rect.width / 2;
      let arrowX = targetCenter - popoverLeft;
      
      // Ajuste fino para a setinha não ficar desalinhada em botões pequenos no canto
      arrowX = Math.max(arrowMargin, Math.min(arrowX, tourPopover.offsetWidth - arrowMargin));
      
      tourPopover.style.setProperty('--arrow-offset', `${arrowX}px`);

      target.classList.add('tour-highlighted');
      tourPopover.classList.add('is-visible');
    });
  } else {
    // Caso o elemento não seja encontrado, centraliza o popover e remove o spotlight
    tourBackdrop.style.setProperty('--spotlight-r', `0px`);
    
    tourPopover.style.top = '50%';
    tourPopover.style.left = '50%';
    tourPopover.style.transform = 'translate(-50%, -50%)';
    tourPopover.setAttribute('data-position', 'center');
    
    tourPopover.classList.add('is-visible');
  }

  tourOverlay.classList.add('is-active');
}

function openAppTutorial(startStep = 0) {
  currentTutorialStep = Number.isFinite(startStep) ? startStep : 0;
  renderAppTutorialStep();
}

async function closeAppTutorial({ markCompleted = true } = {}) {
  if (!tourOverlay || !tourOverlay.classList.contains('is-active')) {
    return;
  }

  tourOverlay.classList.remove('is-active');
  tourPopover.classList.remove('is-visible');
  document.querySelectorAll('.tour-highlighted').forEach(el => el.classList.remove('tour-highlighted'));
  syncModalBodyState();

  if (markCompleted) {
    await Storage.set(TUTORIAL_COMPLETED_KEY, 'done');
  }
}

async function maybeShowFirstUseTutorial({ delayMs = 0 } = {}) {
  const tutorialCompleted = await Storage.get(TUTORIAL_COMPLETED_KEY);
  if (tutorialCompleted === 'done') {
    return;
  }

  const showTutorial = () => openAppTutorial(0);
  if (delayMs > 0) {
    window.setTimeout(showTutorial, delayMs);
    return;
  }

  showTutorial();
}

function goToAppTutorialStep(stepIndex) {
  if (!Number.isFinite(stepIndex)) {
    return;
  }

  currentTutorialStep = stepIndex;
  renderAppTutorialStep();
}

function showPreviousAppTutorialStep() {
  if (currentTutorialStep <= 0) {
    return;
  }

  goToAppTutorialStep(currentTutorialStep - 1);
}

function showNextAppTutorialStep() {
  if (currentTutorialStep >= FIRST_USE_TUTORIAL_STEPS.length - 1) {
    closeAppTutorial();
    return;
  }

  goToAppTutorialStep(currentTutorialStep + 1);
}

// Eventos de tutorial removidos (usando o novo sistema de tour)

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

promptValueModal?.addEventListener('click', (event) => {
  if (event.target === promptValueModal) {
    closeInstallmentValuePrompt();
  }
});

monthlyBalanceModal?.addEventListener('click', (event) => {
  if (event.target === monthlyBalanceModal) {
    closeMonthlyBalanceModal();
  }
});

monthlyOverviewModal?.addEventListener('click', (event) => {
  if (event.target === monthlyOverviewModal) {
    closeMonthlyOverviewModal();
  }
});

appSettingsModal?.addEventListener('click', (event) => {
  if (event.target === appSettingsModal) {
    closeAppSettingsModal();
  }
});

supportModal?.addEventListener('click', (event) => {
  if (event.target === supportModal) {
    closeSupportModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && statementImportModal && !statementImportModal.hidden) {
    closeStatementImportModal();
    return;
  }

  if (event.key === 'Escape' && bankImportModal && !bankImportModal.hidden) {
    closeBankImportModal();
    return;
  }

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

  if (event.key === 'Escape' && promptValueModal && !promptValueModal.hidden) {
    closeInstallmentValuePrompt();
    return;
  }

  if (event.key === 'Escape' && monthlyBalanceModal && !monthlyBalanceModal.hidden) {
    closeMonthlyBalanceModal();
    return;
  }

  if (event.key === 'Escape' && monthlyOverviewModal && !monthlyOverviewModal.hidden) {
    closeMonthlyOverviewModal();
    return;
  }

  if (event.key === 'Escape' && supportModal && !supportModal.hidden) {
    closeSupportModal();
    return;
  }

  if (event.key === 'Escape' && appSettingsModal && !appSettingsModal.hidden) {
    closeAppSettingsModal();
    return;
  }

  if (event.key === 'Escape' && tourOverlay && tourOverlay.classList.contains('is-active')) {
    closeAppTutorial();
    return;
  }

  if (event.key === 'Escape' && !resultsSection.hidden) {
    closeDetailsModal();
  }

});

if (window.Capacitor?.Plugins?.App) {
  window.Capacitor.Plugins.App.addListener('backButton', () => {
    if (statementImportModal && !statementImportModal.hidden) {
      closeStatementImportModal();
    } else if (bankImportModal && !bankImportModal.hidden) {
      closeBankImportModal();
    } else if (!createModal.hidden) {
      closeCreateModal();
    } else if (!editModal.hidden) {
      closeEditModal();
    } else if (!deleteModal.hidden) {
      closeDeleteModal();
    } else if (!reorderModal.hidden) {
      closeReorderModal();
    } else if (promptValueModal && !promptValueModal.hidden) {
      closeInstallmentValuePrompt();
    } else if (monthlyBalanceModal && !monthlyBalanceModal.hidden) {
      closeMonthlyBalanceModal();
    } else if (monthlyOverviewModal && !monthlyOverviewModal.hidden) {
      closeMonthlyOverviewModal();
    } else if (supportModal && !supportModal.hidden) {
      closeSupportModal();
    } else if (appSettingsModal && !appSettingsModal.hidden) {
      closeAppSettingsModal();
    } else if (tourOverlay && tourOverlay.classList.contains('is-active')) {
      closeAppTutorial();
    } else if (!resultsSection.hidden) {
      closeDetailsModal();
    } else {
      window.Capacitor.Plugins.App.exitApp();
    }
  });

  window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
    isNativeAppActive = Boolean(state?.isActive);
    if (state?.isActive) {
      queuePaymentNotificationSync();
      loadSupportChatMessages({ silent: true });
    }
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    loadSupportChatMessages({ silent: true });
  }
});

plansFilterNav?.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    plansFilterNav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentPlanFilter = event.target.dataset.filter;
    renderPlansList();
  }
});

function syncCreatePlanTypeFields() {
  const planType = getSelectedCreatePlanType();
  const isDebt = planType === PLAN_TYPE_DEBT;
  const isExpense = planType === PLAN_TYPE_EXPENSE;
  const isAccount = planType === PLAN_TYPE_ACCOUNT;
  const totalValueField = createTotalValueInput?.parentElement;
  const installmentHint = createInstallmentValueInput
    ?.closest('.input-group')
    ?.querySelector('.value-input-hint');

  if (debtSpecificFields) {
    debtSpecificFields.style.display = isDebt ? 'contents' : 'none';
  }

  if (createTotalMonthsInput) {
    if (isDebt) {
      createTotalMonthsInput.setAttribute('required', 'required');
    } else {
      createTotalMonthsInput.removeAttribute('required');
    }
  }

  if (createPlanNameInput) {
    createPlanNameInput.placeholder = isAccount
      ? 'Ex.: Fatura do cartão, boleto da compra'
      : isExpense
        ? 'Ex.: Conta de energia, Internet'
        : 'Ex.: Parcelas da moto';
  }

  if (createStartDateLabel) {
    createStartDateLabel.textContent = isAccount ? 'Data de pagamento' : isExpense ? 'Data de pagamento' : 'Data de início';
  }

  if (createInstallmentValueLabel) {
    createInstallmentValueLabel.textContent = isAccount
      ? 'Valor da conta'
      : isExpense
        ? 'Valor Mensal (Opcional)'
        : 'Valor da Parcela (Opcional)';
  }

  if (createInstallmentValueInput) {
    if (isAccount) {
      createInstallmentValueInput.setAttribute('required', 'required');
    } else {
      createInstallmentValueInput.removeAttribute('required');
    }
  }

  if (installmentHint) {
    installmentHint.textContent = isAccount
      ? 'Valor previsto para pagar nessa data'
      : isExpense
        ? 'Valor mensal usado no total do mês'
        : 'Calcula o total automaticamente';
  }

  if (totalValueField) {
    totalValueField.style.display = isDebt ? 'flex' : 'none';
  }

  if (createTotalValueInput && !isDebt) {
    createTotalValueInput.value = '';
  }

  if (createTotalValueLabel) {
    createTotalValueLabel.textContent = 'Valor Total (Opcional)';
  }

  updateCreatePastMonthsControl();
}

document.querySelectorAll('input[name="createPlanType"]').forEach(radio => {
  radio.addEventListener('change', syncCreatePlanTypeFields);
});

[createStartDateInput, createTotalMonthsInput].forEach((input) => {
  input?.addEventListener('input', updateCreatePastMonthsControl);
  input?.addEventListener('change', updateCreatePastMonthsControl);
});

document.querySelectorAll('input[name="createPastMonthsStatus"]').forEach((input) => {
  input.addEventListener('change', updateCreatePastMonthsControl);
});

[editStartDateInput, editTotalMonthsInput].forEach((input) => {
  input?.addEventListener('input', updateEditPastMonthsControl);
  input?.addEventListener('change', updateEditPastMonthsControl);
});

document.querySelectorAll('input[name="editPastMonthsStatus"]').forEach((input) => {
  input.addEventListener('change', updateEditPastMonthsControl);
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

  const detailsContext = updatePlanDetailsSummary(plan, options);

  renderMonthlyTimeline(plan, detailsContext.effectiveStartDate, detailsContext.today, options);
  updateResultsNavigation();

  if (detailsContext.shouldShowDetails) {
    syncModalBodyState();
  }
}

function updatePlanDetailsSummary(plan, options = {}) {
  const shouldShowDetails = Boolean(options.openDetails || !resultsSection.hidden);
  const today = normalizeDate(new Date());
  const startDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
  const endDate = getPlanEndDate(plan, effectiveStartDate);
  const totalDays = Math.max(1, daysBetween(effectiveStartDate, endDate));
  const paidMonths = getPaidMonths(plan);
  const completedMonths = paidMonths.length;
  const remainingMonths = Math.max(plan.totalMonths - completedMonths, 0);
  // Lógica de pontuações e porcentagens nos valores
  const financials = calculatePlanFinancials(plan);
  const percent = financials.progressPercent;
  const remainingLabel = buildRemainingLabel(remainingMonths);

  selectedPlanTitle.textContent = plan.name;
  resultsSection.hidden = !shouldShowDetails;

  const isExpense = isExpensePlan(plan);
  const isAccount = isAccountPlan(plan);
  selectedPlanSubtitle.textContent = isAccount
    ? `Pagamento único do compromisso "${plan.name}".`
    : `Cálculo individual do compromisso "${plan.name}".`;
  resultsSection.classList.toggle('is-expense-mode', isExpense);
  resultsSection.classList.toggle('is-account-mode', isAccount);

  document.getElementById('summaryStart').textContent = formatDate(effectiveStartDate);

  if (isAccount) {
    const isPaid = completedMonths > 0;
    const isOverdue = !isPaid && today > effectiveStartDate;
    const daysUntilDue = Math.max(0, daysBetween(today, effectiveStartDate));

    document.getElementById('percentage').textContent = `${percent}%`;
    document.getElementById('remainingTime').textContent = isPaid
      ? 'Conta quitada'
      : isOverdue
        ? 'Vencida'
        : daysUntilDue === 0
          ? 'Vence hoje'
          : `${daysUntilDue} ${daysUntilDue === 1 ? 'dia' : 'dias'}`;
    document.getElementById('planStatus').textContent = isPaid
      ? 'Conta paga'
      : isOverdue
        ? 'Conta vencida'
        : 'Aguardando pagamento';
    document.getElementById('completedMonths').textContent = isPaid ? 'Pago' : 'Aberta';
    document.getElementById('summaryMonths').textContent = '1';
    document.getElementById('summaryDays').textContent = 'Pagamento único';
    document.getElementById('summaryEnd').textContent = formatDate(effectiveStartDate);
    document.getElementById('countModeLabel').textContent = 'Data de pagamento única';
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('summaryPaidValue').textContent = formatCurrency(financials.totalPaid);
    document.getElementById('summaryRemainingValue').textContent = formatCurrency(financials.remainingValue);
    document.getElementById('summaryRemainingValue').parentElement.style.display = 'flex';
  } else if (isExpense) {
    document.getElementById('percentage').textContent = '∞';
    document.getElementById('remainingTime').textContent = 'Contínuo';
    document.getElementById('planStatus').textContent = 'Despesa Contínua';
    document.getElementById('completedMonths').textContent = `${completedMonths}`;
    document.getElementById('summaryMonths').textContent = String(plan.totalMonths);
    document.getElementById('summaryDays').textContent = `${totalDays} dias exibidos`;
    document.getElementById('summaryEnd').textContent = 'Livre';
    document.getElementById('countModeLabel').textContent = getCountModeLabel(plan.countMode);
    document.getElementById('progressFill').style.width = '100%';
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

  return { today, effectiveStartDate, shouldShowDetails };
}

function renderMonthlyTotalBadge(total) {
  const monthlyTotalEl = document.getElementById('monthlyTotalValue');
  const badgeLabel = document.querySelector('.monthly-summary-label');
  if (!monthlyTotalEl) return;

  const normalizedTotal = roundMoney(Math.max(0, Number(total) || 0));
  currentMonthlyDebtTotal = normalizedTotal;

  if (normalizedTotal > MONEY_EPSILON) {
    monthlyTotalEl.textContent = `- ${formatCurrency(normalizedTotal)}`;
    monthlyTotalEl.classList.add('is-negative');
  } else {
    monthlyTotalEl.textContent = formatCurrency(0);
    monthlyTotalEl.classList.remove('is-negative');
  }

  if (badgeLabel) badgeLabel.textContent = 'TOTAL A PAGAR DO MÊS';
  updateMonthlyBalanceSummary(normalizedTotal);

  if (monthlyOverviewModal && !monthlyOverviewModal.hidden) {
    renderMonthlyOverviewDetails();
  }
}

function updateMonthlyBalanceSummary(monthlyTotal = currentMonthlyDebtTotal) {
  if (!monthlyBalanceValue || !monthlyBalanceRemaining) {
    return;
  }

  const balance = getCurrentMonthBalance();
  const monthlyPaid = getMonthlyPaidBreakdown(new Date());
  const monthlyCommitments = getMonthlyCommitmentBreakdown(new Date());
  const currentBalance = roundMoney(balance - monthlyPaid.total);
  const projectedBalance = roundMoney(balance - monthlyCommitments.total);
  const hasBalance = balance > MONEY_EPSILON;

  monthlyBalanceValue.textContent = formatCurrency(currentBalance);
  monthlyBalanceValue.classList.toggle('is-empty', !hasBalance);
  monthlyBalanceValue.classList.toggle('is-negative', hasBalance && currentBalance < -MONEY_EPSILON);

  monthlyBalanceRemaining.classList.remove('is-negative', 'is-empty');

  if (!hasBalance) {
    monthlyBalanceRemaining.textContent = 'Saldo não informado';
    monthlyBalanceRemaining.classList.add('is-empty');
    return;
  }

  if (projectedBalance < -MONEY_EPSILON) {
    monthlyBalanceRemaining.textContent = `Falta: ${formatCurrency(Math.abs(projectedBalance))}`;
    monthlyBalanceRemaining.classList.add('is-negative');
    return;
  }

  monthlyBalanceRemaining.textContent = `Sobra: ${formatCurrency(projectedBalance)}`;
}

function setMonthlyBalanceStatus(message, type = '') {
  if (!monthlyBalanceStatus) {
    return;
  }

  monthlyBalanceStatus.textContent = message;
  monthlyBalanceStatus.hidden = !message;
  monthlyBalanceStatus.className = 'bulk-payment-status';

  if (type) {
    monthlyBalanceStatus.classList.add(type);
  }
}

function openMonthlyBalanceModal(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();

  if (!monthlyBalanceModal || !monthlyBalanceInput) {
    return;
  }

  const currentBalance = getCurrentMonthBalance();
  monthlyBalanceInput.value = '';
  if (monthlyBalanceCurrentValue) {
    monthlyBalanceCurrentValue.textContent = `Saldo recebido no mês: ${formatCurrency(currentBalance)}`;
  }
  setMonthlyBalanceStatus('', '');
  monthlyBalanceModal.hidden = false;
  syncModalBodyState();

  window.setTimeout(() => {
    monthlyBalanceInput.focus();
    monthlyBalanceInput.select();
  }, 20);
}

function closeMonthlyBalanceModal() {
  if (monthlyBalanceModal) {
    monthlyBalanceModal.hidden = true;
  }

  setMonthlyBalanceStatus('', '');
  syncModalBodyState();
}

function saveMonthlyBalanceModal() {
  if (!monthlyBalanceInput) {
    closeMonthlyBalanceModal();
    return;
  }

  const amountToAdd = parseCurrencyToNumber(monthlyBalanceInput.value);

  if (!Number.isFinite(amountToAdd) || amountToAdd <= MONEY_EPSILON) {
    setMonthlyBalanceStatus('Informe um valor válido para adicionar ao saldo.', 'error');
    return;
  }

  setCurrentMonthBalance(roundMoney(getCurrentMonthBalance() + amountToAdd));
  saveMonthlyBalances();
  updateMonthlyBalanceSummary(currentMonthlyDebtTotal);
  if (monthlyOverviewModal && !monthlyOverviewModal.hidden) {
    renderMonthlyOverviewDetails();
  }
  closeMonthlyBalanceModal();
  setStatus(`Saldo adicionado: ${formatCurrency(amountToAdd)}. Total recebido no mês: ${formatCurrency(getCurrentMonthBalance())}.`, 'success');
}

function replaceMonthlyBalanceModal() {
  if (!monthlyBalanceInput) {
    closeMonthlyBalanceModal();
    return;
  }

  const nextBalance = parseCurrencyToNumber(monthlyBalanceInput.value);

  if (!Number.isFinite(nextBalance) || nextBalance < 0) {
    setMonthlyBalanceStatus('Informe um valor válido para corrigir o saldo.', 'error');
    return;
  }

  setCurrentMonthBalance(nextBalance);
  saveMonthlyBalances();
  updateMonthlyBalanceSummary(currentMonthlyDebtTotal);
  if (monthlyOverviewModal && !monthlyOverviewModal.hidden) {
    renderMonthlyOverviewDetails();
  }
  closeMonthlyBalanceModal();
  setStatus(`Saldo recebido no mês corrigido para ${formatCurrency(getCurrentMonthBalance())}.`, 'success');
}

function openMonthlyOverviewModal(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();

  if (!monthlyOverviewModal) {
    return;
  }

  renderMonthlyOverviewDetails();
  monthlyOverviewModal.hidden = false;
  syncModalBodyState();

  window.setTimeout(() => {
    closeMonthlyOverviewModalBtn?.focus();
  }, 20);
}

function closeMonthlyOverviewModal() {
  if (monthlyOverviewModal) {
    monthlyOverviewModal.hidden = true;
  }

  syncModalBodyState();
}

function renderMonthlyOverviewDetails() {
  const currentDateRef = normalizeDate(new Date());
  const debtBreakdown = getMonthlyDebtBreakdown(currentDateRef);
  const commitmentBreakdown = getMonthlyCommitmentBreakdown(currentDateRef);
  const paidBreakdown = getMonthlyPaidBreakdown(currentDateRef);
  const receivedBalance = getCurrentMonthBalance();
  const currentBalance = roundMoney(receivedBalance - paidBreakdown.total);
  const available = roundMoney(receivedBalance - commitmentBreakdown.total);
  const hasBalance = receivedBalance > MONEY_EPSILON;
  const committedRatio = hasBalance
    ? clamp(commitmentBreakdown.total / receivedBalance, 0, 1)
    : commitmentBreakdown.total > MONEY_EPSILON
      ? 1
      : 0;
  const committedPercent = Math.round(committedRatio * 100);

  if (monthlyOverviewPeriod) {
    monthlyOverviewPeriod.textContent = formatMonthYear(currentDateRef);
  }

  if (overviewBalanceValue) {
    overviewBalanceValue.textContent = formatCurrency(currentBalance);
    overviewBalanceValue.classList.toggle('is-negative', hasBalance && currentBalance < -MONEY_EPSILON);
  }

  if (overviewDebtValue) {
    overviewDebtValue.textContent = formatCurrency(debtBreakdown.total);
  }

  if (overviewAvailableValue) {
    overviewAvailableValue.textContent = hasBalance
      ? formatCurrency(available)
      : 'Sem saldo';
  }

  if (overviewAvailableCard) {
    overviewAvailableCard.classList.toggle('is-negative', hasBalance && available < -MONEY_EPSILON);
    overviewAvailableCard.classList.toggle('is-empty', !hasBalance);
  }

  if (overviewOpenCount) {
    overviewOpenCount.textContent = String(debtBreakdown.items.length);
  }

  const overviewOverdueCard = document.getElementById('overviewOverdueCard');
  const overviewOverdueValue = document.getElementById('overviewOverdueValue');
  if (overviewOverdueCard && overviewOverdueValue) {
    const overdueTotal = getOverdueDebtTotal(currentDateRef);
    if (overdueTotal > MONEY_EPSILON) {
      overviewOverdueValue.textContent = `- ${formatCurrency(overdueTotal)}`;
      overviewOverdueCard.hidden = false;
    } else {
      overviewOverdueCard.hidden = true;
    }
  }

  if (monthlyBalanceChart) {
    monthlyBalanceChart.style.setProperty('--debt-angle', `${committedRatio * 360}deg`);
    monthlyBalanceChart.classList.toggle('is-empty', !hasBalance && commitmentBreakdown.total <= MONEY_EPSILON);
  }

  if (monthlyBalanceChartCenter) {
    monthlyBalanceChartCenter.textContent = `${committedPercent}%`;
  }

  renderMonthlyDebtBreakdown(commitmentBreakdown.items);
  renderMonthlyBalanceHistory();
  renderMonthlyPaymentHistory();
}

function renderMonthlyDebtBreakdown(items) {
  if (!monthlyDebtBreakdownList) {
    return;
  }

  if (!items.length) {
    monthlyDebtBreakdownList.innerHTML = '<div class="monthly-overview-empty">Nenhum compromisso previsto neste mês.</div>';
    return;
  }

  const maxAmount = Math.max(...items.map((item) => item.amount), 1);
  monthlyDebtBreakdownList.innerHTML = items
    .slice(0, 8)
    .map((item) => {
      const scale = clamp(item.amount / maxAmount, 0, 1);
      const monthLabel = isExpensePlan(item.plan)
        ? 'Despesa mensal'
        : isAccountPlan(item.plan)
          ? 'Conta do mês'
          : `Parcela ${item.monthIndex}/${item.totalMonths}`;
      const dueLabel = item.paymentDate ? formatDateShort(item.paymentDate) : formatMonthYearCompact(item.periodStart);
      const statusLabel = item.isPaid ? 'Pago' : 'Em aberto';
      const statusClass = item.isPaid ? 'is-paid' : 'is-open';

      return `
        <div class="monthly-breakdown-item" style="--bar-scale:${scale};">
          <div class="monthly-breakdown-top">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${formatCurrency(item.amount)}</span>
          </div>
          <div class="monthly-breakdown-meta">
            <span>${escapeHtml(monthLabel)}</span>
            <span>${dueLabel}</span>
          </div>
          <span class="monthly-breakdown-status ${statusClass}">${statusLabel}</span>
          <div class="monthly-breakdown-bar" aria-hidden="true"><span></span></div>
        </div>
      `;
    })
    .join('');
}

function renderMonthlyBalanceHistory() {
  if (!monthlyHistoryList) {
    return;
  }

  const history = getMonthlyOverviewHistory(6);
  const maxValue = Math.max(
    ...history.flatMap((entry) => [entry.balance, entry.totalCommitted]),
    1
  );

  monthlyHistoryList.innerHTML = history
    .map((entry) => {
      const balanceScale = clamp(entry.balance / maxValue, 0, 1);
      const debtScale = clamp(entry.totalCommitted / maxValue, 0, 1);
      const hasBalance = entry.balance > MONEY_EPSILON;
      const available = roundMoney(entry.balance - entry.totalCommitted);
      const resultLabel = hasBalance
        ? available < -MONEY_EPSILON
          ? `Falta ${formatCurrency(Math.abs(available))}`
          : `Livre ${formatCurrency(available)}`
        : 'Saldo não informado';

      return `
        <div class="monthly-history-item${hasBalance && available < -MONEY_EPSILON ? ' is-negative' : ''}" style="--balance-scale:${balanceScale}; --debt-scale:${debtScale};">
          <div class="monthly-history-top">
            <strong>${formatMonthYear(entry.date)}</strong>
            <span>${resultLabel}</span>
          </div>
          <div class="monthly-history-bars" aria-hidden="true">
            <span class="history-balance-bar"></span>
            <span class="history-debt-bar"></span>
          </div>
          <div class="monthly-history-values">
            <span>Saldo ${hasBalance ? formatCurrency(entry.balance) : '--'}</span>
            <span>Pagamentos ${formatCurrency(entry.totalCommitted)}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderMonthlyPaymentHistory() {
  if (!monthlyPaymentHistoryList) {
    return;
  }

  const history = getRecentPaymentHistory(6);

  if (!history.length) {
    monthlyPaymentHistoryList.innerHTML = '<div class="monthly-overview-empty">Nenhum lançamento registrado ainda.</div>';
    return;
  }

  monthlyPaymentHistoryList.innerHTML = history
    .map((entry) => `
      <div class="monthly-payment-history-item">
        <div>
          <strong>${escapeHtml(entry.planName)}</strong>
          <span>${entry.updated ? 'Lance alterado' : 'Lance registrado'} em ${formatDateShort(entry.date)}</span>
        </div>
        <strong>${formatCurrency(entry.amount)}</strong>
      </div>
    `)
    .join('');
}

function getMonthlyDebtBreakdown(targetDate = new Date()) {
  const date = normalizeDate(targetDate);
  const items = [];
  let total = 0;

  plans.forEach((plan) => {
    const item = getMonthlyDebtItem(plan, date);

    if (!item || item.amount <= MONEY_EPSILON) {
      return;
    }

    items.push(item);
    total += item.amount;
  });

  items.sort((first, second) => second.amount - first.amount);

  return {
    total: roundMoney(total),
    items
  };
}

function getOverdueDebtTotal(targetDate = new Date()) {
  const date = normalizeDate(targetDate);
  let total = 0;

  plans.forEach((plan) => {
    const startDate = parseDateInput(plan.startDate);
    const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
    const paidMonths = new Set(getPaidMonths(plan));
    const maxMonths = getPlanMonthLimit(plan);

    for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
      const periodStart = getPlanPeriodStart(plan, effectiveStartDate, monthIndex);

      // Se o início do período é em um mês ANTERIOR ao atual
      if (periodStart.getFullYear() < date.getFullYear() ||
         (periodStart.getFullYear() === date.getFullYear() && periodStart.getMonth() < date.getMonth())) {
        
        if (!paidMonths.has(monthIndex)) {
          total += getMonthRemainingValue(plan, monthIndex);
        }
      } else {
        // Como os índices são sequenciais, se chegamos no mês atual/futuro, podemos parar este plano
        break;
      }
    }
  });

  return roundMoney(total);
}

function getMonthlyCommitmentBreakdown(targetDate = new Date()) {
  const date = normalizeDate(targetDate);
  const items = [];
  let total = 0;

  plans.forEach((plan) => {
    const item = getMonthlyCommitmentItem(plan, date);

    if (!item || item.amount <= MONEY_EPSILON) {
      return;
    }

    items.push(item);
    total += item.amount;
  });

  items.sort((first, second) => second.amount - first.amount);

  return {
    total: roundMoney(total),
    items
  };
}

function getMonthlyPaidBreakdown(targetDate = new Date()) {
  const date = normalizeDate(targetDate);
  const items = [];
  let total = 0;

  plans.forEach((plan) => {
    const item = getMonthlyPaidItem(plan, date);

    if (!item || item.amount <= MONEY_EPSILON) {
      return;
    }

    items.push(item);
    total += item.amount;
  });

  items.sort((first, second) => second.amount - first.amount);

  return {
    total: roundMoney(total),
    items
  };
}

function getMonthlyDebtItem(plan, targetDate) {
  const startDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
  const paidMonths = new Set(getPaidMonths(plan));

  if (isAccountPlan(plan)) {
    if (!isSameMonth(effectiveStartDate, targetDate) || paidMonths.has(1)) {
      return null;
    }

    const amount = getMonthRemainingValue(plan, 1);

    return {
      plan,
      id: plan.id,
      name: plan.name,
      amount,
      monthIndex: 1,
      totalMonths: 1,
      periodStart: effectiveStartDate,
      paymentDate: effectiveStartDate
    };
  }

  const maxMonths = getPlanMonthLimit(plan);

  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    const periodStart = getPlanPeriodStart(plan, effectiveStartDate, monthIndex);
    const periodEnd = getPlanDueDate(plan, effectiveStartDate, monthIndex);

    if (isSameMonth(periodStart, targetDate)) {
      if (paidMonths.has(monthIndex)) {
        return null;
      }

      const amount = getMonthRemainingValue(plan, monthIndex);

      return {
        plan,
        id: plan.id,
        name: plan.name,
        amount,
        monthIndex,
        totalMonths: maxMonths,
        periodStart,
        paymentDate: getPlanPaymentDate(plan, effectiveStartDate, monthIndex)
      };
    }
  }

  return null;
}

function getMonthlyPaidItem(plan, targetDate) {
  const commitment = getMonthlyCommitmentItem(plan, targetDate);

  if (!commitment) {
    return null;
  }

  const paidAmount = commitment.isPaid
    ? commitment.amount
    : getPartialMonthCredit(plan, commitment.monthIndex);

  if (paidAmount <= MONEY_EPSILON) {
    return null;
  }

  return {
    ...commitment,
    amount: roundMoney(Math.min(paidAmount, commitment.amount))
  };
}

function getMonthlyCommitmentItem(plan, targetDate) {
  const startDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
  const paidMonths = new Set(getPaidMonths(plan));

  if (isAccountPlan(plan)) {
    if (!isSameMonth(effectiveStartDate, targetDate)) {
      return null;
    }

    return {
      plan,
      id: plan.id,
      name: plan.name,
      amount: getMonthBaseValue(plan, 1),
      remainingAmount: paidMonths.has(1) ? 0 : getMonthRemainingValue(plan, 1),
      isPaid: paidMonths.has(1),
      monthIndex: 1,
      totalMonths: 1,
      periodStart: effectiveStartDate,
      paymentDate: effectiveStartDate
    };
  }

  const maxMonths = getPlanMonthLimit(plan);

  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    const periodStart = getPlanPeriodStart(plan, effectiveStartDate, monthIndex);
    const periodEnd = getPlanDueDate(plan, effectiveStartDate, monthIndex);

    if (isSameMonth(periodStart, targetDate)) {
      return {
        plan,
        id: plan.id,
        name: plan.name,
        amount: getMonthBaseValue(plan, monthIndex),
        remainingAmount: paidMonths.has(monthIndex) ? 0 : getMonthRemainingValue(plan, monthIndex),
        isPaid: paidMonths.has(monthIndex),
        monthIndex,
        totalMonths: maxMonths,
        periodStart,
        paymentDate: getPlanPaymentDate(plan, effectiveStartDate, monthIndex)
      };
    }
  }

  return null;
}

function getMonthlyOverviewHistory(monthCount = 6) {
  const today = normalizeDate(new Date());
  const currentMonthStart = normalizeDate(new Date(today.getFullYear(), today.getMonth(), 1));

  return Array.from({ length: monthCount }, (_, index) => {
    const monthDate = addMonths(currentMonthStart, -index);
    const anchorDate = index === 0
      ? today
      : normalizeDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), 15));
    const balance = roundMoney(normalizeMoneyValue(monthlyBalances[getCurrentMonthKey(monthDate)]));
    const commitments = getMonthlyCommitmentBreakdown(anchorDate);
    const paid = getMonthlyPaidBreakdown(anchorDate);

    return {
      date: monthDate,
      balance: roundMoney(balance - paid.total),
      totalCommitted: commitments.total
    };
  });
}

function getRecentPaymentHistory(limit = 6) {
  return plans
    .flatMap((plan) => getBulkPaymentHistory(plan).map((action) => {
      const date = new Date(action.updatedAt || action.createdAt || Date.now());

      return {
        planName: plan.name,
        amount: action.amount,
        date: Number.isNaN(date.getTime()) ? new Date() : date,
        updated: Boolean(action.updatedAt)
      };
    }))
    .sort((first, second) => second.date.getTime() - first.date.getTime())
    .slice(0, limit);
}

function isSameMonth(firstDate, secondDate) {
  return firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth();
}

function updateMonthlyTotal() {
  const monthlyTotalEl = document.getElementById('monthlyTotalValue');
  if (!monthlyTotalEl) return;

  renderMonthlyTotalBadge(getMonthlyDebtBreakdown(new Date()).total);
}

function renderPlansList() {
  updateMonthlyDebtSummary();
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
    updateMonthlyTotal(); // Atualiza o total mesmo vazio
    return;
  }

  filteredPlans.forEach((plan, index) => {
    const planStartDate = parseDateInput(plan.startDate);
    const effectiveStartDate = getEffectiveStartDate(planStartDate, plan.countMode);
    const planEndDate = getPlanEndDate(plan, effectiveStartDate);
    const isExpense = isExpensePlan(plan);
    const isAccount = isAccountPlan(plan);
    const financials = calculatePlanFinancials(plan);
    const progressRatio = financials.progressRatio;
    const progressPercent = financials.progressPercent;
    const paidMonthsCount = getPaidMonths(plan).length;
    const nextUnpaidMonth = getNextUnpaidMonthIndex(plan);
    const currentInstallment = nextUnpaidMonth ? getMonthRemainingValue(plan, nextUnpaidMonth) : 0;
    const overdueInfo = getPlanOverdueInfo(plan);
    const valueDisplay = currentInstallment > 0 ? `<div class="plan-item-value" style="font-family: 'Space Grotesk'; color: var(--primary); font-weight: 700; font-size: 0.95rem; white-space: nowrap;">${formatCurrencyRaw(currentInstallment)}</div>` : '';

    const item = document.createElement('div');
    item.className = `plan-entry${isExpense ? ' is-expense-entry' : ''}${isAccount ? ' is-account-entry' : ''}`;
    item.dataset.planNumber = String(index + 1);
    item.dataset.planId = plan.id;
    item.innerHTML = `
      <article class="plan-item${plan.id === selectedPlanId ? ' active' : ''}${overdueInfo.hasOverdue ? ' has-overdue' : ''}" style="--plan-progress:${progressRatio};" data-plan-number="${String(index + 1)}" data-plan-id="${plan.id}">
        <button type="button" class="plan-select-btn" data-plan-id="${plan.id}">
          <div class="plan-item-head">
            <span class="plan-item-tag">${String(index + 1).padStart(2, '0')}</span>
            <span class="plan-duration-pill">${getPlanListDurationLabel(plan)}</span>
          </div>
          <div class="plan-item-main-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 6px; gap: 12px;">
            <strong class="plan-item-name" style="margin: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(plan.name)}</strong>
            ${valueDisplay}
          </div>

          <div class="plan-progress-meta">
            <span class="plan-progress-label">${overdueInfo.hasOverdue ? 'Atraso' : 'Andamento'}</span>
            ${buildPlanOverdueInlineHtml(overdueInfo)}
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
            <div class="plan-progress" aria-hidden="true" style="flex: 1; margin: 0; ${isExpense ? 'opacity: 0.2;' : ''}">
            <span class="plan-progress-fill" ${isExpense ? 'style="width: 100%; background: var(--muted);"' : ''}></span>
            </div>
            <strong class="plan-progress-value" style="font-size: 0.85rem; min-width: 35px; text-align: right;">${isExpense ? '∞' : `${progressPercent}%`}</strong>
          </div>
          <div class="plan-stat-grid">
            <div class="plan-stat-card">
              <span class="plan-stat-label">Início</span>
              <strong class="plan-stat-value">${formatDateShort(planStartDate)}</strong>
            </div>
            <div class="plan-stat-card">
              <span class="plan-stat-label">Pagos</span>
              <strong class="stat-value">${getPlanPaidSummaryLabel(plan, paidMonthsCount)}</strong>
            </div>
            <div class="plan-stat-card plan-stat-card-end">
              <span class="plan-stat-label">${isAccount ? 'Data' : 'Fim'}</span>
              <strong class="plan-stat-value">${getPlanEndSummaryLabel(plan, planEndDate)}</strong>
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
  updateMonthlyTotal();
}

function getPlanOverdueInfo(plan, today = normalizeDate(new Date())) {
  if (!plan) {
    return { hasOverdue: false, count: 0, amount: 0 };
  }

  const startDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(startDate, plan.countMode);
  const paidMonths = new Set(getPaidMonths(plan));
  const maxMonths = getPlanMonthLimit(plan);
  let count = 0;
  let amount = 0;
  let firstMonthIndex = null;
  let firstDueDate = null;

  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    if (paidMonths.has(monthIndex)) {
      continue;
    }

    const paymentDate = getPlanPaymentDate(plan, effectiveStartDate, monthIndex);

    if (today <= paymentDate) {
      continue;
    }

    count += 1;
    amount += getMonthRemainingValue(plan, monthIndex);

    if (!firstMonthIndex) {
      firstMonthIndex = monthIndex;
      firstDueDate = paymentDate;
    }
  }

  return {
    hasOverdue: count > 0,
    count,
    amount: roundMoney(amount),
    firstMonthIndex,
    firstDueDate,
    isAccount: isAccountPlan(plan)
  };
}

function getCreatePastMonthsStatus() {
  return document.querySelector('input[name="createPastMonthsStatus"]:checked')?.value || 'open';
}

function getEditPastMonthsStatus() {
  return document.querySelector('input[name="editPastMonthsStatus"]:checked')?.value || 'keep';
}

function getPastDueMonthIndexes(startInput, countMode, totalMonths, today = normalizeDate(new Date())) {
  const monthLimit = Number.parseInt(totalMonths, 10);

  if (!startInput || !Number.isInteger(monthLimit) || monthLimit <= 0) {
    return [];
  }

  const startDate = parseDateInput(startInput);

  if (Number.isNaN(startDate.getTime())) {
    return [];
  }

  const effectiveStartDate = getEffectiveStartDate(
    startDate,
    isValidCountMode(countMode) ? countMode : DEFAULT_COUNT_MODE
  );
  const paidMonthIndexes = [];

  for (let monthIndex = 1; monthIndex <= monthLimit; monthIndex += 1) {
    const dueDate = addMonths(effectiveStartDate, monthIndex - 1);

    if (today <= dueDate) {
      break;
    }

    paidMonthIndexes.push(monthIndex);
  }

  return paidMonthIndexes;
}

function updatePaidMonthsByPastStatus(plan, status) {
  if (!plan || status === 'keep') {
    return;
  }

  const dueMonthIndexes = getPastDueMonthIndexes(
    plan.startDate,
    plan.countMode,
    plan.totalMonths
  );
  const paidMonths = new Set(sanitizePaidMonths(plan.paidMonths ?? [], plan.totalMonths));

  dueMonthIndexes.forEach((monthIndex) => {
    if (status === 'paid') {
      paidMonths.add(monthIndex);
      removePartialMonthCredit(plan, monthIndex);
      return;
    }

    paidMonths.delete(monthIndex);
  });

  plan.paidMonths = sanitizePaidMonths([...paidMonths], plan.totalMonths);
}

function buildInitialPaidMonths(startInput, countMode, totalMonths) {
  if (getCreatePastMonthsStatus() !== 'paid') {
    return [];
  }

  return getPastDueMonthIndexes(startInput, countMode, totalMonths);
}

function applyPastMonthsEditStatus(plan) {
  updatePaidMonthsByPastStatus(plan, getEditPastMonthsStatus());
}

function buildEditPastMonthsStatusMessage() {
  const status = getEditPastMonthsStatus();

  if (status === 'keep') {
    return '';
  }

  const plan = editingPlanId
    ? plans.find((item) => item.id === editingPlanId)
    : null;
  const countMode = isValidCountMode(plan?.countMode) ? plan.countMode : DEFAULT_COUNT_MODE;
  const totalMonths = Number.parseInt(editTotalMonthsInput?.value, 10);
  const dueMonthCount = getPastDueMonthIndexes(
    editStartDateInput?.value,
    countMode,
    totalMonths
  ).length;

  if (dueMonthCount === 0) {
    return '';
  }

  const countLabel = dueMonthCount === 1
    ? '1 parcela anterior'
    : `${dueMonthCount} parcelas anteriores`;

  if (status === 'paid') {
    return ` ${countLabel} ${dueMonthCount === 1 ? 'foi marcada' : 'foram marcadas'} como paga${dueMonthCount === 1 ? '' : 's'}.`;
  }

  if (status === 'open') {
    return ` ${countLabel} ${dueMonthCount === 1 ? 'foi marcada' : 'foram marcadas'} como não paga${dueMonthCount === 1 ? '' : 's'}.`;
  }

  return '';
}

function updateCreatePastMonthsControl() {
  if (!createPastMonthsGroup || !createPastMonthsHint) {
    return;
  }

  const planType = getSelectedCreatePlanType();
  const isExpense = planType === PLAN_TYPE_EXPENSE;
  const isAccount = planType === PLAN_TYPE_ACCOUNT;
  createPastMonthsGroup.hidden = isExpense || isAccount;

  if (isExpense || isAccount) {
    return;
  }

  const totalMonths = Number.parseInt(createTotalMonthsInput?.value, 10);
  const dueMonthIndexes = getPastDueMonthIndexes(
    createStartDateInput?.value,
    DEFAULT_COUNT_MODE,
    totalMonths
  );
  const count = dueMonthIndexes.length;
  const status = getCreatePastMonthsStatus();

  if (!createStartDateInput?.value || !Number.isInteger(totalMonths) || totalMonths <= 0) {
    createPastMonthsHint.textContent = 'Informe a data e o total de meses para ver a prévia.';
    return;
  }

  if (count === 0) {
    createPastMonthsHint.textContent = 'Nenhuma parcela vencida até hoje será alterada ao salvar.';
    return;
  }

  const countLabel = count === 1 ? '1 parcela vencida' : `${count} parcelas vencidas`;
  createPastMonthsHint.textContent = status === 'paid'
    ? `Ao salvar, ${countLabel} entrará como paga.`
    : `Ao salvar, ${countLabel} ficará como não paga.`;
}

function updateEditPastMonthsControl() {
  if (!editPastMonthsGroup || !editPastMonthsHint) {
    return;
  }

  const plan = editingPlanId
    ? plans.find((item) => item.id === editingPlanId)
    : null;
  const isExpense = isExpensePlan(plan);
  const isAccount = isAccountPlan(plan);
  editPastMonthsGroup.hidden = isExpense || isAccount;

  if (isExpense || isAccount) {
    return;
  }

  const totalMonths = Number.parseInt(editTotalMonthsInput?.value, 10);
  const countMode = isValidCountMode(plan?.countMode) ? plan.countMode : DEFAULT_COUNT_MODE;
  const dueMonthIndexes = getPastDueMonthIndexes(
    editStartDateInput?.value,
    countMode,
    totalMonths
  );
  const count = dueMonthIndexes.length;
  const status = getEditPastMonthsStatus();

  if (!editStartDateInput?.value || !Number.isInteger(totalMonths) || totalMonths <= 0) {
    editPastMonthsHint.textContent = 'Informe a data e o total de meses para ver a prévia.';
    return;
  }

  if (count === 0) {
    editPastMonthsHint.textContent = 'Nenhuma parcela vencida até hoje será alterada ao salvar.';
    return;
  }

  const countLabel = count === 1 ? '1 parcela vencida' : `${count} parcelas vencidas`;

  if (status === 'paid') {
    editPastMonthsHint.textContent = `Ao salvar, ${countLabel} ficará como paga.`;
    return;
  }

  if (status === 'open') {
    editPastMonthsHint.textContent = `Ao salvar, ${countLabel} ficará como não paga.`;
    return;
  }

  const detectedLabel = count === 1 ? 'detectada' : 'detectadas';
  editPastMonthsHint.textContent = `${countLabel} ${detectedLabel}: os pagamentos atuais serão preservados.`;
}

function getPlanOverdueSummary(overdueInfo) {
  if (!overdueInfo?.hasOverdue) {
    return { shortLabel: '', details: '' };
  }

  const countLabel = overdueInfo.isAccount
    ? '1 conta vencida'
    : overdueInfo.count === 1
      ? '1 etapa vencida'
      : `${overdueInfo.count} etapas vencidas`;
  const shortLabel = overdueInfo.isAccount
    ? 'Conta vencida'
    : overdueInfo.count === 1
      ? '1 vencida'
      : `${overdueInfo.count} venc.`;
  const amountLabel = overdueInfo.amount > MONEY_EPSILON
    ? formatCurrencyRaw(overdueInfo.amount)
    : 'valor pendente';
  const sinceLabel = overdueInfo.firstDueDate
    ? `desde ${formatDate(overdueInfo.firstDueDate)}`
    : 'com atraso aberto';

  return {
    shortLabel,
    details: `${countLabel}, ${amountLabel}, ${sinceLabel}`
  };
}

function buildPlanOverdueInlineHtml(overdueInfo) {
  if (!overdueInfo?.hasOverdue) {
    return '';
  }

  const summary = getPlanOverdueSummary(overdueInfo);

  return `
            <span class="plan-overdue-inline" title="${escapeHtml(summary.details)}" aria-label="${escapeHtml(summary.details)}">${summary.shortLabel}</span>
  `;
}

function getTimelineDisplayMonths(plan, startDate, today, focusMonthIndex) {
  if (isAccountPlan(plan)) {
    return 1;
  }

  const parsedFocusMonth = Number.parseInt(focusMonthIndex, 10);
  const hasFocusMonth = Number.isInteger(parsedFocusMonth) && parsedFocusMonth > 0;
  const diffMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
  const elapsedMonths = Math.max(0, diffMonths);

  return isExpensePlan(plan)
    ? Math.min(getPlanMonthLimit(plan), Math.max(elapsedMonths + 12, hasFocusMonth ? parsedFocusMonth : 0))
    : getPlanMonthLimit(plan);
}

function getNextPendingPaymentMonthIndex(plan, startDate, today, paidMonths = new Set(getPaidMonths(plan))) {
  const maxMonths = getPlanMonthLimit(plan);

  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    if (paidMonths.has(monthIndex)) {
      continue;
    }

    const paymentDate = getPlanPaymentDate(plan, startDate, monthIndex);

    if (today <= paymentDate) {
      return monthIndex;
    }
  }

  return null;
}

function buildMonthTimelineModel(
  plan,
  startDate,
  today,
  monthIndex,
  paidMonths = new Set(getPaidMonths(plan)),
  nextPendingPaymentMonthIndex = getNextPendingPaymentMonthIndex(plan, startDate, today, paidMonths)
) {
  const periodStart = getPlanPeriodStart(plan, startDate, monthIndex);
  const dueDate = getPlanDueDate(plan, startDate, monthIndex);
  const paymentDate = getPlanPaymentDate(plan, startDate, monthIndex);
  const monthDays = Math.max(1, daysBetween(periodStart, dueDate));
  const monthElapsed = clamp(daysBetween(periodStart, today), 0, monthDays);
  const isPaid = paidMonths.has(monthIndex);
  const isAccount = isAccountPlan(plan);
  const isOverdue = !isPaid && today > paymentDate;
  const isNextPendingPayment = !isAccount && monthIndex === nextPendingPaymentMonthIndex;
  const progress = isAccount
    ? (isPaid || today > dueDate ? 100 : 0)
    : (isPaid || isOverdue) ? 100 : Math.round((monthElapsed / monthDays) * 100);
  const status = isAccount
    ? getAccountMonthStatus(today, dueDate, isPaid)
    : getMonthStatus(today, paymentDate, isPaid, isNextPendingPayment);
  const stateClass =
    isPaid
      ? 'is-paid'
      : status.className === 'overdue'
        ? 'is-overdue'
        : status.className === 'current'
          ? 'is-current'
          : '';
  const baseValue = getMonthBaseValue(plan, monthIndex);
  const partialCredit = getPartialMonthCredit(plan, monthIndex);
  const displayValue = isPaid ? baseValue : getMonthRemainingValue(plan, monthIndex);

  return {
    monthIndex,
    periodStart,
    dueDate,
    monthDays,
    isPaid,
    progress,
    status,
    stateClass,
    baseValue,
    partialCredit,
    displayValue,
    title: isAccount ? 'Pagamento único' : formatMonthYear(periodStart),
    dateLabel: isAccount ? 'Data de pagamento' : 'Período',
    dateText: formatDate(isAccount ? dueDate : periodStart),
    progressLabel: isAccount
      ? isPaid
        ? 'Conta quitada'
        : status.className === 'overdue'
          ? 'Conta vencida'
          : 'Aguardando pagamento'
      : `${progress}% desta etapa`,
    durationLabel: isAccount ? 'Valor previsto nesta data' : `${monthDays} dias previstos`
  };
}

function buildMonthValueHtml(model) {
  if (model.baseValue <= MONEY_EPSILON) {
    return '';
  }

  const partialCreditHtml = model.partialCredit > MONEY_EPSILON && !model.isPaid ? `
        <span class="installment-credit-display">Antecipado ${formatCurrencyRaw(model.partialCredit)}</span>
      ` : '';

  return `
      <div class="installment-value-row">
        <div class="installment-value-copy">
          <span class="installment-amount-display">${partialCreditHtml ? 'Restante ' : ''}${formatCurrencyRaw(model.displayValue)}</span>
          ${partialCreditHtml}
        </div>
        <button type="button" class="edit-installment-btn" data-edit-value-month="${model.monthIndex}" onclick="openInstallmentValuePrompt(event, ${model.monthIndex})" title="Editar valor desta parcela">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    `;
}

function createMonthTimelineCard(model) {
  const card = document.createElement('article');
  card.className = `month-card${model.stateClass ? ` ${model.stateClass}` : ''}`;
  card.dataset.monthIndex = String(model.monthIndex);
  card.innerHTML = `
      <div class="month-card-header">
        <div class="month-card-heading">
          <strong class="month-index">${model.title}</strong>
          <span class="month-date-label">${model.dateLabel}</span>
          <span class="month-date">${model.dateText}</span>
        </div>
        <span class="month-status ${model.status.className}">${model.status.label}</span>
      </div>
      <div class="month-card-body">
        ${buildMonthValueHtml(model)}
        <div class="month-progress" aria-hidden="true">
          <div class="month-progress-bar" style="width:${model.progress}%"></div>
        </div>
        <div class="month-card-footer">
          <strong class="month-progress-label">${model.progressLabel}</strong>
          <span class="month-days">${model.durationLabel}</span>
        </div>
      </div>
      <button
        type="button"
        class="month-toggle-btn"
        data-toggle-paid="true"
        data-month-index="${model.monthIndex}"
        aria-pressed="${model.isPaid ? 'true' : 'false'}"
      >
        ${model.isPaid ? 'Desfazer pagamento' : 'Marcar como pago'}
      </button>
    `;

  return card;
}

function updateMonthTimelineCard(card, model, options = {}) {
  if (!card) {
    return;
  }

  card.dataset.monthIndex = String(model.monthIndex);
  card.classList.remove('is-paid', 'is-current', 'is-overdue');

  if (model.stateClass) {
    card.classList.add(model.stateClass);
  }

  const titleElement = card.querySelector('.month-index');
  if (titleElement) {
    titleElement.textContent = model.title;
  }

  const dateLabelElement = card.querySelector('.month-date-label');
  if (dateLabelElement) {
    dateLabelElement.textContent = model.dateLabel;
  }

  const dateElement = card.querySelector('.month-date');
  if (dateElement) {
    dateElement.textContent = model.dateText;
  }

  const statusElement = card.querySelector('.month-status');
  if (statusElement) {
    statusElement.textContent = model.status.label;
    statusElement.className = `month-status ${model.status.className}`;
  }

  const cardBody = card.querySelector('.month-card-body');
  const currentValueRow = cardBody?.querySelector('.installment-value-row');
  const nextValueHtml = buildMonthValueHtml(model);

  if (nextValueHtml) {
    if (currentValueRow) {
      currentValueRow.outerHTML = nextValueHtml;
    } else {
      cardBody?.insertAdjacentHTML('afterbegin', nextValueHtml);
    }
  } else {
    currentValueRow?.remove();
  }

  const progressBar = card.querySelector('.month-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${model.progress}%`;
  }

  const progressLabel = card.querySelector('.month-progress-label');
  if (progressLabel) {
    progressLabel.textContent = model.progressLabel;
  }

  const daysElement = card.querySelector('.month-days');
  if (daysElement) {
    daysElement.textContent = model.durationLabel;
  }

  const toggleButton = card.querySelector('[data-toggle-paid]');
  if (toggleButton) {
    toggleButton.dataset.monthIndex = String(model.monthIndex);
    toggleButton.textContent = model.isPaid ? 'Desfazer pagamento' : 'Marcar como pago';
    toggleButton.setAttribute('aria-pressed', model.isPaid ? 'true' : 'false');
  }

  if (options.highlight) {
    card.classList.remove('is-state-changing');
    void card.offsetWidth;
    card.classList.add('is-state-changing');

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const transitionTime = prefersReducedMotion ? 80 : 420;
    window.setTimeout(() => {
      card.classList.remove('is-state-changing');
    }, transitionTime);
  }
}

function scrollMonthlyTimelineToTarget(focusMonthIndex, hasFocusMonth) {
  const focusCard = hasFocusMonth
    ? monthlyContainer.querySelector(`.month-card[data-month-index="${focusMonthIndex}"]`)
    : null;
  const firstUnpaidCard = monthlyContainer.querySelector('.month-card:not(.is-paid)');
  const lastCard = monthlyContainer.querySelector('.month-card:last-child');
  const targetCard = focusCard || firstUnpaidCard || lastCard;

  if (targetCard) {
    window.setTimeout(() => {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: hasFocusMonth ? 'center' : 'nearest',
        inline: hasFocusMonth ? 'center' : 'start'
      });
    }, 80);
  } else {
    monthlyContainer.scrollLeft = 0;
  }
}

function refreshMonthlyTimelineCards(plan, options = {}) {
  const today = normalizeDate(new Date());
  const effectiveStartDate = getEffectiveStartDate(parseDateInput(plan.startDate), plan.countMode);
  const focusMonthIndex = Number.parseInt(options.focusMonthIndex, 10);
  const highlightMonthIndex = Number.parseInt(options.highlightMonthIndex, 10);
  const onlyMonthIndex = Number.parseInt(options.onlyMonthIndex, 10);
  const hasFocusMonth = Number.isInteger(focusMonthIndex) && focusMonthIndex > 0;
  const hasOnlyMonth = Number.isInteger(onlyMonthIndex) && onlyMonthIndex > 0;
  const displayMonths = getTimelineDisplayMonths(plan, effectiveStartDate, today, focusMonthIndex);
  const cards = monthlyContainer.querySelectorAll('.month-card');

  if (cards.length !== displayMonths) {
    renderMonthlyTimeline(plan, effectiveStartDate, today, options);
    return false;
  }

  const paidMonths = new Set(getPaidMonths(plan));
  const nextPendingPaymentMonthIndex = getNextPendingPaymentMonthIndex(plan, effectiveStartDate, today, paidMonths);
  const monthIndexes = hasOnlyMonth
    ? [onlyMonthIndex]
    : Array.from({ length: displayMonths }, (_, index) => index + 1);

  for (const monthIndex of monthIndexes) {
    const card = monthlyContainer.querySelector(`.month-card[data-month-index="${monthIndex}"]`);

    if (!card) {
      renderMonthlyTimeline(plan, effectiveStartDate, today, options);
      return false;
    }

    updateMonthTimelineCard(
      card,
      buildMonthTimelineModel(plan, effectiveStartDate, today, monthIndex, paidMonths, nextPendingPaymentMonthIndex),
      { highlight: Number.isInteger(highlightMonthIndex) && highlightMonthIndex === monthIndex }
    );
  }

  if (options.resetTimelineScroll || hasFocusMonth) {
    scrollMonthlyTimelineToTarget(focusMonthIndex, hasFocusMonth);
  }

  return true;
}

function renderMonthlyTimeline(plan, startDate, today, options = {}) {
  const paidMonths = new Set(getPaidMonths(plan));
  const nextPendingPaymentMonthIndex = getNextPendingPaymentMonthIndex(plan, startDate, today, paidMonths);
  const focusMonthIndex = Number.parseInt(options.focusMonthIndex, 10);
  const hasFocusMonth = Number.isInteger(focusMonthIndex) && focusMonthIndex > 0;
  const displayMonths = getTimelineDisplayMonths(plan, startDate, today, focusMonthIndex);
  const fragment = document.createDocumentFragment();

  for (let monthIndex = 1; monthIndex <= displayMonths; monthIndex += 1) {
    const model = buildMonthTimelineModel(plan, startDate, today, monthIndex, paidMonths, nextPendingPaymentMonthIndex);
    fragment.appendChild(createMonthTimelineCard(model));
  }

  monthlyContainer.classList.add('is-rendering');
  monthlyContainer.replaceChildren(fragment);

  window.requestAnimationFrame(() => {
    monthlyContainer.classList.remove('is-rendering');
  });

  if (options.resetTimelineScroll || hasFocusMonth) {
    scrollMonthlyTimelineToTarget(focusMonthIndex, hasFocusMonth);
  }
}

function findRenderedPlanEntry(planId) {
  return [...plansList.querySelectorAll('.plan-entry')]
    .find((entry) => entry.dataset.planId === planId);
}

function refreshPlanListEntry(plan) {
  if (!plan) {
    return;
  }

  updateMonthlyDebtSummary();
  updateMonthlyTotal();

  const filteredPlans = getFilteredPlans();
  const planIndex = filteredPlans.findIndex((item) => item.id === plan.id);

  if (planIndex < 0) {
    renderPlansList();
    return;
  }

  const entry = findRenderedPlanEntry(plan.id);

  if (!entry) {
    renderPlansList();
    return;
  }

  const planNumber = planIndex + 1;
  const planStartDate = parseDateInput(plan.startDate);
  const effectiveStartDate = getEffectiveStartDate(planStartDate, plan.countMode);
  const planEndDate = getPlanEndDate(plan, effectiveStartDate);
  const isExpense = isExpensePlan(plan);
  const isAccount = isAccountPlan(plan);
  const financials = calculatePlanFinancials(plan);
  const paidMonthsCount = getPaidMonths(plan).length;
  const nextUnpaidMonth = getNextUnpaidMonthIndex(plan);
  const currentInstallment = nextUnpaidMonth ? getMonthRemainingValue(plan, nextUnpaidMonth) : 0;
  const overdueInfo = getPlanOverdueInfo(plan);

  entry.dataset.planNumber = String(planNumber);

  const item = entry.querySelector('.plan-item');
  if (item) {
    item.dataset.planNumber = String(planNumber);
    item.dataset.planId = plan.id;
    item.style.setProperty('--plan-progress', financials.progressRatio);
    item.classList.toggle('active', plan.id === selectedPlanId);
    item.classList.toggle('has-overdue', overdueInfo.hasOverdue);
    item.classList.remove('is-soft-updated');
    void item.offsetWidth;
    item.classList.add('is-soft-updated');

    window.setTimeout(() => {
      item.classList.remove('is-soft-updated');
    }, 420);
  }

  const selectButton = entry.querySelector('.plan-select-btn');
  if (selectButton) {
    selectButton.dataset.planId = plan.id;
  }

  const planTag = entry.querySelector('.plan-item-tag');
  if (planTag) {
    planTag.textContent = String(planNumber).padStart(2, '0');
  }

  const durationPill = entry.querySelector('.plan-duration-pill');
  if (durationPill) {
    durationPill.textContent = getPlanListDurationLabel(plan);
  }

  const planName = entry.querySelector('.plan-item-name');
  if (planName) {
    planName.textContent = plan.name;
  }

  const mainRow = entry.querySelector('.plan-item-main-row');
  const valueDisplay = entry.querySelector('.plan-item-value');
  const progressMeta = entry.querySelector('.plan-progress-meta');
  const progressLabel = entry.querySelector('.plan-progress-label');
  const overdueInline = entry.querySelector('.plan-overdue-inline');
  const nextOverdueInlineHtml = buildPlanOverdueInlineHtml(overdueInfo);

  if (progressLabel) {
    progressLabel.textContent = overdueInfo.hasOverdue ? 'Atraso' : 'Andamento';
  }

  if (nextOverdueInlineHtml) {
    if (overdueInline) {
      overdueInline.outerHTML = nextOverdueInlineHtml;
    } else {
      progressMeta?.insertAdjacentHTML('beforeend', nextOverdueInlineHtml);
    }
  } else {
    overdueInline?.remove();
  }

  if (currentInstallment > MONEY_EPSILON) {
    if (valueDisplay) {
      valueDisplay.textContent = formatCurrencyRaw(currentInstallment);
    } else {
      mainRow?.insertAdjacentHTML(
        'beforeend',
        `<div class="plan-item-value" style="font-family: 'Space Grotesk'; color: var(--primary); font-weight: 700; font-size: 0.95rem; white-space: nowrap;">${formatCurrencyRaw(currentInstallment)}</div>`
      );
    }
  } else {
    valueDisplay?.remove();
  }

  const progressValue = entry.querySelector('.plan-progress-value');
  if (progressValue) {
    progressValue.textContent = isExpense ? '∞' : `${financials.progressPercent}%`;
  }

  const progressFill = entry.querySelector('.plan-progress-fill');
  if (progressFill) {
    if (isExpense) {
      progressFill.style.width = '100%';
      progressFill.style.background = 'var(--muted)';
    } else {
      progressFill.style.removeProperty('width');
      progressFill.style.removeProperty('background');
    }
  }

  const statCards = entry.querySelectorAll('.plan-stat-card');
  const startValue = statCards[0]?.querySelector('.plan-stat-value');
  const paidValue = statCards[1]?.querySelector('.stat-value');
  const endValue = statCards[2]?.querySelector('.plan-stat-value');

  if (startValue) {
    startValue.textContent = formatDateShort(planStartDate);
  }

  if (paidValue) {
    paidValue.textContent = getPlanPaidSummaryLabel(plan, paidMonthsCount);
  }

  if (endValue) {
    endValue.textContent = getPlanEndSummaryLabel(plan, planEndDate);
  }

  const endLabel = statCards[2]?.querySelector('.plan-stat-label');
  if (endLabel) {
    endLabel.textContent = isAccount ? 'Data' : 'Fim';
  }

  const visibleNumber = getVisiblePlanNumber();
  updatePlansSummary(visibleNumber);
  updateFocusedPlanCard(visibleNumber);
}

function refreshPlanUiAfterPaymentChange(plan, options = {}) {
  if (!plan) {
    return;
  }

  updatePlanDetailsSummary(plan);
  refreshMonthlyTimelineCards(plan, options);
  refreshPlanListEntry(plan);
  updateResultsNavigation();

  if (!resultsSection.hidden) {
    syncModalBodyState();
  }

  updateMonthlyDebtSummary();
}

function getMonthStatus(today, paymentDate, isPaid, isNextPendingPayment = false) {
  if (isPaid) {
    return { label: 'Pago', className: 'paid' };
  }

  if (today > paymentDate) {
    return { label: 'Não pago', className: 'overdue' };
  }

  if (today.getTime() === paymentDate.getTime() || isNextPendingPayment) {
    return { label: 'Aguardando', className: 'current' };
  }

  return { label: 'Aguardando', className: 'pending' };
}

function getAccountMonthStatus(today, dueDate, isPaid) {
  if (isPaid) {
    return { label: 'Pago', className: 'paid' };
  }

  if (today > dueDate) {
    return { label: 'Não pago', className: 'overdue' };
  }

  if (today.getTime() === dueDate.getTime()) {
    return { label: 'Vence hoje', className: 'current' };
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

function updateMonthlyDebtSummary() {
  const badgeValue = document.getElementById('monthlyTotalValue');
  if (!badgeValue) return;

  renderMonthlyTotalBadge(getMonthlyDebtBreakdown(new Date()).total);
  updateMonthlyOverdueSummary();
}

function updateMonthlyOverdueSummary() {
  const container = document.getElementById('monthlyOverdueContainer');
  const valueEl = document.getElementById('monthlyOverdueValue');
  if (!container || !valueEl) return;

  const overdueTotal = getOverdueDebtTotal(new Date());
  valueEl.textContent = overdueTotal > MONEY_EPSILON ? `- ${formatCurrency(overdueTotal)}` : formatCurrency(0);
  
  // Mantém o container visível para não quebrar a simetria do painel,
  // mas reduz a opacidade se não houver atrasos.
  container.style.opacity = overdueTotal > MONEY_EPSILON ? '1' : '0.35';
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
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.className = 'status-message';
  statusMessage.hidden = !message;

  if (type) {
    statusMessage.classList.add(type);
  }
}

function setBulkPaymentStatus(message, type = '') {
  if (!bulkPaymentStatus) {
    return;
  }

  bulkPaymentStatus.textContent = message;
  bulkPaymentStatus.hidden = !message;
  bulkPaymentStatus.className = 'bulk-payment-status';

  if (type) {
    bulkPaymentStatus.classList.add(type);
  }
}

function updateBulkPaymentHistoryActions(plan) {
  if (!bulkPaymentHistoryActions) {
    return;
  }

  const lastAction = getLastBulkPaymentAction(plan);
  const hasLastAction = Boolean(lastAction);

  bulkPaymentHistoryActions.hidden = !hasLastAction;

  if (adjustLastBulkPaymentBtn) {
    adjustLastBulkPaymentBtn.textContent = bulkPaymentModalMode === 'edit-last'
      ? 'Novo lance'
      : 'Alterar último lance';
  }

  if (deleteLastBulkPaymentBtn) {
    deleteLastBulkPaymentBtn.hidden = !hasLastAction;
  }
}

function setBulkPaymentCreateMode(plan, options = {}) {
  bulkPaymentModalMode = 'create';

  if (confirmBulkPaymentBtn) {
    confirmBulkPaymentBtn.textContent = 'Confirmar Baixa';
  }

  if (!options.keepValue) {
    bulkPaymentValueInput.value = '';
  }

  const nextUnpaidMonth = getNextUnpaidMonthIndex(plan);
  const nextValue = nextUnpaidMonth ? getMonthRemainingValue(plan, nextUnpaidMonth) : 0;
  const lastAction = getLastBulkPaymentAction(plan);
  const lastMessage = lastAction
    ? ` Último lance: ${formatCurrency(lastAction.amount)}.`
    : '';

  if (nextValue > MONEY_EPSILON) {
    setBulkPaymentStatus(`Próxima baixa disponível: ${formatCurrency(nextValue)}.${lastMessage}`, 'info');
  } else {
    setBulkPaymentStatus(`Configure o valor da parcela para usar a antecipação.${lastMessage}`, 'error');
  }

  updateBulkPaymentHistoryActions(plan);
}

function setBulkPaymentEditMode(plan) {
  const lastAction = getLastBulkPaymentAction(plan);

  if (!lastAction) {
    setBulkPaymentStatus('Nenhum lance anterior encontrado para alterar.', 'error');
    setBulkPaymentCreateMode(plan, { keepValue: true });
    return;
  }

  bulkPaymentModalMode = 'edit-last';
  bulkPaymentValueInput.value = formatCurrencyRaw(lastAction.amount);

  if (confirmBulkPaymentBtn) {
    confirmBulkPaymentBtn.textContent = 'Salvar Alteração';
  }

  setBulkPaymentStatus(
    `Editando o último lance de ${formatCurrency(lastAction.amount)}. Ajuste o valor ou apague esse lançamento.`,
    'info'
  );
  updateBulkPaymentHistoryActions(plan);
  window.setTimeout(() => {
    bulkPaymentValueInput.focus();
    bulkPaymentValueInput.select();
  }, 20);
}

function openBulkPaymentModal(plan) {
  if (!bulkPaymentModal || !bulkPaymentValueInput) {
    return;
  }

  setBulkPaymentCreateMode(plan);
  bulkPaymentModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => bulkPaymentValueInput.focus(), 20);
}

function closeBulkPaymentModal() {
  if (!bulkPaymentModal) {
    return;
  }

  bulkPaymentModal.hidden = true;
  bulkPaymentModalMode = 'create';
  setBulkPaymentStatus('');
  syncModalBodyState();
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatDateTime(date) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
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

function openStatementImportModal() {
  if (!statementImportModal) {
    return;
  }

  statementDetectedItems = [];
  statementImportFile = null;
  statementImportBankName = '--';
  if (statementFileInput) statementFileInput.value = '';
  if (statementFileName) statementFileName.textContent = 'Escolher OFX, CSV ou PDF';
  setStatementImportStage('file');
  setStatementImportStatus('', '');
  statementImportModal.hidden = false;
  syncModalBodyState();

  window.setTimeout(() => {
    statementFileInput?.focus();
  }, 20);
}

function closeStatementImportModal() {
  if (!statementImportModal) {
    return;
  }

  statementImportModal.hidden = true;
  setStatementImportStatus('', '');
  syncModalBodyState();
}

function handleStatementFileSelection() {
  statementImportFile = statementFileInput?.files?.[0] ?? null;
  if (statementFileName) {
    statementFileName.textContent = statementImportFile?.name || 'Escolher OFX, CSV ou PDF';
  }
  if (analyzeStatementFileBtn) {
    analyzeStatementFileBtn.disabled = !statementImportFile;
  }
  setStatementImportStatus('', '');
}

function setStatementImportStage(stage) {
  statementImportStage = stage;
  const isFile = stage === 'file';
  const isReading = stage === 'reading';
  const isReview = stage === 'review';

  if (statementFileStage) statementFileStage.hidden = !isFile;
  if (statementReadingStage) statementReadingStage.hidden = !isReading;
  if (statementReviewStage) statementReviewStage.hidden = !isReview;

  document.querySelectorAll('[data-statement-step]').forEach((step) => {
    const stepOrder = ['file', 'reading', 'review'];
    const activeIndex = stepOrder.indexOf(stage);
    const stepIndex = stepOrder.indexOf(step.dataset.statementStep);

    step.classList.toggle('is-active', step.dataset.statementStep === stage);
    step.classList.toggle('is-complete', stepIndex >= 0 && stepIndex < activeIndex);
  });

  if (backStatementImportBtn) backStatementImportBtn.hidden = isFile || isReading;
  if (analyzeStatementFileBtn) {
    analyzeStatementFileBtn.hidden = !isFile;
    analyzeStatementFileBtn.disabled = !statementImportFile;
  }
  if (confirmStatementImportBtn) {
    confirmStatementImportBtn.hidden = !isReview;
  }
}

async function analyzeStatementImportFile() {
  if (!statementImportFile) {
    setStatementImportStatus('Escolha um arquivo OFX, CSV ou PDF para analisar.', 'error');
    return;
  }

  setStatementImportStatus('', '');
  setStatementImportStage('reading');

  try {
    const content = await readStatementFileAsText(statementImportFile);
    const result = parseStatementImportContent(content, statementImportFile);
    statementDetectedItems = result.items;
    statementImportBankName = result.bankName;
    renderStatementDetectedItems();
    setStatementImportStage('review');
    setStatementImportStatus(result.message, result.items.length > 0 ? 'success' : 'error');
  } catch {
    setStatementImportStage('file');
    setStatementImportStatus('Não foi possível ler esse arquivo. Tente exportar em OFX ou CSV pelo app do banco.', 'error');
  }
}

function readStatementFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'utf-8');
  });
}

function parseStatementImportContent(content, file) {
  const fileName = file?.name || 'arquivo';
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const normalizedContent = normalizeStatementText(content);
  const bankName = detectStatementBank(`${fileName}\n${content}`);
  const invoices = detectInvoiceSummaries(normalizedContent, bankName, fileName);
  const transactions = extension === 'ofx'
    ? parseOfxTransactions(content, bankName, fileName)
    : parseDelimitedTransactions(content, bankName, fileName);
  const detectedItems = [...invoices, ...transactions]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.externalId === item.externalId) === index)
    .map((item) => ({
      ...item,
      selected: item.confidence >= 85 && !isStatementImportDuplicate(item)
    }));

  const pdfNote = extension === 'pdf'
    ? ' PDF é experimental; revise os valores antes de adicionar.'
    : '';

  return {
    bankName,
    items: detectedItems,
    message: detectedItems.length > 0
      ? `${detectedItems.length} possível ${detectedItems.length === 1 ? 'compromisso encontrado' : 'compromissos encontrados'} em ${fileName}.${pdfNote}`
      : `Nenhum compromisso claro foi encontrado em ${fileName}. OFX e CSV costumam funcionar melhor que PDF.`
  };
}

function normalizeStatementText(value) {
  return String(value || '')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function detectStatementBank(value) {
  const text = normalizeStatementText(value);
  const candidates = [
    ['Nubank', /\bnubank\b|\bnu pagamentos\b/],
    ['Itaú', /\bitau\b/],
    ['Banco do Brasil', /\bbanco do brasil\b|\bbb\b/],
    ['Caixa', /\bcaixa\b|\bcef\b/],
    ['Santander', /\bsantander\b/],
    ['Inter', /\bbanco inter\b|\binter\b/],
    ['Bradesco', /\bbradesco\b/],
    ['C6 Bank', /\bc6\b/],
    ['Mercado Pago', /\bmercado pago\b/]
  ];
  const match = candidates.find(([, pattern]) => pattern.test(text));
  return match?.[0] || 'Banco não identificado';
}

function detectInvoiceSummaries(text, bankName, fileName) {
  const invoiceTotalMatch = text.match(/(?:total da fatura|valor da fatura|valor total|total a pagar|pagamento total)[^\d-]{0,28}(-?\s*r?\$?\s*[\d.]+,\d{2})/i);
  const dueDateMatch = text.match(/(?:vencimento|vence em|data de vencimento)[^\d]{0,24}(\d{2}\/\d{2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/i);

  if (!invoiceTotalMatch || !dueDateMatch) {
    return [];
  }

  const amount = Math.abs(parseCurrencyToNumber(invoiceTotalMatch[1]));
  const dueDate = parseStatementDate(dueDateMatch[1]);

  if (!dueDate || amount <= MONEY_EPSILON) {
    return [];
  }

  const externalId = createStatementExternalId(fileName, bankName, 'invoice-summary', dueDate, amount);

  return [{
    id: externalId,
    externalId,
    name: `Fatura ${bankName}`,
    bank: bankName,
    kind: 'Fatura importada',
    dueDate,
    amount: roundMoney(amount),
    confidence: 92,
    status: 'confirmed',
    evidence: 'Resumo de fatura com total e vencimento encontrados no arquivo.'
  }];
}

function parseOfxTransactions(content, bankName, fileName) {
  const blocks = String(content || '').match(/<STMTTRN>[\s\S]*?(?=<STMTTRN>|<\/BANKTRANLIST>|$)/gi) || [];

  return blocks
    .map((block, index) => {
      const amount = Math.abs(Number.parseFloat(readOfxTag(block, 'TRNAMT').replace(',', '.')) || 0);
      const date = parseStatementDate(readOfxTag(block, 'DTPOSTED'));
      const description = [readOfxTag(block, 'NAME'), readOfxTag(block, 'MEMO')].filter(Boolean).join(' ');
      return buildStatementDetectedItem({ amount, date, description, bankName, fileName, rowId: `ofx-${index}` });
    })
    .filter(Boolean);
}

function readOfxTag(block, tag) {
  const match = String(block || '').match(new RegExp(`<${tag}>([^<\\r\\n]+)`, 'i'));
  return match?.[1]?.trim() || '';
}

function parseDelimitedTransactions(content, bankName, fileName) {
  const lines = String(content || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  return lines
    .map((line, index) => {
      const delimiter = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
      const columns = line.split(delimiter).map((column) => column.trim().replace(/^"|"$/g, ''));
      const joined = columns.join(' ');
      const date = parseStatementDate(joined);
      const amount = findStatementAmount(columns);
      const description = columns
        .filter((column) => !parseStatementDate(column) && Math.abs(parseCurrencyToNumber(column)) <= MONEY_EPSILON)
        .join(' ') || joined;

      return buildStatementDetectedItem({ amount: Math.abs(amount), date, description, bankName, fileName, rowId: `row-${index}` });
    })
    .filter(Boolean);
}

function findStatementAmount(columns) {
  const numericCandidates = columns
    .map((column) => parseCurrencyToNumber(column))
    .filter((value) => Math.abs(value) > MONEY_EPSILON);

  return numericCandidates.at(-1) || 0;
}

function buildStatementDetectedItem({ amount, date, description, bankName, fileName, rowId }) {
  if (!date || amount <= MONEY_EPSILON || !looksLikePayableDescription(description)) {
    return null;
  }

  const confidence = getStatementConfidence(description);
  const status = confidence >= 85 ? 'confirmed' : 'review';
  const name = createStatementItemName(description, bankName);
  const externalId = createStatementExternalId(fileName, bankName, rowId, date, amount);

  return {
    id: externalId,
    externalId,
    name,
    bank: bankName,
    kind: 'Lançamento importado',
    dueDate: date,
    amount: roundMoney(amount),
    confidence,
    status,
    evidence: `Encontrado no arquivo: ${description.slice(0, 120)}`
  };
}

function looksLikePayableDescription(description) {
  const text = normalizeStatementText(description);
  return /\bfatura\b|\bcartao\b|\bcredito\b|\bboleto\b|\bemprest|\bfinanc|\bparcela\b|\bprestacao\b|\bconsignado\b/.test(text);
}

function getStatementConfidence(description) {
  const text = normalizeStatementText(description);
  if (/\bfatura\b.*\bcartao\b|\bcartao\b.*\bfatura\b|total da fatura/.test(text)) return 90;
  if (/\bemprest|\bfinanc|\bconsignado\b/.test(text)) return 86;
  if (/\bboleto\b|\bparcela\b|\bprestacao\b/.test(text)) return 76;
  return 62;
}

function createStatementItemName(description, bankName) {
  const text = normalizeStatementText(description);
  if (/\bfatura\b|\bcartao\b/.test(text)) return `Fatura ${bankName}`;
  if (/\bemprest|\bfinanc|\bconsignado\b/.test(text)) return `Crédito ${bankName}`;
  if (/\bboleto\b/.test(text)) return `Boleto ${bankName}`;
  return `Compromisso ${bankName}`;
}

function parseStatementDate(value) {
  const text = String(value || '');
  const isoOfxMatch = text.match(/(\d{4})(\d{2})(\d{2})/);
  if (isoOfxMatch) {
    return `${isoOfxMatch[1]}-${isoOfxMatch[2]}-${isoOfxMatch[3]}`;
  }

  const brMatch = text.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
  if (brMatch) {
    const year = brMatch[3].length === 2 ? `20${brMatch[3]}` : brMatch[3];
    return `${year}-${brMatch[2]}-${brMatch[1]}`;
  }

  const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  return isoMatch ? isoMatch[0] : '';
}

function createStatementExternalId(fileName, bankName, rowId, dueDate, amount) {
  const base = `${fileName}|${bankName}|${rowId}|${dueDate}|${roundMoney(amount)}`;
  let hash = 0;
  for (let index = 0; index < base.length; index += 1) {
    hash = ((hash << 5) - hash + base.charCodeAt(index)) | 0;
  }
  return `statement:${Math.abs(hash).toString(16)}`;
}

function renderStatementDetectedItems() {
  if (!statementDetectedList) {
    return;
  }

  if (statementDetectedBank) statementDetectedBank.textContent = statementImportBankName;

  if (statementDetectedItems.length === 0) {
    statementDetectedList.innerHTML = '<div class="empty-state">Nenhum compromisso claro foi encontrado. Você ainda pode cadastrar manualmente pela tela principal.</div>';
    updateStatementReviewSummary();
    return;
  }

  statementDetectedList.innerHTML = statementDetectedItems.map((item) => {
    const isConfirmed = item.status === 'confirmed';
    const isDuplicate = isStatementImportDuplicate(item);
    const dueDate = formatDate(parseDateInput(item.dueDate));
    const checkedAttr = item.selected ? 'checked' : '';
    const disabledAttr = isDuplicate ? 'disabled' : '';
    const confidenceLabel = isDuplicate ? 'Duplicado' : isConfirmed ? 'Confirmado' : 'Revisar';

    return `
      <article class="bank-detected-item ${isDuplicate ? 'is-duplicate' : isConfirmed ? 'is-confirmed' : 'needs-review'}">
        <label class="bank-detected-check">
          <input type="checkbox" data-statement-detected-id="${escapeHtml(item.id)}" ${checkedAttr} ${disabledAttr}>
          <span></span>
        </label>
        <div class="bank-detected-content">
          <div class="bank-detected-top">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.bank)} • ${escapeHtml(item.kind)}</span>
            </div>
            <em class="${isDuplicate ? 'is-muted' : isConfirmed ? 'is-safe' : 'is-warning'}">${confidenceLabel}${isDuplicate ? '' : ` ${item.confidence}%`}</em>
          </div>
          <div class="bank-detected-meta">
            <span>Data ${dueDate}</span>
            <strong>${formatCurrency(item.amount)}</strong>
          </div>
          <p>${escapeHtml(isDuplicate ? 'Este item já foi importado antes e ficará bloqueado para evitar duplicidade.' : item.evidence)}</p>
        </div>
      </article>
    `;
  }).join('');

  statementDetectedList.querySelectorAll('[data-statement-detected-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const item = statementDetectedItems.find((entry) => entry.id === checkbox.dataset.statementDetectedId);
      if (item) {
        item.selected = checkbox.checked;
        updateStatementReviewSummary();
      }
    });
  });

  updateStatementReviewSummary();
}

function updateStatementReviewSummary() {
  const selectedItems = statementDetectedItems.filter((item) => item.selected && !isStatementImportDuplicate(item));
  const selectedTotal = selectedItems.reduce((total, item) => total + item.amount, 0);

  if (statementDetectedCount) statementDetectedCount.textContent = String(statementDetectedItems.length);
  if (statementDetectedTotal) statementDetectedTotal.textContent = formatCurrency(selectedTotal);
  if (confirmStatementImportBtn) confirmStatementImportBtn.disabled = selectedItems.length === 0;
}

function confirmStatementDetectedItems() {
  const selectedItems = statementDetectedItems.filter((item) => item.selected && !isStatementImportDuplicate(item));

  if (selectedItems.length === 0) {
    setStatementImportStatus('Selecione pelo menos um item novo para adicionar.', 'error');
    return;
  }

  const nextPlans = selectedItems.map((item) => ({
    id: createPlanId(),
    name: item.name,
    startDate: item.dueDate,
    totalMonths: 1,
    countMode: DEFAULT_COUNT_MODE,
    planType: PLAN_TYPE_ACCOUNT,
    isExpense: false,
    totalValue: roundMoney(item.amount),
    installmentValue: roundMoney(item.amount),
    manualMonthValues: {},
    partialMonthCredits: {},
    paidMonths: [],
    importSource: {
      type: 'statement-file',
      externalId: item.externalId,
      bank: item.bank,
      kind: item.kind,
      confidence: item.confidence,
      evidence: item.evidence,
      fileName: statementImportFile?.name || '',
      importedAt: new Date().toISOString()
    }
  }));

  plans.unshift(...nextPlans);
  selectedPlanId = nextPlans[0].id;
  savePlans();
  renderPlansList();
  renderPlanDetails(nextPlans[0], { resetTimelineScroll: true });
  closeStatementImportModal();
  setStatus(`${nextPlans.length} ${nextPlans.length === 1 ? 'compromisso foi adicionado' : 'compromissos foram adicionados'} pela importação gratuita.`, 'success');
  scrollToSection(plansPanel);
}

function isStatementImportDuplicate(item) {
  return plans.some((plan) => plan.importSource?.externalId === item.externalId);
}

function setStatementImportStatus(message, type) {
  if (!statementImportStatus) {
    return;
  }

  if (!message) {
    statementImportStatus.hidden = true;
    statementImportStatus.className = 'status-message bank-import-status';
    return;
  }

  statementImportStatus.hidden = false;
  statementImportStatus.textContent = message;
  statementImportStatus.className = 'status-message bank-import-status';

  if (type) {
    statementImportStatus.classList.add(type);
  }
}

function openBankImportModal() {
  if (!bankImportModal) {
    return;
  }

  bankDetectedItems = [];
  selectedBankId = null;
  renderBankPicker();
  setBankImportStage('select');
  setBankImportStatus('', '');
  bankImportModal.hidden = false;
  syncModalBodyState();

  window.setTimeout(() => {
    bankPickerGrid?.querySelector('button')?.focus();
  }, 20);
}

function closeBankImportModal() {
  if (!bankImportModal) {
    return;
  }

  bankImportModal.hidden = true;
  setBankImportStatus('', '');
  syncModalBodyState();
}

function setBankImportStage(stage) {
  currentBankImportStage = stage;
  const isSelect = stage === 'select';
  const isConsent = stage === 'consent';
  const isReading = stage === 'reading';
  const isReview = stage === 'review';

  if (bankSelectStage) bankSelectStage.hidden = !isSelect;
  if (bankConsentStage) bankConsentStage.hidden = !isConsent;
  if (bankReadingStage) bankReadingStage.hidden = !isReading;
  if (bankReviewStage) bankReviewStage.hidden = !isReview;

  document.querySelectorAll('[data-bank-step]').forEach((step) => {
    const stepOrder = ['select', 'consent', 'reading', 'review'];
    const activeIndex = stepOrder.indexOf(stage);
    const stepIndex = stepOrder.indexOf(step.dataset.bankStep);

    step.classList.toggle('is-active', step.dataset.bankStep === stage);
    step.classList.toggle('is-complete', stepIndex >= 0 && stepIndex < activeIndex);
  });

  if (backBankImportBtn) {
    backBankImportBtn.hidden = isSelect || isReading;
  }

  if (continueBankConsentBtn) {
    continueBankConsentBtn.hidden = !isSelect;
    continueBankConsentBtn.disabled = !selectedBankId;
  }

  if (simulateBankReadBtn) {
    simulateBankReadBtn.hidden = !isConsent;
    simulateBankReadBtn.disabled = isReading;
  }

  if (confirmBankImportBtn) {
    confirmBankImportBtn.hidden = !isReview;
  }
}

function renderBankPicker() {
  if (!bankPickerGrid) {
    return;
  }

  bankPickerGrid.innerHTML = BANK_IMPORT_PROVIDERS.map((bank) => {
    const permissionText = bank.permissions
      .map((permission) => BANK_PERMISSION_LABELS[permission])
      .filter(Boolean)
      .join(', ');

    return `
      <button type="button" class="bank-picker-option" data-bank-id="${escapeHtml(bank.id)}" aria-pressed="${bank.id === selectedBankId ? 'true' : 'false'}">
        <span class="bank-picker-mark">${escapeHtml(bank.shortName)}</span>
        <span class="bank-picker-copy">
          <strong>${escapeHtml(bank.name)}</strong>
          <small>${escapeHtml(permissionText)}</small>
        </span>
      </button>
    `;
  }).join('');

  bankPickerGrid.querySelectorAll('[data-bank-id]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedBankId = button.dataset.bankId;
      renderBankPicker();
      renderBankConsentDetails();
      setBankImportStatus('', '');
      if (continueBankConsentBtn) {
        continueBankConsentBtn.disabled = false;
      }
    });
  });
}

function getSelectedBankProvider() {
  return BANK_IMPORT_PROVIDERS.find((bank) => bank.id === selectedBankId) ?? null;
}

function renderBankConsentDetails() {
  const bank = getSelectedBankProvider();

  if (!bank) {
    if (bankConsentTitle) bankConsentTitle.textContent = 'Banco escolhido';
    if (bankConsentDescription) {
      bankConsentDescription.textContent = 'Escolha uma instituição para ver as permissões solicitadas.';
    }
    if (bankPermissionsGrid) bankPermissionsGrid.innerHTML = '';
    return;
  }

  if (bankConsentTitle) {
    bankConsentTitle.textContent = `Banco escolhido: ${bank.name}`;
  }

  if (bankConsentDescription) {
    bankConsentDescription.textContent = `${bank.description} Na versão real, o login acontecerá no ambiente oficial do banco ou do provedor autorizado.`;
  }

  if (bankPermissionsGrid) {
    bankPermissionsGrid.innerHTML = bank.permissions.map((permission) => `
      <label class="bank-permission-item">
        <input type="checkbox" checked disabled>
        <span>${escapeHtml(BANK_PERMISSION_LABELS[permission] ?? permission)}</span>
      </label>
    `).join('');
  }
}

function continueBankImportConsent() {
  if (!selectedBankId) {
    setBankImportStatus('Escolha um banco para continuar.', 'error');
    return;
  }

  renderBankConsentDetails();
  setBankImportStage('consent');
  setBankImportStatus('Revise as permissões. Nesta versão, a leitura ainda é uma simulação preparada para a integração real.', 'success');

  window.setTimeout(() => {
    simulateBankReadBtn?.focus();
  }, 20);
}

function goBackBankImportStage() {
  if (currentBankImportStage === 'consent') {
    setBankImportStage('select');
    setBankImportStatus('', '');
    return;
  }

  if (currentBankImportStage === 'review') {
    setBankImportStage('consent');
    setBankImportStatus('', '');
  }
}

function simulateBankImportRead() {
  const bank = getSelectedBankProvider();

  if (!bank) {
    setBankImportStatus('Escolha um banco antes de iniciar a leitura.', 'error');
    setBankImportStage('select');
    return;
  }

  setBankImportStatus('', '');
  setBankImportStage('reading');

  window.setTimeout(() => {
    bankDetectedItems = bank.items.map((item) => ({
      ...item,
      bankId: bank.id,
      selected: item.status === 'confirmed' && !isBankImportDuplicate({ ...item, bankId: bank.id })
    }));
    renderBankDetectedItems();
    setBankImportStage('review');
    setBankImportStatus(`Leitura simulada do ${bank.name} concluída. Revise antes de adicionar ao controle.`, 'success');
  }, 950);
}

function renderBankDetectedItems() {
  if (!bankDetectedList) {
    return;
  }

  if (bankDetectedItems.length === 0) {
    bankDetectedList.innerHTML = '<div class="empty-state">Nenhuma fatura encontrada nesta simulação.</div>';
    updateBankReviewSummary();
    return;
  }

  bankDetectedList.innerHTML = bankDetectedItems.map((item) => {
    const isConfirmed = item.status === 'confirmed';
    const isDuplicate = isBankImportDuplicate(item);
    const dueDate = formatDate(parseDateInput(item.dueDate));
    const confidenceLabel = isDuplicate ? 'Duplicado' : isConfirmed ? 'Confirmado' : 'Revisar';
    const checkedAttr = item.selected ? 'checked' : '';
    const disabledAttr = isDuplicate ? 'disabled' : '';

    return `
      <article class="bank-detected-item ${isDuplicate ? 'is-duplicate' : isConfirmed ? 'is-confirmed' : 'needs-review'}">
        <label class="bank-detected-check">
          <input type="checkbox" data-bank-detected-id="${escapeHtml(item.id)}" ${checkedAttr} ${disabledAttr}>
          <span></span>
        </label>
        <div class="bank-detected-content">
          <div class="bank-detected-top">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.bank)} • ${escapeHtml(item.kind)}</span>
            </div>
            <em class="${isDuplicate ? 'is-muted' : isConfirmed ? 'is-safe' : 'is-warning'}">${confidenceLabel}${isDuplicate ? '' : ` ${item.confidence}%`}</em>
          </div>
          <div class="bank-detected-meta">
            <span>Vence ${dueDate}</span>
            <strong>${formatCurrency(item.amount)}</strong>
          </div>
          <p>${escapeHtml(isDuplicate ? 'Este compromisso já foi adicionado anteriormente e ficará bloqueado para evitar duplicidade.' : item.evidence)}</p>
        </div>
      </article>
    `;
  }).join('');

  bankDetectedList.querySelectorAll('[data-bank-detected-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const item = bankDetectedItems.find((entry) => entry.id === checkbox.dataset.bankDetectedId);
      if (item) {
        item.selected = checkbox.checked;
        updateBankReviewSummary();
      }
    });
  });

  updateBankReviewSummary();
}

function updateBankReviewSummary() {
  const selectedItems = bankDetectedItems.filter((item) => item.selected);
  const confirmedCount = bankDetectedItems.filter((item) => item.status === 'confirmed' && !isBankImportDuplicate(item)).length;
  const reviewCount = bankDetectedItems.filter((item) => item.status !== 'confirmed').length;
  const selectedTotal = selectedItems.reduce((total, item) => total + item.amount, 0);

  if (bankConfirmedCount) bankConfirmedCount.textContent = String(confirmedCount);
  if (bankReviewCount) bankReviewCount.textContent = String(reviewCount);
  if (bankDetectedTotal) bankDetectedTotal.textContent = formatCurrency(selectedTotal);
  if (confirmBankImportBtn) confirmBankImportBtn.disabled = selectedItems.length === 0;
}

function confirmBankDetectedItems() {
  const selectedItems = bankDetectedItems.filter((item) => item.selected && !isBankImportDuplicate(item));

  if (selectedItems.length === 0) {
    setBankImportStatus('Selecione pelo menos uma fatura nova para adicionar.', 'error');
    return;
  }

  const nextPlans = selectedItems.map((item) => ({
    id: createPlanId(),
    name: item.name,
    startDate: item.dueDate,
    totalMonths: 1,
    countMode: DEFAULT_COUNT_MODE,
    planType: PLAN_TYPE_ACCOUNT,
    isExpense: false,
    totalValue: roundMoney(item.amount),
    installmentValue: roundMoney(item.amount),
    manualMonthValues: {},
    partialMonthCredits: {},
    paidMonths: [],
    importSource: {
      type: 'open-finance-demo',
      externalId: getBankImportExternalId(item),
      bank: item.bank,
      bankId: item.bankId,
      kind: item.kind,
      confidence: item.confidence,
      evidence: item.evidence,
      importedAt: new Date().toISOString()
    }
  }));

  plans.unshift(...nextPlans);
  selectedPlanId = nextPlans[0].id;
  savePlans();
  renderPlansList();
  renderPlanDetails(nextPlans[0], { resetTimelineScroll: true });
  closeBankImportModal();
  setStatus(`${nextPlans.length} ${nextPlans.length === 1 ? 'compromisso foi adicionado' : 'compromissos foram adicionados'} a partir da conexão bancária de teste.`, 'success');
  scrollToSection(plansPanel);
}

function getBankImportExternalId(item) {
  return `${item.bankId || selectedBankId || 'bank'}:${item.id}:${item.dueDate}`;
}

function isBankImportDuplicate(item) {
  const externalId = getBankImportExternalId(item);

  return plans.some((plan) => plan.importSource?.externalId === externalId);
}

function setBankImportStatus(message, type) {
  if (!bankImportStatus) {
    return;
  }

  if (!message) {
    bankImportStatus.hidden = true;
    bankImportStatus.className = 'status-message bank-import-status';
    return;
  }

  bankImportStatus.hidden = false;
  bankImportStatus.textContent = message;
  bankImportStatus.className = 'status-message bank-import-status';

  if (type) {
    bankImportStatus.classList.add(type);
  }
}

function openCreateModal() {
  createForm.reset();
  const defaultRadio = document.querySelector('input[name="createPlanType"][value="debt"]');
  const defaultPastMonthsRadio = document.querySelector('input[name="createPastMonthsStatus"][value="open"]');
  if (defaultPastMonthsRadio) {
    defaultPastMonthsRadio.checked = true;
  }
  if (defaultRadio) {
    defaultRadio.checked = true;
    defaultRadio.dispatchEvent(new Event('change'));
  }
  updateCreatePastMonthsControl();
  setCreateStatus('', '');
  createModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => {
    createPlanNameInput.focus();
  }, 20);
}

function closeCreateModal() {
  createForm.reset();
  updateCreatePastMonthsControl();
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
  const planType = getPlanType(plan);
  const isExpense = planType === PLAN_TYPE_EXPENSE;
  const isAccount = planType === PLAN_TYPE_ACCOUNT;
  editingPlanId = plan.id;
  editPlanNameInput.value = plan.name;
  editStartDateInput.value = plan.startDate;
  editTotalMonthsInput.value = String(isAccount ? 1 : plan.totalMonths);
  const defaultEditPastMonthsRadio = document.querySelector('input[name="editPastMonthsStatus"][value="keep"]');
  if (defaultEditPastMonthsRadio) {
    defaultEditPastMonthsRadio.checked = true;
  }
  editTotalValueInput.value = plan.totalValue > 0 ? formatCurrencyRaw(plan.totalValue) : '';
  editInstallmentValueInput.value = plan.installmentValue > 0 ? formatCurrencyRaw(plan.installmentValue) : '';
  editModalSubtitle.textContent = `Atualize os dados do compromisso "${plan.name}" e salve as alterações.`;
  setEditStatus('', '');

  // Ajuste visual para Despesas vs Dívidas na edição
  const editTotalValueField = editTotalValueInput?.parentElement;
  
  if (editDebtSpecificFields) {
    editDebtSpecificFields.style.display = (isExpense || isAccount) ? 'none' : '';
  }

  if (editTotalMonthsInput) {
    if (isExpense || isAccount) {
      editTotalMonthsInput.removeAttribute('required');
    } else {
      editTotalMonthsInput.setAttribute('required', 'required');
    }
  }

  if (editPlanNameInput) {
    editPlanNameInput.placeholder = isAccount
      ? 'Ex.: Fatura do cartão, boleto da compra'
      : isExpense
        ? 'Ex.: Conta de energia, Internet'
        : 'Ex.: Parcelas da moto';
  }

  if (editStartDateLabel) {
    editStartDateLabel.textContent = (isExpense || isAccount) ? 'Data de pagamento' : 'Data de início';
  }

  if (isExpense) {
    if (editTotalValueField) editTotalValueField.style.display = 'none';
    if (editInstallmentValueLabel) editInstallmentValueLabel.textContent = 'Valor Mensal (Opcional)';
  } else if (isAccount) {
    if (editTotalValueField) editTotalValueField.style.display = 'none';
    if (editInstallmentValueLabel) editInstallmentValueLabel.textContent = 'Valor da conta';
    if (editInstallmentValueInput) editInstallmentValueInput.setAttribute('required', 'required');
  } else {
    if (editTotalValueField) editTotalValueField.style.display = 'flex';
    if (editInstallmentValueLabel) editInstallmentValueLabel.textContent = 'Valor da Parcela (Opcional)';
    if (editInstallmentValueInput) editInstallmentValueInput.removeAttribute('required');
  }

  if (!isAccount && editInstallmentValueInput) {
    editInstallmentValueInput.removeAttribute('required');
  }

  if (editTotalValueLabel) {
    editTotalValueLabel.textContent = 'Valor Total';
  }

  updateEditPastMonthsControl();
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
  updateEditPastMonthsControl();
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
  flushReorderAutosave({ silentWhenUnchanged: true, silent: true });
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

  const config = { ...defaultUpdateConfig, ...(window.APP_UPDATE_CONFIG || {}) };
  if (settingsAppVersion) settingsAppVersion.textContent = `v${getCurrentAppVersion(config)}`;
  if (settingsAppRelease) settingsAppRelease.textContent = config.expirationDate || '28/04/2026';
  await refreshSupportUi();
   
  if (shareOptionsPanel) shareOptionsPanel.hidden = true;
  setShareCopyStatus('');

  appSettingsModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => {
    closeAppSettingsModalBtn?.focus();
  }, 20);
}

function closeAppSettingsModal() {
  if (!appSettingsModal) {
    return;
  }

  appSettingsModal.hidden = true;
  if (shareOptionsPanel) shareOptionsPanel.hidden = true;
  setShareCopyStatus('');
  syncModalBodyState();
}

async function openSupportModal() {
  if (!supportModal) {
    return;
  }

  hideSupportMessagePopup();
  await refreshSupportUi();
  supportModal.hidden = false;
  syncModalBodyState();
  window.setTimeout(() => {
    supportChatInput?.focus();
  }, 20);
  await loadSupportChatMessages({ silent: true });
  await Storage.set(SUPPORT_CHAT_LAST_OPEN_KEY, new Date().toISOString());
}

function closeSupportModal() {
  if (!supportModal) {
    return;
  }

  supportModal.hidden = true;
  setSupportChatStatus('');
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
        <span class="reorder-item-meta">${getPlanTypeLabel(plan)} • ${isAccountPlan(plan) ? 'Pagamento' : 'Início'} ${formatDate(parseDateInput(plan.startDate))}</span>
      </div>
    `;
    reorderList.appendChild(reorderItem);
  });
}

function syncModalBodyState() {
  document.body.classList.toggle(
    'modal-open',
    !createModal.hidden ||
      Boolean(statementImportModal && !statementImportModal.hidden) ||
      Boolean(bankImportModal && !bankImportModal.hidden) ||
      !editModal.hidden ||
      !deleteModal.hidden ||
      !reorderModal.hidden ||
      Boolean(onboardingModal && !onboardingModal.hidden) ||
      Boolean(tourOverlay && tourOverlay.classList.contains('is-active')) ||
      Boolean(appSettingsModal && !appSettingsModal.hidden) ||
      Boolean(supportModal && !supportModal.hidden) ||
      Boolean(monthlyBalanceModal && !monthlyBalanceModal.hidden) ||
      Boolean(monthlyOverviewModal && !monthlyOverviewModal.hidden) ||
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

function getSelectedCreatePlanType() {
  const selectedType = document.querySelector('input[name="createPlanType"]:checked')?.value;

  if ([PLAN_TYPE_DEBT, PLAN_TYPE_EXPENSE, PLAN_TYPE_ACCOUNT].includes(selectedType)) {
    return selectedType;
  }

  return PLAN_TYPE_DEBT;
}

function getPlanType(plan) {
  if (plan?.planType === PLAN_TYPE_ACCOUNT) {
    return PLAN_TYPE_ACCOUNT;
  }

  if (plan?.planType === PLAN_TYPE_EXPENSE || plan?.isExpense) {
    return PLAN_TYPE_EXPENSE;
  }

  return PLAN_TYPE_DEBT;
}

function isExpensePlan(plan) {
  return getPlanType(plan) === PLAN_TYPE_EXPENSE;
}

function isAccountPlan(plan) {
  return getPlanType(plan) === PLAN_TYPE_ACCOUNT;
}

function getPlanTypeLabel(plan) {
  const planType = getPlanType(plan);

  if (planType === PLAN_TYPE_ACCOUNT) {
    return 'Conta';
  }

  if (planType === PLAN_TYPE_EXPENSE) {
    return 'Despesa';
  }

  return 'Dívida';
}

function getFilteredPlans() {
  if (currentPlanFilter === 'debt') {
    return plans.filter((plan) => getPlanType(plan) === PLAN_TYPE_DEBT);
  }

  if (currentPlanFilter === 'expense') {
    return plans.filter((plan) => getPlanType(plan) === PLAN_TYPE_EXPENSE);
  }

  if (currentPlanFilter === 'account') {
    return plans.filter((plan) => getPlanType(plan) === PLAN_TYPE_ACCOUNT);
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

async function loadMonthlyBalancesAsync() {
  try {
    await Storage.migrate(MONTHLY_BALANCES_KEY);
    const raw = await Storage.get(MONTHLY_BALANCES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return sanitizeMonthlyBalances(parsed);
  } catch {
    return sanitizeMonthlyBalances(monthlyBalances);
  }
}

function loadMonthlyBalances() {
  try {
    const raw = localStorage.getItem(MONTHLY_BALANCES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return sanitizeMonthlyBalances(parsed);
  } catch {
    return {};
  }
}

function saveMonthlyBalances() {
  Storage.set(MONTHLY_BALANCES_KEY, JSON.stringify(monthlyBalances));
}

function sanitizeMonthlyBalances(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((balances, [monthKey, amount]) => {
    if (!/^\d{4}-\d{2}$/.test(monthKey)) {
      return balances;
    }

    const normalizedAmount = roundMoney(normalizeMoneyValue(amount));
    if (normalizedAmount > MONEY_EPSILON) {
      balances[monthKey] = normalizedAmount;
    }

    return balances;
  }, {});
}

function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getCurrentMonthBalance() {
  return roundMoney(normalizeMoneyValue(monthlyBalances[getCurrentMonthKey()]));
}

function setCurrentMonthBalance(amount) {
  const monthKey = getCurrentMonthKey();
  const normalizedAmount = roundMoney(normalizeMoneyValue(amount));

  if (normalizedAmount > MONEY_EPSILON) {
    monthlyBalances[monthKey] = normalizedAmount;
    return;
  }

  delete monthlyBalances[monthKey];
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

function getPlanEndDate(plan, effectiveStartDate) {
  if (isAccountPlan(plan)) {
    return effectiveStartDate;
  }

  return addMonths(effectiveStartDate, getPlanMonthLimit(plan));
}

function getPlanDueDate(plan, effectiveStartDate, monthIndex) {
  if (isAccountPlan(plan)) {
    return effectiveStartDate;
  }

  return addMonths(effectiveStartDate, monthIndex);
}

function getPlanPaymentDate(plan, effectiveStartDate, monthIndex) {
  if (isAccountPlan(plan)) {
    return effectiveStartDate;
  }

  return getPlanPeriodStart(plan, effectiveStartDate, monthIndex);
}

function getPlanPeriodStart(plan, effectiveStartDate, monthIndex) {
  if (isAccountPlan(plan)) {
    return effectiveStartDate;
  }

  return addMonths(effectiveStartDate, monthIndex - 1);
}

function getPlanListDurationLabel(plan) {
  if (isAccountPlan(plan)) {
    return 'Conta';
  }

  if (isExpensePlan(plan)) {
    return 'Despesa';
  }

  return `${plan.totalMonths} ${plan.totalMonths === 1 ? 'mês' : 'meses'}`;
}

function getPlanPaidSummaryLabel(plan, paidMonthsCount) {
  if (isExpensePlan(plan)) {
    return String(paidMonthsCount);
  }

  if (isAccountPlan(plan)) {
    return paidMonthsCount > 0 ? 'Pago' : 'Aberta';
  }

  return `${paidMonthsCount}/${plan.totalMonths}`;
}

function getPlanEndSummaryLabel(plan, endDate) {
  if (isExpensePlan(plan)) {
    return 'Livre';
  }

  if (isAccountPlan(plan)) {
    return formatDateShort(endDate);
  }

  return formatMonthYearCompact(endDate);
}

function roundMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function normalizeMoneyValue(value) {
  const number = typeof value === 'string' ? parseCurrencyToNumber(value) : Number(value);
  return Number.isFinite(number) && number > MONEY_EPSILON ? number : 0;
}

function getPaidMonths(plan) {
  if (!Array.isArray(plan?.paidMonths)) {
    return [];
  }

  return [...new Set(plan.paidMonths
    .map((month) => Number.parseInt(month, 10))
    .filter((month) => Number.isInteger(month) && month >= 1)
  )].sort((a, b) => a - b);
}

function getPlanMonthLimit(plan) {
  const totalMonths = Number.parseInt(plan?.totalMonths, 10);

  if (Number.isInteger(totalMonths) && totalMonths > 0) {
    return totalMonths;
  }

  return isExpensePlan(plan) ? CONTINUOUS_EXPENSE_MONTHS : 0;
}

function getMonthBaseValue(plan, monthIndex) {
  const manualValue = plan?.manualMonthValues?.[monthIndex];

  if (manualValue !== undefined && manualValue !== null && manualValue !== '') {
    return roundMoney(normalizeMoneyValue(manualValue));
  }

  const isExpense = isExpensePlan(plan);
  const totalValue = normalizeMoneyValue(plan?.totalValue);
  const totalMonths = getPlanMonthLimit(plan);

  if (!isExpense && totalValue > 0 && totalMonths > 0) {
    let manualSum = 0;
    let manualCount = 0;
    const manualValues = plan.manualMonthValues || {};
    
    for (const mIdx in manualValues) {
      const idx = Number.parseInt(mIdx, 10);
      if (idx >= 1 && idx <= totalMonths) {
        manualSum += roundMoney(normalizeMoneyValue(manualValues[mIdx]));
        manualCount++;
      }
    }
    
    const nonManualCount = totalMonths - manualCount;
    if (nonManualCount > 0) {
      const remainder = Math.max(0, totalValue - manualSum);
      return roundMoney(remainder / nonManualCount);
    }
  }

  const installmentValue = normalizeMoneyValue(plan?.installmentValue);
  if (installmentValue > 0) {
    return roundMoney(installmentValue);
  }

  if (!isExpense && totalValue > 0 && totalMonths > 0) {
    return roundMoney(totalValue / totalMonths);
  }

  return 0;
}

function getPartialMonthCredits(plan) {
  if (
    !plan?.partialMonthCredits ||
    typeof plan.partialMonthCredits !== 'object' ||
    Array.isArray(plan.partialMonthCredits)
  ) {
    return {};
  }

  return plan.partialMonthCredits;
}

function getPartialMonthCredit(plan, monthIndex) {
  const baseValue = getMonthBaseValue(plan, monthIndex);

  if (baseValue <= MONEY_EPSILON) {
    return 0;
  }

  const credit = normalizeMoneyValue(getPartialMonthCredits(plan)[monthIndex]);
  return roundMoney(Math.min(credit, baseValue));
}

function setPartialMonthCredit(plan, monthIndex, value) {
  if (!plan) {
    return;
  }

  if (
    !plan.partialMonthCredits ||
    typeof plan.partialMonthCredits !== 'object' ||
    Array.isArray(plan.partialMonthCredits)
  ) {
    plan.partialMonthCredits = {};
  }

  const baseValue = getMonthBaseValue(plan, monthIndex);
  const credit = baseValue > MONEY_EPSILON
    ? roundMoney(Math.min(normalizeMoneyValue(value), baseValue))
    : 0;

  if (credit <= MONEY_EPSILON) {
    delete plan.partialMonthCredits[monthIndex];
  } else {
    plan.partialMonthCredits[monthIndex] = credit;
  }
}

function removePartialMonthCredit(plan, monthIndex) {
  if (!plan?.partialMonthCredits || typeof plan.partialMonthCredits !== 'object') {
    return;
  }

  delete plan.partialMonthCredits[monthIndex];
}

function cleanupPartialMonthCredits(plan) {
  if (!plan?.partialMonthCredits || typeof plan.partialMonthCredits !== 'object') {
    return;
  }

  const paidMonths = new Set(getPaidMonths(plan));
  const maxMonths = getPlanMonthLimit(plan);

  Object.keys(plan.partialMonthCredits).forEach((monthKey) => {
    const monthIndex = Number.parseInt(monthKey, 10);
    const baseValue = getMonthBaseValue(plan, monthIndex);

    if (
      !Number.isInteger(monthIndex) ||
      monthIndex < 1 ||
      monthIndex > maxMonths ||
      paidMonths.has(monthIndex) ||
      baseValue <= MONEY_EPSILON
    ) {
      delete plan.partialMonthCredits[monthKey];
      return;
    }

    const credit = roundMoney(Math.min(normalizeMoneyValue(plan.partialMonthCredits[monthKey]), baseValue));

    if (credit <= MONEY_EPSILON) {
      delete plan.partialMonthCredits[monthKey];
    } else {
      plan.partialMonthCredits[monthKey] = credit;
    }
  });
}

function getMonthRemainingValue(plan, monthIndex) {
  const baseValue = getMonthBaseValue(plan, monthIndex);

  if (baseValue <= MONEY_EPSILON) {
    return 0;
  }

  return roundMoney(Math.max(0, baseValue - getPartialMonthCredit(plan, monthIndex)));
}

function getNextUnpaidMonthIndex(plan) {
  const paidMonths = new Set(getPaidMonths(plan));
  const maxMonths = getPlanMonthLimit(plan);

  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    if (!paidMonths.has(monthIndex)) {
      return monthIndex;
    }
  }

  return null;
}

function createPaymentStateSnapshot(plan) {
  cleanupPartialMonthCredits(plan);

  const partialMonthCredits = {};
  const credits = getPartialMonthCredits(plan);

  Object.keys(credits).forEach((monthKey) => {
    const monthIndex = Number.parseInt(monthKey, 10);
    const credit = roundMoney(normalizeMoneyValue(credits[monthKey]));

    if (Number.isInteger(monthIndex) && monthIndex > 0 && credit > MONEY_EPSILON) {
      partialMonthCredits[String(monthIndex)] = credit;
    }
  });

  return {
    paidMonths: getPaidMonths(plan),
    partialMonthCredits
  };
}

function clonePaymentStateSnapshot(snapshot = {}) {
  return {
    paidMonths: Array.isArray(snapshot.paidMonths)
      ? snapshot.paidMonths.map((month) => Number.parseInt(month, 10)).filter(Number.isInteger)
      : [],
    partialMonthCredits: snapshot.partialMonthCredits && typeof snapshot.partialMonthCredits === 'object'
      ? Object.keys(snapshot.partialMonthCredits).reduce((accumulator, monthKey) => {
          const monthIndex = Number.parseInt(monthKey, 10);
          const credit = roundMoney(normalizeMoneyValue(snapshot.partialMonthCredits[monthKey]));

          if (Number.isInteger(monthIndex) && monthIndex > 0 && credit > MONEY_EPSILON) {
            accumulator[String(monthIndex)] = credit;
          }

          return accumulator;
        }, {})
      : {}
  };
}

function applyPaymentStateSnapshot(plan, snapshot = {}) {
  const maxMonths = getPlanMonthLimit(plan);
  const nextSnapshot = clonePaymentStateSnapshot(snapshot);

  plan.paidMonths = sanitizePaidMonths(nextSnapshot.paidMonths, maxMonths);
  plan.partialMonthCredits = { ...nextSnapshot.partialMonthCredits };
  cleanupPartialMonthCredits(plan);
}

function normalizePaymentSnapshot(snapshot = {}) {
  const cloned = clonePaymentStateSnapshot(snapshot);
  const partialMonthCredits = {};

  Object.keys(cloned.partialMonthCredits)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((monthKey) => {
      partialMonthCredits[monthKey] = cloned.partialMonthCredits[monthKey];
    });

  return {
    paidMonths: [...new Set(cloned.paidMonths)].sort((a, b) => a - b),
    partialMonthCredits
  };
}

function arePaymentSnapshotsEqual(firstSnapshot, secondSnapshot) {
  return JSON.stringify(normalizePaymentSnapshot(firstSnapshot)) ===
    JSON.stringify(normalizePaymentSnapshot(secondSnapshot));
}

function isValidBulkPaymentAction(action) {
  return Boolean(
    action &&
      normalizeMoneyValue(action.amount) > MONEY_EPSILON &&
      action.before &&
      action.after
  );
}

function getBulkPaymentHistory(plan) {
  if (!Array.isArray(plan?.bulkPaymentHistory)) {
    return [];
  }

  return plan.bulkPaymentHistory
    .filter(isValidBulkPaymentAction)
    .map((action) => ({
      ...action,
      amount: roundMoney(normalizeMoneyValue(action.amount)),
      before: clonePaymentStateSnapshot(action.before),
      after: clonePaymentStateSnapshot(action.after)
    }));
}

function setBulkPaymentHistory(plan, history) {
  const normalizedHistory = Array.isArray(history)
    ? history.filter(isValidBulkPaymentAction).slice(-BULK_PAYMENT_HISTORY_LIMIT)
    : [];

  if (normalizedHistory.length > 0) {
    plan.bulkPaymentHistory = normalizedHistory;
  } else {
    delete plan.bulkPaymentHistory;
  }
}

function getLastBulkPaymentAction(plan) {
  const history = getBulkPaymentHistory(plan);
  return history[history.length - 1] ?? null;
}

function recordBulkPaymentAction(plan, amount, beforeSnapshot, result = {}) {
  const history = getBulkPaymentHistory(plan);
  const entry = {
    id: `bulk-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    amount: roundMoney(normalizeMoneyValue(amount)),
    createdAt: new Date().toISOString(),
    paidCount: Number.parseInt(result.paidCount, 10) || 0,
    partialAmount: roundMoney(normalizeMoneyValue(result.partialAmount)),
    before: clonePaymentStateSnapshot(beforeSnapshot),
    after: createPaymentStateSnapshot(plan)
  };

  history.push(entry);
  setBulkPaymentHistory(plan, history);
  return entry;
}

function changeLastBulkPaymentAction(plan, amount) {
  const history = getBulkPaymentHistory(plan);
  const lastAction = history[history.length - 1];
  const nextAmount = roundMoney(normalizeMoneyValue(amount));

  if (!lastAction) {
    return {
      applied: false,
      type: 'error',
      message: 'Nenhum lance anterior encontrado para alterar.'
    };
  }

  if (nextAmount <= MONEY_EPSILON) {
    return {
      applied: false,
      type: 'error',
      message: 'Informe um valor válido para alterar o último lance.'
    };
  }

  const currentSnapshot = createPaymentStateSnapshot(plan);

  if (!arePaymentSnapshotsEqual(currentSnapshot, lastAction.after)) {
    return {
      applied: false,
      type: 'error',
      message: 'Esse compromisso mudou depois do último lance. Para evitar conflito, ajuste as parcelas manualmente ou lance um novo pagamento.'
    };
  }

  applyPaymentStateSnapshot(plan, lastAction.before);
  const result = applyBulkPaymentToPlan(plan, nextAmount);

  if (!result.applied) {
    applyPaymentStateSnapshot(plan, currentSnapshot);
    return result;
  }

  history[history.length - 1] = {
    ...lastAction,
    amount: nextAmount,
    updatedAt: new Date().toISOString(),
    paidCount: Number.parseInt(result.paidCount, 10) || 0,
    partialAmount: roundMoney(normalizeMoneyValue(result.partialAmount)),
    after: createPaymentStateSnapshot(plan)
  };
  setBulkPaymentHistory(plan, history);

  return {
    ...result,
    message: `Último lance alterado para ${formatCurrency(nextAmount)}.`
  };
}

function deleteLastBulkPaymentAction(plan) {
  const history = getBulkPaymentHistory(plan);
  const lastAction = history[history.length - 1];

  if (!lastAction) {
    return {
      applied: false,
      type: 'error',
      message: 'Nenhum lance anterior encontrado para apagar.'
    };
  }

  const currentSnapshot = createPaymentStateSnapshot(plan);

  if (!arePaymentSnapshotsEqual(currentSnapshot, lastAction.after)) {
    return {
      applied: false,
      type: 'error',
      message: 'Esse compromisso mudou depois do último lance. Para evitar conflito, ajuste as parcelas manualmente.'
    };
  }

  applyPaymentStateSnapshot(plan, lastAction.before);
  history.pop();
  setBulkPaymentHistory(plan, history);

  return {
    applied: true,
    type: 'success',
    amount: lastAction.amount,
    message: `Último lance de ${formatCurrency(lastAction.amount)} apagado.`
  };
}

function applyBulkPaymentToPlan(plan, amount) {
  const paymentAmount = roundMoney(normalizeMoneyValue(amount));

  if (!plan || paymentAmount <= MONEY_EPSILON) {
    return {
      applied: false,
      type: 'error',
      message: 'Informe um valor de pagamento válido.'
    };
  }

  cleanupPartialMonthCredits(plan);

  const paidMonths = new Set(getPaidMonths(plan));
  const maxMonths = getPlanMonthLimit(plan);
  let remainingAmount = paymentAmount;
  let paidCount = 0;
  let partialAmount = 0;
  let hasOpenMonth = false;
  let hasConfiguredValue = false;

  for (let monthIndex = 1; monthIndex <= maxMonths && remainingAmount > MONEY_EPSILON; monthIndex += 1) {
    if (paidMonths.has(monthIndex)) {
      continue;
    }

    hasOpenMonth = true;
    const baseValue = getMonthBaseValue(plan, monthIndex);

    if (baseValue > MONEY_EPSILON) {
      hasConfiguredValue = true;
    }

    const remainingInstallmentValue = getMonthRemainingValue(plan, monthIndex);

    if (remainingInstallmentValue <= MONEY_EPSILON) {
      continue;
    }

    if (remainingAmount + MONEY_EPSILON >= remainingInstallmentValue) {
      paidMonths.add(monthIndex);
      removePartialMonthCredit(plan, monthIndex);
      remainingAmount = roundMoney(remainingAmount - remainingInstallmentValue);
      paidCount += 1;
    } else {
      const currentCredit = getPartialMonthCredit(plan, monthIndex);
      partialAmount = roundMoney(remainingAmount);
      setPartialMonthCredit(plan, monthIndex, currentCredit + remainingAmount);
      remainingAmount = 0;
    }
  }

  if (paidCount === 0 && partialAmount <= MONEY_EPSILON) {
    const message = !hasOpenMonth
      ? 'Não há parcelas em aberto para receber esse pagamento.'
      : hasConfiguredValue
        ? 'Não há saldo pendente para alterar a próxima parcela.'
        : 'Configure o valor da parcela antes de antecipar pagamento.';

    return {
      applied: false,
      type: !hasOpenMonth ? 'success' : 'error',
      message
    };
  }

  plan.paidMonths = [...paidMonths].sort((a, b) => a - b);
  cleanupPartialMonthCredits(plan);

  const paidMessage = paidCount > 0
    ? `${paidCount} ${paidCount === 1 ? 'parcela quitada' : 'parcelas quitadas'}`
    : '';
  const partialMessage = partialAmount > MONEY_EPSILON
    ? `${formatCurrency(partialAmount)} abatidos da próxima parcela`
    : '';
  const appliedMessage = [paidMessage, partialMessage].filter(Boolean).join(' e ');
  const unusedMessage = remainingAmount > MONEY_EPSILON
    ? ` Sobrou ${formatCurrency(remainingAmount)} sem uso.`
    : '';

  return {
    applied: true,
    type: 'success',
    paidCount,
    partialAmount,
    unusedAmount: remainingAmount,
    message: `Antecipação registrada: ${appliedMessage}.${unusedMessage}`
  };
}

function sanitizePaidMonths(paidMonths, totalMonths) {
  if (!Array.isArray(paidMonths)) {
    return [];
  }

  return [...new Set(paidMonths
    .map((month) => Number.parseInt(month, 10))
    .filter((month) => Number.isInteger(month) && month >= 1 && month <= totalMonths)
  )];
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
    removePartialMonthCredit(selectedPlan, monthIndex);
  }

  selectedPlan.paidMonths = [...paidMonths].sort((a, b) => a - b);
  cleanupPartialMonthCredits(selectedPlan);
  savePlans();
  refreshPlanUiAfterPaymentChange(selectedPlan, { highlightMonthIndex: monthIndex });
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

  if (appReleaseDateLabel) {
    const expiration = config.expirationDate || '29/04/2026';
    appReleaseDateLabel.textContent = expiration;
  }
}

async function initializePaymentNotifications() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin) {
    return;
  }

  try {
    const permission = await getPaymentNotificationPermissionState();

    if (permission === 'granted') {
      localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'enabled');
      await createPaymentNotificationChannel();
      queuePaymentNotificationSync();
      registerPaymentNotificationListeners();
      return;
    }

    // Se ainda não foi solicitado ou recusado, tenta ativar uma vez no início
    if (localStorage.getItem(NOTIFICATION_PREFERENCE_KEY) !== 'denied') {
      await enablePaymentNotifications();
    }
  } catch (_) {
  }
}

function handleNotificationBannerPrimaryAction() {
  if (notificationBannerMode === 'reliability') {
    requestAndSyncPaymentReliabilityAccess();
    return;
  }

  if (notificationBannerMode === 'notification-settings') {
    openNotificationPermissionSettings();
    return;
  }

  enablePaymentNotifications();
}

async function enablePaymentNotifications() {
  const plugin = getLocalNotificationsPlugin();

  if (!plugin) {
    return;
  }

  try {
    const permission = await requestPaymentNotificationPermission();

    if (permission !== 'granted') {
      localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'denied');
      return;
    }

    localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, 'enabled');
    await createPaymentNotificationChannel();
    await syncPaymentNotifications();
    registerPaymentNotificationListeners();
    setStatus('Notificações de pagamento ativadas com sucesso.', 'success');
  } catch (_) {
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

function getUpdateInstallerPlugin() {
  return window.Capacitor?.Plugins?.UpdateInstaller ?? null;
}

function getNativeSharePlugin() {
  return window.Capacitor?.Plugins?.NativeShare ?? null;
}

function getNativePlatform() {
  return window.Capacitor?.getPlatform?.() ?? null;
}

function isNativeAndroidApp() {
  return getNativePlatform() === 'android';
}

function normalizePermissionState(state) {
  return typeof state === 'string' && state.trim()
    ? state.trim().toLowerCase()
    : 'denied';
}

async function getNativePermissionStatus() {
  const plugin = getNotificationPermissionsPlugin();

  if (!plugin?.getStatus) {
    return null;
  }

  try {
    return await plugin.getStatus();
  } catch (_) {
    return null;
  }
}

async function getPaymentNotificationPermissionState() {
  const plugin = getLocalNotificationsPlugin();

  if (plugin?.checkPermissions) {
    try {
      const permission = await plugin.checkPermissions();
      return normalizePermissionState(permission?.display);
    } catch (_) {}
  }

  const nativeStatus = await getNativePermissionStatus();

  if (nativeStatus?.notificationsEnabled) {
    return 'granted';
  }

  return normalizePermissionState(nativeStatus?.notificationPermissionState);
}

async function requestPaymentNotificationPermission() {
  const plugin = getLocalNotificationsPlugin();
  const nativePermissions = getNotificationPermissionsPlugin();
  let state = 'denied';

  if (plugin?.requestPermissions) {
    try {
      const permission = await plugin.requestPermissions();
      state = normalizePermissionState(permission?.display);
    } catch (_) {}
  }

  if (state === 'granted') {
    return state;
  }

  if (nativePermissions?.requestNotificationPermission) {
    try {
      const nativeStatus = await nativePermissions.requestNotificationPermission();

      if (nativeStatus?.notificationsEnabled || nativeStatus?.notificationPermissionState === 'granted') {
        return 'granted';
      }

      return normalizePermissionState(nativeStatus?.notificationPermissionState || state);
    } catch (_) {}
  }

  return state;
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










async function openNotificationPermissionSettings() {
  const plugin = getNotificationPermissionsPlugin();

  try {
    setStatus('O Android vai abrir as notificações do app. Ative a permissão para liberar os lembretes.', 'success');
    if (plugin?.openAppNotificationSettings) {
      await plugin.openAppNotificationSettings();
    } else {
      await plugin?.openAppSettings?.();
    }
  } catch (e) {}
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
    const isAccount = isAccountPlan(plan);

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
        title: `${isAccount ? 'Conta' : 'Pagamento'}: ${plan.name}`,
        body: isAccount
          ? `Chegou a data de pagar "${plan.name}". Marque como pago no app quando concluir.`
          : `Chegou o mês de pagar "${plan.name}". Marque como pago no app quando concluir.`,
        largeBody: isAccount
          ? `Chegou a data de pagar "${plan.name}". Abra o Controle de Dívidas para marcar como pago.`
          : `Chegou o mês de pagar "${plan.name}". Abra o Controle de Dívidas para marcar como pago e manter seus compromissos atualizados.`,
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
    if (event?.notification?.extra?.type === 'support_chat') {
      openSupportModal();
      return;
    }

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
    const nativeStatus = await getNativePermissionStatus();
    if (nativeStatus?.requiresAllFilesAccess && !nativeStatus?.allFilesAccessGranted) return;

    // Verifica se temos permissão
    const status = await fs.checkPermissions();
    if (status.publicStorage !== 'granted') return;

    // Tentamos listar a pasta de Downloads
    const result = await fs.readdir({
      path: 'Download',
      directory: 'EXTERNAL_STORAGE'
    }).catch(() => null);

    if (!result?.files) return;

    const apkFile = result.files.find((file) => file.name === APP_APK_FILE_NAME);
    
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
  const installer = getUpdateInstallerPlugin();
  if (!fs || !installer?.installApk) return;

  try {
    const nativeStatus = await getNativePermissionStatus();
    if (nativeStatus?.requiresAllFilesAccess && !nativeStatus?.allFilesAccessGranted) {
      await requestStorageAccess();
      setStatus('Libere o acesso aos arquivos e toque em instalar novamente.', 'success');
      return;
    }

    const uriResult = await fs.getUri({
      path: `Download/${APP_APK_FILE_NAME}`,
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

    const apkAsset = Array.isArray(release?.assets)
      ? release.assets.find((asset) => asset?.name === APP_APK_FILE_NAME)
        || release.assets.find((asset) => String(asset?.browser_download_url || '').endsWith(`/${APP_APK_FILE_URL_NAME}`))
        || release.assets.find((asset) => /\.apk$/i.test(String(asset?.name || asset?.browser_download_url || '')))
      : null;

    return {
      version: tagName,
      notes: String(release?.body || '').trim() || 'Uma nova interface foi encontrada. Toque no botao verde para aplicar a atualização sem reinstalar o app.',
      bundleUrl: 'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-bundle.json',
      bundleFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-bundle.json',
      apkUrl: apkAsset?.browser_download_url || `https://github.com/WSPREDADOR/controle-financeiro/releases/download/v${tagName}/${APP_APK_FILE_URL_NAME}`
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

  const installer = getUpdateInstallerPlugin();

  if (!installer?.downloadAndInstall) {
    openUpdateUrl(apkUrl);
    hideUpdateBanner();
    return;
  }

  setUpdateProgress('Iniciando download do APK...', 1);

  try {
    if (isNativeAndroidApp()) {
      const notificationState = await getPaymentNotificationPermissionState();
      if (notificationState !== 'granted') {
        await requestPaymentNotificationPermission();
      }
    }

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
      // Aceitar qualquer bundle igual ou mais novo que a versão atual do app.
      if (isRemoteVersionNewer(currentVersion, bundle.version)) {
        throw new Error(`Bundle (${bundle.version}) é mais antigo que a versão atual (${currentVersion}).`);
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

function getReorderDomOrderSignature() {
  return [...reorderList.querySelectorAll('.reorder-item')]
    .map((item) => item.dataset.planId)
    .filter(Boolean)
    .join('|');
}

function cancelReorderAutosave() {
  if (reorderAutosaveTimeoutId) {
    window.clearTimeout(reorderAutosaveTimeoutId);
  }

  reorderAutosaveTimeoutId = null;
}

function scheduleReorderAutosave() {
  cancelReorderAutosave();

  reorderAutosaveTimeoutId = window.setTimeout(() => {
    reorderAutosaveTimeoutId = null;
    saveReorderFromDom({ silentWhenUnchanged: true, silent: true });
  }, 120);
}

function flushReorderAutosave(options = {}) {
  cancelReorderAutosave();
  return saveReorderFromDom(options);
}

function saveReorderFromDom(options = {}) {
  persistReorderDraftFromDom();
  const orderedPlans = getOrderedPlansFromReorderDom();

  if (orderedPlans.length !== plans.length) {
    renderReorderList();
    setStatus('Não foi possível salvar a nova ordem dos compromissos.', 'error');
    return false;
  }

  const nextOrderSignature = getPlanOrderSignature(orderedPlans);

  if (nextOrderSignature === reorderSavedOrderSignature) {
    if (!options.silentWhenUnchanged) {
      setStatus('A ordem dos compromissos já está atualizada.', 'success');
    }
    return false;
  }

  plans = orderedPlans;
  reorderSavedOrderSignature = nextOrderSignature;
  savePlans();
  renderPlansList();

  const selectedPlan = getSelectedPlan();

  if (selectedPlan) {
    renderPlanDetails(selectedPlan, { resetTimelineScroll: true });
  }

  if (!options.silent) {
    setStatus('Ordem dos compromissos salva automaticamente.', 'success');
  }

  return true;
}

function clearReorderDragState() {
  stopReorderAutoScroll();
  cancelReorderAutosave();
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
  // Mascara os campos de moeda antes dos cálculos automáticos lerem o valor.
  document.querySelectorAll('.currency-input').forEach((input) => {
    input.addEventListener('input', handleCurrencyInput, { capture: true });
    input.addEventListener('blur', handleCurrencyInput);
  });

  // Cálculo automático: Total -> Parcela
  [createTotalValueInput, editTotalValueInput].forEach(input => {
    input?.addEventListener('input', (e) => {
      const isEdit = e.target === editTotalValueInput;
      const totalVal = parseCurrencyToNumber(e.target.value);
      const monthsInput = isEdit ? editTotalMonthsInput : createTotalMonthsInput;
      const installmentInput = isEdit ? editInstallmentValueInput : createInstallmentValueInput;
      const months = parseInt(monthsInput.value) || 0;

      if (totalVal > 0 && months > 0) {
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
      const months = parseInt(monthsInput.value) || 0;

      if (instVal > 0 && months > 0) {
        totalInput.value = formatCurrencyRaw(instVal * months);
      }
    });
  });

  [createTotalMonthsInput, createInstallmentValueInput].forEach((input) => {
    input?.addEventListener('input', updateCreateTotalFromInstallment);
    input?.addEventListener('change', updateCreateTotalFromInstallment);
    input?.addEventListener('blur', updateCreateTotalFromInstallment);
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

      if (months > 0) {
        // Se ambos estão preenchidos, priorizamos manter a parcela e ajustar o total (comum em financiamentos)
        // Mas se apenas o total estiver preenchido, ajustamos a parcela.
        if (instVal > 0) {
          totalInput.value = formatCurrencyRaw(instVal * months);
        } else if (totalVal > 0) {
          installmentInput.value = formatCurrencyRaw(totalVal / months);
        }
      }
    });
  });

  // --- Lógica de Pagamento Antecipado (Lance) ---
  openBulkPaymentBtn?.addEventListener('click', () => {
    const plan = getSelectedPlan();
    if (!plan) return;
    openBulkPaymentModal(plan);
  });

  cancelBulkPaymentBtn?.addEventListener('click', () => {
    closeBulkPaymentModal();
  });

  adjustLastBulkPaymentBtn?.addEventListener('click', () => {
    const plan = getSelectedPlan();
    if (!plan) return;

    if (bulkPaymentModalMode === 'edit-last') {
      setBulkPaymentCreateMode(plan);
      return;
    }

    setBulkPaymentEditMode(plan);
  });

  deleteLastBulkPaymentBtn?.addEventListener('click', () => {
    const plan = getSelectedPlan();
    if (!plan) return;

    const result = deleteLastBulkPaymentAction(plan);

    if (result.applied) {
      const focusMonthIndex = getNextUnpaidMonthIndex(plan) || getPlanMonthLimit(plan);
      savePlans();
      refreshPlanUiAfterPaymentChange(plan, { focusMonthIndex, highlightMonthIndex: focusMonthIndex });
      setStatus(result.message, 'success');
      closeBulkPaymentModal();
      return;
    }

    setBulkPaymentStatus(result.message, result.type);
  });

  confirmBulkPaymentBtn?.addEventListener('click', () => {
    const amount = parseCurrencyToNumber(bulkPaymentValueInput.value);
    if (isNaN(amount) || amount <= 0) {
      setBulkPaymentStatus('Por favor, informe um valor válido para o pagamento.', 'error');
      return;
    }

    const plan = getSelectedPlan();
    if (!plan) return;

    const beforeSnapshot = bulkPaymentModalMode === 'create'
      ? createPaymentStateSnapshot(plan)
      : null;
    const result = bulkPaymentModalMode === 'edit-last'
      ? changeLastBulkPaymentAction(plan, amount)
      : applyBulkPaymentToPlan(plan, amount);

    if (result.applied) {
      if (bulkPaymentModalMode === 'create') {
        recordBulkPaymentAction(plan, amount, beforeSnapshot, result);
      }

      const focusMonthIndex = getNextUnpaidMonthIndex(plan) || getPlanMonthLimit(plan);
      savePlans();
      refreshPlanUiAfterPaymentChange(plan, { focusMonthIndex, highlightMonthIndex: focusMonthIndex });
      setStatus(result.message, 'success');
      closeBulkPaymentModal();
      return;
    }

    setBulkPaymentStatus(result.message, result.type);
  });
}

function updateCreateTotalFromInstallment() {
  const months = Number.parseInt(createTotalMonthsInput?.value, 10) || 0;
  const installmentValue = parseCurrencyToNumber(createInstallmentValueInput?.value);

  if (months > 0 && installmentValue > 0 && createTotalValueInput) {
    createTotalValueInput.value = formatCurrencyRaw(installmentValue * months);
  }
}

function openInstallmentValuePrompt(event, monthIndexValue) {
  event?.preventDefault?.();
  event?.stopPropagation?.();

  const monthIndex = Number.parseInt(monthIndexValue, 10);
  const plan = getSelectedPlan();

  if (!plan || Number.isNaN(monthIndex) || !promptValueModal || !promptValueInput) {
    return;
  }

  currentPromptMonth = monthIndex;
  const currentVal = getMonthBaseValue(plan, monthIndex);

  promptValueInput.value = currentVal > 0 ? formatCurrencyRaw(currentVal) : '';
  promptValueModal.hidden = false;
  syncModalBodyState();

  window.setTimeout(() => {
    promptValueInput.focus();
    promptValueInput.select();
  }, 20);
}

function closeInstallmentValuePrompt() {
  currentPromptMonth = null;

  if (promptValueModal) {
    promptValueModal.hidden = true;
  }

  syncModalBodyState();
}

function saveInstallmentValuePrompt() {
  const plan = getSelectedPlan();

  if (!plan || !Number.isInteger(currentPromptMonth)) {
    closeInstallmentValuePrompt();
    return;
  }

  const newVal = parseCurrencyToNumber(promptValueInput?.value);

  if (!plan.manualMonthValues) {
    plan.manualMonthValues = {};
  }

  const changedMonthIndex = currentPromptMonth;
  plan.manualMonthValues[changedMonthIndex] = Number.isFinite(newVal) ? newVal : 0;
  cleanupPartialMonthCredits(plan);
  savePlans();
  
  // Atualizamos a UI completa, pois mudar um valor pode impactar o valor restante das outras parcelas
  refreshPlanUiAfterPaymentChange(plan, { highlightMonthIndex: changedMonthIndex });
  closeInstallmentValuePrompt();
}

function handleCurrencyInput(e) {
  const input = e.target;

  if (!hasCurrencyDigits(input.value)) {
    input.value = "";
    return;
  }

  const shouldUseCentMask = input.value.includes('R$') && e.inputType !== 'insertFromPaste';
  const numericValue = shouldUseCentMask ? parseCurrencyCentMask(input.value) : parseCurrencyToNumber(input.value);
  input.value = formatCurrencyRaw(numericValue);

  if (input === createInstallmentValueInput || input.id === 'createInstallmentValue') {
    updateCreateTotalFromInstallment();
  }
}

function parseCurrencyToNumber(value) {
  if (!value) return 0;

  const rawValue = String(value);
  const cleanedValue = rawValue.trim().replace(/[^\d.,-]/g, '');
  const digits = cleanedValue.replace(/\D/g, '');

  if (!digits) return 0;

  const signal = cleanedValue.includes('-') ? -1 : 1;

  if (!cleanedValue.includes(',') && !cleanedValue.includes('.')) {
    return signal * parseCurrencyCentMask(digits);
  }

  const unsignedValue = cleanedValue.replace(/-/g, '');
  const decimalSeparator = getCurrencyDecimalSeparator(unsignedValue);

  if (!decimalSeparator) {
    return signal * Number.parseInt(digits, 10);
  }

  const separatorIndex = unsignedValue.lastIndexOf(decimalSeparator);
  const integerPart = unsignedValue.slice(0, separatorIndex).replace(/\D/g, '') || '0';
  const decimalPart = unsignedValue.slice(separatorIndex + 1).replace(/\D/g, '').slice(0, 2).padEnd(2, '0');

  return signal * Number(`${integerPart}.${decimalPart}`);
}

function parseCurrencyCentMask(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return 0;
  return Number.parseInt(digits, 10) / 100;
}

function hasCurrencyDigits(value) {
  return /\d/.test(String(value ?? ''));
}

function getCurrencyDecimalSeparator(value) {
  const lastCommaIndex = value.lastIndexOf(',');
  const lastDotIndex = value.lastIndexOf('.');

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    return lastCommaIndex > lastDotIndex ? ',' : '.';
  }

  if (lastCommaIndex >= 0) {
    return ',';
  }

  const dotParts = value.split('.');
  const decimalDigits = dotParts[1]?.replace(/\D/g, '') ?? '';

  if (dotParts.length === 2 && decimalDigits.length > 0 && decimalDigits.length <= 2) {
    return '.';
  }

  return null;
}

function formatCurrencyRaw(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Chamar inicialização
initFinancialLogic();


function calculatePlanFinancials(plan) {
  const paidMonthsList = getPaidMonths(plan);
  const paidMonths = new Set(paidMonthsList);
  const maxMonths = getPlanMonthLimit(plan);
  let totalPaid = 0;
  let calculatedTotalValue = 0;
  let calculatedRemainingValue = 0;

  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    const baseValue = getMonthBaseValue(plan, monthIndex);

    if (baseValue <= MONEY_EPSILON) {
      continue;
    }

    calculatedTotalValue += baseValue;

    if (paidMonths.has(monthIndex)) {
      totalPaid += baseValue;
      continue;
    }

    const partialCredit = getPartialMonthCredit(plan, monthIndex);
    totalPaid += partialCredit;
    calculatedRemainingValue += Math.max(0, baseValue - partialCredit);
  }

  totalPaid = roundMoney(totalPaid);
  calculatedTotalValue = roundMoney(calculatedTotalValue);
  calculatedRemainingValue = roundMoney(calculatedRemainingValue);

  const isExpense = isExpensePlan(plan);
  const totalValue = isExpense
    ? calculatedTotalValue
    : Math.max(normalizeMoneyValue(plan.totalValue), calculatedTotalValue);
  const remainingValue = totalValue > calculatedTotalValue
    ? Math.max(0, roundMoney(totalValue - totalPaid))
    : calculatedRemainingValue;
  
  let progressRatio = 0;
  if (isExpense) {
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
    remainingValue,
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
