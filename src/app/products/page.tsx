"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState";
import ProductCard from "@/components/productCard";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginPanel from "@/components/loginPanel";

const FilterPanel = ({
  onApplyFilters,
}: {
  onApplyFilters: (filters: any) => void;
}) => {
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
       [key: string]: boolean;
     }>({
       price: false,
       category: false,
       tags: false,
       sizes: false,
       colors: false,
     });

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(event.target.value);
    setPriceRange((prev) => [prev[0], newPrice]);
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full bg-[#FFFAFA] p-6 border rounded-lg shadow-md">
      <h2 className=" text-xl sm:text-3xl font-light mb-6 text-gray-900">Filters</h2>
      <hr className=" h-[1.5px] bg-pink-800" />

      {/* Price Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-600">Price</h3>
          <button
            onClick={() => toggleSection("price")}
            className="text-gray-500 text-4xl hover:text-gray-700 focus:outline-none"
          >
            {expandedSections.price ? "−" : "+"}
          </button>
        </div>
        {expandedSections.price && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <input
              type="range"
              min={0}
              max={6000}
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full "
            />
            <div className="flex w-full justify-between text-sm mt-2">
              <span>₹0</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      <hr className=" h-[1.5px] bg-pink-800" />
     

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-600">Category</h3>
          <button
            onClick={() => toggleSection("category")}
            className="text-gray-500 text-4xl  hover:text-gray-700 focus:outline-none"
          >
            {expandedSections.category ? "−" : "+"}
          </button>
        </div>
        {expandedSections.category && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg p-2 w-full text-sm mt-2"
          >
            <option value="">All</option>
            <option value="saree">Saree</option>
            <option value="lehenga">Lehenga</option>
            <option value="suits">Suits</option>
            <option value="kurti">Kurti</option>
            <option value="dupatta">Dupatta</option>
          </select>
        )}
      </div>
      
     
      <hr className=" h-[1.5px] bg-pink-800 " />

      {/* Tags Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-600">Tags</h3>
          <button
            onClick={() => toggleSection("tags")}
            className="text-gray-500 text-4xl hover:text-gray-700 focus:outline-none"
          >
            {expandedSections.tags ? "−" : "+"}
          </button>
        </div>
        {expandedSections.tags && (
          <div className="flex flex-wrap gap-3 mt-2">
            {[
              "Banarsi Saree",
              "Ghatchola Saree",
              "Georgette",
              "Dola Silk Lehenga",
              "Kota Doirya Lehenga",
              "Art Silk Lehenga",
            ].map((tag) => (
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
        )}
      </div>
     
      <hr className=" h-[1.5px] bg-pink-800" />

      {/* Sizes Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-600">Sizes</h3>
          <button
            onClick={() => toggleSection("sizes")}
            className="text-gray-500 text-4xl hover:text-gray-700 focus:outline-none"
          >
            {expandedSections.sizes ? "−" : "+"}
          </button>
        </div>
        {expandedSections.sizes && (
          <div className="flex flex-wrap gap-3 mt-2">
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
        )}
      </div>

      <hr className=" h-[1.5px] bg-pink-800" />
      <hr className=" h-[1.5px] bg-pink-800" />
      

      {/* Colors Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-600">Colors</h3>
          <button
            onClick={() => toggleSection("colors")}
            className="text-gray-500 text-4xl hover:text-gray-700 focus:outline-none"
          >
            {expandedSections.colors ? "−" : "+"}
          </button>
        </div>
        {expandedSections.colors && (
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "Multicolor",
              "Black",
              "Red",
              "Blue",
              "Green",
              "Yellow",
              "Orange",
              "Purple",
              "Pink",
              "White",
              "Grey",
              "Brown",
            ].map((color) => (
              <label key={color} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleSelection(color, setSelectedColors)}
                  className="rounded focus:ring-red-500 text-red-500"
                />
                <span className="text-sm text-gray-700">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleApplyFilters}
        className="bg-[#bd3564] mt-2 text-white px-4 py-2 rounded-lg shadow hover:bg-[#A0214D] transition"
      >
        Apply
      </button>
    </div>
  );
};

const ProductPage = () => {
  const { fetchProducts } = useProductStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [showFilter, setShowFilter] = useState(false); // For mobile filter toggle
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [loading, setLoading] = useState(true);

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
      const price = product.discountedPrice
        ? product.discountedPrice
        : product.price;
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const matchesCategory = selectedCategory
        ? product.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesTags =
        selectedTags.length > 0
          ? selectedTags.some((tag) => product.tags?.includes(tag))
          : true;
      const matchesSizes =
        selectedSizes.length > 0
          ? selectedSizes.some((size) =>
              product.sizes?.some((s) => s.size === size)
            )
          : true;
      const matchesColors =
        selectedColors.length > 0
          ? selectedColors.some((color) => product.tags?.includes(color))
          : true;

      return (
        inPriceRange &&
        matchesCategory &&
        matchesTags &&
        matchesSizes &&
        matchesColors
      );
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await fetchProducts();
      setProducts(useProductStore.getState().products);
      setFilteredProducts(useProductStore.getState().products);
      setLoading(false);
    };
    initializeProducts();
  }, []);

  return (
    
    <div className=" p-2 md:p-4 flex flex-col lg:flex-row gap-6 h-min-screen">
      {/* Hamburger Menu */}
      <button
        className="lg:hidden flex items-center gap-2 bg-gray-100 text-black px-4 py-2 rounded shadow"
        onClick={() => setShowFilter(!showFilter)}
      >
        {showFilter ? <FaTimes /> : <FaBars />} Filters
      </button>

      {/* Filter Panel */}
      <aside
        className={`${
          showFilter ? "block" : "hidden"
        } lg:block lg:w-1/4 bg-white shadow-lg p-4 max-w-[330px]`}
      >
        <FilterPanel onApplyFilters={applyFilters} />
      </aside>

      {/* Product Grid */}
      <main className="w-full lg:w-3/4">
      <h1 className="text-xl sm:text-2xl mb-8 text-center font-serif text-gray-900 relative">
        All PRODUCTS
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-24 sm:w-32 h-[2px] bg-gray-700">
          <span className="block w-8 sm:w-12 h-[2px] bg-pink-400 mx-auto mt-1"></span>
        </span>
      </h1>



         {/* Login Panel */}
         {showLoginPanel && <LoginPanel onClose={() => setShowLoginPanel(false)} />}

         {
            filteredProducts.length === 0 && (
              <div className="flex justify-center items-center w-full h-max  p-4">
              <div className="text-center space-y-4">
                <p className="text-gray-800 text-xl md:text-4xl font-semibold animate-pulse">
                  More Products Coming Soon... 😉
                </p>
                <p className="text-gray-600 text-sm md:text-lg">
                  Stay tuned! 
                </p>
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
            )
          }

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-y-5 gap-x-2 md:gap-5 place-items-center">
       
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} setShowLoginPanel={setShowLoginPanel}   />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
