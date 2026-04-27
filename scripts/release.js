const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const projectRoot = path.resolve(__dirname, '..');
const packagePath = path.join(projectRoot, 'package.json');
const packageLockPath = path.join(projectRoot, 'package-lock.json');
const indexPath = path.join(projectRoot, 'index.html');
const scriptPath = path.join(projectRoot, 'script.js');
const splashPath = path.join(projectRoot, 'splash.html');
const webRuntimePath = path.join(projectRoot, 'web-runtime.js');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const updateInfoPath = path.join(projectRoot, 'update', 'update.json');
const androidBuildPath = path.join(projectRoot, 'android', 'app', 'build.gradle');

function replaceRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Nao foi possivel atualizar ${label}.`);
  }

  return content.replace(pattern, replacement);
}

function updatePackageLockVersion(version) {
  if (!fs.existsSync(packageLockPath)) {
    return;
  }

  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  packageLock.version = version;

  if (packageLock.packages?.['']) {
    packageLock.packages[''].version = version;
  }

  fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2) + '\n');
}

function updateTextFile(filePath, updater) {
  const content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, updater(content), 'utf8');
}

function updateAndroidVersion(version) {
  if (!fs.existsSync(androidBuildPath)) {
    return;
  }

  updateTextFile(androidBuildPath, (content) => {
    const versionCodeMatch = content.match(/versionCode\s+(\d+)/);

    if (!versionCodeMatch) {
      throw new Error('Nao foi possivel localizar versionCode no build.gradle.');
    }

    const nextVersionCode = Number.parseInt(versionCodeMatch[1], 10) + 1;

    return replaceRequired(
      content.replace(/versionCode\s+\d+/, `versionCode ${nextVersionCode}`),
      /versionName\s+"[^"]+"/,
      `versionName "${version}"`,
      'versionName do Android'
    );
  });
}

function updateLegacyApkUrl(updateInfo, version) {
  updateInfo.apkUrl = `https://github.com/WSPREDADOR/controle-financeiro/releases/download/v${version}/app-release.apk`;
}

/**
 * Dispara o purge dos arquivos de update no CDN jsDelivr.
 * Sem isso, o celular pode levar vários minutos para ver a nova versão.
 */
async function purgeJsDelivrCache() {
  const filesToPurge = [
    'WSPREDADOR/controle-financeiro@main/update/web-manifest.json',
    'WSPREDADOR/controle-financeiro@main/update/web-bundle.json',
    'WSPREDADOR/controle-financeiro@main/update/app-release.apk',
  ];

  const results = await Promise.allSettled(
    filesToPurge.map((file) => new Promise((resolve, reject) => {
      const url = `https://purge.jsdelivr.net/gh/${file}`;
      const req = https.get(url, { timeout: 10000 }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const status = parsed?.status || res.statusCode;
            console.log(`  Purge ${status === 'finished' || res.statusCode === 200 ? 'OK' : 'enviado'}: ${file}`);
          } catch (_) {
            console.log(`  Purge enviado: ${file}`);
          }
          resolve();
        });
      });
      req.on('error', (err) => {
        console.log(`  Aviso: purge falhou para ${file} — ${err.message}`);
        resolve(); // não bloqueia o release
      });
      req.on('timeout', () => {
        console.log(`  Aviso: timeout no purge de ${file}`);
        req.destroy();
        resolve();
      });
    }))
  );

  return results;
}

