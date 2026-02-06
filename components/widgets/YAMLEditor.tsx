'use client';

import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface YAMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function YAMLEditor({ value, onChange, height = '400px' }: YAMLEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="yaml"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingStrategy: 'advanced',
          tabSize: 2,
        }}
      />
    </div>
  );
}
