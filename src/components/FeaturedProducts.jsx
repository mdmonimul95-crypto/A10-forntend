"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Star, ShieldCheck, ArrowUpRight, Tag, Loader2, ImageOff } from "lucide-react";
import { Button } from "@heroui/react";

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                const data = await res.json();

                const latest = [...data]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6);

                setProducts(latest);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#09090b] border-b border-zinc-900 relative">
            <div className="max-w-7xl mx-auto">

                {/* header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold tracking-wider uppercase mb-2">
                            <Tag className="h-4 w-4" /> Marketplace
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Latest <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Products</span>
                        </h2>
                    </div>

                    <Link
                        href={"/products"}
                        className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-purple-400 transition-colors group"
                    >
                        View all products
                        <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-6 animate-spin text-purple-400" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 text-sm">
                        No products available yet. Check back soon!
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product._id}
                                variants={cardVariants}
                                whileHover={{ y: -6 }}
                                className="group relative flex flex-col justify-between bg-zinc-900/40 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm"
                            >
                                {/* Product Image */}
                                <div className="relative w-full aspect-[4/3] bg-zinc-800/50 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                            <ImageOff className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                                {product.condition}
                                            </span>
                                            {product.sellerInfo?.verified && (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                                                </span>
                                            )}
                                        </div>


                                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-purple-400 transition-colors mb-2 line-clamp-1">
                                            {product.title}
                                        </h3>


                                        <p className="text-xs text-zinc-500 mb-1">
                                            Category: <span className="text-zinc-400 font-medium">{product.category}</span>
                                        </p>

                                        {product.location && (
                                            <p className="text-xs text-zinc-500 mb-6 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {product.location}
                                            </p>
                                        )}
                                    </div>


                                    <div>
                                        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mb-4 text-xs text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-lg font-bold text-zinc-100">
                                                    ৳{Number(product.price).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs text-zinc-500 truncate">
                                                by <span className="text-zinc-400 hover:underline cursor-pointer">{product.sellerInfo?.name}</span>
                                            </span>


                                            <Link href={`/products/${product._id}`}>
                                                <Button
                                                    className="text-xs font-semibold bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-200 px-4 py-2 rounded-xl border border-zinc-700/60 hover:border-purple-500/50 transition-all active:scale-95 whitespace-nowrap"
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

            </div>
        </section>
    );
}