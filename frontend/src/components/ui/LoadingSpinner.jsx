import React from 'react';
export default function LoadingSpinner({ size = 'md', text = '' }) {
    const px = { sm: 16, md: 22, lg: 32 }[size] || 22;
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <svg
                width={px} height={px} viewBox="0 0 24 24"
                className="animate-spin"
                style={{ animationDuration: '0.9s' }}
            >
                <circle cx="12" cy="12" r="9" fill="none"
                    stroke="#e5e0d8" strokeWidth="2.4" />
                <path d="M12 3 A9 9 0 0 1 21 12" fill="none"
                    stroke="#c96442" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            {text && <p className="text-[13px] text-ink-500 font-mono">{text}</p>}
        </div>
    );
}
