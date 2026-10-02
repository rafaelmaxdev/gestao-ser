# Gestão Radar

Sistema de gestão escolar em desenvolvimento.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Clerk, Prisma 6 e Neon (Postgres).

## Estado atual

- Há cadastros reais de ano, turma e aluno/matrícula, com auditoria e permissões.
- O diário de classe ainda é futuro.
- `/demo` é separado e usa dados fictícios.
- O sistema ainda não está pronto para produção.

## Desenvolvimento

Requer Node.js `>=22.16`.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

`npm ci` executa o `postinstall`, que roda `prisma generate`. Nunca publique o `.env.local`.

No PowerShell, o primeiro comando pode ser substituído por `Copy-Item .env.example .env.local`.

### Variáveis de ambiente

- `DATABASE_URL`: conexão pooled do Neon, usada pelo runtime da aplicação.
- `DATABASE_URL_UNPOOLED`: conexão direta, usada pelo Prisma CLI.
- `DIRECT_URL`: opcional; já está comentada no `.env.example` e, quando definida, substitui a conexão direta do Prisma.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY`: chaves da instância Clerk deste app; a chave secreta nunca deve ser exposta.

Para migrar, escolha explicitamente um banco/branch de desenvolvimento, revise-o e só então execute:

```bash
npx prisma migrate deploy
```

Não execute isso em produção. Não assuma um `neon link`: `.neon` é arquivo local e está ignorado pelo Git; confira as variáveis do ambiente escolhido.

## Acesso

O login exige cadastro na instância Clerk do app e vínculo com `AppUser`/`Membership` definido pela administração. Contas públicas nunca recebem papel. Não há bootstrap automático nem instrução de SQL massivo.

## Verificações

```bash
npm run test:school
npm run lint
npm run build
```

## Ferramentas

O MCP Neon configurado em `opencode.json` usa OAuth e requer autenticação. `skills-lock.json` é versionado; para reinstalar as skills locais, confira a ajuda e depois use:

```bash
npx skills experimental_install --help
npx skills experimental_install
```

Neon é usado aqui para o banco e integrações; a hospedagem do frontend não é definida nem prometida por este projeto.

Use dados fictícios em desenvolvimento e proteja os dados de alunos.
