"use client";

import { motion } from "framer-motion";
import { Leaf, Recycle, TrendingDown, Globe, TreePine, Droplets } from "lucide-react";

const impactStats = [
  {
    icon: Recycle,
    value: "2.5M+",
    label: "Items Recycled",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: TrendingDown,
    value: "40%",
    label: "Less Carbon Footprint",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: TreePine,
    value: "10K+",
    label: "Trees Equivalent Saved",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: Droplets,
    value: "500K L",
    label: "Water Saved",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

const benefits = [
  {
    icon: Leaf,
    title: "Reduce Waste",
    description:
      "Every second-hand purchase keeps items out of landfills, extending product life and reducing environmental burden.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Globe,
    title: "Lower Carbon Emissions",
    description:
      "Buying pre-owned products skips the manufacturing process entirely, drastically cutting CO₂ emissions.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Recycle,
    title: "Promote Circular Economy",
    description:
      "ReSell Hub connects buyers and sellers to create a sustainable loop — where nothing goes to waste.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SustainabilityImpact() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14 gap-3"
        >
          <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            Sustainability
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">
              Environmental Impact
            </span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Every purchase on ReSell Hub is a step toward a greener planet. See how second-hand buying is making a real difference.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
        >
          {impactStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border ${stat.border} ${stat.bg} bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm text-center shadow-sm dark:shadow-none`}
              >
                <div className={`p-3 rounded-xl bg-white dark:bg-zinc-900/60 border ${stat.border}`}>
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <span className={`text-3xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Benefits */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <div className={`p-3 rounded-xl ${benefit.bg} border ${benefit.border} w-fit`}>
                  <Icon className={`size-6 ${benefit.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${benefit.color} mb-2`}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-500 dark:text-zinc-500 text-sm">
            Join{" "}
            <span className="text-emerald-400 font-semibold">50,000+</span>{" "}
            conscious buyers and sellers making a difference every day.
          </p>
        </motion.div>

      </div>
    </section>
  );
}