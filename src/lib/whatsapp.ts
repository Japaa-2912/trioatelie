import { formatDateBR, formatPrice, normalizeWhatsAppNumber } from "./utils";

export type QuoteItem = {
  name: string;
  quantity: number;
  unitPrice: number | null;
  priceOnRequest: boolean;
  url?: string | null;
};

export type QuoteDetails = {
  theme?: string;
  childName?: string;
  childAge?: string;
  partyDate?: string;
  colors?: string;
  notes?: string;
};

type BuildMessageInput = {
  brandName: string;
  items: QuoteItem[];
  details?: QuoteDetails;
  storeUrl?: string;
  intro?: string;
};

const EMPTY_DETAILS: QuoteDetails = {};

function addLine(lines: string[], label: string, value?: string | null) {
  const trimmed = value?.trim();
  if (trimmed) lines.push(`${label}: ${trimmed}`);
}

function formatItemLine(item: QuoteItem) {
  const unitPrice = formatPrice(item.unitPrice);
  let line = `- ${item.quantity} un. de ${item.name}`;
  if (item.priceOnRequest || item.unitPrice === null) {
    line += " (valor sob consulta)";
  } else if (unitPrice) {
    line += ` — ${unitPrice} cada`;
  }
  return line;
}

export function buildQuoteMessage({
  brandName,
  items,
  details = EMPTY_DETAILS,
  storeUrl,
  intro,
}: BuildMessageInput): string {
  const lines: string[] = [];

  lines.push(
    intro ??
      `Olá, ${brandName}! Gostaria de solicitar um orçamento para lembrancinhas personalizadas.`,
  );
  lines.push("");
  lines.push("Produtos:");

  for (const item of items) {
    lines.push(formatItemLine(item));
  }

  const pricedItems = items.filter(
    (item) => !item.priceOnRequest && item.unitPrice !== null,
  );
  const total = pricedItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0,
  );

  if (pricedItems.length > 0) {
    const totalLabel =
      pricedItems.length === items.length
        ? "Subtotal estimado"
        : "Subtotal dos itens com preço informado";
    lines.push("");
    lines.push(`${totalLabel}: ${formatPrice(total)}`);
    lines.push("(Valores estimativos, sujeitos à confirmação.)");
  }

  const detailLines: string[] = [];
  addLine(detailLines, "Tema da festa", details.theme);
  addLine(detailLines, "Nome da criança", details.childName);
  addLine(detailLines, "Idade", details.childAge);
  addLine(detailLines, "Cores desejadas", details.colors);
  addLine(detailLines, "Data da festa", formatDateBR(details.partyDate));
  addLine(detailLines, "Observações", details.notes);

  if (detailLines.length > 0) {
    lines.push("");
    lines.push(...detailLines);
  }

  const itemLinks = items
    .map((item) => item.url?.trim())
    .filter((url): url is string => Boolean(url));

  if (itemLinks.length > 0) {
    lines.push("");
    lines.push(
      itemLinks.length === 1 ? "Produto:" : "Produtos no site:",
    );
    lines.push(...itemLinks);
  } else if (storeUrl) {
    lines.push("");
    lines.push(`Loja: ${storeUrl}`);
  }

  lines.push("");
  lines.push(
    "Gostaria de confirmar a disponibilidade, o prazo de produção e o valor final. Obrigado(a)!",
  );

  return lines.join("\n");
}

export function buildWhatsAppUrl(
  number: string | null | undefined,
  message: string,
): string | null {
  const normalized = normalizeWhatsAppNumber(number);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildSimpleWhatsAppUrl(
  number: string | null | undefined,
  brandName: string,
): string | null {
  return buildWhatsAppUrl(
    number,
    `Olá, ${brandName}! Vim pelo site e gostaria de saber mais sobre as lembrancinhas personalizadas.`,
  );
}
