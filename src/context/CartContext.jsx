import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, setCart } from '../utils/localStorage';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const COUPONS = {
  SAVE10: { type: 'percentage', value: 10, minOrder: 0, maxDiscount: 1000 },
  FLAT50: { type: 'flat', value: 50, minOrder: 500 },
  NEWUSER: { type: 'percentage', value: 15, minOrder: 0, maxDiscount: 500, userType: 'new' },
};

const SHIPPING_FREE_THRESHOLD = 500;
const SHIPPING_COST = 50;
const TAX_RATE = 0.18;

function calculateTotals(items, appliedCoupon) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let discountAmount = 0;
  if (appliedCoupon && items.length) {
    const c = COUPONS[appliedCoupon.code];
    if (c) {
      if (c.type === 'percentage') {
        discountAmount = Math.min((subtotal * c.value) / 100, c.maxDiscount || Infinity);
      } else {
        discountAmount = subtotal >= c.minOrder ? c.value : 0;
      }
    }
  }
  const shipping = subtotal > SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
  const taxBase = subtotal - discountAmount + shipping;
  const tax = Math.round(taxBase * TAX_RATE);
  const total = Math.round(subtotal - discountAmount + shipping + tax);
  return { subtotal, discount: discountAmount, shipping, tax, total };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const loadCart = useCallback(() => {
    const saved = getCart();
    if (saved) {
      setCartItems(saved.items || []);
      setSavedForLater(saved.savedForLater || []);
      setAppliedCoupon(saved.appliedCoupon || null);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    setCart({ items: cartItems, savedForLater, appliedCoupon });
  }, [cartItems, savedForLater, appliedCoupon]);

  const addToCart = useCallback((product, quantity = 1, options = {}) => {
    const existing = cartItems.find((i) => i.productId === product.id && JSON.stringify(i.options || {}) === JSON.stringify(options));
    let next;
    if (existing) {
      next = cartItems.map((i) =>
        i.productId === product.id && JSON.stringify(i.options || {}) === JSON.stringify(options)
          ? { ...i, quantity: Math.min(i.quantity + quantity, product.stockCount || 99) }
          : i
      );
    } else {
      next = [
        ...cartItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          options,
          image: product.images?.[0],
          stockCount: product.stockCount,
        },
      ];
    }
    setCartItems(next);
  }, [cartItems]);

  const updateQuantity = useCallback((productId, newQuantity, options = {}) => {
    const next = cartItems.map((i) => {
      if (i.productId !== productId || JSON.stringify(i.options || {}) !== JSON.stringify(options)) return i;
      return { ...i, quantity: Math.max(1, Math.min(newQuantity, i.stockCount || 99)) };
    });
    setCartItems(next);
  }, [cartItems]);

  const removeFromCart = useCallback((productId, options = {}) => {
    const next = cartItems.filter(
      (i) => !(i.productId === productId && JSON.stringify(i.options || {}) === JSON.stringify(options))
    );
    setCartItems(next);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  const saveForLater = useCallback((productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    const newItems = cartItems.filter((i) => i.productId !== productId);
    const newSaved = savedForLater.some((i) => i.productId === productId) ? savedForLater : [...savedForLater, item];
    setCartItems(newItems);
    setSavedForLater(newSaved);
    setCart({ items: newItems, savedForLater: newSaved, appliedCoupon });
  }, [cartItems, savedForLater, appliedCoupon]);

  const moveToCart = useCallback((productId) => {
    const item = savedForLater.find((i) => i.productId === productId);
    if (!item) return;
    const newSaved = savedForLater.filter((i) => i.productId !== productId);
    const existing = cartItems.find((i) => i.productId === productId && JSON.stringify(i.options || {}) === JSON.stringify(item.options || {}));
    const newItems = existing
      ? cartItems.map((i) => (i.productId === productId && JSON.stringify(i.options || {}) === JSON.stringify(item.options || {}) ? { ...i, quantity: i.quantity + item.quantity } : i))
      : [...cartItems, item];
    setSavedForLater(newSaved);
    setCartItems(newItems);
    setCart({ items: newItems, savedForLater: newSaved, appliedCoupon });
  }, [cartItems, savedForLater, appliedCoupon]);

  const applyCoupon = useCallback((code) => {
    const c = COUPONS[code?.toUpperCase()];
    if (!c) return { success: false, message: 'Invalid coupon code' };
    const { subtotal } = calculateTotals(cartItems, null);
    if (subtotal < c.minOrder) return { success: false, message: `Minimum order of ₹${c.minOrder} required` };
    setAppliedCoupon({ code: code.toUpperCase(), discount: c });
    return { success: true };
  }, [cartItems]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const totals = calculateTotals(cartItems, appliedCoupon);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    cartItems,
    savedForLater,
    appliedCoupon,
    ...totals,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCart,
    applyCoupon,
    removeCoupon,
    calculateTotals: () => calculateTotals(cartItems, appliedCoupon),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
