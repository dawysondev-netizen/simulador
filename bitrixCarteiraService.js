/**
 * bitrixCarteiraService.js — Integração com Bitrix24 · Carteira
 * ADS Software · Simulador de Premiação
 * ══════════════════════════════════════════════════════════════════════════
 *
 * STATUS: Estrutura pronta para integração. Modo manual ativo.
 *
 * Para ativar a integração:
 *   1. Preencha as variáveis em config.js (BITRIX_BASE_URL, BITRIX_WEBHOOK_URL, etc.)
 *   2. Implemente os métodos marcados com "TODO: BITRIX REAL"
 *   3. Teste com um funil de desenvolvimento antes de produção
 *
 * NÃO hardcode:
 *   - tokens
 *   - webhooks
 *   - URLs privadas
 *   - IDs de funil ou campo
 *
 * Cobertura = cliente que teve ligação, tarefa ou comentário no card
 *             nos últimos 30 dias via Bitrix24 CRM.
 * ══════════════════════════════════════════════════════════════════════════
 */

'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   MODO DE OPERAÇÃO
   ════════════════════════════════════════════════════════════════════════ */
const MODO = {
  MANUAL:  'manual',   // Entrada de dados manual (atual)
  BITRIX:  'bitrix',   // Integrado com Bitrix24
};

let modoAtivo = MODO.MANUAL;

function ativarModoBitrix() {
  if (!CONFIG.BITRIX_WEBHOOK_URL) {
    console.warn('[BitrixService] BITRIX_WEBHOOK_URL não configurado. Mantendo modo manual.');
    return false;
  }
  modoAtivo = MODO.BITRIX;
  console.info('[BitrixService] Modo Bitrix24 ativado.');
  return true;
}

/* ══════════════════════════════════════════════════════════════════════════
   CLIENTE HTTP BITRIX
   ════════════════════════════════════════════════════════════════════════ */
