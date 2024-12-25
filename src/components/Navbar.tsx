"use client";

import { FiShoppingBag } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import React, { useState } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import HamburgerMenu from "./HamburgerMenu";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SignInButton from "./authComp/signInButton";


const playFair = Playfair_Display({ subsets: ["latin"], weight: "400" });

const Navbar = () => {
    let {data : session} = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleDropdown = (label: string) => {
        if (openDropdown === label) {
            setOpenDropdown(null); // Close if it's already open
        } else {
            setOpenDropdown(label); // Open the selected dropdown
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
                <Link href="/">
                    RJ TRADITIONAL
                </Link>
            </div>


            {/* Navigation Links */}
            <nav
                className={`absolute lg:static top-20 left-0 w-full lg:w-auto lg:flex bg-pink-700 lg:bg-transparent flex-col lg:flex-row lg:items-center transition-all ${isMenuOpen ? "block" : "hidden"
                    }`}
            >
                <ul className="flex flex-col lg:flex-row gap-6 p-2">
                        <li className="relative group">
                            <Link href="/products">
                                <button className="text-white flex items-center">
                                    ALL
                                </button>
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/products">
                                <button className="text-white flex items-center">
                                    SAREES
                                </button>
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/products">
                                <button className="text-white flex items-center">
                                    LENGHA
                                </button>
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/products">
                                <button className="text-white flex items-center">
                                    SALWAR & KAMEEZ
                                </button>
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/products">
                                <button className="text-white flex items-center">
                                    KURTI
                                </button>
                            </Link>
                        </li>
                        <li className="relative group">
                            <Link href="/products">
                                <button className="text-white flex items-center">
                                    DUPATTA
                                </button>
                            </Link>
                        </li>
                </ul>
            </nav>

            {/* Utility Icons */}
            <div className="hidden lg:flex gap-6 items-center justify-center">
                <div>
                 <BsSearch size={30} className="text-white cursor-pointer font-light"/>
                </div>
                <Link href="/wishlist">
                  <CiHeart size={40} className="text-white cursor-pointer font-light" />
                </Link>
                {session ? (
                    <Link href="/profile">
                    <BsPersonCircle size={30} className="text-white cursor-pointer font-light" />
                  </Link>
                ):<SignInButton/>}
                {/* <Link href="/profile">
                  <BsPersonCircle size={30} className="text-white cursor-pointer font-light" />
                </Link> */}
                <Link href="/cart">
                  <FiShoppingBag size={30} className="text-white cursor-pointer font-light"/>
                </Link>
                {/* Add more icons if necessary */}
            </div>
        </header>
    );
};

export default Navbar;
