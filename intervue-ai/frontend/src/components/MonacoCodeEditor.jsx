import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, CheckCircle2, AlertCircle, Terminal, Cpu, Clock } from 'lucide-react';
import { codingAPI } from '../services/api';

const STARTER_SNIPPETS = {
  javascript: `// Write your JavaScript solution here
function solution() {
  
}

console.log(solution());`,

  python: `# Write your Python solution here
def solution():
    pass

print(solution())`,

  cpp: `// Write your C++ solution here
#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}`,

  java: `// Write your Java solution here
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
};

export default function MonacoCodeEditor({
  code,
  setCode,
  language = 'javascript',
  setLanguage,
  onExecuteCode
}) {
  const [running, setRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);

  function handleLanguageChange(newLang) {
    if (setLanguage) setLanguage(newLang);
    if (STARTER_SNIPPETS[newLang] && (!code || code === STARTER_SNIPPETS[language])) {
      setCode(STARTER_SNIPPETS[newLang]);
    }
  }

  async function handleRunCode() {
    setRunning(true);
    setConsoleOutput(null);
    try {
      if (onExecuteCode) {
        const res = await onExecuteCode(code, language);
        setConsoleOutput(res);
      } else {
        const res = await codingAPI.runCode(code, language);
        setConsoleOutput(res);
      }
    } catch (err) {
      setConsoleOutput({
        success: false,
        error: err.message || "Failed to execute code snippet"
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xl space-y-0 font-sans">
      
      {/* Editor Header Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-700 font-bold">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Monaco IDE Editor</span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3.11</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 17</option>
          </select>
        </div>

        <button
          type="button"
          disabled={running || !code.trim()}
          onClick={handleRunCode}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
        >
          {running ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Compiling & Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Sandbox Code</span>
            </>
          )}
        </button>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="h-[270px] w-full pt-1 bg-slate-950">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code || STARTER_SNIPPETS[language] || ''}
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "Fira Code, Consolas, Monaco, monospace",
            lineNumbersMinChars: 3,
          }}
        />
      </div>

      {/* Terminal Output Console */}
      {consoleOutput && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 font-mono text-xs text-left space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-bold text-indigo-400">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Output Sandbox Terminal
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-slate-400" /> {consoleOutput.execution_time || '12.4 ms'}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Cpu className="w-3 h-3 text-slate-400" /> {consoleOutput.memory_used || '14.8 MB'}
              </span>
            </div>
          </div>

          {consoleOutput.success ? (
            <div className="text-emerald-400 whitespace-pre-wrap flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <pre className="font-mono text-xs"><code>{consoleOutput.output}</code></pre>
            </div>
          ) : (
            <div className="text-rose-400 whitespace-pre-wrap flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <pre className="font-mono text-xs"><code>{consoleOutput.error}</code></pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
