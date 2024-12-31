"use client";
import useCartStore from "@/store/cartState";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IOrder } from "@/models/Orders";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/loading";
import LoginPanel from "@/components/loginPanel";

const YourOrders = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [showLoginPanel, setShowLoginPanel] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchYourOrders();
      setShowLoginPanel(false);
      fetchCart(session.user.id);
    }
  }, [session?.user?.id]);

  const fetchYourOrders = async () => {
    try {
      const response = await fetch(`/api/orders/getOrders?userId=${session?.user?.id}`);
      const data = await response.json();
       // Sort orders by `createdAt` in descending order (newest first)
    const sortedOrders = data.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setOrders(sortedOrders);
      console.log("Orders sorted fetched:", sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const updateDataBase = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/updateStatus`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const data = await response.json();
      console.log("Order status updated:", data);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getOrderStatus = async (shipOrderId: string, orderId: string) => {
    try {
      const response = await fetch(`/api/ship/getOrderStatus?orderId=${shipOrderId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Order status fetched:", data);
        const status = data;
        setOrders((prevOrders: any) =>
          prevOrders.map((order: IOrder) =>
            order.shiprocketOrderId === shipOrderId ? { ...order, status: status } : order
          )
        );
        updateDataBase(orderId, status);
      } else {
        console.error("Error fetching order status:", data.message);
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  const cancelOrder = async (shipOrderId: string, orderId: string) => {
    try {
      const response = await fetch(`/api/ship/cancelOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [shipOrderId] }),
      });
      const data = await response.json();
      if (response.ok) {
        setOrders((prevOrders: any) =>
          prevOrders.map((order: IOrder) =>
            order.shiprocketOrderId === shipOrderId ? { ...order, status: "CANCELED" } : order
          )
        );
        console.log("Order cancelled:", data);
        toast.success("Order cancelled successfully");
        updateDataBase(orderId, "CANCELED");
      } else {
        toast.error("Failed to cancel order");
        console.error("Error cancelling order:", data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error("Error cancelling order:", error);
    }
  };

  const toggleExpandOrder = (shiprocketOrderId: string, orderId: string, status?: string) => {
    if (status !== "CANCELED") {
      getOrderStatus(shiprocketOrderId, orderId);
    }
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  if (showLoginPanel) {
    return <LoginPanel  onClose={() => setShowLoginPanel(false)} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-gray-100 rounded-lg shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 14l-2-2m0 0l2-2m-2 2h6m-6 0l2-2m4 0l2 2m-2-2l2 2m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700">No Orders Found</h2>
        <p className="mt-2 text-gray-500">
          Looks like you haven't placed any orders yet. Browse our products and get started!
        </p>
        <a
          href="/products"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Shop Now
        </a>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-normal underline decoration-1 underline-offset-8 mb-6 text-gray-800">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order: IOrder, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow p-4 border ${
              order.status.toLocaleLowerCase() === "canceled"
                ? "border-red-500 bg-red-100"
                : "border-gray-200"
             }` 
          }
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpandOrder(order.shiprocketOrderId, order._id as string, order.status)}
            >
              <div>
                <p className="text-lg font-semibold">
                  OrderId #{order.shiprocketOrderId}
                </p>
                {expandedOrder === order._id && (
                  <p className="text-gray-600">Status: {order.status === "NEW" ? "PENDING" : order.status}</p>
                )}
                <p className="text-gray-600">
                  Total Amount: ₹{order.totalAmount}
                </p>
                <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                <p className="text-gray-600">
                  Ordered On: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button className="text-blue-500 hover:underline">
                {expandedOrder === order._id ? "Collapse" : "Expand"}
              </button>
            </div>
            {expandedOrder === order._id && (
              <div className="mt-4 border-t pt-4">
                <h2 className="font-semibold mb-2">Order Items</h2>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <Link href={`/product/${item.productId.toString()}`} key={index}>
                      <div className="flex items-start space-x-4 border-b pb-2">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ₹{item.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <h2 className="font-semibold mt-4">Shipping Address</h2>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}-{order.shippingAddress.pincode}, Phone:{" "}
                  {order.shippingAddress.phone}, Email: {order.shippingAddress.email}
                </p>
                {(order.status.toLocaleLowerCase() === "pending" || order.status.toLocaleLowerCase() === "new") && (
                  <button
                    onClick={() => cancelOrder(order.shiprocketOrderId, order._id as string)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourOrders;
