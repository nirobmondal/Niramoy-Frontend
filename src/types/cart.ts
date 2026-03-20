export type CartMedicine = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

export type CartItem = {
  id: string;
  quantity: number;
  medicine: CartMedicine;
};

export type CartData = {
  id: string;
  items: CartItem[];
  total: number;
};

export type CartResponse = {
  success: boolean;
  message: string;
  data: CartData;
};
