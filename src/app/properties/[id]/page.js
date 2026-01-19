'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiMaximize, FiBox, FiDroplet, FiArrowLeft,
    FiCheckCircle, FiCalendar, FiTrendingUp, FiDollarSign,
    FiChevronLeft, FiChevronRight, FiDownload, FiShare2
} from 'react-icons/fi';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function PropertyDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [amenities, setAmenities] = useState([
        "Premium Interior Finishes", "Smart Home Integration",
        "Energy Efficient Systems", "Private Outdoor Space",
        "High-Security Access", "Concierge Services"
    ]);

    useEffect(() => {
        const unsubProperty = onSnapshot(doc(db, 'properties', id), (snapshot) => {
            if (snapshot.exists()) {
                setProperty({ id: snapshot.id, ...snapshot.data() });
            } else {
                router.push('/properties');
            }
            setLoading(false);
        });

        const unsubMetadata = onSnapshot(doc(db, 'content', 'metadata'), (snapshot) => {
            if (snapshot.exists() && snapshot.data().amenities) {
                setAmenities(snapshot.data().amenities);
            }
        });

        return () => {
            unsubProperty();
            unsubMetadata();
        };
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!property) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-light min-h-screen pb-24">
            {/* Hero Gallery Section */}
            <section className="relative h-[85vh] bg-primary overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        src={property.images[activeImage]}
                        className="w-full h-full object-cover brightness-[0.7]"
                        alt={property.title}
                    />
                </AnimatePresence>

                {/* Navigation Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

                <div className="absolute top-32 left-0 right-0 z-10">
                    <div className="container-custom">
                        <Link href="/properties">
                            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm">
                                <FiArrowLeft /> Back to Inventory
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 z-10">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div className="max-w-3xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 mb-6"
                                >
                                    <span className="px-4 py-1.5 glass-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                        {property.type}
                                    </span>
                                    <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                        {property.status}
                                    </span>
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
                                >
                                    {property.title}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 text-gray-300 text-xl"
                                >
                                    <FiMapPin className="text-accent" />
                                    {property.location}
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="glass p-8 rounded-[2rem] min-w-[300px]"
                            >
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Investment Value</p>
                                <p className="text-5xl font-serif font-bold text-primary mb-6">
                                    {formatCurrency(property.sellingPrice)}
                                </p>
                                <button className="btn-primary w-full !py-5">
                                    Request Brochure
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Image Thumbnails */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20">
                    {property.images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${activeImage === i ? 'border-accent scale-110 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'
                                }`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Content Section */}
            <section className="pt-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-8 space-y-16">
                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: 'Total Area', value: `${property.size} sqm`, icon: <FiMaximize /> },
                                    { label: 'Bedrooms', value: property.bedrooms, icon: <FiBox /> },
                                    { label: 'Bathrooms', value: property.bathrooms, icon: <FiDroplet /> },
                                    { label: 'Built Year', value: '2023', icon: <FiCalendar /> }
                                ].map((spec, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2rem] shadow-luxury border border-gray-50">
                                        <div className="text-accent text-2xl mb-4">{spec.icon}</div>
                                        <div className="text-2xl font-bold text-primary mb-1">{spec.value}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{spec.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white p-12 rounded-[3rem] shadow-luxury border border-gray-50">
                                <h2 className="text-3xl font-serif font-bold mb-8">Investment <span className="text-accent">Overview</span></h2>
                                <div className="prose prose-xl max-w-none text-gray-500 leading-relaxed">
                                    {property.description.split('\n').map((para, i) => (
                                        <p key={i} className="mb-6">{para}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="bg-white p-12 rounded-[3rem] shadow-luxury border border-gray-50">
                                <h2 className="text-3xl font-serif font-bold mb-8">Key <span className="text-accent">Features</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {amenities.map((amenity, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-light group hover:bg-accent transition-all duration-500">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-accent group-hover:text-primary transition-colors">
                                                <FiCheckCircle />
                                            </div>
                                            <span className="font-bold text-gray-600 group-hover:text-white transition-colors">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Investment Analysis */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-32">
                                <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                    <h3 className="text-2xl font-serif font-bold mb-8">Investment Analysis</h3>

                                    <div className="space-y-8 mb-12">
                                        <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Projected ROI</p>
                                                <p className="text-4xl font-bold text-accent">{property.roi}%</p>
                                            </div>
                                            <FiTrendingUp className="text-4xl text-accent/20" />
                                        </div>
                                        <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Profit</p>
                                                <p className="text-4xl font-bold text-white">{formatCurrency(property.profit)}</p>
                                            </div>
                                            <FiDollarSign className="text-4xl text-accent/20" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button className="btn-primary w-full !py-5 flex items-center justify-center gap-3">
                                            <FiDownload /> Download Prospectus
                                        </button>
                                        <button className="w-full py-5 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                                            <FiShare2 /> Share Opportunity
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 p-8 bg-white rounded-[2rem] shadow-luxury border border-gray-50 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-serif font-bold">
                                        MK
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Investment Advisor</p>
                                        <p className="text-lg font-bold text-primary">Mohamad Kaydouh</p>
                                        <button className="text-accent text-sm font-bold hover:underline">Contact Advisor</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
