import React, { useState, useRef, useEffect } from "react";
import { MarkdownRenderer } from "./markdownrender";
import { Button } from "@/app/components/ui/button";

function PaginatedDocument({ content }) {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Разделяем по заголовкам H2 (логические страницы)
  useEffect(() => {
    if (!content) return;
    
    // Разделяем по заголовкам второго уровня
    const sections = content.split(/(?=^## )/gm);
    setPages(sections.filter(s => s.trim()));
  }, [content]);

  return (
    <div className="relative">
      {/* Контент текущей страницы */}
      <div className="p-8 prose prose-slate max-w-none bg-white min-h-[60vh]">
        <MarkdownRenderer content={pages[currentPage - 1] || ''} />
      </div>
      
      {/* Простая пагинация снизу */}
      {pages.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 border-t bg-slate-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ←
          </Button>
          
          <span className="text-sm text-slate-600 px-4">
            {currentPage} / {pages.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(pages.length, p + 1))}
            disabled={currentPage === pages.length}
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}
export {PaginatedDocument};
