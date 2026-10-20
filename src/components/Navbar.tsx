import React from 'react';
import { 
  Boxes, 
  PlusCircle, 
  MinusCircle, 
  Download, 
  Github, 
  HardDrive, 
  UserCheck, 
  Sparkles 
} from 'lucide-react';
import { RESPONSAVEL_TECNICO_NOME } from '../data/initialData';

interface NavbarProps {
  onOpenMovement: (type: 'ENTRADA' | 'SAIDA') => void;
  onOpenCloudSync: () => void;
  totalArtigos: number;
  itensBaixos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMovement,
  onOpenCloudSync,
  totalArtigos,
  itensBaixos
}) => {
  return (
    <header className="bg-neutral-900 border-b-4 border-red-600 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Branding SENAI SP */}
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white font-extrabold text-2xl tracking-tighter px-3 py-1 rounded shadow-md border border-red-500 flex items-center gap-1.5">
              <span>SENAI</span>
              <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded font-mono font-bold tracking-normal">SP</span>
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                SIGE <span className="text-xs font-normal text-gray-400">| Sistema Integrado de Gestão de Estoques</span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Persistência Ativa
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">
                  {totalArtigos} materiais cadastrados
                </span>
                {itensBaixos > 0 && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-red-950 text-red-300 border border-red-700">
                      {itensBaixos} crítico(s)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Technical Lead Badge & Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Responsável Técnico Badge */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-800/90 border border-neutral-700 px-3 py-1.5 rounded-md text-xs text-gray-200">
              <UserCheck className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-[10px] text-gray-400 block leading-3 uppercase font-semibold">Responsável Técnico</span>
                <span className="font-bold text-white text-xs">{RESPONSAVEL_TECNICO_NOME}</span>
              </div>
            </div>

            {/* Quick Movement Buttons */}
            <div className="flex items-center gap-1.5 no-print">
              <button
                onClick={() => onOpenMovement('ENTRADA')}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-md shadow transition-colors cursor-pointer"
                title="Registrar Nova Entrada de Material"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Entrada</span>
              </button>

              <button
                onClick={() => onOpenMovement('SAIDA')}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-md shadow transition-colors cursor-pointer"
                title="Registrar Saída de Material do Estoque"
              >
                <MinusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Saída</span>
              </button>

              <button
                onClick={onOpenCloudSync}
                className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-200 text-xs font-medium px-3 py-2 rounded-md shadow transition-colors cursor-pointer"
                title="Sincronização com GitHub e Google Drive"
              >
                <Github className="w-4 h-4 text-gray-300" />
                <span className="hidden lg:inline">Nuvem / Sync</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
