import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Layers, 
  DollarSign, 
  Download, 
  Printer, 
  Package, 
  SlidersHorizontal 
} from 'lucide-react';
import { ArtigoMaterial, TipoMaterial, GrupoMaterial, SubgrupoMaterial } from '../types/inventory';

interface StockOverviewProps {
  artigos: ArtigoMaterial[];
  tipos: TipoMaterial[];
  grupos: GrupoMaterial[];
  subgrupos: SubgrupoMaterial[];
  onOpenMovement: (type: 'ENTRADA' | 'SAIDA', artigoId: string) => void;
  onNavigateToReports: () => void;
}

export const StockOverview: React.FC<StockOverviewProps> = ({
  artigos,
  tipos,
  grupos,
  subgrupos,
  onOpenMovement,
  onNavigateToReports
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Todas as localizações únicas para o filtro
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    artigos.forEach(a => {
      if (a.localizacao) locs.add(a.localizacao);
    });
    return Array.from(locs).sort();
  }, [artigos]);

  // Estatísticas de topo
  const stats = useMemo(() => {
    let totalItemsQuantity = 0;
    let totalMonetaryValue = 0;
    let totalCritical = 0;
    let totalZero = 0;

    artigos.forEach(a => {
      totalItemsQuantity += a.quantidadeEstoque;
      totalMonetaryValue += a.quantidadeEstoque * a.custoUnitario;
      if (a.quantidadeEstoque <= 0) {
        totalZero++;
      } else if (a.quantidadeEstoque <= a.estoqueMinimo) {
        totalCritical++;
      }
    });

    return {
      totalItemsQuantity,
      totalMonetaryValue,
      totalCritical,
      totalZero,
      totalSkus: artigos.length
    };
  }, [artigos]);

  // Filtragem da tabela em tempo real
  const filteredArtigos = useMemo(() => {
    return artigos.filter(a => {
      const matchSearch = 
        a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.localizacao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLocation = selectedLocation === 'ALL' || a.localizacao === selectedLocation;

      let matchStatus = true;
      if (selectedStatus === 'NORMAL') matchStatus = a.quantidadeEstoque > a.estoqueMinimo;
      else if (selectedStatus === 'BAIXO') matchStatus = a.quantidadeEstoque <= a.estoqueMinimo && a.quantidadeEstoque > 0;
      else if (selectedStatus === 'ZERADO') matchStatus = a.quantidadeEstoque <= 0;

      return matchSearch && matchLocation && matchStatus;
    });
  }, [artigos, searchTerm, selectedLocation, selectedStatus]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            Painel Operacional em Tempo Real
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Posição Atual do Estoque e Localizações
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitoramento instantâneo de saldos físicos, valores imobilizados e pontos de reposição.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToReports}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-red-500" />
            <span>Emitir Relatório A4</span>
          </button>
        </div>
      </div>

      {/* Cartões de Indicadores Rápidos (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total SKUs */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Materiais Ativos</span>
            <Package className="w-4 h-4 text-neutral-800" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-mono">
            {stats.totalSkus}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            {stats.totalItemsQuantity.toLocaleString('pt-BR')} unidades físicas totais
          </span>
        </div>

        {/* Valor Total Imobilizado */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Valor em Estoque</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            R$ {stats.totalMonetaryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Custo total ponderado em patrimônio
          </span>
        </div>

        {/* Itens em Nível Crítico / Reposição */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          stats.totalCritical > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-gray-600 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Ponto de Pedido (Crítico)</span>
            <AlertTriangle className={`w-4 h-4 ${stats.totalCritical > 0 ? 'text-amber-600' : 'text-gray-400'}`} />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${stats.totalCritical > 0 ? 'text-amber-700' : 'text-gray-700'}`}>
            {stats.totalCritical}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Saldo ≤ estoque mínimo estipulado
          </span>
        </div>

        {/* Itens Zerados */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          stats.totalZero > 0 ? 'bg-red-50/70 border-red-300' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-gray-600 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Materiais Esgotados</span>
            <XCircle className={`w-4 h-4 ${stats.totalZero > 0 ? 'text-red-600' : 'text-gray-400'}`} />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${stats.totalZero > 0 ? 'text-red-700' : 'text-gray-700'}`}>
            {stats.totalZero}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Saldo físico igual a zero (0)
          </span>
        </div>

      </div>

      {/* Controles de Filtro e Busca */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, material ou localização..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg py-2.5 px-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            >
              <option value="ALL">Todas as Localizações ({uniqueLocations.length})</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg py-2.5 px-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden font-semibold"
            >
              <option value="ALL">Todos os Níveis</option>
              <option value="NORMAL">Estoque Normal</option>
              <option value="BAIXO">Apenas Críticos / Ponto de Pedido</option>
              <option value="ZERADO">Apenas Esgotados (0)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid de Posição de Estoque */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-white border-b-2 border-red-600">
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Código</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Descrição Técnica do Artigo</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Localização Física</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-center">Unid.</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Saldo Físico</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Estoque Mínimo</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Valor Total (R$)</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-center">Status</th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Movimentar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArtigos.map(artigo => {
                const isZero = artigo.quantidadeEstoque <= 0;
                const isLow = artigo.quantidadeEstoque <= artigo.estoqueMinimo && !isZero;
                const totalVal = artigo.quantidadeEstoque * artigo.custoUnitario;

                return (
                  <tr key={artigo.id} className="hover:bg-red-50/40 transition-colors">
                    
                    <td className="py-3 px-3 align-middle whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {artigo.codigo}
                      </span>
                    </td>

                    <td className="py-3 px-3 align-middle max-w-sm">
                      <div className="font-bold text-gray-900 text-xs">{artigo.nome}</div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{artigo.descricao}</p>
                    </td>

                    <td className="py-3 px-3 align-middle text-gray-700">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="truncate max-w-[220px]">{artigo.localizacao}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 align-middle text-center font-bold text-gray-600">
                      {artigo.unidade}
                    </td>

                    <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                      <span className={`text-base font-extrabold font-mono ${
                        isZero ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-neutral-900'
                      }`}>
                        {artigo.quantidadeEstoque}
                      </span>
                    </td>

                    <td className="py-3 px-3 align-middle text-right text-gray-500 font-mono">
                      {artigo.estoqueMinimo}
                    </td>

                    <td className="py-3 px-3 align-middle text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                      R$ {totalVal.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                      {isZero ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                          ZERADO
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                          CRÍTICO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          NORMAL
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenMovement('ENTRADA', artigo.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded transition-colors cursor-pointer flex items-center gap-1"
                          title="Lançar Entrada no Estoque"
                        >
                          <ArrowDownLeft className="w-3 h-3" />
                          <span>Entrada</span>
                        </button>
                        <button
                          onClick={() => onOpenMovement('SAIDA', artigo.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded transition-colors cursor-pointer flex items-center gap-1"
                          title="Lançar Saída do Estoque"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Saída</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
