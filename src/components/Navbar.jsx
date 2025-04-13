"use client";

import { SignedIn, UserButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ShoppingCart,
  Menu,
  Package,
  LogOut,
  KeyIcon,
} from "lucide-react";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Products", href: "/products", icon: Package },
  { label: "API Keys", href: "/api-keys", icon: KeyIcon },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="fixed bg-background w-full top-0 left-0 right-0 z-50 flex justify-center items-center border-b">
      <nav className="flex w-full justify-between py-3 px-4 max-w-7xl mx-auto">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-xl font-bold tracking-tight"
        >
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
          <Sheet open={open} onOpenChange={setOpen}>
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

              <Avatar>
                <AvatarImage src={user?.imageUrl ?? ""} alt="@shadcn" />
                <AvatarFallback>{user?.fullName?.slice(0, 1)}</AvatarFallback>
              </Avatar>

              <p className="text-sm font-semibold mt-2">{user?.fullName}</p>

              <Link
                className="text-muted-foreground text-sm underline"
                href="/profile"
                onClick={() => setOpen(false)}
              >
                View Profile
              </Link>

              <ul className="flex flex-col h-[calc(100%-9rem)] py-4 gap-4 mt-4">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 font-medium",
                        pathname === link.href && "text-primary"
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <SignOutButton>
                    <p
                      className={cn("flex items-center gap-2 font-medium")}
                      onClick={() => setOpen(false)}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </p>
                  </SignOutButton>
                </li>
              </ul>

              <SheetFooter className="flex-row items-center text-sm font-semibold justify-between">
                <p>Appearance</p>

                <ModeToggle />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </SignedIn>
      </nav>
    </header>
  );
}
