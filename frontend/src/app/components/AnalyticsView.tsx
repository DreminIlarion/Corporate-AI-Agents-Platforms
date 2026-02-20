import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', tasks: 4200, success: 3990, failed: 210 },
  { month: 'Feb', tasks: 5100, success: 4896, failed: 204 },
  { month: 'Mar', tasks: 6300, success: 6111, failed: 189 },
  { month: 'Apr', tasks: 7800, success: 7566, failed: 234 },
  { month: 'May', tasks: 9200, success: 8924, failed: 276 },
  { month: 'Jun', tasks: 10500, success: 10185, failed: 315 },
];

const categoryPerformance = [
  { name: 'Support', value: 35, tasks: 4200 },
  { name: 'Analytics', value: 25, tasks: 3000 },
  { name: 'Marketing', value: 20, tasks: 2400 },
  { name: 'Development', value: 15, tasks: 1800 },
  { name: 'Automation', value: 5, tasks: 600 },
];

const hourlyActivity = [
  { hour: '00:00', activity: 45 },
  { hour: '03:00', activity: 32 },
  { hour: '06:00', activity: 78 },
  { hour: '09:00', activity: 245 },
  { hour: '12:00', activity: 356 },
  { hour: '15:00', activity: 298 },
  { hour: '18:00', activity: 189 },
  { hour: '21:00', activity: 112 },
];

const responseTimeData = [
  { date: 'Week 1', avg: 1.8, p95: 3.2 },
  { date: 'Week 2', avg: 1.6, p95: 2.9 },
  { date: 'Week 3', avg: 1.4, p95: 2.5 },
  { date: 'Week 4', avg: 1.2, p95: 2.2 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export function AnalyticsView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">Comprehensive insights into agent performance</p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="12months">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-semibold mt-1">43,100</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>18.2% increase</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-semibold mt-1">1.2s</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <TrendingDown className="w-3 h-3" />
                  <span>25% faster</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Success Rate</p>
                <p className="text-2xl font-semibold mt-1">96.8%</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>2.1% increase</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Cost Savings</p>
                <p className="text-2xl font-semibold mt-1">$48.2K</p>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>32% this month</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Task Completion Trend</CardTitle>
                <CardDescription>Monthly task completion over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTotal)" name="Total Tasks" />
                    <Area type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} fill="url(#colorSuccess)" name="Successful" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Tasks by agent category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trend</CardTitle>
                <CardDescription>Average and P95 response times</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} name="Average" />
                    <Line type="monotone" dataKey="p95" stroke="#8b5cf6" strokeWidth={2} name="P95" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success vs Failed Tasks</CardTitle>
                <CardDescription>Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="success" fill="#10b981" name="Success" />
                    <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Pattern</CardTitle>
              <CardDescription>Agent activity throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={hourlyActivity}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="activity" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
