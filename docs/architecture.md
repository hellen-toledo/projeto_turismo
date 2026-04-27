# Arquitetura

## Visão geral

Este repositório adota o padrão `backend Laravel API + frontend React/Vite separado`.

- O backend Laravel é a fonte de verdade para domínio, banco de dados e endpoints HTTP.
- O frontend em `frontend/` é uma SPA independente, consumindo a API por HTTP.
- Não há renderização server-side de páginas do produto via Blade como parte do fluxo principal.

## Responsabilidades por camada

### Backend Laravel

Responsável por:

- entrada HTTP em controllers, requests e resources
- casos de uso simples em `app/Application`
- modelos de domínio em `app/Domain`
- persistência com Eloquent e migrations
- autenticação e autorização
- validação de entrada
- serialização de respostas JSON
- contratos HTTP da API

Não deve ser responsável por:

- layout da aplicação web
- roteamento de UI da SPA
- cache de interface no navegador

### Frontend React/Vite

Responsável por:

- componentes e interface do usuário
- roteamento client-side
- chamadas HTTP para a API
- estado de tela e cache client-side
- experiência de navegação da SPA

Não deve ser responsável por:

- regras centrais de domínio
- acesso direto ao banco
- serialização de contratos da API
- autenticação de servidor

## Fluxo de dados

1. O usuário interage com a SPA em `frontend/`.
2. O frontend consulta a API Laravel em `/api/*`.
3. O controller recebe a requisição e delega a validação para um `FormRequest`.
4. Uma `Action` em `app/Application` executa o caso de uso.
5. O modelo de domínio em `app/Domain` persiste ou consulta os dados.
6. Um `Resource` serializa a resposta JSON.
7. O frontend atualiza UI e cache client-side com os dados recebidos.

## Convenções de nomes

- Classes PHP: `StudlyCase`
- Controllers de API: `App\\Http\\Controllers\\Api\\*Controller`
- Requests de validação: `App\\Http\\Requests\\*Request`
- Resources JSON: `App\\Http\\Resources\\*Resource`
- Actions de aplicação: `App\\Application\\<Contexto>\\<Verbo><Entidade>Action`
- Modelos de domínio: `App\\Domain\\<Contexto>\\<Entidade>`
- Wrappers legados de compatibilidade permanecem em `App\\Models` quando necessário
- Endpoints canônicos: substantivos plurais em inglês sob `/api/v1`, como `/api/v1/cities` e `/api/v1/events`
- Aliases legados em português podem existir temporariamente para compatibilidade
- Componentes React: `PascalCase`
- Hooks React: prefixo `use`, como `useCities`, `useEvents` e `useAdminAuth`
- Serviços HTTP do frontend: centralizados por feature em `frontend/src/features/*/api` e em `frontend/src/shared/lib/api`

## Como rodar localmente

### Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API local padrão: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local padrão: `http://localhost:5173`

Se necessário, configure:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

### Execução combinada

Pelo root do projeto:

```bash
composer setup
composer dev
```

Ou:

```bash
npm install
npm run dev
```

## Organização do projeto

- `routes/api.php`: endpoints da API
- `routes/web.php`: apenas metadados básicos do backend e rotas web mínimas
- `app/Http/Controllers/Api`: controllers HTTP da API
- `app/Http/Requests`: validação e normalização de entrada
- `app/Http/Resources`: serialização JSON
- `app/Application`: actions e casos de uso
- `app/Domain`: modelos e regras do domínio
- `frontend/src`: código da SPA

## Padrão CRUD adotado

Para `cities` e `events`, o backend segue o mesmo fluxo:

- `index`: controller chama `List*Action` e retorna `Resource::collection(...)`
- `show`: controller chama `Show*Action` e retorna `Resource`
- `store`: `FormRequest` valida, `Create*Action` persiste, `Resource` responde com `201`
- `update`: `FormRequest` valida, `Update*Action` altera o registro, `Resource` responde com `200`
- `destroy`: controller chama `Delete*Action` e responde `204`

## Notas de compatibilidade

- O frontend não foi movido para dentro do Laravel.
- O backend continua compatível com a estrutura Laravel existente.
- Foram removidos os artefatos operacionais do frontend padrão do Laravel para evitar duplicidade arquitetural.
- Os aliases legados fora de `/api/v1` devem existir apenas temporariamente e marcados como deprecated.
