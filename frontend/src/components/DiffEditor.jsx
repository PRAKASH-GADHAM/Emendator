import { useRef } from 'react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import { GitCompare } from 'lucide-react';

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs',
    },
});

const MONACO_LANGUAGE_MAP = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'html',
    css: 'css',
    sql: 'sql',
    bash: 'shell',
    other: 'plaintext',
};

export default function DiffEditor({ original = '', modified = '', language = 'javascript' }) {
    const editorRef = useRef(null);
    const monacoLang = MONACO_LANGUAGE_MAP[language] || 'plaintext';

    const hasChanges = original !== modified;

    if (!hasChanges) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-paper-200 border border-ink-100">
                    <GitCompare size={22} className="text-ink-400" strokeWidth={1.8} />
                </div>
                <p className="text-ink-700 text-[13.5px] font-medium mb-1">No differences yet</p>
                <p className="text-ink-400 text-[12px] font-mono">Apply fixes with Tab to see the diff here</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header labels */}
            <div className="flex border-b border-ink-100 bg-paper-100">
                <div className="flex-1 px-4 py-2 text-[11.5px] text-ink-500 font-mono border-r border-ink-100">
                    <span className="text-brick mr-2">−</span>Original
                </div>
                <div className="flex-1 px-4 py-2 text-[11.5px] text-ink-500 font-mono">
                    <span className="text-sage mr-2">+</span>Fixed
                </div>
            </div>

            <div className="flex-1 overflow-hidden monaco-cream">
                <MonacoDiffEditor
                    original={original}
                    modified={modified}
                    language={monacoLang}
                    onMount={(editor) => { editorRef.current = editor; }}
                    loading={
                        <div className="flex items-center justify-center h-full bg-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500" />
                        </div>
                    }
                    options={{
                        readOnly: true,
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        fontLigatures: true,
                        lineHeight: 1.7,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        renderSideBySide: true,
                        enableSplitViewResizing: true,
                        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                        automaticLayout: true,
                        diffWordWrap: 'on',
                        renderOverviewRuler: false,
                    }}
                    theme="vs"
                />
            </div>
        </div>
    );
}
