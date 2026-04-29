# Prompt para Claude Code - Simulador de Premiação no Sistema de Vendas

Você é o Claude Code atuando como engenheiro frontend sênior e product designer. Quero transformar os arquivos atuais deste protótipo em telas reais de um sistema de vendas, com UI/UX inspirada em produtos Google.

## Contexto do projeto

Existe um simulador de premiação de carteira com duas telas separadas:

- `consultor-premiacao.html`: tela individual do consultor.
- `supervisor-premiacao.html`: painel da equipe para supervisor.
- `premiacao-rules.js`: regras de cálculo, tabela real da planilha, certificação, cobertura e testes.
- `styles.css`: estilos compartilhados.
- `config.js`: marca, período e configuração futura.
- `access-control.js`: controle de perfil.
- `bitrixCarteiraService.js`: estrutura futura para integração com Bitrix24.
- `documentacao.html`: documentação funcional e briefing de design.

Essas páginas serão incorporadas em sistemas diferentes:

- Página do consultor: será exibida no sistema dos consultores.
- Página do supervisor: será exibida no sistema dos supervisores.

Por isso, as páginas precisam continuar separadas. Não criar abas na mesma tela.

## Objetivo

Criar uma experiência prática, rápida, bonita, funcional em mobile e fácil para vendedores entenderem.

A tela deve responder em menos de 10 segundos:

1. Quanto vou receber?
2. Qual certificação eu atingi?
3. Minha certificação está validada ou bloqueada?
4. O que falta fazer para liberar?

## Estilo visual desejado

Usar UI/UX estilo Google:

- Fundo claro.
- Cards brancos.
- Bordas suaves.
- Tipografia parecida com Google Sans, Roboto ou Inter.
- Azul principal `#1A73E8`.
- Verde `#188038`.
- Vermelho `#D93025`.
- Amarelo `#F9AB00`.
- Texto principal `#202124`.
- Texto secundário `#5F6368`.
- Borda `#DADCE0`.
- Fundo `#F8FAFD`.
- Interface corporativa, limpa e operacional.
- Gamificação discreta, sem parecer infantil.
- Sem roxo pesado.
- Sem gradiente exagerado.
- Sem cara de campanha.
- Sem ícones quebrados ou dependentes de CDN instável.

## Linguagem da interface

Usar português simples e direto.

Evitar termos técnicos, inglês e abreviações.

Não usar:

- placeholder
- dev
- demo
- Sup.
- Prêmio Sup.
- ranking técnico
- nível sem contexto
- valor extra
- prêmio adicional

Usar:

- Premiação estimada pela tabela
- Certificação potencial
- Certificação validada
- Bloqueada por cobertura
- Cobertura da carteira
- Clientes pendentes de atendimento
- Faixa aplicada
- Clientes na carteira
- Clientes atendidos

Texto obrigatório em ambas as páginas:

> A certificação só é liberada com 100% de cobertura da carteira. O bônus de cobertura só é somado quando há performance mínima de R$ 10.000 e cobertura plena. Certificação não gera valor extra.

## Regras de negócio obrigatórias

### Premiação

A premiação vem exclusivamente da tabela real presente em `premiacao-rules.js`.

Não inventar valores.
Não criar fórmula própria se a tabela já traz o valor.
Não somar qualidade nem certificação fora da tabela.
Somar o bônus de cobertura separadamente somente quando as condições forem atendidas.

Para consultor:

- Usar `getPremioConsultor(faturamento)`.

Para supervisor:

- Usar `getPremioSupervisorPorConsultor(faturamento)` para cada consultor.
- Total do supervisor = soma dos prêmios individuais dos consultores.
- Nunca calcular pelo faturamento total da equipe.

Exemplos obrigatórios:

- R$ 9.999,99: sem premiação.
- R$ 10.999,99: usa faixa de R$ 10.000.
- R$ 35.700,00: usa faixa de R$ 35.000.
- R$ 60.999,00: usa faixa de R$ 60.000.
- Ana Julia com R$ 35.000: consultor R$ 2.550 e supervisor R$ 1.450.
- Italo com R$ 9.800: supervisor R$ 0.

### Certificação

A certificação é apenas status visual e operacional. Não adiciona dinheiro.

Faixas:

