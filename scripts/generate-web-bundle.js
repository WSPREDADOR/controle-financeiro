const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const indexPath = path.join(projectRoot, 'index.html');
const stylePath = path.join(projectRoot, 'style.css');
const scriptPath = path.join(projectRoot, 'script.js');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const packagePath = path.join(projectRoot, 'package.json');
const updateInfoPath = path.join(projectRoot, 'update', 'update.json');
const manifestOutPath = path.join(projectRoot, 'update', 'web-manifest.json');
const bundleOutPath = path.join(projectRoot, 'update', 'web-bundle.json');
const topbarImagePath = path.join(projectRoot, 'Controle Financeiro.png');

function extractBodyHtml(indexHtml) {
  const match = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);

  if (!match) {
    throw new Error('Nao foi possivel localizar o <body> do index.html.');
  }

  return match[1]
    .replace(/\s*<script\s+src="web-runtime\.js"><\/script>\s*/gi, '\n')
    .replace(/\s*<script\s+src="update-config\.js"><\/script>\s*/gi, '\n')
    .replace(/\s*<script\s+src="script\.js"><\/script>\s*/gi, '\n')
    .trim();
}

function fileToDataUrl(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'application/octet-stream';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

function inlineTopbarImage(bodyHtml, topbarImageDataUrl) {
  const imageSources = [
    'src="Controle Financeiro.png"',
    'src="assets/Controle Financeiro.png"'
  ];

  let hydratedBodyHtml = bodyHtml;

  imageSources.forEach((source) => {
    hydratedBodyHtml = hydratedBodyHtml.split(source).join(`src="${topbarImageDataUrl}"`);
  });

  if (imageSources.some((source) => hydratedBodyHtml.includes(source))) {
    throw new Error('Nao foi possivel embutir a imagem do topo no bundle web.');
  }

  return hydratedBodyHtml;
}

function inlineFonts(cssContent) {
  const fontFiles = [
    { name: 'manrope-400.woff2', path: 'assets/fonts/manrope-400.woff2' },
    { name: 'manrope-500.woff2', path: 'assets/fonts/manrope-500.woff2' },
    { name: 'manrope-600.woff2', path: 'assets/fonts/manrope-600.woff2' },
    { name: 'manrope-700.woff2', path: 'assets/fonts/manrope-700.woff2' },
    { name: 'manrope-800.woff2', path: 'assets/fonts/manrope-800.woff2' },
    { name: 'space-grotesk-500.woff2', path: 'assets/fonts/space-grotesk-500.woff2' },
    { name: 'space-grotesk-700.woff2', path: 'assets/fonts/space-grotesk-700.woff2' }
  ];

  let hydratedCss = cssContent;

  fontFiles.forEach((font) => {
    const fullPath = path.join(projectRoot, font.path);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const dataUrl = `data:font/woff2;base64,${buffer.toString('base64')}`;
      // Substitui o caminho relativo pelo Data URL da fonte
      hydratedCss = hydratedCss.split(`url('${font.path}')`).join(`url('${dataUrl}')`);
    }
  });

  return hydratedCss;
}

function buildBundleHtml({ bodyHtml, styleCss, updateConfigJs, appScriptJs, topbarImageDataUrl }) {
  const hydratedBodyHtml = inlineTopbarImage(bodyHtml, topbarImageDataUrl);
  const hydratedStyleCss = inlineFonts(styleCss);

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
  <style>
${hydratedStyleCss}
  </style>
</head>
<body>
${hydratedBodyHtml}
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
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const styleCss = fs.readFileSync(stylePath, 'utf8');
  const appScriptJs = fs.readFileSync(scriptPath, 'utf8');
  const updateConfigJs = fs.readFileSync(updateConfigPath, 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const updateInfo = JSON.parse(fs.readFileSync(updateInfoPath, 'utf8'));
  const version = packageJson.version;
  const bodyHtml = extractBodyHtml(indexHtml);
  const topbarImageDataUrl = fileToDataUrl(topbarImagePath);
  const html = buildBundleHtml({ bodyHtml, styleCss, updateConfigJs, appScriptJs, topbarImageDataUrl });

  const manifest = {
    version,
    notes: updateInfo.notes || '',
    publishedAt: updateInfo.publishedAt || '',
    bundleUrl: 'https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/web-bundle.json',
    bundleFallbackUrl: 'https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/web-bundle.json'
  };

  const bundle = {
    version,
    html
  };

  fs.writeFileSync(manifestOutPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(bundleOutPath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');

  console.log(`Bundle web gerado em: ${bundleOutPath}`);
  console.log(`Manifesto web gerado em: ${manifestOutPath}`);
}

main();
