"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useProductStore from "@/store/productState";
import useCartStore from "@/store/cartState";
import ProductCard from "@/components/productCard";
import LoginPanel from "@/components/loginPanel"; // Import your Login Panel component
import useDBOrderStore from "@/store/dbOrders";
import useOrderStore from "@/store/order";

const ProductPage = () => {
  const router = useRouter();
  const { productId } = useParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);
  const { products } = useProductStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showLoginPanel, setShowLoginPanel] = useState(false); // State for login panel
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const resetDBOrder = useDBOrderStore((state) => state.resetOrder);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  useEffect(() => {
    fetchProducts();
    resetDBOrder();
    resetOrder();
  }, []);

  useEffect(() => {
    if (productId) {
      fetch(`/api/singleProduct/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setSelectedSize(data.sizes[0].size);
          setMainImage(data.images[0]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          setLoading(false);
        });
    }
  }, [productId]);

  useEffect(() => {
    const applyFilters = ({ selectedCategory }: { selectedCategory: string | undefined }) => {
      const filtered = products.filter((productt: IProduct) => {
        const matchesCategory = selectedCategory
          ? productt.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;
        return matchesCategory && productt.title !== product?.title;
      });
      setSimilarProducts(filtered);
    };
    applyFilters({ selectedCategory: product?.category });
  }, [product]);

  const handleAddToCart = async () => {
    if (!session) {
      setShowLoginPanel(true); // Show login panel if not logged in
      return;
    }

    const response = await fetch(`/api/addCartItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user?.id,
        image: product?.images[0],
        productId: product?._id,
        name: product?.title,
        price: product?.discountedPrice || product?.price,
        quantity,
        size: selectedSize,
      }),
    });

    if (response.ok && session?.user?.id) fetchCart(session.user.id);
  };

  const handleBuyNow = () => {
    if (!session) {
      setShowLoginPanel(true); // Show login panel if not logged in
      return;
    }
    handleAddToCart();
    // Redirect to the buy page
    router.push("/ordering/address");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Login Panel */}
      {showLoginPanel && <LoginPanel onClose={() => setShowLoginPanel(false)} />}

      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="flex">
          <div className="flex flex-col space-y-2 mr-4">
            {product?.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-20 h-32 object-cover border cursor-pointer"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product?.title}
              className="w-full h-[500px] object-cover border"
            />
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product?.title}</h1>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {product?.discountedPrice ? (
              <>
                <span className="line-through text-gray-500 mr-2">₹{product?.price}</span>
                <span className="text-green-600 font-bold">₹{product?.discountedPrice}</span>
              </>
            ) : (
              <span className="text-gray-800 font-bold">₹{product?.price}</span>
            )}
          </p>
          <p className="text-gray-500 mb-4">{product?.description}</p>

          {/* Select Size */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Size:</label>
            <div className="flex space-x-2">
              {product?.sizes.map((size) => (
                <button
                  key={size.size}
                  className={`px-4 py-2 border ${selectedSize === size.size ? "bg-blue-500 text-white" : ""}`}
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
              <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))} className="px-4 py-2 border bg-gray-200 rounded">
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)} className="px-4 py-2 border bg-gray-200 rounded">
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
    </div>
  );
};

export default ProductPage;
