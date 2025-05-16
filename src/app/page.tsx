// src/app/page.tsx
'use client';

import { useState } from 'react';
import CodeDiffViewer from '@/components/CodeDiffViewer';
import CodeInput from '@/components/CodeInput';
import { BsStars } from "react-icons/bs";
export default function Home() {
  const [oldCode, setOldCode] = useState<string>('// Paste your original code here');
  const [newCode, setNewCode] = useState<string>('// Paste your modified code here');
  
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Code Difference Checker</h1>
      <p className='w-full flex justify-end py-4'>
      <span className="w-[90px] flex items-center  justify-center gap-1 text-sm font-semibold py-1 bg-violet-400 text-white rounded-sm cursor-pointer">
                    <BsStars />  Explain
                    </span>
      </p>
   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <CodeInput 
          label="Original Code" 
          value={oldCode} 
          onChange={setOldCode} 
        />
        <CodeInput 
          label="Modified Code" 
          value={newCode} 
          onChange={setNewCode} 
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Differences</h2>
        <CodeDiffViewer oldCode={oldCode} newCode={newCode} />
      </div>
    </main>
  );
}