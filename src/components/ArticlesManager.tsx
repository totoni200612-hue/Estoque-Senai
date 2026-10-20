import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Layers, 
  ArrowDownLeft, 
  ArrowUpRight, 
  QrCode, 
  Tag 
} from 'lucide-react';
import { ArtigoMaterial, TipoMaterial, GrupoMaterial, SubgrupoMaterial } from '../types/inventory';
import { generateArtigoCode, isCodeUnique } from '../services/codeGenerator';
import { RESPONSAVEL_TECNICO_NOME } from '../data/initialData';

interface ArticlesManagerProps {
  artigos: ArtigoMaterial[];
  tipos: TipoMaterial[];
  grupos: GrupoMaterial[];
  subgrupos: SubgrupoMaterial[];
  onAddArtigo: (artigo: ArtigoMaterial, estoqueInicial: number) => void;
  onUpdateArtigo: (artigo: ArtigoMaterial) => void;
  onDeleteArtigo: (id: string) => void;
  onOpenMovement: (type: 'ENTRADA' | 'SAIDA', artigoId: string) => void;
  initialFilter?: { tipoId?: string; grupoId?: string; subgrupoId?: string };
}

export const ArticlesManager: React.FC<ArticlesManagerProps> = ({
  artigos,
  tipos,
  grupos,
  subgrupos,
  onAddArtigo,
  onUpdateArtigo,
  onDeleteArtigo,
  onOpenMovement,
  initialFilter
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTipoId, setFilterTipoId] = useState<string>(initialFilter?.tipoId || '');
  const [filterGrupoId, setFilterGrupoId] = useState<string>(initialFilter?.grupoId || '');
  const [filterSubgrupoId, setFilterSubgrupoId] = useState<string>(initialFilter?.subgrupoId || '');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingArtigo, setEditingArtigo] = useState<ArtigoMaterial | null>(null);
  const [viewingArtigo, setViewingArtigo] = useState<ArtigoMaterial | null>(null);

  // Form Fields
  const [formTipoId, setFormTipoId] = useState<string>('');
  const [formGrupoId, setFormGrupoId] = useState<string>('');
  const [formSubgrupoId, setFormSubgrupoId] = useState<string>('');
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formNome, setFormNome] = useState<string>('');
  const [formDescricao, setFormDescricao] = useState<string>('');
  const [formUnidade, setFormUnidade] = useState<string>('UN');
  const [formLocalizacao, setFormLocalizacao] = useState<string>('');
  const [formEstoqueInicial, setFormEstoqueInicial] = useState<string>('0');
  const [formEstoqueMinimo, setFormEstoqueMinimo] = useState<string>('5');
  const [formEstoqueMaximo, setFormEstoqueMaximo] = useState<string>('50');
  const [formCustoUnitario, setFormCustoUnitario] = useState<string>('0.00');
  const [formError, setFormError] = useState<string>('');

  // Grupos e Subgrupos dependentes do formulário
  const availableFormGrupos = useMemo(() => {
    return grupos.filter(g => g.tipoId === formTipoId);
  }, [grupos, formTipoId]);

  const availableFormSubgrupos = useMemo(() => {
    return subgrupos.filter(sg => sg.grupoId === formGrupoId);
  }, [subgrupos, formGrupoId]);

  // Atualiza código automático quando seleciona subgrupo
  const handleFormSubgrupoChange = (subgrupoId: string) => {
    setFormSubgrupoId(subgrupoId);
    const sg = subgrupos.find(s => s.id === subgrupoId);
    if (sg && !editingArtigo) {
      const nextCode = generateArtigoCode(sg.codigo, artigos);
      setFormCodigo(nextCode);
    }
  };

  const handleOpenAdd = () => {
    setEditingArtigo(null);
    setFormError('');
    
    // Auto-select first available hierarchy
    const defaultTipo = tipos[0]?.id || '';
    const defaultGrupos = grupos.filter(g => g.tipoId === defaultTipo);
    const defaultGrupo = defaultGrupos[0]?.id || '';
    const defaultSubgrupos = subgrupos.filter(sg => sg.grupoId === defaultGrupo);
    const defaultSubgrupo = defaultSubgrupos[0]?.id || '';

    setFormTipoId(defaultTipo);
    setFormGrupoId(defaultGrupo);
    setFormSubgrupoId(defaultSubgrupo);

    const sg = subgrupos.find(s => s.id === defaultSubgrupo);
    if (sg) {
      setFormCodigo(generateArtigoCode(sg.codigo, artigos));
    } else {
      setFormCodigo('SENAI-01.01.01.001');
    }

    setFormNome('');
    setFormDescricao(`Descrição técnica detalhada conforme especificações do SENAI-SP. - ${RESPONSAVEL_TECNICO_NOME}`);
    setFormUnidade('UN');
    setFormLocalizacao('Almoxarifado Central - Prateleira A-01 - Caixa 01');
    setFormEstoqueInicial('10');
    setFormEstoqueMinimo('5');
    setFormEstoqueMaximo('100');
    setFormCustoUnitario('25.00');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (artigo: ArtigoMaterial) => {
    setEditingArtigo(artigo);
    setFormError('');
    setFormTipoId(artigo.tipoId);
    setFormGrupoId(artigo.grupoId);
    setFormSubgrupoId(artigo.subgrupoId);
    setFormCodigo(artigo.codigo);
    setFormNome(artigo.nome);
    setFormDescricao(artigo.descricao);
    setFormUnidade(artigo.unidade);
    setFormLocalizacao(artigo.localizacao);
    setFormEstoqueInicial(artigo.quantidadeEstoque.toString());
    setFormEstoqueMinimo(artigo.estoqueMinimo.toString());
    setFormEstoqueMaximo(artigo.estoqueMaximo.toString());
    setFormCustoUnitario(artigo.custoUnitario.toString());
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formSubgrupoId) {
      setFormError('Selecione Tipo, Grupo e Subgrupo para vincular o artigo.');
      return;
    }
    if (!formCodigo.trim()) {
      setFormError('Código do artigo é obrigatório.');
      return;
    }
    if (!formNome.trim()) {
      setFormError('Nome do artigo é obrigatório.');
      return;
    }
    if (!isCodeUnique(formCodigo, artigos, editingArtigo?.id)) {
      setFormError(`O código "${formCodigo}" já está em uso por outro artigo.`);
      return;
    }

    const parsedEstoqueInicial = parseFloat(formEstoqueInicial) || 0;
    const parsedMinimo = parseFloat(formEstoqueMinimo) || 0;
    const parsedMaximo = parseFloat(formEstoqueMaximo) || 0;
    const parsedCusto = parseFloat(formCustoUnitario) || 0;

    if (editingArtigo) {
      const updated: ArtigoMaterial = {
        ...editingArtigo,
        tipoId: formTipoId,
        grupoId: formGrupoId,
        subgrupoId: formSubgrupoId,
        codigo: formCodigo.trim(),
        nome: formNome.trim(),
        descricao: formDescricao.trim(),
        unidade: formUnidade,
        localizacao: formLocalizacao.trim(),
        estoqueMinimo: parsedMinimo,
        estoqueMaximo: parsedMaximo,
        custoUnitario: parsedCusto,
        ultimaAtualizacao: new Date().toISOString()
      };
      onUpdateArtigo(updated);
    } else {
      const newArtigo: ArtigoMaterial = {
        id: `art-${Date.now()}`,
        tipoId: formTipoId,
        grupoId: formGrupoId,
        subgrupoId: formSubgrupoId,
        codigo: formCodigo.trim(),
        nome: formNome.trim(),
        descricao: formDescricao.trim(),
        unidade: formUnidade,
        localizacao: formLocalizacao.trim(),
        quantidadeEstoque: parsedEstoqueInicial,
        estoqueMinimo: parsedMinimo,
        estoqueMaximo: parsedMaximo,
        custoUnitario: parsedCusto,
        dataCriacao: new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString()
      };
      onAddArtigo(newArtigo, parsedEstoqueInicial);
    }

    setIsModalOpen(false);
  };

  // Filtragem
  const filteredArtigos = useMemo(() => {
    return artigos.filter(a => {
      const matchSearch = 
        a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.localizacao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = !filterTipoId || a.tipoId === filterTipoId;
      const matchGrupo = !filterGrupoId || a.grupoId === filterGrupoId;
      const matchSubgrupo = !filterSubgrupoId || a.subgrupoId === filterSubgrupoId;

      let matchStatus = true;
      if (filterStatus === 'NORMAL') matchStatus = a.quantidadeEstoque > a.estoqueMinimo;
      else if (filterStatus === 'BAIXO') matchStatus = a.quantidadeEstoque <= a.estoqueMinimo && a.quantidadeEstoque > 0;
      else if (filterStatus === 'ZERADO') matchStatus = a.quantidadeEstoque <= 0;

      return matchSearch && matchTipo && matchGrupo && matchSubgrupo && matchStatus;
    });
  }, [artigos, searchTerm, filterTipoId, filterGrupoId, filterSubgrupoId, filterStatus]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            Catálogo de Materiais SENAI-SP
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Artigos e Materiais Cadastrados
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão completa com códigos gerados automaticamente, localização física e especificações técnicas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Novo Material</span>
        </button>
      </div>

      {/* Barra de Busca e Filtros Rápidos */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Busca textual */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, nome, localização ou descrição..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>

          {/* Filtro por Tipo */}
          <div className="md:col-span-2">
            <select
              value={filterTipoId}
              onChange={(e) => {
                setFilterTipoId(e.target.value);
                setFilterGrupoId('');
                setFilterSubgrupoId('');
              }}
              className="w-full text-xs border border-gray-300 rounded-lg py-2.5 px-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            >
              <option value="">Todos os Tipos</option>
              {tipos.map(t => (
                <option key={t.id} value={t.id}>[{t.codigo}] {t.nome}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Grupo */}
          <div className="md:col-span-2">
            <select
              value={filterGrupoId}
              onChange={(e) => {
                setFilterGrupoId(e.target.value);
                setFilterSubgrupoId('');
              }}
              disabled={!filterTipoId}
              className="w-full text-xs border border-gray-300 rounded-lg py-2.5 px-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden disabled:opacity-50"
            >
              <option value="">Todos os Grupos</option>
              {grupos
                .filter(g => !filterTipoId || g.tipoId === filterTipoId)
                .map(g => (
                  <option key={g.id} value={g.id}>[{g.codigo}] {g.nome}</option>
                ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="md:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg py-2.5 px-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden font-medium"
            >
              <option value="ALL">Todos os Status de Estoque</option>
              <option value="NORMAL">Estoque Normal</option>
              <option value="BAIXO">Estoque Baixo / Crítico</option>
              <option value="ZERADO">Estoque Zerado</option>
            </select>
          </div>

        </div>

        {/* Feedback de resultados */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
          <span>Exibindo <strong>{filteredArtigos.length}</strong> de <strong>{artigos.length}</strong> materiais</span>
          {(searchTerm || filterTipoId || filterStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTipoId('');
                setFilterGrupoId('');
                setFilterSubgrupoId('');
                setFilterStatus('ALL');
              }}
              className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista / Tabela de Artigos */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredArtigos.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">Nenhum Material Encontrado</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Ajuste os filtros de pesquisa ou clique no botão acima para cadastrar um novo material.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white border-b-2 border-red-600">
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Código Único</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Material / Descrição</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Hierarquia</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">Localização Física</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Saldo Atual</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Custo Unit.</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-center">Status</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArtigos.map(artigo => {
                  const tipo = tipos.find(t => t.id === artigo.tipoId);
                  const subgrupo = subgrupos.find(sg => sg.id === artigo.subgrupoId);
                  
                  const isZero = artigo.quantidadeEstoque <= 0;
                  const isLow = artigo.quantidadeEstoque <= artigo.estoqueMinimo && !isZero;

                  return (
                    <tr key={artigo.id} className="hover:bg-red-50/40 transition-colors">
                      
                      {/* Código */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded">
                          {artigo.codigo}
                        </span>
                      </td>

                      {/* Nome & Descrição */}
                      <td className="py-3 px-3 align-top max-w-xs">
                        <span className="font-bold text-gray-900 text-xs block leading-tight">
                          {artigo.nome}
                        </span>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-normal">
                          {artigo.descricao}
                        </p>
                      </td>

                      {/* Hierarquia */}
                      <td className="py-3 px-3 align-top whitespace-nowrap text-gray-600">
                        <div className="text-[11px]">
                          <span className="font-semibold text-gray-800">{tipo?.codigo}</span> • {tipo?.nome}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Sub: {subgrupo?.nome || 'N/A'}
                        </div>
                      </td>

                      {/* Localização */}
                      <td className="py-3 px-3 align-top max-w-[200px]">
                        <span className="inline-flex items-center gap-1 font-medium text-gray-700 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span className="truncate">{artigo.localizacao}</span>
                        </span>
                      </td>

                      {/* Saldo Atual */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <span className="font-mono text-sm font-extrabold text-neutral-900 block">
                          {artigo.quantidadeEstoque} <span className="text-xs font-normal text-gray-500">{artigo.unidade}</span>
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Mín: {artigo.estoqueMinimo} | Máx: {artigo.estoqueMaximo}
                        </span>
                      </td>

                      {/* Custo Unitário */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap font-mono">
                        <span className="text-xs font-bold text-gray-800">
                          R$ {artigo.custoUnitario.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          Total: R$ {(artigo.quantidadeEstoque * artigo.custoUnitario).toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                        {isZero ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                            <XCircle className="w-3 h-3" /> ZERADO
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                            <AlertTriangle className="w-3 h-3" /> CRÍTICO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                            <CheckCircle className="w-3 h-3" /> NORMAL
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Botão Entrada Rápida */}
                          <button
                            onClick={() => onOpenMovement('ENTRADA', artigo.id)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition-colors cursor-pointer"
                            title="Lançar Entrada"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* Botão Saída Rápida */}
                          <button
                            onClick={() => onOpenMovement('SAIDA', artigo.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors cursor-pointer"
                            title="Lançar Saída"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Ver Detalhes */}
                          <button
                            onClick={() => setViewingArtigo(artigo)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
                            title="Ver Ficha Técnica"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => handleOpenEdit(artigo)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
                            title="Editar Artigo"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Excluir */}
                          <button
                            onClick={() => onDeleteArtigo(artigo.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Excluir Artigo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

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

      {/* Modal de Cadastro / Edição de Artigo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 my-6">
            
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b-2 border-red-600">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Package className="w-4 h-4 text-red-500" />
                {editingArtigo ? 'Editar Material / Artigo' : 'Cadastrar Novo Material (SENAI-SP)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs rounded">
                  {formError}
                </div>
              )}

              {/* Hierarquia Seletora: Tipo -> Grupo -> Subgrupo */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <span className="text-[10px] uppercase font-bold text-gray-600 block">
                  1. Associação na Hierarquia de Catálogo
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Tipo <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formTipoId}
                      onChange={(e) => {
                        const newTipo = e.target.value;
                        setFormTipoId(newTipo);
                        const firstGrp = grupos.find(g => g.tipoId === newTipo)?.id || '';
                        setFormGrupoId(firstGrp);
                        const firstSg = subgrupos.find(sg => sg.grupoId === firstGrp)?.id || '';
                        handleFormSubgrupoChange(firstSg);
                      }}
                      className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white"
                      required
                    >
                      <option value="">Selecione...</option>
                      {tipos.map(t => (
                        <option key={t.id} value={t.id}>[{t.codigo}] {t.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Grupo <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formGrupoId}
                      onChange={(e) => {
                        const newGrp = e.target.value;
                        setFormGrupoId(newGrp);
                        const firstSg = subgrupos.find(sg => sg.grupoId === newGrp)?.id || '';
                        handleFormSubgrupoChange(firstSg);
                      }}
                      disabled={!formTipoId}
                      className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white disabled:opacity-50"
                      required
                    >
                      <option value="">Selecione...</option>
                      {availableFormGrupos.map(g => (
                        <option key={g.id} value={g.id}>[{g.codigo}] {g.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Subgrupo <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formSubgrupoId}
                      onChange={(e) => handleFormSubgrupoChange(e.target.value)}
                      disabled={!formGrupoId}
                      className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white disabled:opacity-50"
                      required
                    >
                      <option value="">Selecione...</option>
                      {availableFormSubgrupos.map(sg => (
                        <option key={sg.id} value={sg.id}>[{sg.codigo}] {sg.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Código Único Gerado e Nome */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Código Único Gerado <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Nome Completo do Material <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Parafuso Sextavado M10 x 50mm Inox"
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              {/* Descrição Detalhada */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Descrição Técnica Detalhada <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  placeholder="Especificações completas, normas técnicas DIN/ISO, dimensões e grau de aplicação..."
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Nota: Para fins de validação técnica, as descrições homologadas possuem a assinatura do responsável.
                </p>
              </div>

              {/* Localização Física e Unidade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Localização Física de Armazenamento <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formLocalizacao}
                    onChange={(e) => setFormLocalizacao(e.target.value)}
                    placeholder="Ex: Almoxarifado Mecânica Geral - Prateleira M-03 - Gaveta 12"
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Unidade de Medida <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formUnidade}
                    onChange={(e) => setFormUnidade(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                  >
                    <option value="UN">UN - Unidade</option>
                    <option value="CX">CX - Caixa</option>
                    <option value="KG">KG - Quilograma</option>
                    <option value="M">M - Metro</option>
                    <option value="L">L - Litro</option>
                    <option value="GL">GL - Galão (20L)</option>
                    <option value="PAR">PAR - Par</option>
                    <option value="BR">BR - Barra</option>
                    <option value="PC">PC - Peça</option>
                  </select>
                </div>
              </div>

              {/* Estoques e Custos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {!editingArtigo && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Estoque Inicial
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formEstoqueInicial}
                      onChange={(e) => setFormEstoqueInicial(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white font-mono font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={formEstoqueMinimo}
                    onChange={(e) => setFormEstoqueMinimo(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Estoque Máximo
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={formEstoqueMaximo}
                    onChange={(e) => setFormEstoqueMaximo(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Custo Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formCustoUnitario}
                    onChange={(e) => setFormCustoUnitario(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-md p-2 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow cursor-pointer"
                >
                  {editingArtigo ? 'Salvar Alterações' : 'Cadastrar Artigo'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal Ficha Técnica do Artigo */}
      {viewingArtigo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b-2 border-red-600">
              <span className="font-mono font-bold text-red-500 text-sm">{viewingArtigo.codigo}</span>
              <button
                onClick={() => setViewingArtigo(null)}
                className="text-gray-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">{viewingArtigo.nome}</h3>
                <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                  {viewingArtigo.descricao}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-100 p-2.5 rounded">
                  <span className="text-gray-500 block">Saldo em Estoque:</span>
                  <span className="text-base font-bold text-neutral-900 font-mono">
                    {viewingArtigo.quantidadeEstoque} {viewingArtigo.unidade}
                  </span>
                </div>
                <div className="bg-gray-100 p-2.5 rounded">
                  <span className="text-gray-500 block">Valor Imobilizado:</span>
                  <span className="text-base font-bold text-red-700 font-mono">
                    R$ {(viewingArtigo.quantidadeEstoque * viewingArtigo.custoUnitario).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-semibold">Localização:</span> {viewingArtigo.localizacao}
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Custo Unitário:</span> R$ {viewingArtigo.custoUnitario.toFixed(2)}
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold">Parâmetros:</span> Mínimo {viewingArtigo.estoqueMinimo} | Máximo {viewingArtigo.estoqueMaximo} {viewingArtigo.unidade}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setViewingArtigo(null)}
                className="px-4 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
