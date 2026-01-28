import { LayoutDashboard, Bot, Activity, Settings, Users, BarChart3, FileText, HelpCircle } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Дашборды', icon: LayoutDashboard },
    { id: 'agents', label: 'AI Ассистенты', icon: Bot },
    { id: 'analytics', label: 'Акналитика', icon: BarChart3 },
    { id: 'activity', label: 'Активность', icon: Activity },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'reports', label: 'Чаты', icon: FileText },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Настройки', icon: Settings },
    { id: 'help', label: 'Помощь', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-[#1c1c1c] text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">AI-ДИО</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                  activeTab === item.id
                    ? "bg-red-800 text-white"
                    : "text-slate-300 hover:bg-[#696969]"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="px-3 pb-4 border-t border-slate-800 pt-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
