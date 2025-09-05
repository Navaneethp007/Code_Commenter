'use client';

import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeCommenter() {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState<string>('');
  const [commentedCode, setCommentedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file);
    }
  };

  const processCode = async () => {
    if (!file || !code) return;

    try {
      const formData = new FormData();
      formData.append('file', new Blob([code], { type: 'text/plain' }), file.name);

      const response = await fetch('http://localhost:5000/commenter', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const comments = await response.text();
        setCommentedCode(comments);
        setError('');
      } else {
        setError('Error in processing the file.');
      }
    } catch (e) {
      setError(`An error occurred: ${e}`);
    }
  };

  const downloadComments = () => {
    if (!commentedCode || !file) return;
    
    const blob = new Blob([commentedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Code Commenter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transform your code with intelligent comments
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="relative h-48">
            <input
              type="file"
              accept=".py,.java,.cpp,.js"
              onChange={handleFileUpload}
              className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 
                         rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700
                         hover:border-blue-500 dark:hover:border-blue-400 transition-colors
                         opacity-0 absolute inset-0"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-gray-500 dark:text-gray-400">
                Drop your code file here or click to browse
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Supports .py, .java, .cpp, and .js files
              </span>
            </div>
          </div>
        </div>

        {code && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Code Preview
            </h2>
            <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
              <SyntaxHighlighter
                language="javascript"
                style={oneDark}
                className="!m-0"
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={processCode}
                disabled={!file}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg
                  font-medium rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
                  disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Process Code
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
            <div className="flex">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <p className="text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {commentedCode && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Code with Comments
              </h2>
              <button
                onClick={downloadComments}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white
                  font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Comments
              </button>
            </div>
            <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
              <SyntaxHighlighter
                language="javascript"
                style={oneDark}
                className="!m-0"
                showLineNumbers={true}
              >
                {commentedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
