// components/CheckoutButton.tsx

"use client";
import useDBOrderStore from "@/store/dbOrders";
import useOrderStore from "@/store/order";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { use } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutButtonProps {
  amount: number;
}

export default function CheckoutButton({ amount }: CheckoutButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const setShiprocketOrderId = useDBOrderStore((state) => state.setShiprocketOrderId);
  const setUserId = useDBOrderStore((state) => state.setUserId);
  const resetDBOrder = useDBOrderStore((state: any) => state.resetOrder);
  const resetOrder = useOrderStore((state: any) => state.resetOrder); 
  const updatePaymentMethod = useOrderStore(
    (state: any) => state.updatePaymentMethod
  );
  const setDBPaymentMethod = useDBOrderStore(
    (state: any) => state.setPaymentMethod
  );

  const handlePayment = async () => {
    try {
      // Step 1: Create an order on the server
      const orderResponse = await fetch("/api/payment/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { order } = await orderResponse.json();
      console.log("Razorpay order data:", order);

      if (!order || !order.id) {
        console.error("Failed to create Razorpay order");
        return;
      }

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key
        amount: order.amount, // Amount in smallest currency unit (e.g., paise)
        currency: "INR",
        name: "Your Store",
        description: "Test Transaction",
        order_id: order.id, // Razorpay order ID from server

        handler: async function (response: any) {
          // Step 3: Verify payment on the server
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyResponse.ok) {
            alert("Payment successful");
            setDBPaymentMethod("Prepaid");
            updatePaymentMethod("Prepaid");
            
            //////creating shiprocketorder/////////
            const response = await fetch("/api/ship/createOrder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(useOrderStore.getState()),
            });
      
            const data = await response.json();
            console.log(data);
      
            if(!response.ok){
              throw new Error("Failed to create shiprockrtOrder");
            }
      
            alert("Order placed successfully with razorpay!");

            ////////DB connection here after correctly handeling address///////////

            setUserId(session?.user?.id as string);
            setShiprocketOrderId(data.order_id);
            
            const response2 = await fetch("/api/orders/cart",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(useDBOrderStore.getState()),
            });

            const data2 = await response2.json();
            console.log(data2);

            if(!response2.ok){
              throw new Error("Failed to create dbOrder");
            }

            resetDBOrder();
            resetOrder();

            router.push("/yourOrders");
            console.log("Payment Verified:", verifyData);
          } else {
            alert("Payment verification failed");
            console.error("Verification failed:", verifyData);
          }
        },
        prefill: {
          name: "Your Name",
          email: "your-email@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Your Address",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        Pay ₹{amount}
      </button>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
