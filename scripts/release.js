const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const packagePath = path.join(projectRoot, 'package.json');
const updateConfigPath = path.join(projectRoot, 'update-config.js');
const updateInfoPath = path.join(projectRoot, 'update', 'update.json');

function main() {
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
    console.log(`Versão atualizada: ${oldVersion} -> ${newVersion}`);

    // 2. Atualizar update-config.js
    let updateConfig = fs.readFileSync(updateConfigPath, 'utf8');
    updateConfig = updateConfig.replace(/currentVersion: '.*'/, `currentVersion: '${newVersion}'`);
    fs.writeFileSync(updateConfigPath, updateConfig);
    console.log('update-config.js atualizado.');

    // 3. Atualizar update/update.json
    const updateInfo = JSON.parse(fs.readFileSync(updateInfoPath, 'utf8'));
    updateInfo.version = newVersion;
    updateInfo.publishedAt = new Date().toISOString().split('T')[0];
    fs.writeFileSync(updateInfoPath, JSON.stringify(updateInfo, null, 2) + '\n');
    console.log('update/update.json atualizado.');

    // 4. Gerar o Bundle Web
    console.log('Gerando bundle web...');
    execSync('node scripts/generate-web-bundle.js', { stdio: 'inherit' });

    // 5. Git Add, Commit e Push
    console.log('Subindo para o GitHub...');
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Release v${newVersion}"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });

    console.log(`\n--- SUCESSO: Versão ${newVersion} lançada! ---`);
  } catch (error) {
    console.error('\nErro durante o release:', error.message);
    process.exit(1);
  }
}

main();
