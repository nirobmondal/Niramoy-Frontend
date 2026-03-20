export type OrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  medicine?: {
    id: string;
    name: string;
  };
};

export type OrderSummary = {
  id: string;
  totalPrice: number;
  shippingAddress?: string;
  status?: OrderStatus;
  createdAt?: string;
  items?: OrderItem[];
  sellerOrders?: Array<{
    id: string;
    status?: OrderStatus;
    seller?: {
      id: string;
      storeName?: string;
    };
  }>;
};

export type OrdersMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrdersListResult = {
  orders: OrderSummary[];
  meta: OrdersMeta;
};
