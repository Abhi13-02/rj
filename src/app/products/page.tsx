"use client"

import React from "react";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/order";

const products = [
  { id: "prod1", name: "Kunai", price: 900, sku: "chakra123", hsn: 441122 },
  { id: "prod2", name: "Shuriken", price: 500, sku: "chakra456", hsn: 441123 },
  { id: "prod3", name: "Exploding Tag", price: 200, sku: "chakra789", hsn: 441124 },
];

const ProductPage: React.FC = () => {
  const router = useRouter();
  const addOrderItems = useOrderStore((state) => state.addOrderItems);

  const handleBuy = (product: typeof products[0]) => {
    // Create an order item
    const orderItem = {
      name: product.name,
      sku: product.sku,
      units: 1,
      selling_price: product.price.toString(),
      discount: "",
      tax: "",
      hsn: product.hsn,
    };

    // Add order item to store
    addOrderItems([orderItem], "ORD123", new Date().toISOString());

    // Navigate to the address page
    router.push("/ordering/address");
  };

  return (
    <div>
      <h1>Products</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <h2>{product.name}</h2>
            <p>Price: ₹{product.price}</p>
            <button onClick={() => handleBuy(product)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
