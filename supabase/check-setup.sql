-- =============================================================================
-- Laço & Luz — verificação do setup do Supabase
-- =============================================================================
-- Rode este arquivo no SQL Editor DEPOIS de aplicar a migration
-- 20261026120000_initial_schema.sql. Ele é somente leitura: não altera nada.
-- O resultado mostra o que está pronto e o que ainda falta.
-- =============================================================================

-- 1. Tabelas esperadas e se o RLS está ativo em cada uma.
select
  c.relname as tabela,
  case when c.relrowsecurity then 'RLS ativa' else 'SEM RLS' end as status
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'profiles',
    'categories',
    'products',
    'product_images',
    'store_settings',
    'homepage_sections'
  )
order by c.relname;

-- 2. Quantidade de políticas por tabela pública.
select tablename as tabela, count(*) as politicas
from pg_policies
where schemaname = 'public'
group by tablename
order by tablename;

-- 3. Bucket público de imagens.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'site-images';

-- 4. Políticas do Storage (bucket site-images).
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;

-- 5. Funções auxiliares criadas pela migration.
select p.proname as funcao
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_admin', 'set_updated_at', 'handle_new_user')
order by p.proname;

-- 6. Conteúdo inicial.
select 'categories' as tabela, count(*) as registros from public.categories
union all
select 'products', count(*) from public.products
union all
select 'store_settings', count(*) from public.store_settings
union all
select 'homepage_sections', count(*) from public.homepage_sections;

-- 7. Contas administrativas (deve listar a proprietária após o admin-setup.sql).
select u.email, p.full_name, p.role
from public.profiles p
join auth.users u on u.id = p.id
order by p.created_at;
