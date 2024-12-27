import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/productCard";
import { IProduct } from "@/models/Products";

const ScrollableRow = ({ title, products }: { title: string; products: IProduct[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollLeft}
          aria-label="Scroll Left"
        >
          <FaChevronLeft />
        </button>

        {/* Product List */}
        <div
          className="flex space-x-4 overflow-x-auto no-scrollbar"
          ref={scrollRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0" // Set a fixed width for each product card
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollRight}
          aria-label="Scroll Right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ScrollableRow;
