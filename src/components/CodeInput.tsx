// src/components/CodeInput.tsx
'use client';

import { useState } from 'react';

interface CodeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeInput({ label, value, onChange }: CodeInputProps) {
  const [fileName, setFileName] = useState<string>('');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const text = await file.text();
    onChange(text);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-medium">{label}</label>
      
      <div className="flex items-center mb-2">
        <input
          type="file"
          accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.md,.py,.java,.c,.cpp"
          onChange={handleFileChange}
          className="hidden"
          id={`file-${label}`}
        />
        <label 
          htmlFor={`file-${label}`}
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
        >
          Upload File
        </label>
        {fileName && (
          <span className="ml-2 text-sm text-gray-600">
            {fileName}
          </span>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
        placeholder={`Paste your ${label.toLowerCase()} here...`}
      />
    </div>
  );
}