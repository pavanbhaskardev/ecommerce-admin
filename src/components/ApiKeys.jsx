"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

const permissions = ["read", "read/write"];

const KeyForm = ({
  apiKey = undefined,
  setIsClosable = () => {},
  setIsOpen = () => {},
  fetchOrders = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: apiKey?.name || `store-key-${new Date().getTime()}`,
    permission: apiKey?.permission || "read/write",
  });
  const [originalKey, setOriginalKey] = useState("");
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsClosable(false);

    if (apiKey) {
      try {
        const response = await fetch(`/api/api-keys`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formState,
            _id: apiKey?._id,
          }),
        });

        const data = await response.json();

        if (data?._id) {
          fetchOrders();

          toast({
            title: "Successfully to updated API Key",
          });
        }
      } catch (error) {
        console.log({ error });

        toast({
          title: "Failed to update API Key",
          description: error?.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsClosable(true);
        setIsOpen(false);
      }
    } else {
      try {
        const response = await fetch(`/api/api-keys`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formState,
          }),
        });

        const data = await response.json();
        setOriginalKey(data?.originalKey);
        setShowCopyDialog(true);
      } catch (error) {
        console.log({ error });
        toast({
          title: "Failed to create API Key",
          description: error?.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <form
        className="w-full flex flex-col justify-between h-[calc(100%-4rem)] mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <Input
              name="name"
              required
              id="name"
              value={formState.name}
              onChange={(e) => {
                setFormState((current) => ({
                  ...current,
                  name: e.target.value,
                }));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission">Permission</Label>
            <Select
              defaultValue="read/write"
              required
              onValueChange={(value) => {
                setFormState((current) => ({ ...current, permission: value }));
              }}
            >
              <SelectTrigger id="permission">
                <SelectValue placeholder="Select permission to key" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {permissions.map((permission) => (
                    <SelectItem value={permission} key={permission}>
                      {permission}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="justify-between sm:justify-between w-full">
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              Save
            </Button>

            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </form>

      <Dialog open={showCopyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Store API Key</DialogTitle>
            <DialogDescription>
              Store this token safely this won't be shown again.
            </DialogDescription>
          </DialogHeader>

          <p className="w-full overflow-x-scroll">{originalKey}</p>

          <DialogFooter>
            <Button
              onClick={() => {
                setIsClosable(true);
                setShowCopyDialog(false);
                setIsOpen(false);
                fetchOrders();
              }}
            >
              I&apos;ve copied key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const KeySheet = ({ children, apiKey = undefined, fetchOrders = () => {} }) => {
  const [open, setIsOpen] = useState(false);
  const [isClosable, setIsClosable] = useState(true);

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        if (!isClosable) {
          return;
        }
        setIsOpen(state);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{apiKey ? "Edit API Key" : "Create API Key"}</SheetTitle>

          <SheetDescription>
            {apiKey
              ? "Update API Key details."
              : "Fill in the details create API Key."}
          </SheetDescription>
        </SheetHeader>

        <KeyForm
          apiKey={apiKey}
          setIsClosable={setIsClosable}
          setIsOpen={setIsOpen}
          fetchOrders={fetchOrders}
        />
      </SheetContent>
    </Sheet>
  );
};

const ApiKeyCard = ({ apiKey = {}, fetchOrders = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteKey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/api-keys`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: apiKey?._id,
        }),
      });

      const data = await response.json();

      if (data?._id) {
        toast({
          title: "Successfully deleted API Key",
        });

        fetchOrders();
      }
    } catch (error) {
      toast({
        title: "Failed to delete API Key",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{apiKey?.name}</CardTitle>

        <div className="space-x-3">
          <KeySheet apiKey={apiKey} fetchOrders={fetchOrders}>
            <Button
              size="icon"
              disabled={isLoading}
              variant="outline"
              className="!mt-0"
            >
              <Pencil size={16} />
            </Button>
          </KeySheet>

          <Button
            size="icon"
            disabled={isLoading}
            variant="destructive"
            className="!mt-0"
            onClick={async () => {
              await deleteKey();
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

const ApiKeys = () => {
  const [apiKeysData, setApiKeysData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/api-keys`);
      const data = await response.json();
      setApiKeysData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <section className="space-y-8 w-full">
      <div className="flex gap-4 flex-col w-full md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-2xl font-bold">API Keys</h3>
          <p className="text-muted-foreground">
            View and manage all API-keys for store access
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search keys..."
              className="pl-10 w-full"
            />
          </div>

          <KeySheet fetchOrders={fetchOrders}>
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden md:block">Create new key</span>
            </Button>
          </KeySheet>
        </div>
      </div>

      {isLoading ? <p className="text-center">Loading API Keys...</p> : null}

      {apiKeysData.length
        ? apiKeysData.map((apiKey) => {
            return (
              <ApiKeyCard
                key={apiKey?._id}
                apiKey={apiKey}
                fetchOrders={fetchOrders}
              />
            );
          })
        : null}
    </section>
  );
};

export default ApiKeys;
