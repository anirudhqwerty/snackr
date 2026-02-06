type Food = {
  id: string;
  name: string;
  vendorId: string;
};

type OrderStatus = "pending" | "picked" | "delivered";

type Order = {
  id: string;
  foodId: string;
  status: OrderStatus;
};

type State = {
  foods: Food[];
  orders: Order[];
};

type Listener = (state: State) => void;

const state: State = {
  foods: [],
  orders: [],
};

const listeners = new Set<Listener>();

function notify() {
  const snapshot: State = {
    foods: [...state.foods],
    orders: [...state.orders],
  };
  listeners.forEach((listener) => listener(snapshot));
}

export function getState() {
  return {
    foods: [...state.foods],
    orders: [...state.orders],
  };
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  listener(getState());
  return () => listeners.delete(listener);
}

export function addFood(name: string, vendorId = "vendor-1") {
  const trimmed = name.trim();
  if (!trimmed) return;
  const food: Food = {
    id: `food-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: trimmed,
    vendorId,
  };
  state.foods = [food, ...state.foods];
  notify();
}

export function addOrder(foodId: string) {
  const order: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    foodId,
    status: "pending",
  };
  state.orders = [order, ...state.orders];
  notify();
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  state.orders = state.orders.map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  notify();
}
