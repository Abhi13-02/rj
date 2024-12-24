"use client";

import React, { useEffect, useState } from "react";

interface Item {
  name: string;
  quantity: number;
  price: number;
  color: string;
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Item[];
  newStatus?: string; // For tracking the updated status
}

const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`/api/orders/all`); // Adjust API route
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  // Handle status change in dropdown
  const handleStatusChange = (_id: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === _id ? { ...order, newStatus } : order
      )
    );
  };

  // Update order status
  const handleUpdateStatus = async (_id: string, newStatus: string) => {
    try {      
      const response = await fetch(`/api/orders/updateStatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({orderId:_id, newStatus }),
      });

      if (response.ok) {
        alert("Order status updated successfully.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === _id ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred while updating the status.");
    }
  };

  // Filter orders by active tab status
  const filteredOrders = orders.filter((order) => order.status === activeTab);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {/* Tabs */}
      <div className="tabs mb-4 w-full flex justify-around gap-2 items-center">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`tab px-4 py-2 ${
              activeTab === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredOrders.length > 0 ? (
        
        filteredOrders.map((order: Order) => (
          <div key={order._id} className="border p-4 mb-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">Order ID: {order._id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleDateString()}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} pcs - ${item.price} - {item.color}
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <select
                value={order.newStatus || order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border p-2 rounded"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  handleUpdateStatus(order._id, order.newStatus || order.status)
                }
                className={`ml-2 px-4 py-2 rounded text-white ${
                  order.newStatus && order.newStatus !== order.status
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!order.newStatus || order.newStatus === order.status}
              >
                Update
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No orders with status: {activeTab}</p>
      )}
      </div>  
    </div>
  );
};

export default OrdersPage;
