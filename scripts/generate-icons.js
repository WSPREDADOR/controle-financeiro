const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const sourcePngCandidates = [
    path.join(rootDir, 'Controle Financeiro.png'),
    path.join(rootDir, 'logo.png'),
    path.join(rootDir, 'build', 'icon.png')
  ];
  const sourcePng = sourcePngCandidates.find((candidate) => fs.existsSync(candidate));
  const buildDir = path.join(rootDir, 'build');
  const targetPng = path.join(buildDir, 'icon.png');
  const targetIco = path.join(buildDir, 'icon.ico');

  if (!sourcePng) {
    throw new Error(`Arquivo de icone nao encontrado: ${sourcePngCandidates.join(', ')}`);
  }

  fs.mkdirSync(buildDir, { recursive: true });
  if (path.resolve(sourcePng) !== path.resolve(targetPng)) {
    fs.copyFileSync(sourcePng, targetPng);
  }

  const icoBuffer = await pngToIco(sourcePng);
  fs.writeFileSync(targetIco, icoBuffer);

  console.log(`Icones gerados em: ${buildDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
