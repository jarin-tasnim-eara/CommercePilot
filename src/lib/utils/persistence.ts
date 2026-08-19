export function loadFromStorage<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }

 
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const STORAGE_KEYS = {
  auth: "ecad_auth",
  orders: "ecad_orders",
  customers: "ecad_customers",
  staff: "ecad_staff",
  products: "ecad_products",
  ui:"ecad_ui",
} as const;
