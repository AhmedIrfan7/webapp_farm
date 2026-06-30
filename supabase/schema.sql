-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  phone       text,
  address     text,
  city        text,
  role        text not null default 'customer'
                   check (role in ('admin', 'customer', 'farm')),
  business_name text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role, business_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'business_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS policies for profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update all profiles"
  on profiles for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  description    text,
  price          numeric(10,2) not null check (price >= 0),
  unit           text not null,
  category       text not null check (category in ('milk', 'dairy')),
  image_url      text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_available   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view available products"
  on products for select using (is_available = true);

create policy "Admins can manage products"
  on products for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger products_updated_at before update on products
  for each row execute procedure set_updated_at();

-- ─── SILAGE PRODUCTS ─────────────────────────────────────────────────────────
create table if not exists public.silage_products (
  id                 uuid primary key default uuid_generate_v4(),
  name               text not null,
  type               text not null,
  description        text,
  price_per_ton      numeric(10,2) not null check (price_per_ton >= 0),
  available_quantity numeric(10,2),
  minimum_order      numeric(10,2) not null default 1,
  unit               text not null default 'ton',
  image_url          text,
  is_available       boolean not null default true,
  created_at         timestamptz not null default now()
);

alter table public.silage_products enable row level security;

create policy "Anyone can view available silage products"
  on silage_products for select using (is_available = true);

create policy "Admins can manage silage products"
  on silage_products for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.profiles(id) on delete set null,
  status           text not null default 'pending'
                        check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  total_amount     numeric(10,2) not null check (total_amount >= 0),
  delivery_address text,
  delivery_city    text,
  payment_method   text not null default 'cod'
                        check (payment_method in ('cod','bank_transfer','online')),
  payment_status   text not null default 'pending'
                        check (payment_status in ('pending','paid','failed','refunded')),
  notes            text,
  estimated_delivery date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Users can create orders"
  on orders for insert with check (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on orders for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger orders_updated_at before update on orders
  for each row execute procedure set_updated_at();

-- ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id                 uuid primary key default uuid_generate_v4(),
  order_id           uuid references public.orders(id) on delete cascade not null,
  product_id         uuid references public.products(id) on delete set null,
  quantity           integer not null check (quantity > 0),
  price_at_purchase  numeric(10,2) not null check (price_at_purchase >= 0),
  created_at         timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on order_items for select
  using (exists (select 1 from orders where id = order_id and user_id = auth.uid()));

create policy "Users can insert own order items"
  on order_items for insert
  with check (exists (select 1 from orders where id = order_id and user_id = auth.uid()));

create policy "Admins can manage all order items"
  on order_items for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ─── SILAGE ORDERS ───────────────────────────────────────────────────────────
create table if not exists public.silage_orders (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references public.profiles(id) on delete set null,
  farm_name               text not null,
  contact_person          text not null,
  email                   text not null,
  phone                   text not null,
  product_id              uuid references public.silage_products(id) on delete set null,
  quantity_tons           numeric(10,2) not null check (quantity_tons > 0),
  delivery_address        text,
  requested_delivery_date date,
  status                  text not null default 'inquiry'
                               check (status in ('inquiry','quoted','confirmed','processing','delivered','cancelled')),
  quote_amount            numeric(10,2),
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.silage_orders enable row level security;

create policy "Users can view own silage orders"
  on silage_orders for select using (auth.uid() = user_id);

create policy "Authenticated users can create silage orders"
  on silage_orders for insert with check (auth.uid() = user_id);

create policy "Anyone can submit silage inquiry"
  on silage_orders for insert with check (user_id is null);

create policy "Admins can manage all silage orders"
  on silage_orders for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create trigger silage_orders_updated_at before update on silage_orders
  for each row execute procedure set_updated_at();

-- ─── CART ITEMS ──────────────────────────────────────────────────────────────
create table if not exists public.cart_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity   integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "Users can manage own cart"
  on cart_items for all using (auth.uid() = user_id);

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id              uuid primary key default uuid_generate_v4(),
  customer_name   text not null,
  customer_image  text,
  content         text not null,
  rating          integer check (rating between 1 and 5) default 5,
  is_visible      boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Anyone can view visible testimonials"
  on testimonials for select using (is_visible = true);

create policy "Admins can manage testimonials"
  on testimonials for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ─── SEED: Default Admin ─────────────────────────────────────────────────────
-- NOTE: Create the admin user via Supabase Auth dashboard first,
-- then run this to set role:
-- update public.profiles set role = 'admin' where id = '<admin-user-uuid>';

-- ─── SEED: Sample Products ───────────────────────────────────────────────────
insert into public.products (name, description, price, unit, category, stock_quantity) values
  ('Fresh Full Cream Milk', 'Pure, pasteurized full-cream milk from our free-range cows. Rich in calcium and vitamins.', 120, 'liter', 'milk', 500),
  ('Skimmed Milk', 'Low-fat skimmed milk, perfect for health-conscious customers. Same great freshness.', 100, 'liter', 'milk', 300),
  ('Fresh Cream', 'Thick, rich dairy cream. Perfect for cooking and desserts.', 250, '500ml', 'dairy', 150),
  ('Natural Butter', 'Churned from fresh cream, our butter is rich and flavourful. No additives.', 350, '500g', 'dairy', 200),
  ('Greek Yogurt', 'Thick, creamy Greek-style yogurt. High in protein and probiotics.', 180, '500g', 'dairy', 250),
  ('Fresh Paneer', 'Soft, fresh cottage cheese made daily. Ideal for cooking.', 280, '400g', 'dairy', 100)
on conflict do nothing;

insert into public.silage_products (name, type, description, price_per_ton, available_quantity, minimum_order) values
  ('Premium Corn Silage', 'corn', 'High-energy corn silage with optimal moisture content (65-70%). Excellent for dairy and beef cattle. Improves milk production significantly.', 8500, 500, 1),
  ('Green Grass Silage', 'grass', 'Nutritious grass silage rich in protein and fibre. Made from fresh-cut ryegrass at peak nutritional value.', 6500, 300, 1),
  ('Alfalfa Silage', 'alfalfa', 'Premium alfalfa silage with high protein content (18-22%). Excellent supplement for high-producing dairy cows.', 9500, 200, 0.5),
  ('Mixed Crop Silage', 'mixed', 'Balanced mix of corn, grass, and legumes. Cost-effective option with excellent nutritional profile for all livestock.', 7000, 400, 1)
on conflict do nothing;

insert into public.testimonials (customer_name, content, rating) values
  ('Ayesha Khan, Lahore', 'The milk is incredibly fresh and pure. My family has been using GreenMeadow for over a year and we noticed a huge difference in quality!', 5),
  ('Muhammad Tariq, Faisalabad', 'Best dairy products I''ve ever had. The delivery is always on time and the quality is consistently excellent.', 5),
  ('Sara Malik, Islamabad', 'We switched to GreenMeadow for our restaurant and our customers immediately noticed the difference in taste.', 5),
  ('Ahmed Dairy Farm, Gujranwala', 'GreenMeadow''s corn silage has significantly improved our herd''s milk production. Excellent quality!', 5)
on conflict do nothing;
