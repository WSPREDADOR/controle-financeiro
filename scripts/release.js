const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const androidRoot = path.join(projectRoot, 'android');
const packagePath = path.join(projectRoot, 'package.json');
const packageLockPath = path.join(projectRoot, 'package-lock.json');
const indexPath = path.join(projectRoot, 'index.html');
const scriptPath = path.join(projectRoot, 'script.js');
const splashPath = path.join(projectRoot, 'splash.html');
const webRuntimePath = path.join(projectRoot, 'web-runtime.js');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const updateInfoPath = path.join(projectRoot, 'update', 'update.json');
const androidBuildPath = path.join(androidRoot, 'app', 'build.gradle');
const releaseAssetName = 'Controle.de.Dividas.apk';
const localApkPath = path.join(projectRoot, 'update', releaseAssetName);
const legacyLocalApkPath = path.join(projectRoot, 'update', 'app-release.apk');
const accentedLocalApkPath = path.join(projectRoot, 'update', 'Controle de Dívidas.apk');
const builtApkPath = path.join(androidRoot, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');

const repoOwner = 'WSPREDADOR';
const repoName = 'controle-financeiro';
const releaseAssetUrlName = encodeURIComponent(releaseAssetName);

function getReleaseApkUrl(version) {
  return `https://github.com/${repoOwner}/${repoName}/releases/download/v${version}/${releaseAssetUrlName}`;
}

function parseArgs(argv) {
  const options = {
    bump: 'patch',
    version: null,
    notes: null,
    resume: false,
    skipRemoteVerify: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg === '--major' || arg === 'major') {
      options.bump = 'major';
      continue;
    }

    if (arg === '--minor' || arg === 'minor') {
      options.bump = 'minor';
      continue;
    }

    if (arg === '--patch' || arg === 'patch') {
      options.bump = 'patch';
      continue;
    }

    if (arg === '--resume') {
      options.resume = true;
      continue;
    }

    if (arg === '--skip-remote-verify') {
      options.skipRemoteVerify = true;
      continue;
    }

    if (arg === '--notes') {
      options.notes = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--notes=')) {
      options.notes = arg.slice('--notes='.length);
      continue;
    }

    if (/^\d+\.\d+\.\d+$/.test(arg)) {
      options.version = arg;
      continue;
    }

    throw new Error(`Argumento desconhecido: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`
Uso:
  npm run release
  npm run release -- --minor
  npm run release -- 1.6.0
  npm run release -- 1.6.0 --notes "Texto da atualizacao"
  npm run release -- --resume

O comando sempre:
  - atualiza as versoes do web e Android
  - gera o bundle web
  - compila o APK release assinado
  - aponta o manifesto para a release versionada do GitHub
  - cria/atualiza a release e o asset ${releaseAssetName}
  - valida o APK remoto baixado da internet

Use --resume somente para continuar uma versao que falhou no meio do release.
`.trim());
}

function run(command, args, options = {}) {
  console.log(`> ${[command, ...args].join(' ')}`);
  const needsCmd = process.platform === 'win32' && (
    /\.cmd$|\.bat$/i.test(command) ||
    ['npm', 'npx'].includes(command.toLowerCase())
  );

  const result = needsCmd
    ? spawnSync(
      [
        ['npm', 'npx'].includes(command.toLowerCase()) ? command : quoteCmdArg(command),
        ...args.map(quoteCmdArg)
      ].join(' '),
      {
        cwd: options.cwd || projectRoot,
        stdio: 'inherit',
        shell: true,
        env: process.env,
        windowsHide: true
      }
    )
    : spawnSync(command, args, {
    cwd: options.cwd || projectRoot,
    stdio: 'inherit',
    shell: false,
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

function replaceRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Nao foi possivel atualizar ${label}.`);
  }

  return content.replace(pattern, replacement);
}

function updateTextFile(filePath, updater) {
  const content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, updater(content), 'utf8');
}

