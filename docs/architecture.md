# Arquitetura

## Visão geral

O projeto é dividido em duas aplicações:

- backend Laravel em `/`
- frontend React/Vite em `frontend/`

O backend é a fonte de verdade para domínio, persistência, autenticação, autorização e contratos HTTP. O frontend é uma SPA que consome a API oficial versionada em `/api/v1`.

## Versionamento da API

- base oficial ativa: `/api/v1`
- área administrativa: `/api/v1/admin`

As rotas legadas sem versionamento aparecem apenas como bloco comentado em [routes/api.php](/home/hellen/projeto_turismo/routes/api.php:1) e não fazem parte da API ativa.

## Backend

### Camadas

- `app/Http`
  Entrada HTTP. Controllers recebem a requisição, delegam para `FormRequest`, actions e resources.

- `app/Application`
  Casos de uso e regras de negócio. Criação, atualização, listagem, exclusão, geração de slug e sincronização de galeria ficam aqui.

- `app/Domain`
  Models Eloquent e relações de domínio. É a camada principal de persistência do projeto.

- `app/Models`
  Wrappers de compatibilidade para alguns models. O código novo continua priorizando `app/Domain`, mas o projeto ainda mantém aliases como `App\Models\City`.

- `app/Policies`
  Autorização por recurso. O admin passa por gate global e também por policies explícitas nos controllers.

### Controllers públicos vs administrativos

- Controllers públicos em `app/Http/Controllers/Api`
  Expostos apenas por rotas `GET` em `/api/v1`.
  São somente leitura.
  Exemplos: `CityController`, `EventController`, `RegionController`, `InterestTagController`.

- Controllers administrativos em `app/Http/Controllers/Api/Admin*`
  Expostos apenas em `/api/v1/admin`.
  Executam CRUD, upload de mídia e leitura de sessão.
  Cada ação sensível chama `authorize(...)` explicitamente e também passa por middleware de autenticação/autorização.

### Fluxo de uma requisição pública

Exemplo: `GET /api/v1/cities/{idOrSlug}`

1. A rota em [routes/api.php](/home/hellen/projeto_turismo/routes/api.php:1) aponta para `Api\CityController@show`.
2. O controller resolve o identificador com `FindCityByIdOrSlugAction`.
3. A action de leitura carrega relações e regras de publicação.
4. O model em `app/Domain` consulta o banco.
5. `CityResource` serializa a resposta em `camelCase`.
6. A API retorna JSON para o frontend público.

### Fluxo de uma requisição administrativa

Exemplo: `PATCH /api/v1/admin/events/{event}`

1. A rota passa por `auth:sanctum` e `can:access-admin`.
2. O controller administrativo recebe um `UpdateEventRequest`.
3. O `FormRequest` valida payload, relacionamento, datas e autorização do recurso.
4. O controller chama `authorize('update', $event)`.
5. `UpdateEventAction` executa a regra de negócio e persiste a alteração.
6. `EventResource` serializa o resultado em `camelCase`.
7. A API retorna JSON para o painel administrativo.

### Autenticação com Sanctum

O backend usa Laravel Sanctum em modo token Bearer para o painel atual.

Fluxo:

1. `POST /api/v1/admin/auth/login`
2. O backend valida e-mail, senha e `is_admin`.
3. O usuário recebe um token Sanctum com ability `admin`.
4. O frontend envia `Authorization: Bearer <token>` nas chamadas administrativas.
5. `GET /api/v1/admin/auth/me` valida a sessão atual.
6. `POST /api/v1/admin/auth/logout` remove o token corrente.

### Integridade e segurança

- middleware administrativo: `auth:sanctum`
- gate administrativo: `can:access-admin`
- policies por recurso: `City`, `Event`, `Region`, `InterestTag`, `MediaAsset`
- respostas JSON padronizadas para `401`, `403`, `404`, `405`, `409`, `422` e `429`

Regras de integridade relevantes:

- região com cidades vinculadas não pode ser excluída
- cidade com eventos vinculados não pode ser excluída
- mídia em uso por cidade ou evento não pode ser excluída

### Mídia administrativa

O backend expõe:

- `GET /api/v1/admin/media`
- `POST /api/v1/admin/media`
- `DELETE /api/v1/admin/media/{media}`

Características:

- upload validado via `StoreMediaAssetRequest`
- tipos permitidos: `jpg`, `jpeg`, `png`, `webp`
- tamanho máximo: `15360 KB`
- armazenamento em `public/tourism/media/YYYY/MM`
- serialização via `MediaAssetResource`

## Frontend

O frontend detalhado está em [frontend.md](./frontend.md).

Resumo:

- rotas públicas e administrativas ficam em `frontend/src/app/routes.tsx`
- consumo HTTP centralizado em `frontend/src/shared/lib/api`
- sessão admin centralizada em `frontend/src/shared/lib/auth/adminSession.ts`
- features administrativas organizadas em `frontend/src/features/admin`

## Documentação relacionada

- [Admin API](./admin-api.md)
- [Frontend](./frontend.md)
