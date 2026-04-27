/**
 * web-runtime.js — Motor de atualização OTA para Capacitor (Android/iOS)
 *
 * Estratégia: injetar CSS + JS da nova versão no documento HTML existente,
 * SEM usar document.write() — que não executa scripts confiávelmente no
 * Android WebView do Capacitor.
 *
 * Como funciona:
 * 1. Roda sincronamente no <head>, antes de qualquer outro script
 * 2. Se há bundle no localStorage, marca os scripts originais como "inert"
 *    (muda o type para bloquear execução antes que o parser os alcance)
 * 3. Injeta o CSS novo imediatamente (desabilitando o original)
 * 4. Injeta update-config.js e script.js OTA após DOMContentLoaded
 *
 * Formato do bundle: { version, css, js, updateConfig }
 */
(function () {
  var STORAGE_KEY = 'cf-active-web-bundle';
  var bundledVersion = '1.5.4';
  var maxBundleChars = 1024 * 1024;

  function isNativeApp() {
    var isCapacitorLocalhost =
      window.location.protocol === 'https:' &&
      window.location.hostname === 'localhost' &&
      !window.location.port;
    return isCapacitorLocalhost || window.location.protocol === 'capacitor:';
  }

  function compareVersions(left, right) {
    var a = String(left || '').split('.').map(function (p) { return parseInt(p, 10) || 0; });
    var b = String(right || '').split('.').map(function (p) { return parseInt(p, 10) || 0; });
    var len = Math.max(a.length, b.length);
    for (var i = 0; i < len; i++) {
      var va = a[i] !== undefined ? a[i] : 0;
      var vb = b[i] !== undefined ? b[i] : 0;
      if (va > vb) return 1;
      if (va < vb) return -1;
    }
    return 0;
  }

  if (!isNativeApp()) { return; }

  var raw, bundle;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (_) { return; }

  if (!raw || raw.length > maxBundleChars) {
    if (raw) { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} }
    return;
  }

  try { bundle = JSON.parse(raw); } catch (_) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_2) {}
    return;
  }

  if (!bundle || !bundle.version) { return; }

  if (compareVersions(bundle.version, bundledVersion) < 0) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    return;
  }

  // ── Formato novo: { css, js, updateConfig } — SEM document.write ────────────
  if (bundle.css !== undefined && bundle.js !== undefined) {
    window.__CF_RUNTIME_ACTIVE__ = true;
    window.__CF_OTA_VERSION__ = bundle.version;

    // ── Passo 1: bloquear scripts originais antes que o parser os execute ──────
    // O web-runtime.js está no <head> e é síncrono — corre antes de qualquer
    // <script src="..."> no <body>. Alteramos o type para 'inert' para que o
    // browser não execute os scripts originais (update-config.js / script.js).
    // Usamos MutationObserver para interceptar à medida que o parser os adiciona.
    var blockedSrcs = ['update-config.js', 'script.js'];
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.tagName === 'SCRIPT') {
            var src = (node.getAttribute('src') || '').split('/').pop().split('?')[0];
            if (blockedSrcs.indexOf(src) !== -1) {
              node.type = 'inert'; // impede a execução
            }
          }
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // ── Passo 2: injetar CSS novo imediatamente ───────────────────────────────
    var style = document.createElement('style');
    style.id = 'cf-ota-style';
    style.textContent = bundle.css;
    document.head.appendChild(style);

    // ── Passo 3: injetar update-config + script.js após DOM estar pronto ─────
    document.addEventListener('DOMContentLoaded', function () {
      observer.disconnect(); // para de bloquear novos scripts

      // Injetar update-config (define window.APP_UPDATE_CONFIG)
      if (bundle.updateConfig) {
        var cfgScript = document.createElement('script');
        cfgScript.textContent = bundle.updateConfig;
        document.body.appendChild(cfgScript);
      }

      // Injetar script.js principal do OTA
      var appScript = document.createElement('script');
      appScript.textContent = bundle.js;
      document.body.appendChild(appScript);
    }, { once: true });

    return; // bundle novo aplicado com sucesso
  }

  // ── Formato legado: { html } — fallback com document.write ──────────────────
  if (bundle.html) {
    window.__CF_RUNTIME_ACTIVE__ = true;
    window.stop();
    document.open();
    document.write(bundle.html);
    document.close();
  }
})();
