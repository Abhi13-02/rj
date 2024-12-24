'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";
import CheckoutButton from "@/components/payments/checkoutButton";
import { useSession } from "next-auth/react";
import useDBOrderStore from "@/store/dbOrders";

const PaymentPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const {data : session} = useSession();
  const updatePaymentMethod = useOrderStore((state) => state.updatePaymentMethod);
  const setDBPaymentMethod = useDBOrderStore((state) => state.setPaymentMethod);
  const setShiprocketOrderId = useDBOrderStore((state) => state.setShiprocketOrderId);
  const setUserId = useDBOrderStore((state) => state.setUserId);
  const resetDBOrder = useDBOrderStore((state) => state.resetOrder);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const sub_total = useOrderStore((state:any) => state.sub_total);
  const shipping_charges = useOrderStore((state:any) => state.shipping_charges);

  const totalAmount = sub_total + shipping_charges;
  

  const router = useRouter();

  // console.log("hiiiiiiii",useDBOrderStore.getState());


  const handleFinish =async () => {
    if (paymentMethod === "COD") {
      updatePaymentMethod("COD");

      const entireState = useOrderStore.getState();
      const dbOrderState = useDBOrderStore.getState();

      const response = await fetch("/api/ship/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entireState),
      });

      const data = await response.json();
      console.log(data);

      if(!response.ok){
        throw new Error("Failed to create order");
      }

      alert("Order placed successfully with COD!");
      setDBPaymentMethod(paymentMethod);
      setShiprocketOrderId(data.order_id);
      setUserId(session?.user?.id as string);
       
      console.log(useDBOrderStore.getState());
    

      ////////DB connection here after correctly handeling address///////////
      
       const response2 = await fetch("/api/orders/cart",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(useDBOrderStore.getState()),
       });

       const data2 = await response2.json();
       console.log(data2);

       if(!response2.ok){
        throw new Error("Failed to create order");
       }
      
      resetDBOrder();
      resetOrder();

      router.push("/yourOrders");

    }
     else {
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
