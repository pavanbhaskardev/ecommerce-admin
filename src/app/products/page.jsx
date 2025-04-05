"use client";

import Products from "@/components/Dashboard/Products";

export default function ProductsPage() {
  return  <div className="flex flex-col h-[calc(100vh-4rem)] overflow-auto max-w-7xl mx-auto ">
    <Products />
  </div>;
}


