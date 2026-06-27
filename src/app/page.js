import HeroBanner from "@/components/HeroBanner";
import Catagories from "@/components/Catagories";
import FeaturedProducts from "@/components/FeaturedProducts";
import GoogleRoleModal from "@/components/GoogleRoleModal";
import SuccessStories from "@/components/SuccessStories";
import MarketplaceStats from "@/components/MarketplaceStats";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import TrustedSellers from "@/components/TrustedSellers";

// layout বা page এর ভেতরে


export default function Home() {
  return (
        <div className="min-h-screen">
     <HeroBanner />
     <Catagories/>
     <FeaturedProducts/>
     <GoogleRoleModal />
     <SuccessStories />
     <MarketplaceStats />
     <SustainabilityImpact />
     <TrustedSellers />

    </div>
  );
}
