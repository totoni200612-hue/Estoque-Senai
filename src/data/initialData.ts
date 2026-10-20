import { InventoryDatabase, TipoMaterial, GrupoMaterial, SubgrupoMaterial, ArtigoMaterial, MovimentacaoEstoque } from '../types/inventory';

export const RESPONSAVEL_TECNICO_NOME = "Lucas";
export const RESPONSAVEL_TECNICO_TITULO = "Lucas - Engenheiro de Software & Responsável Técnico (SENAI-SP)";

export const EMPTY_DATABASE: InventoryDatabase = {
  version: "1.0.0",
  updatedAt: new Date().toISOString(),
  responsavelTecnico: RESPONSAVEL_TECNICO_TITULO,
  unidadeSenai: "SENAI-SP | Escola e Faculdade de Tecnologia SENAI",
  tipos: [],
  grupos: [],
  subgrupos: [],
  artigos: [],
  movimentacoes: []
};

// 10 Materiais Oficiais homologados pelo Responsável Técnico Lucas
const initialTipos: TipoMaterial[] = [
  {
    id: "tip-01",
    codigo: "01",
    nome: "Materiais de Consumo e Ajustagem",
    descricao: "Insumos, fixadores, fluidos e abrasivos para oficinas mecânicas e usinagem.",
    dataCriacao: "2026-09-29T10:00:00Z"
  },
  {
    id: "tip-02",
    codigo: "02",
    nome: "Ferramental e Instrumentos de Precisão",
    descricao: "Insertos, pastilhas intercambiáveis, ferramentas de corte e instrumentos de metrologia.",
    dataCriacao: "2026-09-29T10:00:00Z"
  },
  {
    id: "tip-03",
    codigo: "03",
    nome: "Eletroeletrônica e Automação Industrial",
    descricao: "Componentes de acionamento, contatores, sensores e controladores lógicos programáveis.",
    dataCriacao: "2026-09-29T10:00:00Z"
  },
  {
    id: "tip-04",
    codigo: "04",
    nome: "Segurança do Trabalho e EPI",
    descricao: "Equipamentos de Proteção Individual para oficinas de soldagem, usinagem e química.",
    dataCriacao: "2026-09-29T10:00:00Z"
  },
  {
    id: "tip-05",
    codigo: "05",
    nome: "Matéria-Prima e Perfilados Metálicos",
    descricao: "Barras de aço, perfis laminados, tarugos e chapas para processos de manufatura.",
    dataCriacao: "2026-09-29T10:00:00Z"
  }
];

const initialGrupos: GrupoMaterial[] = [
  {
    id: "grp-01-01",
    tipoId: "tip-01",
    codigo: "01.01",
    nome: "Fixadores e Elementos Roscados",
    descricao: "Parafusos, porcas, arruelas e prisioneiros normalizados DIN/ISO.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-01-02",
    tipoId: "tip-01",
    codigo: "01.02",
    nome: "Lubrificantes e Fluidos Industriais",
    descricao: "Óleos de corte solúveis, graxas sintéticas e protetivos contra corrosão.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-01-03",
    tipoId: "tip-01",
    codigo: "01.03",
    nome: "Abrasivos e Acabamento Superficial",
    descricao: "Discos de corte, rebolos, lixas técnicas e escovas de aço.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-02-01",
    tipoId: "tip-02",
    codigo: "02.01",
    nome: "Ferramentas de Usinagem Intercambiáveis",
    descricao: "Pastilhas de metal duro, suportes de torneamento e fresamento CNC.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-02-02",
    tipoId: "tip-02",
    codigo: "02.02",
    nome: "Instrumentos de Metrologia e Controle",
    descricao: "Paquímetros digitais, micrômetros, relógios comparadores e blocos padrão.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-03-01",
    tipoId: "tip-03",
    codigo: "03.01",
    nome: "Dispositivos de Comando e Potência",
    descricao: "Contatores magnéticos, relés de sobrecarga e disjuntores-motor.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-03-02",
    tipoId: "tip-03",
    codigo: "03.02",
    nome: "Sensores e Instrumentação Eletrônica",
    descricao: "Sensores indutivos, fotoelétricos, encoders e chaves fim de curso.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-04-01",
    tipoId: "tip-04",
    codigo: "04.01",
    nome: "Proteção Facial e Visual",
    descricao: "Óculos de proteção ampla visão, protetores faciais e máscaras de solda.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-04-02",
    tipoId: "tip-04",
    codigo: "04.02",
    nome: "Proteção para Membros Superiores",
    descricao: "Luvas de raspa, vaqueta, nitrílicas e mangotes térmicos.",
    dataCriacao: "2026-09-29T10:05:00Z"
  },
  {
    id: "grp-05-01",
    tipoId: "tip-05",
    codigo: "05.01",
    nome: "Aços Carbono e Construção Mecânica",
    descricao: "Barras redondas laminadas, trefiladas e perfis estruturais SAE.",
    dataCriacao: "2026-09-29T10:05:00Z"
  }
];

