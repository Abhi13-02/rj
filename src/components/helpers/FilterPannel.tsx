import React, { useState } from 'react'

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
            {["S", "M", "L", "XL", "XXL","XXXL", "FREE-SIZE"].map((size) => (
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

export default FilterPanel