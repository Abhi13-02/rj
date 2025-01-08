"use client"

import React, { useState } from "react";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartState";
import Link from "next/link";
import SignIn from "./authComp/signInButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddedToCart from "./addedToCart";
import { set } from "mongoose";
import Image from "next/image";



const ProductCard: React.FC<{ product: IProduct, setShowLoginPanel: React.Dispatch<React.SetStateAction<boolean>> }> = ({ product, setShowLoginPanel }) => {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState(product.sizes.filter((size) => size.stock > 0)[0]?.size || "");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { updateCart, Cart } = useCartStore();
  const isOutOfStock = product.sizes.filter((size) => size.stock > 0).length === 0;
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // console.log( product.title,isOutOfStock);

  const handleIncrease = () => {
    const selectedSize = product.sizes.find(
      (availableSize) => availableSize.size === size
    );
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (!(quantity >= selectedSize.stock)) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!session) {
      setShowLoginPanel(true); // Show login panel if not logged in
      return;
    }
    setIsPanelOpen(true); // Open the size selection panel
  };

  const handleConfirmSize = async () => {
    setIsPanelOpen(false); // Close the size selection panel

    const cartQuantity = Cart.items.find((item) => item.productId === product?._id.toString() && item.size === size)?.quantity || 0;
    const selectedsizeProduct = product.sizes.find((availableSize) => availableSize.size === size)?.stock;
    if (!selectedsizeProduct) return;
    if (quantity + cartQuantity > selectedsizeProduct) {
      toast.error("Quantity exceeds available stock.");
      return;
    }

    const orderItem = {
      userId: session?.user?.id,
      image: product.images[0],
      productId: product._id,
      name: product.title,
      price: product.discountedPrice || product.price,
      quantity,
      size,
    };

    if (session?.user?.id) {
      const response = await fetch(`/api/addCartItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderItem),
      });

      if (!response.ok) {
        console.error("Failed to add product to cart");
        toast.error("Failed to add product to cart.");
        throw new Error("Failed to add product to cart");
      } else {
        console.log("Product added to cart successfully");
        setIsCartOpen(true);
        updateCart(orderItem);
      }
    }
  };

  return (
    <>
      {/* <AddedToCart  toggleCart={toggleCart} isCartOpen={isCartOpen} /> */}
      <div className= {` ${isOutOfStock ? "opacity-70" : ""} relative shadow-sm product-card hover:bg-slate-100 hover:shadow-2xl lg:hover:scale-[1.02] rounded-lg flex-grow max-w-[180px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[300px] lg:p-2  max-h-[280px] md:max-h-[450px] aspect-[2/4] sm:aspect-[12/19] md:aspect-[2/3] lg:aspect-[6/9] xl:aspect-[6/10]`}>
        
       

        {/* Product Image */}
        <Link href={`/product/${product._id.toString()}`}>
          <Image
            width={500}
            height={500}
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-[62%] sm:h-[62%] object-cover rounded-md"
          />
        </Link>

        <div className="px-2">
          {/* Product Name */}
          <h2 className={`text-sm md:text-lg text-gray-700 font-semibold xl:mt-2 line-clamp-2`}>
            {product.title}
          </h2>

          {/* Product Price */}
          <div className="text-green-800 mt-[2px] md:mt-2">
            {product.discountedPrice ? (
              <>
                <span className="line-through text-xs text-gray-500 mr-1">
                  ₹{product.price}
                </span>
                <span className="text-black text-lg md:text-lg xl:text-xl font-medium">
                  ₹{product.discountedPrice}
                </span>{" "}
                |{" "}
                <span className="text-green-800 text-sm md:text-md">
                  {(
                    ((product.price - product.discountedPrice) / product.price) *
                    100
                  ).toFixed(0)}
                  % off
                </span>
              </>
            ) : (
              <span className="text-black text-md md:text-lg xl:text-xl font-medium">₹{product.price}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
       
      </div>
    </>
  );
};

export default ProductCard;
