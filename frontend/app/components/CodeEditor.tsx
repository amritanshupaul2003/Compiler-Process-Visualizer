'use client';

import { useRef, useEffect } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  theme?: 'vs-dark' | 'light' | 'hc-black';
  height?: string;
  readOnly?: boolean;
}

// TypeScript definitions for custom themes if needed
declare global {
  interface Window {
    MonacoEnvironment?: {
      getWorkerUrl?: (moduleId: string, label: string) => string;
    };
  }
}

export default function CodeEditor({ 
  code, 
  onChange, 
  language, 
  theme = 'vs-dark',
  height = '300px',
  readOnly = false
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Configure Monaco loader for web workers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
          if (label === 'json') {
            return '/monaco-editor/esm/vs/language/json/json.worker.js';
          }
          if (label === 'css' || label === 'scss' || label === 'less') {
            return '/monaco-editor/esm/vs/language/css/css.worker.js';
          }
          if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return '/monaco-editor/esm/vs/language/html/html.worker.js';
          }
          if (label === 'typescript' || label === 'javascript') {
            return '/monaco-editor/esm/vs/language/typescript/ts.worker.js';
          }
          return '/monaco-editor/esm/vs/editor/editor.worker.js';
        },
      };
    }
  }, []);

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'monospace'",
      lineNumbersMinChars: 3,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: true,
      snippetSuggestions: 'inline',
      parameterHints: { enabled: true },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      suggestSelection: 'first',
    });

    // Add language-specific configurations
    setupLanguageConfig(monacoInstance, language);

    // Focus the editor
    editor.focus();

    // Add keyboard shortcuts
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      // Save action
      console.log('Save triggered');
    });

    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Space, () => {
      // Trigger suggestion
      editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    });

    // Handle editor changes
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
    });

    // Optional: Add resize observer for responsive layout
    const resizeObserver = new ResizeObserver(() => {
      editor.layout();
    });

    const container = editor.getDomNode();
    if (container) {
      resizeObserver.observe(container);
    }

    // Cleanup
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  };

  // Configure language-specific settings
  const setupLanguageConfig = (monacoInstance: Monaco, lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        // Configure JavaScript/TypeScript
        monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
          moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
          strict: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          allowJs: true,
          checkJs: false,
        });
        
        monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
        });
        break;

      case 'python':
        // Configure Python (basic support)
        monacoInstance.languages.register({
          id: 'python',
          extensions: ['.py'],
          aliases: ['Python', 'py'],
          mimetypes: ['text/x-python', 'application/python'],
        });
        break;

      case 'html':
        // Configure HTML
        monacoInstance.languages.html.htmlDefaults.setOptions({
          format: {
            indentInnerHtml: true,
            preserveNewLines: true,
            maxPreserveNewLines: 1,
            indentHandlebars: true,
            endWithNewline: true,
            extraLiners: '',
            wrapLineLength: 120,
            wrapAttributes: 'auto',
            unformatted: '',
            contentUnformatted: 'pre,code,textarea',
          },
        });
        break;

      case 'css':
        // Configure CSS
        monacoInstance.languages.css.cssDefaults.setOptions({
          validate: true,
          lint: {
            compatibleVendorPrefixes: 'ignore',
            vendorPrefix: 'warning',
            duplicateProperties: 'warning',
            emptyRules: 'warning',
            importStatement: 'ignore',
            boxModel: 'ignore',
            universalSelector: 'ignore',
            zeroUnits: 'ignore',
            fontFaceProperties: 'warning',
            hexColorLength: 'error',
            argumentsInColorFunction: 'error',
            unknownProperties: 'warning',
            ieHack: 'ignore',
            unknownVendorSpecificProperties: 'ignore',
            propertyIgnoredDueToDisplay: 'warning',
            important: 'ignore',
            float: 'ignore',
            idSelector: 'ignore',
          },
        });
        break;

      // Add more language configurations as needed
    }
  };

  // Function to format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Function to clear editor
  const clearEditor = () => {
    onChange('');
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
  };

  // Optional: Add custom theme
  const setupCustomTheme = (monacoInstance: Monaco) => {
    monacoInstance.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2D2D30',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editorCursor.foreground': '#AEAFAD',
      },
    });
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-mono text-gray-400">{language.toUpperCase()}</span>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={formatCode}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
              title="Format Code (Ctrl+Alt+F)"
            >
              Format
            </button>
            <button
              onClick={clearEditor}
              className="px-3 py-1 text-xs bg-red-800 hover:bg-red-700 text-gray-200 rounded transition-colors"
              title="Clear Editor"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <Editor
          height={height}
          defaultLanguage={language.toLowerCase()}
          language={language.toLowerCase()}
          value={code}
          theme={theme}
          onMount={handleEditorDidMount}
          beforeMount={(monacoInstance) => {
            setupCustomTheme(monacoInstance);
          }}
          options={{
            readOnly,
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'monospace'",
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'on',
            cursorStyle: 'line',
            folding: true,
            showFoldingControls: 'always',
            lineDecorationsWidth: 0,
            overviewRulerBorder: false,
            renderIndentGuides: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
            },
            suggest: {
              showClasses: false,
              preview: true,
            },
            wordWrap: 'on',
            wrappingIndent: 'indent',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            snippetSuggestions: 'inline',
            parameterHints: { enabled: true, cycle: true },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            suggestSelection: 'first',
            accessibilitySupport: 'auto',
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            hover: {
              enabled: true,
              delay: 300,
              sticky: true,
            },
            multiCursorModifier: 'alt',
            dragAndDrop: true,
          }}
        />
        
        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-1 text-xs text-gray-400 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-mono">Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}</span>
            <span>UTF-8</span>
            <span>{language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💡 IntelliSense</span>
            <span className="text-green-400">●</span>
          </div>
        </div>
      </div>
    </div>
  );
}