create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.support_devices (
  id uuid primary key default gen_random_uuid(),
  support_id text not null unique,
  device_token_hash text not null,
  user_name text,
  device_name text,
  device_model text,
  platform text,
  app_version text,
  license_status text not null default 'free' check (license_status in ('free', 'trial', 'premium', 'blocked')),
  remote_message text,
  admin_note text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_commands (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.support_devices(id) on delete cascade,
  command_type text not null check (command_type in ('show_message', 'force_update')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  result text,
  created_by uuid default auth.uid(),
  seen_at timestamptz,
  executed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists support_devices_last_seen_idx on public.support_devices (last_seen_at desc);
create index if not exists support_devices_support_id_idx on public.support_devices (support_id);
create index if not exists support_commands_device_status_idx on public.support_commands (device_id, status, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists support_devices_touch_updated_at on public.support_devices;
create trigger support_devices_touch_updated_at
before update on public.support_devices
for each row execute function public.touch_updated_at();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.app_check_in(
  p_support_id text,
  p_device_token text,
  p_user_name text,
  p_device_name text,
  p_device_model text,
  p_platform text,
  p_app_version text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  token_hash text;
  device_record public.support_devices%rowtype;
  command_items jsonb;
begin
  if coalesce(trim(p_support_id), '') = '' or coalesce(trim(p_device_token), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'missing_identity');
  end if;

  token_hash = encode(extensions.digest(p_device_token, 'sha256'), 'hex');

  select *
    into device_record
    from public.support_devices
    where support_id = trim(p_support_id);

  if not found then
    insert into public.support_devices (
      support_id,
      device_token_hash,
      user_name,
      device_name,
      device_model,
      platform,
      app_version,
      last_seen_at
    )
    values (
      trim(p_support_id),
      token_hash,
      nullif(trim(p_user_name), ''),
      nullif(trim(p_device_name), ''),
      nullif(trim(p_device_model), ''),
      nullif(trim(p_platform), ''),
      nullif(trim(p_app_version), ''),
      now()
    )
    returning * into device_record;
  elsif device_record.device_token_hash <> token_hash then
    return jsonb_build_object('ok', false, 'error', 'device_token_mismatch');
  else
    update public.support_devices
      set user_name = nullif(trim(p_user_name), ''),
          device_name = nullif(trim(p_device_name), ''),
          device_model = nullif(trim(p_device_model), ''),
          platform = nullif(trim(p_platform), ''),
          app_version = nullif(trim(p_app_version), ''),
          last_seen_at = now()
      where id = device_record.id
      returning * into device_record;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'command_type', command_type,
        'payload', payload,
        'created_at', created_at
      )
      order by created_at asc
    ),
    '[]'::jsonb
  )
    into command_items
    from public.support_commands
    where device_id = device_record.id
      and status = 'pending';

  update public.support_commands
    set seen_at = coalesce(seen_at, now())
    where device_id = device_record.id
      and status = 'pending';

  return jsonb_build_object(
    'ok', true,
    'device', jsonb_build_object(
      'support_id', device_record.support_id,
      'license_status', device_record.license_status,
      'remote_message', device_record.remote_message,
      'last_seen_at', device_record.last_seen_at
    ),
    'commands', command_items
  );
end;
$$;

create or replace function public.app_ack_command(
  p_support_id text,
  p_device_token text,
  p_command_id uuid,
  p_status text,
  p_result text default null
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

  update public.support_commands
    set status = case when p_status = 'failed' then 'failed' else 'done' end,
        result = p_result,
        executed_at = now()
    where id = p_command_id
      and device_id = device_record.id;

  return jsonb_build_object('ok', true);
end;
$$;

alter table public.admin_users enable row level security;
alter table public.support_devices enable row level security;
alter table public.support_commands enable row level security;

drop policy if exists admin_users_manage on public.admin_users;
create policy admin_users_manage
on public.admin_users
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists support_devices_admin_manage on public.support_devices;
create policy support_devices_admin_manage
on public.support_devices
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists support_commands_admin_manage on public.support_commands;
create policy support_commands_admin_manage
on public.support_commands
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

revoke all on public.support_devices from anon;
revoke all on public.support_commands from anon;
grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.support_devices to authenticated;
grant select, insert, update, delete on public.support_commands to authenticated;
grant execute on function public.app_check_in(text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.app_ack_command(text, text, uuid, text, text) to anon, authenticated;
