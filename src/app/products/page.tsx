"use client";

import React, { Suspense, useEffect, useState } from "react";
import { IProduct } from "@/models/Products";
import useProductStore from "@/store/productState";
import dynamic from "next/dynamic";
//import ProductCard from "@/components/productCard";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginPanel from "@/components/loginPanel";
//import FilterPanel from "@/components/helpers/FilterPannel";
import Skeleton from "@/components/Skeleton";

const ProductCard = dynamic(() => import("@/components/productCard"));
const FilterPanel = dynamic(() => import("@/components/helpers/FilterPannel"));

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
        <Suspense fallback={<Skeleton type="filter" />}>
          <FilterPanel onApplyFilters={applyFilters} />
        </Suspense>
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
         {showLoginPanel && (
          <Suspense fallback={<Skeleton type="panel" />}>
            <LoginPanel onClose={() => setShowLoginPanel(false)} />
          </Suspense>
        )}

         {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} type="card" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center w-full min-h-[300px] p-4">
            <div className="text-center space-y-4">
              <p className="text-gray-800 text-xl md:text-4xl font-semibold animate-pulse">
                No products found.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id.toString()} product={product} setShowLoginPanel={setShowLoginPanel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
