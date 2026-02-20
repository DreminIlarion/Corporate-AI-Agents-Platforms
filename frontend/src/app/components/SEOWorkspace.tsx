import React, { useMemo, useState, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import {
  ArrowLeft,
  FileText,
  BarChart3,
  Hash,
  Settings2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  Clock,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

// ─── Types & Constants ─────────────────────────────────────────────

type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

const INITIAL_KEYWORDS = [
  "1С автоматизация",
  "Тюмень IT",
  "ERP внедрение",
];

const CHECKLIST: ChecklistItem[] = [
  { id: "h1", label: "Заголовок H1 содержит ключ", checked: true },
  { id: "meta", label: "Мета-описание 140–160 символов", checked: false },
  { id: "density", label: "Плотность ключей < 3%", checked: true },
  { id: "lsi", label: "Есть LSI-слова", checked: true },
];

// ─── Hooks ──────────────────────────────────────────────────────────

function useSeoStats(content: string) {
  return useMemo(() => {
    const words = content.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.round(words / 180));

    return {
      score: 82,
      words,
      keywords: 12,
      readability: "Лёгкий",
      density: "2.4%",
      readingMinutes,
    };
  }, [content]);
}

// ─── Sidebar Components ─────────────────────────────────────────────

function SidebarHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-6 border-b border-slate-200 bg-white">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-slate-500 hover:text-red-800 -ml-2 mb-4 h-8 text-[10px] uppercase tracking-widest font-bold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Выход
      </Button>
      <h2 className="text-lg font-bold text-slate-900 leading-none">
        SEO копирайтер
      </h2>
    </div>
  );
}

function KeywordsPanel() {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Целевые ключи
      </label>
      <div className="flex flex-wrap gap-2">
        {INITIAL_KEYWORDS.map((key) => (
          <motion.span
            key={key}
            whileHover={{ y: -1 }}
            className="px-2 py-1 bg-white border border-slate-200 text-[11px] font-medium text-slate-600 rounded"
          >
            {key}
          </motion.span>
        ))}
        <button
          aria-label="Добавить ключ"
          className="p-1 border border-dashed border-slate-300 rounded hover:border-red-500 transition-colors"
        >
          <Plus size={12} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

function ChecklistPanel() {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        SEO чек-лист
      </label>
      <div className="space-y-3">
        {CHECKLIST.map((item) => (
          <CheckItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

function ScoreCard({ score }: { score: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-red-800 rounded-lg text-white space-y-3 shadow-lg shadow-red-100"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider">
          SEO рейтинг
        </span>
        <span className="text-2xl font-black">{score}</span>
      </div>
      <Progress value={score} className="h-1 bg-white/20" />
      <p className="text-[10px] opacity-70 leading-relaxed">
        Текст оптимизирован на {score}%. Добавьте alt-описания к
        изображениям.
      </p>
    </motion.div>
  );
}

function Sidebar({ onBack, score }: { onBack: () => void; score: number }) {
  return (
    <aside className="w-[350px] border-r border-slate-200 flex flex-col bg-slate-50/30">
      <SidebarHeader onBack={onBack} />
      <div className="p-6 space-y-8 overflow-y-auto">
        <KeywordsPanel />
        <ChecklistPanel />
        <ScoreCard score={score} />
      </div>
    </aside>
  );
}

// ─── Editor Components ──────────────────────────────────────────────

function EditorHeader({
  words,
  minutes,
}: {
  words: number;
  minutes: number;
}) {
  return (
    <header className="h-14 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-3 h-3 text-red-800" /> {words} слов
        </div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3 text-red-800" /> {minutes} мин. чтение
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase">
          Предпросмотр
        </Button>
        <Button
          size="sm"
          className="h-8 bg-red-800 hover:bg-red-900 text-white text-xs font-bold uppercase px-4"
        >
          Генерация
        </Button>
      </div>
    </header>
  );
}

function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-12 bg-white">
      <div className="max-w-3xl mx-auto space-y-6 text-left">
        <input
          type="text"
          placeholder="Введите заголовок статьи (H1)…"
          className="w-full text-4xl font-black tracking-tight border-none outline-none placeholder:text-slate-200 text-slate-900 bg-transparent"
        />
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Начните писать или позвольте ИИ сгенерировать черновик…"
          className="w-full h-[60vh] text-lg leading-relaxed text-slate-700 outline-none resize-none placeholder:text-slate-100 bg-transparent border-none"
        />
      </div>
    </div>
  );
}

function EditorArea({
  content,
  onChange,
  stats,
}: {
  content: string;
  onChange: (v: string) => void;
  stats: ReturnType<typeof useSeoStats>;
}) {
  return (
    <main className="flex-1 flex flex-col bg-white">
      <EditorHeader
        words={stats.words}
        minutes={stats.readingMinutes}
      />
      <Editor content={content} onChange={onChange} />
    </main>
  );
}

// ─── Tools Sidebar ──────────────────────────────────────────────────

function ToolIcon({
  icon,
  label,
  color = "text-slate-400",
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex flex-col items-center gap-1 group transition-all"
    >
      <div
        className={`p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm ${color}`}
      >
        {icon}
      </div>
      <span className="text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </button>
  );
}

function ToolsSidebar() {
  return (
    <aside className="w-16 border-l border-slate-200 flex flex-col items-center py-6 gap-6 bg-slate-50/20">
      <ToolIcon icon={<Sparkles size={18} />} label="AI" color="text-red-800" />
      <ToolIcon icon={<BarChart3 size={18} />} label="SEO" />
      <ToolIcon icon={<Hash size={18} />} label="Tags" />
      <ToolIcon icon={<Settings2 size={18} />} label="Настройки" />
      <div className="mt-auto flex flex-col gap-4 mb-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
          <Copy size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
          <Share2 size={16} />
        </Button>
      </div>
    </aside>
  );
}

// ─── Shared ─────────────────────────────────────────────────────────

function CheckItem({ label, checked }: ChecklistItem) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      {checked ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
      )}
      <span
        className={
          checked
            ? "text-slate-700 font-medium"
            : "text-slate-400 font-light"
        }
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export function SEOWorkspace({ onBack }: { onBack: () => void }) {
  const [content, setContent] = useState("");

  const stats = useSeoStats(content);

  const handleChange = useCallback((v: string) => {
    setContent(v);
  }, []);

  return (
    <div className="h-screen flex bg-white overflow-hidden font-sans w-full">
      <Sidebar onBack={onBack} score={stats.score} />
      <EditorArea
        content={content}
        onChange={handleChange}
        stats={stats}
      />
      <ToolsSidebar />
    </div>
  );
}
