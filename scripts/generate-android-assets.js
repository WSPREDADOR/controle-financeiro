const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const androidResDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');
const sourceIcon = path.join(projectRoot, 'build', 'icon.png');

const densities = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

async function ensureAndroidProject() {
  if (!fs.existsSync(androidResDir)) {
    throw new Error('Projeto Android nao encontrado. Rode "npx cap add android" primeiro.');
  }

  if (!fs.existsSync(sourceIcon)) {
    throw new Error(`Icone base nao encontrado: ${sourceIcon}`);
  }
}

async function generateLauncherIcons() {
  for (const density of densities) {
    const targetDir = path.join(androidResDir, density.folder);
    const launcherPath = path.join(targetDir, 'ic_launcher.png');
    const roundPath = path.join(targetDir, 'ic_launcher_round.png');
    const foregroundPath = path.join(targetDir, 'ic_launcher_foreground.png');

    await sharp(sourceIcon)
      .resize(density.size, density.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(launcherPath);

    await sharp(sourceIcon)
      .resize(density.size, density.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(roundPath);

    await sharp(sourceIcon)
      .resize(density.size, density.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(foregroundPath);
  }
}

async function generateNotificationIcon() {
  const drawableDir = path.join(androidResDir, 'drawable');
  const notificationIconPath = path.join(drawableDir, 'ic_notification.png');

  await sharp(sourceIcon)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(notificationIconPath);
}

async function main() {
  await ensureAndroidProject();
  await generateLauncherIcons();
  await generateNotificationIcon();
  console.log('Icones do Android atualizados com sucesso.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
