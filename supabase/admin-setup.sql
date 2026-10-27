-- =============================================================================
-- Como criar a primeira administradora
-- =============================================================================
-- 1. No painel do Supabase, abra Authentication → Users e crie a conta com
--    e-mail e senha. NÃO habilite cadastro público (Sign up) para visitantes.
-- 2. Copie o e-mail usado na conta.
-- 3. Substitua o e-mail abaixo e execute este bloco no SQL Editor.
-- 4. A conta passa a ter acesso ao painel em /admin.
--
-- O perfil é criado automaticamente como "viewer" pelo trigger
-- handle_new_user. Este script promove a conta para "admin".
-- =============================================================================

update public.profiles
set
  role = 'admin',
  full_name = coalesce(nullif(full_name, ''), 'Proprietária'),
  updated_at = timezone('utc', now())
where id = (
  select id
  from auth.users
  where email = 'proprietaria@exemplo.com'
);

-- Confira o resultado:
select p.id, u.email, p.full_name, p.role
from public.profiles p
join auth.users u on u.id = p.id
order by p.created_at;
