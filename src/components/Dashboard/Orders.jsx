"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const orders = [
  { 
    id: "ORD-1001", 
    customer: "John Doe", 
    date: "6/14/2023", 
    amount: 125.99, 
    status: "completed",
    items: [
      { name: "Product A", quantity: 2, price: 49.99 },
      { name: "Product B", quantity: 1, price: 26.01 }
    ],
    shipping: {
      address: "123 Main St, Anytown, USA",
      method: "Express",
      tracking: "1Z999AA1234567890"
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      status: "Paid"
    }
  },
  { 
    id: "ORD-1002", 
    customer: "Jane Smith", 
    date: "6/13/2023", 
    amount: 75.50, 
    status: "processing",
    items: [
      { name: "Product C", quantity: 1, price: 75.50 }
    ],
    shipping: {
      address: "456 Oak Ave, Somewhere, USA",
      method: "Standard",
      tracking: "1Z999AA1234567891"
    },
    payment: {
      method: "PayPal",
      email: "jane@example.com",
      status: "Paid"
    }
  },
  { 
    id: "ORD-1003", 
    customer: "Bob Johnson", 
    date: "6/12/2023", 
    amount: 250.00, 
    status: "cancelled",
    items: [
      { name: "Product D", quantity: 2, price: 125.00 }
    ],
    shipping: {
      address: "789 Pine St, Nowhere, USA",
      method: "Express",
      tracking: "Cancelled"
    },
    payment: {
      method: "Credit Card",
      last4: "5678",
      status: "Refunded"
    }
  },
  { 
    id: "ORD-1004", 
    customer: "Alice Brown", 
    date: "6/11/2023", 
    amount: 89.99, 
    status: "completed",
    items: [
      { name: "Product E", quantity: 1, price: 89.99 }
    ],
    shipping: {
      address: "321 Elm St, Everywhere, USA",
      method: "Standard",
      tracking: "1Z999AA1234567893"
    },
    payment: {
      method: "Credit Card",
      last4: "9012",
      status: "Paid"
    }
  },
  { 
    id: "ORD-1005", 
    customer: "Charlie Wilson", 
    date: "6/10/2023", 
    amount: 150.00, 
    status: "processing",
    items: [
      { name: "Product F", quantity: 3, price: 50.00 }
    ],
    shipping: {
      address: "654 Maple Dr, Anywhere, USA",
      method: "Express",
      tracking: "1Z999AA1234567894"
    },
    payment: {
      method: "PayPal",
      email: "charlie@example.com",
      status: "Paid"
    }
  }
];

const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    processing: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-sm font-medium capitalize",
      statusStyles[status]
    )}>
      {status}
    </span>
  );
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredOrders = sortedOrders.filter((order) =>
    Object.values(order).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === "asc" ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 lg:block hidden">View and manage all customer orders</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-y dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Order ID <SortIcon columnKey="id" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("customer")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Customer <SortIcon columnKey="customer" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Date <SortIcon columnKey="date" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Amount <SortIcon columnKey="amount" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <>
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                        <span className="font-medium dark:text-white">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">{order.customer}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{order.date}</td>
                    <td className="px-6 py-4 dark:text-gray-300">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOrderDetails(order.id);
                        }}
                      >
                        {expandedOrder === order.id ? 'Hide' : 'View'}
                      </Button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan="6" className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order Items</h3>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="dark:text-gray-300">{item.name} × {item.quantity}</span>
                                  <span className="text-gray-600 dark:text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="border-t dark:border-gray-700 pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span className="dark:text-white">Total</span>
                                  <span className="dark:text-white">${order.amount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Details</h3>
                            <div className="text-sm space-y-1">
                              <p className="text-gray-600 dark:text-gray-400">{order.shipping.address}</p>
                              <p className="dark:text-gray-300">Method: <span className="text-gray-600 dark:text-gray-400">{order.shipping.method}</span></p>
                              <p className="dark:text-gray-300">Tracking: <span className="text-gray-600 dark:text-gray-400">{order.shipping.tracking}</span></p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Payment Information</h3>
                            <div className="text-sm space-y-1">
                              <p className="dark:text-gray-300">Method: <span className="text-gray-600 dark:text-gray-400">{order.payment.method}</span></p>
                              {order.payment.last4 && (
                                <p className="dark:text-gray-300">Card ending in: <span className="text-gray-600 dark:text-gray-400">{order.payment.last4}</span></p>
                              )}
                              {order.payment.email && (
                                <p className="dark:text-gray-300">PayPal email: <span className="text-gray-600 dark:text-gray-400">{order.payment.email}</span></p>
                              )}
                              <p className="dark:text-gray-300">Status: <span className="text-gray-600 dark:text-gray-400">{order.payment.status}</span></p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 