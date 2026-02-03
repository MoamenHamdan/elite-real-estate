'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, MapPin, Home, DollarSign, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const Hero = ({ content }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyType, setPropertyType] = useState('All');
    const [priceRange, setPriceRange] = useState('All');

    const images = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-navy">
            {/* Background Images with Crossfade */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[currentImage]}
                            className="w-full h-full object-cover"
                            alt="Luxury Real Estate"
                            fill
                            priority={currentImage === 0}
                            sizes="100vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Decorative Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/40 to-navy/90 z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-transparent z-20"></div>
            </div>

            <div className="container-custom relative z-10 w-full">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-[1px] bg-accent"></span>
                            <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm">
                                Premium Real Estate Lebanon
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
                            Elevate Your <br />
                            <span className="text-gradient italic">Lifestyle</span> with <span className="text-white">Buyers-lb</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-light">
                            {content?.hero?.subtitle || "Discover an exclusive collection of high-yield properties and luxury residences in Lebanon's most prestigious locations."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/properties">
                                <button className="btn-primary !px-12 !py-6 text-xl shadow-2xl shadow-accent/20">
                                    Explore Inventory <ArrowRight className="ml-2" />
                                </button>
                            </Link>
                            <Link href="/about">
                                <button className="btn-secondary !bg-white/5 !text-white !border-white/20 hover:!bg-white/10 hover:!border-white/40 !px-12 !py-6 text-xl backdrop-blur-xl transition-all duration-500">
                                    Our Philosophy
                                </button>
                            </Link>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 right-10 z-30 hidden md:flex flex-col items-center gap-4"
            >
                <div className="h-24 w-px bg-gradient-to-b from-accent to-transparent"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent [writing-mode:vertical-lr]">
                    Scroll to Explore
                </span>
            </motion.div>
        </section>
    );
};

export default Hero;
