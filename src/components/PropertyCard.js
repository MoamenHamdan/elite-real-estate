'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiMaximize, FiBox, FiDroplet } from 'react-icons/fi';

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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="card group"
        >
            {/* Image Section */}
            <div className="relative h-72 overflow-hidden">
                <Image
                    src={mainImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider rounded">
                        {type}
                    </span>
                    <span className={`px-3 py-1 text-white text-xs font-bold uppercase tracking-wider rounded ${status === 'For Sale' ? 'bg-success' : 'bg-primary'
                        }`}>
                        {status}
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <p className="text-2xl font-bold">{formatCurrency(sellingPrice)}</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                    <FiMapPin className="text-accent" />
                    <span className="text-sm">{location}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                    <div className="flex flex-col items-center gap-1">
                        <FiMaximize className="text-gray-400" />
                        <span className="text-xs font-semibold text-primary">{size} sqm</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <FiBox className="text-gray-400" />
                        <span className="text-xs font-semibold text-primary">{bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <FiDroplet className="text-gray-400" />
                        <span className="text-xs font-semibold text-primary">{bathrooms} Baths</span>
                    </div>
                </div>

                <Link href={`/properties/${id}`} className="block mt-6">
                    <button className="w-full py-3 bg-light text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-300">
                        View Details
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
