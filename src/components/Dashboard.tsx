import React from 'react';
import { 
  Boxes, 
  BarChart3, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  DollarSign, 
  FolderTree, 
  FileText, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle, 
  TrendingUp 
} from 'lucide-react';
import { InventoryDatabase } from '../types/inventory';
import { NavTab } from './Sidebar';
import { RESPONSAVEL_TECNICO_TITULO, RESPONSAVEL_TECNICO_NOME } from '../data/initialData';

interface DashboardProps {
  database: InventoryDatabase;
  onNavigateTab: (tab: NavTab) => void;
  onOpenMovement: (type: 'ENTRADA' | 'SAIDA') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  database,
  onNavigateTab,
  onOpenMovement
}) => {
  const { artigos, tipos, movimentacoes } = database;

  // Cálculos de métricas
  const totalArtigos = artigos.length;
  const totalUnidades = artigos.reduce((acc, a) => acc + a.quantidadeEstoque, 0);
  const totalValor = artigos.reduce((acc, a) => acc + (a.quantidadeEstoque * a.custoUnitario), 0);
  const artigosCriticos = artigos.filter(a => a.quantidadeEstoque <= a.estoqueMinimo);
  const artigosZerados = artigos.filter(a => a.quantidadeEstoque <= 0);

  // Últimas movimentações
  const recentMovements = [...movimentacoes].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Banner de Boas-Vindas SENAI-SP com Responsável Técnico */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 border-l-8 border-red-600 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-600/30 border border-red-500/50 text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Ambiente Homologado SENAI-SP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sistema de Controle de Estoques (SIGE)
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Gestão de inventário com classificação hierárquica (Tipo → Grupo → Subgrupo → Artigo), rastreabilidade de localização e persistência em nuvem.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="bg-neutral-800 px-2.5 py-1 rounded border border-neutral-700 font-semibold text-gray-200">
                Responsável Técnico: <strong className="text-white">{RESPONSAVEL_TECNICO_NOME}</strong>
              </span>
              <span className="bg-neutral-800 px-2.5 py-1 rounded border border-neutral-700 font-semibold text-gray-200">
                Validação: <strong className="text-emerald-400">{totalArtigos} Materiais Registrados</strong>
              </span>
            </div>
          </div>

          {/* Botões de Ação Imediata no Banner */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onOpenMovement('ENTRADA')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Registrar Entrada</span>
            </button>
            <button
              onClick={() => onOpenMovement('SAIDA')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Registrar Saída</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-red-400" />
              <span>Emitir Relatório A4</span>
            </button>
          </div>
        </div>

        {/* Marca d'água de fundo */}
        <div className="absolute -right-8 -bottom-10 text-neutral-800/40 text-9xl font-extrabold select-none pointer-events-none">
          SENAI
        </div>
      </div>

      {/* Grid de 4 KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Artigos */}
        <div 
          onClick={() => onNavigateTab('articles')}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-red-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px]">Catálogo Ativo</span>
            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-800 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 font-mono">
            {totalArtigos}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{totalUnidades.toLocaleString('pt-BR')} itens físicos</span>
            <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform">Ver Catálogo →</span>
          </div>
        </div>

        {/* Valor Total Imobilizado */}
        <div 
          onClick={() => onNavigateTab('stock')}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px]">Valor em Estoque</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono truncate">
            R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Custo total inventariado</span>
            <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">Ver Posição →</span>
          </div>
        </div>

        {/* Ponto de Pedido / Estoque Crítico */}
        <div 
          onClick={() => onNavigateTab('stock')}
          className={`p-5 rounded-xl border shadow-xs transition-all cursor-pointer group ${
            artigosCriticos.length > 0 
              ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500' 
              : 'bg-white border-gray-200 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between text-gray-600 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px]">Ponto de Pedido (Crítico)</span>
            <div className={`p-2 rounded-lg ${artigosCriticos.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold font-mono ${artigosCriticos.length > 0 ? 'text-amber-800' : 'text-gray-800'}`}>
            {artigosCriticos.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Saldo ≤ Estoque Mínimo</span>
            <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform">Ver Itens →</span>
          </div>
        </div>

        {/* Total de Movimentações */}
        <div 
          onClick={() => onNavigateTab('movements')}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-neutral-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px]">Auditoria de Operações</span>
            <div className="p-2 bg-neutral-100 rounded-lg text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 font-mono">
            {movimentacoes.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Transações registradas</span>
            <span className="text-neutral-900 font-bold group-hover:translate-x-1 transition-transform">Ver Histórico →</span>
          </div>
        </div>

      </div>

      {/* Seção Central: Últimas Movimentações e Distribuição por Tipo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Últimas Movimentações (8 colunas) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                Últimas Movimentações de Almoxarifado
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Rastreamento em tempo real das entradas e saídas de materiais.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('movements')}
              className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
            >
              Ver todas ({movimentacoes.length})
            </button>
          </div>

          <div className="divide-y divide-gray-100 mt-2">
            {recentMovements.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Nenhuma movimentação registrada no sistema.
              </div>
            ) : (
              recentMovements.map(mov => {
                const isEntrada = mov.tipo === 'ENTRADA';
                return (
                  <div key={mov.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${isEntrada ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {isEntrada ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-gray-900 truncate">
                          {mov.artigoNome}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-red-600">{mov.artigoCodigo}</span>
                          <span>•</span>
                          <span>{mov.motivo}</span>
                          <span>•</span>
                          <span className="text-gray-400">{new Date(mov.dataHora).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-mono font-extrabold text-sm ${isEntrada ? 'text-emerald-700' : 'text-red-700'}`}>
                        {isEntrada ? '+' : '-'}{mov.quantidade}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        Saldo: {mov.quantidadePosterior}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Resumo Hierárquico por Tipo (4 colunas) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-red-600" />
                Categorias Principais
              </h3>
              <button
                onClick={() => onNavigateTab('hierarchy')}
                className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {tipos.map(t => {
                const count = artigos.filter(a => a.tipoId === t.id).length;
                const percent = totalArtigos > 0 ? Math.round((count / totalArtigos) * 100) : 0;

                return (
                  <div key={t.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 truncate">
                        [{t.codigo}] {t.nome}
                      </span>
                      <span className="font-mono text-gray-500 font-bold shrink-0 ml-2">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-red-600 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => onNavigateTab('articles')}
              className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-red-500" />
              <span>Novo Cadastro de Artigo</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
