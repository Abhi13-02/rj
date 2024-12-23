"use client";

import React, { useEffect } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState"; 
import ProductCard from "@/components/productCard"; 


const fetchProducts = async (): Promise<IProduct[]> => {
  const res = await fetch(`api/getAllProducts`, {
    next: { revalidate: 600 }, // ISR: Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data; 
};

const ProductPage = () => {
  const { products, setProducts } = useProductStore();

  useEffect(() => {
    // Fetch products and update Zustand state
    const fetchAndSetProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Fetch products only if the store is empty
    if (products.length === 0) {
      fetchAndSetProducts();
    }
  }, [products, setProducts]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {products.map((product) => (
          <div key={product._id.toString()} className="product-card-container">
            <ProductCard product = {product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
