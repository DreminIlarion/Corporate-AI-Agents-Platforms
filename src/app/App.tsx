import { useState } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/Header';
import { Dashboard } from '@/app/components/Dashboard';
import { AgentsView } from '@/app/components/AgentsView';
import { AnalyticsView } from '@/app/components/AnalyticsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'agents':
        return <AgentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'activity':
        return <div className="p-6"><h1 className="text-2xl font-semibold">Activity</h1><p className="text-slate-600 mt-2">Activity logs and history will be displayed here.</p></div>;
      case 'users':
        return <div className="p-6"><h1 className="text-2xl font-semibold">Users</h1><p className="text-slate-600 mt-2">User management interface will be displayed here.</p></div>;
      case 'reports':
        return <div className="p-6"><h1 className="text-2xl font-semibold">Reports</h1><p className="text-slate-600 mt-2">Detailed reports and exports will be displayed here.</p></div>;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-semibold">Settings</h1><p className="text-slate-600 mt-2">Platform settings and configurations will be displayed here.</p></div>;
      case 'help':
        return <div className="p-6"><h1 className="text-2xl font-semibold">Help & Support</h1><p className="text-slate-600 mt-2">Documentation and support resources will be displayed here.</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
