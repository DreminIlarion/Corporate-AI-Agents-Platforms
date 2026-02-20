import * as React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "./utils";


function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-content max-w-none text-slate-800 text-[15px] leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-6 tracking-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-black mt-8 mb-5 pb-2 border-b border-slate-200" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-6" {...props} />,
          ul: ({ node, ...props }) => <ul className="ml-6 list-disc space-y-2 my-5" {...props} />,
          ol: ({ node, ...props }) => <ol className="ml-6 list-decimal space-y-2 my-5" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
          a: ({ node, ...props }) => <a className="text-red-700 hover:underline" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-red-500 pl-5 pr-4 italic text-slate-600 my-6 py-1 bg-red-50/30 rounded-r" {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-700 text-sm" {...props} />
            ) : (
              <code className="block bg-slate-900 p-5 rounded-xl shadow-lg overflow-x-auto my-6 text-sm text-slate-200" {...props} />
            ),
          pre: ({ node, ...props }) => <pre className="not-prose" {...props} />,
          table: ({ node, ...props }) => (
            <div className="my-8 overflow-x-auto rounded-lg shadow-sm ring-1 ring-slate-400">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-slate-300" {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="p-6 text-left font-semibold text-slate-900 border border-slate-200 uppercase text-xs tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="p-4 border border-slate-200 text-slate-800 align-top whitespace-pre-wrap" {...props} />
          ),
          tr: ({ node, ...props }) => <tr className="hover:bg-slate-100 transition-colors" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
export {MarkdownRenderer};