const initialSubgrupos: SubgrupoMaterial[] = [
  {
    id: "sub-01-01-01",
    tipoId: "tip-01",
    grupoId: "grp-01-01",
    codigo: "01.01.01",
    nome: "Parafusos Sextavados Aço Inox",
    descricao: "Parafusos sextavados rosca métrica em aço inoxidável 304 e 316.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-01-02-01",
    tipoId: "tip-01",
    grupoId: "grp-01-02",
    codigo: "01.02.01",
    nome: "Fluidos de Corte Sintéticos",
    descricao: "Óleos solúveis sintéticos e semissintéticos para centros de usinagem.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-01-03-01",
    tipoId: "tip-01",
    grupoId: "grp-01-03",
    codigo: "01.03.01",
    nome: "Discos de Corte Extra Finos",
    descricao: "Discos abrasivos finos para corte rápido em aços carbono e inoxidáveis.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-02-01-01",
    tipoId: "tip-02",
    grupoId: "grp-02-01",
    codigo: "02.01.01",
    nome: "Pastilhas de Torneamento ISO",
    descricao: "Insertos intercambiáveis padrão CNMG, WNMG e TNMG de alto rendimento.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-02-02-01",
    tipoId: "tip-02",
    grupoId: "grp-02-02",
    codigo: "02.02.01",
    nome: "Paquímetros Digitais Industriais",
    descricao: "Paquímetros com visor digital, IP67 e calibração de fábrica.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-03-01-01",
    tipoId: "tip-03",
    grupoId: "grp-03-01",
    codigo: "03.01.01",
    nome: "Contatores Tripolares Industriais",
    descricao: "Contatores para manobra de motores trifásicos em 220V e 380V.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-03-02-01",
    tipoId: "tip-03",
    grupoId: "grp-03-02",
    codigo: "03.02.01",
    nome: "Sensores Indutivos de Proximidade",
    descricao: "Sensores de proximidade indutivos cilíndricos padrão M12 e M18.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-04-01-01",
    tipoId: "tip-04",
    grupoId: "grp-04-01",
    codigo: "04.01.01",
    nome: "Óculos de Proteção Policarbonato",
    descricao: "Óculos de segurança com tratamento antirrisco e proteção UV.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-04-02-01",
    tipoId: "tip-04",
    grupoId: "grp-04-02",
    codigo: "04.02.01",
    nome: "Luvas de Proteção para Soldador",
    descricao: "Luvas em vaqueta e raspa ignífuga com cano longo de proteção.",
    dataCriacao: "2026-09-29T10:10:00Z"
  },
  {
    id: "sub-05-01-01",
    tipoId: "tip-05",
    grupoId: "grp-05-01",
    codigo: "05.01.01",
    nome: "Barras Redondas Laminadas SAE 1045",
    descricao: "Aço ao carbono médio para fabricação de eixos, pinos e componentes usinados.",
    dataCriacao: "2026-09-29T10:10:00Z"
  }
];

