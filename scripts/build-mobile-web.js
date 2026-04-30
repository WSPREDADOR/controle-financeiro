const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const targetDir = path.join(projectRoot, 'mobile-web');
const assetsDir = path.join(targetDir, 'assets');

const rootFiles = [
  'index.html',
  'style.css',
  'script.js',
  'web-runtime.js',
  'update-config.js',
  'manifest.webmanifest',
  'sw.js'
];

const assetFiles = [
  {
    from: [
      path.join(projectRoot, 'logo.png'),
      path.join(projectRoot, 'Controle Financeiro.png'),
      path.join(projectRoot, 'build', 'icon.png')
    ],
    to: path.join(targetDir, 'logo.png')
  },
  {
    from: [
      path.join(projectRoot, 'Controle Financeiro.png'),
      path.join(projectRoot, 'logo.png'),
      path.join(projectRoot, 'build', 'icon.png')
    ],
    to: path.join(assetsDir, 'Controle Financeiro.png')
  },
  { from: path.join(projectRoot, 'build', 'icon.png'), to: path.join(assetsDir, 'icon.png') }
];

function cleanDirectory(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, destination) {
  const sourcePath = Array.isArray(source)
    ? source.find((candidate) => fs.existsSync(candidate))
    : source;

  if (!sourcePath || !fs.existsSync(sourcePath)) {
    throw new Error(`Arquivo nao encontrado: ${source}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(sourcePath, destination);
}

function updateIndexHtml(html) {
  return html
    .replace(/src="Controle Financeiro\.png"/g, 'src="assets/Controle Financeiro.png"')
    .replace('</body>', '  <script>\n    window.addEventListener(\'load\', async () => {\n      if (!(\'serviceWorker\' in navigator)) {\n        return;\n      }\n\n      const isNativeApp = (window.location.protocol === \'https:\' && window.location.hostname === \'localhost\' && !window.location.port) || window.location.protocol === \'capacitor:\';\n\n      if (isNativeApp) {\n        try {\n          const registrations = await navigator.serviceWorker.getRegistrations();\n          await Promise.all(registrations.map((registration) => registration.unregister()));\n\n          if (window.caches?.keys) {\n            const keys = await window.caches.keys();\n            await Promise.all(keys.map((key) => window.caches.delete(key)));\n          }\n        } catch (_) {}\n\n        return;\n      }\n\n      navigator.serviceWorker.register(\'./sw.js\').catch(() => {});\n    });\n  </script>\n</body>');
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
