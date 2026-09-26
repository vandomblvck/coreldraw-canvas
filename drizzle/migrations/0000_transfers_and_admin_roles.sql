create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  mtcn text not null unique,
  sender_first_name text not null,
  sender_last_name text not null default '',
  sender_phone text not null default '',
  receiver_first_name text not null default '',
  receiver_last_name text not null default '',
  receiver_country text not null default 'United States',
  send_amount numeric(12,2) not null default 0,
  send_currency text not null default 'USD',
  receive_amount numeric(12,2),
  receive_currency text,
  status text not null default 'In progress',
  status_detail text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.transfers to authenticated;
grant all on public.transfers to service_role;
alter table public.transfers enable row level security;

create policy "Admins can manage transfers"
on public.transfers for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create sequence public.mtcn_seq start 1000000000;

create or replace function public.generate_mtcn()
returns trigger
language plpgsql
as $$
begin
  if new.mtcn is null or new.mtcn = '' then
    new.mtcn := lpad((nextval('public.mtcn_seq') % 10000000000)::text, 10, '0');
  end if;
  new.updated_at := now();
  return new;
end
$$;

create trigger set_mtcn
before insert on public.transfers
for each row execute function public.generate_mtcn();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger touch_transfers_updated_at
before update on public.transfers
for each row execute function public.touch_updated_at();