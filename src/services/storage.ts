import { InventoryDatabase, GitHubSyncConfig } from '../types/inventory';
import { INITIAL_DATABASE, EMPTY_DATABASE } from '../data/initialData';

const DB_STORAGE_KEY = 'senai_sp_inventory_database_v1';
const GITHUB_STORAGE_KEY = 'senai_sp_github_sync_config_v1';

export function loadDatabase(): InventoryDatabase {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      // Inicializa com a base contendo os 10 materiais homologados pelo Responsável Técnico
      saveDatabase(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.artigos)) {
      saveDatabase(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
    return parsed;
  } catch (err) {
    console.error('Erro ao carregar banco de dados local:', err);
    return INITIAL_DATABASE;
  }
}

export function saveDatabase(db: InventoryDatabase): void {
  try {
    const dataToSave: InventoryDatabase = {
      ...db,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

export function resetDatabaseToEmpty(): InventoryDatabase {
  const empty: InventoryDatabase = {
    ...EMPTY_DATABASE,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(empty);
  return empty;
}

export function resetDatabaseToInitial(): InventoryDatabase {
  saveDatabase(INITIAL_DATABASE);
  return INITIAL_DATABASE;
}

export function exportDatabaseAsJsonFile(db: InventoryDatabase): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `SENAI_SP_Estoque_${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseJsonDatabase(jsonString: string): InventoryDatabase {
  const parsed = JSON.parse(jsonString);
  if (!parsed.artigos || !parsed.tipos || !parsed.grupos || !parsed.subgrupos || !parsed.movimentacoes) {
    throw new Error("Arquivo JSON inválido: faltam tabelas obrigatórias de estoque.");
  }
  return parsed;
}

export function exportInventoryToCsv(db: InventoryDatabase): void {
  const rows = [
    [
      "Código",
      "Nome do Artigo",
      "Tipo",
      "Grupo",
      "Subgrupo",
      "Unidade",
      "Localização",
      "Qtd. em Estoque",
      "Estoque Mínimo",
      "Custo Unitário (R$)",
      "Valor Total (R$)",
      "Status",
      "Descrição Técnica"
    ]
  ];

  db.artigos.forEach(artigo => {
    const tipo = db.tipos.find(t => t.id === artigo.tipoId)?.nome || "N/A";
    const grupo = db.grupos.find(g => g.id === artigo.grupoId)?.nome || "N/A";
    const subgrupo = db.subgrupos.find(sg => sg.id === artigo.subgrupoId)?.nome || "N/A";
    const valorTotal = (artigo.quantidadeEstoque * artigo.custoUnitario).toFixed(2);
    
    let status = "NORMAL";
    if (artigo.quantidadeEstoque <= 0) status = "ZERADO";
    else if (artigo.quantidadeEstoque <= artigo.estoqueMinimo) status = "BAIXO";

    rows.push([
      artigo.codigo,
      artigo.nome.replace(/"/g, '""'),
      tipo.replace(/"/g, '""'),
      grupo.replace(/"/g, '""'),
      subgrupo.replace(/"/g, '""'),
      artigo.unidade,
      artigo.localizacao.replace(/"/g, '""'),
      artigo.quantidadeEstoque.toString(),
      artigo.estoqueMinimo.toString(),
      artigo.custoUnitario.toFixed(2),
      valorTotal,
      status,
      artigo.descricao.replace(/"/g, '""')
    ]);
  });

  const csvContent = "\uFEFF" + rows.map(e => e.map(cell => `"${cell}"`).join(";")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `SENAI_SP_Relatorio_Estoque_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function loadGitHubConfig(): GitHubSyncConfig {
  try {
    const raw = localStorage.getItem(GITHUB_STORAGE_KEY);
    if (!raw) {
      return {
        enabled: false,
        token: '',
        gistId: '',
        isPublicGist: false,
        autoSync: false,
        lastSyncTime: null,
        lastSyncStatus: 'idle',
        lastErrorMessage: null
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler config do GitHub:', err);
    return {
      enabled: false,
      token: '',
      gistId: '',
      isPublicGist: false,
      autoSync: false,
      lastSyncTime: null,
      lastSyncStatus: 'idle',
      lastErrorMessage: null
    };
  }
}

export function saveGitHubConfig(cfg: GitHubSyncConfig): void {
  try {
    localStorage.setItem(GITHUB_STORAGE_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Erro ao salvar config do GitHub:', err);
  }
}
