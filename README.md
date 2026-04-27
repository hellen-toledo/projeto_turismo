# Projeto Turismo Norte-Goiano

Portal turístico com backend Laravel API e frontend React/Vite. O projeto cobre vitrine pública de cidades e eventos e um painel administrativo protegido para manutenção editorial.

## Estado atual da Fase 4

A Fase 4 está implementada com:

- painel administrativo autenticado
- CRUD administrativo de cidades, eventos, regiões e tags de interesse
- upload real de mídia via Laravel Storage
- galeria de imagens para cidades e eventos
- atrações turísticas publicáveis nas cidades
- páginas públicas consumindo capa, galeria e atrações publicadas

## Stack

- Backend: Laravel 12, PHP 8.2+, Sanctum, Eloquent, SQLite local por padrão
- Frontend: React 19, TypeScript, Vite, React Router, React Query, Tailwind CSS
- Qualidade: PHPUnit, Vitest, Laravel Pint, ESLint

## API oficial

A única base oficial ativa da API é:

- `/api/v1`

Os aliases legados fora de `/api/v1` permanecem apenas como bloco comentado em [routes/api.php](routes/api.php) para referência histórica e não respondem como rotas ativas.

### Rotas públicas ativas

- `GET /api/v1/regions`
- `GET /api/v1/cities`
- `GET /api/v1/cities/{idOrSlug}`
- `GET /api/v1/events`
- `GET /api/v1/events/{idOrSlug}`
- `GET /api/v1/interest-tags`

### Rotas administrativas ativas

Auth:
- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/logout`

Cities:
- `GET /api/v1/admin/cities`
- `POST /api/v1/admin/cities`
- `GET /api/v1/admin/cities/{city}`
- `PUT|PATCH /api/v1/admin/cities/{city}`
- `DELETE /api/v1/admin/cities/{city}`

Events:
- `GET /api/v1/admin/events`
- `POST /api/v1/admin/events`
- `GET /api/v1/admin/events/{event}`
- `PUT|PATCH /api/v1/admin/events/{event}`
- `DELETE /api/v1/admin/events/{event}`

Regions:
- `GET /api/v1/admin/regions`
- `POST /api/v1/admin/regions`
- `PUT|PATCH /api/v1/admin/regions/{region}`
- `DELETE /api/v1/admin/regions/{region}`

Interest Tags:
- `GET /api/v1/admin/interest-tags`
- `POST /api/v1/admin/interest-tags`
- `PUT|PATCH /api/v1/admin/interest-tags/{interestTag}`
- `DELETE /api/v1/admin/interest-tags/{interestTag}`

Media:
- `GET /api/v1/admin/media`
- `POST /api/v1/admin/media`
- `DELETE /api/v1/admin/media/{media}`

## Estrutura

```text
/
├── app/
│   ├── Application/     # Actions e regras de negócio
│   ├── Domain/          # Models Eloquent e relações do domínio
│   ├── Http/
│   │   ├── Controllers/ # Entrada HTTP
│   │   ├── Requests/    # Validação e normalização
│   │   └── Resources/   # Serialização JSON
├── database/            # Migrations, factories e seeders
├── docs/                # Documentação complementar
├── frontend/            # SPA React/TypeScript
├── routes/              # Rotas da API
└── tests/               # Testes backend
```

## Painel administrativo

O frontend administrativo roda em:

- `http://localhost:5173/admin`

Fluxo:

1. Acesse `/admin/login`
2. Faça login com um usuário `is_admin = true`
3. O frontend usa token Bearer do Sanctum no consumo da API
4. Um usuário sem autenticação vai para `/admin/login`
5. Um usuário autenticado sem perfil admin recebe `403 Forbidden` nos endpoints administrativos

Credenciais padrão do seeder:

- admin: `admin@example.com` / `password`
- usuário comum: `test@example.com` / `password`

### Entidades gerenciáveis

No painel atual é possível gerenciar:

- cidades
- eventos
- regiões
- tags de interesse
- mídia administrativa enviada para o storage

### O que pode ser mantido nas cidades

- nome, slug, resumo e descrição
- região vinculada
- status de publicação
- tags de interesse
- imagem de capa por URL pública ou por mídia enviada
- galeria de imagens com `altText`, ordem e marcação de capa
- atrações turísticas com nome, descrição, imagem opcional, ordem e publicação

### O que pode ser mantido nos eventos

- título, slug e descrição
- cidade vinculada
- data/hora de início e fim
- URL externa
- destaque e publicação
- tags de interesse
- imagem de capa por URL pública ou por mídia enviada
- galeria de imagens com `altText`, ordem e marcação de capa

