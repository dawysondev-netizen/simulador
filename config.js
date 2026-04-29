'use strict';

const CONFIG = {
  BRAND_NAME: 'ADS Software',
  // Tenta logo-empresa.png primeiro; se não existir, cai pro SVG; se nenhum, usa texto.
  BRAND_LOGO_PATH: './logo-empresa.png',
  BRAND_LOGO_FALLBACK_PATH: './logo-empresa.svg',
  DEV_MODE: false,
  PERIODO_LABEL: 'Abril 2026',

  BITRIX_BASE_URL: '',
  BITRIX_WEBHOOK_URL: '',
  BITRIX_CATEGORY_ID_CARTEIRA: null,
  BITRIX_ACTIVE_STAGE_IDS: [],
  BITRIX_FIELD_CONSULTOR: 'UF_CRM_CONSULTOR',
  BITRIX_FIELD_SUPERVISOR: 'UF_CRM_SUPERVISOR',
  BITRIX_FIELD_STATUS_CONTRATO: 'UF_CRM_STATUS_CONTRATO',
};

function renderBrandLogo(containerEl) {
  if (!containerEl) return;

  const tentar = (caminho, aoFalhar) => {
    const img = new Image();
    img.src = caminho;
    img.alt = CONFIG.BRAND_NAME;
    img.className = 'brand-logo-img';
    img.onload = () => containerEl.replaceChildren(img);
    img.onerror = aoFalhar;
  };

  tentar(CONFIG.BRAND_LOGO_PATH, () => {
    if (CONFIG.BRAND_LOGO_FALLBACK_PATH) {
      tentar(CONFIG.BRAND_LOGO_FALLBACK_PATH, () => {
        containerEl.innerHTML = `<span class="brand-logo-text">${CONFIG.BRAND_NAME}</span>`;
      });
    } else {
      containerEl.innerHTML = `<span class="brand-logo-text">${CONFIG.BRAND_NAME}</span>`;
    }
  });
}

function isDevMode() {
  return CONFIG.DEV_MODE || new URLSearchParams(window.location.search).get('dev') === '1';
}
