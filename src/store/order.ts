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
  addOrderItems: (items: OrderItem[], orderId: string, orderDate: string, total: number) => void;
  addAddress: (billingDetails: Partial<AddressDetails>, shippingDetails?: Partial<AddressDetails>) => void;
  updatePaymentMethod: (method: string) => void;
  updateDimensions: (length: number, breadth: number, height: number, weight: number) => void;
}

type OrderStore = OrderState & OrderActions;

const useOrderStore = create<OrderStore>(
  zukeper((set: any) => ({
    order_id: "",
    order_date: "",
    pickup_location: "Home",
    channel_id: "5899362",
    comment: "",
    billing_customer_name: "dummy",
    billing_last_name: "dummy",
    billing_address: "ram ngar, w/no.3",
    billing_address_2: "pritam pura , jela 420",
    billing_city: "Jaipur",
    billing_pincode: "788163",
    billing_state: "Assam",
    billing_country: "India",
    billing_email: "ratsdust4226@gmail.com",
    billing_phone: "7896071914",
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
    length: 0.9,
    breadth: 0.9,
    height: 0.9,
    weight: 0.9,

    // Actions
    addOrderItems: (items : OrderItem[] , orderId : string, orderDate: string, total: number) =>
      set((state: OrderState) => ({
        ...state,
        order_items: items,
        order_id: orderId,
        order_date: orderDate,
        sub_total: total,
      })),

    addAddress: (billingDetails: Partial<AddressDetails> , shippingDetails: Partial<AddressDetails>) =>
      set((state : OrderState) => ({
        ...state,
        ...billingDetails,
        ...(state.shipping_is_billing ? billingDetails : shippingDetails),
      })),

    updatePaymentMethod: (method: string) =>
      set((state: OrderState) => ({
        ...state,
        payment_method: method,
      })),

    updateDimensions: (length: number, breadth: number, height: number, weight: number) =>
      set((state: OrderState) => ({
        ...state,
        length,
        breadth,
        height,
        weight,
      })),
  }))
);

if (typeof window !== "undefined") {
  (window as any).useOrderStore = useOrderStore;
}

export default useOrderStore;
