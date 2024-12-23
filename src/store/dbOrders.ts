//keep the info related to all the items in the order in one place so that when we create the order in the server for the data base order creation after shiprocket we can get the info from here and we can directly get the orders images , aname , quantity without calling another api 

import { create } from "zustand";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  images: string[];
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderState {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress | null;
  paymentMethod: 'COD' | 'Prepaid' | null;
  shiprocketOrderId: string | null;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';

  // Actions
  setUserId: (userId: string) => void;
  setItems: (items: OrderItem[], totalAmount: number) => void;
  setShippingAddress: (shippingAddress: ShippingAddress) => void;
  setPaymentMethod: (paymentMethod: 'COD' | 'Prepaid') => void;
  setShiprocketOrderId: (shiprocketOrderId: string) => void;
  resetOrder: () => void;
}

const useDBOrderStore = create<OrderState>((set) => ({
  userId: '',
  items: [],
  totalAmount: 0,
  shippingAddress: null,
  paymentMethod: null,
  shiprocketOrderId: null,
  status: 'pending',

  // Action to set user ID
  setUserId: (userId) => set(() => ({ userId })),

  // Action to set items and total amount
  setItems: (items, totalAmount) =>
    set(() => ({
      items,
      totalAmount,
    })),

  // Action to set shipping address
  setShippingAddress: (shippingAddress) =>
    set(() => ({
      shippingAddress,
    })),

  // Action to set payment method
  setPaymentMethod: (paymentMethod) =>
    set(() => ({
      paymentMethod,
    })),

  // Action to set Shiprocket order ID
  setShiprocketOrderId: (shiprocketOrderId) =>
    set(() => ({
      shiprocketOrderId,
      status: 'shipped', // Update status when Shiprocket order is created
    })),

  // Action to reset order (useful after order completion)
  resetOrder: () =>
    set(() => ({
      userId: '',
      items: [],
      totalAmount: 0,
      shippingAddress: null,
      paymentMethod: null,
      shiprocketOrderId: null,
      status: 'pending',
    })),
}));

export default useDBOrderStore;
