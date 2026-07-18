begin;

create or replace function public.set_profile_onboarding(
  p_display_name text,
  p_bio text,
  p_school_name text,
  p_date_of_birth date,
  p_gender text,
  p_photo_url text,
  p_lat double precision,
  p_lng double precision
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required'
      using errcode = '28000';
  end if;

  if p_lat < -90 or p_lat > 90 or p_lng < -180 or p_lng > 180 then
    raise exception 'Invalid coordinates'
      using errcode = '22023';
  end if;

  update public.profiles
  set
    display_name = p_display_name,
    bio = p_bio,
    school_name = p_school_name,
    date_of_birth = p_date_of_birth,
    gender = p_gender,
    profile_photo_url = nullif(p_photo_url, ''),
    general_coordinate = extensions.st_setsrid(
      extensions.st_makepoint(p_lng, p_lat),
      4326
    )::extensions.geography,
    is_onboarded = true,
    updated_at = pg_catalog.now()
  where id = auth.uid();

  if not found then
    raise exception 'Profile not found'
      using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.set_profile_onboarding(
  text,
  text,
  text,
  date,
  text,
  text,
  double precision,
  double precision
) from public;

revoke all on function public.set_profile_onboarding(
  text,
  text,
  text,
  date,
  text,
  text,
  double precision,
  double precision
) from anon;

grant execute on function public.set_profile_onboarding(
  text,
  text,
  text,
  date,
  text,
  text,
  double precision,
  double precision
) to authenticated;

grant update (
  display_name,
  bio,
  school_name,
  date_of_birth,
  gender,
  profile_photo_url,
  general_coordinate,
  is_onboarded,
  updated_at
) on public.profiles to authenticated;

commit;
