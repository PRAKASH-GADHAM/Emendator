import { useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';

const DIFFICULTY_STYLES = {
    Easy:   'text-sage bg-sage-muted border-sage/15',
    Medium: 'text-ochre bg-ochre-muted border-ochre/15',
    Hard:   'text-brick bg-brick-muted border-brick/15',
};

export default function ProblemList({ problems = [], onProblemClick }) {
    const navigate = useNavigate();

    const handleClick = (problem) => {
        if (onProblemClick) {
            onProblemClick(problem.id);
        } else {
            navigate(`/leetcode/${problem.id}`);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-ink-100">
                        <th className="px-5 py-2.5 text-[10.5px] font-semibold text-ink-400 uppercase tracking-[0.14em] w-16">#</th>
                        <th className="px-5 py-2.5 text-[10.5px] font-semibold text-ink-400 uppercase tracking-[0.14em]">Title</th>
                        <th className="px-5 py-2.5 text-[10.5px] font-semibold text-ink-400 uppercase tracking-[0.14em] w-24">Difficulty</th>
                        <th className="px-5 py-2.5 text-[10.5px] font-semibold text-ink-400 uppercase tracking-[0.14em]">Topics</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-ink-100/60">
                    {problems.map((problem) => {
                        const diffStyle = DIFFICULTY_STYLES[problem.difficulty] || 'text-ink-500 bg-paper-200 border-ink-200';
                        return (
                            <tr
                                key={problem.id}
                                onClick={() => handleClick(problem)}
                                className="cursor-pointer transition-colors hover:bg-paper-50 group"
                            >
                                <td className="px-5 py-3 text-[12.5px] text-ink-400 font-mono">
                                    {problem.number}
                                </td>
                                <td className="px-5 py-3">
                                    <span className="text-[13px] text-ink-800 font-medium group-hover:text-clay-600 transition-colors">
                                        {problem.title}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`chip text-[10px] border ${diffStyle}`}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {(problem.topics || []).slice(0, 3).map((topic) => (
                                            <span
                                                key={topic}
                                                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-500"
                                            >
                                                <Tag size={8} className="text-ink-400" />
                                                {topic}
                                            </span>
                                        ))}
                                        {(problem.topics || []).length > 3 && (
                                            <span className="text-[10px] text-ink-400 px-1 py-0.5">
                                                +{problem.topics.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
