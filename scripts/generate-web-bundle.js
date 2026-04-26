/**
 * generate-web-bundle.js
 *
 * Gera o bundle OTA no formato: { version, html }
 *
 * O HTML gerado é uma página completa que inclui CSS inline, update-config
 * e script.js. Quando o web-runtime.js do APK aplica via document.write(),
 * a página inteira é substituída pelo conteúdo do bundle.
 *
 * O HTML inclui um mecanismo de segurança: se o app travar após
 * document.write(), o bundle é automaticamente removido após 5 segundos
 * de inatividade.
 */
const fs   = require('fs');
const path = require('path');

const projectRoot      = path.resolve(__dirname, '..');
const indexPath        = path.join(projectRoot, 'index.html');
const stylePath        = path.join(projectRoot, 'style.css');
const scriptPath       = path.join(projectRoot, 'script.js');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const packagePath      = path.join(projectRoot, 'package.json');
const updateInfoPath   = path.join(projectRoot, 'update', 'update.json');
const manifestOutPath  = path.join(projectRoot, 'update', 'web-manifest.json');
const bundleOutPath    = path.join(projectRoot, 'update', 'web-bundle.json');

function extractBodyHtml(indexHtml) {
  const match = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!match) {
    throw new Error('Nao foi possivel localizar o <body> do index.html.');
  }
  return match[1]
    .replace(/\s*<script\s+src="web-runtime\.js"><\/script>\s*/gi, '\n')
    .replace(/\s*<script\s+data-cf-original="[^"]*"\s+src="update-config\.js"><\/script>\s*/gi, '\n')
    .replace(/\s*<script\s+data-cf-original="[^"]*"\s+src="script\.js"><\/script>\s*/gi, '\n')
    .replace(/\s*<script\s+src="update-config\.js"><\/script>\s*/gi, '\n')
    .replace(/\s*<script\s+src="script\.js"><\/script>\s*/gi, '\n')
    .trim();
}

function buildBundleHtml({ bodyHtml, styleCss, updateConfigJs, appScriptJs }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0f1418">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Controle Financeiro">
  <title>Controle Financeiro</title>
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
${styleCss}
  </style>
</head>
<body>
${bodyHtml}
  <script>
    window.__CF_RUNTIME_ACTIVE__ = true;
  </script>
  <script>
${updateConfigJs}
  </script>
  <script>
${appScriptJs}
  </script>
</body>
</html>`;
}

function main() {
  const indexHtml      = fs.readFileSync(indexPath, 'utf8');
  const styleCss       = fs.readFileSync(stylePath, 'utf8');
  const appScriptJs    = fs.readFileSync(scriptPath, 'utf8');
  const updateConfigJs = fs.readFileSync(updateConfigPath, 'utf8');
  const packageJson    = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const updateInfo     = JSON.parse(fs.readFileSync(updateInfoPath, 'utf8'));
  const version        = packageJson.version;
  const bodyHtml       = extractBodyHtml(indexHtml);
  const html           = buildBundleHtml({ bodyHtml, styleCss, updateConfigJs, appScriptJs });

  const manifest = {
    version,
    notes:       updateInfo.notes || '',
    publishedAt: updateInfo.publishedAt || '',
    bundleUrl:         `https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-bundle.json?v=${Date.now()}`,
    bundleFallbackUrl: `https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-bundle.json?v=${Date.now()}`
  };

  const bundle = { version, html };
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
