import React, { useCallback, useMemo, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/skeleton'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  Search,
  MousePointer2,
  BarChart3,
  Clock,
  Bot,
} from 'lucide-react'

import AgentWorkspace from './AgentWorkspace'
import AgentDetails from './AgentDetails'
import { WebResearcherWorkspace } from './WebResearcherWorkspace'

// ──── Types ────

type ViewMode = 'list' | 'details' | 'workspace'

type AgentStatus = 'active' | 'training'

interface SeoPoint {
  name: string
  visitors: number
  visits: number
}

interface TopQuery {
  term: string
  clicks: number
  impressions: number
  ctr: number
  pos: number
}

interface Agent {
  id: number
  name: string
  category: string
  status: AgentStatus
  tasks: number
  successRate: number
  model: string
  description: string
  features: string[]
  placeholder: string
  mockResponse: string
  seoTips: string[]
}

interface Metric {
  id: string
  title: string
  value: string
  delta: string
  hint: string
  positive?: boolean
  icon: React.ReactNode
}

// ──── Mock Data ────

const seoPerformanceData: SeoPoint[] = [
  { name: '22 янв', visitors: 2400, visits: 3100 },
  { name: '23 янв', visitors: 3100, visits: 4200 },
  { name: '24 янв', visitors: 2800, visits: 3800 },
  { name: '25 янв', visitors: 3500, visits: 4900 },
  { name: '26 янв', visitors: 4200, visits: 5800 },
  { name: '27 янв', visitors: 2100, visits: 2900 },
  { name: '28 янв', visitors: 1800, visits: 2400 },
]

const topQueries: TopQuery[] = [
  { term: 'Автоматизация 1С Тюмень', clicks: 1240, impressions: 15400, ctr: 8.1, pos: 1.2 },
  { term: 'Внедрение ERP', clicks: 890, impressions: 12100, ctr: 7.3, pos: 2.4 },
  { term: 'Сопровождение 1С программ', clicks: 560, impressions: 8900, ctr: 6.2, pos: 3.1 },
  { term: 'Топ IT компаний Тюмени', clicks: 430, impressions: 4100, ctr: 10.4, pos: 1.5 },
]

const agents: Agent[] = [
  {
    id: 1,
    name: 'SEO Копирайтер',
    category: 'Маркетинг',
    status: 'active',
    tasks: 1247,
    successRate: 96.5,
    model: 'GPT-4o',
    description:
      'Автоматизированный анализ и оптимизация сайтов для поисковых систем. Подбирает ключевые слова и отслеживает позиции.',
    features: ['Генерация мета-тегов', 'Анализ читаемости', 'LSI оптимизация'],
    placeholder: 'Опишите тему статьи для SEO-оптимизации...',
    mockResponse:
      '# SEO Статья: Преимущества 1С\n\nВ современном мире автоматизация становится ключом к успеху.',
    seoTips: ['Ключ: 1С Тюмень', 'LSI: Автоматизация', 'H1 заголовок'],
  },
  {
    id: 2,
    name: 'SMM Маркетолог',
    category: 'Маркетинг',
    status: 'active',
    tasks: 892,
    successRate: 98.2,
    model: 'Claude 3.5 Sonnet',
    placeholder: 'О чем будет пост в соцсетях?',
    description:
      'Создает контент-стратегии для социальных сетей и анализирует вовлеченность аудитории.',
    features: ['Контент-план', 'Подбор хэштегов', 'Сценарии для Reels'],
    mockResponse:
      '🚀 НОВЫЙ КЕЙС: +200% к продажам!\n\nМы внедрили CRM в локальный цветочный магазин.',
    seoTips: ['Хэштеги', 'Engagement', 'Call to Action'],
  },
  {
    id: 3,
    name: 'Web Researcher',
    category: 'Исследования',
    status: 'training',
    tasks: 654,
    successRate: 94.1,
    model: 'GPT-4',
    placeholder: 'Какую нишу или конкурента проанализировать?',
    description:
      'Проводит глубокий анализ конкурентов и рыночных тенденций.',
    features: ['Анализ конкурентов', 'Сбор данных', 'Отчеты'],
    mockResponse:
      "Анализ конкурентов в нише 'Доставка еды Тюмень' показал рост мобильного трафика.",
    seoTips: ['Backlinks', 'Traffic Sources', 'UI Analysis'],
  },
  {
    id: 4,
    name: 'Протоколы Совещаний',
    category: 'Автоматизация',
    status: 'active',
    tasks: 523,
    successRate: 97.8,
    model: 'Claude 3 Opus',
    description:
      'Фиксирует ключевые решения и формирует структурированные отчеты.',
    features: ['Сводки', 'Action items', 'Отчеты'],
    placeholder: 'Вставьте текст совещания для резюме...',
    mockResponse:
      '### ПРОТОКОЛ №12\n\nРешили: Запустить тестовую рекламу до 15 февраля.',
    seoTips: ['Summarization', 'Action Points', 'Clarity'],
  },
]

const metrics: Metric[] = [
  {
    id: 'visits',
    title: 'Визиты',
    value: '45 230',
    delta: '+18,2%',
    hint: 'за 7 дней',
    positive: true,
    icon: <BarChart3 className="w-4 h-4 text-red-500" />,
  },
  {
    id: 'bounce',
    title: 'Отказы',
    value: '14,2%',
    delta: '-2,1%',
    hint: 'лучше среднего',
    positive: true,
    icon: <Activity className="w-4 h-4 text-muted-foreground" />,
  },
  {
    id: 'depth',
    title: 'Глубина просмотра',
    value: '2,8',
    delta: '+0,4',
    hint: 'стр. за сессию',
    positive: true,
    icon: <TrendingUp className="w-4 h-4 text-red-500" />,
  },
  {
    id: 'time',
    title: 'Время на сайте',
    value: '3:45',
    delta: '+22с',
    hint: 'динамика',
    positive: true,
    icon: <Clock className="w-4 h-4 text-muted-foreground" />,
  },
]

