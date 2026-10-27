export const CART_STORAGE_KEY = "laco-luz-cart-v1";
export const CART_MAX_QUANTITY = 9999;

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number | null;
  priceOnRequest: boolean;
  minQuantity: number;
  quantity: number;
};

export type CartProductInput = Omit<CartItem, "quantity">;

export function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const items: CartItem[] = [];
  const seen = new Set<string>();

  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    if (
      typeof item.productId !== "string" ||
      typeof item.slug !== "string" ||
      typeof item.name !== "string"
    ) {
      continue;
    }
    if (seen.has(item.productId)) continue;
    seen.add(item.productId);

    const minQuantity =
      typeof item.minQuantity === "number" && item.minQuantity >= 1
        ? Math.floor(item.minQuantity)
        : 1;
    const quantity =
      typeof item.quantity === "number" && Number.isFinite(item.quantity)
        ? Math.min(
            CART_MAX_QUANTITY,
            Math.max(minQuantity, Math.floor(item.quantity)),
          )
        : minQuantity;

    items.push({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : null,
      unitPrice:
        typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice)
          ? item.unitPrice
          : null,
      priceOnRequest: Boolean(item.priceOnRequest),
      minQuantity,
      quantity,
    });
  }

  return items.slice(0, 50);
}

export function calculateCartSubtotal(items: CartItem[]) {
  const priced = items.filter(
    (item) => !item.priceOnRequest && item.unitPrice !== null,
  );
  return {
    total: priced.reduce(
      (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
      0,
    ),
    hasPricedItems: priced.length > 0,
    hasOnRequestItems: priced.length !== items.length,
  };
}
