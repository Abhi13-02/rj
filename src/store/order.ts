import { create } from "zustand";
import zukeper from "zukeeper";

interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: string;
  discount: string;
  tax: string;
  hsn: number;
}

interface AddressDetails {
  customer_name: string;
  last_name: string;
  address: string;
  address_2?: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  email: string;
  phone: string;
}

interface OrderState {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id: string;
  comment: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_pincode: string;
  shipping_country: string;
  shipping_state: string;
  shipping_email: string;
  shipping_phone: string;
  order_items: OrderItem[];
  payment_method: string;
  shipping_charges: number;
  giftwrap_charges: number;
  transaction_charges: number;
  total_discount: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

interface OrderActions {
  addOrderItems: (items: OrderItem[], orderId: string, orderDate: string) => void;
  addAddress: (billingDetails: Partial<AddressDetails>, shippingDetails?: Partial<AddressDetails>) => void;
  updatePaymentMethod: (method: string) => void;
  updateDimensions: (length: number, breadth: number, height: number, weight: number) => void;
}

type OrderStore = OrderState & OrderActions;

const useOrderStore = create<OrderStore>(
  zukeper((set) => ({
    // Initial state
    order_id: "",
    order_date: "",
    pickup_location: "Default Location",
    channel_id: "",
    comment: "",
    billing_customer_name: "",
    billing_last_name: "",
    billing_address: "",
    billing_address_2: "",
    billing_city: "",
    billing_pincode: "",
    billing_state: "",
    billing_country: "",
    billing_email: "",
    billing_phone: "",
    shipping_is_billing: true,
    shipping_customer_name: "",
    shipping_last_name: "",
    shipping_address: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_pincode: "",
    shipping_country: "",
    shipping_state: "",
    shipping_email: "",
    shipping_phone: "",
    order_items: [],
    payment_method: "",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: 0,
    length: 0,
    breadth: 0,
    height: 0,
    weight: 0,

    // Actions
    addOrderItems: (items, orderId, orderDate) =>
      set((state) => ({
        ...state,
        order_items: items,
        order_id: orderId,
        order_date: orderDate,
        sub_total:state.sub_total+items.reduce((total, item) => total + parseFloat(item.selling_price) * item.units, 0),
      })),

    addAddress: (billingDetails, shippingDetails) =>
      set((state) => ({
        ...state,
        ...billingDetails,
        ...(state.shipping_is_billing ? billingDetails : shippingDetails),
      })),

    updatePaymentMethod: (method) =>
      set((state) => ({
        ...state,
        payment_method: method,
      })),

    updateDimensions: (length, breadth, height, weight) =>
      set((state) => ({
        ...state,
        length,
        breadth,
        height,
        weight,
      })),
  }))
);

// Attach store to `window` for debugging purposes
if (typeof window !== "undefined") {
  (window as any).useOrderStore = useOrderStore;
}

export default useOrderStore;
