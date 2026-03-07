'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCodeBranch, FaCalendarAlt, FaFire, FaStar } from 'react-icons/fa';
import { fadeInUp } from '@/utils/animations';

interface DayActivity {
    date: string;
    count: number;
}

interface GitHubData {
    streak: number;
    totalContributions: number;
    bestDay: number;
    last30Days: DayActivity[];
    error?: string;
}

const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-700/50';
    if (count <= 2) return 'bg-blue-900';
    if (count <= 5) return 'bg-blue-700';
    if (count <= 9) return 'bg-blue-500';
    return 'bg-[#007AFF]'; // Using primary hex directly instead of Tailwind dynamic just in case, wait user said "bg-blue-400 (my primary is #007AFF)"
    // So I'll just apply primary literal if possible. The user specifically asked for string mapping.
};

const getIntensityClassMatch = (count: number) => {
    if (count === 0) return 'bg-gray-700/50 dark:bg-gray-700/50 bg-gray-200';
    if (count <= 2) return 'bg-blue-900 dark:bg-blue-900 bg-blue-200';
    if (count <= 5) return 'bg-blue-700 dark:bg-blue-700 bg-blue-300';
    if (count <= 9) return 'bg-blue-500 dark:bg-blue-500 bg-blue-400';
    return 'bg-[#007AFF]';
};

export default function GitHubActivity() {
    const [data, setData] = useState<GitHubData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const response = await fetch('/api/github', { cache: 'no-store' });
                const result = await response.json();
                if (result.error) {
                    console.error('GitHub API error:', result.error);
                }
                setData(result);
            } catch (error) {
                console.error('Failed to fetch GitHub data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, []);

    const skeletonCards = [1, 2, 3].map((i) => (
        <div
            key={`skeleton-card-${i}`}
            className="dark:bg-gray-800/60 bg-gray-100/70 rounded-xl p-4 border dark:border-gray-700 border-gray-200 animate-pulse"
        >
            <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="w-24 h-4 rounded bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="w-16 h-7 rounded bg-gray-300 dark:bg-gray-600" />
        </div>
    ));

    const skeletonSquares = Array.from({ length: 30 }).map((_, i) => (
        <div
            key={`skeleton-square-${i}`}
            className="w-5 h-5 rounded-[2px] bg-gray-300 dark:bg-gray-600 animate-pulse"
        />
    ));

    if (loading || (!data && !loading)) {
        return (
            <section className="py-20 bg-transparent">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="flex flex-col gap-6"
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
                                <span className="font-bold">GitHub</span>{' '}
                                <span className="text-[#007AFF]">Activity</span>
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-lg">
                                <FaCodeBranch className="text-[#007AFF]" />
                                <span className="dark:text-gray-300 text-gray-700 font-medium">Contribution Activity</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {skeletonCards}
                        </div>

                        <div className="mt-6">
                            <p className="dark:text-gray-400 text-gray-600 mb-4 font-medium text-base flex items-center justify-center">Last 30 Days</p>
                            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                                {skeletonSquares}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (data?.error) {
        return (
            <section className="py-20 bg-transparent">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="text-center p-8 dark:bg-gray-800/60 bg-gray-100/70 rounded-xl border border-red-500/50 max-w-2xl mx-auto"
                    >
                        <h3 className="text-red-500 text-xl font-bold mb-2">GitHub Integration Notice</h3>
                        <p className="dark:text-gray-300 text-gray-700">{data.error}</p>
                        <p className="dark:text-gray-400 text-gray-500 text-sm mt-4">
                            Please ensure you have added a valid <strong>GITHUB_TOKEN</strong> to your <strong>.env.local</strong> file.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 sm:py-20 bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="flex flex-col gap-6"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
                            <span className="font-bold dark:text-white text-gray-900">GitHub</span>{' '}
                            <span className="text-[#007AFF]">Activity</span>
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-lg">
                            <FaCodeBranch className="text-[#007AFF]" />
                            <span className="dark:text-gray-300 text-gray-700 font-medium">Contribution Activity</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="dark:bg-[#1F2937]/60 bg-gray-100/70 rounded-xl p-4 border dark:border-gray-700 border-gray-200 flex flex-col items-start shadow-sm transition-transform hover:-translate-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FaCalendarAlt className="text-[#007AFF] text-lg" />
                                <span className="dark:text-gray-400 text-gray-600 font-medium text-sm">Current Streak</span>
                            </div>
                            <span className="text-[#007AFF] font-bold text-xl">{data?.streak || 0} days</span>
                        </div>

                        <div className="dark:bg-[#1F2937]/60 bg-gray-100/70 rounded-xl p-4 border dark:border-gray-700 border-gray-200 flex flex-col items-start shadow-sm transition-transform hover:-translate-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FaFire className="text-[#007AFF] text-lg" />
                                <span className="dark:text-gray-400 text-gray-600 font-medium text-sm">Total Contributions</span>
                            </div>
                            <span className="font-bold text-xl dark:text-white text-gray-900">{data?.totalContributions || 0}</span>
                        </div>

                        <div className="dark:bg-[#1F2937]/60 bg-gray-100/70 rounded-xl p-4 border dark:border-gray-700 border-gray-200 flex flex-col items-start shadow-sm transition-transform hover:-translate-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <FaStar className="text-[#007AFF] text-lg" />
                                <span className="dark:text-gray-400 text-gray-600 font-medium text-sm">Best Day</span>
                            </div>
                            <span className="font-bold text-xl dark:text-white text-gray-900">{data?.bestDay || 0} commits</span>
                        </div>
                    </div>

                    <div className="mt-6 dark:bg-[#1F2937]/40 bg-gray-50/70 rounded-2xl p-5 border dark:border-gray-800 border-gray-200">
                        <h3 className="dark:text-gray-300 text-gray-700 mb-4 font-semibold text-center text-base">Last 30 Days</h3>
                        <div className="flex flex-wrap justify-center gap-2 mx-auto max-w-4xl">
                            {data?.last30Days.map((day, idx) => {
                                // Add T12:00:00Z to ensure date parsing never shifts the day incorrectly based on timezone
                                const dateObj = new Date(day.date + 'T12:00:00Z');
                                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                const isZero = day.count === 0;
                                let bgClass = '';

                                if (isZero) bgClass = 'bg-gray-700/50';
                                else if (day.count <= 2) bgClass = 'bg-blue-900';
                                else if (day.count <= 5) bgClass = 'bg-blue-700';
                                else if (day.count <= 9) bgClass = 'bg-blue-500';
                                else bgClass = 'bg-blue-400';

                                return (
                                    <div
                                        key={`day-${day.date}-${idx}`}
                                        className={`w-5 h-5 rounded-[2px] ${bgClass} transition-colors duration-200 group relative cursor-pointer hover:ring-1 hover:ring-offset-1 hover:ring-[#007AFF] dark:hover:ring-offset-gray-900`}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded shadow-lg z-10">
                                            {day.count} contributions on {formattedDate}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-900 dark:border-t-white"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-4 rounded-[2px] bg-gray-700/50"></div>
                                <div className="w-4 h-4 rounded-[2px] bg-blue-900"></div>
                                <div className="w-4 h-4 rounded-[2px] bg-blue-700"></div>
                                <div className="w-4 h-4 rounded-[2px] bg-blue-500"></div>
                                <div className="w-4 h-4 rounded-[2px] bg-blue-400"></div>
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
