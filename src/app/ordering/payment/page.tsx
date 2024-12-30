'use client';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";
import CheckoutButton from "@/components/payments/checkoutButton";
import { useSession } from "next-auth/react";
import useDBOrderStore from "@/store/dbOrders";

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [paymentMethod, setPaymentMethod] = useState("Prepaid");

  const updatePaymentMethod = useOrderStore((state) => state.updatePaymentMethod);
  const shippingAddress = useDBOrderStore((state) => state.shippingAddress);
  const setDBPaymentMethod = useDBOrderStore((state) => state.setPaymentMethod);
  const setShiprocketOrderId = useDBOrderStore((state) => state.setShiprocketOrderId);
  const setUserId = useDBOrderStore((state) => state.setUserId);

  const resetDBOrder = useDBOrderStore((state) => state.resetOrder);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const { setItems } = useDBOrderStore((state) => state);
  const { updateshippingCharges } = useOrderStore((state) => state);
  const sub_total = useOrderStore((state) => state.sub_total);
  const [totalAmount, setTotalAmount] = useState(sub_total);
  const orderInfo = useOrderStore((state) => state);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!orderInfo || !orderInfo.order_items?.length || !orderInfo.billing_address) {
      router.replace("/products");
    }
  }, [orderInfo, router]);

  const { items } = useDBOrderStore((state) => state);
  const shippingCharges = 150;

  const handleCODcharges = () => {
    if (paymentMethod !== "COD") {
      setTotalAmount(sub_total + shippingCharges);
    }
  };

  const handlePrepaid = () => {
    if (paymentMethod !== "Prepaid") {
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

      toast.success("Order placed successfully with COD!",{autoClose: 5000, position: "top-center"});

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
      toast.error("Please select a payment method!",{autoClose: 3000});
    }
  };

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto bg-gray-100 text-black flex flex-col lg:flex-row">
      {/* Dropdown for small screens */}
      <div className="lg:hidden bg-white p-4 shadow-md mb-4">
        <button
          className="w-full bg-gray-100 text-black py-2 hover:bg-gray-200 transition"
          onClick={() => setOpen(!open)}
        >
          Order Summary (items: {items.length})
        </button>
        {open && (
          <div className="mt-4 space-y-4">
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
                  <span className="mr-4 font-mono text-xl">Price: ₹{item.price * item.quantity}</span>
                  <span className="font-mono text-lg">Qty: {item.quantity}</span>
                </div>
              </div>
              ))
            )}
          <div className="flex justify-between items-center font-bold text-lg pt-4">
            <p className="font-mono text-2xl">sub-Total: </p>
            <p className="font-normal text-3xl">₹{totalAmount}</p>
          </div>
          </div>
        )}
      </div>

      {/* Left Side: Order Summary */}
      <div className="hidden lg:block w-[50%] bg-white p-6 shadow-md">
        <h2 className="text-xl underline decoration-1 underline-offset-8 font-normal mb-4">Your Order</h2>
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
                  <div className="flex flex-col justify-center items-start gap-2">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p>Size: {item.size}</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center m-2">
                  <span className="mr-4 font-mono text-xl">Price: ₹{item.price * item.quantity}</span>
                  <span className="font-mono text-lg">Qty: {item.quantity}</span>
                </div>
              </div>
            ))
          )}
          <div className="flex justify-between items-center font-bold text-lg pt-4">
            <p className="font-mono text-2xl">sub-Total: </p>
            <p className="font-normal text-3xl">₹{totalAmount}</p>
          </div>
        </div>
      </div>

{/* Right Side: Payment Details */}
<div className="w-full lg:w-[50%] bg-white p-4 sm:p-8 shadow-md rounded-lg">
  <h1 className="text-2xl font-bold text-gray-800 mb-6">
    <span className="border-b-4 border-indigo-500 pb-1">Payment</span>
  </h1>
  <div className="space-y-4 text-gray-700">
    <div className="flex justify-between items-center">
      <p className="text-lg">Subtotal:</p>
      <p className="font-semibold text-lg">₹{sub_total}</p>
    </div>
    <div className="flex justify-between items-center">
      <p className="text-lg">Shipping Charges:</p>
      <p className="font-semibold text-lg">
        ₹{paymentMethod === "COD" ? 150 : 0}
      </p>
    </div>
    <hr className="border-t my-4" />
    <div className="flex justify-between items-center text-xl font-semibold">
      <p>Total Amount:</p>
      <p className="text-indigo-600">₹{totalAmount}</p>
    </div>
  </div>

  {/* Payment Method Selection */}
  <div className="mt-6">
    <p className="text-lg font-medium mb-3">Select Payment Method:</p>
    <div className="flex items-center space-x-4">
      <label
        className={`flex items-center cursor-pointer px-4 py-3 rounded-lg border ${
          paymentMethod === "COD"
            ? "bg-indigo-100 border-indigo-500"
            : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={() => {
            setPaymentMethod("COD");
            handleCODcharges();
          }}
          className="hidden"
        />
        <span className="text-gray-800 font-medium">Cash on Delivery</span>
      </label>

      <label
        className={`flex items-center cursor-pointer px-4 py-3 rounded-lg border ${
          paymentMethod === "Prepaid"
            ? "bg-indigo-100 border-indigo-500"
            : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          value="Prepaid"
          checked={paymentMethod === "Prepaid"}
          onChange={() => {
            setPaymentMethod("Prepaid");
            handlePrepaid();
          }}
          className="hidden"
        />
        <span className="text-gray-800 font-medium">Prepaid</span>
      </label>
    </div>
  </div>

  {/* Finish Button */}
    <div className="mt-8">
      {paymentMethod === "COD" ? ( 
        <button
          onClick={handleFinish}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Place Order
        </button>
      ) : <CheckoutButton amount={totalAmount} />
      }
    </div>

    <div className="sm:flex mb-4 items-center justify-center gap-2 mt-3">
                <div className="mr-2 flex items-center mt-2 justify-center gap-5">
                  <img src="/special/gpay.png" alt="" width={40} />
                  <img src="/special/ppay.svg" alt="" width={35} />
                  <img src="/special/paytm.svg" alt="" width={60} />
                  <img src="/special/razorpay.svg" width={110} alt="" />
                </div>
    </div>

    <h2 className="font-semibold mt-4">Shipping Address</h2>
                <p className="text-sm text-gray-600">
                  {shippingAddress?.address},{" "}
                  {shippingAddress?.city},{" "}
                  {shippingAddress?.state}-{shippingAddress?.pincode}, Phone:{" "}
                  {shippingAddress?.phone}, Email: {shippingAddress?.email}
                </p>
  </div>

</div>
  );
};

export default PaymentPage;
