import AgentWorkspace from './AgentWorkspace'; 
import { WebResearcherWorkspace } from './WebResearcherWorkspace';
import { SEOWorkspace } from './SEOWorkspace';
// Универсальный переключатель воркспейсов
export function RenderWorkspace({ agent, onBack }: { agent: any, onBack: () => void }) {
  if (!agent) return null;

  switch (agent.name) {
    case 'Web Researcher':
      return <WebResearcherWorkspace onBack={onBack} />;
    
    case 'Протоколы Совещаний':
      return <AgentWorkspace agent={agent} onBack={onBack} />;
    case 'SEO Продвижение':
         return <SEOWorkspace onBack={onBack} />;
    default:
      // Заглушка для тех, кто "В разработке"
      return (
        <div className="h-screen flex items-center justify-center bg-white flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Модуль {agent.name} в разработке</h2>
          <button onClick={onBack} className="text-red-800 font-bold underline">Вернуться назад</button>
        </div>
      );
  }
}