
"use client";

import { useSession } from "@clerk/nextjs";
import Dashboard from "@/components/Dashboard/Dashboard";
export default function DashboardPage() {

  return <div className="flex flex-col h-[calc(100vh-4rem)] overflow-auto max-w-7xl mx-auto">
    <Dashboard />
  </div>;
}