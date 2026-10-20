export interface TipoMaterial {
  id: string;
  codigo: string; // Ex: '01' ou 'MAT'
  nome: string; // Ex: 'Materiais de Consumo'
  descricao: string;
  dataCriacao: string;
}

export interface GrupoMaterial {
  id: string;
  tipoId: string;
  codigo: string; // Ex: '01.01' ou 'GRP-01'
  nome: string; // Ex: 'Fixadores e Elementos Mecânicos'
  descricao: string;
  dataCriacao: string;
}

export interface SubgrupoMaterial {
  id: string;
  tipoId: string;
  grupoId: string;
  codigo: string; // Ex: '01.01.01' ou 'SUB-01'
  nome: string; // Ex: 'Parafusos e Elementos Roscados'
  descricao: string;
  dataCriacao: string;
}

export type StatusEstoque = 'NORMAL' | 'BAIXO' | 'ZERADO' | 'EXCESSO';

export interface ArtigoMaterial {
  id: string;
  tipoId: string;
  grupoId: string;
  subgrupoId: string;
  codigo: string; // Ex: 'SENAI-01.01.01.001'
  nome: string;
  descricao: string; // Detalhada com "- Lucas" para validação
  unidade: string; // UN, CX, KG, M, L, PC, PAR, BR, GL
  localizacao: string; // Ex: 'Almoxarifado Mecânica Geral - Prateleira M-03 - Gaveta 12'
  quantidadeEstoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  custoUnitario: number;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

export interface MovimentacaoEstoque {
  id: string;
  artigoId: string;
  artigoCodigo: string;
  artigoNome: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  quantidadeAnterior: number;
  quantidadePosterior: number;
  dataHora: string;
  motivo: string;
  documentoRef?: string;
  responsavel: string;
  localizacao: string;
  custoUnitario?: number;
  observacoes?: string;
}

export interface InventoryDatabase {
  version: string;
  updatedAt: string;
  responsavelTecnico: string;
  unidadeSenai: string;
  tipos: TipoMaterial[];
  grupos: GrupoMaterial[];
  subgrupos: SubgrupoMaterial[];
  artigos: ArtigoMaterial[];
  movimentacoes: MovimentacaoEstoque[];
}

export interface GitHubSyncConfig {
  enabled: boolean;
  token: string;
  gistId: string;
  isPublicGist: boolean;
  autoSync: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastErrorMessage: string | null;
}
