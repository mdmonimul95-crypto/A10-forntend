import HeroBanner from "@/components/HeroBanner";
import Catagories from "@/components/Catagories";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
        <div className="min-h-screen">
     <HeroBanner />
     <Catagories/>
     <FeaturedProducts/>
    </div>
  );
}
