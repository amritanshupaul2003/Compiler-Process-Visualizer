
import dynamic from 'next/dynamic';
import { CodeEditorProps } from "./CodeEditor"

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-900 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});

export default function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  return (
    <MonacoEditor
      height="64vh"
      language={language}
      value={code}
      onChange={(value: string | undefined) => onChange(value || '')}
    />
  );
}