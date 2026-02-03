'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Background() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#f8f9fa]">
            {/* Static Gradient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-navy/5 blur-[120px]" />

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
