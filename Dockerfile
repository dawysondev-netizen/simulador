FROM nginx:1.27-alpine

ENV DEFAULT_PAGE=consultor-premiacao.html

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY consultor-premiacao.html supervisor-premiacao.html testes.html documentacao.html /usr/share/nginx/html/
COPY styles.css config.js access-control.js premiacao-rules.js bitrixCarteiraService.js /usr/share/nginx/html/
COPY logo-empresa.svg /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