function parseVersion(version) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);

  if (!match) {
    throw new Error(`Versao invalida: ${version}. Use o formato 1.5.0.`);
  }

  return match.slice(1).map((part) => Number.parseInt(part, 10));
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);

  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return 1;
    if (a[index] < b[index]) return -1;
  }

  return 0;
}

function bumpVersion(version, bump) {
  const [major, minor, patch] = parseVersion(version);

  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function updatePackageLockVersion(version) {
  if (!fs.existsSync(packageLockPath)) {
    return;
  }

  const packageLock = readJson(packageLockPath);
  packageLock.version = version;

  if (packageLock.packages?.['']) {
    packageLock.packages[''].version = version;
  }

  writeJson(packageLockPath, packageLock);
}

function updateAndroidVersion(version, options = {}) {
  updateTextFile(androidBuildPath, (content) => {
    const versionCodeMatch = content.match(/versionCode\s+(\d+)/);

    if (!versionCodeMatch) {
      throw new Error('Nao foi possivel localizar versionCode no build.gradle.');
    }

    const currentVersionCode = Number.parseInt(versionCodeMatch[1], 10);
    const nextVersionCode = options.incrementVersionCode === false
      ? currentVersionCode
      : currentVersionCode + 1;

    return replaceRequired(
      content.replace(/versionCode\s+\d+/, `versionCode ${nextVersionCode}`),
      /versionName\s+"[^"]+"/,
      `versionName "${version}"`,
      'versionName do Android'
    );
  });
}

function updateVersionFiles(version, notes, options = {}) {
  const packageJson = readJson(packagePath);
  const oldVersion = packageJson.version;
  const versionComparison = compareVersions(version, oldVersion);

  if (versionComparison < 0 || (versionComparison === 0 && !options.allowSameVersion)) {
    throw new Error(`A nova versao (${version}) precisa ser maior que a atual (${oldVersion}).`);
  }

  packageJson.version = version;
  writeJson(packagePath, packageJson);
  updatePackageLockVersion(version);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  updateTextFile(updateConfigPath, (content) => {
    let updated = replaceRequired(
      content,
      /currentVersion: '[^']+'/,
      `currentVersion: '${version}'`,
      'update-config.js (version)'
    );
    return replaceRequired(
      updated,
      /expirationDate: '[^']+'/,
      `expirationDate: '${formattedDate}'`,
      'update-config.js (date)'
    );
  });

  updateTextFile(scriptPath, (content) => replaceRequired(
    content,
    /(const defaultUpdateConfig = \{\r?\n\s*currentVersion: )'[^']+'/,
    `$1'${version}'`,
    'defaultUpdateConfig em script.js'
  ));

  updateTextFile(webRuntimePath, (content) => replaceRequired(
    content,
    /bundledVersion = '[^']+'/,
    `bundledVersion = '${version}'`,
    'web-runtime.js'
  ));

  updateTextFile(indexPath, (content) => {
    let updated = replaceRequired(
      content,
      /id="appVersionLabel">v[^<]+</,
      `id="appVersionLabel">v${version}<`,
      'versao exibida no index.html'
    );
    return replaceRequired(
      updated,
      /id="appReleaseDateLabel">[^<]+</,
      `id="appReleaseDateLabel">${formattedDate}<`,
      'data exibida no index.html'
    );
  });

  updateTextFile(splashPath, (content) => replaceRequired(
    content,
    /Versao [0-9]+\.[0-9]+\.[0-9]+/,
    `Versao ${version}`,
    'versao exibida no splash.html'
  ));

  updateAndroidVersion(version, {
    incrementVersionCode: versionComparison > 0
  });

  const updateInfo = readJson(updateInfoPath);
  updateInfo.version = version;
  updateInfo.apkUrl = getReleaseApkUrl(version);
  updateInfo.notes = notes || `Atualizacao do aplicativo Android via APK na versao ${version}.`;
  updateInfo.publishedAt = new Date().toISOString().split('T')[0];
  writeJson(updateInfoPath, updateInfo);

  console.log(`Versao atualizada: ${oldVersion} -> ${version}`);
  return { oldVersion, updateInfo };
}

