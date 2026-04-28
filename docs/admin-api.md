# Admin API

Documentação da API administrativa ativa em `/api/v1/admin`.

## Autenticação

O painel atual usa Laravel Sanctum com token Bearer.

Fluxo:

1. `POST /api/v1/admin/auth/login`
2. usar `Authorization: Bearer <token>` nas chamadas seguintes
3. `GET /api/v1/admin/auth/me` para validar sessão
4. `POST /api/v1/admin/auth/logout` para invalidar o token atual

### Login

`POST /api/v1/admin/auth/login`

Payload:

```json
{
  "email": "admin@example.com",
  "password": "password",
  "deviceName": "frontend-admin"
}
```

Resposta esperada:

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

### Sessão atual

`GET /api/v1/admin/auth/me`

Resposta esperada:

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "isAdmin": true
}
```

### Logout

`POST /api/v1/admin/auth/logout`

Resposta esperada:

```json
{
  "message": "Logged out successfully."
}
```

## Endpoints administrativos

### Auth

- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/logout`

### Cities

- `GET /api/v1/admin/cities`
- `POST /api/v1/admin/cities`
- `GET /api/v1/admin/cities/{city}`
- `PUT|PATCH /api/v1/admin/cities/{city}`
- `DELETE /api/v1/admin/cities/{city}`

### Events

- `GET /api/v1/admin/events`
- `POST /api/v1/admin/events`
- `GET /api/v1/admin/events/{event}`
- `PUT|PATCH /api/v1/admin/events/{event}`
- `DELETE /api/v1/admin/events/{event}`

### Regions

- `GET /api/v1/admin/regions`
- `POST /api/v1/admin/regions`
- `PUT|PATCH /api/v1/admin/regions/{region}`
- `DELETE /api/v1/admin/regions/{region}`

### Interest Tags

- `GET /api/v1/admin/interest-tags`
- `POST /api/v1/admin/interest-tags`
- `PUT|PATCH /api/v1/admin/interest-tags/{interestTag}`
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

Notas:

- `slug` é opcional
- se omitido, o backend gera slug a partir do nome

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

### Upload de mídia

`POST /api/v1/admin/media`

`multipart/form-data`

Campos:

- `file` obrigatório
- `collection` opcional: `cover`, `gallery`, `general`
- `altText` opcional

Regras:

- apenas imagens
- extensões permitidas: `jpg`, `jpeg`, `png`, `webp`
- tamanho máximo: `5 MB`

Resposta esperada:

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

## Respostas esperadas

### Cidade criada

Exemplo resumido:

```json
{
  "id": 1,
  "name": "Alto Paraíso de Goiás",
  "slug": "alto-paraiso-de-goias",
  "summary": "Base da Chapada.",
  "description": "Destino com trilhas e cachoeiras.",
  "coverImage": "https://example.com/capa.jpg",
  "isPublished": true,
  "region": {
    "id": 1,
    "name": "Chapada dos Veadeiros"
  }
}
```

### Listagens paginadas

Endpoints como `cities`, `events` e `media` retornam:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 0
  }
}
```

## Erros comuns

### `401 Unauthenticated`

- token ausente
- token expirado/removido

Resposta:

```json
{
  "message": "Unauthenticated."
}
```

### `403 Forbidden`

- usuário autenticado sem `is_admin = true`
- policy negou a ação

Resposta:

```json
{
  "message": "Forbidden."
}
```

### `409 Conflict`

Casos atuais:

- região com cidades vinculadas
- cidade com eventos vinculados
- mídia vinculada a cidade ou evento

### `422 Validation error`

Formato:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "fieldName": [
      "Mensagem de validação"
    ]
  }
}
```

Exemplos:

- `regionId` inexistente
- `cityId` inexistente
- `endsAt` anterior a `startsAt`
- `collection` inválida
- upload com arquivo não suportado
- mais de uma imagem marcada como capa na galeria

## Seed local

Credenciais padrão do `DatabaseSeeder`:

- admin: `admin@example.com` / `password`
- usuário comum: `test@example.com` / `password`
