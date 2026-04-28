# Frontend - Turismo Norte-Goiano

Esta pasta concentra o código-fonte da Single Page Application (SPA) responsável por renderizar a interface web pública e o painel administrativo do projeto Turismo Norte-Goiano.

## Tecnologias e Stack

A aplicação é construída com uma base sólida para performance e componentização baseada em:
- **React 19**
- **TypeScript 5.9**
- **Vite 7** (Ferramenta de build rápida e empacotamento)
- **Tailwind CSS 3** (Estilização utilitária e responsiva focada em componentização rápida e dark mode nativo para a aplicação)
- **React Router 7** (Navegação client-side)
- **React Query 5** e **Axios** (Gerenciamento do ciclo de vida das requisições assíncronas para o backend, estratégias de cache e revalidação)
- **Lucide React** (Ícones SVG)

## Limites Arquiteturais (O que fica aqui e o que não fica)

**Responsabilidades desta camada:**
- Gerenciamento da Interface do Usuário (UI), interatividade e estados visuais (Loadings, Errors).
- Roteamento nas páginas do lado do cliente (AppShell, Layouts e Nested Routes).
- Autenticação local (Guarda e validação sintática do Token Bearer).
- Consumo fiel e documentado da API v1 Oficial.

**O que NÃO entra aqui:**
- Regras de negócio essenciais, lógicas de segurança (que ultrapassem a interface e proteção de rotas client-side) ou integração direta com o banco de dados. Toda validação severa é terceirizada ao backend e os erros (Unprocessable Entity) são mapeados em tela.

## Estrutura de Pastas

A aplicação segue uma abordagem mista de agrupamento por tipo global e organização isolada por "Features" (Domain-Driven Design no front):

```text
src/
├── app/               # Configuração raiz (App.tsx), Rotas (routes.tsx) e Provedores globais
├── assets/            # Arquivos estáticos puros (imagens estáticas, ícones)
├── features/          # Encapsula lógicas por contexto do negócio.
│   ├── admin/         #   ↳ Telas, forms e hooks exclusivos do painel administrativo
│   ├── cities/        #   ↳ Exibição de cards, listagem e rotas internas das cidades
│   ├── events/        #   ↳ Manipulação, filtragem e renderização visual dos eventos
│   └── home/          #   ↳ Componentes isolados da Landing Page (ex: HeroSection)
├── pages/             # Agrupador das rotas públicas principais (HomePage, EventsPage, ContactPage, etc)
├── shared/            # Módulos transversais que operam para toda a aplicação.
│   ├── components/    #   ↳ UI global: Header, Footer, EmptyState, componentes base de formulário
│   ├── lib/           #   ↳ Configuração do Axios (apiClient.ts), mapeamento de paginas, localstorage
│   └── types/         #   ↳ Interfaces globais (Event, City, PaginatedResponse, etc)
└── test/              # Configurações do Vitest e fixtures globais de utilitários de renderização mockada
```

## Instalação e Execução

### Variáveis de Ambiente

Crie ou valide seu arquivo de configuração baseado no exemplo:
```bash
cp .env.example .env
```
O arquivo precisa apontar para a porta onde o serviço Laravel estará de pé. Exemplo:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Rodando o Servidor de Desenvolvimento

```bash
npm install
npm run dev
```

A interface web levantará localmente em `http://127.0.0.1:4173`.

## Scripts Disponíveis

Dentro deste diretório, o arquivo `package.json` provê as seguintes abstrações:
- **`npm run dev`**: Levanta o servidor Vite em `127.0.0.1:4173`.
- **`npm run build`**: Faz a checagem de tipos e transpilação em `tsc` seguida do build real empacotado para produção (`vite build`).
- **`npm run preview`**: Sobe localmente os arquivos gerados pela pasta `/dist` em `127.0.0.1:4173`.
- **`npm run lint`**: Roda as configurações rígidas do ESLint.
- **`npm run test`**: Invoca a suíte de testes implementada com Vitest uma única vez.
- **`npm run test:watch`**: Aciona os testes do Vitest em modo watch contínuo.
