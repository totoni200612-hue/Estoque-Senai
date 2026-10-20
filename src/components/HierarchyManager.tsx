import React, { useState } from 'react';
import { 
  FolderTree, 
  FolderPlus, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Layers, 
  Tag, 
  Edit3, 
  Trash2, 
  Info, 
  Check, 
  Package 
} from 'lucide-react';
import { TipoMaterial, GrupoMaterial, SubgrupoMaterial, ArtigoMaterial } from '../types/inventory';
import { generateTipoCode, generateGrupoCode, generateSubgrupoCode, isCodeUnique } from '../services/codeGenerator';

interface HierarchyManagerProps {
  tipos: TipoMaterial[];
  grupos: GrupoMaterial[];
  subgrupos: SubgrupoMaterial[];
  artigos: ArtigoMaterial[];
  onAddTipo: (tipo: TipoMaterial) => void;
  onUpdateTipo: (tipo: TipoMaterial) => void;
  onDeleteTipo: (id: string) => void;
  onAddGrupo: (grupo: GrupoMaterial) => void;
  onUpdateGrupo: (grupo: GrupoMaterial) => void;
  onDeleteGrupo: (id: string) => void;
  onAddSubgrupo: (subgrupo: SubgrupoMaterial) => void;
  onUpdateSubgrupo: (subgrupo: SubgrupoMaterial) => void;
  onDeleteSubgrupo: (id: string) => void;
  onNavigateToArticlesWithFilter: (tipoId?: string, grupoId?: string, subgrupoId?: string) => void;
}

