import { CheckCircle2, XCircle, Clock, Play, AlertTriangle, Network, CircleOff } from 'lucide-react';

const STATUS_META = {
    PASSED: { icon: CheckCircle2, color: 'text-sage', bg: 'bg-sage-muted', border: 'border-sage/15', label: 'All tests passed' },
    FAILED: { icon: XCircle, color: 'text-brick', bg: 'bg-brick-muted', border: 'border-brick/15', label: 'Some tests failed' },
    COMPILE_ERROR: { icon: AlertTriangle, color: 'text-ochre', bg: 'bg-ochre-muted', border: 'border-ochre/15', label: 'Compilation error' },
    RUNTIME_ERROR: { icon: XCircle, color: 'text-brick', bg: 'bg-brick-muted', border: 'border-brick/15', label: 'Runtime error' },
    TIMEOUT: { icon: CircleOff, color: 'text-ochre', bg: 'bg-ochre-muted', border: 'border-ochre/15', label: 'Execution timed out' },
};

export default function TestCasePanel({ result, isRunning, error }) {
    // Running state
    if (isRunning) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-white">
                <div className="w-10 h-10 rounded-full border-2 border-clay-200 animate-spin"
                    style={{ borderTopColor: '#c96442', animationDuration: '1s' }} />
                <div className="text-center">
                    <p className="text-ink-700 font-medium text-[13px]">Running tests…</p>
                    <p className="text-ink-400 text-[12px] mt-0.5">Executing your solution</p>
                </div>
            </div>
        );
    }

    // Network / API error state (no usable backend result)
    if (error && !result) {
        const message = error.response?.data?.message || error.message || 'Failed to reach the execution service';
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-brick-muted border border-brick/15">
                    <Network size={22} className="text-brick opacity-80" />
                </div>
                <div>
                    <p className="text-ink-700 font-medium text-[13.5px] mb-1">Network / API error</p>
                    <p className="text-ink-400 text-[12.5px]">{message}</p>
                </div>
            </div>
        );
    }

    // Idle state
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-sage-muted border border-sage/15">
                    <Play size={20} className="text-sage opacity-70" fill="currentColor" />
                </div>
                <div>
                    <p className="text-ink-700 font-medium text-[13.5px] mb-1">No test results yet</p>
                    <p className="text-ink-400 text-[12.5px]">Press <kbd>Run</kbd> to execute your code against test cases</p>
                </div>
            </div>
        );
    }

    const status = result.status || 'FAILED';
    const meta = STATUS_META[status] || STATUS_META.FAILED;
    const StatusIcon = meta.icon;
    const testCases = Array.isArray(result.testResults) ? result.testResults : [];
    const fallbackPassed = testCases.filter((tc) => tc.passed).length;
    const total = result.totalTests || testCases.length;
    const passedDisplay = (typeof result.passedTests === 'number') ? result.passedTests : fallbackPassed;

    // Compile error: show the compiler output prominently
    if (status === 'COMPILE_ERROR') {
        const compileError = testCases[0]?.error || result.compileError || '';
        const expected = testCases[0]?.expected;
        return (
            <div className="h-full overflow-y-auto bg-white">
                <div className={`flex items-center gap-3 px-5 py-3 border-b ${meta.bg} ${meta.border}`}>
                    <StatusIcon size={16} className={meta.color} />
                    <span className={`text-[13px] font-semibold ${meta.color}`}>{meta.label}</span>
                    <span className="text-[12px] text-ink-500 ml-auto">Code failed to compile</span>
                </div>
                <div className="px-5 py-4 space-y-4">
                    <div>
                        <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide">Compiler output</span>
                        <pre className="mt-1.5 text-[12px] font-mono text-brick bg-brick-muted border border-brick/15 rounded-md px-3 py-2.5 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                            {compileError || 'Compilation failed with no compiler output.'}
                        </pre>
                    </div>
                    {expected != null && (
                        <div>
                            <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide">First expected output</span>
                            <code className="block mt-1 text-[12px] font-mono text-ink-700 bg-paper-50 border border-ink-100 rounded px-2.5 py-1.5 whitespace-pre-wrap">
                                {expected}
                            </code>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Runtime error: show a compact message + results context
    if (status === 'RUNTIME_ERROR' || status === 'TIMEOUT') {
        const errMsg = status === 'TIMEOUT'
            ? 'Your program exceeded the allowed execution time. Check for infinite loops or excessive work.'
            : (testCases[0]?.error || 'Your program terminated unexpectedly at runtime.');
        return (
            <div className="h-full overflow-y-auto bg-white">
                <div className={`flex items-center gap-3 px-5 py-3 border-b ${meta.bg} ${meta.border}`}>
                    <StatusIcon size={16} className={meta.color} />
                    <span className={`text-[13px] font-semibold ${meta.color}`}>{meta.label}</span>
                </div>
                <div className="px-5 py-4">
                    <pre className="text-[12px] font-mono text-brick bg-brick-muted border border-brick/15 rounded-md px-3 py-2.5 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {errMsg}
                    </pre>
                    {testCases.length > 0 && (
                        <div className="mt-5 divide-y divide-ink-100/60">
                            {testCases.map((tc, idx) => (
                                <TestCaseRow key={idx} index={idx} tc={tc} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // PASSED / FAILED with per-test rows
    return (
        <div className="h-full overflow-y-auto bg-white">
            <div className={`flex items-center gap-3 px-5 py-3 border-b ${meta.bg} ${meta.border}`}>
                <StatusIcon size={16} className={meta.color} />
                <span className={`text-[13px] font-semibold ${meta.color}`}>{meta.label}</span>
                <span className="text-[12px] text-ink-500 ml-auto">
                    {passedDisplay}/{total} passed
                </span>
                {result.totalRuntime != null && (
                    <span className="flex items-center gap-1 text-[11px] text-ink-400 font-mono">
                        <Clock size={10} />
                        {result.totalRuntime}ms
                    </span>
                )}
            </div>

            {testCases.length > 0 ? (
                <div className="divide-y divide-ink-100/60">
                    {testCases.map((tc, idx) => (
                        <TestCaseRow key={idx} index={tc.testCaseIndex != null ? tc.testCaseIndex : idx} tc={tc} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-ink-400 text-[12.5px]">No test case details available</p>
                </div>
            )}
        </div>
    );
}

function TestCaseRow({ index, tc }) {
    const passed = !!tc.passed;
    return (
        <div className="px-5 py-3.5 space-y-2.5">
            <div className="flex items-center gap-2.5">
                {passed ? (
                    <CheckCircle2 size={14} className="text-sage flex-shrink-0" />
                ) : (
                    <XCircle size={14} className="text-brick flex-shrink-0" />
                )}
                <span className="text-[12.5px] font-medium text-ink-700">
                    Test Case {index + 1}
                </span>
                {tc.status && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        passed ? 'bg-sage-muted text-sage' : 'bg-brick-muted text-brick'
                    }`}>
                        {tc.status}
                    </span>
                )}
                {tc.runtime != null && (
                    <span className="text-[10.5px] text-ink-400 font-mono ml-auto">
                        {tc.runtime}ms
                    </span>
                )}
            </div>

            {tc.input != null && (
                <div className="ml-6">
                    <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide">Input</span>
                    <code className="block mt-0.5 text-[12px] font-mono text-ink-700 bg-paper-50 border border-ink-100 rounded px-2.5 py-1.5 whitespace-pre-wrap">
                        {tc.input}
                    </code>
                </div>
            )}

            {tc.expected != null && (
                <div className="ml-6">
                    <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide">Expected</span>
                    <code className="block mt-0.5 text-[12px] font-mono text-ink-700 bg-paper-50 border border-ink-100 rounded px-2.5 py-1.5 whitespace-pre-wrap">
                        {tc.expected}
                    </code>
                </div>
            )}

            {tc.actual != null && (
                <div className="ml-6">
                    <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide">Your Output</span>
                    <code className={`block mt-0.5 text-[12px] font-mono rounded px-2.5 py-1.5 whitespace-pre-wrap border ${
                        passed
                            ? 'text-sage bg-sage-muted border-sage/15'
                            : 'text-brick bg-brick-muted border-brick/15'
                    }`}>
                        {tc.actual}
                    </code>
                </div>
            )}

            {tc.error && (
                <div className="ml-6">
                    <span className="text-[10px] font-semibold text-brick uppercase tracking-wide">Error</span>
                    <code className="block mt-0.5 text-[12px] font-mono text-brick bg-brick-muted border border-brick/15 rounded px-2.5 py-1.5 whitespace-pre-wrap">
                        {tc.error}
                    </code>
                </div>
            )}
        </div>
    );
}
