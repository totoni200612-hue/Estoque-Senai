import { TipoMaterial, GrupoMaterial, SubgrupoMaterial, ArtigoMaterial } from '../types/inventory';

/**
 * Gera o próximo código numérico sequencial formatado com zeros à esquerda
 */
export function getNextSequence(existingCodes: string[], prefix: string, padLength: number = 2): string {
  let maxSeq = 0;
  
  existingCodes.forEach(code => {
    // Procura número após o prefixo ou no final da string
    const targetPart = prefix ? code.replace(prefix, '') : code;
    const match = targetPart.match(/\d+$/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextNum = maxSeq + 1;
  return `${prefix}${String(nextNum).padStart(padLength, '0')}`;
}

export function generateTipoCode(existingTipos: TipoMaterial[]): string {
  const codes = existingTipos.map(t => t.codigo);
  return getNextSequence(codes, '', 2);
}

export function generateGrupoCode(tipoCodigo: string, existingGrupos: GrupoMaterial[]): string {
  const prefix = `${tipoCodigo}.`;
  const siblingCodes = existingGrupos
    .filter(g => g.codigo.startsWith(prefix))
    .map(g => g.codigo);
  return getNextSequence(siblingCodes, prefix, 2);
}

export function generateSubgrupoCode(grupoCodigo: string, existingSubgrupos: SubgrupoMaterial[]): string {
  const prefix = `${grupoCodigo}.`;
  const siblingCodes = existingSubgrupos
    .filter(sg => sg.codigo.startsWith(prefix))
    .map(sg => sg.codigo);
  return getNextSequence(siblingCodes, prefix, 2);
}

export function generateArtigoCode(subgrupoCodigo: string, existingArtigos: ArtigoMaterial[]): string {
  const prefix = `SENAI-${subgrupoCodigo}.`;
  const siblingCodes = existingArtigos
    .filter(a => a.codigo.startsWith(prefix))
    .map(a => a.codigo);
  return getNextSequence(siblingCodes, prefix, 3);
}

export function isCodeUnique(code: string, list: { codigo: string; id?: string }[], currentId?: string): boolean {
  return !list.some(item => item.codigo.trim().toUpperCase() === code.trim().toUpperCase() && item.id !== currentId);
}
