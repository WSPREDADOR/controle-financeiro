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
set search_path = public, extensions
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
