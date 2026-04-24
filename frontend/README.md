# Frontend

SPA React + TypeScript + Vite do `projeto_turismo`.

## Responsabilidades

- interface e componentes
- roteamento client-side
- consumo da API Laravel
- cache de dados com React Query
- fluxo administrativo em `/admin`

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Servidor padrão: `http://localhost:5173`

## Variáveis

- `VITE_API_URL`: URL base da API

Exemplo:

```env
VITE_API_URL=http://localhost:8000/api
```

## Qualidade

```bash
npm run lint
npm run test
npm run test:watch
npm run build
```

## Limites desta camada

O frontend não deve concentrar regras centrais de domínio, persistência, acesso direto ao banco ou autenticação de servidor.
