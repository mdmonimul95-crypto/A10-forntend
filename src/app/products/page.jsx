"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin, ShieldCheck, Tag, Loader2, ImageOff,
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@heroui/react";
import { useSearchParams } from "next/navigation";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const categories = ["Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones", "Books", "Sports", "Home & Garden"];
const conditions = ["Used", "Like New", "Refurbished"];
const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (condition) params.set("condition", condition);
      if (sort) params.set("sort", sort);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, condition, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setCondition("");
    setSort("");
  };

  // Pagination
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = search || category || condition || sort;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#09090b] min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold tracking-wider uppercase mb-2">
            <Tag className="h-4 w-4" /> Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            All <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Products</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLoading ? "Loading..." : `${allProducts.length} products found`}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-10">

          {/* Search */}
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
                placeholder="Search by product name or category..."
                className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <button
              onClick={fetchProducts}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <SlidersHorizontal className="size-4 text-zinc-500 shrink-0" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
            >
              <option value="">All Conditions</option>
              {conditions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
            >
              <option value="">Default Sort</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 text-sm transition-all"
              >
                <X className="size-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-purple-400" />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-sm flex flex-col items-center gap-3">
            <ImageOff className="size-10 text-zinc-700" />
            <p>No products found. Try changing your search or filter.</p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col justify-between bg-zinc-900/40 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm"
                >
                  {/* Image */}
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
                      <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mb-4">
                        <span className="text-lg font-bold text-zinc-100">
                          ৳{Number(product.price).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-zinc-500 truncate">
                          by <span className="text-zinc-400">{product.sellerInfo?.name}</span>
                        </span>
                        <Link href={`/products/${product._id}`}>
                          <Button className="text-xs font-semibold bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-200 px-4 py-2 rounded-xl border border-zinc-700/60 hover:border-purple-500/50 transition-all active:scale-95 whitespace-nowrap">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">

                {/* Prev */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === currentPage;
                  const isNear = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;

                  if (!isNear) {
                    if (page === 2 || page === totalPages - 1) {
                      return <span key={page} className="text-zinc-600 text-sm">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-9 w-9 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-purple-600 text-white border border-purple-500 shadow-lg shadow-purple-500/20"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="size-4" />
                </button>

              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <p className="text-center text-xs text-zinc-600 mt-3">
                Page {currentPage} of {totalPages} — {allProducts.length} products
              </p>
            )}
          </>
        )}

      </div>
    </section>
  );
}