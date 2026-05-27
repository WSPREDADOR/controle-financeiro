const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const androidRoot = path.join(projectRoot, 'android');
const packagePath = path.join(projectRoot, 'package.json');
const packageLockPath = path.join(projectRoot, 'package-lock.json');
const scriptPath = path.join(projectRoot, 'script.js');
const indexPath = path.join(projectRoot, 'index.html');
const splashPath = path.join(projectRoot, 'splash.html');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const updateInfoPath = path.join(projectRoot, 'update', 'update.json');
const compatibilityManifestPath = path.join(projectRoot, 'update', 'web-manifest.json');
const androidBuildPath = path.join(androidRoot, 'app', 'build.gradle');
const builtApkPath = path.join(androidRoot, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const releaseApkFileName = 'Controle.de.Dividas.apk';
const releaseApkPath = path.join(androidRoot, 'app', 'build', 'outputs', 'apk', 'release', releaseApkFileName);

function parseArgs(argv) {
  const options = { bump: 'patch', version: null, notes: 'Nova atualizacao disponivel.' };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--major' || arg === 'major') options.bump = 'major';
    else if (arg === '--minor' || arg === 'minor') options.bump = 'minor';
    else if (arg === '--patch' || arg === 'patch') options.bump = 'patch';
    else if (arg === '--notes') options.notes = argv[++index] || options.notes;
    else if (arg.startsWith('--notes=')) options.notes = arg.slice('--notes='.length);
    else if (/^\d+\.\d+\.\d+$/.test(arg)) options.version = arg;
    else throw new Error(`Argumento desconhecido: ${arg}`);
  }

  return options;
}

function run(command, args, options = {}) {
  console.log(`> ${[command, ...args].join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: options.cwd || projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
    windowsHide: true
  });

  if (result.status !== 0) {
    throw new Error(`Comando falhou: ${command} ${args.join(' ')}`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function updateTextFile(filePath, updater) {
  fs.writeFileSync(filePath, updater(fs.readFileSync(filePath, 'utf8')), 'utf8');
}

function replaceRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Nao foi possivel atualizar ${label}.`);
  }

  return content.replace(pattern, replacement);
}

function parseVersion(version) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`Versao invalida: ${version}. Use o formato 1.2.3.`);
  return match.slice(1).map((part) => Number.parseInt(part, 10));
}

function bumpVersion(version, bump) {
  const [major, minor, patch] = parseVersion(version);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function updatePackageLockVersion(version) {
  if (!fs.existsSync(packageLockPath)) return;

  const packageLock = readJson(packageLockPath);
  packageLock.version = version;
  if (packageLock.packages?.['']) packageLock.packages[''].version = version;
  writeJson(packageLockPath, packageLock);
}

function getAndroidVersionCode() {
  const content = fs.readFileSync(androidBuildPath, 'utf8');
  const match = content.match(/versionCode\s+(\d+)/);
  if (!match) throw new Error('Nao encontrei versionCode no android/app/build.gradle.');
  return Number.parseInt(match[1], 10);
}

function updateVersionFiles(version, versionCode, notes) {
  const packageJson = readJson(packagePath);
  packageJson.version = version;
  writeJson(packagePath, packageJson);
  updatePackageLockVersion(version);

  const today = new Date();
  const brDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const isoDate = today.toISOString().split('T')[0];

  updateTextFile(androidBuildPath, (content) => replaceRequired(
    replaceRequired(content, /versionCode\s+\d+/, `versionCode ${versionCode}`, 'versionCode do Android'),
    /versionName\s+"[^"]+"/,
    `versionName "${version}"`,
    'versionName do Android'
  ));

  updateTextFile(updateConfigPath, (content) => {
    let updated = replaceRequired(content, /currentVersionCode:\s*\d+/, `currentVersionCode: ${versionCode}`, 'update-config versionCode');
    updated = replaceRequired(updated, /currentVersionName:\s*'[^']+'/, `currentVersionName: '${version}'`, 'update-config versionName');
    return replaceRequired(updated, /releaseDate:\s*'[^']+'/, `releaseDate: '${brDate}'`, 'update-config releaseDate');
  });

  updateTextFile(scriptPath, (content) => {
    let updated = replaceRequired(content, /const APP_ANDROID_VERSION_CODE = \d+;/, `const APP_ANDROID_VERSION_CODE = ${versionCode};`, 'APP_ANDROID_VERSION_CODE');
    updated = replaceRequired(updated, /(currentVersionName:\s*)'[^']+'/, `$1'${version}'`, 'currentVersionName em script.js');
    return replaceRequired(updated, /(releaseDate:\s*)'[^']+'/, `$1'${brDate}'`, 'releaseDate em script.js');
  });

  updateTextFile(indexPath, (content) => {
    let updated = replaceRequired(content, /id="appVersionLabel">v[^<]+</, `id="appVersionLabel">v${version}<`, 'versao no index.html');
    return replaceRequired(updated, /id="appReleaseDateLabel">[^<]+</, `id="appReleaseDateLabel">${brDate}<`, 'data no index.html');
  });

  updateTextFile(splashPath, (content) => replaceRequired(
    content,
    /Versao [0-9]+\.[0-9]+\.[0-9]+/,
    `Versao ${version}`,
    'versao no splash.html'
  ));

  return { isoDate, notes };
}

function getGithubReleaseApkUrl(version) {
  return `https://github.com/WSPREDADOR/controle-financeiro/releases/download/v${version}/${releaseApkFileName}`;
}

function publishUpdateFiles(version, versionCode, notes, publishedAt) {
  if (!fs.existsSync(builtApkPath)) {
    throw new Error(`APK gerado nao encontrado: ${builtApkPath}`);
  }

  const apkUrl = getGithubReleaseApkUrl(version);
  const apkBase64 = fs.readFileSync(builtApkPath).toString('base64');
  writeJson(updateInfoPath, {
    versionCode,
    versionName: version,
    apkUrl,
    apkBase64,
    notes,
    publishedAt
  });

  writeJson(compatibilityManifestPath, {
    version,
    notes,
    publishedAt,
    apkUrl
  });

  fs.copyFileSync(builtApkPath, releaseApkPath);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packageJson = readJson(packagePath);
  const version = options.version || bumpVersion(packageJson.version, options.bump);
  const versionCode = getAndroidVersionCode() + 1;

  console.log('--- Atualizacao simples do Controle de Dividas ---');
  const releaseInfo = updateVersionFiles(version, versionCode, options.notes);

  console.log('Gerando web mobile e APK release...');
  run('npm', ['run', 'mobile:sync']);
  run(process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew', ['assembleRelease'], { cwd: androidRoot });

  console.log('Gerando arquivos de atualizacao...');
  publishUpdateFiles(version, versionCode, releaseInfo.notes, releaseInfo.isoDate);

  console.log(`Atualizacao ${version} pronta.`);
  console.log('Publique/commit update/update.json e update/web-manifest.json.');
  console.log(`Crie a release v${version} no GitHub usando o APK: ${releaseApkPath}`);
}

main();
