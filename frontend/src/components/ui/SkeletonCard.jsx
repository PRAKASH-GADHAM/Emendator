import React from 'react';
export default function SkeletonCard({ lines = 3 }) {
    return (
        <div className="surface p-5 space-y-3">
            <div className="flex items-center justify-between">
                <div className="h-3 rounded shimmer" style={{ width: '32%' }} />
                <div className="h-5 w-14 rounded-full shimmer" />
            </div>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-2.5 rounded shimmer"
                    style={{ width: `${65 + (i * 7) % 30}%` }}
                />
            ))}
        </div>
    );
}
