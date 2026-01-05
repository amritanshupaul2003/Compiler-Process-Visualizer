'use client';

import { useRef, useEffect } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditorType } from 'monaco-editor';

export interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  theme?: 'vs-dark' | 'light' | 'hc-black';
  height?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  code,
  onChange,
  language,
  theme = 'vs-dark',
  height = '400px',
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.focus();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  return (
    <Editor
      height={height}
      language={language.toLowerCase()}
      value={code}
      theme={theme}
      onMount={handleEditorDidMount}
      onChange={(value) => onChange(value ?? '')}
      options={{
        readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
        scrollBeyondLastLine: false,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',

        wordBasedSuggestions: 'currentDocument',

        snippetSuggestions: 'inline',
        parameterHints: { enabled: true },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        suggestSelection: 'first',
        cursorBlinking: 'blink',
        wordWrap: 'on',
      }}
    />
  );
}
