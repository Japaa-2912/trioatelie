-- =============================================================================
-- Laço & Luz — Loja de lembrancinhas personalizadas
-- Migration inicial: estrutura, RLS, triggers, storage e conteúdo inicial.
-- Aplique no SQL Editor do Supabase ou com `supabase db push`.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'viewer');
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Funções auxiliares
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Verifica se o usuário autenticado é administrador.
-- SECURITY DEFINER evita recursão nas políticas da tabela profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Cria automaticamente um perfil (sem privilégios) para novos usuários.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text not null default 'gift'
    check (icon in ('gift', 'notebook', 'package', 'sparkles', 'heart', 'star', 'ribbon')),
  tone text not null default 'blush'
    check (tone in ('blush', 'sage', 'sky', 'peach', 'sand')),
  image_url text,
  image_path text,
  sort_order integer not null default 0,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint categories_name_not_blank check (length(btrim(name)) > 0),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists categories_active_order_idx
  on public.categories (is_active, sort_order, name);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  price numeric(10, 2) check (price is null or price >= 0),
  price_on_request boolean not null default false,
  is_customizable boolean not null default true,
  customization_notes text,
  dimensions text,
  materials text,
  production_time text,
  min_quantity integer not null default 1 check (min_quantity between 1 and 9999),
  main_image_url text,
  main_image_path text,
  main_image_alt text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint products_name_not_blank check (length(btrim(name)) > 0),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists products_active_idx on public.products (is_active);
create index if not exists products_featured_idx
  on public.products (is_featured, sort_order, created_at desc);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_name_lower_idx on public.products (lower(name));

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- product_images (galeria)
-- -----------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists product_images_product_idx
  on public.product_images (product_id, sort_order);

-- -----------------------------------------------------------------------------
-- store_settings (linha única)
-- -----------------------------------------------------------------------------
create table if not exists public.store_settings (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null default 'Laço & Luz',
  tagline text not null default 'Lembrancinhas personalizadas',
  logo_url text,
  logo_path text,
  whatsapp_number text,
  instagram_url text,
  email text,
  phone text,
  announcement_text text,
  hero_eyebrow text,
  hero_title text,
  hero_subtitle text,
  hero_primary_cta text,
  hero_secondary_cta text,
  hero_image_url text,
  hero_image_path text,
  hero_image_alt text,
  institutional_text text,
  footer_text text,
  privacy_text text,
  brand_color text not null default '#a9786c'
    check (brand_color ~ '^#[0-9a-fA-F]{6}$'),
  blush_color text not null default '#f2d9d4'
    check (blush_color ~ '^#[0-9a-fA-F]{6}$'),
  sage_color text not null default '#9fb09a'
    check (sage_color ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint store_settings_whatsapp_digits
    check (whatsapp_number is null or whatsapp_number ~ '^[0-9]{10,15}$')
);

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- homepage_sections (textos editáveis da home)
-- -----------------------------------------------------------------------------
create table if not exists public.homepage_sections (
  key text primary key,
  label text not null,
  eyebrow text,
  title text,
  body text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists homepage_sections_set_updated_at on public.homepage_sections;
create trigger homepage_sections_set_updated_at
before update on public.homepage_sections
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Conteúdo inicial (editável pelo painel)
-- -----------------------------------------------------------------------------
insert into public.store_settings (
  id, brand_name, tagline,
  announcement_text,
  hero_eyebrow, hero_title, hero_subtitle,
  hero_primary_cta, hero_secondary_cta,
  hero_image_alt,
  institutional_text, footer_text, privacy_text,
  brand_color, blush_color, sage_color
)
values (
  1,
  'Laço & Luz',
  'Lembrancinhas personalizadas',
  'Feito à mão • Personalização a combinar • Pedidos pelo WhatsApp',
  'Ateliê de lembrancinhas',
  'Pequenos detalhes que tornam grandes momentos inesquecíveis.',
  'Lembrancinhas personalizadas feitas com carinho para celebrar os momentos mais especiais.',
  'Explorar lembrancinhas',
  'Conversar no WhatsApp',
  'Composição delicada de caixas e cadernos personalizados',
  'Cada lembrancinha é preparada artesanalmente, com atenção aos detalhes e ao tema escolhido para a festa. As possibilidades de personalização são combinadas diretamente com a proprietária, para que o resultado seja exatamente o que você imaginou.',
  'Lembrancinhas artesanais para celebrar a infância com delicadeza.',
  'Esta loja utiliza seus dados apenas para apresentar o catálogo e encaminhar sua solicitação de orçamento ao WhatsApp da loja. Não realizamos pagamentos nem cobranças neste site.

Ao iniciar uma conversa pelo WhatsApp, você compartilha voluntariamente as informações que escrever na mensagem, como nome da criança, tema, data da festa e observações. Esses dados são usados exclusivamente para responder ao seu pedido e organizar a produção.

O carrinho fica salvo no seu próprio navegador para que você não perca os itens ao navegar. Não utilizamos ferramentas de publicidade ou rastreamento nesta versão da loja.

Para solicitar a exclusão de informações compartilhadas, entre em contato pelos canais oficiais da loja.',
  '#a9786c',
  '#f2d9d4',
  '#9fb09a'
)
on conflict (id) do nothing;

insert into public.homepage_sections (key, label, eyebrow, title, body, is_visible, sort_order)
values
  (
    'categories',
    'Categorias',
    'Explore o ateliê',
    'Escolha por categoria',
    'Caixas, cadernos e kits pensados para compor a mesa de doces e encantar os convidados.',
    true,
    10
  ),
  (
    'products',
    'Vitrine',
    'Feitos para celebrar',
    'Lembrancinhas para o seu tema',
    'Uma seleção de peças artesanais. Toque em um produto para ver os detalhes e combinar a personalização.',
    true,
    20
  ),
  (
    'customization',
    'Personalização',
    'Do seu jeitinho',
    'Personalização feita a quatro mãos',
    'Conte o tema da festa, o nome da criança e as cores que você ama. A disponibilidade de cada combinação é confirmada pela proprietária antes do fechamento do pedido.',
    true,
    30
  ),
  (
    'how_it_works',
    'Como funciona',
    'Simples e acolhedor',
    'Como funciona o pedido',
    'Escolha as peças, conte os detalhes e envie sua solicitação pelo WhatsApp. O pedido só é confirmado após o contato direto com a proprietária.',
    true,
    40
  ),
  (
    'cta',
    'Chamada final',
    'Vamos celebrar?',
    'Sua festa merece um detalhe feito com carinho',
    'Conte para a gente o tema, a data e a quantidade de lembrancinhas. Responderemos com disponibilidade, prazo e valor final.',
    true,
    50
  )
on conflict (key) do nothing;

insert into public.categories (name, slug, description, icon, tone, sort_order, is_featured, is_active)
values
  (
    'Caixas personalizadas',
    'caixas-personalizadas',
    'Caixinhas para doces e lembranças, personalizadas de acordo com o tema da festa.',
    'gift',
    'blush',
    10,
    true,
    true
  ),
  (
    'Cadernos personalizados',
    'cadernos-personalizados',
    'Caderninhos artesanais com capa personalizada para encantar os convidados.',
    'notebook',
    'sage',
    20,
    true,
    true
  ),
  (
    'Kits de lembrancinhas',
    'kits-de-lembrancinhas',
    'Combinações de peças para compor uma lembrança completa e cheia de personalidade.',
    'package',
    'sky',
    30,
    true,
    true
  ),
  (
    'Outros produtos',
    'outros-produtos',
    'Outros detalhes artesanais criados para deixar a celebração ainda mais especial.',
    'sparkles',
    'peach',
    40,
    true,
    true
  )
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.store_settings enable row level security;
alter table public.homepage_sections enable row level security;

-- profiles: cada usuário vê apenas o próprio perfil; admin gerencia todos.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles for delete
to authenticated
using (public.is_admin());

-- categories: leitura pública das ativas; admin gerencia tudo.
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
on public.categories for select
to anon, authenticated
using (is_active);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- products: leitura pública dos ativos; admin gerencia tudo.
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products for select
to anon, authenticated
using (is_active);

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- product_images: visíveis somente se o produto estiver ativo.
drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and p.is_active
  )
);