export const HierarchyManager: React.FC<HierarchyManagerProps> = ({
  tipos,
  grupos,
  subgrupos,
  artigos,
  onAddTipo,
  onUpdateTipo,
  onDeleteTipo,
  onAddGrupo,
  onUpdateGrupo,
  onDeleteGrupo,
  onAddSubgrupo,
  onUpdateSubgrupo,
  onDeleteSubgrupo,
  onNavigateToArticlesWithFilter
}) => {
  const [expandedTipos, setExpandedTipos] = useState<Record<string, boolean>>({
    'tip-01': true,
    'tip-02': true
  });
  const [expandedGrupos, setExpandedGrupos] = useState<Record<string, boolean>>({
    'grp-01-01': true,
    'grp-02-01': true
  });

  // Modal states for adding/editing
  const [modalMode, setModalMode] = useState<'NONE' | 'ADD_TIPO' | 'ADD_GRUPO' | 'ADD_SUBGRUPO' | 'EDIT_TIPO' | 'EDIT_GRUPO' | 'EDIT_SUBGRUPO'>('NONE');
  const [selectedParentTipoId, setSelectedParentTipoId] = useState<string>('');
  const [selectedParentGrupoId, setSelectedParentGrupoId] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string>('');

  // Form fields
  const [codigo, setCodigo] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const toggleTipo = (id: string) => {
    setExpandedTipos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGrupo = (id: string) => {
    setExpandedGrupos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddTipo = () => {
    setModalMode('ADD_TIPO');
    setCodigo(generateTipoCode(tipos));
    setNome('');
    setDescricao('');
    setFormError('');
  };

  const handleOpenAddGrupo = (tipoId: string) => {
    const parentTipo = tipos.find(t => t.id === tipoId);
    if (!parentTipo) return;
    setSelectedParentTipoId(tipoId);
    setModalMode('ADD_GRUPO');
    setCodigo(generateGrupoCode(parentTipo.codigo, grupos));
    setNome('');
    setDescricao('');
    setFormError('');
  };

  const handleOpenAddSubgrupo = (tipoId: string, grupoId: string) => {
    const parentGrupo = grupos.find(g => g.id === grupoId);
    if (!parentGrupo) return;
    setSelectedParentTipoId(tipoId);
    setSelectedParentGrupoId(grupoId);
    setModalMode('ADD_SUBGRUPO');
    setCodigo(generateSubgrupoCode(parentGrupo.codigo, subgrupos));
    setNome('');
    setDescricao('');
    setFormError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!codigo.trim()) {
      setFormError('Código é obrigatório.');
      return;
    }
    if (!nome.trim()) {
      setFormError('Nome é obrigatório.');
      return;
    }

    if (modalMode === 'ADD_TIPO') {
      if (!isCodeUnique(codigo, tipos)) {
        setFormError(`O código "${codigo}" já existe em Tipos.`);
        return;
      }
      onAddTipo({
        id: `tip-${Date.now()}`,
        codigo: codigo.trim(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        dataCriacao: new Date().toISOString()
      });
    } else if (modalMode === 'ADD_GRUPO') {
      if (!isCodeUnique(codigo, grupos)) {
        setFormError(`O código "${codigo}" já existe em Grupos.`);
        return;
      }
      onAddGrupo({
        id: `grp-${Date.now()}`,
        tipoId: selectedParentTipoId,
        codigo: codigo.trim(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        dataCriacao: new Date().toISOString()
      });
      setExpandedTipos(prev => ({ ...prev, [selectedParentTipoId]: true }));
    } else if (modalMode === 'ADD_SUBGRUPO') {
      if (!isCodeUnique(codigo, subgrupos)) {
        setFormError(`O código "${codigo}" já existe em Subgrupos.`);
        return;
      }
      onAddSubgrupo({
        id: `sub-${Date.now()}`,
        tipoId: selectedParentTipoId,
        grupoId: selectedParentGrupoId,
        codigo: codigo.trim(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        dataCriacao: new Date().toISOString()
      });
      setExpandedGrupos(prev => ({ ...prev, [selectedParentGrupoId]: true }));
    }

    setModalMode('NONE');
  };

  return (
    <div className="space-y-6">
      
      {/* Header da Seção */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" />
            Estrutura Cadastral SENAI-SP
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Cadastro Hierárquico: Tipo → Grupo → Subgrupo
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Organização multinível com geração automática de códigos sequenciais padronizados.
          </p>
        </div>

        <button
          onClick={handleOpenAddTipo}
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <FolderPlus className="w-4 h-4 text-red-500" />
          <span>+ Novo Tipo de Material</span>
        </button>
      </div>

      {/* Regra de Codificação Informativa */}
      <div className="bg-neutral-900 text-white rounded-xl p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-red-600">
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider text-red-400 text-[10px]">
            Padrão de Codificação Automática SENAI
          </span>
          <p className="text-gray-300">
            Cada nível herda a hierarquia do nível pai gerando códigos padronizados:
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded font-mono font-bold text-xs text-red-400">
          <span className="text-white">01</span>
          <span className="text-gray-500">→</span>
          <span className="text-white">01.01</span>
          <span className="text-gray-500">→</span>
          <span className="text-white">01.01.01</span>
          <span className="text-gray-500">→</span>
          <span className="text-red-400">SENAI-01.01.01.001</span>
        </div>
      </div>

      {/* Árvore Hierárquica */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-gray-800 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-red-600" />
            Árvore de Categorias ({tipos.length} Tipos, {grupos.length} Grupos, {subgrupos.length} Subgrupos)
          </div>
          <span className="text-xs text-gray-500">
            Total de {artigos.length} artigos indexados
          </span>
        </div>

        {tipos.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">Nenhum Tipo Cadastrado</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Inicie a organização do almoxarifado criando o primeiro Tipo (Ex: Materiais de Consumo, Ferramental, etc.).
            </p>
            <button
              onClick={handleOpenAddTipo}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Criar Primeiro Tipo
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tipos.map(tipo => {
              const tipoGrupos = grupos.filter(g => g.tipoId === tipo.id);
              const tipoArtigos = artigos.filter(a => a.tipoId === tipo.id);
              const isExpanded = Boolean(expandedTipos[tipo.id]);

              return (
                <div key={tipo.id} className="p-3">
                  
                  {/* Linha do TIPO (Nível 1) */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTipo(tipo.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <span className="px-2 py-0.5 bg-neutral-900 text-white rounded font-mono font-bold text-xs">
                        {tipo.codigo}
                      </span>

                      <div>
                        <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <span>{tipo.nome}</span>
                          <span className="text-[11px] font-normal text-gray-500">
                            ({tipoGrupos.length} grupos • {tipoArtigos.length} artigos)
                          </span>
                        </div>
                        {tipo.descricao && (
                          <p className="text-xs text-gray-500 truncate max-w-xl">{tipo.descricao}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAddGrupo(tipo.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white border border-gray-300 hover:border-red-600 hover:text-red-600 rounded text-gray-700 transition-colors cursor-pointer"
                        title="Adicionar Grupo a este Tipo"
                      >
                        <Plus className="w-3.5 h-3.5 text-red-600" />
                        <span className="hidden sm:inline">Adicionar Grupo</span>
                      </button>

                      <button
                        onClick={() => onDeleteTipo(tipo.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Excluir Tipo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lista de GRUPOS (Nível 2) */}
                  {isExpanded && (
                    <div className="ml-6 pl-4 border-l-2 border-red-200 mt-2 space-y-2">
                      {tipoGrupos.length === 0 ? (
                        <div className="p-3 text-xs text-gray-400 italic">
                          Nenhum grupo vinculado a este tipo. Clique em "+ Adicionar Grupo".
                        </div>
                      ) : (
                        tipoGrupos.map(grupo => {
                          const grupoSubgrupos = subgrupos.filter(sg => sg.grupoId === grupo.id);
                          const grupoArtigos = artigos.filter(a => a.grupoId === grupo.id);
                          const isGrupoExpanded = Boolean(expandedGrupos[grupo.id]);

                          return (
                            <div key={grupo.id} className="bg-white border border-gray-200 rounded-lg p-2.5">
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <button
                                    onClick={() => toggleGrupo(grupo.id)}
                                    className="p-1 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                                  >
                                    {isGrupoExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </button>

                                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-mono font-bold text-xs rounded border border-red-200">
                                    {grupo.codigo}
                                  </span>

                                  <div>
                                    <span className="text-xs font-bold text-gray-800">
                                      {grupo.nome}
                                    </span>
                                    <span className="text-[11px] text-gray-500 ml-2">
                                      ({grupoSubgrupos.length} subgrupos • {grupoArtigos.length} artigos)
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenAddSubgrupo(tipo.id, grupo.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 bg-gray-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 rounded text-gray-600 transition-colors cursor-pointer"
                                    title="Adicionar Subgrupo"
                                  >
                                    <Plus className="w-3 h-3 text-red-600" />
                                    <span>+ Subgrupo</span>
                                  </button>

                                  <button
                                    onClick={() => onDeleteGrupo(grupo.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Lista de SUBGRUPOS (Nível 3) */}
                              {isGrupoExpanded && (
                                <div className="ml-6 pl-4 border-l border-gray-200 mt-2 space-y-1.5 pt-1">
                                  {grupoSubgrupos.length === 0 ? (
                                    <div className="text-[11px] text-gray-400 italic py-1">
                                      Nenhum subgrupo cadastrado.
                                    </div>
                                  ) : (
                                    grupoSubgrupos.map(subgrupo => {
                                      const subgrupoArtigos = artigos.filter(a => a.subgrupoId === subgrupo.id);

                                      return (
                                        <div
                                          key={subgrupo.id}
                                          className="flex items-center justify-between p-2 rounded bg-gray-50/80 hover:bg-gray-100 transition-colors"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-800 font-mono text-[11px] font-semibold rounded">
                                              {subgrupo.codigo}
                                            </span>
                                            <span className="text-xs font-medium text-gray-800">
                                              {subgrupo.nome}
                                            </span>
                                            <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.2 rounded border border-gray-200 font-mono">
                                              {subgrupoArtigos.length} artigos
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => onNavigateToArticlesWithFilter(tipo.id, grupo.id, subgrupo.id)}
                                              className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                                            >
                                              Ver Artigos
                                            </button>
                                            <button
                                              onClick={() => onDeleteSubgrupo(subgrupo.id)}
                                              className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}

                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição Hierárquica */}
      {modalMode !== 'NONE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b-2 border-red-600">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-red-500" />
                {modalMode === 'ADD_TIPO' && 'Cadastrar Novo Tipo'}
                {modalMode === 'ADD_GRUPO' && 'Cadastrar Novo Grupo'}
                {modalMode === 'ADD_SUBGRUPO' && 'Cadastrar Novo Subgrupo'}
              </h3>
              <button
                onClick={() => setModalMode('NONE')}
                className="text-gray-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Código Gerado Automaticamente <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="w-full text-sm font-mono font-bold border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Código sequencial sugerido conforme regras hierárquicas SENAI-SP.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Nome da Categoria <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Fixadores e Elementos Roscados"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Descrição Técnica
                </label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Definição das especificações dos itens desta categoria..."
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalMode('NONE')}
                  className="px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm cursor-pointer"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
