# Data Safety - Respostas sugeridas

Use este guia para preencher o formulário "Segurança dos dados" no Play Console. Revise antes de enviar, porque a declaração final precisa refletir exatamente a versão publicada.

## Coleta de dados
Marque que o app coleta dados.

## Dados coletados
- Informações pessoais: nome informado no app, usado para identificação no suporte.
- Mensagens: mensagens de texto e imagens enviadas voluntariamente no chat de suporte.
- Informações e IDs do dispositivo: ID de suporte gerado pelo app, token técnico do dispositivo armazenado por hash no banco, nome/modelo/plataforma do dispositivo, versão do app e informações técnicas básicas.

## Dados que não são enviados
- Compromissos financeiros cadastrados.
- Valores de dívidas, contas, parcelas e saldos.
- Histórico local de pagamentos.

## Finalidades
- Funcionalidade do app: suporte remoto, avisos importantes, liberação premium e respostas do atendimento.
- Gerenciamento da conta/app: identificação do dispositivo e status de licença/suporte.
- Segurança e prevenção de abuso: validação técnica do dispositivo de suporte.

## Compartilhamento
Declare compartilhamento apenas se considerar Supabase/WhatsApp/e-mail/Telegram/SMS como terceiros no fluxo escolhido pelo usuário. Para o suporte remoto, informe que os dados são processados pelo Supabase como provedor de infraestrutura.

## Criptografia em trânsito
Sim. As comunicações remotas usam HTTPS.

## Exclusão de dados
Sim. O app possui botão "Excluir dados do suporte" em Configurações > Suporte e a política de privacidade informa contato para exclusão.

## Conta de usuário
O app não cria login/senha para o usuário final. Ele gera um ID de suporte local. Se no Play Console a pergunta considerar esse ID como conta, informe o mecanismo de solicitação de exclusão dentro e fora do app.

## Anúncios
Não declare anúncios, a menos que você adicione SDK de anúncios no futuro.

## Permissões usadas
- INTERNET: suporte remoto e links externos escolhidos pelo usuário.
- POST_NOTIFICATIONS: lembretes de pagamento e respostas do suporte.
- RECEIVE_BOOT_COMPLETED: reagendar lembretes/sincronização de suporte após reiniciar o aparelho.