// ──── Hooks ────

const useNumberFormat = () => {
  return useCallback((value: number) => value.toLocaleString('ru-RU'), [])
}

// ──── UI Components ────

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

// ──── MetricCard ────

const MetricCard = memo(({ metric }: { metric: Metric }) => (
  <FadeIn>
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {metric.title}
        </CardTitle>
        {metric.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{metric.value}</div>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span
            className={`font-semibold px-1.5 py-0.5 rounded ${
              metric.positive
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-red-600 bg-red-50'
            }`}
          >
            {metric.delta}
          </span>
          <span className="text-muted-foreground">{metric.hint}</span>
        </div>
      </CardContent>
    </Card>
  </FadeIn>
))

// ──── MetricsGrid ────

const MetricsGrid = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {metrics.map((m) => (
      <MetricCard key={m.id} metric={m} />
    ))}
  </div>
))

// ──── TrafficChart ────

const TrafficChart = memo(() => {
  const avgVisits = useMemo(() => {
    const total = seoPerformanceData.reduce((acc, p) => acc + p.visits, 0)
    return total / seoPerformanceData.length
  }, [])

  return (
    <Card className="lg:col-span-2 border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Посещаемость</CardTitle>
        <CardDescription className="text-xs">
          Динамика визитов и уникальных пользователей
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seoPerformanceData}>
              <defs>
                <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={avgVisits} stroke="#e5e7eb" strokeDasharray="4 4" />
              <Area
                name="Визиты"
                type="monotone"
                dataKey="visits"
                stroke="#dc2626"
                strokeWidth={2.5}
                fill="url(#fillVisits)"
              />
              <Area
                name="Посетители"
                type="monotone"
                dataKey="visitors"
                stroke="#111827"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

// ──── QueryBar ────

const QueryBar = memo(
  ({ query, maxClicks }: { query: TopQuery; maxClicks: number }) => {
    const format = useNumberFormat()
    const percent = (query.clicks / maxClicks) * 100

    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="space-y-2 cursor-pointer"
        aria-label={`Запрос ${query.term}`}
      >
        <div className="flex justify-between gap-2">
          <span className="text-sm font-medium truncate hover:text-red-600">
            {query.term}
          </span>
          <Badge variant="outline" className="text-[10px]">
            Поз. {query.pos}
          </Badge>
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-red-500"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MousePointer2 className="w-3 h-3" /> {format(query.clicks)}
          </span>
          <span className="flex items-center gap-1">
            <Search className="w-3 h-3" /> {format(query.impressions)}
          </span>
          <span className="font-semibold text-emerald-600">{query.ctr}%</span>
        </div>
      </motion.div>
    )
  }
)

// ──── TopQueriesCard ────

const TopQueriesCard = memo(() => {
  const maxClicks = useMemo(
    () => Math.max(...topQueries.map((q) => q.clicks)),
    []
  )

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Поисковые запросы
        </CardTitle>
        <CardDescription className="text-xs">
          Топ фраз по эффективности
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {topQueries.map((q) => (
          <QueryBar key={q.term} query={q} maxClicks={maxClicks} />
        ))}
        <Button variant="outline" className="w-full text-xs font-semibold">
          Остальные запросы
        </Button>
      </CardContent>
    </Card>
  )
})

// ──── AgentCard ────

const AgentCard = memo(
  ({ agent, onSelect }: { agent: Agent; onSelect: (a: Agent) => void }) => (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={() => onSelect(agent)}
      className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-md transition w-full text-left"
      aria-label={`Открыть ассистента ${agent.name}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center shadow">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{agent.name}</h3>
        <p className="text-xs text-muted-foreground truncate">
          {agent.category} • {agent.model}
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
    </motion.button>
  )
)

// ──── AgentsGrid ────

const AgentsGrid = memo(
  ({ onSelect }: { onSelect: (a: Agent) => void }) => (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          AI ассистенты
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onSelect={onSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
)

// ──── DashboardSkeleton ────

const DashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-80 rounded-xl" />
  </div>
)

// ──── DashboardMain ────

const DashboardMain = ({ onSelect }: { onSelect: (a: Agent) => void }) => (
  <div className="p-4 md:p-6 space-y-6">
    <MetricsGrid />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TrafficChart />
      <TopQueriesCard />
    </div>

    <AgentsGrid onSelect={onSelect} />
  </div>
)

// ──── Dashboard ────

export function Dashboard() {
  const [view, setView] = useState<ViewMode>('list')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [loading] = useState(false)

  const handleSelectAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent)
    setView('details')
  }, [])

  const handleStartWork = useCallback(() => setView('workspace'), [])

  const handleBackToList = useCallback(() => {
    setSelectedAgent(null)
    setView('list')
  }, [])

  const handleBackToDetails = useCallback(
    () => setView('details'),
    []
  )

  if (view === 'workspace' && selectedAgent) {
    if (selectedAgent.name === 'Web Researcher') {
      return <WebResearcherWorkspace onBack={handleBackToDetails} />
    }

    return (
      <AgentWorkspace agent={selectedAgent} onBack={handleBackToDetails} />
    )
  }

  if (view === 'details' && selectedAgent) {
    return (
      <AgentDetails
        agent={selectedAgent}
        onBack={handleBackToList}
        onStart={handleStartWork}
      />
    )
  }

  if (loading) return <DashboardSkeleton />

  return <DashboardMain onSelect={handleSelectAgent} />
}
