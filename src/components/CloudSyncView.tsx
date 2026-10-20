import React, { useState } from 'react';
import { 
  Cloud, 
  Github, 
  HardDrive, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  FileJson, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Info 
} from 'lucide-react';
import { InventoryDatabase, GitHubSyncConfig } from '../types/inventory';
import { pushToGitHubGist, pullFromGitHubGist } from '../services/githubSync';
import { 
  saveGitHubConfig, 
  exportDatabaseAsJsonFile, 
  parseJsonDatabase 
} from '../services/storage';
import { RESPONSAVEL_TECNICO_TITULO, RESPONSAVEL_TECNICO_NOME } from '../data/initialData';

interface CloudSyncViewProps {
  database: InventoryDatabase;
  gitHubConfig: GitHubSyncConfig;
  onUpdateDatabase: (newDb: InventoryDatabase) => void;
  onUpdateGitHubConfig: (newCfg: GitHubSyncConfig) => void;
  onResetToEmpty: () => void;
  onResetToInitial: () => void;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  database,
  gitHubConfig,
  onUpdateDatabase,
  onUpdateGitHubConfig,
  onResetToEmpty,
  onResetToInitial
}) => {
  const [token, setToken] = useState<string>(gitHubConfig.token || '');
  const [gistId, setGistId] = useState<string>(gitHubConfig.gistId || '');
  const [isPublicGist, setIsPublicGist] = useState<boolean>(gitHubConfig.isPublicGist || false);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Manipular Push para GitHub
  const handlePushToGitHub = async () => {
    if (!token.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Insira seu GitHub Personal Access Token (PAT) com permissão "gist".'
      });
      return;
    }

    setSyncLoading(true);
    setStatusMessage({ type: 'info', text: 'Conectando à API do GitHub e enviando dados de inventário...' });

    const result = await pushToGitHubGist(database, token, gistId, isPublicGist);
    setSyncLoading(false);

    if (result.success && result.gistId) {
      setGistId(result.gistId);
      const updatedCfg: GitHubSyncConfig = {
        ...gitHubConfig,
        enabled: true,
        token: token.trim(),
        gistId: result.gistId,
        isPublicGist,
        lastSyncTime: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastErrorMessage: null
      };
      onUpdateGitHubConfig(updatedCfg);
      saveGitHubConfig(updatedCfg);

      setStatusMessage({
        type: 'success',
        text: `${result.message} Acessível em: ${result.gistUrl}`
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message
      });
    }
  };

  // Manipular Pull do GitHub
  const handlePullFromGitHub = async () => {
    if (!gistId.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Informe o Gist ID para recuperar os dados do GitHub.'
      });
      return;
    }

    setSyncLoading(true);
    setStatusMessage({ type: 'info', text: 'Buscando versão mais recente no GitHub Gist...' });

    const result = await pullFromGitHubGist(gistId, token);
    setSyncLoading(false);

    if (result.success && result.database) {
      onUpdateDatabase(result.database);
      const updatedCfg: GitHubSyncConfig = {
        ...gitHubConfig,
        lastSyncTime: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastErrorMessage: null
      };
      onUpdateGitHubConfig(updatedCfg);
      saveGitHubConfig(updatedCfg);

      setStatusMessage({
        type: 'success',
        text: result.message
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message
      });
    }
  };

  // Upload de arquivo JSON para Google Drive / Local
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseJsonDatabase(text);
        onUpdateDatabase(parsed);
        setStatusMessage({
          type: 'success',
          text: `Arquivo restaurado com sucesso! ${parsed.artigos.length} artigos carregados.`
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: `Falha ao processar arquivo JSON: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <Cloud className="w-4 h-4" />
            Persistência em Nuvem e Backup
          </div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            Sincronização em Nuvem: GitHub & Google Drive
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Mantenha seus dados salvos com versionamento no GitHub ou integre o armazenamento via Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-neutral-900 text-white px-3 py-2 rounded-lg font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Persistência Local Automática: ATIVA</span>
        </div>
      </div>

      {/* Alerta de Status / Mensagens */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 shadow-xs ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : statusMessage.type === 'error'
            ? 'bg-red-50 border-red-300 text-red-900'
            : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : statusMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
          )}
          <div className="flex-1 font-medium leading-relaxed">
            {statusMessage.text}
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Principal: GitHub e Google Drive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Sincronização com GitHub */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-neutral-900 text-white rounded-lg">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Sincronização em Nuvem via GitHub
                  </h3>
                  <p className="text-xs text-gray-500">
                    Versionamento em nuvem usando a API oficial de Gists do GitHub.
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                API Oficial
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center justify-between">
                  <span>GitHub Personal Access Token (PAT)</span>
                  <a 
                    href="https://github.com/settings/tokens/new?scopes=gist&description=SENAI-SP-Controle-Estoque" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-red-600 hover:underline flex items-center gap-0.5"
                  >
                    Gerar Token no GitHub <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 font-mono"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Requer apenas permissão de escopo: <code className="bg-gray-100 px-1 py-0.2 rounded font-mono">gist</code>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Gist ID (Opcional - preenchido automaticamente ao sincronizar)
                </label>
                <input
                  type="text"
                  value={gistId}
                  onChange={(e) => setGistId(e.target.value)}
                  placeholder="Ex: a1b2c3d4e5f67890..."
                  className="w-full text-xs py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 font-mono"
                />
              </div>

              {gitHubConfig.lastSyncTime && (
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600 flex items-center justify-between">
                  <span>Última sincronização:</span>
                  <span className="font-bold text-gray-800 font-mono">
                    {new Date(gitHubConfig.lastSyncTime).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handlePushToGitHub}
              disabled={syncLoading}
              className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
              <span>Salvar / Enviar para GitHub (Push)</span>
            </button>

            <button
              onClick={handlePullFromGitHub}
              disabled={syncLoading || !gistId.trim()}
              className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-40"
              title="Carregar dados do GitHub para o aplicativo"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span>Carregar do GitHub</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Armazenamento e Backup Google Drive */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600 text-white rounded-lg">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Armazenamento & Backup Google Drive
                  </h3>
                  <p className="text-xs text-gray-500">
                    Exportação direta e importação de arquivo JSON estruturado.
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded">
                Google Drive JSON
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-gray-600">
              <p className="leading-relaxed">
                Você pode salvar o banco de dados do controle de estoques diretamente no seu <strong>Google Drive</strong>:
              </p>

              <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <li>Clique em <strong>"Baixar Arquivo JSON para Google Drive"</strong>.</li>
                <li>Salve o arquivo <code className="font-mono text-red-600">SENAI_SP_Estoque.json</code> na pasta do seu Google Drive.</li>
                <li>Ao abrir em outro computador ou navegador, use o botão <strong>"Carregar Arquivo"</strong> para restaurar todos os dados.</li>
              </ol>

              <div className="p-3 bg-red-50/60 rounded-lg border border-red-200 text-red-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  O arquivo gerado é 100% compatível e preserva toda a hierarquia, custos e auditoria.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => exportDatabaseAsJsonFile(database)}
              className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo para Google Drive</span>
            </button>

            <label className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors border border-gray-300">
              <Upload className="w-4 h-4 text-gray-600" />
              <span>Carregar do Drive</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

      </div>

      {/* Ferramentas de Teste e Validação do Banco de Dados (Requisito Explícito) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
          <Database className="w-4 h-4" />
          Ambiente de Testes e Validação do Usuário
        </div>
        <h3 className="text-base font-extrabold text-neutral-900">
          Controle de Cargas e Estrutura de Testes
        </h3>
        <p className="text-xs text-gray-500 mt-1 max-w-3xl">
          Conforme requisitos do projeto, você pode alternar entre uma <strong>estrutura vazia pronta para testes do zero</strong> e a <strong>carga homologada dos 10 materiais do SENAI-SP</strong> cadastrados pelo Responsável Técnico {RESPONSAVEL_TECNICO_NOME}.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Opção 1: Resetar para Banco Vazio */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-gray-900 text-xs block">
                1. Estrutura Vazia (Pronta para Teste)
              </span>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                Limpa todos os artigos, categorias e movimentações atuais, deixando o sistema 100% vazio para você testar novos cadastros do zero.
              </p>
            </div>
            <button
              onClick={onResetToEmpty}
              className="mt-4 py-2 px-3 bg-white hover:bg-red-50 text-red-600 border border-red-300 hover:border-red-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Resetar para Banco Vazio (0 itens)</span>
            </button>
          </div>

          {/* Opção 2: Carga Homologada 10 Materiais SENAI */}
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-red-950 text-xs block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                2. Carga Homologada (10 Materiais - Lucas)
              </span>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                Restaura o conjunto oficial de 10 materiais técnicos de mecânica, elétrica e metrologia com descrições detalhadas e assinatura de verificação.
              </p>
            </div>
            <button
              onClick={onResetToInitial}
              className="mt-4 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar 10 Materiais Homologados</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
