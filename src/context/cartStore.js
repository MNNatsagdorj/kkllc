import { createContext, useContext } from 'react';

export const CartContext = createContext(null);

export const STORAGE_KEY = 'kk_cart';

export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

/** Format a number as Mongolian Tögrög, e.g. 24500 -> "24,500₮" */
export function formatPrice(value) {
  if (value == null) return '';
  return `${Math.round(value).toLocaleString('en-US')}₮`;
}
