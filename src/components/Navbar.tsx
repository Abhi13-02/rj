"use client";

import { FiShoppingBag } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { BsPersonCircle } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import React, { use, useState } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import HamburgerMenu from "./HamburgerMenu";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SignInButton from "./authComp/signInButton";
import useProductStore from "@/store/productState";
import { IProduct } from "@/models/Products";

const playFair = Playfair_Display({ subsets: ["latin"], weight: "400" });

const Navbar = () => {
    let { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchActive, setSearchActive] = useState(false); // Search bar visibility
    const [searchQuery, setSearchQuery] = useState(""); // Search input
    const [searchResults, setSearchResults] = useState<IProduct[]>([]); // Fetched results
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const products = useProductStore((state) => state.products);
    const [cart, setCart] = useState([]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleDropdown = (label: string) => {
        if (openDropdown === label) {
            setOpenDropdown(null); // Close if it's already open
        } else {
            setOpenDropdown(label); // Open the selected dropdown
        }
    };

    const handleSearchIconClick = () => {
        setSearchActive((prev) => !prev);
        setSearchQuery(""); // Clear search query when opening/closing
        setSearchResults([]); // Clear results when toggling
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Simulate fetching search results
        if (query) {
            const simulatedResults = products;
            const filteredResults = simulatedResults.filter((product) =>
                product.title.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <header className="bg-[#A0214D] w-full h-20 sticky top-0 flex items-center justify-between px-6 z-10">
            {/* Hamburger Icon */}
            <button
                className="text-white lg:hidden focus:outline-none"
                onClick={toggleMenu}
            >
                <HamburgerMenu />
            </button>

            {/* Logo */}
            <div className={`text-2xl font-bold text-white ${playFair.className}`}>
                <Link href="/">RJ TRADITIONAL</Link>
            </div>

            {/* Navigation Links */}
            <nav className={`absolute lg:static top-20 left-0 w-full lg:w-auto lg:flex bg-black lg:bg-transparent flex-col lg:flex-row lg:items-center transition-all ${isMenuOpen ? "block" : "hidden"}`} >
                <ul className="flex flex-col lg:flex-row gap-6 p-2">
                        <li className="relative group">
                            <Link href = {`/products`}>
                                <button className="text-white flex items-center">All</button>
                            </Link>
                        </li>
                    {["SAREE", "LENGHA", "SALWAR & KAMEEZ", "KURTI", "DUPATTA"].map((item) => (
                        <li key={item} className="relative group">
                            <Link href = {`/products/${item.toLowerCase()}`}>
                                <button className="text-white flex items-center">{item}</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Utility Icons */}
            <div className="hidden lg:flex gap-6 items-center justify-center relative">
                <div>
                    <BsSearch
                        size={30}
                        className="text-white cursor-pointer font-light"
                        onClick={handleSearchIconClick}
                    />
                </div>
                <Link href="/cart">
                
                  <BsCart3 size={30} className="text-white cursor-pointer font-light" />

                </Link>
                {session ? (
                    <Link href="/yourOrders">
                        <BsPersonCircle size={30} className="text-white cursor-pointer font-light" />
                    </Link>
                ) : (
                    <SignInButton />
                )}

                {/* Search Bar */}
                {searchActive && (
                    <div className="absolute right-24 top-full bg-white shadow-md w-96 p-4 mt-2 rounded-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600"
                        />
                        {searchResults.length > 0 && (
                            <ul className="mt-2 bg-white shadow-md rounded-md max-h-40 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <li
                                        key={index}
                                        className="hover:bg-pink-200 cursor-pointer"
                                    >
                                        <Link href={`/product/${result._id.toString()}`}>
                                            <div className="flex items-center p-2 jestify-center space-x-10">
                                                <Image src={result.images[0]} alt={result.title} width={50} height={50}/>
                                                <span className="ml-2">{result.title}</span>
                                                <p className="text-lg font-semibold text-gray-700 mb-2  ">
                                                {result.discountedPrice ? (
                                                    <>
                                                        <span className="line-through text-gray-500 mr-2">₹{result.price}</span>
                                                        <span className="text-green-600 font-bold">₹{result.discountedPrice}</span>
                                                    </>
                                                    ) : (
                                                    <span className="text-gray-800 font-bold">₹{result.price}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