- Bronze: R$ 15.000+
- Prata: R$ 25.000+
- Ouro: R$ 35.000+
- Diamante: R$ 45.000+
- Platinum: R$ 60.000+

Regras:

- Faturamento define certificação potencial.
- Cobertura de 100% valida.
- Cobertura menor que 100% bloqueia.
- Se faturamento atinge Ouro e cobertura é 99%, mostrar bloqueada.
- Se faturamento atinge Ouro e cobertura é 100%, mostrar validada.

### Bônus de cobertura

O bônus de cobertura deve ser somado e demonstrado no simulador, separado do valor da tabela.

Para CONSULTOR:

- Bônus de cobertura: R$ 300.
- Somar somente quando o consultor tiver faturamento mínimo de R$ 10.000 e cobertura plena de 100%.
- Se o faturamento for menor que R$ 10.000, não somar o bônus, mesmo com cobertura 100%.

Para SUPERVISOR:

- Bônus de cobertura: R$ 600.
- Somar somente quando existir performance mínima de R$ 10.000 na equipe e a cobertura da equipe estiver plena.
- O bônus do supervisor deve aparecer separado do valor da tabela.

Total exibido:

```txt
Consultor = prêmio da tabela do consultor + bônus de cobertura do consultor quando liberado
Supervisor = soma dos prêmios individuais da tabela do supervisor + bônus de cobertura do supervisor quando liberado
```

### Cobertura

Não pedir porcentagem manual.

Calcular com:

```txt
cobertura = clientes atendidos / clientes na carteira * 100
```

Regras:

- Se clientes na carteira = 0, mostrar sem carteira vigente e não liberar certificação.
- Se clientes atendidos > clientes na carteira, limitar ao total ou exibir alerta claro.
- Cobertura plena somente quando clientes atendidos === clientes na carteira e clientes na carteira > 0.

## Página do consultor

Arquivo base: `consultor-premiacao.html`.

Essa página deve mostrar apenas informações individuais.

Não mostrar:

- Dados de outros consultores.
- Dados da equipe.
- Prêmio do supervisor.
- Ranking da equipe.
- Tabela geral.

Estrutura desejada:

1. Header com logo discreta.
2. Card principal com:
   - Premiação estimada pela tabela.
   - Certificação potencial.
   - Status da certificação.
   - Cobertura da carteira.
3. Campos simples:
   - Faturamento do mês.
   - Clientes na carteira.
   - Clientes atendidos.
4. Progresso para próxima certificação.
5. Pendências de atendimento.
6. Explicação curta da regra.

Tom da tela:

- "Quanto vou receber este mês?"
- "Faltam 2 clientes para validar sua certificação."
- "Você atingiu Ouro, mas precisa atender 100% da carteira."
- "Todos os clientes foram atendidos. Certificação validada."

## Página do supervisor

Arquivo base: `supervisor-premiacao.html`.

Essa página deve mostrar visão da equipe.

Estrutura desejada:

1. Header com logo discreta.
2. Card principal:
   - Premiação estimada do supervisor.
   - Total de consultores.
   - Consultores com cobertura plena.
3. Cards simples:
   - Consultores certificados.
   - Consultores bloqueados por cobertura.
   - Cobertura média.
   - Clientes pendentes.
4. Tabela de consultores:
   - Consultor.
   - Faturamento.
   - Clientes na carteira.
   - Clientes atendidos.
   - Clientes pendentes.
   - Cobertura.
   - Certificação potencial.
   - Status.
   - Premiação gerada.
5. Pendências por consultor.
6. Ranking simples por faturamento.
7. Ranking simples por premiação gerada.

Importante:

- Demonstrar o bônus de cobertura de R$ 600 separado do valor da tabela.
- Não somar certificação fora da tabela.
- O supervisor precisa entender rapidamente qual consultor está travando cobertura e certificação.

## Mobile

Obrigatório:

- Funcionar bem no celular.
- Sem tabela esmagada.
- Se tabela não couber, usar cards por consultor no mobile ou rolagem horizontal bem polida.
- Botões grandes o suficiente para toque.
- Texto sem quebrar de forma feia.
- Resultado principal visível rápido.
- Espaçamento bom.

## Gamificação discreta

Pode usar:

