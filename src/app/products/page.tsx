"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState"; // Import the product store
import ProductCard from "@/components/productCard"; // Import the ProductCard component

const fetchProducts = async (): Promise<IProduct[]> => {
  const res = await fetch(`api/getAllProducts`, {
    next: { revalidate: 600 }, // ISR: Revalidate every 600 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data;
};

const FilterPanel = ({ onApplyFilters} : { onApplyFilters: (filters: any) => void }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handlePriceChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPriceRange((prev) =>
      name === "min" ? [Number(value), prev[1]] : [prev[0], Number(value)]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({ priceRange, selectedCategory, selectedTags, selectedSizes });
  };

  return (
    <div className="filter-panel p-4 border rounded-md">
      <h2 className="font-bold mb-4">Filters</h2>
      {/* Price Filter */}
      <div className="mb-4">
        <h3 className="font-medium">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="min"
            value={priceRange[0]}
            onChange={handlePriceChange}
            className="border rounded p-1 w-20"
          />
          <span>to</span>
          <input
            type="number"
            name="max"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="border rounded p-1 w-20"
          />
          <button
            onClick={handleApplyFilters}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Go
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="font-medium">Category</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-1 w-full"
        >
          <option value="">All</option>
          <option value="kurti">Kurti</option>
          <option value="shirt">Shirt</option>
          <option value="saree">Saree</option>
          <option value="salwar">Salwar</option>
          <option value="dupatta">Dupatta</option>
        </select>
      </div>

      {/* Tags Filter */}
      <div className="mb-4">
        <h3 className="font-medium">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {["New Arrival", "Best Seller", "Trending", "Discounted"].map((tag) => (
            <label key={tag} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="mb-4">
        <h3 className="font-medium">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL", "XXL", "FREE-SIZE"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { products, setProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  const applyFilters = ({
    priceRange,
    selectedCategory,
    selectedTags,
    selectedSizes,
  }: {
    priceRange: number[];
    selectedCategory: string;
    selectedTags: string[];
    selectedSizes: string[];
  }) => {
    const filtered = products.filter((product: IProduct) => {
      const price = product.discountedPrice ?? product.price;
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesTags = selectedTags.length > 0
        ? selectedTags.every((tag) => product.tags?.includes(tag))
        : true;
      const matchesSizes = selectedSizes.length > 0
        ? selectedSizes.every((size) => product.sizes?.some((s) => s.size === size))
        : true;

      return inPriceRange && matchesCategory && matchesTags && matchesSizes;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Update filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (products.length === 0) {
      fetchAndSetProducts();
    }
  }, [products, setProducts]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Products</h1>
      <div className="flex gap-8">
        <aside className="w-1/4">
          <FilterPanel onApplyFilters={applyFilters} />
        </aside>
        <main className="w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id.toString()}
                className="product-card-container"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;