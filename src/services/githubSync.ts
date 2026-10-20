import { InventoryDatabase, GitHubSyncConfig } from '../types/inventory';
import { parseJsonDatabase } from './storage';

export interface GitHubSyncResult {
  success: boolean;
  gistId?: string;
  gistUrl?: string;
  message: string;
  database?: InventoryDatabase;
}

const GIST_FILENAME = 'senai-sp-estoque-db.json';

/**
 * Envia o banco de dados atual para o GitHub Gist
 */
export async function pushToGitHubGist(
  database: InventoryDatabase,
  token: string,
  gistId?: string,
  isPublic: boolean = false
): Promise<GitHubSyncResult> {
  if (!token || token.trim() === '') {
    return {
      success: false,
      message: 'Token de Acesso Pessoal (PAT) do GitHub é obrigatório para sincronização.'
    };
  }

  const payload = {
    description: `SENAI-SP | Backup do Banco de Dados de Controle de Estoques - Homologação: Lucas`,
    public: isPublic,
    files: {
      [GIST_FILENAME]: {
        content: JSON.stringify(database, null, 2)
      }
    }
  };

  try {
    const isUpdate = Boolean(gistId && gistId.trim() !== '');
    const url = isUpdate
      ? `https://api.github.com/gists/${gistId}`
      : `https://api.github.com/gists`;
    
    const method = isUpdate ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Falha na API do GitHub (${response.status}): ${errorJson.message || response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      gistId: data.id,
      gistUrl: data.html_url,
      message: isUpdate
        ? `Sincronização com GitHub concluída com sucesso (Gist ${data.id.substring(0, 8)}...)`
        : `Novo repositório Gist criado com sucesso no GitHub!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao conectar ao GitHub: ${err.message || String(err)}`
    };
  }
}

/**
 * Puxa a versão mais recente do banco de dados a partir do GitHub Gist
 */
export async function pullFromGitHubGist(
  gistId: string,
  token?: string
): Promise<GitHubSyncResult> {
  if (!gistId || gistId.trim() === '') {
    return {
      success: false,
      message: 'Gist ID é obrigatório para restaurar os dados do GitHub.'
    };
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    if (token && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const response = await fetch(`https://api.github.com/gists/${gistId.trim()}`, {
      headers
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Erro ao buscar Gist (${response.status}): ${errData.message || response.statusText}`
      };
    }

    const data = await response.json();
    const file = data.files?.[GIST_FILENAME] || Object.values(data.files || {})[0] as any;

    if (!file || !file.content) {
      return {
        success: false,
        message: `Arquivo ${GIST_FILENAME} não encontrado dentro do Gist.`
      };
    }

    const database = parseJsonDatabase(file.content);
    return {
      success: true,
      gistId: data.id,
      gistUrl: data.html_url,
      database,
      message: `Dados recuperados do GitHub com sucesso! ${database.artigos.length} artigos carregados.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha ao processar dados do GitHub: ${err.message || String(err)}`
    };
  }
}