export const INITIAL_ARTIGOS: ArtigoMaterial[] = [
  {
    id: "art-01",
    tipoId: "tip-01",
    grupoId: "grp-01-01",
    subgrupoId: "sub-01-01-01",
    codigo: "SENAI-01.01.01.001",
    nome: "Parafuso Sextavado M10 x 50mm Aço Inox 316 Passo 1.5mm",
    descricao: "Parafuso de cabeça sextavada rosca métrica integral M10, comprimento 50mm, em aço inoxidável austenítico grau 316 (resistente a corrosão química e marítima), norma DIN 933. Ideal para fixação estrutural e bancadas de usinagem mecânica industrial. - Lucas",
    unidade: "UN",
    localizacao: "Almoxarifado Mecânica Geral - Prateleira M-03 - Gaveta 12",
    quantidadeEstoque: 240,
    estoqueMinimo: 50,
    estoqueMaximo: 500,
    custoUnitario: 4.75,
    dataCriacao: "2026-09-29T10:15:00Z",
    ultimaAtualizacao: "2026-09-29T10:15:00Z"
  },
  {
    id: "art-02",
    tipoId: "tip-01",
    grupoId: "grp-01-02",
    subgrupoId: "sub-01-02-01",
    codigo: "SENAI-01.02.01.001",
    nome: "Óleo Solúvel Sintético Biostável para Usinagem 20L",
    descricao: "Fluido de corte hidrossolúvel de base sintética de alta performance com aditivos de extrema pressão (EP), bactericida biostável e inibidor de corrosão para centros de usinagem CNC e tornos convencionais. Embalagem balde com 20 litros. - Lucas",
    unidade: "GL",
    localizacao: "Galpão de Usinagem CNC - Baia de Químicos Q-01 - Nível Solo",
    quantidadeEstoque: 12,
    estoqueMinimo: 3,
    estoqueMaximo: 25,
    custoUnitario: 380.00,
    dataCriacao: "2026-09-29T10:20:00Z",
    ultimaAtualizacao: "2026-09-29T10:20:00Z"
  },
  {
    id: "art-03",
    tipoId: "tip-02",
    grupoId: "grp-02-01",
    subgrupoId: "sub-02-01-01",
    codigo: "SENAI-02.01.01.001",
    nome: "Inserto de Metal Duro CNMG 120408-PM Classe P25",
    descricao: "Pastilha intercambiável para torneamento externo e faceamento em aços carbono e ligados, geometria rômbica 80 graus, quebra-cavacos PM com revestimento TiCN + Al2O3 via CVD. Caixa com 10 unidades originais de precisão ISO. - Lucas",
    unidade: "CX",
    localizacao: "Ferramentaria Central - Armário Blindado F-02 - Prateleira 4",
    quantidadeEstoque: 18,
    estoqueMinimo: 5,
    estoqueMaximo: 40,
    custoUnitario: 195.50,
    dataCriacao: "2026-09-29T10:25:00Z",
    ultimaAtualizacao: "2026-09-29T10:25:00Z"
  },
  {
    id: "art-04",
    tipoId: "tip-02",
    grupoId: "grp-02-02",
    subgrupoId: "sub-02-02-01",
    codigo: "SENAI-02.02.01.001",
    nome: "Paquímetro Digital de Precisão 150mm Resolução 0,01mm Mitutoyo",
    descricao: "Instrumento de metrologia dimensional em aço inoxidável temperado, display LCD de alto contraste, escala com proteção IP67 contra respingos de óleo e poeira, saída de dados para calibração rastreável RBC/INMETRO. - Lucas",
    unidade: "UN",
    localizacao: "Laboratório de Metrologia - Armário Climatizado MET-01 - Gaveta A",
    quantidadeEstoque: 10,
    estoqueMinimo: 4,
    estoqueMaximo: 20,
    custoUnitario: 685.00,
    dataCriacao: "2026-09-29T10:30:00Z",
    ultimaAtualizacao: "2026-09-29T10:30:00Z"
  },
  {
    id: "art-05",
    tipoId: "tip-03",
    grupoId: "grp-03-01",
    subgrupoId: "sub-03-01-01",
    codigo: "SENAI-03.01.01.001",
    nome: "Contator Tripolar de Potência 32A Bobina 220Vca 1NA+1NF Weg",
    descricao: "Contator magnético industrial modelo CWM32 para acionamento de motores elétricos trifásicos até 15CV em 220V/AC-3, fixação em trilho DIN 35mm ou parafusos, contatos auxiliares incorporados 1NA + 1NF conforme norma IEC/EN 60947. - Lucas",
    unidade: "UN",
    localizacao: "Almoxarifado Eletroeletrônica - Prateleira E-04 - Gaveta 08",
    quantidadeEstoque: 25,
    estoqueMinimo: 6,
    estoqueMaximo: 50,
    custoUnitario: 142.30,
    dataCriacao: "2026-09-29T10:35:00Z",
    ultimaAtualizacao: "2026-09-29T10:35:00Z"
  },
  {
    id: "art-06",
    tipoId: "tip-03",
    grupoId: "grp-03-02",
    subgrupoId: "sub-03-02-01",
    codigo: "SENAI-03.02.01.001",
    nome: "Sensor de Proximidade Indutivo M18 PNP Normal Aberto Faceado 5mm",
    descricao: "Sensor cilíndrico corpo metálico latão niquelado rosca M18, alcance nominal 5mm, alimentação 10 a 30Vcc, sinalização por LED posterior, grau de proteção IP67, conexão com cabo injetado de 2 metros 3 fios. - Lucas",
    unidade: "UN",
    localizacao: "Laboratório de Automação e Mecatrônica - Armário AUT-03 - Gaveta 02",
    quantidadeEstoque: 14,
    estoqueMinimo: 4,
    estoqueMaximo: 30,
    custoUnitario: 118.00,
    dataCriacao: "2026-09-29T10:40:00Z",
    ultimaAtualizacao: "2026-09-29T10:40:00Z"
  },
  {
    id: "art-07",
    tipoId: "tip-04",
    grupoId: "grp-04-01",
    subgrupoId: "sub-04-01-01",
    codigo: "SENAI-04.01.01.001",
    nome: "Óculos de Proteção Antirrisco e Antiembaçante com Proteção UV CA 10.344",
    descricao: "Equipamento de Proteção Individual em policarbonato óptico incolor de alta densidade, hastes ajustáveis com ventilação indireta, tratamento antirrisco e camada antiembaçante, com Certificado de Aprovação do MTE emitido. - Lucas",
    unidade: "PAR",
    localizacao: "Almoxarifado de Segurança e EPI - Prateleira EPI-01 - Caixa B3",
    quantidadeEstoque: 150,
    estoqueMinimo: 30,
    estoqueMaximo: 300,
    custoUnitario: 16.90,
    dataCriacao: "2026-09-29T10:45:00Z",
    ultimaAtualizacao: "2026-09-29T10:45:00Z"
  },
  {
    id: "art-08",
    tipoId: "tip-04",
    grupoId: "grp-04-02",
    subgrupoId: "sub-04-02-01",
    codigo: "SENAI-04.02.01.001",
    nome: "Luva de Soldador em Vaqueta e Raspa Ignífuga Cano Longo 20cm CA 28.115",
    descricao: "Luva de segurança industrial confeccionada em vaqueta especial na palma para flexibilidade tátil e raspa de couro tratada ignífuga no dorso e cano de 20cm, costura em fio de aramida Kevlar, resistente a escória de solda MIG/TIG e Eletrodo. - Lucas",
    unidade: "PAR",
    localizacao: "Oficina de Caldeiraria e Solda - Armário SLD-EPI - Prateleira 2",
    quantidadeEstoque: 45,
    estoqueMinimo: 15,
    estoqueMaximo: 100,
    custoUnitario: 38.50,
    dataCriacao: "2026-09-29T10:50:00Z",
    ultimaAtualizacao: "2026-09-29T10:50:00Z"
  },
  {
    id: "art-09",
    tipoId: "tip-05",
    grupoId: "grp-05-01",
    subgrupoId: "sub-05-01-01",
    codigo: "SENAI-05.01.01.001",
    nome: "Barra Redonda de Aço SAE 1045 Diâmetro 2 Polegadas (50.8mm) x 3000mm",
    descricao: "Aço médio carbono com excelente usinabilidade e resposta a tratamento térmico por têmpera por indução, fornecido em barra laminada calibrada de 3 metros, extremidades pintadas em vermelho para identificação padronizada no pátio SENAI. - Lucas",
    unidade: "BR",
    localizacao: "Pátio de Matéria-Prima Metalúrgica - Rack Horizontal RCK-02 - Vão C",
    quantidadeEstoque: 16,
    estoqueMinimo: 5,
    estoqueMaximo: 35,
    custoUnitario: 265.00,
    dataCriacao: "2026-09-29T10:55:00Z",
    ultimaAtualizacao: "2026-09-29T10:55:00Z"
  },
  {
    id: "art-10",
    tipoId: "tip-01",
    grupoId: "grp-01-03",
    subgrupoId: "sub-01-03-01",
    codigo: "SENAI-01.03.01.001",
    nome: "Disco de Corte Fino para Aço Inox 115mm x 1.0mm x 22.23mm Norton",
    descricao: "Disco abrasivo reforçado com 2 telas de fibra de vidro, grão de óxido de alumínio zirconado de corte rápido e frio, livre de ferro, cloro e enxofre (não contamina inox), rotação máxima 13.300 RPM para esmerilhadeiras angulares 4.1/2\". - Lucas",
    unidade: "CX",
    localizacao: "Oficina de Ajustagem Mecânica - Armário ABR-01 - Gaveta 03",
    quantidadeEstoque: 35,
    estoqueMinimo: 10,
    estoqueMaximo: 80,
    custoUnitario: 112.00,
    dataCriacao: "2026-09-29T11:00:00Z",
    ultimaAtualizacao: "2026-09-29T11:00:00Z"
  }
];

