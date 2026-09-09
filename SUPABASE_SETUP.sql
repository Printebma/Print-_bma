-- PRINTÊ Manager: banco Supabase
create table if not exists public.printe_products (
  id bigint primary key, name text not null, peso numeric not null default 0,
  tempo numeric not null default 0, acab numeric not null default 0,
  acc numeric not null default 0, estoque numeric not null default 0,
  sku text default '', obs text default ''
);
create table if not exists public.printe_stores (
  id bigint primary key, name text not null, contact text default '', obs text default ''
);
create table if not exists public.printe_sales (
  id bigint primary key, date text, name text, pid bigint, q numeric,
  total numeric, lucro numeric, type text, store bigint
);
create table if not exists public.printe_stock_movements (
  id bigint primary key, date text, pid bigint, type text, q numeric, reason text
);

-- Para uma primeira configuração simples do app, habilite acesso à API:
alter table public.printe_products enable row level security;
alter table public.printe_stores enable row level security;
alter table public.printe_sales enable row level security;
alter table public.printe_stock_movements enable row level security;

create policy "public read products" on public.printe_products for select using (true);
create policy "public insert products" on public.printe_products for insert with check (true);
create policy "public update products" on public.printe_products for update using (true) with check (true);

create policy "public read stores" on public.printe_stores for select using (true);
create policy "public insert stores" on public.printe_stores for insert with check (true);
create policy "public update stores" on public.printe_stores for update using (true) with check (true);

create policy "public read sales" on public.printe_sales for select using (true);
create policy "public insert sales" on public.printe_sales for insert with check (true);
create policy "public update sales" on public.printe_sales for update using (true) with check (true);

create policy "public read movements" on public.printe_stock_movements for select using (true);
create policy "public insert movements" on public.printe_stock_movements for insert with check (true);
create policy "public update movements" on public.printe_stock_movements for update using (true) with check (true);
