import React from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  BarChart3, 
  History, 
  FileText, 
  Cloud, 
  Layers, 
  Boxes 
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'hierarchy' 
  | 'articles' 
  | 'stock' 
  | 'movements' 
  | 'reports' 
  | 'cloud';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMovement: (type: 'ENTRADA' | 'SAIDA') => void;
  artigosCount: number;
  itensCriticosCount: number;
  movimentacoesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMovement,
  artigosCount,
  itensCriticosCount,
  movimentacoesCount
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Visão Geral',
      description: 'Painel & Métricas de Estoque',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'stock' as NavTab,
      label: 'Posição do Estoque',
      description: 'Saldo e Localização em Tempo Real',
      icon: BarChart3,
      badge: itensCriticosCount > 0 ? `${itensCriticosCount} crítico(s)` : null,
      badgeColor: 'bg-red-600 text-white'
    },
    {
      id: 'hierarchy' as NavTab,
      label: 'Estrutura Hierárquica',
      description: 'Tipo → Grupo → Subgrupo',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'articles' as NavTab,
      label: 'Catálogo de Artigos',
      description: 'Materiais com Códigos Únicos',
      icon: Package,
      badge: `${artigosCount}`,
      badgeColor: 'bg-neutral-800 text-gray-200'
    },
    {
      id: 'movements' as NavTab,
      label: 'Movimentações',
      description: 'Auditoria de Entradas e Saídas',
      icon: History,
      badge: `${movimentacoesCount}`,
      badgeColor: 'bg-neutral-800 text-gray-200'
    },
    {
      id: 'reports' as NavTab,
      label: 'Relatórios & Impressão',
      description: 'Emissão A4 Padrão SENAI-SP',
      icon: FileText,
      badge: 'A4 / PDF',
      badgeColor: 'bg-red-900/60 text-red-200 border border-red-700'
    },
    {
      id: 'cloud' as NavTab,
      label: 'Nuvem & Persistência',
      description: 'Sincronização GitHub & Google Drive',
      icon: Cloud,
      badge: 'GitHub',
      badgeColor: 'bg-neutral-800 text-emerald-400'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
      
      {/* Fast Action Movement Box */}
      <div className="p-4 border-b border-gray-100 bg-neutral-900 text-white">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Operações Rápidas de Almoxarifado
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenMovement('ENTRADA')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Entrada</span>
          </button>
          
          <button
            onClick={() => onOpenMovement('SAIDA')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs rounded shadow transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>- Saída</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
          Menu de Navegação
        </p>
        
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-red-50 border-red-600 text-red-950 font-bold shadow-sm'
                  : 'bg-white border-transparent text-gray-700 hover:bg-gray-100 hover:text-black font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-md shrink-0 ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:text-black'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm truncate leading-tight flex items-center gap-2">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-gray-500 font-normal truncate mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${item.badgeColor || 'bg-gray-200 text-gray-800'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Indicator Box */}
      <div className="p-3 m-3 bg-neutral-50 rounded-lg border border-gray-200 text-xs text-gray-600">
        <div className="flex items-center justify-between font-bold text-gray-800 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            SENAI-SP Estoques
          </span>
          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded font-mono">v1.0</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-snug">
          Estrutura em conformidade com as diretrizes do Serviço Nacional de Aprendizagem Industrial.
        </p>
      </div>

    </aside>
  );
};
