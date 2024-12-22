'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";
import CheckoutButton from "@/components/payments/checkoutButton";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const updatePaymentMethod = useOrderStore((state) => state.updatePaymentMethod);

  const sub_total = useOrderStore((state) => state.sub_total);
  const shipping_charges = useOrderStore((state) => state.shipping_charges);

  const totalAmount = sub_total + shipping_charges;
  

  const router = useRouter();

  const handleFinish =async () => {
    if (paymentMethod === "COD") {
      updatePaymentMethod("COD");

      //POST request for the shiprocket API
      const entireState = useOrderStore.getState();
      console.log(entireState);
      const response = await fetch("/api/ship/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entireState),
      });

      console.log(response);
      if(!response.ok){
        throw new Error("Failed to create order");
      }
      alert("Order placed successfully with COD!");
      router.push("/dashboard");
    } else {
      alert("Please select a payment method!");
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <p>Subtotal: ₹{sub_total}</p>
      <p>Shipping Charges: ₹{shipping_charges}</p>
      <p>Total Amount: ₹{totalAmount}</p>
      <div>
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>
        <label>
          <input
            type="radio"
            value="Prepaid"
            checked={paymentMethod === "Prepaid"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Prepaid
        </label>
      </div>

      {paymentMethod === "Prepaid" ? (
        <CheckoutButton amount={totalAmount} />
      ) : (
        <button onClick={handleFinish}>Finish</button>
      )}
    </div>
  );
};

export default PaymentPage;
