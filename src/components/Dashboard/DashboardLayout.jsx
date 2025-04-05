"use client";

import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Home as HomeIcon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  // Render the active page component
  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
      <div className="flex h-screen overflow-hidden">
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderActivePage()}
        </div>
      </div>
  );
} 