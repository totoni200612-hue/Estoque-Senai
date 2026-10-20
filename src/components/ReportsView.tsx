import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  Building, 
  User 
} from 'lucide-react';
import { InventoryDatabase, ArtigoMaterial, MovimentacaoEstoque } from '../types/inventory';
import { exportInventoryToCsv } from '../services/storage';
import { RESPONSAVEL_TECNICO_TITULO, RESPONSAVEL_TECNICO_NOME } from '../data/initialData';

interface ReportsViewProps {
  database: InventoryDatabase;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ database }) => {
  const [reportType, setReportType] = useState<'POSICAO_ESTOQUE' | 'HISTORICO_MOVIMENTACOES' | 'ITENS_CRITICOS'>('POSICAO_ESTOQUE');
  const currentDate = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalValor = database.artigos.reduce((acc, a) => acc + (a.quantidadeEstoque * a.custoUnitario), 0);
  const totalPecas = database.artigos.reduce((acc, a) => acc + a.quantidadeEstoque, 0);

  const artigosCriticos = database.artigos.filter(a => a.quantidadeEstoque <= a.estoqueMinimo);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    exportInventoryToCsv(database);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Controles (Escondida na impressão) */}
      <div className="no-print bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            Central de Emissão de Relatórios Oficiais
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Relatório de Posição de Estoque e Inventário
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Documento formal formatado para auditoria e impressão no padrão institucional SENAI-SP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5 bg-gray-50 text-xs">
            <button
              onClick={() => setReportType('POSICAO_ESTOQUE')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                reportType === 'POSICAO_ESTOQUE'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Posição Geral ({database.artigos.length})
            </button>
            <button
              onClick={() => setReportType('ITENS_CRITICOS')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                reportType === 'ITENS_CRITICOS'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Ponto de Pedido ({artigosCriticos.length})
            </button>
            <button
              onClick={() => setReportType('HISTORICO_MOVIMENTACOES')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                reportType === 'HISTORICO_MOVIMENTACOES'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Histórico ({database.movimentacoes.length})
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Planilha CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório (PDF / A4)</span>
          </button>
        </div>
      </div>

      {/* ÁREA DO RELATÓRIO FORMATADO INSTITUCIONAL SENAI-SP (Imprimível) */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-md p-6 sm:p-10 text-neutral-900 printable-card">
        
        {/* Cabeçalho Institucional Oficial */}
        <div className="border-b-4 border-red-600 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            <div className="flex items-start gap-4">
              {/* Logo SENAI-SP */}
              <div className="bg-red-600 text-white font-extrabold text-2xl tracking-tight px-4 py-2 rounded border border-red-700 shadow-xs flex items-center gap-1">
                <span>SENAI</span>
                <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded font-mono">SP</span>
              </div>

              <div>
                <h1 className="text-base font-extrabold uppercase tracking-wide text-neutral-900 leading-tight">
                  Serviço Nacional de Aprendizagem Industrial - SENAI-SP
                </h1>
                <h2 className="text-xs font-semibold text-gray-700">
                  Departamento Regional de São Paulo • Gestão Integrada de Almoxarifados Técnicos
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  SIGE - Sistema Integrado de Controle de Estoques e Movimentações
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs bg-gray-50 p-2.5 rounded border border-gray-200">
              <div className="font-bold text-gray-800">RELATÓRIO OFICIAL DE ESTOQUE</div>
              <div className="text-gray-600 mt-0.5">Emissão: <strong className="font-mono">{currentDate}</strong></div>
              <div className="text-red-600 font-bold text-[11px] mt-0.5">Homologado para Validação</div>
            </div>

          </div>
        </div>

        {/* Metadados e Responsabilidade Técnica */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-neutral-900 text-white p-3.5 rounded-lg text-xs">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Unidade de Ensino / Almoxarifado:</span>
            <span className="font-bold text-white text-xs">{database.unidadeSenai}</span>
          </div>
          <div>
            <span className="text-[10px] text-red-400 block uppercase font-bold">Responsável Técnico / Engenheiro:</span>
            <span className="font-bold text-white text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              {RESPONSAVEL_TECNICO_TITULO}
            </span>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Patrimônio Total Avaliado:</span>
            <span className="font-extrabold text-emerald-400 text-sm font-mono">
              R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Título do Relatório Específico */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 border-l-4 border-red-600 pl-2">
            {reportType === 'POSICAO_ESTOQUE' && '1. Posição Completa do Estoque e Localizações Físicas'}
            {reportType === 'ITENS_CRITICOS' && '1. Relatório de Materiais com Ponto de Pedido Crítico'}
            {reportType === 'HISTORICO_MOVIMENTACOES' && '1. Livro Geral de Movimentações (Entradas e Saídas)'}
          </h3>
          <span className="text-xs text-gray-500">
            {reportType === 'POSICAO_ESTOQUE' && `${database.artigos.length} itens listados`}
            {reportType === 'ITENS_CRITICOS' && `${artigosCriticos.length} itens requerem reposição`}
            {reportType === 'HISTORICO_MOVIMENTACOES' && `${database.movimentacoes.length} transações registradas`}
          </span>
        </div>

        {/* TABELA DO RELATÓRIO (POSIÇÃO DO ESTOQUE OU CRÍTICOS) */}
        {reportType !== 'HISTORICO_MOVIMENTACOES' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-bold border-b border-gray-400">
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px] font-mono">Item / Código</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px]">Material & Descrição Técnica Detalhada</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px]">Localização Física</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px] text-center">Unid.</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px] text-right">Saldo</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px] text-right">Mín.</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px] text-right">Custo Unit.</th>
                  <th className="py-2.5 px-2.5 border-r border-neutral-700 text-[11px] text-right">Total (R$)</th>
                  <th className="py-2.5 px-2.5 text-[11px] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {(reportType === 'POSICAO_ESTOQUE' ? database.artigos : artigosCriticos).map((artigo, idx) => {
                  const valorTotalItem = artigo.quantidadeEstoque * artigo.custoUnitario;
                  const isZero = artigo.quantidadeEstoque <= 0;
                  const isLow = artigo.quantidadeEstoque <= artigo.estoqueMinimo && !isZero;

                  return (
                    <tr key={artigo.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      
                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top whitespace-nowrap font-mono font-bold text-red-700 text-[11px]">
                        {artigo.codigo}
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top">
                        <div className="font-extrabold text-neutral-900 text-xs">
                          {artigo.nome}
                        </div>
                        <div className="text-[11px] text-gray-600 mt-1 leading-snug">
                          {artigo.descricao}
                        </div>
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top text-gray-800 text-[11px]">
                        <span className="font-semibold block">{artigo.localizacao}</span>
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top text-center font-mono font-bold">
                        {artigo.unidade}
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top text-right font-mono font-extrabold text-xs">
                        <span className={isZero ? 'text-red-700' : isLow ? 'text-amber-700' : 'text-neutral-900'}>
                          {artigo.quantidadeEstoque}
                        </span>
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top text-right font-mono text-gray-600 text-xs">
                        {artigo.estoqueMinimo}
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top text-right font-mono text-xs text-gray-700 whitespace-nowrap">
                        R$ {artigo.custoUnitario.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-2.5 border-r border-gray-200 align-top text-right font-mono font-bold text-xs text-neutral-900 whitespace-nowrap">
                        R$ {valorTotalItem.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-2.5 align-top text-center whitespace-nowrap">
                        {isZero ? (
                          <span className="font-bold text-[10px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                            ZERADO
                          </span>
                        ) : isLow ? (
                          <span className="font-bold text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            BAIXO
                          </span>
                        ) : (
                          <span className="font-bold text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            NORMAL
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-900 text-white font-bold border-t-2 border-red-600">
                  <td colSpan={4} className="py-3 px-3 text-right uppercase text-xs">
                    Totais Consolidados:
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-emerald-400">
                    {totalPecas.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3"></td>
                  <td className="py-3 px-3"></td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-emerald-400 whitespace-nowrap">
                    R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-center text-xs text-gray-300">
                    {database.artigos.length} Itens
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          /* TABELA DE MOVIMENTAÇÕES */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-bold">
                  <th className="py-2.5 px-2.5 text-[11px]">Data/Hora</th>
                  <th className="py-2.5 px-2.5 text-[11px] text-center">Tipo</th>
                  <th className="py-2.5 px-2.5 text-[11px]">Código & Material</th>
                  <th className="py-2.5 px-2.5 text-[11px] text-right">Qtd.</th>
                  <th className="py-2.5 px-2.5 text-[11px] text-center">Saldo</th>
                  <th className="py-2.5 px-2.5 text-[11px]">Motivo & Documento</th>
                  <th className="py-2.5 px-2.5 text-[11px]">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {database.movimentacoes.map((mov, idx) => (
                  <tr key={mov.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-2 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                      {new Date(mov.dataHora).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2 px-2 text-center whitespace-nowrap">
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        mov.tipo === 'ENTRADA' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="font-mono font-bold text-red-700 text-[10px] block">{mov.artigoCodigo}</span>
                      <span className="font-bold text-gray-900 text-xs">{mov.artigoNome}</span>
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-bold">
                      {mov.tipo === 'ENTRADA' ? `+${mov.quantidade}` : `-${mov.quantidade}`}
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-gray-600">
                      {mov.quantidadeAnterior} → <strong className="text-black">{mov.quantidadePosterior}</strong>
                    </td>
                    <td className="py-2 px-2 text-gray-700">
                      <div>{mov.motivo}</div>
                      {mov.documentoRef && <div className="text-[10px] font-mono text-gray-500">{mov.documentoRef}</div>}
                    </td>
                    <td className="py-2 px-2 text-gray-900 font-semibold whitespace-nowrap">
                      {mov.responsavel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bloco de Assinaturas Formais (Padrão SENAI) */}
        <div className="mt-12 pt-6 border-t border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="w-64 border-b border-gray-900 mx-auto mb-2"></div>
            <p className="font-extrabold text-neutral-900 uppercase">
              {RESPONSAVEL_TECNICO_TITULO}
            </p>
            <p className="text-[11px] text-gray-600">
              Desenvolvimento & Homologação Técnica de Inventário
            </p>
          </div>
          <div>
            <div className="w-64 border-b border-gray-900 mx-auto mb-2"></div>
            <p className="font-extrabold text-neutral-900 uppercase">
              Coordenação de Almoxarifado & Oficinas
            </p>
            <p className="text-[11px] text-gray-600">
              Serviço Nacional de Aprendizagem Industrial - SENAI-SP
            </p>
          </div>
        </div>

        {/* Rodapé da Página Impressa */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-500 flex flex-col sm:flex-row items-center justify-between">
          <span>SENAI-SP • Sistema Integrado de Gestão de Estoques</span>
          <span>Validação: 10 Materiais Oficiais Registrados pelo Responsável Técnico {RESPONSAVEL_TECNICO_NOME}</span>
          <span>Página 1 de 1</span>
        </div>

      </div>

    </div>
  );
};
