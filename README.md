# Projeto Turismo

Aplicação organizada como `backend Laravel API + frontend React/Vite separado`.

## Estado atual

- backend Laravel com API pública em `/api/*`
- autenticação administrativa com Sanctum
- área administrativa inicial no frontend em `/admin`
- testes automatizados no backend e no frontend
- execução local por PHP nativo ou por Laravel Sail

## Estrutura

- `app`, `bootstrap`, `config`, `database`, `routes`, `tests`: backend Laravel
- `frontend`: SPA React/Vite
- `docs/architecture.md`: visão arquitetural
- `docs/admin-api.md`: endpoints administrativos

## Requisitos

- PHP 8.2+
- Composer
- Node.js 20+
- npm

Para ambiente containerizado:

- Docker
- Docker Compose

## Setup rápido

### Backend sem Docker

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API padrão: `http://localhost:8000`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend padrão: `http://localhost:5173`

### Banco local sem Docker

O `.env.example` vem configurado para `sqlite`, usando `database/database.sqlite`, que já existe no repositório.

Se preferir MySQL, ajuste no `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=projeto_turismo
DB_USERNAME=root
DB_PASSWORD=
```

## Setup com Sail

```bash
composer install
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm --prefix frontend install
./vendor/bin/sail npm --prefix frontend run dev -- --host
```

Serviços relevantes do `compose.yaml`:

- `laravel.test`: app PHP/Laravel
- `mysql`: banco principal e banco `testing`
- `redis`
- `mailpit`

## Como subir cada parte

### Backend

Sem Docker:

```bash
php artisan serve
```

Com Sail:

```bash
./vendor/bin/sail up -d
```

### Frontend

```bash
cd frontend
npm run dev
```

### Banco

Sem Docker:

- sqlite local em `database/database.sqlite`

Com Sail:

```bash
./vendor/bin/sail up -d mysql
```

### Ambiente combinado

Pelo Composer:

```bash
composer setup
composer dev
```

Pelo `package.json` raiz:

```bash
npm install
npm run dev
```

## Endpoints principais

### API pública

- `GET /api/v1/regions`
- `GET /api/v1/cities`
- `GET /api/v1/cities/{idOrSlug}`
- `GET /api/v1/events`
- `GET /api/v1/events/{idOrSlug}`

Aliases legados continuam disponíveis temporariamente:

- `GET /api/regions`
- `GET /api/cities`
- `GET /api/cities/{idOrSlug}`
- `GET /api/events`
- `GET /api/events/{idOrSlug}`
- `GET /api/cidades`
- `GET /api/eventos`

### API administrativa

- `POST /api/admin/v1/auth/login`
- `GET /api/admin/v1/auth/me`
- `POST /api/admin/v1/auth/logout`
- CRUD protegido para `cities`, `events`, `regions` e `interest-tags`

Detalhes em `docs/admin-api.md`.

## Testes

### Backend

```bash
php artisan test
```

Com Sail:

```bash
./vendor/bin/sail php artisan test
```

### Frontend

```bash
cd frontend
npm run test
```

### Atalhos no root

```bash
npm run test
npm run lint
composer test
composer lint
```

## Qualidade

- backend: `Laravel Pint`
- frontend: `ESLint`
- frontend tests: `Vitest + Testing Library`
- backend tests: `PHPUnit`

## Observações de arquitetura

- o backend concentra domínio, persistência, validação, autenticação e serialização
- o frontend concentra interface, roteamento client-side e consumo da API
- `App\Models` permanece como camada fina de compatibilidade sobre os modelos em `app/Domain`
- a área `/admin` do frontend já está preparada para expansão sem introduzir um dashboard acoplado cedo demais
