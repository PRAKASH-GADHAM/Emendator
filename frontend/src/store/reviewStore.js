import { create } from 'zustand';
import { reviewApi } from '../api/review.api';
import { historyApi } from '../api/history.api';
import toast from 'react-hot-toast';

/**
 * Progress steps shown to the user during multi-model analysis.
 * The frontend advances through these via a timer simulation
 * (the backend processes asynchronously without SSE streaming).
 */
export const REVIEW_PROGRESS_STEPS = [
    { id: 'analyzing',  label: 'Analyzing…',             description: 'Parsing code structure and semantics' },
    { id: 'consulting', label: 'Consulting AI Models…',   description: 'Running 3 models in parallel' },
    { id: 'consensus',  label: 'Building Consensus…',    description: 'Merging and deduplicating findings' },
    { id: 'diff',       label: 'Generating Diff…',       description: 'Computing improved code diff' },
    { id: 'done',       label: 'Preparing Final Review…', description: 'Scoring confidence and finalising' },
];

export const useReviewStore = create((set, get) => ({
    currentReview: null,
    history: [],
    pagination: null,
    isAnalyzing: false,
    isLoadingHistory: false,
    reviewProgress: null,       // null | 'analyzing' | 'consulting' | 'consensus' | 'diff' | 'done'
    progressStepIndex: 0,
    _progressTimer: null,

    // ── Helpers ─────────────────────────────────────────────────────────────

    _startProgressSimulation: () => {
        // Advance through steps at realistic intervals to give user feedback
        const intervals = [800, 3000, 5000, 3000]; // ms between steps
        let stepIndex = 0;

        const advance = () => {
            stepIndex++;
            if (stepIndex < REVIEW_PROGRESS_STEPS.length) {
                set({ progressStepIndex: stepIndex, reviewProgress: REVIEW_PROGRESS_STEPS[stepIndex].id });
                const timer = setTimeout(advance, intervals[stepIndex - 1] || 4000);
                set({ _progressTimer: timer });
            }
        };

        set({ progressStepIndex: 0, reviewProgress: REVIEW_PROGRESS_STEPS[0].id });
        const timer = setTimeout(advance, intervals[0]);
        set({ _progressTimer: timer });
    },

    _stopProgressSimulation: () => {
        const { _progressTimer } = get();
        if (_progressTimer) {
            clearTimeout(_progressTimer);
            set({ _progressTimer: null });
        }
        set({ reviewProgress: null, progressStepIndex: 0 });
    },

    // ── Actions ─────────────────────────────────────────────────────────────

    submitReview: async ({ code, language }) => {
        // Stop any existing progress simulation
        get()._stopProgressSimulation();
        set({ isAnalyzing: true, currentReview: null });
        get()._startProgressSimulation();

        try {
            const data = await reviewApi.createReview({ code, language });
            const review = data.data.review;

            get()._stopProgressSimulation();

            set((state) => {
                const updatedHistory = [review, ...state.history];
                if (updatedHistory.length > 10) updatedHistory.pop();

                const currentTotal = state.pagination?.total ?? 0;
                const newTotal = currentTotal + 1;
                const limit = state.pagination?.limit ?? 10;

                return {
                    currentReview: review,
                    isAnalyzing: false,
                    history: updatedHistory,
                    pagination: state.pagination
                        ? { ...state.pagination, total: newTotal, totalPages: Math.ceil(newTotal / limit) }
                        : { page: 1, limit: 10, total: 1, totalPages: 1, hasMore: false },
                };
            });

            toast.success('Code review complete!');
            return review;
        } catch (error) {
            get()._stopProgressSimulation();
            set({ isAnalyzing: false });
            const message = error.response?.data?.message || 'Failed to analyze code';
            toast.error(message);
            throw error;
        }
    },

    fetchHistory: async ({ page = 1, limit = 10 } = {}) => {
        set({ isLoadingHistory: true });
        try {
            const data = await historyApi.getHistory({ page, limit });
            set({
                history: data.data.reviews,
                pagination: data.data.pagination,
                isLoadingHistory: false,
            });
        } catch (error) {
            set({ isLoadingHistory: false });
            const message = error.response?.data?.message || 'Failed to load history';
            toast.error(message);
        }
    },

    deleteReview: async (id) => {
        try {
            await historyApi.deleteReview(id);
            set((state) => ({ history: state.history.filter((r) => r.id !== id) }));
            toast.success('Review deleted');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete review';
            toast.error(message);
        }
    },

    clearCurrentReview: () => set({ currentReview: null }),
}));