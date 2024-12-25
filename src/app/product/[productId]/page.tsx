"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useOrderStore from "@/store/order";
import useDBOrderStore from "@/store/dbOrders";
import { OrderItem } from "@/models/Orders";
import { set } from "mongoose";
import useProductStore from "@/store/productState";
import ProductCard from "@/components/productCard";

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
  const addOrderItems = useOrderStore((state) => state.addOrderItems);
  const setItems = useDBOrderStore((state) => state.setItems);
  let orderItems: OrderItem[] = useDBOrderStore((state) => state.items);

  const { fetchProducts} = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, []);

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

  useEffect(() => {
      const applyFilters = ({
          selectedCategory
        }: {
          selectedCategory: string | undefined
        }) => {
          const filtered = products.filter((productt: IProduct) => {
            const matchesCategory = selectedCategory
              ? productt.category.toLowerCase() === selectedCategory.toLowerCase()
              : true;
            return matchesCategory && productt.title !== product?.title;
          });
          setSimilarProducts(filtered);
        };
        applyFilters({selectedCategory: product?.category});
    }, [product]);


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
    }

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

    console.log(useOrderStore.getState());

    const items: OrderItem[] = orderItems;

    items.push({
      name: product.title,
      productId: product._id.toString(),
      quantity: quantity,
      size: selectedSize,
      images: product.images,
      price: product.discountedPrice ? product.discountedPrice : product.price
    });

    setItems(items, quantity * (product.discountedPrice ? product.discountedPrice : product.price));

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
            {product.discountedPrice ? (
            <>
              <span className="line-through text-gray-500 mr-2">₹{product.price}</span>
              <span className="text-green-600 font-bold">₹{product.discountedPrice}</span>
            </>
              ) : (
                <span className="text-gray-800 font-bold">₹{product.price}</span>
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
          {similarProducts.map((item, index) => (
            <div
            key={item._id.toString()}
            className="product-card-container"
          >
            <ProductCard product={item} />
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