async function bitrixCall(method, params = {}) {
  if (!CONFIG.BITRIX_WEBHOOK_URL) throw new Error('BITRIX_WEBHOOK_URL não configurado.');
  const url = `${CONFIG.BITRIX_BASE_URL}${CONFIG.BITRIX_WEBHOOK_URL}${method}.json`;
  const res  = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Bitrix24 HTTP ${res.status}: ${method}`);
  const json = await res.json();
  if (json.error) throw new Error(`Bitrix24 erro: ${json.error} — ${json.error_description}`);
  return json.result;
}

/* ══════════════════════════════════════════════════════════════════════════
   DADOS MANUAIS (modo fallback enquanto Bitrix não está integrado)
   ════════════════════════════════════════════════════════════════════════ */
let _dadosManuais = {
  consultores: [],
  // Estrutura esperada por consultor:
  // {
  //   id: string,
  //   nome: string,
  //   faturamento: number,
  //   clientesVigentes: number,
  //   clientesAtendidos: number,
  //   supervisorId: string,
  // }
};

function setDadosManuais(dados) {
  _dadosManuais = dados;
}

/* ══════════════════════════════════════════════════════════════════════════
   FUNÇÕES DE SERVIÇO
   ════════════════════════════════════════════════════════════════════════ */

/**
 * Lista clientes vigentes da carteira (contratos ativos no Bitrix24).
 * Em modo manual, retorna array vazio (dados entrados na tela).
 *
 * @param {string} [consultorId] - Filtra por consultor específico (opcional)
 * @returns {Promise<Array>}
 */
async function listarClientesVigentesCarteira(consultorId) {
  if (modoAtivo === MODO.MANUAL) return [];

  // TODO: BITRIX REAL
  // return await bitrixCall('crm.deal.list', {
  //   filter: {
  //     CATEGORY_ID: CONFIG.BITRIX_CATEGORY_ID_CARTEIRA,
  //     STAGE_ID:    CONFIG.BITRIX_ACTIVE_STAGE_IDS,
  //     [CONFIG.BITRIX_FIELD_CONSULTOR]: consultorId,
  //   },
  //   select: ['ID', 'TITLE', CONFIG.BITRIX_FIELD_CONSULTOR, CONFIG.BITRIX_FIELD_SUPERVISOR],
  // });
  return [];
}

/**
 * Lista clientes agrupados por consultor.
 * @returns {Promise<Map<string, Array>>} - Map: consultorId → [deals]
 */
async function listarClientesPorConsultor() {
  if (modoAtivo === MODO.MANUAL) {
    return _dadosManuais.consultores.reduce((map, c) => {
      map.set(c.id, c);
      return map;
    }, new Map());
  }

  // TODO: BITRIX REAL
  // const deals = await listarClientesVigentesCarteira();
  // const grouped = new Map();
  // for (const deal of deals) {
  //   const cid = deal[CONFIG.BITRIX_FIELD_CONSULTOR];
  //   if (!grouped.has(cid)) grouped.set(cid, []);
  //   grouped.get(cid).push(deal);
  // }
  // return grouped;
  return new Map();
}

/**
 * Lista todos os consultores da equipe de um supervisor.
 * @param {string} supervisorId
 * @returns {Promise<Array>}
 */
async function listarClientesPorSupervisor(supervisorId) {
  if (modoAtivo === MODO.MANUAL) {
    return _dadosManuais.consultores.filter(c => c.supervisorId === supervisorId);
  }

  // TODO: BITRIX REAL
  // return await bitrixCall('crm.deal.list', {
  //   filter: {
  //     CATEGORY_ID: CONFIG.BITRIX_CATEGORY_ID_CARTEIRA,
  //     STAGE_ID:    CONFIG.BITRIX_ACTIVE_STAGE_IDS,
  //     [CONFIG.BITRIX_FIELD_SUPERVISOR]: supervisorId,
  //   },
  // });
  return [];
}

/**
 * Verifica se um deal teve atividade nos últimos 30 dias.
 * Atividade válida: ligação, tarefa ou comentário.
 *
 * @param {string} dealId
 * @returns {Promise<{ atendido: boolean, ultimaAtividade: Date|null, tipo: string|null }>}
 */
async function verificarAtendimentoNosUltimos30Dias(dealId) {
  if (modoAtivo === MODO.MANUAL) return { atendido: false, ultimaAtividade: null, tipo: null };

  const limite = new Date();
  limite.setDate(limite.getDate() - 30);
  const limiteISO = limite.toISOString().split('T')[0];

  // Verificar em paralelo: ligações, tarefas, comentários
  const [ligacoes, tarefas, comentarios] = await Promise.all([
    buscarLigacoesDoCard(dealId, limiteISO),
    buscarTarefasDoCard(dealId, limiteISO),
    buscarComentariosDoCard(dealId, limiteISO),
  ]);

  const atividades = [
    ...ligacoes.map(l  => ({ data: new Date(l.CREATED), tipo: 'ligacao' })),
    ...tarefas.map(t   => ({ data: new Date(t.CREATED_DATE), tipo: 'tarefa' })),
    ...comentarios.map(c => ({ data: new Date(c.CREATED), tipo: 'comentario' })),
  ].filter(a => a.data >= limite);

  if (atividades.length === 0) return { atendido: false, ultimaAtividade: null, tipo: null };

  atividades.sort((a, b) => b.data - a.data);
  return { atendido: true, ultimaAtividade: atividades[0].data, tipo: atividades[0].tipo };
}

/**
 * Busca ligações registradas no card (deal) do Bitrix24.
 * @param {string} dealId
 * @param {string} [dataInicio] - ISO date string (YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
async function buscarLigacoesDoCard(dealId, dataInicio) {
  if (modoAtivo === MODO.MANUAL) return [];

  // TODO: BITRIX REAL
  // return await bitrixCall('crm.activity.list', {
  //   filter: {
  //     OWNER_TYPE_ID: 2, // Deal
  //     OWNER_ID:      dealId,
  //     TYPE_ID:       2, // Ligação
  //     '>=CREATED':   dataInicio,
  //   },
  // });
  return [];
}

/**
 * Busca tarefas vinculadas ao card do Bitrix24.
 * @param {string} dealId
 * @param {string} [dataInicio]
 * @returns {Promise<Array>}
 */
async function buscarTarefasDoCard(dealId, dataInicio) {
  if (modoAtivo === MODO.MANUAL) return [];

  // TODO: BITRIX REAL
  // return await bitrixCall('tasks.task.list', {
  //   filter: {
  //     UF_CRM_TASK: `D_${dealId}`,
  //     '>=CREATED_DATE': dataInicio,
  //   },
  // });
  return [];
}

/**
 * Busca comentários (timeline) do card no Bitrix24.
 * @param {string} dealId
 * @param {string} [dataInicio]
 * @returns {Promise<Array>}
 */
async function buscarComentariosDoCard(dealId, dataInicio) {
  if (modoAtivo === MODO.MANUAL) return [];

  // TODO: BITRIX REAL
  // return await bitrixCall('crm.timeline.comment.list', {
  //   filter: { ENTITY_TYPE: 'deal', ENTITY_ID: dealId, '>=CREATED': dataInicio },
  // });
  return [];
}

/**
 * Calcula a cobertura completa da carteira consultando o Bitrix24.
 * Para cada cliente vigente, verifica se houve atendimento nos últimos 30 dias.
 *
 * @param {string} [consultorId]
 * @returns {Promise<{ total: number, atendidos: number, pendentes: Array, pct: number }>}
 */
async function calcularCoberturaCarteira(consultorId) {
  if (modoAtivo === MODO.MANUAL) {
    throw new Error('calcularCoberturaCarteira requer modo Bitrix. Use calcularCobertura() para modo manual.');
  }

  const clientes = await listarClientesVigentesCarteira(consultorId);
  const resultados = await Promise.all(
    clientes.map(async (c) => {
      const r = await verificarAtendimentoNosUltimos30Dias(c.ID);
      return { deal: c, ...r };
    })
  );

  const atendidos = resultados.filter(r => r.atendido);
  const pendentes = resultados.filter(r => !r.atendido);
  const pct       = clientes.length > 0 ? Math.round((atendidos.length / clientes.length) * 100) : 0;

  return {
    total:     clientes.length,
    atendidos: atendidos.length,
    pendentes: pendentes.map(r => ({ id: r.deal.ID, titulo: r.deal.TITLE })),
    pct,
  };
}

/* ── Export ────────────────────────────────────────────────────────────── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MODO, modoAtivo, ativarModoBitrix, setDadosManuais,
    listarClientesVigentesCarteira, listarClientesPorConsultor,
    listarClientesPorSupervisor, verificarAtendimentoNosUltimos30Dias,
    buscarLigacoesDoCard, buscarTarefasDoCard, buscarComentariosDoCard,
    calcularCoberturaCarteira,
  };
}
