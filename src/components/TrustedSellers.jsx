"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Package, ShoppingBag, MapPin, Loader2, Star } from "lucide-react";
import { Avatar } from "@heroui/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TrustedSellers() {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sellers/top`
        );
        const data = await res.json();
        setSellers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-900 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14 gap-3"
        >
          <span className="px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            Top Sellers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Trusted{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500">
              Sellers
            </span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Meet our top-rated sellers with proven track records. Buy with confidence from verified members of our community.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-amber-400" />
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-sm">
            No sellers available yet.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sellers.map((seller, index) => (
              <motion.div
                key={seller._id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="flex flex-col gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/30 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                {/* Top — Avatar + Name + Badge */}
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-md" />
                    <Avatar className="h-14 w-14 border-2 border-amber-500/30 relative z-10">
                      <Avatar.Image src={seller.image} alt={seller.name} />
                      <Avatar.Fallback className="bg-amber-500/10 text-amber-400 font-bold text-lg">
                        {seller.name?.charAt(0)?.toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 z-20 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <span className="text-[9px] font-extrabold text-white">
                          #{index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {seller.name}
                      </h3>
                      {seller.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <ShieldCheck className="size-3" /> Verified
                        </span>
                      )}
                    </div>

                    {seller.location && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <MapPin className="size-3" /> {seller.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-800/60" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
                    <Package className="size-4 text-purple-400" />
                    <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                      {seller.totalProducts}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Listings
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
                    <ShoppingBag className="size-4 text-emerald-400" />
                    <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                      {seller.completedOrders}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Sales
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < 4
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">
                    Top Seller
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}