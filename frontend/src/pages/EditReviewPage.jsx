import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewApi } from '../api/review.api';
import { useReviewStore } from '../store/reviewStore';
import { getLanguageIcon, formatDate } from '../utils/helpers';

const CodeEditor = lazy(() => import('../components/CodeEditor'));

const EditorSkeleton = () => (
    <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500" />
    </div>
);

export default function EditReviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { submitReview, isAnalyzing } = useReviewStore();

    const [originalReview, setOriginalReview] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load review on mount
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await reviewApi.getFullReview(id);
                const review = data.data.review;
                setOriginalReview(review);
                setCode(review.code);
                setLanguage(review.language);
            } catch (err) {
                const msg = err.response?.data?.message || 'Failed to load review';
                setError(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleCodeChange = useCallback((val) => {
        setCode(val || '');
    }, []);

    const handleReview = async () => {
        if (!code.trim() || code.trim().length < 10) {
            toast.error('Code must be at least 10 characters.');
            return;
        }
        try {
            await submitReview({ code, language });
            toast.success('New review created from your edits!');
            navigate('/history');
        } catch {
            // Handled in store
        }
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-paper-100">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-clay-500 mb-4" />
                <p className="text-ink-500 text-[13px] font-mono">Loading review…</p>
            </div>
        );
    }

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-paper-100 px-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-brick-muted border border-brick/20">
                    <AlertCircle size={22} className="text-brick" />
                </div>
                <p className="text-ink-900 font-medium text-[15px] mb-1">Failed to load review</p>
                <p className="text-ink-500 text-[13px] mb-6">{error}</p>
                <button onClick={() => navigate('/history')} className="btn btn-ghost">
                    <ArrowLeft size={14} /> Back to history
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-paper-100 overflow-hidden">

            {/* ── Toolbar ──────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 h-14 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                <button
                    onClick={() => navigate('/history')}
                    className="flex items-center gap-2 text-ink-500 hover:text-ink-900 transition-colors text-[13px]"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="w-px h-5 bg-ink-100 mx-1" />

                <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-ink-400">Editing review from</span>
                    <span className="text-[11.5px] text-ink-700 font-mono">
                        {originalReview ? formatDate(originalReview.createdAt) : '—'}
                    </span>
                </div>

                <div className="flex items-center gap-2 ml-2 px-2.5 py-1 rounded-md text-[11.5px] font-mono surface">
                    <span className="text-ink-400">{getLanguageIcon(language)}</span>
                    <span className="text-ink-700 capitalize">{language}</span>
                </div>

                {/* Original score badge */}
                {originalReview && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] bg-clay-50 border border-clay-100">
                        <span className="text-ink-500">Original score:</span>
                        <span className="text-clay-700 font-semibold">{originalReview.score}</span>
                    </div>
                )}

                <div className="flex-1" />

                {/* Reset to original */}
                <button
                    onClick={() => { setCode(originalReview.code); toast.success('Reset to original code'); }}
                    className="btn btn-ghost !px-3 !py-1.5 !text-[11.5px]"
                >
                    <RefreshCw size={12} />
                    Reset
                </button>

                {/* Run review */}
                <button
                    onClick={handleReview}
                    disabled={isAnalyzing}
                    className="btn btn-clay !px-4 !py-2 !text-[13px]"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Analyzing…
                        </>
                    ) : (
                        <>
                            <Play size={14} fill="currentColor" />
                            Re-review
                        </>
                    )}
                </button>
            </div>

            {/* ── Editor ───────────────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Code editor */}
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="px-4 py-2 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                        <span className="text-[11.5px] text-ink-500 font-mono">Edit your code — then press Re-review to get a new analysis</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Suspense fallback={<EditorSkeleton />}>
                            <CodeEditor
                                value={code}
                                onChange={handleCodeChange}
                                language={language}
                                readOnly={isAnalyzing}
                                lineFixes={originalReview?.lineFixes || []}
                                showFixBadge={true}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* Right: original issues & suggestions */}
                {originalReview && (
                    <div className="w-80 flex-shrink-0 border-l border-ink-100 overflow-y-auto bg-white">
                        <div className="px-4 py-3 border-b border-ink-100 bg-paper-50">
                            <p className="text-[11px] text-ink-500 font-semibold uppercase tracking-[0.14em]">Original feedback</p>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Issues */}
                            {originalReview.issues?.length > 0 && (
                                <div>
                                    <p className="text-[11px] text-brick font-semibold uppercase tracking-[0.14em] mb-2">Issues</p>
                                    <div className="space-y-1.5">
                                        {originalReview.issues.map((issue, i) => (
                                            <div key={i} className="text-[11.5px] text-ink-700 flex gap-2 p-2 rounded-md bg-brick-muted border border-brick/15">
                                                <span className="text-brick flex-shrink-0">✕</span>
                                                {issue}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {originalReview.suggestions?.length > 0 && (
                                <div>
                                    <p className="text-[11px] text-sage font-semibold uppercase tracking-[0.14em] mb-2">Suggestions</p>
                                    <div className="space-y-1.5">
                                        {originalReview.suggestions.map((s, i) => (
                                            <div key={i} className="text-[11.5px] text-ink-700 flex gap-2 p-2 rounded-md bg-sage-muted border border-sage/15">
                                                <span className="text-sage flex-shrink-0">→</span>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
