# Laço & Luz — loja de lembrancinhas personalizadas

Loja virtual em português para um ateliê de lembrancinhas infantis artesanais. O
catálogo, a página inicial, as categorias e as informações de contato são
administrados por um painel próprio. O pedido é montado no carrinho e enviado
para o WhatsApp da loja — **não há pagamento online nesta versão**.

## O que está incluído

- Catálogo com categorias, produtos, galeria de imagens, preço ou “sob consulta”,
  quantidade mínima, destaque na home e ativação/desativação.
- Carrinho persistido no navegador, com alteração de quantidade, remoção,
  validação contra o catálogo atual e envio do resumo pelo WhatsApp.
- Formulário de orçamento no carrinho com tema, nome e idade da criança, cores,
  data da festa e observações.
- Painel administrativo com autenticação Supabase e permissão por perfil:
  - visão geral com contagens reais do catálogo;
  - produtos (criar, editar, publicar, destacar, excluir);
  - categorias (criar, editar, ordenar, destacar, ativar, excluir);
  - página inicial (marca, logotipo, banner, textos e seções);
  - configurações (WhatsApp, Instagram, e-mail, telefone, textos institucionais,
    política de privacidade e cores).
- Upload de imagens para o Supabase Storage, com prévia, troca e remoção.
- Páginas públicas: início, produtos, categorias, detalhe do produto, carrinho,
  personalização, contato e privacidade.
- SEO básico: metadados, Open Graph, sitemap, robots, títulos e textos
  alternativos.
- Estados de carregamento, catálogo vazio, erro e confirmações para ações
  destrutivas.
- Layout responsivo, com foco em navegação por toque e acessibilidade.

### O que esta versão não faz

- Não processa pagamentos (Mercado Pago, Stripe ou similares).
- Não confirma pedidos automaticamente.
- Não possui cadastro público de administradoras.
- Não envia e-mails transacionais próprios; a recuperação de senha usa o
  Supabase Auth.
- Não possui avaliações, depoimentos ou números de clientes inventados.
- Não inclui fotos reais de produtos: enquanto não houver upload, a loja usa
  ilustrações SVG originais.

## Tecnologias

