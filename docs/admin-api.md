# Admin API

Base de autenticação e CRUD administrativo do projeto.

## Autenticação

Implementada com Laravel Sanctum para:

- token Bearer em integrações administrativas
- autenticação stateful por sessão/cookie para um futuro painel web

### Login

`POST /api/v1/admin/auth/login`

Payload:

```json
{
  "email": "admin@example.com",
  "password": "password",
  "deviceName": "local-dev"
}
```

Resposta:

```json
{
  "token": "plain-text-token",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

Use o token como:

`Authorization: Bearer <token>`

O mesmo login também abre sessão `web` quando a requisição for stateful via cookie.

### Sessão atual

- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/logout`

## Proteção

As rotas administrativas usam:

- `auth:sanctum`
- `can:access-admin`
- policies por recurso (`City`, `Event`, `Region`, `InterestTag`)

Somente usuários com `is_admin = true` podem acessar a área administrativa.

## Separação de rotas

- públicas: `/api/v1/*`, além de aliases legados temporários marcados como deprecated
- administrativas: `/api/v1/admin/*`

## Endpoints protegidos

### Cities

- `GET /api/v1/admin/cities`
- `POST /api/v1/admin/cities`
- `PATCH /api/v1/admin/cities/{city}`
- `DELETE /api/v1/admin/cities/{city}`

### Events

- `GET /api/v1/admin/events`
- `POST /api/v1/admin/events`
- `PATCH /api/v1/admin/events/{event}`
- `DELETE /api/v1/admin/events/{event}`

### Regions

- `GET /api/v1/admin/regions`
- `POST /api/v1/admin/regions`
- `PATCH /api/v1/admin/regions/{region}`
- `DELETE /api/v1/admin/regions/{region}`

### Interest Tags

- `GET /api/v1/admin/interest-tags`
- `POST /api/v1/admin/interest-tags`
- `PATCH /api/v1/admin/interest-tags/{interestTag}`
- `DELETE /api/v1/admin/interest-tags/{interestTag}`

## Seed inicial

O `DatabaseSeeder` cria:

- usuário comum: `test@example.com` / `password`
- admin: `admin@example.com` / `password`
