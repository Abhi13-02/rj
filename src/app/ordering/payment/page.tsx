'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const updatePaymentMethod = useOrderStore((state) => state.updatePaymentMethod);
  const router = useRouter();

  const handleFinish = () => {
    if (paymentMethod === "COD") {
      updatePaymentMethod("COD");
      alert("Order placed successfully with COD!");
      router.push("/dashboard");
    } else if (paymentMethod === "Prepaid") {
      // Razorpay Integration Placeholder
      alert("Payment successful! Order placed with Prepaid.");
      updatePaymentMethod("Prepaid");
      router.push("/dashboard");
    } else {
      alert("Please select a payment method!");
    }
  };

  return (
    <div>
      <h1>Payment</h1>
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
      <button onClick={handleFinish}>Finish</button>
    </div>
  );
};

export default PaymentPage;
