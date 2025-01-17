"use client";
import { MdDeleteOutline } from "react-icons/md";
import React, { use, useEffect, useState } from "react";
import { CartItem, ICart } from "@/store/cartState";
import { useSession, signIn } from "next-auth/react";
import useOrderStore from "@/store/order";
import { useRouter } from "next/navigation";
import useDBOrderStore from "@/store/dbOrders";
import { OrderItem } from "@/models/Orders";
import Link from "next/link";
import useCartStore from "@/store/cartState";
import useProductStore from "@/store/productState";
import Loading from "@/components/loading";
import { toast } from "react-toastify";
import { set } from "mongoose";
import { IProduct } from "@/models/Products";

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const addOrderItems = useOrderStore((state) => state.addOrderItems);
  const setItems = useDBOrderStore((state) => state.setItems);
  let orderItems: OrderItem[] = useDBOrderStore((state) => state.items);
  let totalAmount: number = useDBOrderStore((state) => state.totalAmount);
  const resetDBOrder = useDBOrderStore((state) => state.resetOrder);
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const {fetchCart, Cart } = useCartStore((state) => state);
  const {products,fetchProducts} = useProductStore((state) => state);
  const [outOfStockItems, setOutOfStockItems] = useState<CartItem[]>([]);
  const [inStockItems, setInStockItems] = useState<CartItem[]>([]);
  const cart = useCartStore((state) => state.Cart);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCartt();
    } else {
      setLoading(false);
    }
  }, [session, products, Cart]);

  const fetchCartt = async () => {
    // try {
    //   const response = await fetch(`/api/showCart?userId=${session?.user?.id}`);
    //   const data = await response.json();
    //   console.log("Cart data:", data);

    //   if (!response.ok) {
    //     toast.error("Failed to fetch cart");
    //     throw new Error(data.error || "Failed to fetch cart");
    //   }
    
      setCartItems(Cart.items);

      const oosItems = Cart.items.filter((item : CartItem) => {
        const product = products.find((p) => p._id.toString() === item.productId);
        // console.log("oosItems...",product,products);
        const selectedsizeProduct = product?.sizes.find((availableSize : any) => availableSize.size === item.size);
        if(!selectedsizeProduct) return false;
        console.log("oosItems...",selectedsizeProduct.stock, item.quantity);
        return selectedsizeProduct?.stock < 1 || selectedsizeProduct?.stock < item.quantity || selectedsizeProduct === undefined;
      });

      const inItems = Cart.items.filter((item : CartItem) => {
        const product = products.find((p:IProduct) => p._id.toString() === item.productId);
        // console.log("oosItems...",product,products);
        const selectedsizeProduct = product?.sizes.find((availableSize : any) => availableSize.size === item.size);
        if(!selectedsizeProduct) return false;
        console.log("inItems...",selectedsizeProduct.stock, item.quantity);
        return !(selectedsizeProduct?.stock < 1) && !(selectedsizeProduct?.stock < item.quantity) && !(selectedsizeProduct === undefined);
      });

      setInStockItems(inItems);
      setOutOfStockItems(oosItems);
      
  };

  useEffect(() => {
    console.log("outOfStockItems...",outOfStockItems);
    console.log("inStockItems...",inStockItems);
    setLoading(false);
  }, [outOfStockItems,inStockItems]);

  const updateQuantity = async (productId: any, quantity: number, size: string) => {
    try {
      const response = await fetch("/api/showCart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          userId: session?.user?.id,
          size,
        }),
      });
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      if(session?.user?.id)
      fetchCart(session?.user?.id);
      console.log("Updated cart:", updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteCartItem = async (productId: any, quantity: number, size: string) => {
    try {
      const response = await fetch(`/api/showCart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          productId,
          quantity,
          size,
        }),
      });
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      if(session?.user?.id)
        fetchCart(session?.user?.id);
      console.log("Updated cart:", updatedCart);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  useEffect(() => {
      resetDBOrder();
      resetOrder();
    console.log(useDBOrderStore.getState());
    console.log(useOrderStore.getState());
  }, []);

  const handleQuantityChange = (operation: "increment" | "decrement", cartProduct: CartItem) => { 
    const product = products.find((p) => p._id.toString() === cartProduct.productId);
    if (operation === "increment") {
      const selectedsizeProduct = product?.sizes.find((availableSize: any) => availableSize.size === cartProduct.size);

      if (!selectedsizeProduct) {
        alert("Please select a size first.");
        return;
      }
      if(!(cartProduct.quantity >= selectedsizeProduct.stock)) {
        updateQuantity(cartProduct.productId, cartProduct.quantity + 1, cartProduct.size)
      }
    } else if (operation === "decrement" && cartProduct.quantity > 1) {
      updateQuantity(cartProduct.productId, cartProduct.quantity - 1, cartProduct.size)
    }
  };

  
  const handleCheckout = async () => {
    ///storing the shipRocketorder
    const newOrderItems = inStockItems.map((item, index) => ({
      name: item.name,
      sku: item.name.substring(0, 10)+ index.toString(),
      units: item.quantity,
      selling_price: item.price.toString(),
      discount: "0",
      tax: "0",
      hsn: 0,
    }));

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
      inStockItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );

    ///// storing the order in Db
    const items: OrderItem[] = orderItems;
    inStockItems.forEach((item) => {
      items.push({
        name: item.name,
        productId: item.productId.toString(),
        quantity: item.quantity,
        size: item.size,
        images: item.image as any,
        price: item.price,
      });
    });

    const total = totalAmount + inStockItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setItems(items, total);
    router.push("/ordering/address");
  };

  const calculateTotal = () => {
    return inStockItems?.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) return <Loading />;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="mb-4 text-lg">Please log in to view your cart.</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page lg:max-w-screen-xl mx-auto px-2 py-10 bg-gray-50 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items Section */}
        <div className="cart-items col-span-2 bg-white shadow-lg rounded-lg px-2 py-4 md:p-6">
          <h1 className="text-3xl font-normal underline decoration-1 underline-offset-8 mb-6 text-gray-800">Your Cart</h1>

          {cartItems.length === 0 ? (
                <div className="relative flex flex-col items-center justify-center w-full h-[70vh] p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg overflow-hidden">
                  {/* Simplified Cart Icon */}
                  <div className="text-5xl md:text-6xl z-10 ">
                    🛍️
                  </div>

                  {/* Heading */}
                  <p className="text-gray-800 text-2xl md:text-4xl font-bold z-10">
                    Your bag is empty!
                  </p>

                  {/* Subtext */}
                  <p className="text-gray-600 text-sm md:text-lg text-center max-w-md z-10">
                    It looks like you haven’t added anything yet. Explore our amazing collection and fill your cart with incredible finds!
                  </p>

                  {/* Call-to-Action Button */}
                  <Link
                    href="/products"
                    className="mt-4 px-8 py-3 cursor-pointer z-20  text-lg bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-200"
                  >
                    Shop Now
                  </Link>

                  {/* Minimal Decorative Background */}
                  <div className="absolute animate-pulse inset-0 flex justify-between items-center">
                    <div className="w-48 h-48 rounded-full bg-blue-300 opacity-40"></div>
                    <div className="w-72 h-72 rounded-full bg-blue-200 opacity-40"></div>
                  </div>
                  
                </div>
              ) : (
              [...inStockItems].reverse().map((item, index) => (
              console.log("inStockItems", item),
              <div
                key={index}
                className="flex relative items-center justify-between p-4 mb-4 border rounded-lg shadow-sm bg-gray-100"
              >
                <div className="flex items-center mb-8 md:mb-0">
                  <Link href={`/product/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className=" max-w-[100px] md:max-w-[150px] aspect-[3/4] object-cover rounded-lg mr-4"
                    />
                  </Link>
                  <div className="flex flex-col gap-2 pt-2 pr-1">
                    <Link href={`/product/${item.productId}`}>
                      <h2 className="text-md md:text-xl font-semibold text-gray-800">{item.name}</h2>
                    </Link>
                    <p className="text-sm md:text-lg text-gray-800">Size: {item.size}</p>
                    <div className="flex gap-2  ">
                      <button
                        onClick={() => handleQuantityChange("decrement", item)}
                        className="px-3 py-2 bg-gray-200 rounded-l-md text-gray-700 hover:bg-gray-300"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-lg font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange("increment", item)}
                        className="px-3 py-2 bg-gray-200 rounded-r-md text-gray-700 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex absolute bottom-2 right-2 md:right-8 md:bottom-4 items-center justify-end w-full gap-3 md:">
                  <span className="text-xl md:text-2xl font-normal text-gray-800">
                   sub-total:{" "}{" "} ₹{item.price * item.quantity}
                  </span>
                </div>
                <button
                    onClick={() => deleteCartItem(item.productId, item.quantity, item.size)}
                    className="text-red-600 absolute top-1 right-1 hover:text-red-800"
                  >
                    <MdDeleteOutline size={24} />
                </button>
              </div>
            )))
          }

          {
            outOfStockItems.length > 0 && ( outOfStockItems.map((item, index) => (
              <div
              key={index}
              className="flex relative items-center justify-between p-4 mb-4 border rounded-lg shadow-sm bg-opacity-50"
            >
              <div className="absolute top-2 left-2 opacity-100 z-8 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md">
                Out of Stock
              </div>

              <div className="flex items-center mb-8 md:mb-0 bg-opacity-60">
                <Link href={`/product/${item.productId}`}>
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className=" max-w-[100px] md:max-w-[150px] aspect-[3/4] object-cover rounded-lg mr-4"
                  />
                </Link>
                <div className="flex flex-col gap-2 pt-2 pr-1">
                  <Link href={`/product/${item.productId}`}>
                    <h2 className="text-md md:text-xl font-semibold text-gray-800">{item.name}</h2>
                  </Link>
                  <p className="text-sm md:text-lg text-gray-800">Size: {item.size}</p>
                  <p className="text-sm md:text-lg text-gray-800">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex absolute bottom-2 right-2 md:right-8 md:bottom-4 items-center justify-end w-full gap-3 md:">
                <span className="text-xl md:text-2xl font-normal text-gray-800">
                 sub-total:{" "}{" "} ₹{item.price * item.quantity}
                </span>
              </div>
              <button
                  onClick={() => deleteCartItem(item.productId, item.quantity, item.size)}
                  className="text-red-600 absolute top-1 right-1 hover:text-red-800"
                >
                  <MdDeleteOutline size={24} />
              </button>
            </div>
            ))
              
            )
          }

        </div>
  
        {/* Order Summary Section */}
        <div
          className={`cart-summary bg-white shadow-lg rounded-lg p-6 md:relative md:top-auto md:w-full ${
            inStockItems.length > 0
              ? "fixed bottom-0 left-0 w-full md:w-auto"
              : "md:relative"
          }`}
        >
          <h2 className=" text-xl underline decoration-1 underline-offset-8 md:text-2xl font-normal mb-4 md:mb-8 text-gray-800">Order Summary </h2>
          <div className="mb-4 md:mb-6 flex justify-between">
            <p className=" text-lg lg:text-2xl font-medium text-gray-700">
              Total :{" "}({inStockItems.length}{" "}items)
            </p>
            <span className=" text-2xl lg:text-3xl  font-normal text-gray-900">₹{calculateTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-gray-800 text-white text-lg font-semibold rounded-md hover:bg-black"
          >
            Checkout
          </button>
        </div>
      </div>
  
      {/* Spacing to prevent content overlap */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
  
};

export default CartPage;