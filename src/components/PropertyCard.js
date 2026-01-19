'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiMaximize, FiBox, FiDroplet, FiArrowRight } from 'react-icons/fi';

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
        status
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
            className="card group h-full flex flex-col"
        >
            {/* Image Section */}
            <div className="relative h-80 overflow-hidden">
                <Image
                    src={mainImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-1.5 glass-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                        {type}
                    </span>
                    <span className={`px-4 py-1.5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full ${status === 'For Sale' ? 'bg-success' : 'bg-accent'
                        }`}>
                        {status}
                    </span>
                </div>

                {/* Price Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <p className="text-3xl font-serif font-bold text-white tracking-tight">
                        {formatCurrency(sellingPrice)}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-accent mb-3">
                    <FiMapPin size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">{location}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold mb-6 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-50 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-light flex items-center justify-center text-gray-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                            <FiMaximize size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{size} sqm</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-light flex items-center justify-center text-gray-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                            <FiBox size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-light flex items-center justify-center text-gray-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                            <FiDroplet size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bathrooms} Baths</span>
                    </div>
                </div>

                <Link href={`/properties/${id}`} className="mt-auto">
                    <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-accent transition-all duration-500 flex items-center justify-center gap-3 group/btn">
                        View Investment <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
