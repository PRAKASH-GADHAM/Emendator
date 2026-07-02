import React from 'react';

export default function StatsCard({ icon: Icon, label, value, color = '#c96442', trend }) {
    return (
        <div className="surface surface-hover p-5">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-ink-500 font-medium uppercase tracking-[0.12em]">{label}</span>
                    <span className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        {value}
                    </span>
                    {trend && (
                        <span className="text-[11.5px]" style={{ color }}>
                            {trend}
                        </span>
                    )}
                </div>
                <div
                    className="p-2.5 rounded-lg"
                    style={{
                        background: `${color}14`,
                        border: `1px solid ${color}2a`,
                    }}
                >
                    <Icon size={17} style={{ color }} strokeWidth={1.8} />
                </div>
            </div>
            <div
                className="mt-4 h-[3px] rounded-full"
                style={{
                    background: `linear-gradient(90deg, ${color}45, transparent)`,
                }}
            />
        </div>
    );
}
