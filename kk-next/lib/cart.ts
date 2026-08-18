'use client';

// 장바구니 스토어 — localStorage + useSyncExternalStore (로그인 없음, 04 문서)
import { useSyncExternalStore } from 'react';

export interface CartItem { product_id: string; qty: number }

const KEY = 'kk-cart';
const EMPTY: CartItem[] = [];
let items: CartItem[] | null = null; // lazy load (SSR 안전)
const subs = new Set<() => void>();

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch { return []; }
}

function snapshot(): CartItem[] {
  if (items === null) items = load();
  return items;
}

function commit(next: CartItem[]) {
  items = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  subs.forEach((f) => f());
}

export function setCartQty(product_id: string, qty: number) {
  const cur = snapshot().filter((i) => i.product_id !== product_id);
  commit(qty > 0 ? [...cur, { product_id, qty }] : cur);
}

export function addToCart(product_id: string, qty: number) {
  const cur = snapshot();
  const hit = cur.find((i) => i.product_id === product_id);
  setCartQty(product_id, (hit?.qty ?? 0) + qty);
}

export function clearCart() { commit([]); }

function subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
