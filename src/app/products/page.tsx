"use client";

import React, { useEffect } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState"; // Import the product store
import ProductCard from "@/components/productCard"; // Import the ProductCard component

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
  const [isFetching, setIsFetching] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      setIsFetching(true); // Mark fetching as true
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsFetching(false); // Mark fetching as complete
        setHasFetched(true); // Mark that fetch attempt has been made
      }
    };

    // Only fetch products if not already fetched
    if (!hasFetched) {
      fetchAndSetProducts();
    }
  }, [hasFetched, setProducts]); // Remove `products` to prevent infinite fetches

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {isFetching ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product._id.toString()} className="product-card-container">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
