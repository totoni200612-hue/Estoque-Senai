import React, { useState, useEffect } from 'react';
import { 
  loadDatabase, 
  saveDatabase, 
  loadGitHubConfig, 
  saveGitHubConfig, 
  resetDatabaseToEmpty, 
  resetDatabaseToInitial 
} from './services/storage';
import { 
  InventoryDatabase, 
  GitHubSyncConfig, 
  ArtigoMaterial, 
  TipoMaterial, 
  GrupoMaterial, 
  SubgrupoMaterial, 
  MovimentacaoEstoque, 
  TipoMovimentacao 
} from './types/inventory';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StockOverview } from './components/StockOverview';
import { HierarchyManager } from './components/HierarchyManager';
import { ArticlesManager } from './components/ArticlesManager';
import { MovementsHistory } from './components/MovementsHistory';
import { ReportsView } from './components/ReportsView';
import { CloudSyncView } from './components/CloudSyncView';
import { StockMovementModal } from './components/StockMovementModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Footer } from './components/Footer';

export default function App() {
  const [database, setDatabase] = useState<InventoryDatabase>(() => loadDatabase());
  const [gitHubConfig, setGitHubConfig] = useState<GitHubSyncConfig>(() => loadGitHubConfig());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Movement Modal State
  const [isMovementModalOpen, setIsMovementModalOpen] = useState<boolean>(false);
  const [movementType, setMovementType] = useState<TipoMovimentacao>('ENTRADA');
  const [movementArtigoId, setMovementArtigoId] = useState<string | undefined>(undefined);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    isDanger?: boolean;
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {}
  });

  // Filter pass-through for articles navigation
  const [articlesFilter, setArticlesFilter] = useState<{ tipoId?: string; grupoId?: string; subgrupoId?: string } | undefined>(undefined);

  // Persist to local storage whenever database changes
  const updateDatabaseAndPersist = (newDb: InventoryDatabase) => {
    setDatabase(newDb);
    saveDatabase(newDb);
  };

  const handleOpenMovement = (type: TipoMovimentacao, artigoId?: string) => {
    setMovementType(type);
    setMovementArtigoId(artigoId);
    setIsMovementModalOpen(true);
  };

  // Process completed movement
  const handleConfirmMovement = (movementData: Omit<MovimentacaoEstoque, 'id'>, updatedArtigo: ArtigoMaterial) => {
    const newMovement: MovimentacaoEstoque = {
      ...movementData,
      id: `mov-${Date.now()}`
    };

    const updatedArtigos = database.artigos.map(a => 
      a.id === updatedArtigo.id ? updatedArtigo : a
    );

    const updatedDatabase: InventoryDatabase = {
      ...database,
      artigos: updatedArtigos,
      movimentacoes: [...database.movimentacoes, newMovement]
    };

    updateDatabaseAndPersist(updatedDatabase);
  };

  // Article Operations
  const handleAddArtigo = (newArtigo: ArtigoMaterial, estoqueInicial: number) => {
    let newMovimentacoes = [...database.movimentacoes];
    
    // Se foi definido estoque inicial > 0, registra a movimentação de entrada inicial
    if (estoqueInicial > 0) {
      const initialMovement: MovimentacaoEstoque = {
        id: `mov-${Date.now()}`,
        artigoId: newArtigo.id,
        artigoCodigo: newArtigo.codigo,
        artigoNome: newArtigo.nome,
        tipo: 'ENTRADA',
        quantidade: estoqueInicial,
        quantidadeAnterior: 0,
        quantidadePosterior: estoqueInicial,
        dataHora: new Date().toISOString(),
        motivo: 'Carga Inicial de Implantação de Estoque',
        responsavel: 'Almoxarife / Lucas (Resp. Técnico)',
        localizacao: newArtigo.localizacao,
        custoUnitario: newArtigo.custoUnitario,
        observacoes: 'Inventário físico inicial cadastrado no sistema.'
      };
      newMovimentacoes.push(initialMovement);
    }

    const updatedDatabase: InventoryDatabase = {
      ...database,
      artigos: [...database.artigos, newArtigo],
      movimentacoes: newMovimentacoes
    };

    updateDatabaseAndPersist(updatedDatabase);
  };

  const handleUpdateArtigo = (updatedArtigo: ArtigoMaterial) => {
    const updatedDatabase: InventoryDatabase = {
      ...database,
      artigos: database.artigos.map(a => a.id === updatedArtigo.id ? updatedArtigo : a)
    };
    updateDatabaseAndPersist(updatedDatabase);
  };

  const handleDeleteArtigo = (artigoId: string) => {
    const item = database.artigos.find(a => a.id === artigoId);
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Artigo do Catálogo',
      message: `Tem certeza que deseja remover o item "${item?.codigo} - ${item?.nome}"?\nO histórico de movimentações anteriores será mantido.`,
      confirmLabel: 'Excluir Artigo',
      isDanger: true,
      action: () => {
        const updatedDatabase: InventoryDatabase = {
          ...database,
          artigos: database.artigos.filter(a => a.id !== artigoId)
        };
        updateDatabaseAndPersist(updatedDatabase);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Hierarchy Operations (Tipos, Grupos, Subgrupos)
  const handleAddTipo = (tipo: TipoMaterial) => {
    const updatedDatabase: InventoryDatabase = {
      ...database,
      tipos: [...database.tipos, tipo]
    };
    updateDatabaseAndPersist(updatedDatabase);
  };

  const handleDeleteTipo = (tipoId: string) => {
    const tipo = database.tipos.find(t => t.id === tipoId);
    const affectedArtigos = database.artigos.filter(a => a.tipoId === tipoId).length;

    setConfirmModal({
      isOpen: true,
      title: 'Excluir Tipo de Material',
      message: `Tem certeza que deseja excluir o Tipo "${tipo?.nome}"?\nExistem ${affectedArtigos} artigos vinculados que ficarão desvinculados.`,
      confirmLabel: 'Excluir Tipo',
      isDanger: true,
      action: () => {
        const updatedDatabase: InventoryDatabase = {
          ...database,
          tipos: database.tipos.filter(t => t.id !== tipoId),
          grupos: database.grupos.filter(g => g.tipoId !== tipoId),
          subgrupos: database.subgrupos.filter(sg => sg.tipoId !== tipoId)
        };
        updateDatabaseAndPersist(updatedDatabase);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddGrupo = (grupo: GrupoMaterial) => {
    const updatedDatabase: InventoryDatabase = {
      ...database,
      grupos: [...database.grupos, grupo]
    };
    updateDatabaseAndPersist(updatedDatabase);
  };

  const handleDeleteGrupo = (grupoId: string) => {
    const grupo = database.grupos.find(g => g.id === grupoId);
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Grupo',
      message: `Deseja excluir o Grupo "${grupo?.nome}" e seus subgrupos?`,
      confirmLabel: 'Excluir Grupo',
      isDanger: true,
      action: () => {
        const updatedDatabase: InventoryDatabase = {
          ...database,
          grupos: database.grupos.filter(g => g.id !== grupoId),
          subgrupos: database.subgrupos.filter(sg => sg.grupoId !== grupoId)
        };
        updateDatabaseAndPersist(updatedDatabase);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddSubgrupo = (subgrupo: SubgrupoMaterial) => {
    const updatedDatabase: InventoryDatabase = {
      ...database,
      subgrupos: [...database.subgrupos, subgrupo]
    };
    updateDatabaseAndPersist(updatedDatabase);
  };

  const handleDeleteSubgrupo = (subgrupoId: string) => {
    const subgrupo = database.subgrupos.find(sg => sg.id === subgrupoId);
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Subgrupo',
      message: `Deseja excluir o Subgrupo "${subgrupo?.nome}"?`,
      confirmLabel: 'Excluir Subgrupo',
      isDanger: true,
      action: () => {
        const updatedDatabase: InventoryDatabase = {
          ...database,
          subgrupos: database.subgrupos.filter(sg => sg.id !== subgrupoId)
        };
        updateDatabaseAndPersist(updatedDatabase);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Reset to empty database (0 items)
  const handleResetToEmpty = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Resetar para Estrutura Vazia',
      message: 'Esta ação irá limpar todos os artigos, categorias e movimentações, deixando o sistema 100% vazio e pronto para novos testes do zero.\n\nDeseja continuar?',
      confirmLabel: 'Limpar Todo o Banco',
      isDanger: true,
      action: () => {
        const empty = resetDatabaseToEmpty();
        setDatabase(empty);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Restore initial 10 test items
  const handleResetToInitial = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restaurar 10 Materiais Homologados SENAI-SP',
      message: 'Esta ação irá restaurar os 10 materiais homologados com as descrições técnicas detalhadas e assinatura do Responsável Técnico Lucas.\n\nDeseja continuar?',
      confirmLabel: 'Restaurar Homologação',
      isDanger: false,
      action: () => {
        const initial = resetDatabaseToInitial();
        setDatabase(initial);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleNavigateToArticlesWithFilter = (tipoId?: string, grupoId?: string, subgrupoId?: string) => {
    setArticlesFilter({ tipoId, grupoId, subgrupoId });
    setCurrentTab('articles');
  };

  const itensCriticosCount = database.artigos.filter(a => a.quantidadeEstoque <= a.estoqueMinimo).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans text-neutral-900 selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenMovement={handleOpenMovement}
        onOpenCloudSync={() => setCurrentTab('cloud')}
        totalArtigos={database.artigos.length}
        itensBaixos={itensCriticosCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenMovement={handleOpenMovement}
          artigosCount={database.artigos.length}
          itensCriticosCount={itensCriticosCount}
          movimentacoesCount={database.movimentacoes.length}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              database={database}
              onNavigateTab={setCurrentTab}
              onOpenMovement={handleOpenMovement}
            />
          )}

          {currentTab === 'stock' && (
            <StockOverview
              artigos={database.artigos}
              tipos={database.tipos}
              grupos={database.grupos}
              subgrupos={database.subgrupos}
              onOpenMovement={handleOpenMovement}
              onNavigateToReports={() => setCurrentTab('reports')}
            />
          )}

          {currentTab === 'hierarchy' && (
            <HierarchyManager
              tipos={database.tipos}
              grupos={database.grupos}
              subgrupos={database.subgrupos}
              artigos={database.artigos}
              onAddTipo={handleAddTipo}
              onUpdateTipo={() => {}}
              onDeleteTipo={handleDeleteTipo}
              onAddGrupo={handleAddGrupo}
              onUpdateGrupo={() => {}}
              onDeleteGrupo={handleDeleteGrupo}
              onAddSubgrupo={handleAddSubgrupo}
              onUpdateSubgrupo={() => {}}
              onDeleteSubgrupo={handleDeleteSubgrupo}
              onNavigateToArticlesWithFilter={handleNavigateToArticlesWithFilter}
            />
          )}

          {currentTab === 'articles' && (
            <ArticlesManager
              artigos={database.artigos}
              tipos={database.tipos}
              grupos={database.grupos}
              subgrupos={database.subgrupos}
              onAddArtigo={handleAddArtigo}
              onUpdateArtigo={handleUpdateArtigo}
              onDeleteArtigo={handleDeleteArtigo}
              onOpenMovement={handleOpenMovement}
              initialFilter={articlesFilter}
            />
          )}

          {currentTab === 'movements' && (
            <MovementsHistory
              movimentacoes={database.movimentacoes}
              onOpenMovement={handleOpenMovement}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              database={database}
            />
          )}

          {currentTab === 'cloud' && (
            <CloudSyncView
              database={database}
              gitHubConfig={gitHubConfig}
              onUpdateDatabase={updateDatabaseAndPersist}
              onUpdateGitHubConfig={setGitHubConfig}
              onResetToEmpty={handleResetToEmpty}
              onResetToInitial={handleResetToInitial}
            />
          )}
        </main>

      </div>

      {/* Footer com Responsável Técnico */}
      <Footer />

      {/* Modal de Movimentações de Entrada / Saída */}
      <StockMovementModal
        isOpen={isMovementModalOpen}
        type={movementType}
        artigos={database.artigos}
        preSelectedArtigoId={movementArtigoId}
        onClose={() => setIsMovementModalOpen(false)}
        onConfirm={handleConfirmMovement}
      />

      {/* Modal de Confirmação Seguro */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
