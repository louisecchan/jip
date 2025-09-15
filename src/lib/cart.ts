// Cart management utilities
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  stripePriceId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Cart storage key
const CART_STORAGE_KEY = "satellite_spectrum_cart";

// Initialize cart in localStorage if it doesn't exist
function initializeCart(): void {
  if (
    typeof window !== "undefined" &&
    !localStorage.getItem(CART_STORAGE_KEY)
  ) {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: [], total: 0, itemCount: 0 })
    );
  }
}

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0, itemCount: 0 };
  }

  initializeCart();
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartData) {
    return { items: [], total: 0, itemCount: 0 };
  }

  try {
    return JSON.parse(cartData);
  } catch (error) {
    console.error("Error parsing cart data:", error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

// Save cart to localStorage
function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
}

// Calculate cart totals
function calculateTotals(items: CartItem[]): {
  total: number;
  itemCount: number;
} {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
}

// Add item to cart
export function addToCart(item: Omit<CartItem, "quantity">): Cart {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.id === item.id
  );

  if (existingItemIndex > -1) {
    // Item exists, increment quantity
    cart.items[existingItemIndex].quantity += 1;
  } else {
    // New item, add to cart
    cart.items.push({ ...item, quantity: 1 });
  }

  const { total, itemCount } = calculateTotals(cart.items);
  cart.total = total;
  cart.itemCount = itemCount;

  saveCart(cart);
  return cart;
}

// Remove item from cart
export function removeFromCart(itemId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== itemId);

  const { total, itemCount } = calculateTotals(cart.items);
  cart.total = total;
  cart.itemCount = itemCount;

  saveCart(cart);
  return cart;
}

// Update item quantity
export function updateItemQuantity(itemId: string, quantity: number): Cart {
  const cart = getCart();
  const itemIndex = cart.items.findIndex((item) => item.id === itemId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
  }

  const { total, itemCount } = calculateTotals(cart.items);
  cart.total = total;
  cart.itemCount = itemCount;

  saveCart(cart);
  return cart;
}

// Clear entire cart
export function clearCart(): Cart {
  const emptyCart = { items: [], total: 0, itemCount: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

// Get cart item count (for display in navigation)
export function getCartItemCount(): number {
  return getCart().itemCount;
}

// Check if item is in cart
export function isItemInCart(itemId: string): boolean {
  const cart = getCart();
  return cart.items.some((item) => item.id === itemId);
}

// Get item quantity in cart
export function getItemQuantity(itemId: string): number {
  const cart = getCart();
  const item = cart.items.find((item) => item.id === itemId);
  return item ? item.quantity : 0;
}
