import React, { useState } from "react";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useCartStore from "@/store/cartState";
import Link from "next/link";
import SignIn from "./authComp/signInButton";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { updateCart } = useCartStore();

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
    setIsPanelOpen(true); // Open the size selection panel
  };

  const handleConfirmSize = async () => {
    if (!size) {
      alert("Please select a size before proceeding.");
      return;
    }
    setIsPanelOpen(false); // Close the size selection panel

    // Add the product to the cart
    const orderItem = {
      userId: session?.user?.id,
      image: product.images,
      productId: product._id.toString(),
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
        throw new Error("Failed to add product to cart");
      } else {
        console.log("Product added to cart successfully");
        updateCart(orderItem);
      }
    }
  };

  return (
    <div className="relative p-2 product-card  hover:bg-slate-100 lg:hover:scale-[1.02] rounded-lg w-[160px] lg:w-[280px] h-[500px] ">
      {/* Product Image */}
      <Link href={`/product/${product._id.toString()}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className=" w-full h-[250px] sm:h-[72%] object-cover rounded-md"
          />
      </Link>

      {/* Product Name */}
      <h2 
        className="sm:px-3 w-full sm:h-auto overflow-y-auto text-md font-semibold mt-2"
      >
        {window.innerWidth < 640 && product.title.length > 18
          ? product.title.substring(0, 18) + "..."
          : product.title}
      </h2>


      {/* Product Price */}
      <div className="product-price mt-2 sm:px-3 text-green-800">
        {product.discountedPrice ? (
          <>
            <span className="line-through text-sm text-gray-500 mr-1">
              ₹{product.price}
            </span>
            <span className="text-black text-lg font-medium">
              ₹{product.discountedPrice}
            </span>{" "}
            |{" "}
            <span className="text-green-800">
              {(
                ((product.price - product.discountedPrice) / product.price) *
                100
              ).toFixed(0)}
              %off
            </span>
          </>
        ) : (
          <span className="text-gray-800 font-bold">₹{product.price}</span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="add-to-cart-btn hover:cursor-pointer absolute left-0 bottom-0 w-full bg-black text-white py-2  hover:bg-gray-700 mt-8"
      >
        Add to Cart
      </button>

      {/* Sliding Side Panel */}
      {isPanelOpen && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 transform translate-x-0">
          <div className="p-4">
            {session?.user?.id ? (
              <>
                <h3 className="text-xl font-bold mb-4">Select Size</h3>
                <div className="size-options mb-4">
                  {product.sizes.map((availableSize) => (
                    <button
                      key={availableSize.size}
                      onClick={() => setSize(availableSize.size)}
                      className={`px-4 py-2 border rounded-md mr-2 ${
                        size === availableSize.size
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-black hover:bg-gray-200"
                      }`}
                    >
                      {availableSize.size}
                    </button>
                  ))}
                </div>

                {/* Quantity Controls */}
                <div className="quantity-controls flex items-center mt-4">
                  <button
                    onClick={handleDecrease}
                    className="px-2 py-1 border rounded-l-md bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="px-2 py-1 border rounded-r-md bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleConfirmSize}
                  className="confirm-btn w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 mt-4"
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
              className="cancel-btn w-full bg-red-600 text-white py-2 rounded-md mt-4 hover:bg-red-700"
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
