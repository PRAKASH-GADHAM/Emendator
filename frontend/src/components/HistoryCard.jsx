import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Copy, Check, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { getScoreColor, formatDate, truncateCode, getLanguageIcon } from '../utils/helpers';
import ScoreRing from './ScoreRing';

export default function HistoryCard({ review, onDelete }) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const scoreColor = getScoreColor(review.score);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this review? This cannot be undone.')) return;
        setIsDeleting(true);
        try { await onDelete(review.id); } catch { setIsDeleting(false); }
    };

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(review.code);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = review.code; document.body.appendChild(ta);
            ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleEdit = (e) => { e.stopPropagation(); navigate(`/review/${review.id}/edit`); };

    return (
        <div
            className="surface surface-hover overflow-hidden cursor-pointer"
            onClick={() => setIsExpanded(v => !v)}
            data-testid={`history-card-${review.id}`}
        >
            <div className="p-5 flex items-start gap-4">
                <ScoreRing score={review.score} size={54} strokeWidth={4} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-700">
                            {getLanguageIcon(review.language)}
                        </span>
                        <span className="text-[13px] text-ink-800 capitalize">{review.language}</span>
                        <span className="chip" style={{ background: scoreColor.muted, color: scoreColor.hex }}>
                            {scoreColor.label}
                        </span>
                    </div>
                    <p className="text-[12.5px] text-ink-500 font-mono mb-2 truncate">
                        {truncateCode(review.code, 90)}
                    </p>
                    <div className="flex items-center text-[11.5px] text-ink-400">
                        <span>{formatDate(review.createdAt)}</span>
                        <span className="divider-dot" />
                        <span>{review.issues?.length || 0} issues</span>
                        <span className="divider-dot" />
                        <span>{review.suggestions?.length || 0} suggestions</span>
                    </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={handleCopy} title="Copy code" className="btn-plain">
                        {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
                    </button>
                    <button onClick={handleEdit} title="Edit & re-review" className="btn-plain">
                        <Pencil size={14} />
                    </button>
                    <button onClick={handleDelete} disabled={isDeleting}
                        title="Delete" className="btn-plain hover:!text-brick">
                        <Trash2 size={14} className={isDeleting ? 'text-brick animate-pulse' : ''} />
                    </button>
                    <button onClick={() => setIsExpanded(v => !v)} className="btn-plain">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-ink-100 animate-fade-in">
                    <div className="p-4 border-b border-ink-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400">Code</span>
                            <button onClick={handleCopy} className="btn btn-ghost !py-1 !px-2 !text-[11px]">
                                {copied ? <><Check size={11} className="text-sage" /> Copied</> : <><Copy size={11} /> Copy</>}
                            </button>
                        </div>
                        <pre className="text-[12px] font-mono text-ink-800 overflow-x-auto p-3 rounded-md max-h-40 bg-paper-100 border border-ink-100">
                            {review.code}
                        </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-ink-100">
                        <div className="p-4">
                            <h4 className="text-[11px] uppercase tracking-[0.14em] text-brick font-medium mb-2">
                                Issues ({review.issues?.length || 0})
                            </h4>
                            {review.issues?.length > 0 ? (
                                <ul className="space-y-1.5">
                                    {review.issues.map((issue, i) => (
                                        <li key={i} className="flex gap-2 text-[12.5px] text-ink-700">
                                            <span className="font-mono text-[11px] text-brick shrink-0">{i + 1}.</span>
                                            <span>{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-[12px] text-ink-400">No issues found</p>}
                        </div>
                        <div className="p-4 border-t md:border-t-0 border-ink-100">
                            <h4 className="text-[11px] uppercase tracking-[0.14em] text-clay-600 font-medium mb-2">
                                Suggestions ({review.suggestions?.length || 0})
                            </h4>
                            {review.suggestions?.length > 0 ? (
                                <ul className="space-y-1.5">
                                    {review.suggestions.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-[12.5px] text-ink-700">
                                            <span className="font-mono text-[11px] text-clay-600 shrink-0">{i + 1}.</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-[12px] text-ink-400">No suggestions</p>}
                        </div>
                    </div>

                    <div className="px-4 py-3 border-t border-ink-100 flex justify-end">
                        <button onClick={handleEdit} className="btn btn-ghost !py-1.5 !text-[12px]">
                            <Pencil size={11} /> Edit &amp; re-review
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
