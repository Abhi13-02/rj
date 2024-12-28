'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";
import CheckoutButton from "@/components/payments/checkoutButton";
import { useSession } from "next-auth/react";
import useDBOrderStore from "@/store/dbOrders";
import { log } from "console";

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [paymentMethod, setPaymentMethod] = useState("");

  const updatePaymentMethod = useOrderStore((state) => state.updatePaymentMethod);
  const setDBPaymentMethod = useDBOrderStore((state) => state.setPaymentMethod);
  const setShiprocketOrderId = useDBOrderStore((state) => state.setShiprocketOrderId);
  const setUserId = useDBOrderStore((state) => state.setUserId);

  const resetDBOrder = useDBOrderStore((state) => state.resetOrder);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  // For managing shipping charges
  const { setItems } = useDBOrderStore((state) => state);
  const { updateshippingCharges } = useOrderStore((state) => state);
  const sub_total = useOrderStore((state: any) => state.sub_total);
  const [totalAmount, setTotalAmount] = useState(sub_total);

  const orderInfo = useOrderStore((state) => state);

  console.log("orderInfo", orderInfo);
  

  useEffect(() => {
      if (!orderInfo || !orderInfo.order_items?.length || !orderInfo.billing_address) {
        router.replace("/products"); 
      }
    }, [orderInfo, router]);

  const { items } = useDBOrderStore((state) => state);
  const shippingCharges = 150;

  const handleCODcharges = () => {
    if(paymentMethod !== "COD"){
      setTotalAmount(sub_total + shippingCharges);
    }
    else{
      setTotalAmount(sub_total);
    }
  };

  const handleFinish = async () => {
    if (paymentMethod === "COD") {

      updatePaymentMethod("COD");
      updateshippingCharges(shippingCharges);
      setItems(items, sub_total + shippingCharges);


      const response = await fetch("/api/ship/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(useOrderStore.getState()),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      alert("Order placed successfully with COD!");


      //////creating DBorder///////////
      setDBPaymentMethod(paymentMethod);
      setShiprocketOrderId(data.order_id);
      setUserId(session?.user?.id as string);

      const response2 = await fetch("/api/orders/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(useDBOrderStore.getState()),
      });

      const data2 = await response2.json();
      if (!response2.ok) {
        throw new Error("Failed to create order");
      }

      resetDBOrder();
      resetOrder();

      router.push("/yourOrders");
    } else {
      alert("Please select a payment method!");
    }
  };

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto bg-gray-100 text-black flex">
      {/* Left Side: Order Summary */}
      <div className="w-[50%] bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Order</h2>
        <div className="space-y-4">
        {items?.length === 0 ? (
            <p className="text-gray-600">Your cart is empty!</p>
          ) : (
            items?.map((item, index) => (
              <div
                key={index?.toString()}
                className="cart-item flex items-center justify-between mb-4 border p-2 rounded flex-wrap"
              >
                <div className="flex items-center m-2">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                  <div className="flex flex-col justify-center items-center gap-5">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p>Size: {item.size}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-center m-2">
                  <span className="mr-4 font-mono text-xl">Price: ₹{item.price*item.quantity}</span>
                  <span className="font-mono text-lg">Qty: {item.quantity}</span>
                </div>
              </div>
            ))
          )}
          <div className="flex justify-between items-center font-bold text-lg pt-4">
            <p className="font-mono text-2xl">Total: </p>
            <p className="font-bold text-3xl">₹{totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Right Side: Payment Details */}
      <div className="w-[50%] bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment</h1>
        <p className="mb-4">Subtotal: ₹{sub_total}</p>
        <p className="mb-4">
          Shipping Charges: ₹
          {paymentMethod === "COD" ? 150 : 0}
        </p>
        <div className="mb-6">
          <label className="block mb-2">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => {
                handleCODcharges();
                setPaymentMethod(e.target.value);
              }}
              className="mr-2"
            />
            Cash on Delivery
          </label>
          <label className="block">
            <input
              type="radio"
              value="Prepaid"
              checked={paymentMethod === "Prepaid"}
              onChange={(e) => {
                handleCODcharges();
                setPaymentMethod(e.target.value);
              }}
              className="mr-2"
            />
            Prepaid
          </label>
        </div>
        <p className="mb-6 font-bold text-xl">Total Amount: ₹{totalAmount}</p>

        {paymentMethod === "Prepaid" ? (
          <CheckoutButton amount={totalAmount} />
        ) : (
          <button
            onClick={handleFinish}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
