import HeroBanner from "@/components/HeroBanner";
import Catagories from "@/components/Catagories";
import FeaturedProducts from "@/components/FeaturedProducts";
import GoogleRoleModal from "@/components/GoogleRoleModal";

// layout বা page এর ভেতরে


export default function Home() {
  return (
        <div className="min-h-screen">
     <HeroBanner />
     <Catagories/>
     <FeaturedProducts/>
     <GoogleRoleModal />

    </div>
  );
}
