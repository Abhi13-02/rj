"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState";
import ProductCard from "@/components/productCard";
import { FaBars, FaTimes } from "react-icons/fa";

const FilterPanel = ({
  onApplyFilters,
}: {
  onApplyFilters: (filters: any) => void;
}) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("");
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
      selectedCategory,
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

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-600 mb-2">Category</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg p-2 w-full text-sm"
        >
          <option value="">All</option>
          <option value="saree">Saree</option>
          <option value="lehenga">Lehenga</option>
          <option value="suits">Suits</option>
          <option value="kurti">Kurti</option>
          <option value="dupatta">Dupatta</option>
        </select>
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-600 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-3">
          {["Banarsi Saree", "Ghatchola Saree","Georgette", "Dola Silk Lehenga","Kota Doirya Lehenga","Art Silk Lehenga"].map((tag) => (
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
          {["Multicolor", "Black", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink","White", "Grey", "Brown"].map(
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
  const [showFilter, setShowFilter] = useState(false); // For mobile filter toggle

  const applyFilters = ({
    priceRange,
    selectedCategory,
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
    const filtered = products.filter((product: IProduct) => {
      const price = product.discountedPrice ?? product.price;
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const matchesCategory = selectedCategory
        ? product.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
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

      return inPriceRange && matchesCategory && matchesTags && matchesSizes && matchesColors;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await fetchProducts();
      setProducts(useProductStore.getState().products);
      setFilteredProducts(useProductStore.getState().products);
    };
    initializeProducts();
  }, []);

  return (
    <div className="container mx-auto px-3 h-screen  flex flex-wrap overflow-scroll">
      <h1 className="text-2xl font-thin w-full h-12 flex items-center justify-center  my-2 sm:mb-4 text-center">All Products</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Hamburger Menu */}
        <button
          className="lg:hidden bg-gray-100 text-black text-lg px-4 py-1 shadow flex items-center gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? <FaTimes /> : <FaBars />} Filters
        </button>

        {/* Filter Panel */}
        <aside
          className={`lg:block lg:w-[20%] ${
            showFilter ? "block" : "hidden"
          } bg-white p-4 lg:p-0`}
        >
          <FilterPanel onApplyFilters={applyFilters} />
        </aside>

        {/* Product Grid */}
        <main className="w-full lg:w-[80%] h-full ">
          <div className="grid lg:w-full h-full grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-4">
            {filteredProducts.map((product,index) => (
             
                <ProductCard key={index} product={product} />
              
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
