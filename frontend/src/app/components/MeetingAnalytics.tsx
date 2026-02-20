// src/app/components/MeetingAnalytics.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
} from 'recharts';
import { TrendingUp, Target, Clock, MessageSquare, Bot, ListChecks, Sparkles, FileText } from 'lucide-react';

// Данные
const keyMetrics = [
  { title: 'Обработано текста', value: '4 820 слов', icon: FileText },
  { title: 'Выявлено задач', value: '8', icon: ListChecks },
  { title: 'Ключевых решений', value: '5', icon: Sparkles },
  { title: 'Ответов ИИ-бота', value: '12', icon: Bot },
];

const discussionDynamics = [
  { time: '10:00', engagement: 30, tension: 20, decisions: 1 },
  { time: '10:15', engagement: 85, tension: 65, decisions: 2 },
  { time: '10:30', engagement: 45, tension: 30, decisions: 1 },
  { time: '10:45', engagement: 60, tension: 25, decisions: 3 },
];

const timeByDepartment = [
  { department: 'Маркетинг', minutes: 22, percent: 41 },
  { department: 'Финансы', minutes: 45, percent: 28 },
  { department: 'Продукт', minutes: 32, percent: 22 },
  { department: 'HR/Ops', minutes: 35, percent: 29 },
];

const sentimentData = [
  { name: 'Позитив', value: 65 },
  { name: 'Нейтрально', value: 25 },
  { name: 'Споры/негатив', value: 10 },
];

const radarData = [
  { metric: 'Вовлечённость', value: 94 },
  { metric: 'Эффективность', value: 90 },
  { metric: 'Конфликтность', value: 10 },
  { metric: 'Решения', value: 6 },
  { metric: 'Креативность', value: 70 },
  { metric: 'Фокус', value: 85 },
];

const scatterData = [
  { x: 10, y: 30, z: 200 },
  { x: 15, y: 85, z: 400 },
  { x: 30, y: 45, z: 300 },
  { x: 45, y: 60, z: 500 },
];

const COLORS = ['#22c55e', '#94a3b8', '#ef4444']; // Определён здесь — ошибка исчезнет

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow rounded-md px-4 py-3 text-sm">
        <p className="text-xs text-slate-500 mb-1">{label || 'Значение'}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MeetingAnalytics() {
  return (
    <div className="space-y-12  min-h-screen">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Анализ совещания от ИИ-бота
        </h1>
        <p className="text-slate-600 text-lg">
          Запуск рекламной кампании • 12 февраля 2026 • 45 минут
        </p>
      </div>

      {/* Метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {keyMetrics.map((metric, i) => (
          <Card key={i} className="border border-slate-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <metric.icon className="w-8 h-8 mx-auto mb-3 text-slate-600" />
              <p className="text-3xl font-bold text-slate-900 mb-1">{metric.value}</p>
              <p className="text-sm text-slate-600">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Большой ComposedChart */}
      <Card className="border border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Динамика ключевых показателей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={discussionDynamics} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 14, fill: '#475569' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 14, fill: '#475569' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, color: '#475569' }} />
              <Bar dataKey="tension" barSize={35} fill="#ef4444" name="Напряжённость" radius={[4, 4, 0, 0]} /> {/* Красный только здесь */}
              <Line type="monotone" dataKey="engagement" stroke="#475569" strokeWidth={3} dot={{ r: 6 }} name="Вовлечённость" />
              <Line type="monotone" dataKey="decisions" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 5 }} name="Решения" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Разнообразные большие графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BarChart */}
        <Card className="border border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Время по отделам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={timeByDepartment} margin={{ top: 20, right: 30, left: 100, bottom: 20 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: '#475569' }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" fill="#475569" name="Минуты" barSize={40} radius={[0, 4, 4, 0]} />
                <Bar dataKey="percent" fill="#cbd5e1" name="Процент" barSize={40} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PieChart */}
        <Card className="border border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Тональность обсуждения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={140}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // Красный только для негатива
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar + Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Комплексный анализ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 14, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Radar name="Показатели" dataKey="value" stroke="#475569" fill="#e2e8f0" fillOpacity={0.6} />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Корреляция показателей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={420}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="x" name="Время" unit=" мин" tick={{ fontSize: 12 }} />
                <YAxis dataKey="y" name="Уровень" unit="%" tick={{ fontSize: 12 }} />
                <ZAxis dataKey="z" range={[100, 600]} name="Размер" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Legend />
                <Scatter name="Показатели" data={scatterData} fill="#475569" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}