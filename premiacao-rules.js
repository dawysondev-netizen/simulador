'use strict';

const TABELA_PREMIACAO = [
  [10000, 300, 100],
  [11000, 330, 110],
  [12000, 360, 120],
  [13000, 390, 130],
  [14000, 420, 140],
  [15000, 450, 150],
  [16000, 480, 160],
  [17000, 510, 170],
  [18000, 540, 180],
  [19000, 570, 190],
  [20000, 600, 200],
  [21000, 630, 210],
  [22000, 660, 220],
  [23000, 1150, 230],
  [24000, 1200, 240],
  [25000, 1250, 500],
  [26000, 1300, 520],
  [27000, 1350, 540],
  [28000, 1400, 560],
  [29000, 1450, 580],
  [30000, 1500, 600],
  [31000, 1550, 930],
  [32000, 1600, 960],
  [33000, 1650, 990],
  [34000, 1700, 1020],
  [35000, 2550, 1450],
  [36000, 2600, 1480],
  [37000, 2650, 1510],
  [38000, 2700, 1540],
  [39000, 2750, 1570],
  [40000, 2800, 1600],
  [41000, 2850, 1630],
  [42000, 2900, 1660],
  [43000, 2950, 1690],
  [44000, 3000, 1720],
  [45000, 3850, 2500],
  [46000, 3900, 2540],
  [47000, 3950, 2580],
  [48000, 4000, 2620],
  [49000, 4050, 2660],
  [50000, 4100, 2700],
  [51000, 4150, 2740],
  [52000, 4200, 2780],
  [53000, 4250, 2820],
  [54000, 4300, 2860],
  [55000, 4350, 2900],
  [56000, 4400, 2940],
  [57000, 4450, 2980],
  [58000, 4500, 3020],
  [59000, 4550, 3060],
  [60000, 6000, 4500],
  [61000, 6050, 4550],
  [62000, 6100, 4600],
  [63000, 6150, 4650],
  [64000, 6200, 4700],
  [65000, 6250, 4750],
  [66000, 6300, 4800],
  [67000, 6350, 4850],
  [68000, 6400, 4900],
  [69000, 6450, 4950],
  [70000, 6500, 5000],
  [71000, 6550, 5050],
  [72000, 6600, 5100],
  [73000, 6650, 5150],
  [74000, 6700, 5200],
  [75000, 6750, 5250],
  [76000, 6800, 5300],
  [77000, 6850, 5350],
  [78000, 6900, 5400],
  [79000, 6950, 5450],
  [80000, 7000, 5500],
  [81000, 7050, 5550],
  [82000, 7100, 5600],
  [83000, 7150, 5650],
  [84000, 7200, 5700],
  [85000, 7250, 5750],
  [86000, 7300, 5800],
  [87000, 7350, 5850],
  [88000, 7400, 5900],
  [89000, 7450, 5950],
  [90000, 7500, 6000],
  [91000, 7550, 6050],
  [92000, 7600, 6100],
  [93000, 7650, 6150],
  [94000, 7700, 6200],
  [95000, 7750, 6250],
  [96000, 7800, 6300],
  [97000, 7850, 6350],
  [98000, 7900, 6400],
  [99000, 7950, 6450],
  [100000, 8000, 6500],
  [101000, 8050, 6550],
  [102000, 8100, 6600],
  [103000, 8150, 6650],
  [104000, 8200, 6700],
  [105000, 8250, 6750],
  [106000, 8300, 6800],
];

const CERTIFICACOES = [
  { key: 'platinum', nome: 'Platinum', valor: 60000 },
  { key: 'diamante', nome: 'Diamante', valor: 45000 },
  { key: 'ouro', nome: 'Ouro', valor: 35000 },
  { key: 'prata', nome: 'Prata', valor: 25000 },
  { key: 'bronze', nome: 'Bronze', valor: 15000 },
];

const VALOR_MINIMO_PREMIACAO = 10000;
const BONUS_COBERTURA_CONSULTOR = 300;
const BONUS_COBERTURA_SUPERVISOR = 600;

function getFaixaPremiacao(faturamento) {
  const valor = Number(faturamento) || 0;
  let faixa = null;

  for (const [desempenho, premioConsultor, premioSupervisor] of TABELA_PREMIACAO) {
    if (desempenho <= valor) {
      faixa = { desempenho, premioConsultor, premioSupervisor };
    } else {
      break;
    }
  }

  return faixa;
}