function parseLocalPropertiesSdkDir() {
  const localPropertiesPath = path.join(androidRoot, 'local.properties');

  if (!fs.existsSync(localPropertiesPath)) {
    return null;
  }

  const content = fs.readFileSync(localPropertiesPath, 'utf8');
  const match = content.match(/^sdk\.dir=(.+)$/m);

  if (!match) {
    return null;
  }

  return match[1].trim().replace(/\\:/g, ':').replace(/\\\\/g, '\\');
}

function getAndroidSdkDir() {
  return parseLocalPropertiesSdkDir() || process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || null;
}

function compareBuildTools(left, right) {
  const normalize = (value) => String(value).split('.').map((part) => Number.parseInt(part, 10) || 0);
  const a = normalize(left);
  const b = normalize(right);
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const av = a[index] || 0;
    const bv = b[index] || 0;

    if (av !== bv) {
      return bv - av;
    }
  }

  return 0;
}

function findAndroidBuildTool(toolName) {
  const sdkDir = getAndroidSdkDir();

  if (!sdkDir) {
    return null;
  }

  const buildToolsDir = path.join(sdkDir, 'build-tools');

  if (!fs.existsSync(buildToolsDir)) {
    return null;
  }

  const executableNames = process.platform === 'win32'
    ? [`${toolName}.bat`, `${toolName}.exe`, toolName]
    : [toolName];

  const versions = fs.readdirSync(buildToolsDir)
    .filter((entry) => fs.statSync(path.join(buildToolsDir, entry)).isDirectory())
    .sort(compareBuildTools);

  for (const version of versions) {
    for (const executableName of executableNames) {
      const executablePath = path.join(buildToolsDir, version, executableName);

      if (fs.existsSync(executablePath)) {
        return executablePath;
      }
    }
  }

  return null;
}

function quoteCmdArg(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function runAndroidBuildTool(toolPath, args, options = {}) {
  const isWindowsBatch = process.platform === 'win32' && /\.cmd$|\.bat$/i.test(toolPath);
  const command = isWindowsBatch ? 'cmd.exe' : toolPath;
  const commandArgs = isWindowsBatch
    ? ['/d', '/c', ['call', quoteCmdArg(toolPath), ...args.map(quoteCmdArg)].join(' ')]
    : args;

  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd || projectRoot,
    encoding: options.encoding || 'utf8',
    stdio: options.stdio || 'pipe',
    windowsHide: true
  });

  if (result.status !== 0) {
    const stderr = result.stderr ? String(result.stderr).trim() : '';
    const stdout = result.stdout ? String(result.stdout).trim() : '';
    const details = stderr || stdout || `codigo ${result.status}`;
    throw new Error(`Falha ao executar ${path.basename(toolPath)}: ${details}`);
  }

  return result.stdout ? String(result.stdout) : '';
}

function getApkPackageInfo(apkPath) {
  const aaptPath = findAndroidBuildTool('aapt');

  if (!aaptPath) {
    throw new Error('Nao encontrei o aapt no Android SDK para validar a versao do APK.');
  }

  const output = runAndroidBuildTool(aaptPath, ['dump', 'badging', apkPath]);
  const packageLine = output.split(/\r?\n/).find((line) => line.startsWith('package:'));

  if (!packageLine) {
    throw new Error('Nao foi possivel ler os metadados do APK.');
  }

  const versionCode = packageLine.match(/versionCode='([^']+)'/)?.[1];
  const versionName = packageLine.match(/versionName='([^']+)'/)?.[1];
  const packageName = packageLine.match(/name='([^']+)'/)?.[1];

  return { packageName, versionCode, versionName, packageLine };
}

