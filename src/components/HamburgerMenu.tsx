"use client";

import React, { useState } from "react";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`relative w-6 h-6 flex flex-col justify-between items-center cursor-pointer ${
        isOpen ? "open" : ""
      }`}
      onClick={toggleMenu}
    >
      <span
        className={`block w-6 h-1 rounded bg-white transition-all duration-300 ease-in-out transform ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      ></span>
      <span
        className={`block w-6 h-1 rounded bg-white transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-0" : ""
        }`}
      ></span>
      <span
        className={`block w-6 h-1 rounded bg-white transition-all duration-300 ease-in-out transform ${
          isOpen ? "-rotate-45 -translate-y-3" : ""
        }`}
      ></span>
    </div>
  );
};

export default HamburgerMenu;
