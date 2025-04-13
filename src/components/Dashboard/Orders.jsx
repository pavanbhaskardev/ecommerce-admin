"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  DollarSign,
  Box,
  Percent,
  Minus,
  Ellipsis,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed:
      "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    processing:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-semibold capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
};

const shippingMethods = [
  {
    label: "Standard Shipping",
    value: "standard",
  },
  {
    label: "Express Shipping",
    value: "express",
  },
];

const OrderForm = ({ operation = "create", order = undefined }) => {
  const { user } = useUser();
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    orderId: `ORD-${new Date().getTime()}`,
    items: [],
    shipping: {
      address: "",
      method: "standard",
      tracking: "",
    },
    payment: {
      method: "card",
      last4: "",
      status: "completed",
      email: user.emailAddresses[0].emailAddress,
    },
    customer: {
      name: user.fullName,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setFetchingProducts(false);
    }
  };

  const handleOrder = async () => {
    if (order) {
    }
    // Handling creating process
    else {
      const formattedOrderData = {
        ...formData,
        payment: {
          ...formData.payment,
          last4: formData.payment.last4.slice(-4),
        },
        amount: formData.items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }),
      };

      try {
        const response = await fetch(`/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedOrderData),
        });

        const data = await response.json();
        if (data?.orderId) {
          toast({
            title: "Success",
            description: "Order created successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleOrder();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <ScrollArea className="my-4 pb-8 space-y-6 h-[calc(100vh-10rem)]">
        <div className="space-y-6 pl-2 pr-4">
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Select
              value={formData.customer.email}
              onValueChange={(email) => {
                setFormData({
                  ...formData,
                  customer: {
                    ...formData.customer,
                    email: email,
                  },
                  payment: {
                    ...formData.payment,
                    email: email,
                  },
                });
              }}
            >
              <SelectTrigger id="email">
                <SelectValue placeholder="Select a email" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {user.emailAddresses.map((emailDetails) => (
                    <SelectItem
                      value={emailDetails.emailAddress}
                      key={emailDetails.emailAddress}
                    >
                      {emailDetails.emailAddress}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Products */}
          <div className="space-y-2">
            <Label>Products</Label>

            <ScrollArea className="border-input h-64 space-y-4 rounded-md border">
              {fetchingProducts ? (
                <p className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px]">
                  Fetching Products...
                </p>
              ) : null}

              <div className="pb-8 space-y-4">
                {products.length && !fetchingProducts
                  ? products.map((product) => {
                      const item = formData.items.find(
                        (item) => item.name === product.name
                      );

                      return (
                        <div className="flex w-full gap-4 px-4">
                          <div className="relative flex-shrink-0 size-40 bg-gray-700 rounded-md overflow-hidden">
                            <Image
                              src={product.image}
                              fill
                              className="object-cover"
                              alt={`${product.name}-image`}
                            />
                          </div>

                          <div className="space-y-1">
                            <p className="font-semibold">{product.name}</p>

                            <p className="text-sm text-muted-foreground">
                              {product.description}
                            </p>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span className="font-bold">
                                  {product.price.toFixed(2)}
                                </span>
                              </div>

                              {product.discount > 0 && (
                                <Badge variant="destructive">
                                  <Percent className="h-3 w-3 mr-1" />
                                  {product.discount}% OFF
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              {product.stock > 0 ? (
                                <>
                                  <Box className="h-4 w-4 mr-1" />
                                  <span>{product.stock} in stock</span>
                                </>
                              ) : (
                                <span>out of stock</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                              <Button
                                size="icon"
                                type="button"
                                disabled={product.stock === 0}
                                variant="outline"
                                onClick={() => {
                                  setFormData((current) => {
                                    const previousItems = current.items;

                                    // checking if item is already exists or not
                                    const existingItemIndex =
                                      previousItems.findIndex(
                                        (item) => item.name === product.name
                                      );

                                    if (existingItemIndex !== -1) {
                                      const itemRemoved =
                                        previousItems[existingItemIndex]
                                          .quantity -
                                          1 <=
                                        0;

                                      if (itemRemoved) {
                                        return {
                                          ...current,
                                          items: [
                                            ...previousItems.slice(
                                              0,
                                              existingItemIndex
                                            ),
                                            ...previousItems.slice(
                                              existingItemIndex + 1
                                            ),
                                          ],
                                        };
                                      } else {
                                        return {
                                          ...current,
                                          items: [
                                            ...previousItems.slice(
                                              0,
                                              existingItemIndex
                                            ),
                                            {
                                              ...previousItems[
                                                existingItemIndex
                                              ],
                                              quantity:
                                                previousItems[existingItemIndex]
                                                  .quantity - 1,
                                            },
                                            ...previousItems.slice(
                                              existingItemIndex + 1
                                            ),
                                          ],
                                        };
                                      }
                                    } else {
                                      return current;
                                    }
                                  });
                                }}
                              >
                                <Minus />
                              </Button>

                              <p>{item?.quantity ? item.quantity : 0}</p>

                              <Button
                                size="icon"
                                disabled={product.stock === 0}
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  setFormData((current) => {
                                    const previousItems = current.items;

                                    const existingItemIndex =
                                      previousItems.findIndex(
                                        (item) => item.name === product.name
                                      );

                                    if (existingItemIndex !== -1) {
                                      return {
                                        ...current,
                                        items: [
                                          ...previousItems.slice(
                                            0,
                                            existingItemIndex
                                          ),
                                          {
                                            ...previousItems[existingItemIndex],
                                            quantity:
                                              previousItems[existingItemIndex]
                                                .quantity + 1,
                                          },
                                          ...previousItems.slice(
                                            existingItemIndex + 1
                                          ),
                                        ],
                                      };
                                    } else {
                                      return {
                                        ...current,
                                        items: [
                                          ...current.items,
                                          {
                                            name: product.name,
                                            quantity: 1,
                                            price: product.price,
                                          },
                                        ],
                                      };
                                    }
                                  });
                                }}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>

              {products.length === 0 && !fetchingProducts ? (
                <p className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px]">
                  No products available!
                </p>
              ) : null}
            </ScrollArea>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>

            <Textarea
              name="address"
              id="address"
              onChange={(e) => {
                setFormData((current) => ({
                  ...current,
                  shipping: { ...current.shipping, address: e.target.value },
                }));
              }}
            />
          </div>

          {/* Shipping Method */}
          <div className="space-y-2">
            <Label htmlFor="shippingMethod">Shipping Method </Label>

            <Select
              value={formData.shipping.method}
              onValueChange={(method) => {
                setFormData({
                  ...formData,
                  shipping: { ...formData.shipping, method: method },
                });
              }}
            >
              <SelectTrigger id="shippingMethod">
                <SelectValue placeholder="Select a shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {shippingMethods.map(({ label, value }) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tracking URL */}
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking URL</Label>

            <Input
              name="tracking"
              id="tracking"
              onChange={(e) => {
                setFormData((current) => ({
                  ...current,
                  shipping: { ...current.shipping, tracking: e.target.value },
                }));
              }}
            />
          </div>

          {/* Tracking URL */}
          <div className="space-y-2">
            <Label htmlFor="last4">Card Number</Label>

            <Input
              name="last4"
              id="last4"
              onChange={(e) => {
                setFormData((current) => ({
                  ...current,
                  payment: { ...current.payment, last4: e.target.value },
                }));
              }}
            />
          </div>
        </div>
      </ScrollArea>

      <SheetFooter className="justify-between sm:justify-between w-full">
        {formData.items.length ? (
          <p className="inline-flex items-center text-sm font-semibold">
            {"Total: "}
            <DollarSign className="h-4 w-4" />
            {formData.items.reduce((total, item) => {
              return total + item.price * item.quantity;
            }, 0)}
          </p>
        ) : null}

        <div className="flex gap-2">
          <Button type="submit">Save</Button>

          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </form>
  );
};

const OrderSheet = ({ children, operation = "create", order = undefined }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{operation ? "Create Order" : "Edit Order"}</SheetTitle>

          <SheetDescription>
            {order
              ? "Update the order details below."
              : "Fill in the details create new order."}
          </SheetDescription>
        </SheetHeader>

        <OrderForm operation={operation} order={order} />
      </SheetContent>
    </Sheet>
  );
};

export default function Orders() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        sortField: sortConfig.key,
        sortOrder: sortConfig.direction,
      });

      const response = await fetch(`/api/orders?${searchParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, sortConfig, searchTerm]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status");
      }

      // Update the order in the local state
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return (
        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      );
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  console.log({ orders });

  return (
    <section className="space-y-8 w-full">
      <div className="flex gap-4 flex-col w-full md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-2xl font-bold">Orders</h3>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Create new order button */}
          <OrderSheet>
            <Button>
              <Plus className="w-4 h-4" />

              <span className="hidden md:block">Create new order</span>
            </Button>
          </OrderSheet>
        </div>
      </div>

      {/* <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <div className="overflow-x-scroll">
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
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-gray-700">
              {orders.map((order) => (
                <React.Fragment key={order.orderId}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    onClick={() => toggleOrderDetails(order.orderId)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        )}
                        <span className="font-medium dark:text-white">
                          {order.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 dark:text-gray-300">
                      {order.customer.name}
                    </td>

                    <td className="px-6 py-4 dark:text-gray-300">
                      {order.updatedAt}
                    </td>

                    <td className="px-6 py-4 dark:text-gray-300">
                      ${order.amount.toFixed(2)}
                    </td>

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
                        {expandedOrder === order.id ? "Hide" : "View"}
                      </Button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-expanded`}>
                      <td
                        colSpan="6"
                        className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4"
                      >
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Order Items
                            </h3>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div
                                  key={`${order.id}-item-${index}`}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="dark:text-gray-300">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t dark:border-gray-700 pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span className="dark:text-white">Total</span>
                                  <span className="dark:text-white">
                                    ${order.amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Shipping Details
                            </h3>
                            <div className="text-sm space-y-1">
                              <p className="text-gray-600 dark:text-gray-400">
                                {order.shipping.address}
                              </p>
                              <p className="dark:text-gray-300">
                                Method:{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {order.shipping.method}
                                </span>
                              </p>
                              <p className="dark:text-gray-300">
                                Tracking:{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {order.shipping.tracking}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Payment Information
                            </h3>
                            <div className="text-sm space-y-1">
                              <p className="dark:text-gray-300">
                                Method:{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {order.payment.method}
                                </span>
                              </p>
                              {order.payment.last4 && (
                                <p className="dark:text-gray-300">
                                  Card ending in:{" "}
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {order.payment.last4}
                                  </span>
                                </p>
                              )}
                              {order.payment.email && (
                                <p className="dark:text-gray-300">
                                  PayPal email:{" "}
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {order.payment.email}
                                  </span>
                                </p>
                              )}
                              <p className="dark:text-gray-300">
                                Status:{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {order.payment.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>


        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} orders
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div> */}

      <div className="overflow-x-scroll w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Ordered Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && orders.length
              ? orders.map((order) => (
                  <TableRow key={order?.orderId}>
                    <TableCell className="p-4">{order?.orderId}</TableCell>
                    <TableCell className="p-4">
                      {order?.customer?.name}
                    </TableCell>
                    <TableCell className="p-4">{order?.createdAt}</TableCell>
                    <TableCell className="p-4">
                      <StatusBadge status={order?.status} />
                    </TableCell>
                    <TableCell className="p-4">$ {order?.amount}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="outline">
                        <Ellipsis />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>

      {loading && <div className="p-6 text-center">Loading orders...</div>}
    </section>
  );
}