function verifyApkSignature(apkPath) {
  const apksignerPath = findAndroidBuildTool('apksigner');

  if (!apksignerPath) {
    console.log('Aviso: apksigner nao encontrado; assinatura nao verificada localmente.');
    return;
  }

  const apksignerJarPath = path.join(path.dirname(apksignerPath), 'lib', 'apksigner.jar');

  if (fs.existsSync(apksignerJarPath)) {
    const javaCommand = process.env.JAVA_HOME
      ? path.join(process.env.JAVA_HOME, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')
      : 'java';

    runAndroidBuildTool(javaCommand, ['-jar', apksignerJarPath, 'verify', '--verbose', apkPath], {
      stdio: 'ignore'
    });
    return;
  }

  runAndroidBuildTool(apksignerPath, ['verify', '--verbose', apkPath], {
    stdio: 'ignore'
  });
}

function verifyLocalApk(version) {
  const info = getApkPackageInfo(localApkPath);

  if (info.versionName !== version) {
    throw new Error(`APK local errado: esperado ${version}, encontrado ${info.versionName}.`);
  }

  verifyApkSignature(localApkPath);
  console.log(`APK local validado: ${info.packageName} versionName=${info.versionName} versionCode=${info.versionCode}`);
}

function fileSha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function downloadFile(url, destinationPath, redirectCount = 0) {
  if (redirectCount > 8) {
    return Promise.reject(new Error(`Redirecionamentos demais ao baixar ${url}`));
  }

  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'controle-financeiro-release-script'
      }
    }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        response.resume();
        const nextUrl = new URL(response.headers.location, url).toString();
        downloadFile(nextUrl, destinationPath, redirectCount + 1).then(resolve, reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Download falhou (${response.statusCode}): ${url}`));
        return;
      }

      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
      const file = fs.createWriteStream(destinationPath);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(120000, () => {
      request.destroy(new Error(`Timeout ao baixar ${url}`));
    });
  });
}

async function verifyRemoteApk(version) {
  const remoteApkPath = path.join(os.tmpdir(), `controle-financeiro-${version}-remote.apk`);
  await downloadFile(getReleaseApkUrl(version), remoteApkPath);

  const remoteInfo = getApkPackageInfo(remoteApkPath);

  if (remoteInfo.versionName !== version) {
    throw new Error(`APK remoto errado: esperado ${version}, encontrado ${remoteInfo.versionName}.`);
  }

  const localHash = fileSha256(localApkPath);
  const remoteHash = fileSha256(remoteApkPath);

  if (localHash !== remoteHash) {
    throw new Error(`Hash remoto diferente do local. Local=${localHash} Remoto=${remoteHash}`);
  }

  console.log(`APK remoto validado: versionName=${remoteInfo.versionName}, sha256=${remoteHash}`);
}

function getCurrentBranch() {
  return execFileSync('git', ['branch', '--show-current'], {
    cwd: projectRoot,
    encoding: 'utf8'
  }).trim() || 'main';
}

function ensureGhCli() {
  run('gh', ['--version']);
}

function releaseExists(tag) {
  const result = spawnSync('gh', ['release', 'view', tag], {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: process.platform === 'win32'
  });

  return result.status === 0;
}

function publishGitHubRelease(version, notes, branch) {
  const tag = `v${version}`;
  const title = `Controle de Dívidas v${version}`;
  const apkArg = path.relative(projectRoot, localApkPath);

  ensureGhCli();

  if (releaseExists(tag)) {
    run('gh', ['release', 'edit', tag, '--title', title, '--notes', notes]);
    run('gh', ['release', 'upload', tag, apkArg, '--clobber']);
    return;
  }

  run('gh', [
    'release',
    'create',
    tag,
    apkArg,
    '--target',
    branch,
    '--title',
    title,
    '--notes',
    notes
  ]);
}

function purgeUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, { timeout: 20000 }, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed?.status || response.statusCode);
        } catch (_) {
          resolve(response.statusCode);
        }
      });
    });

    request.on('error', (error) => resolve(`erro: ${error.message}`));
    request.on('timeout', () => {
      request.destroy();
      resolve('timeout');
    });
  });
}

async function purgeJsDelivrCache() {
  const filesToPurge = [
    `${repoOwner}/${repoName}@main/update/web-manifest.json`,
    `${repoOwner}/${repoName}@main/update/web-bundle.json`,
    `${repoOwner}/${repoName}@main/update/${releaseAssetUrlName}`
  ];

  for (const file of filesToPurge) {
    const status = await purgeUrl(`https://purge.jsdelivr.net/gh/${file}`);
    console.log(`Purge jsDelivr ${status}: ${file}`);
  }
}

