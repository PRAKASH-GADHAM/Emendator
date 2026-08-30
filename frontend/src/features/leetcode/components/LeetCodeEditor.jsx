import { useRef, useEffect, useCallback } from 'react';
import Editor, { loader } from '@monaco-editor/react';

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

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs',
    },
});

export default function LeetCodeEditor({
    value = '',
    onChange,
    language = 'javascript',
    readOnly = false,
    height = '100%',
}) {
    const editorRef = useRef(null);

    const monacoLang = MONACO_LANGUAGE_MAP[language?.toLowerCase()] || 'plaintext';

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleChange = useCallback((val) => {
        if (onChange) onChange(val);
    }, [onChange]);

    return (
        <div className="relative flex flex-col h-full">
            <div className="flex-1 overflow-hidden monaco-cream">
                <Editor
                    height={height === '100%' ? undefined : height}
                    defaultLanguage={monacoLang}
                    language={monacoLang}
                    value={value}
                    onChange={handleChange}
                    onMount={handleEditorDidMount}
                    loading={
                        <div className="flex items-center justify-center h-full bg-white">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-2" />
                                <p className="text-ink-400 text-[12.5px] font-mono">Loading editor...</p>
                            </div>
                        </div>
                    }
                    options={{
                        readOnly,
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        fontLigatures: true,
                        lineHeight: 1.7,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        lineNumbers: 'on',
                        renderLineHighlight: 'gutter',
                        cursorBlinking: 'smooth',
                        smoothScrolling: true,
                        contextmenu: true,
                        automaticLayout: true,
                        tabSize: 4,
                        insertSpaces: true,
                        folding: true,
                        bracketPairColorization: { enabled: true },
                        'semanticHighlighting.enabled': true,
                    }}
                    theme="vs"
                />
            </div>
        </div>
    );
}
