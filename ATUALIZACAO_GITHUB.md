## Atualizacao Pelo GitHub

O app continua funcionando offline normalmente. Quando houver internet, ele consulta um arquivo JSON no GitHub para verificar se existe uma versao nova.

### 1. Ajuste a configuracao do app

Edite `update-config.js` e troque:

- `WSPREDADOR`
- `controle-financeiro`

### 2. Publique o arquivo de versao

Hospede `update/update.json` no seu repositório e atualize estes campos a cada nova versao:

- `version`
- `apkUrl`
- `notes`
- `publishedAt`

### 3. Publique o APK no GitHub Releases

Em cada nova versao:

1. Gere o novo `app-release.apk`
2. Crie uma release no GitHub com a tag, por exemplo `v1.3.1`
3. Envie o APK da release
4. Atualize o `update/update.json` com a nova versao e o novo link

### Exemplo de fluxo

- APK: `https://github.com/SEU-USUARIO/SEU-REPOSITORIO/releases/download/v1.3.1/app-release.apk`
- JSON: `https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/update.json`
