'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMapPin, FiMaximize, FiBox, FiDroplet, FiCalendar, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';

export default function PropertyDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const propertyRef = ref(database, `properties/${id}`);
        onValue(propertyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setProperty(data);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="pt-32 pb-24 min-h-screen text-center">
                <h2 className="text-3xl font-bold mb-4">Property Not Found</h2>
                <button onClick={() => router.push('/properties')} className="btn-primary">Back to Inventory</button>
            </div>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="pt-32 pb-24 bg-white">
            <div className="container-custom">
                {/* Navigation & Title */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-accent mb-8 transition-colors"
                >
                    <FiArrowLeft /> Back to Properties
                </button>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
                    <div>
                        <div className="flex gap-3 mb-4">
                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider rounded">
                                {property.type}
                            </span>
                            <span className={`px-3 py-1 text-white text-xs font-bold uppercase tracking-wider rounded ${property.status === 'For Sale' ? 'bg-success' : 'bg-primary'
                                }`}>
                                {property.status}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{property.title}</h1>
                        <div className="flex items-center gap-2 text-gray-500 text-lg">
                            <FiMapPin className="text-accent" />
                            <span>{property.location}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Investment Price</p>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(property.sellingPrice)}</p>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
                    <div className="lg:col-span-3 relative aspect-[16/9] rounded-3xl overflow-hidden shadow-luxury">
                        <Image
                            src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'}
                            alt={property.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto max-h-[600px] pb-4 lg:pb-0">
                        {property.images?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`relative flex-shrink-0 w-32 lg:w-full aspect-square rounded-2xl overflow-hidden border-4 transition-all ${activeImage === index ? 'border-accent shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 border-b border-gray-100 pb-4">Property Overview</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        <FiMaximize /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Size</span>
                                    </div>
                                    <p className="text-lg font-bold">{property.size} sqm</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        <FiBox /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Bedrooms</span>
                                    </div>
                                    <p className="text-lg font-bold">{property.bedrooms}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        <FiDroplet /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Bathrooms</span>
                                    </div>
                                    <p className="text-lg font-bold">{property.bathrooms}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        <FiCalendar /> <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Listed</span>
                                    </div>
                                    <p className="text-lg font-bold">{new Date(property.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </section>

                        {/* Description */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 border-b border-gray-100 pb-4">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                                {property.description}
                            </p>
                        </section>

                        {/* Features/Amenities Placeholder */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6 border-b border-gray-100 pb-4">Key Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Premium Interior Finishes',
                                    'Smart Home Integration',
                                    'Energy Efficient Systems',
                                    'Private Outdoor Space',
                                    'High-Security Access',
                                    'Concierge Services'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-light rounded-xl">
                                        <div className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                                            <FiCheck className="text-sm" />
                                        </div>
                                        <span className="font-medium text-primary">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-primary text-white p-8 rounded-3xl shadow-2xl sticky top-32">
                            <h3 className="text-2xl font-bold mb-6">Investment Inquiry</h3>
                            <p className="text-gray-300 mb-8">
                                This property is part of our exclusive portfolio. For acquisition inquiries, please contact our investment team directly.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
                                    <p className="font-bold text-accent">{property.status}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Reference ID</p>
                                    <p className="font-bold">{id.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>

                            <button className="w-full btn-primary py-5 text-lg">
                                Request Brochure
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-6">
                                * No direct online transactions. All acquisitions are handled through our legal department.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
