'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin, FiMaximize, FiBox, FiDroplet, FiArrowLeft,
    FiCheckCircle, FiCalendar, FiTrendingUp, FiDollarSign,
    FiChevronLeft, FiChevronRight, FiDownload, FiShare2, FiX
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';

export default function PropertyDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { isAdmin } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
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
            <section className="relative h-[70vh] lg:h-[85vh] bg-primary overflow-hidden">
                <Swiper
                    modules={[Navigation, EffectFade, Autoplay, Thumbs]}
                    effect="fade"
                    speed={1500}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
                    className="w-full h-full"
                >
                    {property.images.map((img, i) => (
                        <SwiperSlide key={i} className="relative group/hero cursor-pointer" onClick={() => setFullscreenImage(i)}>
                            <Image
                                src={img}
                                alt={property.title}
                                fill
                                priority={i === 0}
                                className="object-cover transition-transform duration-[5s] group-hover:scale-110"
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 text-white font-bold flex items-center gap-2">
                                    <FiMaximize /> View Fullscreen
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation */}
                <button className="swiper-button-prev-custom absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all hidden lg:flex">
                    <FiChevronLeft size={24} />
                </button>
                <button className="swiper-button-next-custom absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all hidden lg:flex">
                    <FiChevronRight size={24} />
                </button>

                {/* Back Button */}
                <div className="absolute top-32 left-0 right-0 z-30">
                    <div className="container-custom">
                        <Link href="/properties">
                            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                                <FiArrowLeft /> Back to Inventory
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Desktop Thumbnails (Floating Side) */}
                <div className="absolute left-10 bottom-10 z-30 hidden lg:block w-full max-w-lg">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        modules={[Thumbs]}
                        spaceBetween={12}
                        slidesPerView={5}
                        watchSlidesProgress
                        className="thumbs-swiper !p-2"
                    >
                        {property.images.map((img, i) => (
                            <SwiperSlide key={i} className="cursor-pointer">
                                <div className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === i ? 'border-accent scale-105 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'}`}>
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Property Header Section (Below Gallery on Mobile) */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.25em] rounded-xl shadow-lg">
                                    <FiBox className="text-accent" />
                                    {property.type}
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] rounded-xl border-2 shadow-sm ${property.status === 'For Sale'
                                    ? 'bg-success/5 text-success border-success/20'
                                    : 'bg-red-500/5 text-red-600 border-red-500/20'
                                    }`}>
                                    <FiCheckCircle />
                                    {property.status}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary mb-10 leading-[1.05] tracking-tight">
                                {property.title}
                            </h1>

                            <div className="flex items-center gap-6 text-gray-400">
                                <div className="flex items-center gap-3 text-lg md:text-xl font-medium">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <FiMapPin />
                                    </div>
                                    <span className="text-gray-600">{property.location}</span>
                                </div>
                                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                                <div className="flex items-center gap-3 text-lg md:text-xl font-medium hidden md:flex">
                                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                        <FiMaximize />
                                    </div>
                                    <span className="text-gray-600">{property.size} sqm Total Area</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-auto min-w-[320px]">
                            <div className="bg-light p-8 rounded-[2rem] border border-gray-100">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Investment Value</p>
                                <div className="flex items-baseline justify-between lg:block">
                                    <p className="text-4xl lg:text-5xl font-serif font-bold text-primary lg:mb-6">
                                        {formatCurrency(property.sellingPrice)}
                                    </p>
                                    <a
                                        href={`https://wa.me/96171476572?text=${encodeURIComponent(`I'm interested in property ${property.title}, can I get more details?`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] border-none shadow-lg shadow-[#25D366]/20 !px-10"
                                    >
                                        <FaWhatsapp className="text-2xl" />
                                        Get More Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                    {(property.features || amenities).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-light group hover:bg-accent transition-all duration-500">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-accent group-hover:text-primary transition-colors">
                                                <FiCheckCircle />
                                            </div>
                                            <span className="font-bold text-gray-600 group-hover:text-white transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact & Details */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-32">
                                <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                    <h3 className="text-2xl font-serif font-bold mb-8">Interested in this <span className="text-accent">Property?</span></h3>

                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        Get exclusive details, floor plans, and a private viewing of this premium investment opportunity.
                                    </p>

                                    <div className="space-y-4">
                                        <a
                                            href={`https://wa.me/96171476572?text=${encodeURIComponent(`I'm interested in property ${property.title}, can I get more details?`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary w-full !py-5 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] border-none shadow-lg shadow-[#25D366]/20"
                                        >
                                            <FaWhatsapp className="text-2xl" />
                                            Get More Details
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-8 p-8 bg-white rounded-[2rem] shadow-luxury border border-gray-50 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-serif font-bold">
                                        MK
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Investment Advisor</p>
                                        <p className="text-lg font-bold text-primary">Mohamad Kaydouh</p>
                                        <a
                                            href={`https://wa.me/96171476572?text=${encodeURIComponent(`Hello, I'm interested in property ${property.title}. Can you help me?`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent text-sm font-bold hover:underline flex items-center gap-2"
                                        >
                                            <FaWhatsapp /> Contact Advisor
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
                {fullscreenImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <button
                            onClick={() => setFullscreenImage(null)}
                            className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-2xl transition-all z-10"
                        >
                            <FiX />
                        </button>

                        {/* Navigation Arrows */}
                        {property.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFullscreenImage((prev) => (prev > 0 ? prev - 1 : property.images.length - 1));
                                    }}
                                    className="absolute left-8 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-2xl transition-all z-10"
                                >
                                    <FiChevronLeft />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFullscreenImage((prev) => (prev < property.images.length - 1 ? prev + 1 : 0));
                                    }}
                                    className="absolute right-8 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-2xl transition-all z-10"
                                >
                                    <FiChevronRight />
                                </button>
                            </>
                        )}

                        <motion.img
                            key={fullscreenImage}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={property.images[fullscreenImage]}
                            alt={property.title}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm">
                            {fullscreenImage + 1} / {property.images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
