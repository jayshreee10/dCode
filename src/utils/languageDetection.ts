// src/utils/languageDetection.ts
// Remove the Prism imports and requires that are causing issues

type LanguageScore = {
    language: string;
    name: string;
    score: number;
  };
  
  // Map file extensions to language identifiers
  const extensionMap: { [key: string]: string } = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'rb': 'ruby',
    'rs': 'rust',
    'go': 'go',
    'php': 'php',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'sql': 'sql',
  };
  
  // Map language identifiers to display names
  const languageNames: { [key: string]: string } = {
    'javascript': 'JavaScript',
    'jsx': 'JSX',
    'typescript': 'TypeScript',
    'tsx': 'TSX',
    'python': 'Python',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'csharp': 'C#',
    'ruby': 'Ruby',
    'rust': 'Rust',
    'go': 'Go',
    'php': 'PHP',
    'html': 'HTML',
    'css': 'CSS',
    'json': 'JSON',
    'markdown': 'Markdown',
    'sql': 'SQL',
    'text': 'Plain Text',
  };
  
  // Detect language from file extension
  export function detectLanguageFromFileName(fileName: string): string | null {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return extensionMap[extension] || null;
  }
  
  // Detect language from code content using heuristics
  export function detectLanguageFromContent(code: string): { language: string, name: string } {
    if (!code || code.trim().length === 0) {
      return { language: 'text', name: 'Plain Text' };
    }
  
    // Common language patterns to look for
    const patterns = [
      { regex: /import\s+[{]?[\w\s,]*[}]?\s+from\s+['"][\w\/@-]+['"]/g, language: 'javascript', score: 5 },
      { regex: /function\s+\w+\s*\([^)]*\)\s*{/g, language: 'javascript', score: 3 },
      { regex: /const\s+\w+\s*=\s*\([^)]*\)\s*=>/g, language: 'javascript', score: 4 },
      { regex: /import\s+React/g, language: 'jsx', score: 6 },
      { regex: /<[A-Z][A-Za-z]*\s+[^>]*>/g, language: 'jsx', score: 5 },
      { regex: /interface\s+\w+\s*{/g, language: 'typescript', score: 6 },
      { regex: /:\s*\w+\[\]/g, language: 'typescript', score: 5 },
      { regex: /<\w+[^>]*>[\s\S]*<\/\w+>/g, language: 'html', score: 3 },
      { regex: /class="[^"]*"/g, language: 'html', score: 3 },
      { regex: /def\s+\w+\s*\([^)]*\):/g, language: 'python', score: 6 },
      { regex: /import\s+[\w.]+/g, language: 'python', score: 4 },
      { regex: /public\s+class\s+\w+/g, language: 'java', score: 6 },
      { regex: /public\s+static\s+void\s+main/g, language: 'java', score: 7 },
      { regex: /#include\s+<[\w.]+>/g, language: 'cpp', score: 6 },
      { regex: /int\s+main\s*\(\s*\)/g, language: 'c', score: 6 },
      { regex: /namespace\s+\w+/g, language: 'csharp', score: 5 },
      { regex: /func\s+\w+\s*\([^)]*\)\s*{/g, language: 'go', score: 6 },
      { regex: /package\s+\w+/g, language: 'go', score: 5 },
      { regex: /SELECT\s+[\w\*]+\s+FROM\s+\w+/gi, language: 'sql', score: 6 },
      { regex: /CREATE\s+TABLE\s+\w+/gi, language: 'sql', score: 6 },
      { regex: /\$\w+\s*=/g, language: 'php', score: 5 },
      { regex: /<\?php/g, language: 'php', score: 7 },
      { regex: /^\s*\{[\s\S]*\}\s*$/g, language: 'json', score: 5 },
      { regex: /fn\s+\w+\s*\([^)]*\)\s*->/g, language: 'rust', score: 6 },
      { regex: /let\s+mut\s+\w+/g, language: 'rust', score: 5 },
      { regex: /require ['"][\w\/.-]+['"]/g, language: 'ruby', score: 5 },
      { regex: /def\s+\w+(\(.+\))?\s+do/g, language: 'ruby', score: 6 },
    ];
  
    const results: LanguageScore[] = [];
  
    // Check patterns and calculate scores
    patterns.forEach(pattern => {
      const matches = (code.match(pattern.regex) || []).length;
      if (matches > 0) {
        results.push({
          language: pattern.language,
          name: languageNames[pattern.language] || pattern.language,
          score: matches * pattern.score
        });
      }
    });
  
    // Add special check for JSX/TSX
    if (code.includes('import React') || code.includes('React.') || /<[A-Z][A-Za-z0-9]*/.test(code)) {
      if (code.includes(': ') || code.includes('interface ') || code.includes('type ')) {
        results.push({ language: 'tsx', name: 'TSX', score: 10 });
      } else {
        results.push({ language: 'jsx', name: 'JSX', score: 8 });
      }
    }
  
    // Sort by score and return the best match
    results.sort((a, b) => b.score - a.score);
    
    if (results.length > 0) {
      return { language: results[0].language, name: results[0].name };
    }
    
    // Default to JavaScript if no strong patterns are found
    return { language: 'text', name: 'Text' };
  }
  
  // Combine file name and content detection
  export function detectLanguage(code: string, fileName?: string): { language: string, name: string } {
    if (fileName) {
      const langFromFile = detectLanguageFromFileName(fileName);
      if (langFromFile) {
        return { 
          language: langFromFile, 
          name: languageNames[langFromFile] || langFromFile 
        };
      }
    }
    
    return detectLanguageFromContent(code);
  }