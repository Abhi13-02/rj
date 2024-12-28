// components/CheckoutButton.tsx

"use client";
import useDBOrderStore from "@/store/dbOrders";
import { useRouter } from "next/navigation";
import Script from "next/script";

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

  const resetDBOrder = useDBOrderStore((state: any) => state.resetOrder);
  const dbOrderState = useDBOrderStore.getState();

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
            setDBPaymentMethod("razorpay");
            // router.push("/dashboard");

            ////////DB connection here after correctly handeling address///////////
            /*
       const response2 = await fetch("/api/orders/cart",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(dbOrderState),
       });

       const data2 = await response2.json();
       console.log(data2);

       if(!response2.ok){
        throw new Error("Failed to create order");
       }
      */

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
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Pay ₹{amount}
      </button>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
