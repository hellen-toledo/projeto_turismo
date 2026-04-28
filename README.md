# Projeto Turismo Norte-Goiano

Portal turístico com backend Laravel API e frontend React/Vite. O repositório cobre a vitrine pública de cidades e eventos e um painel administrativo protegido para manutenção editorial.

## Stack

- Backend: Laravel 12, PHP 8.2+, Sanctum, Eloquent, SQLite local por padrão
- Frontend: React 19, TypeScript, Vite, React Query, Tailwind CSS
- Qualidade: PHPUnit, Vitest, Laravel Pint, ESLint

## API oficial

- base ativa: `/api/v1`
- admin: `/api/v1/admin`

As rotas legadas sem versionamento aparecem apenas como referência comentada em [routes/api.php](/home/hellen/projeto_turismo/routes/api.php:1) e não fazem parte da API ativa.

## Documentação técnica

- [Arquitetura](./docs/architecture.md)
- [API administrativa](./docs/admin-api.md)
- [Frontend](./docs/frontend.md)

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

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
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

## Credenciais de seed

- admin: `admin@example.com` / `password`
- usuário comum: `test@example.com` / `password`