async function verifyRemoteManifest(version) {
  const manifestPath = path.join(os.tmpdir(), `controle-financeiro-${version}-manifest.json`);
  const manifestUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/update/web-manifest.json?t=${Date.now()}`;
  await downloadFile(manifestUrl, manifestPath);
  const manifest = readJson(manifestPath);
  const expectedApkUrl = getReleaseApkUrl(version);

  if (manifest.version !== version) {
    throw new Error(`Manifesto remoto errado: esperado ${version}, encontrado ${manifest.version}.`);
  }

  if (manifest.apkUrl !== expectedApkUrl) {
    throw new Error(`Manifesto remoto aponta para APK errado: ${manifest.apkUrl}`);
  }

  console.log(`Manifesto remoto validado: ${manifest.version} -> ${manifest.apkUrl}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const packageJson = readJson(packagePath);
  const newVersion = options.version || (options.resume ? packageJson.version : bumpVersion(packageJson.version, options.bump));
  const notes = options.notes || `Atualizacao do aplicativo Android via APK na versao ${newVersion}.`;

  console.log('--- Release Android do Controle de Dívidas ---');

  const { updateInfo } = updateVersionFiles(newVersion, notes, {
    allowSameVersion: options.resume
  });

  console.log('Gerando bundle web, sincronizando Capacitor e assets Android...');
  run('npm', ['run', 'mobile:sync']);

  console.log('Compilando APK release assinado...');
  const gradleCommand = process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew';
  run(gradleCommand, ['assembleRelease'], { cwd: androidRoot });

  if (!fs.existsSync(builtApkPath)) {
    throw new Error(`APK gerado nao encontrado em: ${builtApkPath}`);
  }

  fs.copyFileSync(builtApkPath, localApkPath);

  if (legacyLocalApkPath !== localApkPath && fs.existsSync(legacyLocalApkPath)) {
    fs.rmSync(legacyLocalApkPath);
  }

  if (accentedLocalApkPath !== localApkPath && fs.existsSync(accentedLocalApkPath)) {
    fs.rmSync(accentedLocalApkPath);
  }

  verifyLocalApk(newVersion);

  const branch = getCurrentBranch();

  console.log('Commitando e enviando para o GitHub...');
  run('git', ['add', '-A']);
  run('git', ['commit', '-m', `Release v${newVersion}`]);
  run('git', ['push', 'origin', branch]);

  console.log('Criando/atualizando release do GitHub com APK versionado...');
  publishGitHubRelease(newVersion, updateInfo.notes, branch);

  console.log('Limpando cache do jsDelivr...');
  await purgeJsDelivrCache();

  if (!options.skipRemoteVerify) {
    console.log('Validando manifesto e APK remoto baixados da internet...');
    await verifyRemoteManifest(newVersion);
    await verifyRemoteApk(newVersion);
  }

  console.log(`\nSUCESSO: versao ${newVersion} publicada com APK correto.`);
  console.log(`APK: ${getReleaseApkUrl(newVersion)}`);
}

main().catch((error) => {
  console.error(`\nErro durante o release: ${error.message}`);
  process.exit(1);
});
