'use strict';

const ROLES = {
  CONSULTOR: 'CONSULTOR',
  SUPERVISOR: 'SUPERVISOR',
  ADMIN: 'ADMIN',
};

function canAccessPremiacaoPage(userRole, pageType) {
  if (userRole === ROLES.ADMIN) return true;
  if (pageType === ROLES.CONSULTOR) return userRole === ROLES.CONSULTOR || userRole === ROLES.SUPERVISOR;
  if (pageType === ROLES.SUPERVISOR) return userRole === ROLES.SUPERVISOR;
  return false;
}

function getUserRole() {
  if (typeof isDevMode === 'function' && isDevMode()) {
    return new URLSearchParams(window.location.search).get('role') || ROLES.ADMIN;
  }

  const sessao = sessionStorage.getItem('ads_user_role');
  if (sessao) return sessao;

  return ROLES.ADMIN;
}

function applyAccessControl(pageType, contentId, deniedId, roleSelectId) {
  const role = getUserRole();
  const allowed = canAccessPremiacaoPage(role, pageType);
  const content = document.getElementById(contentId);
  const denied = document.getElementById(deniedId);
  const devPanel = document.getElementById('dev-panel');
  const roleSelect = roleSelectId ? document.getElementById(roleSelectId) : null;

  if (content) content.hidden = !allowed;
  if (denied) denied.hidden = allowed;
  if (devPanel) devPanel.hidden = !(typeof isDevMode === 'function' && isDevMode());
  if (roleSelect) roleSelect.value = role;

  return allowed;
}
