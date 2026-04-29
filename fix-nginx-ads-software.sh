#!/usr/bin/env bash
#
# Configura nginx para consultor.ads.software e supervisor.ads.software
# Os arquivos do simulador já estão em /var/www/html/consultor e /supervisor.
# Este script só ajusta o nginx.
#
set -euo pipefail

echo "==> Removendo configs antigas (sistemaads.shop)"
rm -f /etc/nginx/sites-enabled/consultor.sistemaads.shop
rm -f /etc/nginx/sites-enabled/supervisor.sistemaads.shop
rm -f /etc/nginx/sites-available/consultor.sistemaads.shop
rm -f /etc/nginx/sites-available/supervisor.sistemaads.shop

echo "==> Criando server block: consultor.ads.software"
cat > /etc/nginx/sites-available/consultor.ads.software << 'NGX'
server {
    listen 80;
    listen [::]:80;
    server_name consultor.ads.software;

    root /var/www/html/consultor;
    index index.html consultor-premiacao.html;

    location / {
        try_files $uri $uri/ /consultor-premiacao.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    access_log /var/log/nginx/consultor.ads.software-access.log;
    error_log  /var/log/nginx/consultor.ads.software-error.log;
}
NGX

echo "==> Criando server block: supervisor.ads.software"
cat > /etc/nginx/sites-available/supervisor.ads.software << 'NGX'
server {
    listen 80;
    listen [::]:80;
    server_name supervisor.ads.software;

    root /var/www/html/supervisor;
    index index.html supervisor-premiacao.html;

    location / {
        try_files $uri $uri/ /supervisor-premiacao.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    access_log /var/log/nginx/supervisor.ads.software-access.log;
    error_log  /var/log/nginx/supervisor.ads.software-error.log;
}
NGX

echo "==> Ativando server blocks"
ln -sf /etc/nginx/sites-available/consultor.ads.software  /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/supervisor.ads.software /etc/nginx/sites-enabled/

echo "==> Testando configuração nginx"
if ! nginx -t; then
  echo "ERRO: nginx -t falhou. Veja a saida acima."
  exit 1
fi

echo "==> Recarregando nginx"
systemctl reload nginx

echo "==> Verificando ativação local"
sleep 1
echo -n "consultor: "
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: consultor.ads.software" http://127.0.0.1/
echo -n "supervisor: "
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: supervisor.ads.software" http://127.0.0.1/

echo ""
echo "==> Confirmando que o documento certo é servido"
echo -n "consultor titulo: "
curl -s -H "Host: consultor.ads.software" http://127.0.0.1/ | grep -oP '<title>[^<]+' | head -1
echo -n "supervisor titulo: "
curl -s -H "Host: supervisor.ads.software" http://127.0.0.1/ | grep -oP '<title>[^<]+' | head -1

echo ""
echo "============================================================"
echo "  PRONTO. Os 2 simuladores estão respondendo."
echo "  Cloudflare: certifique que registros A estão OK."
echo "  Se subdomínios estiverem 'Proxied' (orange cloud),"
echo "  configure SSL/TLS no Cloudflare como 'Flexible' (ou DNS-only"
echo "  para deixar passar HTTP direto)."
echo "============================================================"
