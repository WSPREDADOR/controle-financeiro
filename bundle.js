const fs = require('fs');
const path = require('path');

const VERSION = '2.0.9';

function bundle() {
  const htmlPath = path.join(__dirname, 'index.html');
  const cssPath = path.join(__dirname, 'style.css');
  const scriptPath = path.join(__dirname, 'script.js');
  const configPath = path.join(__dirname, 'update-config.js');
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const script = fs.readFileSync(scriptPath, 'utf8');
  const config = fs.readFileSync(configPath, 'utf8');

  // Injetar CSS
  html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`);
  
  // Remover web-runtime.js (ele é injetado pelo APK)
  html = html.replace('<script src="web-runtime.js"></script>', '');

  // Injetar Scripts
  html = html.replace('<script data-cf-original="update-config" src="update-config.js"></script>', `<script>${config}</script>`);
  html = html.replace('<script data-cf-original="script" src="script.js"></script>', `<script>${script}</script>`);

  const bundleData = {
    version: VERSION,
    html: html
  };

  fs.writeFileSync(path.join(__dirname, 'update', 'web-bundle.json'), JSON.stringify(bundleData));
  console.log(`Bundle v${VERSION} gerado com sucesso!`);
}

bundle();
