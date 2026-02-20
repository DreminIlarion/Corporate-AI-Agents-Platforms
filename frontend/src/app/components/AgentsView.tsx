import React, { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import AgentWorkspace from './AgentWorkspace'
import { RenderWorkspace } from './WorkspaceSocializer'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import {
  Bot,
  Search,
  Plus,
  Settings,
  MoreVertical,
  Zap,
  Clock,
  CheckCircle2,
  Rocket,
} from 'lucide-react'

// ──── Types ────

type AgentStatus = 'active' | 'training'

type Category = 'Маркетинг' | 'Исследования' | 'Автоматизация'

interface Agent {
  id: number
  name: string
  description: string
  category: Category
  status: AgentStatus
  uptime: number
  tasks: number
  successRate: number
  avgResponseTime: string
  lastActive: string
  model: string
  icon: string
  color: string
}

// ──── Data ────

const AGENTS: Agent[] = [
  {
    id: 1,
    name: 'SEO Продвижение',
    description:
      'Автоматизированный анализ и оптимизация сайтов для поисковых систем.',
    category: 'Маркетинг',
    status: 'active',
    uptime: 99.8,
    tasks: 1247,
    successRate: 96.5,
    avgResponseTime: '1.2 сек',
    lastActive: '2 мин. назад',
    model: 'GPT-4o',
    icon: '📈',
    color: 'success',
  },
  {
    id: 2,
    name: 'SMM Маркетолог',
    description:
      'Создает контент-стратегии для социальных сетей и анализирует вовлеченность.',
    category: 'Маркетинг',
    status: 'active',
    uptime: 99.9,
    tasks: 892,
    successRate: 98.2,
    avgResponseTime: '3.4 сек',
    lastActive: '5 мин. назад',
    model: 'Claude 3.5 Sonnet',
    icon: '🤳',
    color: 'primary',
  },
  {
    id: 3,
    name: 'Web Researcher',
    description:
      'Проводит глубокий анализ конкурентов и рыночных тенденций.',
    category: 'Исследования',
    status: 'training',
    uptime: 87.3,
    tasks: 654,
    successRate: 94.1,
    avgResponseTime: '5.8 сек',
    lastActive: '12 мин. назад',
    model: 'GPT-4',
    icon: '🔍',
    color: 'warning',
  },
  {
    id: 4,
    name: 'Протоколы совещаний',
    description:
      'Фиксирует ключевые решения и формирует структурированные отчеты.',
    category: 'Автоматизация',
    status: 'active',
    uptime: 98.5,
    tasks: 523,
    successRate: 97.8,
    avgResponseTime: '2.1 сек',
    lastActive: '1 мин. назад',
    model: 'Claude 3 Opus',
    icon: '📝',
    color: 'info',
  },
]

// ──── Hooks ────

const useAgentsFilter = (
  agents: Agent[],
  search: string,
  status: string,
  category: string
) =>
  useMemo(() => {
    const q = search.toLowerCase()
    return agents.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(q)
      const matchesStatus = status === 'all' || a.status === status
      const matchesCategory =
        category === 'all' || a.category.toLowerCase() === category
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [agents, search, status, category])

// ──── AnimatedCard ────

const AnimatedCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <motion.div whileHover={{ y: -4 }}>{children}</motion.div>
)

// ──── FiltersBar ────

interface FiltersBarProps {
  search: string
  status: string
  category: string
  onSearch: (v: string) => void
  onStatus: (v: string) => void
  onCategory: (v: string) => void
}

const FiltersBar = memo(
  ({ search, status, category, onSearch, onStatus, onCategory }: FiltersBarProps) => (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              aria-label="Поиск агентов"
              placeholder="Поиск агентов..."
              className="pl-10"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <Select value={status} onValueChange={onStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="training">Обучение</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={onCategory}>
            <SelectTrigger className="w-full md:w-48">
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
  )
)

// ──── StatusBadge ────

const StatusBadge = memo(({ status }: { status: AgentStatus }) =>
  status === 'active' ? (
    <span className="text-emerald-600 flex items-center gap-1 text-xs font-semibold">
      <CheckCircle2 size={12} /> Активен
    </span>
  ) : (
    <span className="text-amber-500 flex items-center gap-1 text-xs font-semibold">
      <Clock size={12} /> Обучение
    </span>
  )
)

// ──── AgentGridCard ────

interface AgentCardProps {
  agent: Agent
  onOpen: (a: Agent) => void
}

const AgentGridCard = memo(({ agent, onOpen }: AgentCardProps) => (
  <AnimatedCard>
    <Card className="flex flex-col gap-6 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-500 rounded-2xl flex items-center justify-center shadow">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {agent.name}
              </CardTitle>
              <Badge variant="secondary" className="mt-1 text-[10px]">
                {agent.category}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription className="mt-3 line-clamp-2">
          {agent.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Точность</span>
            <span className="text-emerald-600">
              {agent.successRate}%
            </span>
          </div>
          <Progress value={agent.successRate} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
              <Zap className="w-3 h-3" /> Задачи
            </div>
            <div className="font-semibold">{agent.tasks}</div>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        <div className="pt-4 border-t flex gap-2">
          <Button
            onClick={() => onOpen(agent)}
            className="flex-1 bg-slate-900 hover:bg-red-700 text-white"
          >
            Подробнее
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </AnimatedCard>
))

// ──── AgentsGrid ────

const AgentsGrid = memo(
  ({ agents, onOpen }: { agents: Agent[]; onOpen: (a: Agent) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((a) => (
        <AgentGridCard key={a.id} agent={a} onOpen={onOpen} />
      ))}
    </div>
  )
)

// ──── AgentsTable ────

const AgentsTable = memo(
  ({ agents, onOpen }: { agents: Agent[]; onOpen: (a: Agent) => void }) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="p-4 text-xs font-semibold uppercase">Ассистент</th>
              <th className="p-4 text-xs font-semibold uppercase">Категория</th>
              <th className="p-4 text-xs font-semibold uppercase">Статус</th>
              <th className="p-4 text-xs font-semibold uppercase">Точность</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {agents.map((a) => (
              <tr key={a.id} className="hover:bg-muted/40 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center text-white">
                      <Bot size={16} />
                    </div>
                    <span className="font-semibold text-sm">{a.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {a.category}
                </td>
                <td className="p-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Progress value={a.successRate} className="w-16 h-1" />
                    <span className="text-xs font-semibold">
                      {a.successRate}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onOpen(a)}>
                    Детали
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
)

// ──── AgentDialog ────

interface AgentDialogProps {
  agent: Agent | null
  onClose: () => void
  onStart: () => void
}

const AgentDialog = memo(({ agent, onClose, onStart }: AgentDialogProps) => (
  <Dialog open={!!agent} onOpenChange={onClose}>
    <DialogContent className="max-w-md rounded-3xl">
      {agent && (
        <>
          <DialogHeader className="items-center text-center">
            <div className="w-20 h-20 bg-red-700 rounded-3xl flex items-center justify-center mb-4 shadow">
              <Bot size={40} className="text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold">
              {agent.name}
            </DialogTitle>
            <Badge className="mt-1">{agent.category}</Badge>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {agent.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/40 rounded-xl p-3">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                  Модель
                </span>
                <div className="font-semibold text-sm mt-1">
                  {agent.model}
                </div>
              </div>
              <div className="bg-muted/40 rounded-xl p-3">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                  Отклик
                </span>
                <div className="font-semibold text-sm mt-1">
                  {agent.avgResponseTime}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onStart}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white h-11"
              >
                <Rocket size={16} className="mr-2" /> Использовать
              </Button>
              <Button variant="outline" className="flex-1 h-11" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
))

// ──── Header ────

const Header = memo(() => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        AI ассистенты
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Управление и мониторинг ваших помощников
      </p>
    </div>
    <Button className="gap-2 bg-red-700 hover:bg-red-800 text-white">
      <Plus className="w-4 h-4" /> Создать агента
    </Button>
  </div>
))

// ──── Main View ────

const AgentsMain = ({ agents, onOpen }: { agents: Agent[]; onOpen: (a: Agent) => void }) => (
  <>
    <Tabs defaultValue="grid" className="w-full">
      <TabsList className="p-1">
        <TabsTrigger value="grid">Сетка</TabsTrigger>
        <TabsTrigger value="list">Список</TabsTrigger>
      </TabsList>

      <TabsContent value="grid" className="mt-6">
        <AgentsGrid agents={agents} onOpen={onOpen} />
      </TabsContent>

      <TabsContent value="list" className="mt-6">
        <AgentsTable agents={agents} onOpen={onOpen} />
      </TabsContent>
    </Tabs>
  </>
)

// ──── AgentsView ────

export function AgentsView() {
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const filtered = useAgentsFilter(AGENTS, search, status, category)

  const openAgent = useCallback((a: Agent) => setSelectedAgent(a), [])
  const closeDialog = useCallback(() => setSelectedAgent(null), [])
  const startWorkspace = useCallback(() => setShowWorkspace(true), [])
  const backFromWorkspace = useCallback(() => setShowWorkspace(false), [])

  if (showWorkspace && selectedAgent) {
    return (
      <RenderWorkspace agent={selectedAgent} onBack={backFromWorkspace} />
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      <Header />

      <FiltersBar
        search={search}
        status={status}
        category={category}
        onSearch={setSearch}
        onStatus={setStatus}
        onCategory={setCategory}
      />

      <AgentsMain agents={filtered} onOpen={openAgent} />

      <AgentDialog
        agent={selectedAgent}
        onClose={closeDialog}
        onStart={startWorkspace}
      />
    </div>
  )
}
