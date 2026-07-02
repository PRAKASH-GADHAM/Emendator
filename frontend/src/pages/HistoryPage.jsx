import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReviewStore } from '../store/reviewStore';
import HistoryCard from '../components/HistoryCard';
import SkeletonCard from '../components/ui/SkeletonCard';

export default function HistoryPage() {
    const navigate = useNavigate();
    const { history, pagination, isLoadingHistory, fetchHistory, deleteReview } = useReviewStore();

    useEffect(() => { fetchHistory({ page: 1, limit: 10 }); }, [fetchHistory]);

    const handlePageChange = (newPage) => {
        fetchHistory({ page: newPage, limit: 10 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-paper-100 py-10 px-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="prompt-line mb-1">everything reviewed</p>
                        <h1 className="font-serif text-[30px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                            History
                        </h1>
                        {pagination && (
                            <p className="text-[12.5px] text-ink-500 mt-0.5">
                                {pagination.total} review{pagination.total !== 1 ? 's' : ''} total
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/review')}
                        data-testid="history-new-review-btn"
                        className="btn btn-primary"
                    >
                        <Plus size={13} /> New review
                    </button>
                </div>

                {isLoadingHistory && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {!isLoadingHistory && history.length === 0 && (
                    <div className="surface p-16 text-center">
                        <p className="prompt-line inline-block mb-3">no history yet<span className="cursor" /></p>
                        <h3 className="font-serif text-[20px] text-ink-900 mb-1">Nothing here — yet.</h3>
                        <p className="text-ink-500 text-[13px] mb-6">Your reviews will appear here as you create them.</p>
                        <button onClick={() => navigate('/review')} className="btn btn-clay">
                            Start reviewing
                        </button>
                    </div>
                )}

                {!isLoadingHistory && history.length > 0 && (
                    <>
                        <div className="space-y-3">
                            {history.map((review) => (
                                <HistoryCard key={review.id} review={review} onDelete={deleteReview} />
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="btn btn-ghost !py-1.5 !text-[12.5px] disabled:opacity-30"
                                >
                                    <ChevronLeft size={13} /> Prev
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        const isCurrent = p === pagination.page;
                                        if (p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => handlePageChange(p)}
                                                    className="w-8 h-8 rounded-md text-[12.5px] transition-colors"
                                                    style={{
                                                        background: isCurrent ? '#1a1815' : 'transparent',
                                                        color: isCurrent ? '#faf9f7' : '#5a5450',
                                                    }}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        }
                                        if (Math.abs(p - pagination.page) === 2) {
                                            return <span key={p} className="text-ink-400 text-[12px]">…</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={!pagination.hasMore}
                                    className="btn btn-ghost !py-1.5 !text-[12.5px] disabled:opacity-30"
                                >
                                    Next <ChevronRight size={13} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
