"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the order object
interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: string;
  discount: string;
  tax: string;
  hsn: number;
}

interface Order {
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

// Define the shape of the context
interface AppContextType {
  shipOrder: Order;
  setShipOrder: React.Dispatch<React.SetStateAction<Order>>;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {

  const [shipOrder, setShipOrder] = useState<Order>({
    order_id: "",
    order_date: "",
    pickup_location: "",
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
    order_items: [
      {
        name: "",
        sku: "",
        units: 0,
        selling_price: "",
        discount: "",
        tax: "",
        hsn: 0,
      },
    ],
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
  });

  

  return (
    <AppContext.Provider value={{ shipOrder, setShipOrder }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
