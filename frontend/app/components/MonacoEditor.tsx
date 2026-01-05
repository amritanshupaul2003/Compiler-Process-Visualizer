'use client';

import dynamic from 'next/dynamic';
import type { CodeEditorProps } from './CodeEditor';

const Monaco = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center rounded-lg bg-gray-900 text-gray-500">
      Loading editor...
    </div>
  ),
});

export default function MonacoEditor(props: CodeEditorProps) {
  return <Monaco {...props} />;
}
