"use client";

import { useSession } from "@clerk/nextjs";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Banner from "@/components/Home/banner";
import Stats from "@/components/Home/stats";
import { Separator } from "@/components/ui/separator";
import ShowLogin from "@/components/Home/show-login";

export default function Home() {
  const { session } = useSession();
  
  // If user is not logged in, show the home page with banner and login prompt

    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <Banner />
        <Separator />
        {session ? <Stats /> : <ShowLogin />}
      </div>
    );

}
