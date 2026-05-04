/**
 * generate-web-bundle.js (v1.4.38)
 * 
 * BUNDLE HÍBRIDO DEFINITIVO:
 * Produz tanto o formato 'html' (para APKs antigos) quanto 
 * 'css/js' (para o novo runtime estável v1.4.37+).
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const indexPath = path.join(projectRoot, 'index.html');
const stylePath = path.join(projectRoot, 'style.css');
const scriptPath = path.join(projectRoot, 'script.js');
const supportConfigPath = path.join(projectRoot, 'support-config.js');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const packagePath = path.join(projectRoot, 'package.json');
const updateInfoPath = path.join(projectRoot, 'update', 'update.json');
const manifestOutPath = path.join(projectRoot, 'update', 'web-manifest.json');
const bundleOutPath = path.join(projectRoot, 'update', 'web-bundle.json');
const releaseAssetName = 'Controle.de.Dividas.apk';
const releaseAssetUrlName = encodeURIComponent(releaseAssetName);

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{:;,])\s*/g, '$1').trim();
}

function minifyJs(js) {
  // Mantem quebras de linha para nao corromper URLs como https:// em strings.
  return js.trim();
}

function extractBodyHtml(indexHtml) {
  const match = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!match) throw new Error('Body não encontrado.');
  
  let body = match[1];
  body = body.replace(/\s*<script\s+src="web-runtime\.js"><\/script>\s*/gi, '\n');
  body = body.replace(/\s*<script\s+data-cf-original="[^"]*"\s+src="support-config\.js"><\/script>\s*/gi, '\n');
  body = body.replace(/\s*<script\s+data-cf-original="[^"]*"\s+src="update-config\.js"><\/script>\s*/gi, '\n');
  body = body.replace(/\s*<script\s+data-cf-original="[^"]*"\s+src="script\.js"><\/script>\s*/gi, '\n');
  body = body.replace(/\s*<script\s+src="support-config\.js"><\/script>\s*/gi, '\n');
  body = body.replace(/\s*<script\s+src="update-config\.js"><\/script>\s*/gi, '\n');
  body = body.replace(/\s*<script\s+src="script\.js"><\/script>\s*/gi, '\n');
  
  // Fix imagem
  body = body.replace(/src="logo\.png"/g, 'src="logo.png" data-fallback-src="assets/Controle Financeiro.png"');
  body = body.replace(/src="Controle Financeiro\.png"/g, 'src="assets/Controle Financeiro.png" data-fallback-src="Controle Financeiro.png"');
  
  return body.trim();
}

function buildBundleHtml({ bodyHtml, styleCss, supportConfigJs, updateConfigJs, appScriptJs }) {
  const minifiedCss = minifyCss(styleCss);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0f1418">
  <title>Controle Financeiro</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>${minifiedCss}</style>
  <script>
    window.addEventListener('error', function(e) {
      if (e.target && e.target.tagName === 'IMG') {
        var fb = e.target.getAttribute('data-fallback-src');
        if (fb && e.target.src.indexOf(fb) === -1) e.target.src = fb;
      }
    }, true);
  </script>
</head>
<body>
${bodyHtml}
  <script>window.__CF_RUNTIME_ACTIVE__=true;</script>
  <script>${minifyJs(supportConfigJs)}</script>
  <script>${minifyJs(updateConfigJs)}</script>
  <script>${minifyJs(appScriptJs)}</script>
</body>
</html>`;
}

function main() {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const styleCss = fs.readFileSync(stylePath, 'utf8');
  const appScriptJs = fs.readFileSync(scriptPath, 'utf8');
  const supportConfigJs = fs.existsSync(supportConfigPath)
    ? fs.readFileSync(supportConfigPath, 'utf8')
    : 'window.CF_SUPPORT_CONFIG={enabled:false};';
  const updateConfigJs = fs.readFileSync(updateConfigPath, 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const updateInfo = JSON.parse(fs.readFileSync(updateInfoPath, 'utf8'));
  const version = packageJson.version;
  
  const bodyHtml = extractBodyHtml(indexHtml);
  const html = buildBundleHtml({ bodyHtml, styleCss, supportConfigJs, updateConfigJs, appScriptJs });

  const manifest = {
    version,
    notes: updateInfo.notes || '',
    publishedAt: new Date().toISOString().split('T')[0],
    bundleUrl: `https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-bundle.json?v=${Date.now()}`,
    bundleFallbackUrl: `https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-bundle.json?v=${Date.now()}`,
    apkUrl: `https://github.com/WSPREDADOR/controle-financeiro/releases/download/v${version}/${releaseAssetUrlName}`
  };

  // BUNDLE HÍBRIDO
  const bundle = { 
    version, 
    html,
    css: minifyCss(styleCss),
    js: minifyJs(appScriptJs),
    supportConfig: minifyJs(supportConfigJs),
    updateConfig: minifyJs(updateConfigJs)
  };

  fs.writeFileSync(manifestOutPath, JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(bundleOutPath, JSON.stringify(bundle), 'utf8');

  console.log(`Bundle Híbrido v${version} gerado (${(JSON.stringify(bundle).length/1024).toFixed(1)} KB)`);
}

main();
