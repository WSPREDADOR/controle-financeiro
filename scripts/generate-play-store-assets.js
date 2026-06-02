const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'play-store', 'assets');
const logoPath = path.join(projectRoot, 'logo.png');

async function main() {
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo nao encontrada: ${logoPath}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const iconBuffer = await sharp(logoPath)
    .resize(512, 512, { fit: 'contain', background: { r: 15, g: 20, b: 24, alpha: 1 } })
    .png()
    .toBuffer();

  await sharp(iconBuffer)
    .png()
    .toFile(path.join(outputDir, 'icon-512.png'));

  const featureLogo = await sharp(logoPath)
    .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const titleSvg = Buffer.from(`
    <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#0f1418"/>
          <stop offset="0.52" stop-color="#12343a"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="500" rx="0" fill="url(#bg)"/>
      <rect x="70" y="70" width="884" height="360" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
      <text x="330" y="205" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="#ffffff">Controle de Pagamentos</text>
      <text x="332" y="270" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="500" fill="#d7f6f0">Contas, parcelas e lembretes em dia</text>
      <text x="332" y="326" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="#b8d7d3">Organizacao financeira simples para o dia a dia</text>
    </svg>
  `);

  await sharp(titleSvg)
    .composite([{ input: featureLogo, left: 92, top: 140 }])
    .png()
    .toFile(path.join(outputDir, 'feature-graphic-1024x500.png'));

  console.log(`Assets da Play gerados em: ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
