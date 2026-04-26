(function () {
  if (window.__CF_RUNTIME_ACTIVE__) {
    return;
  }

  const STORAGE_KEY = 'cf-active-web-bundle';
  const bundledVersion = '1.4.15';

  function isNativeApp() {
    const isCapacitorLocalhost = window.location.protocol === 'https:' && window.location.hostname === 'localhost' && !window.location.port;
    return isCapacitorLocalhost || window.location.protocol === 'capacitor:';
  }

  function compareVersions(left, right) {
    const a = String(left || '').split('.').map((part) => Number.parseInt(part, 10) || 0);
    const b = String(right || '').split('.').map((part) => Number.parseInt(part, 10) || 0);
    const length = Math.max(a.length, b.length);

    for (let index = 0; index < length; index += 1) {
      const valueA = a[index] ?? 0;
      const valueB = b[index] ?? 0;

      if (valueA > valueB) {
        return 1;
      }

      if (valueA < valueB) {
        return -1;
      }
    }

    return 0;
  }

  if (!isNativeApp()) {
    return;
  }

  try {
    const rawBundle = localStorage.getItem(STORAGE_KEY);

    if (!rawBundle) {
      return;
    }

    const bundle = JSON.parse(rawBundle);

    if (!bundle?.html || !bundle?.version) {
      return;
    }

    if (compareVersions(bundle.version, bundledVersion) < 0) {
      return;
    }

    window.__CF_RUNTIME_ACTIVE__ = true;
    window.stop();
    
    // Usa document.write para garantir que os scripts da nova versão sejam executados
    // document.open() limpa o documento atual completamente antes de escrever o novo
    document.open();
    document.write(bundle.html);
    document.close();
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
  }
})();
