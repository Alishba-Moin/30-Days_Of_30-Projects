"use client"; // Enables client-side rendering for this component

import React, { useState, useEffect, useCallback } from "react"; // Import React hooks
import Image from "next/image"; // Import Next.js Image component
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Import custom Carousel components
import { Button } from "@/components/ui/button"; // Import custom Button component
import { PlayIcon, PauseIcon, ArrowLeftIcon, ArrowRightIcon, Minimize, FullscreenIcon } from "lucide-react"; // Import icons from lucide-react

// Define the ImageData interface
interface ImageData {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export default function ImageSlider() {
  // State to manage the images fetched from the API
  const [images, setImages] = useState<ImageData[]>([]);
  // State to manage the current image index in the carousel
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // State to manage the play/pause status of the carousel
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(3000); // Default speed
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Function to fetch images from Unsplash API
  const fetchImages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=10`
      );
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // useEffect to fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Function to go to the next image
  const nextImage = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // useEffect to handle the autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(nextImage, autoplaySpeed);
      return () => clearInterval(id);
    }
  }, [isPlaying, nextImage, autoplaySpeed]);

  // Function to toggle play/pause status
  const togglePlayPause = (): void => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  // Function to change autoplay speed
  const changeSpeed = (speed: number) => {
    setAutoplaySpeed(speed);
  };

   // Toggle full-screen mode
   const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen); // Update the state
  };

  // JSX return statement rendering the Image Slider UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-8">
  <div className="w-full max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden">
    <h1 className="text-4xl font-extrabold text-center mb-6 text-[#39FF14]">
       Image Slider
    </h1>
    <p className="text-center text-white mb-8 font-extralight">
      A simple and modern dynamic image slider with Unsplash integration.
    </p>
       {/* Speed Selector */}
<div className="flex justify-center mb-6">
  <label className="mr-3 text-[#39FF14] font-bold">Autoplay Speed:</label>
  <select
    value={autoplaySpeed}
    onChange={(e) => changeSpeed(Number(e.target.value))}
    className="bg-black text-white border border-[#39FF14] rounded p-1 hover:bg-[#39FF14] hover:text-black transition-colors duration-300"

  >
    <option value={1000}>1s</option>
    <option value={2000}>2s</option>
    <option value={3000}>3s</option>
    <option value={5000}>5s</option>
  </select>
</div>
        <Carousel className="rounded-lg overflow-hidden relative">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={image.id}
                className={index === currentIndex ? "block transition-opacity duration-500" : "hidden"}
              >
                <Image
                  src={image.urls.regular}
                  alt={image.alt_description}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-white/75 text-center">
                  <h2 className="text-lg font-bold">{image.user.name}</h2>
                  <p className="text-sm">
                    {image.description || image.alt_description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Manual Navigation Buttons */}
          <Button
  onClick={prevImage}
  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-md shadow-lg hover:bg-opacity-70 rounded-full p-3 transition-all duration-300 ease-in-out"
>
  <ArrowLeftIcon className="w-8 h-8 text-[#39FF14]" />
</Button>
<Button
  onClick={nextImage}
  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-md shadow-lg hover:bg-opacity-70 rounded-full p-3 transition-all duration-300 ease-in-out"
>
  <ArrowRightIcon className="w- h-8 text-[#39FF14]" />
</Button>


<div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
  <Button
    variant="ghost"
    size="icon"
    onClick={togglePlayPause}
    className="bg-gradient-to-r from-white/70 to-gray-200/80 hover:from-white hover:to-gray-100 p-3 rounded-full shadow-lg border border-gray-300 transition-all duration-300 ease-in-out backdrop-blur-md text-black"
  >
    {isPlaying ? (
      <PauseIcon className="w-8 h-8 text-gray-900" />
    ) : (
      <PlayIcon className="w-8 h-8 text-gray-900" />
    )}
    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
  </Button>
</div>

        </Carousel>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-4">
          {images.map((_, index) => (
            <div key={index} className={`w-2 h-2 mx-1 rounded-full ${currentIndex === index ? 'bg-[#39FF14]' : 'bg-gray-300'}`} />
          ))}
        </div>

        {/* Full-Screen Toggle */}
        <Button
  onClick={toggleFullScreen}
  className="m-8 p-4 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00FFFF] text-black shadow-md hover:from-neon-green-light hover:to-neon-blue-light hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center border-2 border-white"
>
  {isFullScreen ? (
    // Exit Full Screen Icon
    <Minimize className="h-10 w-10" />
  ) : (
    // Enter Full Screen Icon
    <FullscreenIcon className="h-10 w-10" />
  )}
  <span className="sr-only">
    {isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
  </span>
</Button>

      </div>
    </div>
  );
}
