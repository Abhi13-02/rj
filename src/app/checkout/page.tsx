// pages/checkout.tsx
"use client";

import { useState } from "react";
import CheckoutButton from "@/components/payments/checkoutButton";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CheckoutPage = () => {
  const router = useRouter();

  // Example: Mock data for products in cart
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Product 1", price: 500, quantity: 1 },
    { id: "2", name: "Product 2", price: 300, quantity: 2 },
  ]);

  // Calculate total amount
  const totalAmount = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="flex justify-between mb-4">
                <div>
                  <p>{product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                </div>
                <p>${product.price * product.quantity}</p>
              </li>
            ))}
          </ul>
          <hr />
          <div className="flex justify-between mt-4">
            <p className="font-semibold">Total</p>
            <p className="font-bold">${totalAmount}</p>
          </div>
        </div>

        {/* Checkout Button */}
        <CheckoutButton
          amount={totalAmount}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
