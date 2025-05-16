// src/components/CodeDiffViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import * as Diff from 'diff';

interface CodeDiffViewerProps {
  oldCode: string;
  newCode: string;
  language?: string;
}

export default function CodeDiffViewer({ 
  oldCode, 
  newCode
}: CodeDiffViewerProps) {
  const [diffResult, setDiffResult] = useState<string>('');
  
  useEffect(() => {
    // Calculate diff statistics
    const diff = Diff.diffLines(oldCode, newCode);
    
    let additions = 0;
    let deletions = 0;
    
    diff.forEach(part => {
      if (part.added) {
        additions += part.count || 0;
      } else if (part.removed) {
        deletions += part.count || 0;
      }
    });
    
    setDiffResult(`${additions} additions, ${deletions} deletions`);
  }, [oldCode, newCode]);
  
  return (
    <div>
      <div className="text-sm text-gray-600 mb-4">
        {diffResult}
      </div>
      
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        disableWordDiff={false}
        useDarkTheme={false}
        extraLinesSurroundingDiff={3}
      />
    </div>
  );
}