import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  FileText,
  Clock,
  Bot,
  Construction, // Иконка для режима разработки
} from "lucide-react";

export default function AgentDetails({ agent, onBack, onStart }: any) {
  // Проверяем, готов ли агент к работе
  const isReady = 
    agent.name === "Web Researcher" || 
    agent.name === "Протоколы Совещаний" || 
    agent.name === "SEO Копирайтер";
    

  return (
    <div className="mx-auto px-8 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-6">
        <Button variant="ghost" onClick={onBack} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="bg-gradient-to-r from-red-800 to-red-700 w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">
            {agent.name}
          </h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {agent.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {agent.model}
            </Badge>
          </div>
        </div>

        {/* Динамическая кнопка */}
        <Button
          onClick={isReady ? onStart : undefined}
          disabled={!isReady}
          className={`h-11 px-6 rounded-lg font-medium gap-2 transition-all ${
            isReady 
              ? "bg-red-800 hover:bg-red-900 text-white" 
              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          {isReady ? (
            <>
              Использовать
              <Play className="w-4 h-4" />
            </>
          ) : (
            <>
              В разработке
              <Construction className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Description */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800 uppercase tracking-tight">
                Назначение агента
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {agent.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {agent.features.map((feature: string) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-transparent hover:border-slate-100 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-red-800 mt-0.5 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Output example */}
          <Card className=" border-dashed border-slate-300 shadow-none">
            <CardHeader>
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Пример выходных данных
              </CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-[13px] text-slate-600 whitespace-pre-wrap leading-relaxed">
              {agent.mockResponse}
            </CardContent>
          </Card>
        </div>

        {/* Right: Meta */}
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Характеристики
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <Clock className="text-red-800 w-4 h-4" /> Отклик
                </span>
                <span className="font-bold text-slate-900">
                  ~0.4 сек / слово
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500 font-medium">
                  <FileText className="text-red-800 w-4 h-4" /> Тип отчета
                </span>
                <span className="font-bold text-slate-900">
                  {agent.name === "Web Researcher" ? "Аналитическая справка" : "Markdown Протокол"}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-red-100 bg-red-50/30 p-6 text-[13px] text-slate-600 leading-relaxed shadow-sm">
            <span className="font-bold text-red-900 block mb-1 uppercase text-[10px] tracking-wider">Важное примечание:</span>
            Агент оптимизирован для работы со сложными данными. Поддерживает редактирование результата и экспорт в Markdown после завершения генерации.
          </div>
        </div>
      </div>
    </div>
  );
}