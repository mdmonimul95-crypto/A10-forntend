"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Star, ShieldCheck, ArrowUpRight, Tag } from "lucide-react";
import { Button } from "@heroui/react";


const MOCK_PRODUCTS = [
    {
        id: "product001",
        title: "Used Dell Inspiron 15 Laptop",
        category: "Electronics",
        condition: "Good",
        price: 35000,
        location: "Dhaka, Bangladesh",
        rating: 4.9,
        seller: "Nusrat Jahan",
        verifiedSeller: true,
    },

    {
        id: "product002",
        title: "Wooden Study Table with Chair",
        category: "Furniture",
        condition: "Like New",
        price: 4500,
        location: "Chattogram, Bangladesh",
        rating: 4.8,
        seller: "Sumi Khan",
        verifiedSeller: true,
    },

    {
        id: "product003",
        title: "iPhone 12, 128GB, Blue",
        category: "Mobile Phones",
        condition: "Good",
        price: 38000,
        location: "Dhaka, Bangladesh",
        rating: 5.0,
        seller: "Dev Jhon",
        verifiedSeller: false,
    },

    {
        id: "product004",
        title: "Yamaha FZ-S V3 Motorcycle",
        category: "Vehicles",
        condition: "Used",
        price: 165000,
        location: "Sylhet, Bangladesh",
        rating: 4.6,
        seller: "Rony Ahmed",
        verifiedSeller: false,
    },

    {
        id: "product005",
        title: "Leather Jacket, Size L",
        category: "Fashion",
        condition: "Like New",
        price: 1800,
        location: "Dhaka, Bangladesh",
        rating: 4.9,
        seller: "Anika Roy",
        verifiedSeller: true,
    },

    {
        id: "product006",
        title: "Gaming Mechanical Keyboard",
        category: "Electronics",
        condition: "Refurbished",
        price: 2800,
        location: "Khulna, Bangladesh",
        rating: 4.7,
        seller: "Asif Iqbal",
        verifiedSeller: false,
    },
];

export default function FeaturedProducts() {

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


                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {MOCK_PRODUCTS.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={cardVariants}
                            whileHover={{ y: -6 }}
                            className="group relative flex flex-col justify-between bg-zinc-900/40 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm"
                        >
                            <div>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                                        {product.condition}
                                    </span>
                                    {product.verifiedSeller && (
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

                                <p className="text-xs text-zinc-500 mb-6 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {product.location}
                                </p>
                            </div>


                            <div>
                                <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mb-4 text-xs text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-lg font-bold text-zinc-100">
                                            ৳{product.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="font-medium text-zinc-200">{product.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-zinc-500 truncate">
                                        by <span className="text-zinc-400 hover:underline cursor-pointer">{product.seller}</span>
                                    </span>


                                    <Link href={`/products/${product.id}`}>
                                        <Button
                                            className="text-xs font-semibold bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-200 px-4 py-2 rounded-xl border border-zinc-700/60 hover:border-purple-500/50 transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}