## Upload de mídia

O backend expõe:

- `POST /api/v1/admin/media`
- `GET /api/v1/admin/media`
- `DELETE /api/v1/admin/media/{media}`

Regras atuais:

- protegido por `auth:sanctum` e `can:access-admin`
- aceita apenas `jpg`, `jpeg`, `png`, `webp`
- limite de 5 MB por arquivo
- usa o disk `public`
- salva em `tourism/media/YYYY/MM`
- retorna URL pública gerada com `Storage::url()`

Payload de upload:

```json
{
  "file": "(multipart file)",
  "collection": "cover",
  "altText": "Vista panorâmica"
}
```

Exemplo de resposta:

```json
{
  "id": 15,
  "url": "/storage/tourism/media/2026/04/example.jpg",
  "path": "tourism/media/2026/04/example.jpg",
  "originalName": "example.jpg",
  "mimeType": "image/jpeg",
  "size": 183204,
  "collection": "cover",
  "altText": "Vista panorâmica",
  "createdAt": "2026-04-27T03:00:00+00:00"
}
```

## Como criar uma cidade com atrações e galeria

Fluxo recomendado no painel:

1. Crie ou selecione uma região
2. Crie tags de interesse se necessário
3. Envie uma imagem de capa ou informe uma URL pública
4. Adicione itens de galeria usando upload administrativo
5. Defina ordem, `altText` e a imagem de capa da galeria
6. Cadastre atrações com nome obrigatório e publicação individual

Payload principal enviado para `POST /api/v1/admin/cities`:

```json
{
  "name": "Alto Paraíso de Goiás",
  "slug": "alto-paraiso-de-goias",
  "summary": "Base de acesso à Chapada.",
  "description": "Destino turístico com trilhas e cachoeiras.",
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
    },
    {
      "mediaAssetId": 11,
      "sortOrder": 1,
      "altText": "Vista complementar",
      "isCover": false
    }
  ],
  "attractions": [
    {
      "name": "Mirante Central",
      "description": "Vista panorâmica da cidade.",
      "imageUrl": "https://example.com/mirante.jpg",
      "sortOrder": 0,
      "isPublished": true
    }
  ]
}
```

Observações:

- `coverImage` continua aceitando URL pública por compatibilidade
- se `coverImage` estiver vazio e houver item de galeria com `isCover = true`, a API pública usa a mídia marcada como capa
- atrações não publicadas não aparecem publicamente

## Como criar um evento com imagem

Payload principal enviado para `POST /api/v1/admin/events`:

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

Observações:

- `coverImage` continua aceitando URL pública
- a galeria é opcional
- se `coverImage` estiver vazio e a galeria tiver item `isCover = true`, a API retorna a URL da mídia marcada como capa

## Segurança e integridade

Rotas administrativas usam:

- `auth:sanctum`
- `can:access-admin`
- policies por recurso

Regras importantes:

- uploads de mídia não são públicos para escrita
- região com cidades vinculadas não pode ser excluída
- cidade com eventos vinculados não pode ser excluída
- mídia em uso por cidade ou evento não pode ser excluída

Respostas padronizadas:

- `401` não autenticado
- `403` sem permissão
- `409` conflito de integridade
- `422` erro de validação

## Variáveis de ambiente importantes

Backend, em `.env`:

```dotenv
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
SESSION_DRIVER=database
FILESYSTEM_DISK=local
```

Observações:

- o upload administrativo usa explicitamente o disk `public`, então `FILESYSTEM_DISK` não muda o fluxo de mídia da Fase 4
- em ambiente local com SQLite, crie o arquivo `database/database.sqlite` antes do `migrate`, se ele ainda não existir

Frontend, em `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

## Instalação e execução

### Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API local:

- `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local:

- `http://localhost:5173`

### Execução pelo root

```bash
npm install
npm run dev
```

## Comandos úteis

No root:

```bash
npm run backend:test
npm run backend:lint
npm run frontend:test
npm run frontend:lint
npm run frontend:build
```

Atalhos agregados:

```bash
npm run test
npm run lint
npm run build
```

## Testes e qualidade

Backend:

- `php artisan test`
- `vendor/bin/pint --test`

Frontend:

- `npm --prefix frontend run lint`
- `npm --prefix frontend run test`
- `npm --prefix frontend run build`

## Documentação complementar

- [docs/admin-api.md](docs/admin-api.md)
- [docs/architecture.md](docs/architecture.md)