function getPremioConsultor(faturamento) {
  const faixa = getFaixaPremiacao(faturamento);
  return faixa ? faixa.premioConsultor : 0;
}

function getPremioSupervisorPorConsultor(faturamento) {
  const faixa = getFaixaPremiacao(faturamento);
  return faixa ? faixa.premioSupervisor : 0;
}

function temPerformanceMinima(faturamento) {
  return Number(faturamento) >= VALOR_MINIMO_PREMIACAO;
}

function getBonusCoberturaConsultor(faturamento, coberturaPlena) {
  return temPerformanceMinima(faturamento) && coberturaPlena ? BONUS_COBERTURA_CONSULTOR : 0;
}

function getPremioFinalConsultor(faturamento, coberturaPlena) {
  return getPremioConsultor(faturamento) + getBonusCoberturaConsultor(faturamento, coberturaPlena);
}

function getCertificacaoPotencial(faturamento) {
  const valor = Number(faturamento) || 0;
  return CERTIFICACOES.find((certificacao) => valor >= certificacao.valor) || null;
}

function getProximaCertificacao(faturamento) {
  const valor = Number(faturamento) || 0;
  const ordemCrescente = CERTIFICACOES.slice().reverse();
  return ordemCrescente.find((certificacao) => valor < certificacao.valor) || null;
}

function getStatusCertificacao(faturamento, coberturaPlena) {
  const certificacao = getCertificacaoPotencial(faturamento);

  if (!certificacao) {
    return { status: 'sem_faixa', certificacao: null };
  }

  if (!coberturaPlena) {
    return { status: 'bloqueada', certificacao };
  }

  return { status: 'validada', certificacao };
}

function calcularCobertura(clientesVigentes, clientesAtendidos) {
  const vigentes = Math.max(0, Math.floor(Number(clientesVigentes) || 0));
  const atendidosInformados = Math.max(0, Math.floor(Number(clientesAtendidos) || 0));

  if (vigentes === 0) {
    return {
      vigentes: 0,
      atendidos: 0,
      pendentes: 0,
      percentual: 0,
      plena: false,
      status: 'sem_carteira',
      ajustado: atendidosInformados > 0,
    };
  }

  const atendidos = Math.min(atendidosInformados, vigentes);
  const pendentes = vigentes - atendidos;
  const percentual = Math.round((atendidos / vigentes) * 100);

  return {
    vigentes,
    atendidos,
    pendentes,
    percentual,
    plena: atendidos === vigentes,
    status: atendidos === vigentes ? 'plena' : 'incompleta',
    ajustado: atendidosInformados > vigentes,
  };
}

function calcularPremioTotalSupervisor(consultores) {
  return consultores.reduce((total, consultor) => {
    return total + getPremioSupervisorPorConsultor(consultor.faturamento);
  }, 0);
}

function getBonusCoberturaSupervisor(consultores) {
  const lista = Array.isArray(consultores) ? consultores : [];
  const temEquipe = lista.length > 0;
  const temPerformance = lista.some((consultor) => temPerformanceMinima(consultor.faturamento));
  const coberturaPlenaEquipe = temEquipe && lista.every((consultor) => {
    if (typeof consultor.coberturaPlena === 'boolean') return consultor.coberturaPlena;
    if (consultor.cobertura && typeof consultor.cobertura.plena === 'boolean') return consultor.cobertura.plena;
    return false;
  });

  return temPerformance && coberturaPlenaEquipe ? BONUS_COBERTURA_SUPERVISOR : 0;
}

function getPremioFinalSupervisor(consultores) {
  return calcularPremioTotalSupervisor(consultores) + getBonusCoberturaSupervisor(consultores);
}