- Barra de progresso para próxima certificação.
- Certificação visual em chips discretos.
- Estados positivos e bloqueados com cores claras.
- Microcopy motivadora.

Não usar:

- Emojis grandes.
- Medalhas infantis.
- Confete.
- Visual de jogo.

## Logo e marca

Usar `CONFIG.BRAND_NAME` e `CONFIG.BRAND_LOGO_PATH`.

Se `logo-empresa.png` existir, exibir.
Se não existir, usar texto `ADS Software`.

Não usar logo antiga.
Não usar MS Connect.
Não usar base64.

## Controle de acesso

Manter as páginas separadas.

Perfis:

- CONSULTOR acessa consultor.
- SUPERVISOR acessa supervisor.
- ADMIN acessa ambas.

Se CONSULTOR tentar acessar supervisor, exibir:

> Você não tem permissão para acessar esta página.

Para teste local, pode existir modo de desenvolvimento por URL, mas não pode aparecer visualmente para usuário final.

## Integração futura

Manter modo manual funcionando.

Preparar para integração com Bitrix24 usando `bitrixCarteiraService.js`, sem hardcodar:

- webhook
- token
- URL privada
- ID de funil
- ID de campo

Usar as variáveis de `config.js`.

## Testes obrigatórios

Rodar ou manter `runTests()` passando.

Validar:

- 9999 retorna null.
- 10000 retorna faixa 10000.
- 10999 retorna faixa 10000.
- 11000 retorna faixa 11000.
- 35700 retorna faixa 35000.
- 60999 retorna faixa 60000.
- 35000 retorna valores reais da planilha.
- 60000 retorna valores reais da planilha.
- 100000 retorna valores reais da planilha.
- 14999 sem certificação.
- 15000 Bronze.
- 25000 Prata.
- 35000 Ouro.
- 45000 Diamante.
- 60000 Platinum.
- 35000 com cobertura 99% bloqueada.
- 35000 com cobertura 100% validada.
- 10 vigentes e 10 atendidos = 100%.
- 10 vigentes e 9 atendidos = 90%.
- 0 vigentes não libera certificação.
- Atendidos maior que vigentes é limitado ou alerta.
- Italo com R$ 9.800 gera R$ 0 para supervisor.
- Supervisor soma por consultor individual.
- Certificação não altera prêmio.
- Bônus consultor soma R$ 300 somente com faturamento mínimo de R$ 10.000 e cobertura plena.
- Bônus supervisor soma R$ 600 somente com performance mínima e cobertura plena da equipe.
- Consultor não acessa supervisor.
- Supervisor acessa supervisor.
- Admin acessa ambas.

## Entrega esperada

Entregar:

1. Código atualizado.
2. Telas prontas para serem incorporadas no sistema de vendas.
3. Interface responsiva e bonita.
4. Comunicação simples para vendedores.
5. Zero termos técnicos visíveis ao usuário.
6. Zero valores inventados.
7. Bônus de cobertura demonstrado separadamente e condicionado a R$ 10.000 + cobertura plena.
8. Testes passando.
9. Instruções para publicar em nuvem.

## Publicação em nuvem

Preparar para publicar de forma simples.

Opções aceitáveis:

- Vercel.
- Netlify.
- Cloudflare Pages.
- Hospedagem estática do próprio sistema.

Se criar projeto moderno, preferir:

- Vite + React + TypeScript, se for integrar em sistema maior.
- Ou HTML/CSS/JS puro se o objetivo for embutir rápido por iframe ou rota estática.

Se migrar para React, preservar as regras em módulo separado:

- `src/lib/premiacaoRules.ts`
- `src/lib/accessControl.ts`
- `src/config/config.ts`
- `src/pages/consultor/SimuladorPremiacaoConsultor.tsx`
- `src/pages/supervisor/PainelPremiacaoSupervisor.tsx`

## Critério final de aceite

Está aprovado quando:

- Um vendedor entende a tela sem explicação.
- O resultado principal aparece em destaque.
- A comunicação é simples e objetiva.
- A tela funciona bem no celular.
- Consultor e supervisor continuam separados.
- A regra de premiação usa somente a tabela.
- A certificação é somente visual e operacional.
- Cobertura valida ou bloqueia certificação.
- Supervisor soma consultor por consultor.
- `runTests()` passa.
