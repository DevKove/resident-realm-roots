# SindCoop

Plataforma SaaS de gestão condominial simplificada para pequenos e médios condomínios.

## Stack

- React 19 + TypeScript
- TanStack Start / Router
- Tailwind CSS 4
- Supabase Auth + PostgreSQL + RLS + Realtime + Storage
- Vitest

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validação

```bash
npm run lint
npm test
npm run build
```

## Variáveis de ambiente

Nunca versione credenciais reais. Copie `.env.example` para `.env` e preencha os valores públicos do projeto Supabase.

## Segurança

O banco utiliza Row Level Security (RLS) para separar dados por condomínio. Alterações de schema devem ser feitas por migrations versionadas e revisadas antes do deploy.
