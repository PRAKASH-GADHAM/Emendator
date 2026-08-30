import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Code2, Tag, Loader2, Inbox } from 'lucide-react';
import { useLeetCodeStore } from '../store/leetcodeStore';
import ProblemList from '../components/ProblemList';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const TOPICS = [
    'All Topics', 'Array', 'String', 'Hash Table', 'Dynamic Programming',
    'Math', 'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search',
    'Tree', 'Breadth-First Search', 'Two Pointers', 'Bit Manipulation',
    'Stack', 'Heap', 'Graph', 'Sliding Window', 'Linked List', 'Recursion',
];

export default function LeetCodeBrowserPage() {
    const navigate = useNavigate();
    const { problems, pagination, isSearching, fetchProblems } = useLeetCodeStore();

    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('All');
    const [topic, setTopic] = useState('All Topics');
    const [page, setPage] = useState(1);

    const loadProblems = useCallback(() => {
        fetchProblems({
            page,
            limit: 20,
            search: search.trim(),
            difficulty: difficulty === 'All' ? '' : difficulty,
            topic: topic === 'All Topics' ? '' : topic,
        });
    }, [page, search, difficulty, topic, fetchProblems]);

    useEffect(() => {
        loadProblems();
    }, [loadProblems]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDifficultyChange = (d) => {
        setDifficulty(d);
        setPage(1);
    };

    const handleTopicChange = (t) => {
        setTopic(t);
        setPage(1);
    };

    const totalPages = pagination?.totalPages || 1;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 animate-fade-in">

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-ink-900">
                        <Code2 size={18} className="text-paper-50" />
                    </div>
                    <h1 className="font-serif text-[22px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        LeetCode Practice
                    </h1>
                </div>
                <p className="text-ink-500 text-[13.5px] ml-12">
                    Browse problems, code solutions, and get AI-powered reviews
                </p>
            </div>

            {/* Search + Filters */}
            <div className="surface p-4 mb-6 space-y-3">
                {/* Search bar */}
                <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by number or title..."
                        className="input pl-10"
                    />
                </div>

                {/* Filters row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Difficulty chips */}
                    <div className="flex items-center gap-1.5">
                        {DIFFICULTIES.map((d) => {
                            const isActive = difficulty === d;
                            const colorMap = {
                                All: isActive ? 'bg-ink-900 text-paper-50 border-ink-900' : 'bg-transparent text-ink-600 border-ink-200 hover:border-ink-300',
                                Easy: isActive ? 'bg-sage text-white border-sage' : 'bg-transparent text-sage border-sage/30 hover:border-sage/60',
                                Medium: isActive ? 'bg-ochre text-white border-ochre' : 'bg-transparent text-ochre border-ochre/30 hover:border-ochre/60',
                                Hard: isActive ? 'bg-brick text-white border-brick' : 'bg-transparent text-brick border-brick/30 hover:border-brick/60',
                            };
                            return (
                                <button
                                    key={d}
                                    onClick={() => handleDifficultyChange(d)}
                                    className={`chip border transition-all ${colorMap[d]}`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-4 w-px bg-ink-200 hidden sm:block" />

                    {/* Topic dropdown */}
                    <div className="relative flex items-center gap-2">
                        <Tag size={13} className="text-ink-400" />
                        <select
                            value={topic}
                            onChange={(e) => handleTopicChange(e.target.value)}
                            className="input !w-auto !py-1.5 !px-3 text-[13px] cursor-pointer bg-white"
                        >
                            {TOPICS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Problem List */}
            <div className="surface overflow-hidden">
                {isSearching && problems.length === 0 ? (
                    <div className="divide-y divide-ink-100">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                                <div className="w-8 h-4 shimmer rounded" />
                                <div className="flex-1 h-4 shimmer rounded max-w-xs" />
                                <div className="w-16 h-5 shimmer rounded-full" />
                                <div className="w-24 h-4 shimmer rounded" />
                            </div>
                        ))}
                    </div>
                ) : problems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-paper-200">
                            <Inbox size={22} className="text-ink-400" />
                        </div>
                        <p className="text-ink-700 font-medium text-[13.5px] mb-1">No problems found</p>
                        <p className="text-ink-400 text-[12.5px]">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <ProblemList
                        problems={problems}
                        onProblemClick={(id) => navigate(`/leetcode/${id}`)}
                    />
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-1">
                    <p className="text-[12px] text-ink-400">
                        Page {pagination.page} of {pagination.totalPages}
                        <span className="ml-1.5 text-ink-300">({pagination.total} problems)</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="btn btn-ghost !px-2.5 !py-1.5 !text-[12px] disabled:opacity-30"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-8 h-8 rounded-md text-[12px] font-medium transition-all ${
                                        page === pageNum
                                            ? 'bg-ink-900 text-paper-50'
                                            : 'text-ink-500 hover:bg-paper-200'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="btn btn-ghost !px-2.5 !py-1.5 !text-[12px] disabled:opacity-30"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
