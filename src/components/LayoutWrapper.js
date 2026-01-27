'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Background from "@/components/Background";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    // Hide Navbar and Footer on admin routes and login page
    const isAdminRoute = pathname?.startsWith('/adminofthepage');
    const isLoginPage = pathname === '/login';

    const hideLayout = isAdminRoute || isLoginPage;

    return (
        <div className="flex flex-col min-h-screen relative">
            <Background />
            {!hideLayout && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!hideLayout && <Footer />}
        </div>
    );
}
