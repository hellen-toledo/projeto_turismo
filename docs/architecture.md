# Arquitetura

## Visão geral

O projeto segue o modelo:

- backend Laravel API
- frontend React/Vite separado em `frontend/`

O backend é a fonte de verdade para domínio, persistência, autenticação, autorização e contratos HTTP. O frontend é uma SPA consumidora da API oficial em `/api/v1`.

## Convenções ativas

- base oficial da API: `/api/v1`
- área administrativa: `/api/v1/admin`
- chaves JSON serializadas para o frontend em `camelCase`
- validação de entrada em `FormRequest`
- respostas estruturadas em `Resource`
- regras de negócio em `app/Application`
- models Eloquent em `app/Domain`

As rotas legadas fora de `/api/v1` não fazem parte do fluxo ativo atual.

## Backend

### Camadas

- `app/Domain`
  Modelos Eloquent e relações do domínio.

- `app/Application`
  Actions e regras de negócio.

- `app/Http/Controllers/Api`
  Entrada HTTP fina, delegando para requests, actions e resources.

- `app/Http/Requests`
  Validação, autorização e normalização.

- `app/Http/Resources`
  Serialização JSON.

- `app/Policies`
  Autorização por recurso.

### Segurança

Admin:

- autenticação por Sanctum
- middleware `auth:sanctum`
- gate `can:access-admin`
- policies por recurso

Estados de erro da API:

- `401` não autenticado
- `403` sem permissão
- `409` conflito de integridade
- `422` validação

### Integridade operacional da Fase 4

As regras de exclusão ficam explicitadas nas actions:

- regiões com cidades vinculadas retornam conflito
- cidades com eventos vinculados retornam conflito
- mídia em uso por cidade ou evento retorna conflito

Essa decisão evita deleções acidentais em cascata no fluxo administrativo, mesmo quando o banco possui relações com `cascadeOnDelete`.

### Mídia

O fluxo de upload usa:

- model `MediaAsset`
- disk `public`
- diretório `tourism/media/YYYY/MM`

As cidades e eventos se relacionam com mídia por tabelas pivot:

- `city_media_asset`
- `event_media_asset`

Cada vínculo suporta:

- `sort_order`
- `alt_text`
- `is_cover`

`coverImage` continua sendo um campo de compatibilidade por URL. Quando esse campo estiver vazio, os resources públicos usam a mídia marcada como capa na galeria.

### Entidades administrativas da Fase 4

- `Region`
- `InterestTag`
- `City`
- `CityAttraction`
- `Event`
- `MediaAsset`

## Frontend

### Organização

- `frontend/src/features`
  Organização por feature.

- `frontend/src/shared/lib/api`
  Cliente HTTP único, configuração base e utilitários comuns.

- `frontend/src/shared/components`
  Componentes reutilizáveis.

### Estratégia de dados

- React Query para leitura, cache e invalidação
- APIs por feature em `frontend/src/features/*/api`
- nenhum acesso HTTP direto em páginas fora da camada apropriada

### Painel administrativo

O painel atual cobre:

- cidades
- eventos
- regiões
- tags de interesse
- upload administrativo de mídia

Fluxos relevantes:

- `ImageUploadField` envia mídia para `/api/v1/admin/media`
- formulários de cidade e evento referenciam `mediaAssetId` na galeria
- formulários administrativos invalidam queries relacionadas após create, update e delete

## Fluxo de dados

1. A SPA envia requisição HTTP para `/api/v1/*`
2. O controller recebe a entrada
3. Um `FormRequest` valida e autoriza
4. Uma action em `app/Application` executa o caso de uso
5. Models em `app/Domain` consultam ou persistem o banco
6. Um `Resource` serializa a resposta
7. O frontend atualiza tela e cache

## Execução local

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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Variável principal do frontend

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

## Qualidade e validação

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

## Limitações conhecidas

- o frontend público ainda não possui página própria de detalhe do evento
- tags de interesse ainda não expõem contadores de uso no contrato da API
- o bloco comentado de aliases legados em `routes/api.php` serve apenas como referência histórica e não como parte ativa da arquitetura
