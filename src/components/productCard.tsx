import React, { useState } from "react";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartState";
import Link from "next/link";
import SignIn from "./authComp/signInButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard: React.FC<{ product: IProduct, setShowLoginPanel: React.Dispatch<React.SetStateAction<boolean>> }> = ({ product, setShowLoginPanel }) => {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState(product.sizes.filter((size) => size.stock > 0)[0]?.size || "");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { updateCart, Cart } = useCartStore();

  const isOutOfStock = product.sizes.filter((size) => size.stock > 0).length === 0;

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
        toast.success("Product added to cart successfully!",{autoClose: 2000});
        updateCart(orderItem);
      }
    }
  };

  return (
    <div className= {` ${isOutOfStock ? "opacity-70" : ""} relative shadow-sm product-card hover:bg-slate-100 hover:shadow-2xl lg:hover:scale-[1.02] rounded-lg flex-grow max-w-[180px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[300px] lg:p-2  max-h-[280px] md:max-h-[450px] aspect-[2/4] sm:aspect-[12/19] md:aspect-[2/3] lg:aspect-[6/9] xl:aspect-[6/10]`}>
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 opacity-100 z-8 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md">
          Out of Stock
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${product._id.toString()}`}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-[62%] sm:h-[62%] object-cover rounded-md"
        />
      </Link>

      <div className="px-2">
        {/* Product Name */}
        <h2 className="text-sm md:text-lg text-gray-700 font-semibold xl:mt-2 line-clamp-2">
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
      <button
        onClick={handleAddToCart}
        className="absolute flex items-center justify-center left-0 bottom-0 w-full text-sm md:text-lg h-7 md:h-10 bg-gray-800 text-white py-2 hover:bg-black"
        disabled={isOutOfStock}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>

      {/* Sliding Side Panel */}
      {isPanelOpen && (
        <div className="absolute top-0 md:w-[100%] bg-opacity-90 bg-white shadow-lg z-50 transition-transform duration-300">
          <div className="p-4">
            {session?.user?.id ? (
              <>
                <h3 className="text-xl font-normal mb-4">Select Size & Quantity</h3>
                <div className="size-options mb-4">
                  {product.sizes.map((availableSize) => (
                    <button
                      key={availableSize.size}
                      onClick={() => setSize(availableSize.size)}
                      className={`px-4 py-2 border rounded-md mr-2 ${
                        availableSize.stock > 0
                          ? size === availableSize.size
                            ? "bg-[#FFD8D8] text-[#a22a2a]"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                      }`}
                    >
                      {availableSize.size}
                    </button>
                  ))}
                </div>
                <div className="quantity-controls flex items-center mt-4">
                  <button
                    onClick={handleDecrease}
                    className="px-2 py-1 border rounded-l-md bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="px-2 py-1 border rounded-r-md bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleConfirmSize}
                  className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-black mt-4"
                >
                  Confirm
                </button>
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Login Required</h3>
                <SignIn />
              </div>
            )}

            <button
              onClick={() => setIsPanelOpen(false)}
              className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