const initialMovimentacoes: MovimentacaoEstoque[] = [
  {
    id: "mov-01",
    artigoId: "art-01",
    artigoCodigo: "SENAI-01.01.01.001",
    artigoNome: "Parafuso Sextavado M10 x 50mm Aço Inox 316 Passo 1.5mm",
    tipo: "ENTRADA",
    quantidade: 300,
    quantidadeAnterior: 0,
    quantidadePosterior: 300,
    dataHora: "2026-09-29T10:16:00Z",
    motivo: "Aquisição Anual de Fixadores SENAI-SP",
    documentoRef: "NF-e 048291 - Fornecedor MetalFix",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Almoxarifado Mecânica Geral - Prateleira M-03 - Gaveta 12",
    custoUnitario: 4.75,
    observacoes: "Carga inicial homologada para projetos de torneamento e ajustagem mecânica."
  },
  {
    id: "mov-02",
    artigoId: "art-01",
    artigoCodigo: "SENAI-01.01.01.001",
    artigoNome: "Parafuso Sextavado M10 x 50mm Aço Inox 316 Passo 1.5mm",
    tipo: "SAIDA",
    quantidade: 60,
    quantidadeAnterior: 300,
    quantidadePosterior: 240,
    dataHora: "2026-09-29T11:10:00Z",
    motivo: "Consumo em Aula Prática de Montagem de Máquinas",
    documentoRef: "REQ-AULA-MEC-TURMA-2026/A",
    responsavel: "Instrutor Ricardo Silveira",
    localizacao: "Almoxarifado Mecânica Geral - Prateleira M-03 - Gaveta 12",
    observacoes: "Parafusos utilizados na montagem das bancadas de testes eletropneumáticos."
  },
  {
    id: "mov-03",
    artigoId: "art-02",
    artigoCodigo: "SENAI-01.02.01.001",
    artigoNome: "Óleo Solúvel Sintético Biostável para Usinagem 20L",
    tipo: "ENTRADA",
    quantidade: 15,
    quantidadeAnterior: 0,
    quantidadePosterior: 15,
    dataHora: "2026-09-29T10:21:00Z",
    motivo: "Suprimento Trimestral de Fluidos de Corte",
    documentoRef: "NF-e 059123 - LubriTech Indústria",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Galpão de Usinagem CNC - Baia de Químicos Q-01 - Nível Solo",
    custoUnitario: 380.00,
    observacoes: "Produto aprovado pelo laboratório de química e meio ambiente."
  },
  {
    id: "mov-04",
    artigoId: "art-02",
    artigoCodigo: "SENAI-01.02.01.001",
    artigoNome: "Óleo Solúvel Sintético Biostável para Usinagem 20L",
    tipo: "SAIDA",
    quantidade: 3,
    quantidadeAnterior: 15,
    quantidadePosterior: 12,
    dataHora: "2026-09-29T11:30:00Z",
    motivo: "Abastecimento dos Centros de Usinagem CNC Romi",
    documentoRef: "OS-MANUT-USIN-044",
    responsavel: "Técnico Márcio Fernandes",
    localizacao: "Galpão de Usinagem CNC - Baia de Químicos Q-01 - Nível Solo",
    observacoes: "Troca e reposição preventiva de emulsão refrigerante nas máquinas CNC 01, 02 e 03."
  },
  {
    id: "mov-05",
    artigoId: "art-03",
    artigoCodigo: "SENAI-02.01.01.001",
    artigoNome: "Inserto de Metal Duro CNMG 120408-PM Classe P25",
    tipo: "ENTRADA",
    quantidade: 20,
    quantidadeAnterior: 0,
    quantidadePosterior: 20,
    dataHora: "2026-09-29T10:26:00Z",
    motivo: "Compra Centralizada de Ferramental de Desbaste",
    documentoRef: "NF-e 071420 - Sandvik Coromant",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Ferramentaria Central - Armário Blindado F-02 - Prateleira 4",
    custoUnitario: 195.50,
    observacoes: "Caixas originais lacradas com certificado de conformidade."
  },
  {
    id: "mov-06",
    artigoId: "art-03",
    artigoCodigo: "SENAI-02.01.01.001",
    artigoNome: "Inserto de Metal Duro CNMG 120408-PM Classe P25",
    tipo: "SAIDA",
    quantidade: 2,
    quantidadeAnterior: 20,
    quantidadePosterior: 18,
    dataHora: "2026-09-29T11:45:00Z",
    motivo: "Entrega para Aula Prática de Torneamento Mecânico",
    documentoRef: "REQ-TURMA-APRENDIZ-02",
    responsavel: "Instrutor Marcos Lima",
    localizacao: "Ferramentaria Central - Armário Blindado F-02 - Prateleira 4",
    observacoes: "Fornecimento de pastilhas para exercício de desbaste cilíndrico externo."
  },
  {
    id: "mov-07",
    artigoId: "art-04",
    artigoCodigo: "SENAI-02.02.01.001",
    artigoNome: "Paquímetro Digital de Precisão 150mm Resolução 0,01mm Mitutoyo",
    tipo: "ENTRADA",
    quantidade: 10,
    quantidadeAnterior: 0,
    quantidadePosterior: 10,
    dataHora: "2026-09-29T10:31:00Z",
    motivo: "Renovação Tecnológica dos Laboratórios de Metrologia",
    documentoRef: "NF-e 089122 - Mitutoyo Sul Americana",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Laboratório de Metrologia - Armário Climatizado MET-01 - Gaveta A",
    custoUnitario: 685.00,
    observacoes: "Todos os instrumentos aferidos e com etiqueta de calibração válida."
  },
  {
    id: "mov-08",
    artigoId: "art-05",
    artigoCodigo: "SENAI-03.01.01.001",
    artigoNome: "Contator Tripolar de Potência 32A Bobina 220Vca 1NA+1NF Weg",
    tipo: "ENTRADA",
    quantidade: 25,
    quantidadeAnterior: 0,
    quantidadePosterior: 25,
    dataHora: "2026-09-29T10:36:00Z",
    motivo: "Aquisição para Bancadas Didáticas de Comandos Elétricos",
    documentoRef: "NF-e 092834 - Distribuidora Weg Automação",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Almoxarifado Eletroeletrônica - Prateleira E-04 - Gaveta 08",
    custoUnitario: 142.30,
    observacoes: "Para montagem dos painéis de partida direta e estrela-triângulo."
  },
  {
    id: "mov-09",
    artigoId: "art-06",
    artigoCodigo: "SENAI-03.02.01.001",
    artigoNome: "Sensor de Proximidade Indutivo M18 PNP Normal Aberto Faceado 5mm",
    tipo: "ENTRADA",
    quantidade: 14,
    quantidadeAnterior: 0,
    quantidadePosterior: 14,
    dataHora: "2026-09-29T10:41:00Z",
    motivo: "Reposição de Sensores para Bancadas de Mecatrônica",
    documentoRef: "NF-e 099381 - Balluff Automação",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Laboratório de Automação e Mecatrônica - Armário AUT-03 - Gaveta 02",
    custoUnitario: 118.00,
    observacoes: "Sensores testados e etiquetados conforme padrão elétrico SENAI."
  },
  {
    id: "mov-10",
    artigoId: "art-07",
    artigoCodigo: "SENAI-04.01.01.001",
    artigoNome: "Óculos de Proteção Antirrisco e Antiembaçante com Proteção UV CA 10.344",
    tipo: "ENTRADA",
    quantidade: 150,
    quantidadeAnterior: 0,
    quantidadePosterior: 150,
    dataHora: "2026-09-29T10:46:00Z",
    motivo: "Estoque de Segurança para Alunos do Novo Semestre Letivo",
    documentoRef: "NF-e 101293 - Protege Equipamentos",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Almoxarifado de Segurança e EPI - Prateleira EPI-01 - Caixa B3",
    custoUnitario: 16.90,
    observacoes: "EPIs homologados conforme NR-6, fornecidos para todas as oficinas."
  },
  {
    id: "mov-11",
    artigoId: "art-08",
    artigoCodigo: "SENAI-04.02.01.001",
    artigoNome: "Luva de Soldador em Vaqueta e Raspa Ignífuga Cano Longo 20cm CA 28.115",
    tipo: "ENTRADA",
    quantidade: 45,
    quantidadeAnterior: 0,
    quantidadePosterior: 45,
    dataHora: "2026-09-29T10:51:00Z",
    motivo: "Insumo Essencial para Cursos de Soldagem Industrial",
    documentoRef: "NF-e 104284 - Brasolda Indústria",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Oficina de Caldeiraria e Solda - Armário SLD-EPI - Prateleira 2",
    custoUnitario: 38.50,
    observacoes: "Cano longo para proteção térmica contra faíscas e radiação infravermelha."
  },
  {
    id: "mov-12",
    artigoId: "art-09",
    artigoCodigo: "SENAI-05.01.01.001",
    artigoNome: "Barra Redonda de Aço SAE 1045 Diâmetro 2 Polegadas (50.8mm) x 3000mm",
    tipo: "ENTRADA",
    quantidade: 16,
    quantidadeAnterior: 0,
    quantidadePosterior: 16,
    dataHora: "2026-09-29T10:56:00Z",
    motivo: "Carga de Matéria-Prima Metálica para Oficinas",
    documentoRef: "NF-e 110940 - Gerdau Aços Longos",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Pátio de Matéria-Prima Metalúrgica - Rack Horizontal RCK-02 - Vão C",
    custoUnitario: 265.00,
    observacoes: "Barras identificadas com código de cor padrão para aços SAE 1045."
  },
  {
    id: "mov-13",
    artigoId: "art-10",
    artigoCodigo: "SENAI-01.03.01.001",
    artigoNome: "Disco de Corte Fino para Aço Inox 115mm x 1.0mm x 22.23mm Norton",
    tipo: "ENTRADA",
    quantidade: 35,
    quantidadeAnterior: 0,
    quantidadePosterior: 35,
    dataHora: "2026-09-29T11:01:00Z",
    motivo: "Lote de Abrasivos para Oficinas de Caldeiraria e Ajustagem",
    documentoRef: "NF-e 114820 - Saint-Gobain Abrasivos",
    responsavel: "Lucas (Resp. Técnico)",
    localizacao: "Oficina de Ajustagem Mecânica - Armário ABR-01 - Gaveta 03",
    custoUnitario: 112.00,
    observacoes: "Embalagens lacradas contendo 25 unidades cada, alto rendimento."
  }
];

export const INITIAL_DATABASE: InventoryDatabase = {
  version: "1.0.0",
  updatedAt: new Date().toISOString(),
  responsavelTecnico: RESPONSAVEL_TECNICO_TITULO,
  unidadeSenai: "SENAI-SP | Escola e Faculdade de Tecnologia SENAI",
  tipos: initialTipos,
  grupos: initialGrupos,
  subgrupos: initialSubgrupos,
  artigos: INITIAL_ARTIGOS,
  movimentacoes: initialMovimentacoes
};
