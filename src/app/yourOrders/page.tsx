"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const YourOrders = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchYourOrders();
    }
  }, [session?.user?.id]);

  const fetchYourOrders = async () => {
    try {
      const response = await fetch(`/api/orders/getOrders?userId=${session?.user?.id}`);
      const data = await response.json();
      setOrders(data);
      console.log("Orders fetched:", data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpandOrder(order._id)}
            >
              <div>
                <p className="text-lg font-semibold">Order #{order._id}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">
                  Total Amount: ₹{order.totalAmount}
                </p>
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
                    <div
                      key={index}
                      className="flex items-start space-x-4 border-b pb-2"
                    >
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
                  ))}
                </div>
                <h2 className="font-semibold mt-4">Shipping Address</h2>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}, {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourOrders;
