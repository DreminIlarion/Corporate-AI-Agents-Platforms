import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from './ui/dialog';
import { 
  Bot, Search, Plus, Play, Settings, MoreVertical, 
  Zap, Clock, CheckCircle2
} from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'SEO Продвижение',
    description: 'Автоматизированный анализ и оптимизация сайтов для поисковых систем. Подбирает ключевые слова, составляет семантическое ядро и отслеживает позиции в реальном времени.',
    category: 'Маркетинг',
    status: 'active',
    uptime: 99.8,
    tasks: 1247,
    successRate: 96.5,
    avgResponseTime: '1.2 сек',
    lastActive: '2 мин. назад',
    model: 'GPT-4o',
    icon: '📈',
    color: 'success'
  },
  {
    id: 2,
    name: 'SMM Маркетолог',
    description: 'Создает контент-стратегии для социальных сетей, генерирует посты и анализирует вовлеченность аудитории. Автоматически публикует контент по расписанию.',
    category: 'Маркетинг',
    status: 'active',
    uptime: 99.9,
    tasks: 892,
    successRate: 98.2,
    avgResponseTime: '3.4 сек',
    lastActive: '5 мин. назад',
    model: 'Claude 3.5 Sonnet',
    icon: '🤳',
    color: 'primary'
  },
  {
    id: 3,
    name: 'Web Researcher',
    description: 'Проводит глубокий анализ конкурентов и рыночных тенденций. Собирает и структурирует данные из открытых источников для стратегических решений.',
    category: 'Исследования',
    status: 'training',
    uptime: 87.3,
    tasks: 654,
    successRate: 94.1,
    avgResponseTime: '5.8 сек',
    lastActive: '12 мин. назад',
    model: 'GPT-4',
    icon: '🔍',
    color: 'warning'
  },
  {
    id: 4,
    name: 'Протоколы Совещаний',
    description: 'Автоматически фиксирует ключевые решения, action items и назначает ответственных. Формирует структурированные отчеты по итогам встреч.',
    category: 'Автоматизация',
    status: 'active',
    uptime: 98.5,
    tasks: 523,
    successRate: 97.8,
    avgResponseTime: '2.1 сек',
    lastActive: '1 мин. назад',
    model: 'Claude 3 Opus',
    icon: '📝',
    color: 'info'
  },
];

export function AgentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || agent.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-white p-6 space-y-6 text-slate-900">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Ассистенты</h1>
          <p className="text-sm text-slate-500 mt-1">Управление и мониторинг ваших нейросетевых помощников</p>
        </div>
        <Button className="gap-2 bg-red-700 hover:bg-red-800 text-white transition-colors">
          <Plus className="w-4 h-4" />
          Создать агента
        </Button>
      </div>

      {/* Фильтры */}
      <Card className="border-slate-100 shadow-sm bg-slate-50/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Поиск агентов..." 
                className="pl-10 bg-white border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-slate-200">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активен</SelectItem>
                <SelectItem value="training">Обучение</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-slate-200">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="маркетинг">Маркетинг</SelectItem>
                <SelectItem value="исследования">Исследования</SelectItem>
                <SelectItem value="автоматизация">Автоматизация</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Основной контент */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="grid">Сетка</TabsTrigger>
          <TabsTrigger value="list">Список</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-tr from-red-800 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">{agent.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-[10px] uppercase font-bold tracking-wider">{agent.category}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-700">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="mt-3 line-clamp-2 text-slate-600">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Точность</span>
                      <span className="text-green-700">{agent.successRate}%</span>
                    </div>
                    <Progress value={agent.successRate} className="h-1.5 bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-1">
                      <div className="text-slate-600 flex items-center gap-1 text-xs font-semibold">
                        <Zap className="w-3 h-3" /> Задачи
                      </div>
                      <div className="font-bold flex items-center gap-1">{agent.tasks}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Статус</span>
                      <div className="flex items-center gap-1 font-bold text-xs ">
                        {agent.status === 'active' ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="text-amber-500 flex items-center gap-1">
                            <Clock size={12} /> Sleep
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                    <Button 
                      onClick={() => setSelectedAgent(agent)}
                      className="flex-1 bg-slate-900 hover:bg-red-700 text-white transition-colors h-9"
                    >
                      Подробнее
                    </Button>
                    <Button variant="outline" size="icon" className="border-slate-200 h-9 w-9">
                      <Settings className="w-4 h-4 text-slate-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Рабочий Список */}
        <TabsContent value="list" className="mt-6">
          <Card className="border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500">Ассистент</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500">Категория</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500">Статус</th>
                    <th className="p-4 text-xs font-bold uppercase text-slate-500">Точность</th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center text-white">
                            <Bot size={16} />
                          </div>
                          <span className="font-bold text-sm">{agent.name}</span>
                        </div>
                      </td>
                      <td className="p-4 italic text-sm text-slate-500">{agent.category}</td>
                      <td className="p-4 text-xs">
                        {agent.status === 'active' ? (
                          <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Active</span>
                        ) : (
                          <span className="text-amber-500 font-bold flex items-center gap-1"><Clock size={12}/> Sleep</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <Progress value={agent.successRate} className="w-12 h-1" />
                           <span className="text-xs font-bold">{agent.successRate}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(agent)} className="hover:text-red-700">
                          Детали
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-[2rem] outline-none">
          {selectedAgent && (
            <>
              <DialogHeader className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-700 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-red-100">
                  <Bot size={40} className="text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedAgent.name}</DialogTitle>
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-none px-4 py-1 mt-1">
                  {selectedAgent.category}
                </Badge>
              </DialogHeader>

              <div className="space-y-6 py-4 text-slate-700">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest text-center md:text-left">Описание</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{selectedAgent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Модель</span>
                    <div className="font-bold text-sm mt-1">{selectedAgent.model}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Отклик</span>
                    <div className="font-bold text-sm mt-1">{selectedAgent.avgResponseTime}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-red-700 hover:bg-red-800 text-white rounded-xl h-11 font-bold shadow-lg shadow-red-50 transition-all">
                    <Play size={16} className="mr-2 fill-current" /> Запустить
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl border-slate-200 h-11 font-bold text-slate-500" onClick={() => setSelectedAgent(null)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}