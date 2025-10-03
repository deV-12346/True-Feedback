"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from '../../types/messages.json';
const page = () => {
  return (
    <>
    <div className='flex flex-col items-center justify-between px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-black font-extrabold text-xl md:text-4xl mb-4'>
          Dive into the world of anonmymous converstions</h1>
        <p className='my-3 text-[18px] md:text-2xl text-cyan-600 font-medium text-center'>Explore Mystery Message - where your identity remains secret</p>
      </section>
       <Carousel className="w-full max-w-xs" plugins={[Autoplay({delay:3000})]}>
      <CarouselContent>
        {messages.map((message,index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <p>{message.title}</p>
                </CardHeader>
                <CardContent className="flex aspect-auto items-center justify-center px-10 py-5">
                  <span className="text-2xl font-semibold">{message.content}</span>
                </CardContent>
                <CardFooter>
                  <p>{message.received}</p>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
    <footer className="text-center p-4 md:p-12 text-black font-light">
   &copy;  Mystery Messages. All right reserved.
    </footer>
    </>
  )
}

export default page
