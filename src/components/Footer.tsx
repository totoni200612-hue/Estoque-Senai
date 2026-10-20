import React from 'react';
import { ShieldCheck, User, Building, Database, GitBranch } from 'lucide-react';
import { RESPONSAVEL_TECNICO_NOME, RESPONSAVEL_TECNICO_TITULO } from '../data/initialData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t-2 border-red-600 text-gray-400 text-xs py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* SENAI SP Branding info */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="bg-red-600 text-white font-extrabold text-sm px-2 py-0.5 rounded tracking-tight">
            SENAI-SP
          </div>
          <div>
            <p className="text-white font-bold text-xs">
              Serviço Nacional de Aprendizagem Industrial - Departamento Regional de São Paulo
            </p>
            <p className="text-gray-400 text-[11px]">
              SIGE | Sistema de Controle de Estoques & Gestão de Almoxarifados Técnicos
            </p>
          </div>
        </div>

        {/* Technical Lead Responsibility Badge (Prominent Requirement) */}
        <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-lg p-2.5 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 block">
              Responsável Técnico pelo Sistema
            </span>
            <span className="font-bold text-white text-xs block">
              {RESPONSAVEL_TECNICO_TITULO}
            </span>
            <span className="text-[11px] text-gray-400 block">
              Homologação de 10 Materiais Oficiais & Validação de Regras de Inventário
            </span>
          </div>
        </div>

        {/* Storage status & Copyright */}
        <div className="text-center md:text-right text-[11px] text-gray-500">
          <p className="flex items-center justify-center md:justify-end gap-1.5 text-gray-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Persistência Local + Sincronização em Nuvem (GitHub & Google Drive)
          </p>
          <p className="mt-0.5">
            © {currentYear} SENAI-SP. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};
