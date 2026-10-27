"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  CART_MAX_QUANTITY,
  CART_STORAGE_KEY,
  sanitizeCartItems,
  type CartItem,
  type CartProductInput,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  isOpen: boolean;
  totalItems: number;
  addItem: (
    product: CartProductInput,
    quantity?: number,
    options?: { open?: boolean; silent?: boolean },
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    minQuantity?: number,
  ) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      // O carrinho vive no localStorage; a leitura só pode ocorrer após a
      // montagem para não divergir do HTML renderizado no servidor.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(sanitizeCartItems(JSON.parse(stored)));
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Armazenamento cheio ou bloqueado: o carrinho continua na sessão atual.
    }
  }, [items, hydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      if (!event.newValue) {
        setItems([]);
        return;
      }
      try {
        setItems(sanitizeCartItems(JSON.parse(event.newValue)));
      } catch {
        // Ignora dados corrompidos de outra aba.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback(
    (
      product: CartProductInput,
      quantity = 1,
      options: { open?: boolean; silent?: boolean } = {},
    ) => {
      const minQuantity = Math.max(1, product.minQuantity || 1);
      const safeQuantity = Math.min(
        CART_MAX_QUANTITY,
        Math.max(minQuantity, Math.floor(quantity || minQuantity)),
      );

      setItems((current) => {
        const existing = current.find(
          (item) => item.productId === product.productId,
        );
        if (existing) {
          return current.map((item) =>
            item.productId === product.productId
              ? {
                  ...item,
                  ...product,
                  quantity: Math.min(
                    CART_MAX_QUANTITY,
                    item.quantity + safeQuantity,
                  ),
                }
              : item,
          );
        }
        return [...current, { ...product, quantity: safeQuantity }];
      });

      if (options.open !== false) setIsOpen(true);
      if (!options.silent) {
        toast.success("Adicionado ao carrinho", {
          description: product.name,
        });
      }
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, minQuantity?: number) => {
      setItems((current) =>
        current.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(
                  CART_MAX_QUANTITY,
                  Math.max(
                    Math.max(1, minQuantity ?? item.minQuantity),
                    Math.floor(quantity),
                  ),
                ),
              }
            : item,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
    toast.info("Item removido do carrinho");
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("Carrinho esvaziado");
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      hydrated,
      isOpen,
      totalItems,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      hydrated,
      isOpen,
      totalItems,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }
  return context;
}
