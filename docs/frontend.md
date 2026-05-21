# Frontend

## Visão geral

O frontend fica em `frontend/` e é uma SPA React 19 + TypeScript + Vite. Ele consome a API oficial em `/api/v1` e contém tanto a vitrine pública quanto o painel administrativo.

## Estrutura

Principais áreas em `frontend/src`:

- `app`
  Bootstrap da aplicação, providers e definição de rotas.

- `features`
  Organização por domínio/feature.
  O projeto já usa:
  - `admin`
  - `cities`
  - `events`
  - `home`

- `pages`
  Páginas públicas de rota.

- `shared/components`
  Componentes reutilizáveis.

- `shared/lib/api`
  Cliente HTTP, paths, tratamento de erro e helpers de resposta.

- `shared/lib/auth`
  Sessão administrativa centralizada.

- `test`
  Setup e utilitários do Vitest.

## Rotas públicas

Definidas em [frontend/src/app/routes.tsx](/home/hellen/projeto_turismo/frontend/src/app/routes.tsx:1):

- `/`
- `/cidades`
- `/cidades/:idOrSlug`
- `/eventos`
- `/eventos/:idOrSlug`
- `/guia`
- `/contato`

## Rotas administrativas

Definidas no mesmo arquivo:

- `/admin/login`
- `/admin`
- `/admin/cities`
- `/admin/events`
- `/admin/media`
- `/admin/regions`
- `/admin/interest-tags`

`/admin/*` usa `AdminRoute` para proteger acesso e `AdminLayout` para navegação interna do painel.

## Estrutura da feature admin

Em `frontend/src/features/admin`:

- `api`
  Módulos de integração com a API administrativa.

- `components`
  Guards e componentes específicos do painel.

- `forms`
  Formulários de cidade, evento, região e tag.

- `hooks`
  Hooks de autenticação e de React Query para leitura/mutação.

- `layouts`
  Layout do painel administrativo.

- `pages`
  Telas administrativas.

- `types`
  Tipos auxiliares para formulários e feedback.

## Camada de API

### Cliente único

O frontend usa um único cliente Axios em [frontend/src/shared/lib/api/client.ts](/home/hellen/projeto_turismo/frontend/src/shared/lib/api/client.ts:1).

Responsabilidades:

- definir `baseURL` a partir de `VITE_API_URL`
- anexar token Bearer quando existe sessão admin
- limpar sessão admin local em `401` ou `403` de endpoints administrativos

Em desenvolvimento, prefira `VITE_API_URL=/api/v1` e configure o alvo do proxy em `VITE_BACKEND_URL`. Isso mantém API e assets `/storage` na mesma origem do Vite, evitando URLs locais absolutas que podem não estar expostas ao navegador.

### Paths

Os paths ficam em [frontend/src/shared/lib/api/config.ts](/home/hellen/projeto_turismo/frontend/src/shared/lib/api/config.ts:1).

Isso evita URL hardcoded espalhada em componentes.

### React Query

Leitura, cache e invalidação ficam em hooks como:

- `useAdminCities`
- `useAdminEvents`
- `useAdminMedia`
- `useAdminRegions`
- `useAdminInterestTags`
- `useCities`
- `useCity`
- `useEvents`
- `useEvent`

## Gerenciamento de sessão admin

O estado da sessão administrativa é centralizado em [frontend/src/shared/lib/auth/adminSession.ts](/home/hellen/projeto_turismo/frontend/src/shared/lib/auth/adminSession.ts:1).

Responsabilidades do módulo:

- validar payload persistido
- manter sessão atual em memória
- persistir/limpar sessão no `localStorage`
- notificar listeners quando a sessão muda

O restante da aplicação não deve manipular `localStorage` diretamente.

### Fluxo atual

1. `AdminAuthProvider` restaura a sessão persistida.
2. Se existir token, chama `GET /api/v1/admin/auth/me`.
3. Se a sessão for válida, atualiza usuário e mantém o token.
4. Se a API responder `401` ou `403` em endpoint admin, o cliente HTTP limpa a sessão local.
5. `AdminRoute` percebe ausência de sessão e redireciona para `/admin/login`.

### Observação de segurança

Hoje o token admin ainda é persistido em `localStorage` por compatibilidade com o backend atual.

Isso é uma solução transitória. Em produção, o desenho preferível é autenticação com cookie `HttpOnly + SameSite + Secure`, reduzindo exposição do token a XSS.

## Upload de mídia no frontend

O painel já possui integração real com mídia:

- upload indireto nos formulários de cidades e eventos via `ImageUploadField`
- biblioteca administrativa dedicada em `/admin/media`

Endpoints usados:

- `GET /api/v1/admin/media`
- `POST /api/v1/admin/media`
- `DELETE /api/v1/admin/media/{media}`

## Build e qualidade

No diretório `frontend/`:

```bash
npm run build
npm run lint
npm run test
```
