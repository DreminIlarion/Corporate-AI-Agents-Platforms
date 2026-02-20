import { Bell, Search, Settings, User } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export function Header() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search agents, analytics, users..."
            className="pl-10 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 ml-2 pl-3 border-l">
          <div className="w-9 h-9 bg-red-800 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium">ДИО-Консалт</p>
            <p className="text-xs text-slate-500">diocon@mail.ru</p>
          </div>
        </div>
      </div>
    </header>
  );
}
