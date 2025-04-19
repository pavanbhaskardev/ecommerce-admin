"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

const permissions = ["read", "read/write"];

const KeyForm = ({
  apiKey = undefined,
  setIsClosable = () => {},
  setIsOpen = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: `store-key-${new Date().getTime()}`,
    permission: "read/write",
  });
  const [originalKey, setOriginalKey] = useState("");
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsClosable(false);

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
      console.log({ data });

      setOriginalKey(data?.originalKey);
      setShowCopyDialog(true);
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
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

      <AlertDialog open={showCopyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Copy Store API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Store this token safely this won't be shown again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <p>{originalKey}</p>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsClosable(true);
                setIsOpen(false);
              }}
            >
              I&apos;ve copied key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const KeySheet = ({ children, operation = "create", apiKey = undefined }) => {
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
          <SheetTitle>
            {operation ? "Create API Key" : "Edit API Key"}
          </SheetTitle>

          <SheetDescription>
            {apiKey
              ? "Update API Key details."
              : "Fill in the details create API Key."}
          </SheetDescription>
        </SheetHeader>

        <KeyForm setIsClosable={setIsClosable} setIsOpen={setIsOpen} />
      </SheetContent>
    </Sheet>
  );
};

const ApiKeys = () => {
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

          <KeySheet>
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden md:block">Create new key</span>
            </Button>
          </KeySheet>
        </div>
      </div>
    </section>
  );
};

export default ApiKeys;
