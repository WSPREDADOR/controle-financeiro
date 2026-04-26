## Atualizacao Pelo GitHub

O app continua funcionando offline normalmente. Quando houver internet, ele consulta `update/web-manifest.json` no GitHub para verificar se existe uma versao web nova e aplica `update/web-bundle.json` sem reinstalar o APK.

### Fluxo recomendado

1. Rode `npm run release` para incrementar a versao, atualizar os metadados e gerar o bundle web.
2. Confirme que `update/web-bundle.json` ficou pequeno. Ele deve referenciar assets ja empacotados, nao embutir imagens grandes em base64.
3. Publique o commit no GitHub. O app vai buscar o manifesto e aplicar o bundle quando o usuario tocar em atualizar.

### APK nativo

Quando precisar distribuir um APK novo, rode `npm run mobile:sync` e gere o build Android. O `versionName` e o `versionCode` ficam em `android/app/build.gradle`.

O arquivo `update/update.json` fica apenas para compatibilidade com fluxos antigos de instalacao por APK. Se ele for usado, mantenha estes campos coerentes com a release:

- `version`
- `apkUrl`
- `notes`
- `publishedAt`
