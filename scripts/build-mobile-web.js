const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const targetDir = path.join(projectRoot, 'mobile-web');
const assetsDir = path.join(targetDir, 'assets');

const rootFiles = [
  'index.html',
  'style.css',
  'script.js',
  'update-config.js',
  'manifest.webmanifest',
  'sw.js'
];

const assetFiles = [
  { from: path.join(projectRoot, 'Controle Financeiro.png'), to: path.join(assetsDir, 'Controle Financeiro.png') },
  { from: path.join(projectRoot, 'build', 'icon.png'), to: path.join(assetsDir, 'icon.png') }
];

function cleanDirectory(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, destination) {
  if (!fs.existsSync(source)) {
    throw new Error(`Arquivo nao encontrado: ${source}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function updateIndexHtml(html) {
  return html
    .replace(/src="Controle Financeiro\.png"/g, 'src="assets/Controle Financeiro.png"')
    .replace('</body>', '  <script>\n    if (\'serviceWorker\' in navigator) {\n      window.addEventListener(\'load\', () => {\n        navigator.serviceWorker.register(\'./sw.js\').catch(() => {});\n      });\n    }\n  </script>\n</body>');
}

function main() {
  cleanDirectory(targetDir);

  for (const file of rootFiles) {
    const sourcePath = path.join(projectRoot, file);
    const targetPath = path.join(targetDir, file);

    if (file === 'index.html') {
      const html = fs.readFileSync(sourcePath, 'utf8');
      fs.writeFileSync(targetPath, updateIndexHtml(html), 'utf8');
      continue;
    }

    copyFile(sourcePath, targetPath);
  }

  for (const asset of assetFiles) {
    copyFile(asset.from, asset.to);
  }

  console.log(`Build mobile web criada em: ${targetDir}`);
}

main();
