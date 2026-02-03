'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from '@/components/PropertyCard';

export default function RentPage() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: 'All',
        location: 'All',
        priceRange: 'All',
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, 'properties'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const propertyList = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(p => p.status === 'For Rent');

            setProperties(propertyList);
            setLoading(false);
        }, (err) => {
            console.error("Firestore error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filterOptions = useMemo(() => {
        const types = ['All', ...new Set(properties.map(p => p.type))];
        const locations = ['All', ...new Set(properties.map(p => p.location))];
        return { types, locations };
    }, [properties]);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = filters.type === 'All' || p.type === filters.type;
            const matchesLocation = filters.location === 'All' || p.location === filters.location;

            return matchesSearch && matchesType && matchesLocation;
        });
    }, [properties, searchQuery, filters]);

    return (
        <div className="pt-40 pb-24 min-h-screen bg-light">
            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="max-w-4xl mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent font-bold tracking-[0.3em] uppercase mb-4 block"
                    >
                        Premium Rentals
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold mb-6"
                    >
                        Exclusive <span className="text-accent">Leasing</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl leading-relaxed text-gray-500"
                    >
                        Discover our collection of high-end properties available for long-term lease.
                        Each residence offers unparalleled luxury and strategic location.
                    </motion.p>
                </div>

                {/* Search Bar */}
                <div className="mb-16">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-grow relative group">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search rentals by title or location..."
                                className="w-full pl-16 pr-6 py-6 bg-white rounded-[2rem] shadow-luxury border border-transparent focus:border-accent/20 outline-none transition-all text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-bold"
                        >
                            <FiFilter /> Filters
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[600px] rounded-[2rem] bg-white animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] shadow-luxury border border-gray-50">
                        <h3 className="text-3xl font-serif font-bold mb-4">No rentals found</h3>
                        <p className="text-xl text-gray-500">Check back soon for new premium opportunities.</p>
                    </div>
                )}
            </div>

            {/* Simple Mobile Filters */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-primary/40 z-[60] backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-[70] p-12 overflow-y-auto rounded-l-[3rem] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-16">
                                <h2 className="text-4xl font-serif font-bold">Filter <span className="text-accent">Rentals</span></h2>
                                <button onClick={() => setShowMobileFilters(false)} className="w-12 h-12 flex items-center justify-center bg-light rounded-full">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Property Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {filterOptions.types.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFilters({ ...filters, type: t })}
                                                className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all ${filters.type === t ? 'bg-primary text-white' : 'bg-light text-primary'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full btn-primary !py-6 !text-lg"
                                >
                                    Show {filteredProperties.length} Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
