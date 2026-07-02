import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import ScoreRing from './ScoreRing';
import { formatDate, getLanguageIcon } from '../utils/helpers';

export default function ReviewResult({ review }) {
    if (!review) return null;

    return (
        <div className="space-y-5 animate-rise">
            <div className="surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                    <h2 className="font-serif text-[22px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Review complete
                    </h2>
                    <div className="mt-1 flex items-center text-[12.5px] text-ink-500">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-700 mr-2">
                            {getLanguageIcon(review.language)}
                        </span>
                        <span className="capitalize">{review.language}</span>
                        <span className="divider-dot" />
                        <span>{formatDate(review.createdAt)}</span>
                    </div>
                </div>
                <ScoreRing score={review.score} size={96} strokeWidth={5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="surface p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-brick" strokeWidth={1.8} />
                        <h3 className="text-[13px] font-medium text-ink-800">Issues</h3>
                        <span className="ml-auto chip bg-brick-muted text-brick">
                            {review.issues?.length || 0}
                        </span>
                    </div>
                    {review.issues?.length === 0 ? (
                        <div className="flex items-center gap-2 text-sage text-[13px]">
                            <CheckCircle2 size={14} /> None found
                        </div>
                    ) : (
                        <ul className="space-y-2.5">
                            {review.issues.map((issue, i) => (
                                <li key={i} className="flex gap-3 text-[13.5px] text-ink-700 leading-relaxed">
                                    <span className="mt-1 font-mono text-[11px] text-brick shrink-0 w-4">{i + 1}.</span>
                                    <span>{issue}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="surface p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={14} className="text-clay-500" strokeWidth={1.8} />
                        <h3 className="text-[13px] font-medium text-ink-800">Suggestions</h3>
                        <span className="ml-auto chip bg-clay-50 text-clay-700 border border-clay-100">
                            {review.suggestions?.length || 0}
                        </span>
                    </div>
                    {review.suggestions?.length === 0 ? (
                        <div className="flex items-center gap-2 text-sage text-[13px]">
                            <CheckCircle2 size={14} /> Nothing to add
                        </div>
                    ) : (
                        <ul className="space-y-2.5">
                            {review.suggestions.map((s, i) => (
                                <li key={i} className="flex gap-3 text-[13.5px] text-ink-700 leading-relaxed">
                                    <span className="mt-1 font-mono text-[11px] text-clay-600 shrink-0 w-4">{i + 1}.</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="surface overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100 bg-paper-100">
                    <span className="font-mono text-[11px] text-ink-500">
                        reviewed.{review.language}
                    </span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12.5px] font-mono text-ink-800 leading-[1.7] max-h-72">
                    <code>{review.code}</code>
                </pre>
            </div>
        </div>
    );
}
