"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import * as React from "react";
import { Home, LayoutDashboard, ShoppingCart, Menu, X, Package } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { scrollY } = useScroll();
  const { theme, resolvedTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic styling using framer-motion's useTransform
  const defaultBackground = useTransform(scrollY, [0, 100], ["rgba(3, 7, 18, 0)", "rgba(3, 7, 18, 0.9)"]);
  const navBackground = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]);
  const navBackgroundDark = useTransform(scrollY, [0, 100], ["rgba(3, 7, 18, 0)", "rgba(3, 7, 18, 0.9)"]);

  const borderOpacity = useTransform(scrollY, [0, 100], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)"]);
  const borderOpacityDark = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]);

  const width = useTransform(scrollY, [0, 200], ["100%", isMobile ? "95%" : "55%"]);

  const springConfig = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  };

  // Desktop nav items
  const NavItems = React.memo(() => (
    <div className="flex items-center gap-6">
      <Link
        href="/"        
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary h-16 px-2",
          pathname === "/"  ? "border-b-2 border-primary" : "border-b-2 border-transparent"
        )}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary h-16 px-2",
         
          pathname === "/dashboard" ? "border-b-2 border-primary" : "border-b-2 border-transparent"
        )}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/orders"
          className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary h-16 px-2",
          pathname === "/orders" ? "border-b-2 border-primary" : "border-b-2 border-transparent"
        )}
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Orders</span>
      </Link>

      <Link
        href="/products"
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary h-16 px-2",
          pathname === "/products" ? "border-b-2 border-primary" : "border-b-2 border-transparent"
        )}
      >
        <Package className="h-5 w-5" />
        <span>Products</span>
      </Link>
    </div>
  ));

  // Mobile nav items
  const NavItemsMobile = React.memo(() => (
    <div className="flex flex-col space-y-4 gap-4">
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary p-4 rounded-lg",
          pathname === "/" ? "border border-primary" : "border border-transparent"
        )}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link
        href="/dashboard"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary p-4 rounded-lg",
          pathname === "/dashboard" ? "border border-primary" : "border border-transparent"
        )}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/orders"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary p-4 rounded-lg",
          pathname === "/orders" ? "border border-primary" : "border border-transparent"
          )}
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Orders</span>
      </Link>
      <Link
        href="/products"
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 font-medium transition-colors hover:text-primary p-4 rounded-lg",
          pathname === "/products" ? "border border-primary" : "border border-transparent"
        )}
      >
        <Package className="h-5 w-5" />
        <span>Products</span>
      </Link>
    </div>
  ));

  return (
    <div className="relative top-0 left-0 right-0 z-50 flex justify-center items-center border-b border-gray-200 dark:border-gray-800/50">
      <motion.nav
        style={{
          width,

          marginTop: useTransform(scrollY, [0, 100], [0, 16]),
          borderRadius: useTransform(scrollY, [0, 100], ["0px", "24px"]),
          backgroundColor: mounted
            ? resolvedTheme === "dark"
              ? navBackgroundDark
              : navBackground
            : defaultBackground,
          borderColor: mounted
            ? resolvedTheme === "dark"
              ? borderOpacityDark
              : borderOpacity
            : borderOpacityDark,
          borderWidth: "1px",
        }}
        transition={springConfig}
        className={`
          backdrop-blur-sm transition-colors duration-200 bg-transparent
          dark:border-gray-800/50 md:transform-gpu
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navbar */}
            <div className="hidden sm:flex w-full items-center justify-between">
              <NavItems />
              <h1 className="text-xl font-bold tracking-tight"> myAngadi </h1>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>

            {/* Mobile Navbar */}
            <div className="flex sm:hidden w-full items-center justify-between px-4">
              <h1 className="text-xl font-bold tracking-tight">NexMerch</h1>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen((prev) => !prev)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-slate-50 shadow-lg z-50 dark:bg-slate-900"
          >
            <div className="px-4 flex flex-col h-full">
              <div className="flex justify-end pt-4 pr-4 h-16 ">
                <Button  variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <Separator />
              <div className="mt-4 flex-grow">
                <NavItemsMobile />
              </div>
              <div className="mt-auto">
                <ModeToggle />
                <div className="mt-2">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}