function fmtBRL(valor) {
  return (Number(valor) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function fmtBRLCurto(valor) {
  return fmtBRL(valor).replace(',00', '');
}

function runTests() {
  const testes = [
    ['9999 retorna null', () => getFaixaPremiacao(9999) === null],
    ['10000 retorna faixa 10000', () => getFaixaPremiacao(10000).desempenho === 10000],
    ['10999 retorna faixa 10000', () => getFaixaPremiacao(10999).desempenho === 10000],
    ['11000 retorna faixa 11000', () => getFaixaPremiacao(11000).desempenho === 11000],
    ['35700 retorna faixa 35000', () => getFaixaPremiacao(35700).desempenho === 35000],
    ['60999 retorna faixa 60000', () => getFaixaPremiacao(60999).desempenho === 60000],
    ['35000 usa valores reais da planilha', () => getPremioConsultor(35000) === 2550 && getPremioSupervisorPorConsultor(35000) === 1450],
    ['60000 usa valores reais da planilha', () => getPremioConsultor(60000) === 6000 && getPremioSupervisorPorConsultor(60000) === 4500],
    ['100000 usa valores reais da planilha', () => getPremioConsultor(100000) === 8000 && getPremioSupervisorPorConsultor(100000) === 6500],
    ['14999 sem certificacao', () => getCertificacaoPotencial(14999) === null],
    ['15000 Bronze', () => getCertificacaoPotencial(15000).nome === 'Bronze'],
    ['25000 Prata', () => getCertificacaoPotencial(25000).nome === 'Prata'],
    ['35000 Ouro', () => getCertificacaoPotencial(35000).nome === 'Ouro'],
    ['45000 Diamante', () => getCertificacaoPotencial(45000).nome === 'Diamante'],
    ['60000 Platinum', () => getCertificacaoPotencial(60000).nome === 'Platinum'],
    ['Ouro com 99% fica bloqueada', () => getStatusCertificacao(35000, false).status === 'bloqueada'],
    ['Ouro com 100% fica validada', () => getStatusCertificacao(35000, true).status === 'validada'],
    ['10 vigentes e 10 atendidos gera 100%', () => calcularCobertura(10, 10).plena === true],
    ['10 vigentes e 9 atendidos gera 90%', () => calcularCobertura(10, 9).percentual === 90],
    ['0 vigentes nao libera certificacao', () => calcularCobertura(0, 0).plena === false],
    ['Atendidos maior que vigentes limita a 100%', () => calcularCobertura(10, 15).atendidos === 10],
    ['Italo com 9800 gera zero para supervisor', () => getPremioSupervisorPorConsultor(9800) === 0],
    ['Supervisor soma por consultor individual', () => calcularPremioTotalSupervisor([{ faturamento: 35000 }, { faturamento: 9800 }]) === 1450],
    ['Bonus consultor soma 300 com performance minima e cobertura plena', () => getPremioFinalConsultor(35000, true) === 2850],
    ['Bonus consultor nao soma sem cobertura plena', () => getPremioFinalConsultor(35000, false) === 2550],
    ['Bonus consultor nao soma abaixo de 10000 mesmo com cobertura plena', () => getPremioFinalConsultor(9800, true) === 0],
    ['Bonus supervisor soma 600 com equipe plena e performance minima', () => getPremioFinalSupervisor([
      { faturamento: 35000, coberturaPlena: true },
      { faturamento: 9800, coberturaPlena: true },
    ]) === 2050],
    ['Bonus supervisor nao soma se equipe nao estiver plena', () => getPremioFinalSupervisor([
      { faturamento: 35000, coberturaPlena: true },
      { faturamento: 9800, coberturaPlena: false },
    ]) === 1450],
    ['Consultor nao acessa supervisor', () => canAccessPremiacaoPage('CONSULTOR', 'SUPERVISOR') === false],
    ['Supervisor acessa supervisor', () => canAccessPremiacaoPage('SUPERVISOR', 'SUPERVISOR') === true],
    ['Admin acessa ambas', () => canAccessPremiacaoPage('ADMIN', 'SUPERVISOR') && canAccessPremiacaoPage('ADMIN', 'CONSULTOR')],
  ];

  const resultado = testes.map(([nome, teste]) => ({ nome, passou: Boolean(teste()) }));
  const falhas = resultado.filter((item) => !item.passou);
  console.table(resultado);
  console.log(falhas.length ? `${falhas.length} teste(s) falharam.` : 'Todos os testes passaram.');
  return { total: testes.length, passou: testes.length - falhas.length, falhou: falhas.length, resultado };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TABELA_PREMIACAO,
    CERTIFICACOES,
    getFaixaPremiacao,
    getPremioConsultor,
    getPremioSupervisorPorConsultor,
    getCertificacaoPotencial,
    getProximaCertificacao,
    getStatusCertificacao,
    calcularCobertura,
    calcularPremioTotalSupervisor,
    temPerformanceMinima,
    getBonusCoberturaConsultor,
    getPremioFinalConsultor,
    getBonusCoberturaSupervisor,
    getPremioFinalSupervisor,
    fmtBRL,
    fmtBRLCurto,
    runTests,
  };
}
