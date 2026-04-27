## Atualizacao Pelo GitHub

O app continua funcionando offline normalmente. Quando houver internet, ele consulta `update/web-manifest.json` no GitHub para verificar se existe uma versao web nova e aplica `update/web-bundle.json` sem reinstalar o APK.

### Fluxo recomendado

Use sempre o mesmo comando, tanto no VS Code quanto no Antigravity:

```bash
npm run release
```

Esse comando incrementa o patch, atualiza todos os metadados, gera o bundle web, sincroniza o Capacitor, compila o APK Android assinado, copia para `update/app-release.apk`, cria/atualiza a release do GitHub e valida baixando o APK remoto da internet.

Atalhos:

```bash
npm run release:patch
npm run release:minor
npm run release:major
npm run release -- 1.6.0
npm run release -- 1.6.0 --notes "Resumo da atualizacao"
```

Regra importante: o `apkUrl` publicado no manifesto sempre deve apontar para a release versionada do GitHub, por exemplo:

```text
https://github.com/WSPREDADOR/controle-financeiro/releases/download/v1.5.0/app-release.apk
```

Nao use `cdn.jsdelivr.net/.../update/app-release.apk` para APK nativo. O CDN pode manter binario antigo e fazer o celular instalar a versao errada.

### APK nativo

Quando precisar distribuir um APK novo, rode `npm run release`. O `versionName` e o `versionCode` ficam em `android/app/build.gradle`, mas o script atualiza os dois automaticamente.

O arquivo `update/update.json` fica apenas para compatibilidade com fluxos antigos de instalacao por APK. Se ele for usado, mantenha estes campos coerentes com a release:

- `version`
- `apkUrl`
- `notes`
- `publishedAt`
