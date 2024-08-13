import { cn } from '@/lib/utils';
import React from 'react';

const sizeMap = {
    sm: 50,
    md: 80,
    lg: 100,
    xl: 150,
};

const CircularProgressBar = ({
    size = 80,
    progress = 50,
    color = 'primary-foreground',
    textColor = 'text-primary-foreground',
}) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const textSize = size / 5 - 4;

    return (
        <div
            className="relative inline-flex items-center justify-center overflow-hidden rounded-full"
            style={{ width: size, height: size }}
        >
            <svg className="w-full h-full">
                <circle
                    className="text-gray-300"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`text-${color}`}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className={cn('absolute', 'text-sm', textColor)}>{progress}%</span>
        </div>
    );
};

export default CircularProgressBar;
