'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle, FiShield } from 'react-icons/fi';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/adminofthepage');
        } catch (err) {
            setError('Invalid credentials or unauthorized access.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-primary pt-32 pb-20">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-custom relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="flex items-center space-x-3 group mb-8 justify-center">
                        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-serif text-3xl font-bold group-hover:rotate-12 transition-transform duration-500">
                            L
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white tracking-tight">
                            Lebanon <span className="text-accent">Buyers</span>
                        </h1>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Investor Portal</h2>
                    <p className="text-gray-400">Secure access for authorized investment partners.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-dark p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-8 p-4 bg-error/10 border border-error/20 text-error rounded-2xl flex items-center gap-3 text-sm"
                            >
                                <FiAlertCircle />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                                        placeholder="investor@lebanonbuyers.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full !py-5 !text-lg mt-4 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>Secure Login <FiArrowRight /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <Link href="/" className="btn-secondary w-full !bg-white/5 !border-white/20 !text-white hover:!bg-white/10">
                                View Homepage
                            </Link>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
                                <FiShield className="text-accent" />
                                <span>End-to-End Encrypted Session</span>
                            </div>
                            <p className="text-gray-500 text-xs">
                                By logging in, you agree to our <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>

                    <Link href="/" className="mt-8 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <FiArrowRight className="rotate-180" /> Back to Public Site
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