drop policy if exists "product_images_admin_all" on public.product_images;
create policy "product_images_admin_all"
on public.product_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- store_settings: leitura pública; somente admin altera.
drop policy if exists "store_settings_public_read" on public.store_settings;
create policy "store_settings_public_read"
on public.store_settings for select
to anon, authenticated
using (true);

drop policy if exists "store_settings_admin_update" on public.store_settings;
create policy "store_settings_admin_update"
on public.store_settings for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "store_settings_admin_insert" on public.store_settings;
create policy "store_settings_admin_insert"
on public.store_settings for insert
to authenticated
with check (public.is_admin());

-- homepage_sections: leitura pública apenas das visíveis; admin gerencia tudo.
drop policy if exists "homepage_sections_public_read" on public.homepage_sections;
create policy "homepage_sections_public_read"
on public.homepage_sections for select
to anon, authenticated
using (is_visible);

drop policy if exists "homepage_sections_admin_all" on public.homepage_sections;
create policy "homepage_sections_admin_all"
on public.homepage_sections for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Grants (a RLS continua sendo a camada de autorização)
-- -----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.categories, public.products, public.product_images,
  public.store_settings, public.homepage_sections to anon, authenticated;
grant select on public.profiles to authenticated;

grant insert, update, delete on public.categories, public.products,
  public.product_images, public.store_settings, public.homepage_sections
  to authenticated;
grant update, delete on public.profiles to authenticated;

-- -----------------------------------------------------------------------------
-- Storage: bucket público para imagens da loja
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site_images_public_read" on storage.objects;
create policy "site_images_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-images');

drop policy if exists "site_images_admin_insert" on storage.objects;
create policy "site_images_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_update" on storage.objects;
create policy "site_images_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'site-images' and public.is_admin())
with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_delete" on storage.objects;
create policy "site_images_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-images' and public.is_admin());
