'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all feedback and filter/sort on client to avoid composite index requirement
        const q = query(collection(db, 'feedback'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const feedbackList = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(item => item.approved === true)
                .sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0;
                    const timeB = b.createdAt?.seconds || 0;
                    return timeB - timeA;
                });

            // If no feedback in DB, use default ones
            if (feedbackList.length === 0) {
                setTestimonials([
                    {
                        name: "Robert Anderson",
                        role: "International Investor",
                        content: "Buyers-lb transformed my investment strategy in Lebanon. Their attention to detail and market insight is unparalleled.",
                        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
                        rating: 5
                    },
                    {
                        name: "Sarah Al-Fayed",
                        role: "Luxury Homeowner",
                        content: "Finding a home that matches your lifestyle is rare. Buyers-lb didn't just find me a house; they found me a masterpiece.",
                        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
                        rating: 5
                    }
                ]);
            } else {
                setTestimonials(feedbackList);
            }
            setLoading(false);
        }, (error) => {
            console.error("Testimonials error:", error);
            // Fallback to default testimonials if index is missing or other error occurs
            setTestimonials([
                {
                    name: "Robert Anderson",
                    role: "International Investor",
                    content: "Buyers-lb transformed my investment strategy in Lebanon. Their attention to detail and market insight is unparalleled.",
                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
                    rating: 5
                },
                {
                    name: "Sarah Al-Fayed",
                    role: "Luxury Homeowner",
                    content: "Finding a home that matches your lifestyle is rare. Buyers-lb didn't just find me a house; they found me a masterpiece.",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
                    rating: 5
                }
            ]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return null;

    return (
        <section className="section-padding bg-navy relative overflow-hidden">
            {/* Interactive Background Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,97,0.05),transparent_70%)]"
                />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0]
                            }}
                            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute"
                            style={{
                                top: `${20 * i}%`,
                                left: `${15 * i}%`,
                                fontSize: '10rem'
                            }}
                        >
                            <Quote />
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-4 block"
                    >
                        Testimonials
                    </motion.span>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white">What Our <span className="text-accent italic">Elite</span> Clients Say</h2>
                </div>

                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    className="pb-16"
                >
                    {testimonials.map((t, i) => (
                        <SwiperSlide key={t.id || i}>
                            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-luxury border border-white/10 h-full flex flex-col group hover:bg-white/10 transition-all duration-500">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(t.rating || 5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-accent text-accent" />
                                    ))}
                                </div>
                                <Quote className="text-accent/20 mb-6 group-hover:text-accent/40 transition-colors" size={48} />
                                <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow italic">
                                    &quot;{t.content}&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl overflow-hidden border border-accent/20">
                                        {t.image ? (
                                            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            t.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{t.name}</h4>
                                        <p className="text-sm text-gray-400 uppercase tracking-widest">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};



export default Testimonials;