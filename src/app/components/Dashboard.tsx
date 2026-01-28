import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity, ArrowUpRight, Search, MousePointer2, BarChart3, Clock,Bot } from 'lucide-react';

// Данные как в Метрике: 
const seoPerformanceData = [
  { name: '22 янв', visitors: 2400, visits: 3100 },
  { name: '23 янв', visitors: 3100, visits: 4200 },
  { name: '24 янв', visitors: 2800, visits: 3800 },
  { name: '25 янв', visitors: 3500, visits: 4900 },
  { name: '26 янв', visitors: 4200, visits: 5800 },
  { name: '27 янв', visitors: 2100, visits: 2900 },
  { name: '28 янв', visitors: 1800, visits: 2400 },
];

// Улучшенный Топ запросов (
const topQueries = [
  { term: 'Автоматизация 1С Тюмень', clicks: 1240, impressions: 15400, ctr: 8.1, pos: 1.2 },
  { term: 'Внедрение ERP', clicks: 890, impressions: 12100, ctr: 7.3, pos: 2.4 },
  { term: 'Сопровождене 1С программ', clicks: 560, impressions: 8900, ctr: 6.2, pos: 3.1 },
  { term: 'Топ IT компарий Тюмени', clicks: 430, impressions: 4100, ctr: 10.4, pos: 1.5 },
];

const agents = [
  { id: 1, name: 'SEO Продвижение', category: 'Маркетинг', status: 'active', tasks: 1247, successRate: 96.5, model: 'GPT-4o', color: 'from-red-500 to-red-600' },
  { id: 2, name: 'SMM Маркетолог', category: 'Маркетинг', status: 'active', tasks: 892, successRate: 98.2, model: 'Claude 3.5 Sonnet', color: 'from-red-600 to-red-700' },
  { id: 3, name: 'Web Researcher', category: 'Исследования', status: 'training', tasks: 654, successRate: 94.1, model: 'GPT-4', color: 'from-slate-400 to-slate-500' },
  { id: 4, name: 'Протоколы Совещаний', category: 'Автоматизация', status: 'active', tasks: 523, successRate: 97.8, model: 'Claude 3 Opus', color: 'from-red-800 to-red-900' },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6  ">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-[13px] font-medium text-slate-500">Визиты</CardTitle>
            <BarChart3 className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">45 230</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-1 rounded">+18,2%</span>
              <span className="text-[11px] text-slate-400">за 7 дней</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-[13px] font-medium text-slate-500">Отказы</CardTitle>
            <Activity className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">14,2%</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-1 rounded">-2,1%</span>
              <span className="text-[11px] text-slate-400">лучше среднего</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-[13px] font-medium text-slate-500">Глубина просмотра</CardTitle>
            <TrendingUp className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">2,8</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-1 rounded">+0,4</span>
              <span className="text-[11px] text-slate-400">стр. за сессию</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-[13px] font-medium text-slate-500">Время на сайте</CardTitle>
            <Clock className="w-4 h-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">3:45</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-1 rounded">+22с</span>
              <span className="text-[11px] text-slate-400">динамика</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* График: Визиты и Посетители */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Посещаемость</CardTitle>
            <CardDescription className="text-xs text-slate-400">Детализация по дням: визиты и уникальные пользователи</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seoPerformanceData}>
                  <defs>
                    <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#999'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#999'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Area name="Визиты" type="monotone" dataKey="visits" stroke="#ef4444" strokeWidth={3} fill="url(#fillVisits)" />
                  <Area name="Посетители" type="monotone" dataKey="visitors" stroke="#333" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/*  Топ запросов  */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Поисковые запросы</CardTitle>
            <CardDescription className="text-xs text-slate-400">Топ фраз по кликам и поиску</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topQueries.map((q, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-medium text-slate-700 group-hover:text-red-600 transition-colors truncate pr-2">
                      {q.term}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold h-4 px-1 border-slate-100 text-slate-400">
                      Поз. {q.pos}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><MousePointer2 className="w-3 h-3" /> {q.clicks}</span>
                    <span className="flex items-center gap-1"><Search className="w-3 h-3" /> {q.impressions.toLocaleString()}</span>
                    Поисковых запросов<span className="text-green-500 font-bold"> {q.ctr}%</span>
                  </div>
                  <Progress value={(q.clicks / topQueries[0].clicks) * 100} className="h-[2px] mt-2 bg-slate-50" />
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs font-bold text-slate-500 h-9 mt-2 border-slate-100 hover:bg-slate-50">
                Остальные запросы
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список ботов */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-800">Статус AI Ассистентов</CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Система активна</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 bg-[#fafafa] hover:border-red-100 transition-all">
                <div className="w-12 h-12 bg-gradient-to-tr from-red-800 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-[14px] text-slate-800">{agent.name}</h3>
                    <Badge className="bg-white text-[9px] text-slate-400 border-slate-100 h-4">{agent.model}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-medium">
                    <span className="text-slate-400 tracking-tight">{agent.tasks} задач</span>
                    <span className="text-green-600 bg-green-50 px-1 rounded">{agent.successRate}% точность</span>
                  </div>
                </div>

                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-red-500 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}