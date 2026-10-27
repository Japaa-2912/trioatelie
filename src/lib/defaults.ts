import type { HomepageSection, StoreSettings } from "@/types/store";

const PRIVACY_TEXT = `Esta loja utiliza seus dados apenas para apresentar o catálogo e encaminhar sua solicitação de orçamento ao WhatsApp da loja. Não realizamos pagamentos nem cobranças neste site.

Ao iniciar uma conversa pelo WhatsApp, você compartilha voluntariamente as informações que escrever na mensagem, como nome da criança, tema, data da festa e observações. Esses dados são usados exclusivamente para responder ao seu pedido e organizar a produção.

O carrinho fica salvo no seu próprio navegador para que você não perca os itens ao navegar. Não utilizamos ferramentas de publicidade ou rastreamento nesta versão da loja.

Para solicitar a exclusão de informações compartilhadas, entre em contato pelos canais oficiais da loja.`;

export const DEFAULT_SETTINGS: StoreSettings = {
  id: 1,
  brandName: "Laço & Luz",
  tagline: "Lembrancinhas personalizadas",
  logoUrl: null,
  logoPath: null,
  whatsappNumber: null,
  instagramUrl: null,
  email: null,
  phone: null,
  announcementText:
    "Feito à mão • Personalização a combinar • Pedidos pelo WhatsApp",
  heroEyebrow: "Ateliê de lembrancinhas",
  heroTitle:
    "Pequenos detalhes que tornam grandes momentos inesquecíveis.",
  heroSubtitle:
    "Lembrancinhas personalizadas feitas com carinho para celebrar os momentos mais especiais.",
  heroPrimaryCta: "Explorar lembrancinhas",
  heroSecondaryCta: "Conversar no WhatsApp",
  heroImageUrl: null,
  heroImagePath: null,
  heroImageAlt:
    "Composição delicada de caixas e cadernos personalizados",
  institutionalText:
    "Cada lembrancinha é preparada artesanalmente, com atenção aos detalhes e ao tema escolhido para a festa. As possibilidades de personalização são combinadas diretamente com a proprietária, para que o resultado seja exatamente o que você imaginou.",
  footerText:
    "Lembrancinhas artesanais para celebrar a infância com delicadeza.",
  privacyText: PRIVACY_TEXT,
  brandColor: "#a9786c",
  blushColor: "#f2d9d4",
  sageColor: "#9fb09a",
};

export const DEFAULT_SECTIONS: HomepageSection[] = [
  {
    key: "categories",
    label: "Categorias",
    eyebrow: "Explore o ateliê",
    title: "Escolha por categoria",
    body: "Caixas, cadernos e kits pensados para compor a mesa de doces e encantar os convidados.",
    isVisible: true,
    sortOrder: 10,
  },
  {
    key: "products",
    label: "Vitrine",
    eyebrow: "Feitos para celebrar",
    title: "Lembrancinhas para o seu tema",
    body: "Uma seleção de peças artesanais. Toque em um produto para ver os detalhes e combinar a personalização.",
    isVisible: true,
    sortOrder: 20,
  },
  {
    key: "customization",
    label: "Personalização",
    eyebrow: "Do seu jeitinho",
    title: "Personalização feita a quatro mãos",
    body: "Conte o tema da festa, o nome da criança e as cores que você ama. A disponibilidade de cada combinação é confirmada pela proprietária antes do fechamento do pedido.",
    isVisible: true,
    sortOrder: 30,
  },
  {
    key: "how_it_works",
    label: "Como funciona",
    eyebrow: "Simples e acolhedor",
    title: "Como funciona o pedido",
    body: "Escolha as peças, conte os detalhes e envie sua solicitação pelo WhatsApp. O pedido só é confirmado após o contato direto com a proprietária.",
    isVisible: true,
    sortOrder: 40,
  },
  {
    key: "cta",
    label: "Chamada final",
    eyebrow: "Vamos celebrar?",
    title: "Sua festa merece um detalhe feito com carinho",
    body: "Conte para a gente o tema, a data e a quantidade de lembrancinhas. Responderemos com disponibilidade, prazo e valor final.",
    isVisible: true,
    sortOrder: 50,
  },
];

export function mergeSettings(
  row: Partial<StoreSettings> | null | undefined,
): StoreSettings {
  if (!row) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...Object.fromEntries(
      Object.entries(row).filter(([, value]) => value !== undefined),
    ),
  } as StoreSettings;
}

export function mergeSections(
  rows: Partial<HomepageSection>[] | null | undefined,
): HomepageSection[] {
  if (!rows?.length) return DEFAULT_SECTIONS;
  const byKey = new Map(DEFAULT_SECTIONS.map((section) => [section.key, section]));
  for (const row of rows) {
    if (!row.key) continue;
    const fallback = byKey.get(row.key);
    byKey.set(row.key, {
      key: row.key,
      label: row.label ?? fallback?.label ?? row.key,
      eyebrow: row.eyebrow ?? fallback?.eyebrow ?? null,
      title: row.title ?? fallback?.title ?? null,
      body: row.body ?? fallback?.body ?? null,
      isVisible: row.isVisible ?? fallback?.isVisible ?? true,
      sortOrder: row.sortOrder ?? fallback?.sortOrder ?? 0,
    });
  }
  return [...byKey.values()].sort((a, b) => a.sortOrder - b.sortOrder);
}
