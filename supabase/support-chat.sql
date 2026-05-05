alter table public.support_devices
  add column if not exists user_typing_at timestamptz,
  add column if not exists admin_typing_at timestamptz,
  add column if not exists admin_last_seen_at timestamptz;

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.support_devices(id) on delete cascade,
  sender text not null check (sender in ('user', 'admin')),
  message text not null check (char_length(trim(message)) > 0 and char_length(message) <= 1200),
  message_type text not null default 'text' check (message_type in ('text', 'image')),
  image_data_url text,
  image_mime text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.support_messages
  add column if not exists message_type text not null default 'text' check (message_type in ('text', 'image')),
  add column if not exists image_data_url text,
  add column if not exists image_mime text;

create index if not exists support_messages_device_created_idx on public.support_messages (device_id, created_at desc);
create index if not exists support_messages_unread_idx on public.support_messages (device_id, sender, read_at);

alter table public.support_messages enable row level security;

drop policy if exists support_messages_admin_manage on public.support_messages;
create policy support_messages_admin_manage
on public.support_messages
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

grant select, insert, update, delete on public.support_messages to authenticated;
revoke all on public.support_messages from anon;

drop function if exists public.app_list_support_messages(text, text);

create or replace function public.app_list_support_messages(
  p_support_id text,
  p_device_token text,
  p_mark_read boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  token_hash text;
  device_record public.support_devices%rowtype;
  message_items jsonb;
begin
  token_hash = encode(extensions.digest(p_device_token, 'sha256'), 'hex');

  select *
    into device_record
    from public.support_devices
    where support_id = trim(p_support_id)
      and device_token_hash = token_hash;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'device_not_found');
  end if;

  update public.support_devices
    set last_seen_at = now()
    where id = device_record.id
    returning * into device_record;

  if coalesce(p_mark_read, true) then
    update public.support_messages
      set read_at = coalesce(read_at, now())
      where device_id = device_record.id
        and sender = 'admin'
        and read_at is null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'sender', sender,
        'message', message,
        'message_type', message_type,
        'image_data_url', image_data_url,
        'image_mime', image_mime,
        'read_at', read_at,
        'created_at', created_at
      )
      order by created_at asc
    ),
    '[]'::jsonb
  )
    into message_items
    from (
      select *
      from public.support_messages
      where device_id = device_record.id
      order by created_at desc
      limit 80
    ) recent_messages;

  return jsonb_build_object(
    'ok', true,
    'device', jsonb_build_object(
      'license_status', device_record.license_status,
      'remote_message', device_record.remote_message,
      'admin_online', device_record.admin_last_seen_at is not null and device_record.admin_last_seen_at > now() - interval '3 minutes',
      'admin_typing', device_record.admin_typing_at is not null and device_record.admin_typing_at > now() - interval '8 seconds',
      'admin_last_seen_at', device_record.admin_last_seen_at
    ),
    'messages', message_items
  );
end;
$$;

create or replace function public.app_send_support_message(
  p_support_id text,
  p_device_token text,
  p_message text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  token_hash text;
  device_record public.support_devices%rowtype;
  message_record public.support_messages%rowtype;
begin
  if coalesce(trim(p_message), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'empty_message');
  end if;

  token_hash = encode(extensions.digest(p_device_token, 'sha256'), 'hex');

  select *
    into device_record
    from public.support_devices
    where support_id = trim(p_support_id)
      and device_token_hash = token_hash;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'device_not_found');
  end if;

  insert into public.support_messages (device_id, sender, message)
  values (device_record.id, 'user', left(trim(p_message), 1200))
  returning * into message_record;

  update public.support_devices
    set last_seen_at = now(),
        user_typing_at = null
    where id = device_record.id;

  return jsonb_build_object(
    'ok', true,
    'message', jsonb_build_object(
      'id', message_record.id,
      'sender', message_record.sender,
      'message', message_record.message,
      'created_at', message_record.created_at
    )
  );
end;
$$;

create or replace function public.app_send_support_image(
  p_support_id text,
  p_device_token text,
  p_caption text,
  p_image_data_url text,
  p_image_mime text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  token_hash text;
  device_record public.support_devices%rowtype;
  message_record public.support_messages%rowtype;
  safe_caption text;
begin
  if coalesce(trim(p_image_data_url), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'empty_image');
  end if;

  if char_length(p_image_data_url) > 1800000 then
    return jsonb_build_object('ok', false, 'error', 'image_too_large');
  end if;

  if p_image_mime not in ('image/jpeg', 'image/png', 'image/webp') then
    return jsonb_build_object('ok', false, 'error', 'unsupported_image_type');
  end if;

  if position('data:' || p_image_mime || ';base64,' in p_image_data_url) <> 1 then
    return jsonb_build_object('ok', false, 'error', 'invalid_image_payload');
  end if;

  token_hash = encode(extensions.digest(p_device_token, 'sha256'), 'hex');

  select *
    into device_record
    from public.support_devices
    where support_id = trim(p_support_id)
      and device_token_hash = token_hash;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'device_not_found');
  end if;

  safe_caption = nullif(trim(coalesce(p_caption, '')), '');

  insert into public.support_messages (
    device_id,
    sender,
    message,
    message_type,
    image_data_url,
    image_mime
  )
  values (
    device_record.id,
    'user',
    left(coalesce(safe_caption, 'Imagem enviada'), 1200),
    'image',
    p_image_data_url,
    p_image_mime
  )
  returning * into message_record;

  update public.support_devices
    set last_seen_at = now(),
        user_typing_at = null
    where id = device_record.id;

  return jsonb_build_object(
    'ok', true,
    'message', jsonb_build_object(
      'id', message_record.id,
      'sender', message_record.sender,
      'message', message_record.message,
      'message_type', message_record.message_type,
      'image_data_url', message_record.image_data_url,
      'image_mime', message_record.image_mime,
      'created_at', message_record.created_at
    )
  );
end;
$$;

create or replace function public.app_set_support_typing(
  p_support_id text,
  p_device_token text,
  p_is_typing boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  token_hash text;
  device_record public.support_devices%rowtype;
begin
  token_hash = encode(extensions.digest(p_device_token, 'sha256'), 'hex');

  select *
    into device_record
    from public.support_devices
    where support_id = trim(p_support_id)
      and device_token_hash = token_hash;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'device_not_found');
  end if;

  update public.support_devices
    set user_typing_at = case when p_is_typing then now() else null end,
        last_seen_at = now()
    where id = device_record.id;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.app_list_support_messages(text, text, boolean) to anon, authenticated;
grant execute on function public.app_send_support_message(text, text, text) to anon, authenticated;
grant execute on function public.app_send_support_image(text, text, text, text, text) to anon, authenticated;
grant execute on function public.app_set_support_typing(text, text, boolean) to anon, authenticated;
