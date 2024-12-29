"use client";
import { MdDeleteOutline } from "react-icons/md";
import React, { use, useEffect, useState } from "react";
import { CartItem } from "@/models/Cart";
import { useSession, signIn } from "next-auth/react";
import useOrderStore from "@/store/order";
import { useRouter } from "next/navigation";
import useDBOrderStore from "@/store/dbOrders";
import { OrderItem } from "@/models/Orders";
import Link from "next/link";
import useCartStore from "@/store/cartState";

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
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCartt();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchCartt = async () => {
    try {
      const response = await fetch(`/api/showCart?userId=${session?.user?.id}`);
      const data = await response.json();
      console.log("Cart data:", data);
      setCartItems(data.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

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

  
  const handleCheckout = async () => {
    ///storing the shipRocketorder
    const newOrderItems = cartItems.map((item) => ({
      name: item.name,
      sku: item.name.substring(0, 10),
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
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );

    ///// storing the order in Db
    const items: OrderItem[] = orderItems;
    cartItems.forEach((item) => {
      items.push({
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        images: item.image,
        price: item.price,
      });
    });

    const total = totalAmount + cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setItems(items, total);
    router.push("/ordering/address");
  };

  const calculateTotal = () => {
    return cartItems?.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) return <div>Loading...</div>;

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
        <div className="cart-items col-span-2 bg-white shadow-lg rounded-lg p-2 md:p-6">
          <h1 className="text-3xl font-normal underline decoration-1 underline-offset-8 mb-6 text-gray-800">Your Cart</h1>
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-lg">Your cart is empty!</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex relative items-center justify-between p-4 mb-4 border rounded-lg shadow-sm bg-gray-100"
              >
                <div className="flex items-center mb-8">
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
                    <div className="flex gap-2  ">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                        className="px-3 py-2 bg-gray-200 rounded-l-md text-gray-700 hover:bg-gray-300"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-lg font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
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
            ))
          )}
        </div>
  
        {/* Order Summary Section */}
        <div
          className={`cart-summary bg-white shadow-lg rounded-lg p-6 md:relative md:top-auto md:w-full ${
            cartItems.length > 0
              ? "fixed bottom-0 left-0 w-full md:w-auto"
              : "md:relative"
          }`}
        >
          <h2 className=" text-xl underline decoration-1 underline-offset-8 md:text-3xl font-normal mb-4 md:mb-8 text-gray-800">Order Summary </h2>
          <div className="mb-4 md:mb-6 flex justify-between">
            <p className=" text-lg lg:text-2xl font-medium text-gray-700">
              Total :{" "}({cartItems.length}{" "}items)
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