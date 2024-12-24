"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useOrderStore from "@/store/order";

const ProductPage = () => {
  const router = useRouter();
  const { productId } = useParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addOrderItems = useOrderStore((state) => state.addOrderItems);

  useEffect(() => {
    if (productId) {
      fetch(`/api/singleProduct/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setSelectedSize(data.sizes[0].size);
          setMainImage(data.images[0]); // Set the first image as the main image initially
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          setLoading(false);
        });
    }
  }, [productId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found!</div>;
  }

  const handleQuantityChange = (operation: "increment" | "decrement") => {
    if (operation === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (operation === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    // Add the product to the cart
    const response = await fetch(`/api/addCartItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user?.id,
        image: product.images[0],
        productId: product._id,
        name: product.title,
        price: product.discountedPrice
          ? product.discountedPrice
          : product.price,
        quantity,
        size: selectedSize,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    } else {
      console.log("Product added to cart successfully");
      alert(`Added ${quantity} ${product.title}(s) of size ${selectedSize} to cart!`);
    }
  };

  const handleBuyNow = async () => {
    const newOrderItems = [{
      name: product.title,
      sku: product.title+selectedSize,
      units: quantity,
      selling_price: product.discountedPrice ? product.discountedPrice.toString() : product.price.toString(),
      discount: "0",
      tax: "0",
      hsn: 0,
    }];

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(now)
      .replace(",", "");

    addOrderItems(
      newOrderItems,
      Date.now().toString(),
      formattedDate,
      quantity * (product.discountedPrice ? product.discountedPrice : product.price)
    );

    const entireState = useOrderStore.getState();
    console.log(entireState);
    // Navigate to the address page
    router.push("/ordering/address");
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="flex">
          {/* Thumbnail Images */}
          <div className="flex flex-col space-y-2 mr-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-20 h-32 object-cover border cursor-pointer"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-[500px] object-cover border"
            />
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            ₹{product.discountedPrice ?? product.price}{" "}
            {product.discountedPrice && (
              <span className="line-through text-sm text-gray-500">
                ₹{product.price}
              </span>
            )}
          </p>
          <p className="text-gray-500 mb-4">{product.description}</p>

          {/* Select Size */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Size:</label>
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  className={`px-4 py-2 border ${
                    selectedSize === size.size ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Select Quantity */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Quantity:</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="px-4 py-2 border bg-gray-200 rounded"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increment")}
                className="px-4 py-2 border bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button onClick={handleAddToCart} className="px-4 py-2 bg-blue-600 text-white rounded">
              Add to Bag
            </button>
            <button onClick={handleBuyNow} className="px-4 py-2 bg-green-600 text-white rounded">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Dummy Related Products */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded p-4">
              <img
                src={`https://via.placeholder.com/150?text=Product+${item}`}
                alt={`Product ${item}`}
                className="w-full h-auto mb-2"
              />
              <h3 className="text-sm font-medium">Product {item}</h3>
              <p className="text-gray-500 text-sm">₹{item * 1000}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