async function main() {
  try {
    // 1. Ler e Incrementar Versão no package.json
    console.log('--- Iniciando processo de Release ---');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const oldVersion = packageJson.version;
    
    // Incrementa o último número (patch)
    const parts = oldVersion.split('.');
    parts[2] = parseInt(parts[2]) + 1;
    const newVersion = parts.join('.');
    
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    updatePackageLockVersion(newVersion);
    console.log(`Versão atualizada: ${oldVersion} -> ${newVersion}`);

    // 2. Atualizar todos os arquivos com a nova versão
    updateTextFile(updateConfigPath, (content) => replaceRequired(
      content,
      /currentVersion: '[^']+'/,
      `currentVersion: '${newVersion}'`,
      'update-config.js'
    ));
    updateTextFile(scriptPath, (content) => replaceRequired(
      content,
      /(const defaultUpdateConfig = \{\r?\n\s*currentVersion: )'[^']+'/,
      `$1'${newVersion}'`,
      'defaultUpdateConfig em script.js'
    ));
    updateTextFile(webRuntimePath, (content) => replaceRequired(
      content,
      /bundledVersion = '[^']+'/,
      `bundledVersion = '${newVersion}'`,
      'web-runtime.js'
    ));
    updateTextFile(indexPath, (content) => replaceRequired(
      content,
      /id="appVersionLabel">v[^<]+</,
      `id="appVersionLabel">v${newVersion}<`,
      'versao exibida no index.html'
    ));
    updateTextFile(splashPath, (content) => replaceRequired(
      content,
      /Versao [0-9]+\.[0-9]+\.[0-9]+/,
      `Versao ${newVersion}`,
      'versao exibida no splash.html'
    ));
    updateAndroidVersion(newVersion);
    console.log('Arquivos de versao atualizados.');

    // 3. Atualizar update/update.json
    const updateInfo = JSON.parse(fs.readFileSync(updateInfoPath, 'utf8'));
    updateInfo.version = newVersion;
    updateLegacyApkUrl(updateInfo, newVersion);
    updateInfo.publishedAt = new Date().toISOString().split('T')[0];
    fs.writeFileSync(updateInfoPath, JSON.stringify(updateInfo, null, 2) + '\n');
    console.log('update/update.json atualizado.');

    // 4. Gerar o Bundle Web
    console.log('Gerando bundle web...');
    execSync('node scripts/generate-web-bundle.js', { stdio: 'inherit' });

    // 5. Sincronizar com a pasta 'mobile-web' (exigida pelo Capacitor)
    console.log('Sincronizando arquivos com mobile-web...');
    if (!fs.existsSync(path.join(projectRoot, 'mobile-web'))) {
      fs.mkdirSync(path.join(projectRoot, 'mobile-web'));
    }
    const filesToCopy = [
      'index.html', 'script.js', 'style.css', 'web-runtime.js', 
      'update-config.js', 'manifest.webmanifest', 'Controle Financeiro.png'
    ];
    for (const file of filesToCopy) {
      fs.copyFileSync(path.join(projectRoot, file), path.join(projectRoot, 'mobile-web', file));
    }
    // Copiar pasta assets
    const srcAssets = path.join(projectRoot, 'assets');
    const destAssets = path.join(projectRoot, 'mobile-web', 'assets');
    if (fs.existsSync(srcAssets)) {
      if (!fs.existsSync(destAssets)) fs.mkdirSync(destAssets, { recursive: true });
      const assets = fs.readdirSync(srcAssets, { recursive: true });
      // Para simplificar, usamos comando do sistema para cópia recursiva
      execSync(`xcopy "${srcAssets}" "${destAssets}" /E /I /Y`, { stdio: 'ignore' });
    }
    
    console.log('Sincronizando Capacitor...');
    execSync('npx cap sync android', { stdio: 'inherit' });

    // 6. Git Add, Commit e Push
    console.log('Subindo para o GitHub...');
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Release v${newVersion}"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });

    // 6. Purge do CDN jsDelivr — garante que o botão apareça imediatamente no celular
    console.log('Limpando cache do CDN (jsDelivr) para entrega imediata...');
    await purgeJsDelivrCache();

    console.log(`\n--- SUCESSO: Versão ${newVersion} lançada! ---`);
    console.log('O botão de atualizar deve aparecer no celular em instantes.');
  } catch (error) {
    console.error('\nErro durante o release:', error.message);
    process.exit(1);
  }
}

main();
