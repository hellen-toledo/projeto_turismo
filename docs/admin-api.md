# Admin API

Documentação da API administrativa ativa em `/api/v1/admin`.

## Base e autenticação

Base oficial:

- `/api/v1/admin`

Autenticação:

- Laravel Sanctum
- token Bearer para o painel administrativo atual

Login:

- `POST /api/v1/admin/auth/login`

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

Sessão atual:

- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/logout`

## Proteção e segurança

Todas as rotas administrativas ativas usam:

- `auth:sanctum`
- `can:access-admin`
- policies por recurso (`City`, `Event`, `Region`, `InterestTag`, `MediaAsset`)

Somente usuários com `is_admin = true` podem gerenciar conteúdo.

Respostas relevantes:

- `401 Unauthenticated`
- `403 Forbidden`
- `409 Conflict`
- `422 Validation error`

Conflitos de integridade atuais:

- região com cidades vinculadas não pode ser excluída
- cidade com eventos vinculados não pode ser excluída
- mídia vinculada a cidade ou evento não pode ser excluída

## Endpoints ativos

### Auth

- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/logout`

### Cities

- `GET /api/v1/admin/cities`
- `POST /api/v1/admin/cities`
- `GET /api/v1/admin/cities/{city}`
- `PATCH /api/v1/admin/cities/{city}`
- `PUT /api/v1/admin/cities/{city}`
- `DELETE /api/v1/admin/cities/{city}`

### Events

- `GET /api/v1/admin/events`
- `POST /api/v1/admin/events`
- `GET /api/v1/admin/events/{event}`
- `PATCH /api/v1/admin/events/{event}`
- `PUT /api/v1/admin/events/{event}`
- `DELETE /api/v1/admin/events/{event}`

### Regions

- `GET /api/v1/admin/regions`
- `POST /api/v1/admin/regions`
- `PATCH /api/v1/admin/regions/{region}`
- `PUT /api/v1/admin/regions/{region}`
- `DELETE /api/v1/admin/regions/{region}`

### Interest Tags

- `GET /api/v1/admin/interest-tags`
- `POST /api/v1/admin/interest-tags`
- `PATCH /api/v1/admin/interest-tags/{interestTag}`
- `PUT /api/v1/admin/interest-tags/{interestTag}`
- `DELETE /api/v1/admin/interest-tags/{interestTag}`

### Media

- `GET /api/v1/admin/media`
- `POST /api/v1/admin/media`
- `DELETE /api/v1/admin/media/{media}`

## Payloads principais

### Criar região

`POST /api/v1/admin/regions`

```json
{
  "name": "Chapada dos Veadeiros"
}
```

### Criar tag de interesse

`POST /api/v1/admin/interest-tags`

```json
{
  "name": "Ecoturismo",
  "slug": "ecoturismo"
}
```

`slug` é opcional.

### Upload de mídia

`POST /api/v1/admin/media`

`multipart/form-data`

Campos:

- `file` obrigatório
- `collection` opcional: `cover`, `gallery`, `general`
- `altText` opcional

Regras:

- apenas imagens
- tipos permitidos: `jpg`, `jpeg`, `png`, `webp`
- limite: 5 MB
- armazenamento em `public/tourism/media/YYYY/MM`

Resposta:

```json
{
  "id": 10,
  "url": "/storage/tourism/media/2026/04/capa.jpg",
  "path": "tourism/media/2026/04/capa.jpg",
  "originalName": "capa.jpg",
  "mimeType": "image/jpeg",
  "size": 183204,
  "collection": "cover",
  "altText": "Vista principal",
  "createdAt": "2026-04-27T03:00:00+00:00"
}
```

### Criar cidade

`POST /api/v1/admin/cities`

```json
{
  "name": "Alto Paraíso de Goiás",
  "slug": "alto-paraiso-de-goias",
  "summary": "Base da Chapada.",
  "description": "Destino com trilhas e cachoeiras.",
  "coverImage": "https://example.com/capa.jpg",
  "regionId": 1,
  "isPublished": true,
  "interestTagIds": [1, 2],
  "gallery": [
    {
      "mediaAssetId": 10,
      "sortOrder": 0,
      "altText": "Foto de capa",
      "isCover": true
    }
  ],
  "attractions": [
    {
      "name": "Mirante Central",
      "description": "Vista panorâmica.",
      "imageUrl": "https://example.com/mirante.jpg",
      "sortOrder": 0,
      "isPublished": true
    }
  ]
}
```

Notas:

- `coverImage` continua aceitando URL pública
- `gallery` referencia `mediaAssetId`
- apenas uma imagem de galeria pode ser `isCover = true`

### Criar evento

`POST /api/v1/admin/events`

```json
{
  "title": "Festival do Lago",
  "slug": "festival-do-lago",
  "description": "Evento cultural e turístico.",
  "startsAt": "2026-09-10T09:00:00Z",
  "endsAt": "2026-09-10T18:00:00Z",
  "coverImage": "https://example.com/evento.jpg",
  "externalUrl": "https://example.com/festival",
  "cityId": 1,
  "isFeatured": true,
  "isPublished": true,
  "interestTagIds": [1],
  "gallery": [
    {
      "mediaAssetId": 20,
      "sortOrder": 0,
      "altText": "Capa do evento",
      "isCover": true
    }
  ]
}
```

## Fluxo de upload

1. O painel envia o arquivo para `POST /api/v1/admin/media`
2. A API salva o binário no disk `public`
3. A API persiste `MediaAsset`
4. O frontend recebe `id`, `url` e metadados
5. O formulário de cidade ou evento referencia o `mediaAssetId` na galeria

## Regras de leitura pública relacionadas

- `CityResource` e `EventResource` mantêm `coverImage` por compatibilidade
- se `coverImage` estiver vazio e houver item de galeria marcado como capa, a API pública usa a URL da mídia marcada com `isCover = true`
- atrações não publicadas não saem no detalhe público da cidade

## Limitações conhecidas

- o frontend público ainda não possui página própria de detalhe do evento
- tags de interesse não retornam contadores de uso na API atual
- os aliases legados comentados em `routes/api.php` não fazem parte da API ativa e não devem ser documentados como disponíveis

## Dados de seed

O `DatabaseSeeder` cria:

- admin: `admin@example.com` / `password`
- usuário comum: `test@example.com` / `password`
