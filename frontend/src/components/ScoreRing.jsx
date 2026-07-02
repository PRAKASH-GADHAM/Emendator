import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../utils/helpers';
export default function ScoreRing({ score = 0, size = 120, strokeWidth = 6 }) {
    const [displayScore, setDisplayScore] = useState(0);
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;
    const { hex, label } = getScoreColor(score);
    useEffect(() => {
        const duration = 900;
        const start = Date.now();
        const tick = () => {
            const p = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplayScore(Math.round(eased * score));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [score]);
    return (
        <div className="flex flex-col items-center gap-1.5" data-testid="score-ring">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="#ede8dd" strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke={hex} strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-[26px] font-medium text-ink-900" style={{ letterSpacing: '-0.03em' }}>
                        {displayScore}
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono -mt-0.5">/ 100</span>
                </div>
            </div>
            <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: hex }}>
                {label}
            </span>
        </div>
    );
}
