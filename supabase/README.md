# Supabase Admin

## 1. Criar banco

No Supabase, abra **SQL Editor** e execute `supabase/schema.sql`.

## 2. Criar seu login admin

Crie um usuario em **Authentication > Users** com seu e-mail e senha.

Depois rode no SQL Editor:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'SEU_EMAIL_AQUI';
```

## 3. Configurar o app

Edite `support-config.js`:

```js
window.CF_SUPPORT_CONFIG = {
  enabled: true,
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  supabaseAnonKey: 'SUA_SUPABASE_ANON_KEY',
  checkInIntervalMs: 120000,
  requestTimeoutMs: 8000
};
```

## 4. Configurar o painel admin

Edite `admin/supabase-config.js` com a mesma URL e anon key.

Abra `admin/admin.html` no navegador e entre com o usuario criado no Supabase.

## Observacoes

- O app continua offline-first.
- O check-in so acontece quando `support-config.js` estiver com `enabled: true`.
- O app envia nome informado no onboarding, ID de suporte, versao, plataforma e informacoes basicas do dispositivo.
- Dados financeiros do usuario nao sao enviados.
