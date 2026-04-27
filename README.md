# Projeto Turismo Norte-Goiano

Bem-vindo(a) ao repositório do **Turismo Norte-Goiano**, um portal focado em dar visibilidade aos destinos e eventos turísticos da região norte de Goiás.

A aplicação é dividida em um **backend robusto (Laravel)** e um **frontend moderno e separado (React/Vite)**. O sistema atende tanto a exibição pública do catálogo de turismo quanto a gestão administrativa de seus conteúdos.

## Visão Geral e Requisitos Funcionais

O sistema é responsável por:
- Exibir cidades com fotos de capa, descrições ricas, identificação de região e tags temáticas de interesse (como Ecoturismo, Pesca Esportiva, etc).
- Listar eventos agendados, mostrando datas, relacionamento com cidades específicas e links para informações externas.
- Centralizar o filtro e a pesquisa em um catálogo amigável e responsivo.
- Prover um painel administrativo protegido por autenticação para gerenciamento de Cidades e Eventos.

## Arquitetura de Pastas

```text
/
├── app/               # Lógica do Backend Laravel (Controllers, Models em Domain, Policies)
├── bootstrap/         # Inicialização do framework Laravel
├── config/            # Configurações do Laravel
├── database/          # Migrations, Factories e Seeders
├── docs/              # Documentação adicional (arquitetura, diagramas, endpoints admin)
├── frontend/          # SPA React/TypeScript gerada com Vite
│   └── src/           # Código-fonte da interface web, separado por features
├── routes/            # Definição das rotas de API e Web do Laravel
└── tests/             # Testes do Backend (PHPUnit)
```

## Stack Real e Ferramentas

- **Backend:** Laravel 12, PHP 8.2+, SQLite (padrão local), Sanctum (Autenticação SPA)
- **Frontend:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 3, React Router 7, Axios, React Query 5
- **Qualidade e Testes:** PHPUnit para backend, Vitest + Testing Library para frontend, Laravel Pint e ESLint para formatação/linting.

## Endpoints e Rotas da API

Decidimos padronizar a interface da aplicação sobre a URL **`/api/v1`**, estabelecendo-a como a API oficial para consumo e possível integração futura por terceiros.

**Públicos (`/api/v1`):**
- `GET /api/v1/regions` (Retorna regiões e contagem de cidades)
- `GET /api/v1/cities` (Com suporte a paginação e filtros `search`, `region`, `tag`, `published`)
- `GET /api/v1/cities/{idOrSlug}` (Detalhes de cidade)
- `GET /api/v1/events` (Com suporte a filtros `search`, `city`, `tag`, `featured`, `future`, `published`)
- `GET /api/v1/events/{idOrSlug}` (Detalhes de evento)
- `GET /api/v1/interest-tags` (Retorna tags de interesse)

**Administrativos (`/api/v1/admin`):**
- `POST /api/v1/admin/auth/login` (Requer rate limit, devolve token Bearer)
- `POST /api/v1/admin/auth/logout`
- `GET /api/v1/admin/auth/me`
- CRUD protegido por token: `cities`, `events`, `regions`, `interest-tags`.

**⚠️ Endpoints Deprecated (Legados):**
As antigas rotas sem versionamento e com nomes traduzidos (`/api/cities`, `/api/events`, `/api/cidades`, `/api/eventos`) ainda estão respondendo por uma camada de compatibilidade temporária, mas não devem ser usadas no desenvolvimento de novas features e serão desativadas em atualizações futuras.

## Fluxo Administrativo

O painel está em `http://localhost:5173/admin`.
Um usuário não logado é redirecionado a `/admin/login`. Após fornecer as credenciais válidas e possuir privilégios de `isAdmin = true`, ele recebe um token do Sanctum armazenado de forma segura, permitindo o gerenciamento de Cidades e Eventos.

---

## Como Instalar e Rodar o Projeto

Siga os passos abaixo, seja executando localmente com o PHP embutido, ou de forma containerizada com Laravel Sail.

### 1. Preparação (Variáveis de Ambiente)
Duplique os arquivos `.env.example`:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

**Variáveis relevantes no backend (`.env`):**
- `DB_CONNECTION=sqlite` (O banco padrão está em `database/database.sqlite`).
- `APP_URL=http://localhost:8000`

**Variáveis relevantes no frontend (`frontend/.env`):**
- `VITE_API_URL=http://localhost:8000/api/v1`

### 2. Rodando via Composer e NPM localmente (Sem Docker)

Requer PHP 8.2+ (com extensões mbstring, sqlite3, xml, etc), Composer e Node.js 20+.

**Backend:**
```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
> API respondendo em http://localhost:8000

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
> Interface respondendo em http://localhost:5173

### 3. Rodando com Docker (Laravel Sail)

Para quem prefere trabalhar com contêineres e não quer instalar as dependências de PHP locais na máquina:

```bash
composer install # Necessita pelo menos de um ambiente para rodar essa instalação inicial, ou usar contêiner isolado do composer
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail npm --prefix frontend install
./vendor/bin/sail npm --prefix frontend run dev -- --host
```

### 4. Atalhos Úteis

Para facilitar, incluímos no arquivo `package.json` raiz atalhos que operam os dois projetos simultaneamente:

- **Instalar tudo:** `composer run setup` (Irá copiar envs, gerar chaves, rodar migrate e npm install no frontend).
- **Rodar tudo junto:** `npm run dev` ou `composer run dev` (Inicia o `php artisan serve` e o `vite` no mesmo terminal usando o pacote concurrently).

## Comandos de Qualidade de Código e Testes

Ambos os repositórios possuem scripts diretos para validação, essenciais para rodar antes de efetuar commits e abrir Pull Requests (PRs).

No terminal, na **raiz do repositório**, você pode executar:

- `npm run test` (Executa os testes PHPUnit do backend e os do Vitest no frontend sequencialmente).
- `npm run lint` (Executa o Laravel Pint no backend e o ESLint no frontend).
- `npm run build` (Inicia o empacotamento para produção do frontend gerando as build-assets através do `vite build`).

Se quiser rodar separadamente, basta acessar o respectivo diretório e rodar o script local correspondente (ex: `php artisan test` no backend, `npm run test` dentro da pasta frontend).

### Validação Contínua (CI)

O repositório já conta com um fluxo automatizado de integração contínua (via **GitHub Actions**) descrito no arquivo `.github/workflows/ci.yml`.

Toda vez que você abrir um Pull Request (PR) ou fizer push para a branch `main`, os seguintes fluxos rodarão automaticamente e em paralelo na nuvem:
1. **Backend:** Instalação das dependências do composer, estruturação de banco SQLite na memória virtual, verificação de padrão de código (`vendor/bin/pint --test`) e execução rigorosa de asserções via (`php artisan test --parallel`).
2. **Frontend:** Instalação via NPM, execução do lint (`npm run lint`), checagem do build type-safe (`npm run build`) e, por fim, testes (`npm run test`).

Recomendamos que você rode a sequência `npm run lint && npm run test && npm run build` localmente antes de commitar para economizar tempo no CI.
