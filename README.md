# Acervo — Biblioteca Colaborativa

Sistema interno de gerenciamento de acervo bibliográfico com aluguel de livros, autenticação de usuários e painel administrativo.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16, React 19, TailwindCSS 4, shadcn/ui, Base UI, Radix |
| Backend | Express 5, Prisma 6 |
| Banco | PostgreSQL |
| Auth | bcrypt (hash de senhas) |

## Pré-requisitos

- Node.js 20+
- PostgreSQL rodando
- Yarn (para o frontend)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env        # ajuste DATABASE_URL e DOOR
npm install
npx prisma migrate dev      # cria as tabelas
npm start                   # http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
yarn install
yarn dev                    # http://localhost:3000
```

Crie `.env.local` no frontend se precisar mudar a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Funcionalidades

- **Catálogo** — listagem com busca por título/autor, filtro por categoria e disponibilidade
- **Favoritos** — marque livros como favoritos (salvo no navegador)
- **Autenticação** — cadastro e login com email institucional (`@grupoilla.com.br`)
- **Administração** — usuários com role `ADMIN` podem cadastrar, editar e excluir livros via modal no header
- **Tema** — alternância claro/escuro com paleta de cores personalizada

## Paleta de cores

| Cor | Light | Dark |
|-----|-------|------|
| Fundo | Almond-cream (`#eae0d5`) | Preto (`#0a0908`) |
| Texto | Preto puro (`#000`) | Almond-cream |
| Primary | Stone-brown (`#5e503f`) | Khaki-beige (`#c6ac8f`) |
| Secondary | Khaki-beige (`#c6ac8f`) | Stone-brown |

## Estrutura

```
backend/
├── prisma/schema.prisma     # Modelos do banco
├── src/
│   ├── app/
│   │   ├── controller/      # Lógica das rotas
│   │   ├── middleware/       # Autorização (requireAdmin)
│   │   ├── repository/      # Acesso ao banco (Prisma)
│   │   └── routes/          # Definição das rotas
│   ├── connection/           # Singleton do Prisma
│   └── server.js             # Entry point
└── .env                      # Config (não versionado)

frontend/
├── src/
│   ├── app/
│   │   ├── auth/             # Página de login/cadastro
│   │   ├── globals.css       # Tema CSS
│   │   ├── layout.tsx        # Layout raiz
│   │   └── page.tsx          # Página principal (catálogo)
│   ├── components/
│   │   ├── library/          # Componentes do app (header, cards, modal admin, etc.)
│   │   └── ui/               # Componentes base (dialog, button, badge, etc.)
│   └── lib/
│       └── api.ts            # Tipos e funções da API
└── .env.local                # Config local (não versionado)
```

## API — endpoints

### Livros
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/livros/buscarTodos` | — | Lista todos |
| GET | `/livros/buscar/:id` | — | Busca por ID |
| POST | `/livros/cadastrar` | ADMIN | Cria livro |
| PATCH | `/livros/atualizar/:id` | ADMIN | Atualiza livro |
| DELETE | `/livros/deletar/:id` | ADMIN | Remove livro |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuarios/cadastrar` | Cadastro (email `@grupoilla.com.br`) |
| POST | `/usuarios/login` | Login (retorna user com role) |
| GET | `/usuarios/buscarTodos` | Lista usuários |
| PATCH | `/usuarios/atualizarUsuario/:id` | Atualiza dados |
| DELETE | `/usuarios/deletarUsuario/:id` | Remove usuário |

## Admin

Para definir um administrador:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'seu@grupoilla.com.br';
```

Após logar, o dropdown do usuário exibirá **"Gerenciar acervo"** com acesso ao modal de CRUD de livros.
