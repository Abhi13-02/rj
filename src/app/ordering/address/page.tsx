"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";
import useDBOrderStore from "@/store/dbOrders";
import { ShippingAddress } from "@/store/dbOrders";

const AddressPage: React.FC = () => {
  const router = useRouter();
  const orderInfo = useOrderStore((state) => state);
  const addAddress = useOrderStore((state) => state.addAddress);
  const setShippingAddress = useDBOrderStore((state) => state.setShippingAddress);

  console.log("orderInfo", orderInfo);

  useEffect(() => {
    if (!orderInfo || !orderInfo.order_items?.length) {
      router.replace("/products"); 
    }
  }, [orderInfo, router]);

  
  const { items, totalAmount } = useDBOrderStore((state) => state);

  console.log("address items", items);

  const [billingDetails, setBillingDetails] = useState<ShippingAddress>({
    customer_name: "",
    last_name: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = () => {
    addAddress(billingDetails);
    setShippingAddress(billingDetails);
    console.log("Added address to dbOrder", useDBOrderStore.getState());
    router.push("/ordering/payment");
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

      {/* Right Side: Address Form */}
      <div className="w-[50%] bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter Address</h1>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="customer_name"
              placeholder="First Name"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <input
            name="address"
            placeholder="Address Line 1"
            onChange={handleInputChange}
            className="w-full  px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="city"
              placeholder="City"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
            <input
              name="state"
              placeholder="State"
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
