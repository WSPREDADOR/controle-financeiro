const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const sourcePng = path.join(rootDir, 'Controle Financeiro.png');
  const buildDir = path.join(rootDir, 'build');
  const targetPng = path.join(buildDir, 'icon.png');
  const targetIco = path.join(buildDir, 'icon.ico');

  if (!fs.existsSync(sourcePng)) {
    throw new Error(`Arquivo de icone nao encontrado: ${sourcePng}`);
  }

  fs.mkdirSync(buildDir, { recursive: true });
  fs.copyFileSync(sourcePng, targetPng);

  const icoBuffer = await pngToIco(sourcePng);
  fs.writeFileSync(targetIco, icoBuffer);

  console.log(`Icones gerados em: ${buildDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
