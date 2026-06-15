import { useState, useEffect, useCallback, useMemo } from 'react';
import { CartContext, STORAGE_KEY, loadCart } from './cartStore';

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          nameMN: product.nameMN,
          nameEN: product.nameEN,
          price: product.price,
          unit: product.unit,
          unitEN: product.unitEN,
          category: product.category,
          brand: product.brand || null,
          qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it))
        .filter((it) => it.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalCount = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * it.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, totalCount, totalPrice }),
    [items, addItem, removeItem, updateQty, clear, totalCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
