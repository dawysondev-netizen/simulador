# Publicação em nuvem — Simulador de Premiação

Este projeto é HTML/CSS/JS puro. Não tem build, não precisa de servidor. Basta hospedar como site estático.

## Arquivos que precisam ir para o servidor

```
consultor-premiacao.html
supervisor-premiacao.html
testes.html
documentacao.html
styles.css
config.js
access-control.js
premiacao-rules.js
bitrixCarteiraService.js
logo-empresa.png            (opcional — se existir, é exibida automaticamente)
```

Os arquivos abaixo são apenas histórico/utilitário e **não precisam ir para produção**:
`importar-tabela.html`, `import-xlsx.py`, `simulador_carteira_ms_connect.html`, `simulador_ms_connect_v3.html`, `Tabela de premiações 28042026.xlsx`, `PROMPT_CLAUDE_CODE_DEPLOY.md`.

## Opção 1 — Vercel (recomendada)

1. Crie uma conta gratuita em https://vercel.com.
2. Instale o CLI:
   ```bash
   npm i -g vercel
   ```
3. Dentro da pasta do projeto, rode:
   ```bash
   vercel --prod
   ```
4. Aceite as configurações padrão (framework: **Other**, sem build).
5. A Vercel devolve duas URLs públicas:
   - `https://<seu-projeto>.vercel.app/consultor-premiacao.html`
   - `https://<seu-projeto>.vercel.app/supervisor-premiacao.html`

Para atualizar o site, basta rodar `vercel --prod` de novo.

## Opção 2 — Netlify

1. Crie conta em https://app.netlify.com.
2. Arraste e solte a pasta do projeto na área **Sites** do painel.
3. O Netlify gera uma URL pública imediatamente, no formato `https://<nome-aleatorio>.netlify.app`.
4. Acesse:
   - `https://<seu-site>.netlify.app/consultor-premiacao.html`
   - `https://<seu-site>.netlify.app/supervisor-premiacao.html`

Para atualizar, arraste a pasta de novo no mesmo site.

## Opção 3 — Cloudflare Pages

1. Acesse https://dash.cloudflare.com → **Workers & Pages** → **Create**.
2. Escolha **Upload assets**.
3. Faça upload da pasta do projeto.
4. URL pública: `https://<seu-projeto>.pages.dev`.

## Opção 4 — Hospedagem estática do próprio sistema

Se o sistema de vendas já tem servidor estático (Apache, Nginx, IIS, S3, etc.), copie os arquivos para uma rota dedicada, por exemplo:

- `https://sistema.suaempresa.com/premiacao/consultor-premiacao.html`
- `https://sistema.suaempresa.com/premiacao/supervisor-premiacao.html`

Não há nada para configurar além de servir os arquivos estáticos.

## Como incorporar no sistema de vendas

Cada página é independente. Use uma destas abordagens:

### A) Iframe (mais simples)
```html
<!-- Sistema dos consultores -->
<iframe
  src="https://<seu-site>/consultor-premiacao.html"
  style="width:100%;height:1100px;border:0;"
  title="Minha Premiação">
</iframe>

<!-- Sistema dos supervisores -->
<iframe
  src="https://<seu-site>/supervisor-premiacao.html"
  style="width:100%;height:1400px;border:0;"
  title="Premiação da Equipe">
</iframe>
```

### B) Rota direta dentro do sistema
Sirva os arquivos estáticos pelo próprio sistema e linke como uma rota normal:
- Botão no menu do consultor → abre `/premiacao/consultor-premiacao.html`
- Botão no menu do supervisor → abre `/premiacao/supervisor-premiacao.html`

### C) Identificação do perfil
A página espera o perfil em `sessionStorage.ads_user_role` com um destes valores:
- `CONSULTOR`
- `SUPERVISOR`
- `ADMIN`

Antes de redirecionar o usuário para a página de premiação, o sistema de vendas deve gravar o perfil:
```js
sessionStorage.setItem('ads_user_role', 'SUPERVISOR'); // ou CONSULTOR / ADMIN
window.location.href = '/premiacao/supervisor-premiacao.html';
```

Sem essa configuração, o sistema assume `ADMIN` (libera tudo) — bom para testes locais, ruim para produção. Garanta a gravação correta antes de publicar.

## Como rodar os testes

Depois de publicar, abra a URL `https://<seu-site>/testes.html`. A página mostra os 27 testes em tela com bolinhas verdes (passou) e vermelhas (falhou). Também é possível abrir qualquer outra página, pressionar `F12` no navegador, ir na aba **Console** e digitar:
```js
runTests()
```

## Como mudar a marca / logo

Edite `config.js`:
```js
const CONFIG = {
  BRAND_NAME: 'ADS Software',     // texto do cabeçalho e rodapé
  BRAND_LOGO_PATH: './logo-empresa.png', // imagem opcional ao lado do texto
  PERIODO_LABEL: 'Abril 2026',     // mês exibido no rodapé
  ...
};
```

Se o arquivo `logo-empresa.png` existir, ele é exibido. Se não, o texto `ADS Software` aparece no lugar — sem ícone quebrado.

## Integração com Bitrix24 (futuro)

O arquivo `bitrixCarteiraService.js` é o esqueleto da integração. A configuração mora em `config.js` (campos `BITRIX_*`) e nada está hardcodado nas telas. Quando for ativar a integração, basta preencher `config.js` com a URL do webhook e os IDs reais.

## Checklist final antes de publicar

- [ ] Os 27 testes em `testes.html` estão verdes.
- [ ] Em mobile, a tela do consultor cabe sem rolagem horizontal.
- [ ] Em mobile, a tela do supervisor mostra cards de consultor (sem tabela esmagada).
- [ ] O sistema de vendas grava `sessionStorage.ads_user_role` antes de abrir a página.
- [ ] `config.js` tem o nome da marca e o período correto.
- [ ] Os arquivos legados (`simulador_*.html`, `Tabela de premiações  28042026.xlsx`, `import-xlsx.py`) ficaram fora do servidor de produção.
