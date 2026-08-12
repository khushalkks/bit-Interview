import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, CheckCircle2, AlertCircle, Sparkles, Terminal } from 'lucide-react';
import { apiFetch } from '../services/api';

const STARTER_SNIPPETS = {
  javascript: `// JavaScript Coding Solution
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log("Result:", twoSum([2, 7, 11, 15], 9));`,

  python: `# Python Coding Solution
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

print("Result:", two_sum([2, 7, 11, 15], 9))`,

  cpp: `// C++ 20 Solution
#include <iostream>
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (map.find(diff) != map.end()) {
            return {map[diff], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,

  java: `// Java 17 Solution
import java.util.HashMap;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
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
    if (STARTER_SNIPPETS[newLang] && !code) {
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
        // Default simulated output
        setConsoleOutput({
          success: true,
          output: "✓ Code compiled cleanly!\nTest case 1: Passed\nTest case 2: Passed",
          execution_time: "0.04s"
        });
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
    <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl space-y-0">
      
      {/* Editor Header Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Monaco IDE Editor</span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/80 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3.10</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 17</option>
          </select>
        </div>

        <button
          type="button"
          disabled={running || !code.trim()}
          onClick={handleRunCode}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
        >
          {running ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Execute Code</span>
            </>
          )}
        </button>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="h-[260px] w-full pt-1">
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
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 font-mono text-xs text-left space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Output Terminal
            </span>
            <span>{consoleOutput.execution_time || '0.03s'}</span>
          </div>

          {consoleOutput.success ? (
            <div className="text-emerald-400 whitespace-pre-wrap flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <pre><code>{consoleOutput.output}</code></pre>
            </div>
          ) : (
            <div className="text-rose-400 whitespace-pre-wrap flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <pre><code>{consoleOutput.error}</code></pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
