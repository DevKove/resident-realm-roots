-- Remove unnecessary anonymous API privileges from the profile table.
-- RLS remains the row-level boundary; this also removes broad column grants
-- that should never be available to the anon database role.
revoke all privileges on table public.profiles from anon;

do $$
declare
  v_column record;
  v_privilege text;
begin
  for v_column in
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
  loop
    foreach v_privilege in array array['SELECT', 'INSERT', 'UPDATE', 'REFERENCES']
    loop
      execute format(
        'revoke %s (%I) on table public.profiles from anon',
        v_privilege,
        v_column.column_name
      );
    end loop;
  end loop;
end
$$;