- [Next.js 16](https://nextjs.org) (App Router) e React 19
- TypeScript
- Tailwind CSS 4
- [Supabase](https://supabase.com): Auth, Postgres e Storage
- Zod e React Hook Form
- Lucide e Sonner

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Uma conta no [Supabase](https://supabase.com) (plano gratuito atende)
- Uma conta na [Vercel](https://vercel.com) para publicar
- Um número de WhatsApp com código do país

## 1. Instalar e configurar

```bash
git clone <url-do-repositorio>
cd "Default Project"
npm install
```

Copie o arquivo de exemplo de variáveis:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

Preencha o `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-ou-publishable
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`: estão em
  **Project Settings → API** no Supabase. Use a chave `anon`/`publishable`.
- `NEXT_PUBLIC_SITE_URL`: URL canônica da loja. Em produção, use o domínio final
  (ex.: `https://lacoluz.com.br`). Ela aparece no sitemap, no Open Graph e nos
  links enviados ao WhatsApp.
- **Não use a chave `service_role`** neste projeto. Ela não é necessária e não
  deve ser exposta ao navegador.

> As variáveis `NEXT_PUBLIC_*` são incorporadas ao bundle do navegador. A chave
> `anon` é pública por design; a segurança real vem das políticas RLS.

## 2. Criar o banco no Supabase

1. Crie um projeto no Supabase.
2. Abra **SQL Editor**.
3. Copie todo o conteúdo de
   `supabase/migrations/20261026120000_initial_schema.sql` e execute.
4. Confira em **Table Editor** se as tabelas foram criadas:
   - `profiles`
   - `categories`
   - `products`
   - `product_images`
   - `store_settings`
   - `homepage_sections`
5. Confira em **Storage** se o bucket público `site-images` foi criado.

A migration também:

- cria triggers de `updated_at`;
- cria o trigger que gera um perfil ao registrar um usuário no Auth;
- ativa RLS em todas as tabelas expostas;
- cria as políticas de leitura pública e escrita apenas para administradoras;
- cria as políticas do bucket `site-images`;
- insere a configuração inicial da loja, as seções da home e algumas categorias
  de exemplo (sem produtos).

> A migration foi escrita para ser executada uma vez em um projeto novo. Se
> precisar reaplicar em um banco existente, revise antes: os `insert` de seed
> podem duplicar conteúdo se as restrições não forem respeitadas.

Alternativa com Supabase CLI:

```bash
supabase link --project-ref seu-project-ref
supabase db push
```

## 3. Criar a primeira administradora

Não existe cadastro público. O acesso é criado manualmente:

1. No Supabase, abra **Authentication → Users** e clique em **Add user**.
2. Informe o e-mail e uma senha forte. Marque o e-mail como confirmado, se
   necessário.
3. Desabilite o cadastro público em **Authentication → Providers → Email**
   (desmarque “Enable sign ups”), para que visitantes não criem contas.
4. Abra `supabase/admin-setup.sql`, troque
   `proprietaria@exemplo.com` pelo e-mail criado e execute no **SQL Editor**.
5. Entre em `/admin/login` com esse e-mail e senha.

O script promove o perfil para `role = 'admin'`. Sem essa etapa, a conta
consegue autenticar, mas é bloqueada pelo painel.

### Recuperação de senha

Em **Authentication → URL Configuration**:

- **Site URL**: `https://seu-dominio.com` (ou `http://localhost:3000` em
  desenvolvimento)
- **Redirect URLs**: adicione
  - `http://localhost:3000/auth/callback`
  - `https://seu-dominio.com/auth/callback`

O fluxo de “Esqueci minha senha” envia o link para
`/auth/callback?next=/admin/redefinir-senha`. Se o link abrir com erro, verifique
essas URLs e se o e-mail já foi confirmado.

## 4. Configurar o WhatsApp

1. Entre no painel em `/admin/configuracoes`.
2. Preencha **WhatsApp com código do país**, apenas dígitos. Exemplo Brasil:
   `5511999999999` (55 + DDD + número).
3. Salve. O painel mostra o número formatado para conferência.
4. Se o número não for válido, os botões de pedido ficam desativados e a loja
   orienta a cliente a usar a página de contato.

Como funciona o envio:

- O site monta uma mensagem com produtos, quantidades, preços, subtotal e os
  detalhes preenchidos no carrinho.
- A mensagem é codificada e aberta em `https://wa.me/<numero>?text=...` em uma
  nova aba.
- **Nada é enviado automaticamente.** A cliente ainda precisa tocar em “enviar”
  no WhatsApp.
- O pedido **não é confirmado automaticamente**. Disponibilidade, prazo, frete e
  valor final são combinados na conversa com a proprietária.

## 5. Rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O painel fica em
[http://localhost:3000/admin](http://localhost:3000/admin).

Sem as variáveis do Supabase, a loja pública ainda abre com o conteúdo padrão e
um catálogo vazio, mas login, uploads e gravações não funcionam. Isso é
intencional para permitir revisar o layout antes de conectar o banco.

## 6. Publicar na Vercel

1. Envie o projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. Em **Settings → Environment Variables**, cadastre:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` com o domínio de produção
4. Faça o deploy.
5. No Supabase, atualize **Site URL** e **Redirect URLs** com o domínio da
   Vercel (incluindo `/auth/callback`).
6. Entre em `/admin/login`, cadastre produtos e envie as imagens.

As rotas administrativas são dinâmicas e verificam a sessão no servidor. A loja
também é dinâmica para refletir as alterações do painel imediatamente.

## Como usar o painel

| Página | Para quê |
| --- | --- |
| `/admin` | Contagens do catálogo, atalhos e pendências de configuração |
| `/admin/produtos` | Buscar, filtrar, editar, ativar, destacar e excluir produtos |
| `/admin/produtos/novo` | Criar um produto com imagem, galeria, preço e personalização |
| `/admin/categorias` | Organizar a vitrine por categorias |
| `/admin/home` | Marca, logotipo, banner e textos das seções da home |
| `/admin/configuracoes` | WhatsApp, contato, textos institucionais, privacidade e cores |

### Imagens

- Formatos aceitos: JPEG, PNG e WebP.
- Tamanho máximo: 5 MB por arquivo.
- As imagens são enviadas ao bucket `site-images` antes de salvar o formulário.
- Os caminhos são gerados com nome seguro e token aleatório.
- O servidor não confia na URL enviada pelo formulário: ele valida o caminho no
  Storage e deriva a URL pública.
- Ao trocar uma imagem já salva, o arquivo antigo é removido do Storage depois
  que a alteração é gravada com sucesso.
- Imagens sem uso ou enviadas e não salvas podem permanecer no bucket; a limpeza
  automática cobre apenas substituições e exclusões feitas pelo painel.

Para usar imagens externas, seria necessário liberar o domínio em
`next.config.ts` (`images.remotePatterns`). O fluxo recomendado é sempre enviar
pelo painel.

## Segurança e privacidade

- Todas as tabelas expostas têm RLS ativada.
- Leitura pública limitada a conteúdo ativo/visível.
- Escritas e uploads exigem perfil `admin`.
- A função `public.is_admin()` é `security definer` e verifica o perfil do
  usuário autenticado.
- Nenhuma chave `service_role` é usada no código.
- O carrinho guarda apenas IDs, nome, imagem e preço de referência no
  `localStorage`. Ao abrir o carrinho, os dados são reconciliados com o catálogo
  atual e os preços usados na mensagem vêm do banco, não do navegador.
- Produtos removidos ou desativados são sinalizados e não entram no orçamento.
- A política de privacidade é editável no painel e explica o uso dos dados no
  encaminhamento ao WhatsApp.

## Estrutura do projeto

```text
src/
  app/
    (store)/              # loja pública
    admin/(auth)/         # login, recuperação e redefinição de senha
    admin/(painel)/       # painel protegido
    auth/callback/        # troca de código/token do Supabase Auth
  components/
    admin/                # editores e campos do painel
    brand/                # marca e ilustrações SVG
    cart/                 # provedor, gaveta e página do carrinho
    store/                # cabeçalho, rodapé, cards e seções
    ui/                   # botões, campos, alertas, modal etc.
  lib/
    actions/              # Server Actions (produtos, categorias, home, auth)
    data/                 # consultas públicas e administrativas
    supabase/             # clientes e configuração
    validations/          # schemas Zod compartilhados
supabase/
  migrations/             # schema, RLS, storage e seed
  admin-setup.sql         # promoção da primeira administradora
```

## Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run start      # servir o build
npm run lint       # ESLint
npm run typecheck  # TypeScript sem emitir arquivos
```

## Solução de problemas

### O login redireciona de volta ou mostra “sem permissão”

- Confirme se o usuário existe em **Authentication → Users**.
- Execute `supabase/admin-setup.sql` com o e-mail correto.
- Confira em `profiles` se `role = 'admin'`.
- Se a sessão estiver antiga, saia e entre novamente.

### “Supabase não configurado”

- Confira se `.env.local` existe na raiz.
- Reinicie `npm run dev` após alterar variáveis.
- Em produção, confirme as variáveis na Vercel e faça um novo deploy.

### Erro de permissão ao salvar ou enviar imagens

- Verifique se a migration foi executada por completo.
- Confirme que o perfil da conta é `admin`.
- Confirme que o bucket `site-images` existe e é público.
- As políticas de Storage dependem de `public.is_admin()`.

### Imagens não aparecem

- Confirme que o caminho começa com `hero/`, `logo/`, `categories/` ou
  `products/`.
- Confirme que o bucket é público.
- Verifique se `NEXT_PUBLIC_SUPABASE_URL` corresponde ao projeto usado no upload.
- Se a imagem vier de outro domínio, ajuste `next.config.ts`.

### Botão do WhatsApp desativado

- Preencha o número com código do país e apenas dígitos.
- Exemplo válido: `5511999999999`.
- Não use `+`, espaços, parênteses ou hífen no cadastro; a formatação é aplicada
  apenas na exibição.

### Link de recuperação inválido ou expirado

- Confira as **Redirect URLs** no Supabase.
- Solicite um novo link; links expiram.
- Verifique a caixa de spam.

### Conteúdo do painel não aparece na loja

- Confirme que o produto/categoria está ativo.
- A loja é dinâmica; recarregue a página.
- Em produção, confirme se o deploy mais recente está publicado.

### Build falha por causa de imagens externas

- O projeto só permite imagens do Supabase por padrão.
- Envie a imagem pelo painel ou adicione o domínio em `next.config.ts`.

## Status honesto desta entrega

**Implementado e verificado:**

- Estrutura completa de páginas públicas e painel.
- Schema SQL com RLS, triggers, bucket e seed inicial.
- Server Actions com validação Zod e verificação de administradora.
- Carrinho, reconciliação de preços e geração da mensagem de WhatsApp.
- Upload com validação de formato/tamanho e caminhos seguros.
- `npm run typecheck`, `npm run lint` e `npm run build` sem erros.
- Revisão visual das páginas públicas em desktop e mobile.

**Não foi possível verificar nesta entrega:**

- Conexão real com um projeto Supabase (sem credenciais disponíveis no
  ambiente de desenvolvimento).
- Login autenticado, CRUD real no banco, upload real e políticas RLS em execução.
- Abertura do WhatsApp em um número real.
- Deploy na Vercel.

Esses pontos dependem de configurar o projeto Supabase, o número de WhatsApp e as
variáveis de ambiente. Depois disso, o roteiro de teste recomendado é: criar a
administradora, entrar no painel, cadastrar uma categoria e um produto com
imagem, ativar o produto, abrir a loja, adicionar ao carrinho, preencher o
formulário e conferir a mensagem no WhatsApp.

## Licença

Uso privado do ateliê. Ajuste esta seção conforme a necessidade da marca.
