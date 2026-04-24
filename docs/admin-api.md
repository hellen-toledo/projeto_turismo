# Admin API

Base de autenticação e CRUD administrativo do projeto.

## Autenticação

Implementada com Laravel Sanctum para:

- token Bearer em integrações administrativas
- autenticação stateful por sessão/cookie para um futuro painel web

### Login

`POST /api/admin/v1/auth/login`

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

- `GET /api/admin/v1/auth/me`
- `POST /api/admin/v1/auth/logout`

## Proteção

As rotas administrativas usam:

- `auth:sanctum`
- `can:access-admin`
- policies por recurso (`City`, `Event`, `Region`, `InterestTag`)

Somente usuários com `is_admin = true` podem acessar a área administrativa.

## Separação de rotas

- públicas: `/api/v1/*`, além dos aliases legados `/api/cidades`, `/api/eventos` e `/api/regions`
- administrativas: `/api/admin/v1/*`

## Endpoints protegidos

### Cities

- `GET /api/admin/v1/cities`
- `POST /api/admin/v1/cities`
- `PATCH /api/admin/v1/cities/{city}`
- `DELETE /api/admin/v1/cities/{city}`

### Events

- `GET /api/admin/v1/events`
- `POST /api/admin/v1/events`
- `PATCH /api/admin/v1/events/{event}`
- `DELETE /api/admin/v1/events/{event}`

### Regions

- `GET /api/admin/v1/regions`
- `POST /api/admin/v1/regions`
- `PATCH /api/admin/v1/regions/{region}`
- `DELETE /api/admin/v1/regions/{region}`

### Interest Tags

- `GET /api/admin/v1/interest-tags`
- `POST /api/admin/v1/interest-tags`
- `PATCH /api/admin/v1/interest-tags/{interestTag}`
- `DELETE /api/admin/v1/interest-tags/{interestTag}`

## Seed inicial

O `DatabaseSeeder` cria:

- usuário comum: `test@example.com` / `password`
- admin: `admin@example.com` / `password`
