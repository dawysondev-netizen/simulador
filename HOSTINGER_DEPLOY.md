# Deploy na VPS Hostinger — passo a passo

ZIP pronto: `simulador-premiacao.zip` (21 KB) — contém apenas os 9 arquivos de produção.

## Antes de começar — onde achar o IP

1. Entre em https://hpanel.hostinger.com.
2. Menu lateral → **VPS** → escolha a sua VPS.
3. Na aba **Visão geral** ou **Acesso**, anota o **IP público (IPv4)**. É o endereço que você vai apontar.
4. Copia também o **usuário** (`root`) e a **senha de root** (ou use a sua chave SSH).

> Eu não tenho como descobrir esse IP por você — ele só aparece no seu painel.

## Caminho rápido (Apache, ~ 5 minutos)

A maioria das VPS Hostinger já vem com Apache instalado quando você escolhe o template **Ubuntu + Apache** ou **LAMP**. Se a sua VPS estiver "limpa", os comandos abaixo instalam tudo do zero.

### 1. Conectar via SSH

No Terminal (Mac/Linux) ou PowerShell (Windows 10/11):

```bash
ssh root@SEU_IP
```

Aceite a chave (`yes`) e cole a senha.

### 2. Instalar Apache (só se ainda não tiver)

```bash
apt update && apt install -y apache2 unzip
systemctl enable --now apache2
```

### 3. Mandar o ZIP para a VPS

No **seu computador** (em outro terminal, sem fechar o SSH):

```bash
scp "simulador-premiacao.zip" root@SEU_IP:/tmp/
```

### 4. Extrair na pasta web e ajustar permissões

De volta ao SSH da VPS:

```bash
mkdir -p /var/www/html/premiacao
unzip -o /tmp/simulador-premiacao.zip -d /var/www/html/premiacao
chown -R www-data:www-data /var/www/html/premiacao
chmod -R 755 /var/www/html/premiacao
```

### 5. Liberar firewall (se estiver ativo)

```bash
ufw allow 80/tcp
ufw allow 443/tcp
```

### 6. Testar

Abra no navegador:

- `http://SEU_IP/premiacao/consultor-premiacao.html`
- `http://SEU_IP/premiacao/supervisor-premiacao.html`
- `http://SEU_IP/premiacao/testes.html`

Pronto. Os 27 testes devem ficar verdes em `/premiacao/testes.html`.

## Caminho com Nginx (alternativa)

Se sua VPS é **Ubuntu + Nginx**:

```bash
apt update && apt install -y nginx unzip
systemctl enable --now nginx
mkdir -p /var/www/premiacao
unzip -o /tmp/simulador-premiacao.zip -d /var/www/premiacao
chown -R www-data:www-data /var/www/premiacao

cat > /etc/nginx/sites-available/premiacao << 'EOF'
server {
  listen 80;
  server_name _;
  root /var/www/premiacao;
  index consultor-premiacao.html;
  location / {
    try_files $uri $uri/ =404;
  }
}
EOF

ln -sf /etc/nginx/sites-available/premiacao /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ufw allow 80/tcp
```

Acesso: `http://SEU_IP/consultor-premiacao.html`.

## Domínio próprio (opcional, recomendado)

1. No painel do seu registrador (Hostinger, Registro.br, etc.) crie um registro **A**:
   - Nome: `premiacao` (ou `app`, ou o que preferir)
   - Tipo: `A`
   - Valor: o **IP público da VPS**
   - TTL: 300

2. Espere a propagação (de minutos a 1 hora) e teste:
   ```bash
   ping premiacao.suaempresa.com.br
   ```
   Tem que retornar o IP da VPS.

3. Se quiser HTTPS grátis com Let's Encrypt (Apache):
   ```bash
   apt install -y certbot python3-certbot-apache
   certbot --apache -d premiacao.suaempresa.com.br
   ```
   No Nginx use `python3-certbot-nginx` no lugar.

Depois disso o site fica em `https://premiacao.suaempresa.com.br/consultor-premiacao.html`.

## Para atualizar o site no futuro

Toda vez que eu te passar uma versão nova:

```bash
# no seu computador
scp simulador-premiacao.zip root@SEU_IP:/tmp/

# na VPS
unzip -o /tmp/simulador-premiacao.zip -d /var/www/html/premiacao
chown -R www-data:www-data /var/www/html/premiacao
```

Sem reiniciar nada. As mudanças aparecem instantaneamente.

## Como apontar do sistema de vendas

Antes de redirecionar o usuário pra essa página, o sistema de vendas grava o perfil em sessionStorage e abre a URL:

```js
sessionStorage.setItem('ads_user_role', 'CONSULTOR'); // ou 'SUPERVISOR' ou 'ADMIN'
window.location.href = 'http://SEU_IP/premiacao/consultor-premiacao.html';
```

Ou use iframe:

```html
<iframe
  src="http://SEU_IP/premiacao/supervisor-premiacao.html"
  style="width:100%;height:1400px;border:0;"
  title="Premiação da Equipe"></iframe>
```

## Se algo der errado

| Sintoma | Causa provável | Solução |
|---|---|---|
| Não consigo SSH | Firewall ou IP errado | Confere IP no painel; libera porta 22 |
| `apt: command not found` | VPS não-Ubuntu/Debian | Use `yum` (CentOS) ou avise qual SO está rodando |
| Página em branco | Permissão ou caminho errado | Roda `ls /var/www/html/premiacao` para confirmar arquivos |
| 403 Forbidden | Permissões | `chown -R www-data:www-data /var/www/html/premiacao` |
| 404 Not Found | URL errada | Use o nome exato dos arquivos `.html` na URL |

## Posso te ajudar mais?

Se quiser que eu te assista em tempo real com a VPS:

1. Me diga qual sistema operacional tá rodando (Ubuntu 22? Debian? CentOS?).
2. Me diga se vai usar Apache ou Nginx — ou se prefere que eu escolha.
3. Me diga se já tem domínio apontando ou se vai usar só o IP.

Aí eu adapto os comandos exatos pra sua situação. Mas **não compartilhe sua senha de root nem chave SSH em nenhum lugar** — você roda os comandos no seu terminal, eu só te oriento.
