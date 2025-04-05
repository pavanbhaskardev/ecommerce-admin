"use client";

import Orders from "@/components/Dashboard/Orders";

export default function OrdersPage() {
  return  <div className="flex flex-col h-[calc(100vh-4rem)] overflow-auto max-w-7xl mx-auto">
    <Orders />
  </div>;
}