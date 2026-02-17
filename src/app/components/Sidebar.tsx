import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Bot, Activity, Settings, Users, BarChart3, FileText, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItemProps {
  item: any;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
  isBottom?: boolean;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  // Инициализация состояния: по умолчанию true (закрыто), 
  // но пытаемся достать сохраненное значение из памяти браузера
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      // Если в памяти ничего нет, возвращаем true (закрыто по умолчанию)
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Сохраняем состояние при каждом изменении
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const menuItems = [
    { id: 'dashboard', label: 'Дашборды', icon: LayoutDashboard },
    { id: 'agents', label: 'AI Ассистенты', icon: Bot },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'activity', label: 'Активность', icon: Activity },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'reports', label: 'Чаты', icon: FileText },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Настройки', icon: Settings },
    { id: 'help', label: 'Помощь', icon: HelpCircle },
  ];

  return (
    <motion.div 
      // Теперь логика верная: если свернуто (true) -> 80px, если нет -> 256px
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[#1c1c1c] text-white flex flex-col h-screen relative shadow-xl z-20"
    >
      {/* Кнопка сворачивания */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-red-800 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-[60] shadow-md"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Логотип */}
      <div className="p-6 border-b border-slate-800 flex items-center shrink-0 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-semibold text-lg whitespace-nowrap"
              >
                AI-ДИО
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Основное меню */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id} 
            item={item} 
            isCollapsed={isCollapsed} 
            isActive={activeTab === item.id} 
            onClick={() => onTabChange(item.id)} 
          />
        ))}
      </nav>

      {/* Нижнее меню */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-4 space-y-1">
        {bottomItems.map((item) => (
          <MenuItem 
            key={item.id} 
            item={item} 
            isCollapsed={isCollapsed} 
            isActive={activeTab === item.id} 
            onClick={() => onTabChange(item.id)} 
            isBottom
          />
        ))}
      </div>
    </motion.div>
  );
}

function MenuItem({ item, isCollapsed, isActive, onClick, isBottom }: MenuItemProps) {
  const Icon = item.icon;
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const rect = ref.current?.getBoundingClientRect();

  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => isCollapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          isActive
            ? (isBottom ? "bg-blue-600 text-white" : "bg-red-800 text-white")
            : "text-slate-300 hover:bg-[#2a2a2a]"
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        
        {/* Анимация исчезновения текста */}
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                width: "auto",
                transition: { delay: 0.1 } // Небольшая задержка при появлении
              }}
              exit={{ 
                opacity: 0, 
                x: -5, 
                width: 0,
                transition: { duration: 0.2 } 
              }}
              className="text-sm whitespace-nowrap overflow-hidden origin-left"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Tooltip остается без изменений */}
      <AnimatePresence>
        {isCollapsed && showTooltip && rect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 10 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'fixed', 
              top: rect.top + (rect.height / 2) - 14, 
              left: rect.right 
            }}
            className="z-[100] px-3 py-1.5 bg-red-800 text-white text-xs rounded shadow-2xl pointer-events-none whitespace-nowrap"
          >
            {item.label}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}