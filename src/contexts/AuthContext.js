'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // Check if user is admin based on email
                const adminEmails = [
                    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
                    'info@lebanonbuyers.com',
                    'moumenhamdan5@gmail.com'
                ];
                setIsAdmin(adminEmails.includes(user.email));
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Check if the logged-in user is admin
            const adminEmails = [
                process.env.NEXT_PUBLIC_ADMIN_EMAIL,
                'info@lebanonbuyers.com',
                'moumenhamdan5@gmail.com'
            ];
            if (!adminEmails.includes(result.user.email)) {
                // If not admin, sign them out
                await signOut(auth);
                return {
                    success: false,
                    error: 'Only admin can access this platform.',
                };
            }

            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        login,
        loginWithGoogle,
        logout,
        loading,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
