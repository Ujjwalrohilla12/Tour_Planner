import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroSection from "./_components/HeroSection";
import { FamousCityList } from "./_components/FamousCityList";

export default function Home() {
  return (
    <div> 
        {/* Hero Section will be added here */}
        <HeroSection/>
        <FamousCityList/>
    </div>
  );
}
