# Checklist de publicação

## Pronto no projeto
- Android App Bundle de release gerado em `android/app/build/outputs/bundle/release/app-release.aab`.
- `targetSdkVersion` e `compileSdkVersion` em 35.
- `versionCode` 137 e `versionName` 2.4.9.
- Permissões enxutas: Internet, notificações e boot completed.
- `allowBackup="false"` no AndroidManifest.
- Fluxo de atualização por APK externo desligado por padrão.
- Política de privacidade adicionada ao app em `privacy-policy.html`.
- Botão para solicitar exclusão dos dados de suporte.

## Fazer no Play Console
- Criar app com pacote `com.werbertsilva.controlefinanceiro.mobile`.
- Subir o arquivo `.aab` de release.
- Hospedar `privacy-policy.html` em URL pública e preencher o campo de política de privacidade.
- Preencher Data Safety usando `play-store/data-safety.md`.
- Preencher classificação indicativa.
- Informar que o app não contém anúncios, se continuar sem SDK de anúncios.
- Informar público-alvo como não direcionado a crianças.
- Adicionar descrição, categoria e textos de `play-store/listagem.md`.
- Enviar screenshots reais do app.
- Enviar ícone 512x512 e feature graphic 1024x500 em `play-store/assets`.

## Conta pessoal nova
Se sua conta de desenvolvedor pessoal foi criada depois de 13/11/2023, rode teste fechado com pelo menos 12 testadores opt-in por 14 dias contínuos antes de solicitar produção.

## Atenção
Não reative instalação ou download de APK fora da Play na versão publicada pela Play Store.
