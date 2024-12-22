"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";

const AddressPage: React.FC = () => {
  const router = useRouter();
  const addAddress = useOrderStore((state) => state.addAddress);

  const [billingDetails, setBillingDetails] = useState({
    customer_name: "",
    last_name: "",
    address: "",
    address_2: "",
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
    router.push("/ordering/payment");
  };

  return (
    <div>
      <h1>Enter Address</h1>
      <form>
        <input name="customer_name" placeholder="First Name" onChange={handleInputChange} />
        <input name="last_name" placeholder="Last Name" onChange={handleInputChange} />
        <input name="address" placeholder="Address Line 1" onChange={handleInputChange} />
        <input name="address_2" placeholder="Address Line 2" onChange={handleInputChange} />
        <input name="city" placeholder="City" onChange={handleInputChange} />
        <input name="pincode" placeholder="Pincode" onChange={handleInputChange} />
        <input name="state" placeholder="State" onChange={handleInputChange} />
        <input name="email" placeholder="Email" onChange={handleInputChange} />
        <input name="phone" placeholder="Phone" onChange={handleInputChange} />
        <button type="button" onClick={handleProceed}>
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default AddressPage;
