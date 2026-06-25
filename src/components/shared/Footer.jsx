"use client";

import Link from "next/link";

import { Recycle, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#09090b] border-t border-zinc-900 text-zinc-400 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">


                    <div className="space-y-4 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
                            <Recycle className="h-6 w-6 text-purple-400" />
                            <span>ReSell Hub</span>
                        </Link>
                        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                            A trusted second-hand marketplace to buy and sell pre-owned products safely, reduce waste, and promote sustainable consumption.
                        </p>
                    </div>


                    <div>
                        <h4 className="text-zinc-200 font-semibold mb-4 text-xs tracking-wider uppercase">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li>
                                <Link  href={"/products"} className="hover:text-purple-400 transition-colors">All Products</Link>
                            </li>
                            <li>
                                <Link href={"/categories"} className="hover:text-purple-400 transition-colors">Categories</Link>
                            </li>
                            <li>
                                <Link href={"/about"} className="hover:text-purple-400 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href={"/contact"} className="hover:text-purple-400 transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    
                    <div>
                        <h4 className="text-zinc-200 font-semibold mb-4 text-xs tracking-wider uppercase">
                            Contact Information
                            </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-purple-400" />
                                support@resellhub.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-purple-400" />
                                +880 1XXX-XXXXXX
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-purple-400" />
                                Dhaka, Bangladesh
                            </li>
                        </ul>
                    </div>

                    
                    <div>
                        <h4 className="text-zinc-200 font-semibold mb-4 text-xs tracking-wider uppercase">
                            Connect With Us
                            </h4>
                        <div className="flex items-center space-x-4 mb-4">
                        
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all" aria-label="Facebook">
                                <FaFacebook />
                            </a>

                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all" aria-label="GitHub">

                                <FaGithub className="h-4 w-4" />
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all" aria-label="LinkedIn">
                                <FaLinkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                </div>

                
                <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <p>© {currentYear} ReSell Hub. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Buy smart. Sell easy. <span className="text-zinc-400 font-medium">Recycle responsibly.</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}