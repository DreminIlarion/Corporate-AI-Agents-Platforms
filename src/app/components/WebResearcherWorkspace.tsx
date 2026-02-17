import React, { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { MarkdownRenderer } from "./ui/markdownrender";

import { Button } from "./ui/button";
import { Card } from "./ui/card";

import {
  ArrowLeft,
  Search,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Edit3,
  Eye,
  Loader2,
  Globe,
} from "lucide-react";

// --- Research stages ---
const STEPS = [
  "Поиск релевантных источников",
  "Анализ и верификация",
  "Синтез выводов",
  "Формирование отчета",
  "Поиск релевантных источников",
  "Анализ и верификация",
  "Синтез выводов",
  "Формирование отчета",
];

// --- Generation overlay ---
function GenerationOverlay({ step }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      <Card className="w-[420px] p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          Исследование выполняется
        </div>

        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`text-sm transition-opacity ${
                step >= i ? "opacity-100" : "opacity-30"
              }`}
            >
              {step === i ? "→ " : ""}
              {s}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// --- Toolbar ---
function Toolbar({ mode, setMode }) {
  return (
    <div className="flex items-center justify-between border-b px-6 h-14 bg-white">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Globe className="w-4 h-4" />
        Web Research Workspace
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setMode(mode === "view" ? "edit" : "view")}
      >
        {mode === "view" ? (
          <>
            <Edit3 className="w-4 h-4 mr-2" /> Редактировать
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" /> Просмотр
          </>
        )}
      </Button>
    </div>
  );
}

export function WebResearcherWorkspace({ onBack }) {
  const [query, setQuery] = useState("");
  const [doc, setDoc] = useState("");
  const [mode, setMode] = useState("view");
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(-1);

  const runResearch = useCallback((text) => {
  // Очищаем и начинаем генерацию
  setDoc("");
  setGenerating(true);
  setStep(0);

  let currentStep = 0;
  const stepTimer = setInterval(() => {
    if (currentStep < STEPS.length - 1) {
      currentStep++;
      setStep(currentStep);
    } else {
      clearInterval(stepTimer);
      
      // Начинаем вывод текста
      let charIndex = 0;
      const textOutput = Array.isArray(text) ? text.join('\n') : String(text);
      
      const printTimer = setInterval(() => {
        if (charIndex < textOutput.length) {
          const char = textOutput[charIndex];
          // Проверяем что символ валидный
          if (char && char !== undefined) {
            setDoc(prev => prev + char);
          }
          charIndex++;
        } else {
          clearInterval(printTimer);
          setGenerating(false);
          setStep(-1);
        }
      }, 30); // Увеличьте до 20-30 мс для более плавного отображения
    }
  }, 800); // Увеличьте интервал между шагами
}, []);

  return (
    <div className="h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-[340px] bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Назад
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-lg font-semibold">Исследование</h2>
            <p className="text-sm text-slate-500">
              Введите тему или ссылку
            </p>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: тренды AI в 2026"
            className="w-full h-32 border rounded-lg p-3 text-sm resize-none outline-none"
          />

          <div className="grid gap-2">
            <Button
              disabled={!query || generating}
              className="justify-start  bg-gradient-to-r from-red-800 to-red-900 hover:bg-black"
              onClick={() =>
                runResearch(
                  "# Отчет исследования\n\n## Выводы\nРынок AI ускоряется..."
                )
              }
            >
              <Sparkles className="w-4 h-4 mr-3" /> Полное исследование
            </Button>

            <Button
              variant="outline"
              disabled={!query || generating}
              className="justify-start"
              onClick={() =>
                runResearch("# Проверка фактов\n\nДанные подтверждены.")
              }
            >
              <ShieldCheck className="w-4 h-4 mr-3" /> Проверка
            </Button>

            <Button
              variant="outline"
              disabled={!query || generating}
              className="justify-start"
              onClick={() =>
                runResearch("# Анализ трендов\n\nКлючевые направления...")
              }
            >
              <TrendingUp className="w-4 h-4 mr-3" /> Тренды
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col relative">
        <Toolbar mode={mode} setMode={setMode} />

        <main className="flex-1 overflow-y-auto p-10">
          <Card className="min-h-[70vh] p-10 bg-white">
            {!doc ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
                <Search className="w-12 h-12 mb-4 opacity-40" />
                <p>Введите запрос для начала исследования</p>
              </div>
            ) : mode === "view" ? (
              <MarkdownRenderer content={doc} />
            ) : (
              <textarea
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                className="w-full h-[60vh] font-mono outline-none resize-none"
              />
            )}
          </Card>
        </main>

        {generating && <GenerationOverlay step={step} />}
      </div>
    </div>
  );
}
