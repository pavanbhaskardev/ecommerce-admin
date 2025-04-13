"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

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

          <Button>
            <Plus className="w-4 h-4" />
            <span className="hidden md:block">Create new key</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ApiKeys;
