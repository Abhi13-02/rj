"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";
import useDBOrderStore from "@/store/dbOrders";
import { ShippingAddress } from "@/store/dbOrders";

const AddressPage: React.FC = () => {
  const router = useRouter();
  const addAddress = useOrderStore((state) => state.addAddress);
  const setShippingAddress = useDBOrderStore((state) => state.setShippingAddress);

  const [billingDetails, setBillingDetails] = useState<ShippingAddress> ({
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
    setShippingAddress( billingDetails );

    //////for adding address to db////
    // const response = fetch("/api/userAdress", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(billingDetails),
    // });
    // console.log(response);
    
    console.log(useDBOrderStore.getState());
    
    router.push("/ordering/payment");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter Address</h1>
        <form className="space-y-4">
          <input
            name="customer_name"
            placeholder="First Name"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="address"
            placeholder="Address Line 1"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="city"
            placeholder="City"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="pincode"
            placeholder="Pincode"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="state"
            placeholder="State"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
