import React, { useState, useMemo } from 'react';
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  MapPin, 
  Filter 
} from 'lucide-react';
import { MovimentacaoEstoque } from '../types/inventory';

interface MovementsHistoryProps {
  movimentacoes: MovimentacaoEstoque[];
  onOpenMovement: (type: 'ENTRADA' | 'SAIDA') => void;
}

export const MovementsHistory: React.FC<MovementsHistoryProps> = ({
  movimentacoes,
  onOpenMovement
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTipo, setFilterTipo] = useState<string>('ALL');

  const filteredMovs = useMemo(() => {
    return movimentacoes.filter(m => {
      const matchSearch = 
        m.artigoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.artigoCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.documentoRef && m.documentoRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.motivo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = filterTipo === 'ALL' || m.tipo === filterTipo;

      return matchSearch && matchTipo;
    });
  }, [movimentacoes, searchTerm, filterTipo]);

  const handleExportCsv = () => {
    const rows = [
      ["Data e Hora", "Tipo", "Código do Artigo", "Nome do Material", "Quantidade", "Saldo Anterior", "Saldo Posterior", "Motivo", "Documento", "Responsável", "Localização", "Observações"]
    ];

    filteredMovs.forEach(m => {
      rows.push([
        new Date(m.dataHora).toLocaleString('pt-BR'),
        m.tipo,
        m.artigoCodigo,
        m.artigoNome.replace(/"/g, '""'),
        m.quantidade.toString(),
        m.quantidadeAnterior.toString(),
        m.quantidadePosterior.toString(),
        m.motivo.replace(/"/g, '""'),
        (m.documentoRef || '').replace(/"/g, '""'),
        m.responsavel.replace(/"/g, '""'),
        m.localizacao.replace(/"/g, '""'),
        (m.observacoes || '').replace(/"/g, '""')
      ]);
    });

    const csvContent = "\uFEFF" + rows.map(e => e.map(cell => `"${cell}"`).join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `SENAI_SP_Historico_Movimentacoes_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            Auditoria de Almoxarifado
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Histórico Completo de Movimentações
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Registro cronológico e imutável de todas as entradas, saídas, requisições e responsáveis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por documento, material, responsável ou motivo..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg py-2.5 px-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden font-bold"
            >
              <option value="ALL">Todas as Operações (Entradas e Saídas)</option>
              <option value="ENTRADA">Apenas Entradas (Recebimento / Compras)</option>
              <option value="SAIDA">Apenas Saídas (Aulas / Manutenção)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredMovs.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">Nenhuma Movimentação Encontrada</h3>
            <p className="text-xs text-gray-500 mt-1">
              Realize uma entrada ou saída para registrar no histórico.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white border-b-2 border-red-600">
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Data / Hora</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-center">Tipo</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Material & Código</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Qtd.</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-center">Evolução do Saldo</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Motivo / Finalidade</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Documento</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMovs.map(mov => {
                  const isEntrada = mov.tipo === 'ENTRADA';
                  const dateFormatted = new Date(mov.dataHora).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={mov.id} className="hover:bg-red-50/30 transition-colors">
                      
                      <td className="py-3 px-3 align-top whitespace-nowrap text-gray-600 font-mono text-[11px]">
                        {dateFormatted}
                      </td>

                      <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                        {isEntrada ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-extrabold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                            ENTRADA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-extrabold text-[10px] bg-red-100 text-red-800 border border-red-300">
                            <ArrowUpRight className="w-3 h-3 text-red-600" />
                            SAÍDA
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top max-w-xs">
                        <span className="font-mono text-[10px] font-bold text-red-600 block">
                          {mov.artigoCodigo}
                        </span>
                        <span className="font-bold text-gray-900 text-xs block">
                          {mov.artigoNome}
                        </span>
                        {mov.observacoes && (
                          <span className="text-[10px] text-gray-500 block italic mt-0.5">
                            Obs: {mov.observacoes}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top text-right whitespace-nowrap font-mono font-bold text-xs">
                        <span className={isEntrada ? 'text-emerald-700' : 'text-red-700'}>
                          {isEntrada ? '+' : '-'}{mov.quantidade}
                        </span>
                      </td>

                      <td className="py-3 px-3 align-top text-center whitespace-nowrap font-mono text-xs">
                        <span className="text-gray-500">{mov.quantidadeAnterior}</span>
                        <span className="text-gray-400 mx-1">→</span>
                        <span className="font-extrabold text-gray-900">{mov.quantidadePosterior}</span>
                      </td>

                      <td className="py-3 px-3 align-top max-w-xs text-xs text-gray-800">
                        {mov.motivo}
                      </td>

                      <td className="py-3 px-3 align-top text-xs text-gray-700 font-mono">
                        {mov.documentoRef || '-'}
                      </td>

                      <td className="py-3 px-3 align-top text-xs text-gray-900 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{mov.responsavel}</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
