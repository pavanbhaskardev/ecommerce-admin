"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Banner() {
    const [api, setApi] = useState(null);
    useEffect(() => {
      if (!api) return;
  
      const interval = setInterval(() => {
        api.scrollNext();
      }, 5000); // Change slide every 5 seconds
  
      return () => clearInterval(interval);
    }, [api]);
    return (
        <div className="flex-1 ">
        <div className="p-6">
          {/* Banner Carousel */}
          <div>
            <Carousel 
              className="w-full" 
              setApi={setApi}
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg p-8 text-white h-48  lg:h-96">
                      <h2 className="text-2xl font-bold mb-2">Summer Sale</h2>
                      <p className="mb-4">Up to 50% off on selected items</p>
                      <Button variant="secondary">Shop Now</Button>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-8 text-white  h-48  lg:h-96">
                      <h2 className="text-2xl font-bold mb-2">New Collection</h2>
                      <p className="mb-4">Check out our latest arrivals</p>
                      <Button variant="secondary">Explore</Button>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-8 text-white  h-48  lg:h-96">
                      <h2 className="text-2xl font-bold mb-2">Flash Sale</h2>
                      <p className="mb-4">Limited time offers - ends in 24 hours</p>
                      <Button variant="secondary">View Deals</Button>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>

  );
}
