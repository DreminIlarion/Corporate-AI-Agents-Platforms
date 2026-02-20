import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "./ui/utils";
import { MarkdownRenderer } from "./ui/markdownrender";
import { motion, AnimatePresence } from "framer-motion";
import { MeetingAnalytics } from "./MeetingAnalytics";

import {
  ArrowLeft,
  Upload,
  FileText,
  BarChart3,
  MessageSquare,
  Send,
  Paperclip,
  Mic,
  RotateCcw,
  Copy,
  Edit3,
  Eye,
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Info,
  FileSearch,
  Bot,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Download,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface Props {
  onBack: () => void;
}

const PROCESS_STEPS = [
  "Прием заявки",
  "Анализ данных",
  "Подготовка",
  "Обработка контента",
  "Формирование отчета"
];

const STATUS_MAP: { [key: string]: number } = {
  pending: 0,
  processing: 1,
  converting: 2,
  transcribing: 3,
  generating: 4,
  failed: -1,
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001"

function FileUpload({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium text-white   cursor-pointer border-1  border-slate-300 rounded-lg px-4 py-2.5 hover:bg-[#1c1c1c] hover:border-red-900 transition-colors duration-300 ease-in-out">
      <Upload className="w-4 h-4 text-red-700" />
      <span>Загрузить аудио/видео (.mp3, .wav, .m4a)</span>
      <input
        type="file"
        className="hidden"
        accept=".mp3,.wav,.m4a"
        onChange={(e) => e.target.files && onFileSelected(e.target.files[0])}
      />
    </label>
  );
}



export default function MeetingMinutesWorkspace({ onBack }: Props) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [doc, setDoc] = useState("");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [meetingInfo, setMeetingInfo] = useState<string | null>(null);
  const [minutesData, setMinutesData] = useState<any | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "analytics" | "minutes">("view");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [title, setTitle] = useState("");
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<"transcript" | "info" | "minutes" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('meetingWorkspace');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);

        // Сначала восстанавливаем все состояния
        setMeetingId(parsed.meetingId);
        setTaskId(parsed.taskId);
        setTranscript(parsed.transcript);
        setMeetingInfo(parsed.meetingInfo);
        setMinutesData(parsed.minutesData);
        setDoc(parsed.doc || "");
        setMode(parsed.mode || "view");
        setLastFetched(parsed.lastFetched);
        setMessages(parsed.messages || []);
        setTitle(parsed.title || "");
        setParticipants(parsed.participants || []);
        setStatus(parsed.status);
        setCurrentStep(parsed.currentStep || -1);
        setIsProcessing(parsed.isProcessing || false);
        setIsChatOpen(parsed.isChatOpen || false);

        if (parsed.isProcessing && parsed.taskId) {
          // Небольшая задержка чтобы состояние успело примениться
          setTimeout(() => {
            startPolling(parsed.taskId);
          }, 100);
        }

      } catch (e) {
        console.error("Ошибка загрузки:", e);
      }
    }
  }, []);

  // Автосохранение при изменениях
  useEffect(() => {
    const stateToSave = {
      meetingId,
      taskId,
      transcript,
      meetingInfo,
      minutesData,
      doc,
      mode,
      lastFetched,
      messages,
      title,
      participants,
      status,
      currentStep,
      isProcessing,
      isChatOpen,
    };
    localStorage.setItem('meetingWorkspace', JSON.stringify(stateToSave));
  }, [
    meetingId, taskId, transcript, meetingInfo, minutesData, doc, mode,
    lastFetched, messages, title, participants, status, currentStep,
    isProcessing, isChatOpen
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && /audio\//.test(file.type)) {
        handleFile(file);
      } else {
        setError("Неподдерживаемый формат. Только аудио/видео файлы.");
      }
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  const startPolling = (taskId: string) => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v2/tasks/${taskId}`);
        const data = await res.json();
        setStatus(data.status);
        const step = STATUS_MAP[data.status] ?? -1;
        setCurrentStep(step);

        if (data.status === "complete") {
          setIsProcessing(false);
          setShowResultScreen(true);
        } else if (data.status === "failed") {
          setError(data.error_message || "Ошибка");
          setIsProcessing(false);
        } else {
          pollIntervalRef.current = setTimeout(poll, 3000);
        }
      } catch (err) {
        setError("Ошибка polling");
        setIsProcessing(false);
      }
    };
    poll();
  };

  const fetchTranscript = async () => {
    if (!meetingId) return;
    if (transcript) {
      setDoc(transcript);
      setLastFetched("transcript");
      setMode("view");
      setShowResultScreen(false);
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v2/meetings/${meetingId}/transcript`);
      const data = await res.json();
      setTranscript(data.full_text);
      setDoc(data.full_text);
      setLastFetched("transcript");
    } catch (err) {
      console.error(err);
      setError("Ошибка получения транскрипта");
    } finally {
      setIsGenerating(false);
      setShowResultScreen(false);
    }
  };

  const fetchMeetingInfo = async () => {
    if (!meetingId) return;
    if (meetingInfo) {
      setDoc(meetingInfo);
      setLastFetched("info");
      setMode("view");
      setShowResultScreen(false);
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v2/meetings/${meetingId}`);
      const data = await res.json();
      const formattedInfo = `
| Параметр | Значение |
|----------|----------|
| Создано | ${new Date(data.created_at).toLocaleString('ru-RU')} |
| Оригинальное имя файла | ${data.original_filename} |
| Название | ${data.title || 'Не указано'} |
| Участники | ${data.participants || 'Не указаны'} |
| Размер (MB) | ${data.size_mb} |
| Длительность (сек) | ${data.duration} |
      `;
      setMeetingInfo(formattedInfo);
      setDoc(formattedInfo);
      setLastFetched("info");
    } catch (err) {
      console.error(err);
      setError("Ошибка получения информации");
    } finally {
      setIsGenerating(false);
      setShowResultScreen(false);
    }
  };

  const fetchMinutes = async () => {
    if (!meetingId) return;
    try {
      const response = await fetch(`${API_BASE}/api/v2/minutes/${meetingId}`);
      if (response.ok) {
        const data = await response.json();
        setMinutesData(data);
        setMode("minutes");
        setLastFetched("minutes");
      } else {
        setError("Протокол ещё не готов или произошла ошибка");
      }
    } catch (err) {
      console.error("Ошибка при получении протокола:", err);
      setError("Не удалось загрузить протокол");
    }
  };

  const downloadPDF = async () => {
    if (!meetingId) return;
    try {
      const response = await fetch(`${API_BASE}/api/v2/minutes/${meetingId}/download?extension=pdf`);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Протокол_${meetingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка при скачивании:", err);
      setError("Не удалось скачать протокол");
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    setMeetingId(null);
    setTaskId(null);
    setTranscript(null);
    setMeetingInfo(null);
    setMinutesData(null);
    setDoc("");
    setLastFetched(null);
    setShowResultScreen(false);
    setShowAdditionalForm(false);
    setIsProcessing(false);
    setCurrentStep(-1);
    setError(null);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/v2/meetings/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMeetingId(data.id);
      setShowAdditionalForm(true);
    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки файла");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddAdditionalInfo = async () => {
    if (!meetingId) return;
    try {
      const body = {
        title: title || null,
        participants: participants.join('; ') || null,
      };
      const res = await fetch(`${API_BASE}/api/v2/meetings/${meetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("PATCH failed");
      setShowAdditionalForm(false);
      createTask();
    } catch (err) {
      console.error(err);
      setError("Ошибка обновления информации");
    }
  };

  const handleSkipAdditional = () => {
    setShowAdditionalForm(false);
    createTask();
  };

  const createTask = async () => {
    if (!meetingId) return;
    setIsProcessing(true);
    setCurrentStep(0);
    setStartTime(Date.now());
    setDoc("");
    setTranscript(null);
    try {
      const res = await fetch(`${API_BASE}/api/v2/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_id: meetingId }),
      });
      if (!res.ok) throw new Error("Task creation failed");
      const data = await res.json();
      setTaskId(data.id);

      const savedState = JSON.parse(localStorage.getItem('meetingWorkspace') || '{}');
      localStorage.setItem('meetingWorkspace', JSON.stringify({
        ...savedState,
        taskId: data.id,
        isProcessing: true,
        currentStep: 0
      }));

      startPolling(data.id);
    } catch (err) {
      console.error(err);
      setError("Ошибка создания задачи");
      setIsProcessing(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Отлично, сейчас помогу! На основе записи встречи могу:\n• Сделать краткое резюме\n• Выделить задачи и дедлайны\n• Написать follow-up письмо\n• Составить протокол\n\nЧто именно нужно?",
        },
      ]);
    }, 900);
  };

  const addParticipant = () => {
    if (participantInput.trim()) {
      setParticipants((prev) => [...prev, participantInput.trim()]);
      setParticipantInput("");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };


  const cleanMarkdown = (text: string): string => {
    let cleaned = text.trim();
    if (cleaned.startsWith("```markdown")) {
      cleaned = cleaned.slice(11).trim();
    }
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3).trim();
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3).trim();
    }
    return cleaned;
  };


  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden" ref={dropRef}>
      <aside className="pl-1 w-96 bg-black text-gray-200 border-r border-gray-800/50 flex flex-col">
        <div className="p-3 bg-[#1c1c1c] text-gray-200 flex flex-col h-full">
          <div className="p-5 border-b border-gray-800/50 flex items-center justify-between">
            {isChatOpen ? (
              <Button
                variant="ghost"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/70 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Инструменты
              </Button>
            ) : (
              <span className="text-gray-200 font-medium"></span>
            )}

            {isChatOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMessages([])}
                className="text-gray-400 hover:text-white hover:bg-gray-800/70 rounded-lg transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            {isChatOpen ? (
              <div className="flex flex-col h-full bg-[#1c1c1c] text-gray-200">
                {/* Приветствие, пока чат пустой */}
                {messages.length === 0 ? (
                  <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-800 to-[#5A2A2A] flex items-center justify-center mb-6 shadow-lg shadow-red-900/20">
                        <Bot className="w-10 h-10 text-white" />
                      </div>

                      <h2 className="text-2xl font-semibold text-white mb-2">
                        Чем могу помочь?
                      </h2>
                      <p className="text-gray-400 mb-8 max-w-md">
                        Анализируй встречи, создавай резюме, генерируй протоколы и многое другое
                      </p>
                    </div>

                    {/* Поле ввода */}
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Напишите ваш запрос..."
                          className="
                      w-full bg-[#0B0E13] border border-gray-800 
                      rounded-xl px-5 py-4 text-white 
                      placeholder:text-gray-500 focus:outline-none 
                      focus:border-red-800 focus:ring-1 focus:ring-red-800/30
                      transition-all
                    "
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-red-800 transition-colors rounded-lg hover:bg-gray-800/50">
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-800 transition-colors rounded-lg hover:bg-gray-800/50">
                              <Mic className="w-4 h-4" />
                            </button>
                          </div>

                          <Button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim()}
                            className="
                        bg-red-800 hover:bg-[#6E3131] 
                        text-white rounded-lg px-5 py-2 font-medium
                        disabled:opacity-40 disabled:pointer-events-none
                        transition-all shadow-md hover:shadow-lg
                        flex items-center gap-2
                      "
                          >
                            Отправить
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Подсказки */}
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-1">
                        Попробуйте спросить
                      </h3>
                      <div className="space-y-2">
                        {[
                          "Сделай краткое резюме встречи",
                          "Выдели принятые решения",
                          "Какие задачи были назначены?",
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => setChatInput(suggestion)}
                            className="
                        w-full flex items-center justify-between 
                        bg-[#0B0E13] hover:bg-gray-800/50
                        border border-gray-800 hover:border-red-800/50
                        rounded-lg px-4 py-3 text-left transition-all
                        group
                      "
                          >
                            <span className="text-gray-300 group-hover:text-white text-sm">
                              {suggestion}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-red-800" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                      max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed
                      ${msg.role === "user"
                              ? "bg-red-800 text-white"
                              : "bg-gray-800/50 text-gray-200 border border-gray-700/50"}
                    `}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 p-2">
                <div>
                  <h2 className="text-lg font-semibold text-white">Рабочее пространство</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Загрузите запись для анализа
                  </p>
                </div>

                <div className="bg-slay-800 border border-gray-800/60 rounded-xl  transition-colors">
                  <FileUpload onFileSelected={handleFile} />
                </div>

                {error && (
                  <div className="p-3 bg-red-950/30 border border-red-900/30 rounded-lg text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                    Инструменты
                  </h3>

                  <div className="space-y-2">
                    <Button
                      disabled={!meetingId || isProcessing}
                      onClick={fetchTranscript}
                      className="
      w-full justify-start h-11 px-5 
      text-sm font-medium
      bg-white/10 hover:bg-white/15
      text-white border-0
      shadow-lg hover:shadow-xl
      rounded-xl
      transition-all duration-300
      backdrop-blur-sm
      border-l-4 border-l-white/80
      group
    "
                    >
                      <FileSearch className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                      Транскрибация
                    </Button>

                    <Button
                      disabled={!meetingId || isProcessing}
                      onClick={fetchMeetingInfo}
                      className="
      w-full justify-start h-11 px-5 
      text-sm font-medium
      bg-white/10 hover:bg-white/15
      text-white border-0
      shadow-lg hover:shadow-xl
      rounded-xl
      transition-all duration-300
      backdrop-blur-sm
      border-l-4 border-l-white/80
      group
    "
                    >
                      <Info className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                      Информация о записи
                    </Button>

                    <Button
                      disabled={!meetingId || isProcessing}
                      onClick={fetchMinutes}
                      className="
      w-full justify-start h-11 px-5 
      text-sm font-medium
      bg-white/10 hover:bg-white/15
      text-white border-0
      shadow-lg hover:shadow-xl
      rounded-xl
      transition-all duration-300
      backdrop-blur-sm
      border-l-4 border-l-white/80
      group
    "
                    >
                      <FileText className="w-4 h-4 mr-3 text-red-700 group-hover:text-red-600" />
                      Протокол встречи
                    </Button>

                    <div className="my-3 border-t border-white/10" />

                    <Button
                      onClick={() => setMode("analytics")}
                      className="
      w-full justify-start h-10 px-4 
      text-sm font-medium
      text-gray-300 
      bg-white/10 hover:bg-white/5
      border border-white/10 hover:border-white/20
      rounded-lg
      transition-all
    "
                    >
                      <BarChart3 className="w-4 h-4 mr-3 text-green-400" />
                      Аналитика
                    </Button>

                    <div className="my-2 border-t border-white/10" />

                    <Button
                      onClick={() => setIsChatOpen(true)}
                      className="
      w-full justify-start h-12 px-5 
      text-sm font-semibold
      bg-white/10 hover:bg-white/15
      backdrop-blur-md
      text-white
      border border-white/20 hover:border-white/30
      shadow-xl hover:shadow-2xl
      rounded-xl
      transition-all duration-300
      group
    "
                    >
                      <MessageSquare className="w-4 h-4 mr-3 text-white/70 group-hover:text-white" />
                      Обсудить с ассистентом
                    </Button>
                  </div>

                  {minutesData && (
                    <Button
                      onClick={downloadPDF}
                      className="
      w-full justify-start h-12 px-5 mt-4
      text-sm font-semibold
      bg-white/10 hover:bg-white/15
      backdrop-blur-md
      text-white
      border border-white/20 hover:border-white/30
      shadow-xl hover:shadow-2xl
      rounded-xl
      transition-all duration-300
      group
    "
                    >
                      <Download className="w-4 h-4 mr-3 text-white/70 group-hover:text-red-600 " />
                      Скачать протокол (PDF)
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-100 relative">
        {isDragging && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-lg flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-white/95 rounded-2xl p-12 shadow-2xl border border-slate-200 max-w-lg text-center">
              <Upload className="w-16 h-16 text-red-600 mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Отпустите файл здесь</h2>
              <p className="text-lg text-slate-600">Поддерживаются .mp3 • .wav • .m4a</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-lg flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-white/95 rounded-2xl p-12 shadow-2xl border border-slate-200 max-w-lg text-center">
              <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Файл загружается</h2>
              <p className="text-lg text-slate-600">Пожалуйста, подождите...</p>
            </div>
          </div>
        )}

        {showResultScreen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full  max-w-4xl"
            >
              <Card className="overflow-hidden border border-gray-800 shadow-2xl bg-[#1c1c1c]">
                <CardHeader className="text-center pb-2 pt-8">
                  <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-red-800 to-red-900 flex items-center justify-center mb-4 shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-white">
                    Обработка завершена
                  </CardTitle>
                  <p className="text-gray-400 mt-2">
                    Выберите, что хотите открыть
                  </p>
                </CardHeader>

                <CardContent className="grid grid-cols-3 gap-3 px-6 pb-8">
                  <Button
                    onClick={() => {
                      fetchTranscript();
                      setShowResultScreen(false);
                    }}
                    className="
              h-auto py-5 flex flex-col items-center gap-2
              bg-[#252525] hover:bg-[#2a2a2a]
              border border-gray-800 hover:border-red-800/50
              rounded-xl
              transition-all
            "
                  >
                    <FileSearch className="w-6 h-6 text-red-500" />
                    <span className="text-sm font-medium text-white">Транскрипт</span>
                    <span className="text-xs text-gray-500">полный текст</span>
                  </Button>

                  <Button
                    onClick={() => {
                      fetchMeetingInfo();
                      setShowResultScreen(false);
                    }}
                    className="
              h-auto py-5 flex flex-col items-center gap-2
              bg-[#252525] hover:bg-[#2a2a2a]
              border border-gray-800 hover:border-red-800/50
              rounded-xl
              transition-all
            "
                  >
                    <Info className="w-6 h-6 text-red-500" />
                    <span className="text-sm font-medium text-white">Информация</span>
                    <span className="text-xs text-gray-500">метаданные</span>
                  </Button>

                  <Button
                    onClick={() => {
                      fetchMinutes();
                      setShowResultScreen(false);
                    }}
                    className="
              h-auto py-5 flex flex-col items-center gap-2
              bg-[#252525] hover:bg-[#2a2a2a]
              border border-gray-800 hover:border-red-800/50
              rounded-xl
              transition-all
            "
                  >
                    <FileText className="w-6 h-6 text-red-500" />
                    <span className="text-sm font-medium text-white">Протокол</span>
                    <span className="text-xs text-gray-500">отчёт</span>
                  </Button>
                </CardContent>

                <div className="px-6 pb-6 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResultScreen(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Закрыть
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-200">
                {mode === "analytics" ? (
                  <BarChart3 className="w-5 h-5 text-red-700" />
                ) : mode === "minutes" ? (
                  <FileText className="w-5 h-5 text-red-700" />
                ) : (
                  <FileText className="w-5 h-5 text-red-700" />
                )}
              </div>
              <span className="text-lg font-semibold text-slate-800">
                {mode === "analytics" ? "Аналитика" : mode === "minutes" ? "Протокол встречи" : mode === "view" ? "Транскрибация" : "Документ"}
              </span>
            </div>

            {doc && mode !== "analytics" && mode !== "minutes" && (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-red-800">
                  <Copy className="w-4 h-4 mr-2" /> Копировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMode(m => m === "view" ? "edit" : "view")}
                >
                  {mode === "view" ? (
                    <><Edit3 className="w-4 h-4 mr-2" /> Редактировать</>
                  ) : (
                    <><Eye className="w-4 h-4 mr-2" /> Просмотр</>
                  )}
                </Button>
              </div>
            )}


          </div>

          {mode === "analytics" ? (
            <MeetingAnalytics />
          ) : mode === "minutes" ? (
            minutesData ? (
              <div className="bg-[#f5f5f5] p-6 space-y-6">
                <div className="rounded-t-2xl p-6 border-b border-slate-200 m-0 flex items-center justify-between bg-slate-300">
                  <h2 className="text-xl text-black">
                    Дата загрузки: {new Date(minutesData.created_at).toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' })}
                  </h2>
                  <Button
                    onClick={downloadPDF}
                    className="bg-white/50 hover:bg-slate-200/50 text-black border border-black shadow-md flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Скачать PDF
                  </Button>
                </div>
                {(() => {
                  const text = cleanMarkdown(minutesData.md_text);
                  const lines = text.split('\n');

                  const lineHeight = 24;
                  const padding = 32;
                  const availableHeight = 1000 - padding;
                  const linesPerPage = Math.floor(availableHeight / lineHeight);

                  const pages = [];

                  // Функция для проверки, является ли строка частью таблицы
                  const isTableLine = (line: string): boolean => {
                    return line.includes('|') && (line.trim().startsWith('|') || line.includes('---'));
                  };

                  // Функция для проверки, содержит ли блок таблицу
                  const containsTable = (blockLines: string[]): boolean => {
                    let inTable = false;
                    for (const line of blockLines) {
                      if (isTableLine(line)) {
                        inTable = true;
                      } else if (inTable && line.trim() === '') {
                        inTable = false;
                      }
                    }
                    return inTable;
                  };

                  // Умное разбиение на страницы
                  let i = 0;
                  while (i < lines.length) {
                    let end = Math.min(i + linesPerPage, lines.length);
                    let candidateLines = lines.slice(i, end);

                    // Проверяем, не разрывает ли текущий блок таблицу
                    if (containsTable(candidateLines)) {
                      // Ищем начало таблицы в этом блоке
                      let tableStart = -1;
                      for (let j = 0; j < candidateLines.length; j++) {
                        if (isTableLine(candidateLines[j])) {
                          tableStart = j;
                          break;
                        }
                      }

                      if (tableStart > 0) {
                        // Если таблица начинается не с первой строки — обрезаем до таблицы
                        end = i + tableStart;
                        if (end === i) end++; // Минимум 1 строка
                      } else {
                        // Если таблица начинается с первой строки, проверяем конец таблицы
                        let tableEnd = tableStart;
                        while (tableEnd < candidateLines.length &&
                          (isTableLine(candidateLines[tableEnd]) || candidateLines[tableEnd].trim() === '')) {
                          tableEnd++;
                        }

                        // Если таблица не помещается целиком — оставляем её на этой странице
                        if (tableEnd < candidateLines.length) {
                          end = i + tableEnd;
                        }
                      }
                    }

                    // Добавляем страницу
                    pages.push(lines.slice(i, end).join('\n'));
                    i = end;
                  }

                  return pages.map((pageText, index, arr) => (
                    <div key={index}>
                      <div className="bg-white shadow-md border border-slate-300 overflow-hidden p-8 prose prose-slate max-w-none">
                        <MarkdownRenderer content={pageText} />
                      </div>

                      {index < arr.length - 1 && (
                        <div className="relative py-4 text-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-dashed border-slate-400" />
                          </div>
                          <span className="relative px-4 bg-[#f5f5f5] text-xs text-black">
                            {index + 1} / {arr.length}
                          </span>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
                <Loader2 className="w-16 h-16 animate-spin mb-6 text-red-700" />
                <h3 className="text-xl font-medium text-slate-700">Формируем протокол...</h3>
                <p className="text-slate-500 mt-2">Это может занять 30–90 секунд</p>
              </div>
            )
          ) : doc ? (
            mode === "view" ? (
              lastFetched === "transcript" ? (
                <div className="min-h-[1000px] bg-white shadow-lg border border-gray-100 overflow-hidden">

                  {/* Контент */}
                  <div className="overflow-y-auto p-8 space-y-5">
                    {doc.split('\n').filter(line => line.trim()).map((line, i, arr) => (
                      <div key={i}>
                        <p className="text-[19.5px] font-normal leading-7 text-gray-800 font-['Inter',_system-ui,_sans-serif] antialiased">
                          {line}
                        </p>
                        {i < arr.length - 1 && (
                          <div className="my-4 border-t border-gray-200/90" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white min-h-[1000px] shadow border p-8 prose prose-slate max-w-none">
                  <h2 className="text-4xl text-center  text-slate-700 mb-4">
                    Информация о записи
                  </h2>
                  <div className="text-3xl">
                    <MarkdownRenderer content={doc} />
                  </div>
                </div>
              )
            ) : (
              <textarea
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                className="w-full h-[80vh] text-base font-serif outline-none resize-none leading-relaxed text-slate-800 bg-white p-8 rounded-xl border shadow-sm"
              />
            )
          ) : (
            <div className="h-[75vh] flex items-center justify-center p-4">
              <div
                className={cn(
                  "w-full max-w-2xl aspect-[16/9] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-12",
                  isDragging
                    ? "border-red-600 bg-red-50/50 scale-105"
                    : "border-slate-300 bg-white hover:border-red-400 hover:bg-slate-50/50 shadow-sm"
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer?.files?.[0];
                  if (file) handleFile(file);
                }}
                onClick={() => document.getElementById('central-upload')?.click()}
              >
                <input
                  id="central-upload"
                  type="file"
                  className="hidden"
                  accept=".mp3,.wav,.m4a"
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                />

                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-red-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Выберите файл для расшифровки
                </h2>

                <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
                  Перетащите аудиозапись встречи сюда или нажмите, чтобы выбрать на компьютере
                </p>

                <div className="flex gap-4 items-center bg-slate-100/50 px-4 py-2 rounded-full">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-red-800 text-white flex items-center justify-center text-[10px] font-bold">MP3</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-red-700 text-white flex items-center justify-center text-[10px] font-bold">WAV</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">MP4</div>
                  </div>
                  <span className="text-sm text-slate-500 font-medium italic">Поддерживаются аудио и видео записи</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                width: isMinimized ? "240px" : "360px"
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed bottom-10 right-10 z-[100] transition-all duration-500 ease-in-out"
            >
              <div className="relative overflow-hidden rounded-[24px] border border-white bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all duration-500">

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="absolute top-4 right-4 z-20 w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                >
                  {isMinimized ? <ChevronUp className="w-3 h-3 text-slate-600" /> : <ChevronDown className="w-3 h-3 text-slate-600" />}
                </button>

                <div className={cn("transition-all duration-500", isMinimized ? "p-4" : "p-8")}>

                  {isMinimized ? (
                    <div className="flex items-center justify-between pr-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Loader2 className="w-5 h-5 text-red-800 animate-spin" />
                          <div className="absolute inset-0 rounded-full border-2 border-red-800/30 animate-ping" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-900">Анализ...</span>
                      </div>
                      <span className="text-sm font-light text-red-800 tabular-nums">
                        {Math.round(((currentStep + 1) / PROCESS_STEPS.length) * 100)}%
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Loader2 className="w-10 h-10 text-red-800 animate-spin" />
                            <div className="absolute inset-0 rounded-full border-4 border-red-800/20 animate-ping-slow" />
                          </div>
                          <div className="space-y-1 text-left">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                              Анализ встречи
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              Это займёт около минуты
                            </p>
                          </div>
                        </div>
                        <div className="text-4xl font-light text-red-800 tabular-nums leading-none tracking-tighter">
                          {Math.round(((currentStep + 1) / PROCESS_STEPS.length) * 100)}%
                        </div>
                      </div>

                      <div className="space-y-6 relative">
                        <div className="absolute left-[9px] top-2 bottom-2 w-[1.5px] bg-slate-200/50" />
                        {PROCESS_STEPS.map((step, i) => {
                          const isCompleted = currentStep > i;
                          const isCurrent = currentStep === i;
                          return (
                            <div key={step} className="flex items-start gap-4 relative z-10 text-left">
                              <div className={cn(
                                "w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-500",
                                isCompleted ? "bg-green-800 border-black shadow-sm" :
                                  isCurrent ? "bg-white border-red-800 animate-pulse" : "bg-white border-slate-300"
                              )}>
                                {isCompleted ? (
                                  <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                ) : isCurrent ? (
                                  <Loader2 className="w-4 h-4 text-red-800 animate-spin" />
                                ) : null}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className={cn(
                                  "text-[13px] font-semibold transition-colors duration-300",
                                  isCurrent ? "text-slate-900" :
                                    isCompleted ? "text-slate-400" : "text-slate-300"
                                )}>
                                  {step}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className={cn("h-1 w-full bg-slate-200/30 rounded-full overflow-hidden", isMinimized ? "mt-3" : "mt-8")}>
                    <motion.div
                      className="h-full bg-red-800"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((currentStep + 1) / PROCESS_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>

              {/* Подсказка (только в развёрнутом виде) */}
              {!isMinimized && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-[11px] text-slate-400 font-medium px-10 leading-relaxed"
                >
                  Вы можете продолжать работу, результат появится автоматически
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Дополнительная информация при загрузке */}
      <Dialog open={showAdditionalForm} onOpenChange={(open) => {
        setShowAdditionalForm(open);
        if (!open) handleSkipAdditional();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить информацию?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Название</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participants" className="text-right">Участники (Enter)</Label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {participants.map((p, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      {p}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeParticipant(i)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="participants"
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    placeholder="Введите имя"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addParticipant();
                      }
                    }}
                  />
                  <Button onClick={addParticipant} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkipAdditional}>
              Пропустить
            </Button>
            <Button onClick={handleAddAdditionalInfo} className="bg-red-800 text-white hover:bg-red-900">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}