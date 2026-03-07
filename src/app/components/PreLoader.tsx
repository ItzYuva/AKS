'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

export default function PreLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Trigger the loader every time the user navigates to a new page
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // slightly shorter wait for inner-page navigations to feel snappier

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#020B18]"
                >
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute w-24 h-24 rounded-full bg-[#007AFF]/20 blur-xl"
                        />

                        <svg width="64" height="64" viewBox="0 0 100 100" className="relative z-10">
                            <motion.path
                                d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
                                fill="transparent"
                                stroke="#007AFF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatType: "loop",
                                }}
                            />
                            <motion.text
                                x="50"
                                y="58"
                                textAnchor="middle"
                                className="fill-gray-900 dark:fill-white font-bold"
                                style={{ fontSize: '24px' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                A
                            </motion.text>
                        </svg>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
