# Deploy Docker Swarm — Simulador de Premiação

Este projeto roda como site estático em Nginx. A stack sobe dois containers separados usando a mesma imagem:

- `consultor`: abre `consultor-premiacao.html`
- `supervisor`: abre `supervisor-premiacao.html`

## Rede

A stack usa a mesma rede pública do Traefik:

```bash
docker network create --driver overlay --attachable network_public
```

Se a rede já existe na VPS, não rode novamente.

## Volumes

Não precisa criar volume. As páginas são estáticas e entram na imagem Docker no build.

## Build local ou na VPS

```bash
docker build -t simulador-premiacao:latest .
```

## Deploy em Swarm

Defina os hosts que o Traefik vai publicar:

```bash
export CONSULTOR_HOST=consultor.ads.software
export SUPERVISOR_HOST=supervisor.ads.software
export SIMULADOR_IMAGE=simulador-premiacao:latest
docker stack deploy -c docker-stack.premiacao.yml premiacao
```

Se usar registry, faça push e troque `SIMULADOR_IMAGE`:

```bash
docker tag simulador-premiacao:latest registry.seudominio.com/simulador-premiacao:latest
docker push registry.seudominio.com/simulador-premiacao:latest
export SIMULADOR_IMAGE=registry.seudominio.com/simulador-premiacao:latest
docker stack deploy -c docker-stack.premiacao.yml premiacao
```

## Conferir

```bash
docker stack services premiacao
docker service ps premiacao_consultor
docker service ps premiacao_supervisor
```

## Remover

```bash
docker stack rm premiacao
```
