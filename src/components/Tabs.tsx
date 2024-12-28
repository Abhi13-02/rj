"use client";
import React, { useState } from "react";
import Image from "next/image";

interface TabsProps {
  tabs: { title: string; content: string[] }[]; // Each tab has a title and an array of content (image URLs)
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;

  const handleNext = () => {
    if (currentIndex + itemsToShow < tabs[activeTab].content.length) {
      setCurrentIndex((prev) => prev + itemsToShow);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsToShow >= 0) {
      setCurrentIndex((prev) => prev - itemsToShow);
    }
  };

  return (
    <div className="flex justify-center items-center bg-blue-100 w-full h-full">
      <div className="w-[70%] h-[90%] bg-white p-8 rounded-2xl shadow-lg">
        {/* Tabs */}
        <div className="relative h-[10%] flex items-center justify-around border-b-2 border-gray-200 mb-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setCurrentIndex(0); // Reset the index on tab change
              }}
              className={`z-10 font-semibold text-lg py-4 ${
                activeTab === index ? "text-white" : "text-gray-500"
              } transition-colors`}
            >
              {tab.title}
            </button>
          ))}
          {/* Animated Line */}
          <div
            className="absolute bg-[#832729] p-0 rounded-full transition-all duration-300 ease-in-out text-white h-10"
            style={{
              width: `${100 / tabs.length}%`,
              left: `${(100 / tabs.length) * activeTab}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative overflow-hidden h-[80%] w-full">
          <div className="flex items-center gap-4 h-full">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.25 19.25L8.75 12.75L15.25 6.25"
                />
              </svg>
            </button>

            {/* Content Items */}
            <div className="flex gap-4 w-full overflow-hidden">
              {tabs[activeTab].content
                .slice(currentIndex, currentIndex + itemsToShow)
                .map((src, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center bg-gray-100 w-[33%] rounded-md shadow-sm transition-opacity duration-500"
                  >
                    <img
                      src={src}
                      alt={`Content ${index}`}
                      className="rounded-lg h-full w-full object-cover"
                    />
                  </div>
                ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={
                currentIndex + itemsToShow >= tabs[activeTab].content.length
              }
              className={`p-2 ${
                currentIndex + itemsToShow >= tabs[activeTab].content.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.75 4.75L15.25 11.25L8.75 17.75"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
