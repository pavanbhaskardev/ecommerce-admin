"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ShoppingCart, Menu, X, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Products", href: "/products", icon: Package },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed w-full top-0 left-0 right-0 z-50 flex justify-center items-center border-b">
      <nav className="flex w-full justify-between py-3 px-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          myAngadi
        </Link>

        <SignedIn>
          <ul className="hidden items-center gap-12 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    pathname === link.href && "text-primary"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </SignedIn>

        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />

          <SignedIn>
            <UserButton
              showName
              customMenuItems={[
                {
                  label: "Profile",
                  href: "/profile",
                },
              ]}
            />
          </SignedIn>
        </div>

        <SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  This is navigation menu
                </SheetDescription>
              </SheetHeader>

              <ul className="flex flex-col h-[calc(100%-3rem)] py-4 gap-4 mt-4">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        pathname === link.href && "text-primary"
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <SheetFooter className="flex-row justify-between">
                <ModeToggle />

                <UserButton
                  showName
                  customMenuItems={[
                    {
                      label: "Profile",
                      href: "/profile",
                    },
                  ]}
                />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </SignedIn>
      </nav>
    </header>
  );
}
