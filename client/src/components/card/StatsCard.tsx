import type { FC } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface StatsCardProps {
    title: string;
    value: number;
    subtitle: string;
    description: string;
    data: any[];
    dataKey: string;
    color: string;
    percentage?: number;
}

// SVG Arc Gauge
const ArcGauge: FC<{ percentage: number; color: string; size?: number }> = ({ percentage, color, size = 64 }) => {
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius;
    const dashLength = (percentage / 100) * circumference;
    const center = size / 2;
    const id = color.replace(/[^a-zA-Z0-9]/g, '');

    return (
        <div className="relative" style={{ width: size, height: size / 2 + 8 }}>
            <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
                <defs>
                    <linearGradient id={`arc-g-${id}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={1} />
                    </linearGradient>
                    <filter id={`arc-gl-${id}`}>
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <path d={`M ${strokeWidth / 2 + 1} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 1} ${center}`}
                    fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
                    className="stroke-light-border dark:stroke-dark-border" opacity={0.5} />
                <path d={`M ${strokeWidth / 2 + 1} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 1} ${center}`}
                    fill="none" stroke={`url(#arc-g-${id})`} strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={`${dashLength} ${circumference}`} filter={`url(#arc-gl-${id})`}
                    className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-end justify-center pb-0">
                <span className="text-sm font-bold" style={{ color }}>{percentage}%</span>
            </div>
        </div>
    );
};

const StatsCard: FC<StatsCardProps> = ({ title, value, subtitle, description, color, percentage = 68 }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`
            group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1
            bg-light-surface dark:bg-dark-bg border border-light-border dark:border-dark-border
            shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]
        `}>
            {/* Hover glow */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${color}20, transparent 70%)` }} />

            {/* Top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

            <div className="flex items-start justify-between mb-5">
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-light-text-secondary dark:text-dark-text-secondary">
                    {title}
                </h3>
                <ArcGauge percentage={percentage} color={color} size={60} />
            </div>

            <div className="relative z-10">
                <div className="text-[2.5rem] font-extrabold leading-none mb-3 tracking-tight text-light-text dark:text-dark-text">
                    {value.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: `${color}15`, color }}>
                        <i className="ri-arrow-up-s-fill text-sm"></i>
                        {subtitle.replace('↑ ', '')}
                    </span>
                </div>
                <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary opacity-70">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
