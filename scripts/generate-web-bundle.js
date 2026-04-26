/**
 * generate-web-bundle.js
 *
 * Gera o bundle OTA com o NOVO formato: { version, css, js, updateConfig }
 *
 * O web-runtime.js injeta cada parte separadamente no documento existente,
 * sem usar document.write() — o que era a causa de travamentos no Android WebView.
 */
const fs   = require('fs');
const path = require('path');

const projectRoot     = path.resolve(__dirname, '..');
const stylePath       = path.join(projectRoot, 'style.css');
const scriptPath      = path.join(projectRoot, 'script.js');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const packagePath     = path.join(projectRoot, 'package.json');
const updateInfoPath  = path.join(projectRoot, 'update', 'update.json');
const manifestOutPath = path.join(projectRoot, 'update', 'web-manifest.json');
const bundleOutPath   = path.join(projectRoot, 'update', 'web-bundle.json');

function main() {
  const styleCss      = fs.readFileSync(stylePath, 'utf8');
  const appScriptJs   = fs.readFileSync(scriptPath, 'utf8');
  const updateConfigJs = fs.readFileSync(updateConfigPath, 'utf8');
  const packageJson   = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const updateInfo    = JSON.parse(fs.readFileSync(updateInfoPath, 'utf8'));
  const version       = packageJson.version;

  // Manifesto: informa ao app que existe uma versão disponível
  const manifest = {
    version,
    notes:       updateInfo.notes || '',
    publishedAt: updateInfo.publishedAt || '',
    bundleUrl:         'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-bundle.json',
    bundleFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-bundle.json'
  };

  // Bundle: formato novo — CSS, JS e config separados (sem HTML completo)
  // O web-runtime.js injeta cada parte no documento HTML existente,
  // sem document.write(), resolvendo o travamento no Android WebView.
  const bundle = {
    version,
    css:          styleCss,
    js:           appScriptJs,
    updateConfig: updateConfigJs
  };

  const bundleJson = JSON.stringify(bundle);
  const bundleSizeKB = (Buffer.byteLength(bundleJson, 'utf8') / 1024).toFixed(1);

  if (Buffer.byteLength(bundleJson, 'utf8') > 1024 * 1024) {
    throw new Error(`Bundle muito grande (${bundleSizeKB} KB). Limite: 1024 KB.`);
  }

  fs.writeFileSync(manifestOutPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(bundleOutPath,   `${JSON.stringify(bundle,   null, 2)}\n`, 'utf8');

  console.log(`Bundle web gerado em: ${bundleOutPath}`);
  console.log(`Tamanho do bundle: ${bundleSizeKB} KB`);
  console.log(`Manifesto web gerado em: ${manifestOutPath}`);
}

main();
