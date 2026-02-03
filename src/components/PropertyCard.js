'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Maximize2, BedDouble, Bath, ArrowRight, Star, Heart } from 'lucide-react';

const PropertyCard = ({ property }) => {
    const {
        id,
        title,
        location,
        type,
        size,
        bedrooms,
        bathrooms,
        sellingPrice,
        images,
        status,
        isHotDeal
    } = property;

    const mainImage = images && images.length > 0
        ? images[0]
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop';

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-700 h-full flex flex-col border border-gray-100"
        >
            {/* Image Section */}
            <div className="relative h-72 overflow-hidden">
                <Image
                    src={mainImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                    {isHotDeal && (
                        <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/40 animate-pulse">
                            <span>🔥</span> Hot Deal
                        </span>
                    )}
                    <span className="px-4 py-2 glass-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                        {type}
                    </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-6 right-6 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white hover:bg-accent transition-colors duration-300 z-10">
                    <Heart size={18} />
                </button>

                {/* Status Overlay */}
                <div className="absolute bottom-6 left-6 z-10">
                    <span className={`px-5 py-2 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full backdrop-blur-md shadow-lg ${status === 'For Sale' ? 'bg-success/80' : 'bg-red-600/90'
                        }`}>
                        {status === 'Sold' && <span className="mr-2 italic">●</span>}
                        {status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/5 rounded-lg border border-accent/10">
                        <MapPin size={12} className="text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent/80">{location}</span>
                    </div>
                </div>

                <h3 className="text-2xl font-serif font-bold mb-6 line-clamp-2 group-hover:text-accent transition-all duration-500 leading-snug">
                    {title}
                </h3>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-50 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <Maximize2 size={18} className="text-gray-400 group-hover:text-accent transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{size} sqm</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <BedDouble size={18} className="text-gray-400 group-hover:text-accent transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Bath size={18} className="text-gray-400 group-hover:text-accent transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{bathrooms} Baths</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Investment</p>
                        <p className="text-2xl font-serif font-bold text-primary">
                            {formatCurrency(sellingPrice)}
                        </p>
                    </div>
                    <Link href={`/properties/${id}`}>
                        <button className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-accent transition-all duration-500 group/btn shadow-lg">
                            <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
