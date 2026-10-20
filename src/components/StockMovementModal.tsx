import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle, MapPin, Package, Calendar } from 'lucide-react';
import { ArtigoMaterial, MovimentacaoEstoque, TipoMovimentacao } from '../types/inventory';
import { RESPONSAVEL_TECNICO_NOME } from '../data/initialData';

interface StockMovementModalProps {
  isOpen: boolean;
  type: TipoMovimentacao;
  artigos: ArtigoMaterial[];
  preSelectedArtigoId?: string;
  onClose: () => void;
  onConfirm: (movement: Omit<MovimentacaoEstoque, 'id'>, updatedArtigo: ArtigoMaterial) => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  type,
  artigos,
  preSelectedArtigoId,
  onClose,
  onConfirm
}) => {
  const [selectedArtigoId, setSelectedArtigoId] = useState<string>('');
  const [quantidade, setQuantidade] = useState<string>('1');
  const [motivo, setMotivo] = useState<string>('');
  const [documentoRef, setDocumentoRef] = useState<string>('');
  const [responsavel, setResponsavel] = useState<string>('');
  const [localizacao, setLocalizacao] = useState<string>('');
  const [custoUnitario, setCustoUnitario] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      const initialId = preSelectedArtigoId || (artigos.length > 0 ? artigos[0].id : '');
      setSelectedArtigoId(initialId);
      setQuantidade('1');
      setDocumentoRef('');
      setResponsavel(`Almoxarife / ${RESPONSAVEL_TECNICO_NOME}`);
      setObservacoes('');

      if (type === 'ENTRADA') {
        setMotivo('Compra com Nota Fiscal');
      } else {
        setMotivo('Consumo em Aula Prática de Oficina');
      }

      if (initialId) {
        const item = artigos.find(a => a.id === initialId);
        if (item) {
          setLocalizacao(item.localizacao);
          setCustoUnitario(item.custoUnitario.toString());
        }
      }
    }
  }, [isOpen, preSelectedArtigoId, type, artigos]);

  const selectedArtigo = artigos.find(a => a.id === selectedArtigoId);

  const handleArtigoChange = (artigoId: string) => {
    setSelectedArtigoId(artigoId);
    setErrorMsg('');
    const item = artigos.find(a => a.id === artigoId);
    if (item) {
      setLocalizacao(item.localizacao);
      setCustoUnitario(item.custoUnitario.toString());
    }
  };

  const parsedQty = parseFloat(quantidade) || 0;
  const currentStock = selectedArtigo ? selectedArtigo.quantidadeEstoque : 0;
  const isSaida = type === 'SAIDA';
  const newStock = isSaida ? currentStock - parsedQty : currentStock + parsedQty;
  const isStockInsufficient = isSaida && parsedQty > currentStock;
  const willBeBelowMin = selectedArtigo && newStock <= selectedArtigo.estoqueMinimo && newStock > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedArtigo) {
      setErrorMsg('Por favor, selecione um material válido.');
      return;
    }

    if (parsedQty <= 0) {
      setErrorMsg('A quantidade movimentada deve ser maior que zero.');
      return;
    }

    if (isSaida && parsedQty > currentStock) {
      setErrorMsg(`Saldo insuficiente em estoque! Saldo disponível: ${currentStock} ${selectedArtigo.unidade}.`);
      return;
    }

    if (!motivo.trim()) {
      setErrorMsg('Informe o motivo da movimentação.');
      return;
    }

    if (!responsavel.trim()) {
      setErrorMsg('Informe o responsável pela movimentação.');
      return;
    }

    const updatedArtigo: ArtigoMaterial = {
      ...selectedArtigo,
      quantidadeEstoque: newStock,
      localizacao: localizacao.trim() || selectedArtigo.localizacao,
      custoUnitario: custoUnitario ? parseFloat(custoUnitario) || selectedArtigo.custoUnitario : selectedArtigo.custoUnitario,
      ultimaAtualizacao: new Date().toISOString()
    };

    const movementData: Omit<MovimentacaoEstoque, 'id'> = {
      artigoId: selectedArtigo.id,
      artigoCodigo: selectedArtigo.codigo,
      artigoNome: selectedArtigo.nome,
      tipo: type,
      quantidade: parsedQty,
      quantidadeAnterior: currentStock,
      quantidadePosterior: newStock,
      dataHora: new Date().toISOString(),
      motivo: motivo.trim(),
      documentoRef: documentoRef.trim() || undefined,
      responsavel: responsavel.trim(),
      localizacao: localizacao.trim() || selectedArtigo.localizacao,
      custoUnitario: custoUnitario ? parseFloat(custoUnitario) : undefined,
      observacoes: observacoes.trim() || undefined
    };

    onConfirm(movementData, updatedArtigo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 my-8">
        
        {/* Modal Header */}
        <div className={`p-5 flex items-center justify-between text-white ${
          type === 'ENTRADA' ? 'bg-emerald-700' : 'bg-red-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/20 text-white">
              {type === 'ENTRADA' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {type === 'ENTRADA' ? 'Registrar Entrada de Material' : 'Registrar Saída de Material'}
              </h2>
              <p className="text-xs text-white/80">
                {type === 'ENTRADA' 
                  ? 'Recebimento de fornecedor, reposição de estoque ou devolução' 
                  : 'Requisição para aulas práticas, oficinas ou manutenção'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs flex items-center gap-2 rounded">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Selecionar Artigo */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Material / Artigo <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedArtigoId}
              onChange={(e) => handleArtigoChange(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
              required
            >
              {artigos.length === 0 ? (
                <option value="">Nenhum material cadastrado</option>
              ) : (
                artigos.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.codigo}] {a.nome} (Saldo atual: {a.quantidadeEstoque} {a.unidade})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Card de Informações do Artigo Selecionado */}
          {selectedArtigo && (
            <div className="p-3.5 bg-gray-100 rounded-lg border border-gray-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-gray-500 block">Saldo Atual:</span>
                <span className="text-sm font-bold text-neutral-900">
                  {selectedArtigo.quantidadeEstoque} {selectedArtigo.unidade}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Estoque Mínimo:</span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedArtigo.estoqueMinimo} {selectedArtigo.unidade}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 block">Localização Cadastrada:</span>
                <span className="text-xs font-semibold text-gray-800 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                  {selectedArtigo.localizacao}
                </span>
              </div>
            </div>
          )}

          {/* Quantidade e Saldo Projetado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Quantidade a Movimentar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className={`w-full text-base font-bold border rounded-lg p-2.5 focus:outline-hidden ${
                    isStockInsufficient 
                      ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-600' 
                      : 'border-gray-300 focus:ring-2 focus:ring-neutral-900'
                  }`}
                  placeholder="0"
                  required
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-gray-400">
                  {selectedArtigo?.unidade || 'UN'}
                </span>
              </div>

              {isStockInsufficient && (
                <p className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Não é permitida saída superior ao saldo disponível ({currentStock})!
                </p>
              )}

              {willBeBelowMin && !isStockInsufficient && (
                <p className="mt-1 text-[11px] text-amber-700 font-medium">
                  Atenção: O saldo atingirá o ponto de pedido mínimo ({selectedArtigo?.estoqueMinimo}).
                </p>
              )}
            </div>

            {/* Prévia do Novo Saldo */}
            <div className="bg-neutral-900 text-white rounded-lg p-3 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Projeção do Saldo em Estoque
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xs text-gray-300">
                  {currentStock} {isSaida ? '-' : '+'} {parsedQty} =
                </span>
                <span className={`text-xl font-mono font-extrabold ${newStock <= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {newStock} {selectedArtigo?.unidade}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 text-right">
                {newStock <= 0 ? 'ESTOQUE FICARÁ ZERADO' : 'ESTOQUE POSITIVO'}
              </span>
            </div>
          </div>

          {/* Motivo & Documento de Referência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Motivo da {type === 'ENTRADA' ? 'Entrada' : 'Saída'} <span className="text-red-500">*</span>
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                required
              >
                {type === 'ENTRADA' ? (
                  <>
                    <option value="Compra com Nota Fiscal">Compra com Nota Fiscal (Fornecedor)</option>
                    <option value="Devolução de Aula Prática">Devolução de Aula Prática / Aluno</option>
                    <option value="Doação de Empresa Parceira">Doação de Empresa Parceira</option>
                    <option value="Ajuste Positivo de Inventário">Ajuste Positivo de Inventário Físico</option>
                    <option value="Fabricação Própria em Oficina SENAI">Fabricação Própria em Oficina SENAI</option>
                    <option value="Transferência de Outra Unidade SENAI">Transferência de Outra Unidade SENAI</option>
                  </>
                ) : (
                  <>
                    <option value="Consumo em Aula Prática de Oficina">Consumo em Aula Prática de Oficina</option>
                    <option value="Projeto de Aprendizagem Industrial">Projeto de Aprendizagem Industrial</option>
                    <option value="Manutenção Preventiva / Corretiva">Manutenção Preventiva / Corretiva</option>
                    <option value="Descarte / Sucata Técnica Avariada">Descarte / Sucata Técnica Avariada</option>
                    <option value="Transferência para Outra Unidade SENAI">Transferência para Outra Unidade SENAI</option>
                    <option value="Ajuste Negativo de Inventário">Ajuste Negativo de Inventário Físico</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Nº Documento / NF / Requisição
              </label>
              <input
                type="text"
                value={documentoRef}
                onChange={(e) => setDocumentoRef(e.target.value)}
                placeholder={type === 'ENTRADA' ? 'Ex: NF-e 048291' : 'Ex: REQ-TURMA-MEC-01'}
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Responsável & Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Responsável / Requisitante <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Ex: Instrutor Carlos / Almoxarife"
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Localização Física no Almoxarifado
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Prateleira M-03 - Gaveta 12"
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Custo Unitário (na entrada) ou Observações */}
          {type === 'ENTRADA' && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Custo Unitário da Entrada (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={custoUnitario}
                onChange={(e) => setCustoUnitario(e.target.value)}
                placeholder="0.00"
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Observações Gerais
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Detalhes adicionais sobre a destinação ou lote do material..."
              className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isStockInsufficient || !selectedArtigo}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow transition-all cursor-pointer ${
                isStockInsufficient || !selectedArtigo
                  ? 'bg-gray-400 cursor-not-allowed'
                  : type === 'ENTRADA'
                  ? 'bg-emerald-700 hover:bg-emerald-600'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {type === 'ENTRADA' ? 'Confirmar Entrada' : 'Confirmar Saída'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
