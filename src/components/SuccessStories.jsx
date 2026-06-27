"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const stories = [
  {
    id: 1,
    name: "Md. Rakib Hasan",
    role: "Buyer",
    location: "Dhaka, Bangladesh",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    story:
      "I found a perfectly working laptop at half the market price. The seller was honest about the condition and delivery was quick. ReSell Hub saved me thousands of taka!",
    product: "Dell Inspiron 15 Laptop",
    roleColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    role: "Seller",
    location: "Chittagong, Bangladesh",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    story:
      "I sold my old furniture within 2 days of listing. The platform is so easy to use and I got a fair price. Already listed 5 more items and all sold quickly!",
    product: "Wooden Study Table",
    roleColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    role: "Buyer",
    location: "Sylhet, Bangladesh",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    story:
      "Bought a Samsung Galaxy phone in like-new condition. Verified seller badge gave me confidence. The product was exactly as described. Highly recommend this platform!",
    product: "Samsung Galaxy A52",
    roleColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    id: 4,
    name: "Sumi Khan",
    role: "Seller",
    location: "Rajshahi, Bangladesh",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    story:
      "As a seller, I love how ReSell Hub handles everything. Payment is secure, buyers are genuine, and the dashboard makes managing orders super easy. My monthly earnings doubled!",
    product: "Fashion Collection",
    roleColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: 5,
    name: "Anika Roy",
    role: "Buyer",
    location: "Khulna, Bangladesh",
    avatar: "https://i.pravatar.cc/150?img=20",
    rating: 4,
    story:
      "The wishlist feature is amazing! I saved products and bought them when I was ready. Found a great deal on home furniture. Will definitely buy again from ReSell Hub.",
    product: "Home Furniture Set",
    roleColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    id: 6,
    name: "Karim Uddin",
    role: "Seller",
    location: "Barisal, Bangladesh",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    story:
      "I was skeptical at first but ReSell Hub exceeded my expectations. Listed my old bike and got 3 serious buyers within a day. The platform is trustworthy and professional.",
    product: "Honda CB150R",
    roleColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function SuccessStories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 gap-3">
          <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
              Community Says
            </span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Real stories from buyers and sellers who found value on ReSell Hub.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stories.map((s) => (
            <motion.div
              key={s.id}
              variants={cardVariants}
              className="flex flex-col gap-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 shadow-sm dark:shadow-none"
            >
              {/* Quote Icon */}
              <Quote className="size-6 text-purple-500/40" />

              {/* Story */}
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                {s.story}
              </p>

              {/* Product */}
              <p className="text-xs text-purple-400 font-medium">
                📦 {s.product}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3.5 ${
                      i < s.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-200 dark:border-zinc-800/60" />

              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {s.name}
                  </span>
                  <span className="text-xs text-zinc-500">{s.location}</span>
                </div>
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${s.roleColor}`}>
                  {s.role}
                </span>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}