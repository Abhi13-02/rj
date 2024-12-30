"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IProduct } from "@/models/Products";
import { useSession } from "next-auth/react";
import useProductStore from "@/store/productState";
import useCartStore from "@/store/cartState";
import LoginPanel from "@/components/loginPanel"; // Import your Login Panel component
import useDBOrderStore from "@/store/dbOrders";
import useOrderStore from "@/store/order";
import ScrollableRow from "@/components/scrollableSection";
import { IoBagHandleOutline } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import ImageZoom from "@/components/helpers/ImageZoom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductPage = () => {
  const router = useRouter();
  const { productId } = useParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<IProduct[]>([]);
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
  const addOrderItems = useOrderStore((state) => state.addOrderItems);
  const setItems = useDBOrderStore((state) => state.setItems);
  const Cart = useCartStore((state) => state.Cart);

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
          setSelectedSize(data.sizes.filter((size:any) => size.stock > 0)[0].size);
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

      // For simplicity, fetching best sellers as top products by price
      const topProducts = products.filter((productt: IProduct) => {
        const isLoved = productt.tags.includes("Most Loved");
        return isLoved && productt.title !== product?.title;
      });
      setBestSellers(products);
    };
    applyFilters({ selectedCategory: product?.category });
  }, [product]);


  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found!</div>;
  }

  const handleQuantityChange = (operation: "increment" | "decrement") => { 
    if (operation === "increment") {
      const selectedsizeProduct = product.sizes.find((availableSize) => availableSize.size === selectedSize);

      if (!selectedsizeProduct) {
        alert("Please select a size first.");
        return;
      }
    
      if(!(quantity >= selectedsizeProduct.stock)) {
        setQuantity((prevQuantity) => prevQuantity + 1); 
      }
    } else if (operation === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      setShowLoginPanel(true); // Show login panel if not logged in
      return;
    }

    const cartQuantity = Cart.items.find((item) => item.productId === product?._id.toString() && item.size === selectedSize)?.quantity || 0;
    const selectedsizeProduct = product.sizes.find((availableSize) => availableSize.size === selectedSize)?.stock;
    if(!selectedsizeProduct) return;
      if( quantity + cartQuantity > selectedsizeProduct) {
        toast.error("Quantity exceeds available stock.");
        return;
      }
    
    const response = await fetch(`/api/addCartItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user?.id,
        image: product.images[0],
        productId: product?._id,
        name: product?.title,
        price: product?.discountedPrice || product?.price,
        quantity,
        size: selectedSize,
      }),
    });

    if (response.ok && session?.user?.id){
       fetchCart(session.user.id);
      toast.success("Product added to cart successfully!");
    }
    else{
      toast.error("Failed to add product to cart.");
    }
  };

  const handleBuyNow = () => {
    if (!session) {
      setShowLoginPanel(true); // Show login panel if not logged in
      return;
    }

    if (!product) return;
    ////////setting shiprocket order////
    const newOrderItems = [
      {
        name: product?.title,
        sku: product?.title.substring(0, 10),
        units: quantity,
        selling_price: product?.discountedPrice?.toString() || product?.price.toString(),
        discount: "0",
        tax: "0",
        hsn: 0,
      },
    ];

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
      product?.discountedPrice || product?.price
    );

    //////setting in DB////

    let pricefinal = product?.discountedPrice || product?.price;

    setItems(
      [
        {
          name: product?.title,
          productId: product?._id.toString(),
          quantity: quantity,
          size: selectedSize,
          images: product?.images,
          price: product?.discountedPrice || product?.price,
        },
      ],
      pricefinal*quantity
    );

    // Redirect to the buy page
    router.push("/ordering/address");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
    {/* Login Panel */}
    {showLoginPanel && <LoginPanel onClose={() => setShowLoginPanel(false)} />}
  
    {/* Product Details Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Product Images */}
      <div className="flex flex-col md:flex-row">
        <div className="flex  md:flex-col space-x-2 md:space-x-0 md:space-y-2 order-2 md:order-1 mt-4 md:mt-0">
          {product?.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              className="w-16 md:w-24 h-24 md:h-36 ring-black ring-1 rounded-md object-cover border cursor-pointer"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
        <div className="flex-1 md:ml-5 order-1 md:order-2">
          {/* <img
            src={mainImage}
            alt={product?.title}
            className="w-full h-[300px] md:h-[600px] object-contain border"
          /> */}
          <ImageZoom imageSrc={mainImage} altText={product?.title} />
        </div>
      </div>
  
      {/* Product Information */}
      <div>
        <h1 className="text-2xl font-bold mb-3">{product?.title}</h1>
        <p className="text-lg font-semibold  text-gray-700 my-4">Price:
          {product?.discountedPrice ? (
            <div className="">
              <span className="line-through text-gray-500 mr-2">₹{product?.price}</span>
              <span className="text-black text-3xl font-md">₹{product?.discountedPrice}</span> 
              <span className="text-green-700 text-2xl">
              {""} |{" "} {(((product.price - product.discountedPrice) / product.price) * 100).toFixed(0)}% off
              </span>
            </div>
          ) : (
            <span className="text-gray-700 font-bold">₹{product?.price}</span>
          )}
        </p>
  
        {/* Select Size */}
        <div className="mb-5 ">
          <label className="block font-medium mb-2">Select Size:</label>
          <div className="flex space-x-2 overflow-x-auto">
            {product?.sizes.map((size) => (
              <button
                key={size.size}
                className={`px-4 py-2  border rounded-full ${size.stock > 0 ?
                  (selectedSize === size.size ? "bg-[#FFD8D8] text-[#a22a2a]" : "") :
                  "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                }`}
                onClick={() => {
                  if (size.stock === 0) return;
                  setSelectedSize(size.size);
                  setQuantity(1);
                }}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>
  
        {/* Select Quantity */}
        <div className="mb-5">
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
        <div className="flex w-full space-x-4 mb-6">
          <button
            onClick={handleAddToCart}
            className="flex justify-center items-center gap-4 px-4 py-2 w-[50%] bg-[#A0214D] text-white sm:text-lg rounded"
          >
            Add to Bag <IoBagHandleOutline className="text-xl" />
          </button>
          <button
            onClick={handleBuyNow}
            className="animate-bounce px-4 py-2 flex justify-center items-center gap-4 w-[50%] bg-gray-900 text-white sm:text-lg rounded"
          >
            Buy Now <MdOutlinePayments className="text-xl" />
          </button>
        </div>
  
        {/* Payment Options */}
        <div className="xl:flex mb-4 items-center gap-2">
          <span className="text-black font-semibold mr-1">Pay With :</span>
            <div className="mr-2 flex items-center mt-2 justify-center gap-5">
              <img src="/special/gpay.png" alt="" width={40} />
              <img src="/special/ppay.svg" alt="" width={35} />
              <img src="/special/paytm.svg" alt="" width={60} />
              <img src="/special/razorpay.svg" width={110} alt="" />
            </div>{" "}
          <div className="text-sm text-center">or</div>
          <div className="mx-2 flex items-center justify-center">
            <span className="text-black font-semibold mr-2">Cash on Delivery :</span>
            <MdOutlinePayments className="text-2xl" />
          </div>
        </div>
  
        {/* Product Description */}
        <div className="mb-6">
          <label className="font-medium text-black">Product Description:</label>
          <p className="text-gray-700">{product?.description}</p>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col justify-center items-center space-y-2">
            <img src="/special/quality.png" alt="Fast Delivery" width={80} height={80} />
            <p className="mt-2">Superior Quality</p>
          </div>
          <div className="flex flex-col justify-center items-center space-y-2">
            <img src="/special/truck1.png" alt="Lowest Price" width={75} height={75} />
            <p>Delivery within 7 days</p>
          </div>
          <div>
            <img src="/special/cash.png" alt="Fast Delivery" width={75} height={75} />
            <p className="mt-2">Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  
    <div className="max-w-full mx-auto ">
      <ScrollableRow title="Similar Products" products={similarProducts} />
      <ScrollableRow title="Best Sellers" products={bestSellers} />
    </div>
  </div>
  
  );
};

export default ProductPage;
