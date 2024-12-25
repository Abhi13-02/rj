"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState";
import ProductCard from "@/components/productCard";
import { useParams } from "next/navigation";


const FilterPanel = ({
  onApplyFilters,
}: {
  onApplyFilters: (filters: any) => void;
}) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPriceRange((prev) =>
      name === "min" ? [Number(value), prev[1]] : [prev[0], Number(value)]
    );
  };

  const toggleSelection = (
    item: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      priceRange,
      selectedTags,
      selectedSizes,
      selectedColors,
    });
  };

  return (
    <div className="filter-panel bg-white p-6 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">Filters</h2>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-600 mb-2">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="min"
            value={priceRange[0]}
            onChange={handlePriceChange}
            className="border rounded-lg p-2 w-20 text-sm"
            placeholder="Min"
          />
          <span>to</span>
          <input
            type="number"
            name="max"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="border rounded-lg p-2 w-20 text-sm"
            placeholder="Max"
          />
          <button
            onClick={handleApplyFilters}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-600 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-3">
          {["New Arrival", "Best Seller", "Trending", "Discounted"].map((tag) => (
            <label key={tag} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleSelection(tag, setSelectedTags)}
                className="rounded focus:ring-red-500 text-red-500"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-600 mb-2">Sizes</h3>
        <div className="flex flex-wrap gap-3">
          {["S", "M", "L", "XL", "XXL", "FREE-SIZE"].map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => toggleSelection(size, setSelectedSizes)}
                className="rounded focus:ring-red-500 text-red-500"
              />
              <span className="text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-600 mb-2">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink"].map(
            (color) => (
              <label key={color} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleSelection(color, setSelectedColors)}
                  className="rounded focus:ring-red-500 text-red-500"
                />
                <span className="text-sm text-gray-700">{color}</span>
              </label>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { fetchProducts } = useProductStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const { category } = useParams() as { category: string };

  const applyFilters = ({
    priceRange,
    selectedTags,
    selectedSizes,
    selectedColors,
  }: {
    priceRange: number[];
    selectedCategory: string;
    selectedTags: string[];
    selectedSizes: string[];
    selectedColors: string[];
  }) => {
    console.log("Applying filters:", { priceRange, selectedTags, selectedSizes, selectedColors });
    const filtered = products.filter((product: IProduct) => {
      const price = product.discountedPrice ?? product.price;
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const matchesCategory = product.category.toLowerCase() === category.toLowerCase();
      const matchesTags = selectedTags.length > 0
        ? selectedTags.every((tag) => product.tags?.includes(tag))
        : true;
      const matchesSizes = selectedSizes.length > 0
        ? selectedSizes.every((size) =>
            product.sizes?.some((s) => s.size === size)
          )
        : true;
      const matchesColors = selectedColors.length > 0
        ? selectedColors.some((color) => product.tags?.includes(color))
        : true;

      console.log("inPriceRange:", inPriceRange);
      console.log("matchesCategory:", matchesCategory);
      console.log("matchesTags:", matchesTags);
      console.log("matchesSizes:", matchesSizes);
      console.log("matchesColors:", matchesColors);

      return inPriceRange && matchesCategory && matchesTags && matchesSizes && matchesColors;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await fetchProducts(); // Wait for the products to be fetched
      setProducts(useProductStore.getState().products); // Apply initial products as filtered products
    };
    initializeProducts();
  }, []); 

  useEffect(() => {
    console.log("filteredProducts:", filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    const applyFilters = ({
        selectedCategory
      }: {
        selectedCategory: string
      }) => {
        const filtered = products.filter((product: IProduct) => {
          const matchesCategory = selectedCategory
            ? product.category.toLowerCase() === selectedCategory.toLowerCase()
            : true;

          return matchesCategory ;
        });
        setFilteredProducts(filtered);
      };
      applyFilters({selectedCategory: category});
  }, [products]);

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
