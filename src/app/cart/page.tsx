"use client";

import React, { useEffect, useState } from "react";
import { CartItem } from "@/models/Cart";
import { useSession } from "next-auth/react";
import useOrderStore from "@/store/order";
import { useRouter } from "next/navigation";
import useDBOrderStore from "@/store/dbOrders";
import { OrderItem } from "@/models/Orders";


const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const addOrderItems = useOrderStore((state) => state.addOrderItems);

  const setItems = useDBOrderStore((state) => state.setItems); // Move hook call to the component body
  let orderItems: OrderItem[] = useDBOrderStore((state) => state.items);
  let totalAmount: number = useDBOrderStore((state) => state.totalAmount);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
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
          size
        }),
      });
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      console.log("Updated cart:", updatedCart);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleCheckout = async () => {
    const newOrderItems = cartItems.map((item) => ({
      name: item.name,
      sku: item.name+item.size,
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

    const entireState = useOrderStore.getState();
    
    // Navigate to the address page

    /*
     _id?: mongoose.Types.ObjectId;
      productId: string;
      image: string[];
      name: string;
      price: number;
      quantity: number;
      size: string;
    */
    
    const items: OrderItem[] = orderItems;
    console.log("hiiiii",cartItems)
    cartItems.forEach((item) => {
      items.push({
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        images: item.image,
        price: item.price
      });
    })

    const total =  totalAmount + cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // the DBorder items and its total have been pushed.
    setItems(items, total);
    router.push("/ordering/address");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cart-page flex flex-col md:flex-row p-4">
      <div className="cart-items flex-1">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cartItems?.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          cartItems?.map((item) => (
            <div
              key={item._id?.toString()}
              className="cart-item flex items-center justify-between mb-4 border p-2 rounded"
            >
              
              <div className="flex items-center">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover mr-4"
                />
                <div className="flex justify-center items-center gap-5">
                  <h2 className="text-lg font-semibold ">{item.name}</h2>
                  <p>Size: {item.size}</p>
                  <p>${item.price}</p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1, item.size)
                  }
                  className="px-2 py-1 border bg-gray-200 rounded-l"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1, item.size)
                  }
                  className="px-2 py-1 border bg-gray-200 rounded-r"
                >
                  +
                </button>
                <button
                  onClick={() => deleteCartItem(item.productId, item.quantity, item.size)}
                  className="ml-4 text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary w-full md:w-1/3 p-4 border-l border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="mb-4">
          <p className="text-lg">
            Total: <span className="font-bold">₹{calculateTotal()}</span>
          </p>
        </div>
        <button
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          onClick={() => handleCheckout()}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
