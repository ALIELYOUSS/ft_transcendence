# User Management Backend Infrastructure

This directory contains the initial repository and Prisma setup for the user
management service.

There is intentionally no application code yet: no NestJS modules, controllers,
services, or authentication flow have been created. The Prisma schema currently
contains only a starter `User` model so the migration workflow can be tested.

## Included

- Prisma CLI and Prisma Client dependencies
- PostgreSQL Prisma schema with a starter `User` model
- Environment template for the database connection
- PostgreSQL 17 Docker setup in the repository root
- Prisma commands for future schema work

## Requirements

```bash
node --version
npm --version
docker --version
docker compose version
```

Node.js, npm, Docker, and Docker Compose must be installed before continuing.

## Start PostgreSQL 17

From the repository root:

```bash
cd /home/alel-you/Desktop/ft_transcendence
docker compose up -d db
```

This starts `postgres:17-alpine` with:

- database: `trans_db`
- user: `ali`
- password: `555`
- host port: `5433`
- container port: `5432`

Host port `5433` is used because another local PostgreSQL container already uses
host port `5432`.

Check the container:

```bash
docker compose ps
```

Stop the database when finished:

```bash
docker compose down
```

The local database files remain in `data/db`.

## Set up Prisma

Enter the backend directory:

```bash
cd /home/alel-you/Desktop/ft_transcendence/backend/user-management
```

Create the local environment file:

```bash
cp .env.example .env
```

The `.env` file contains `DATABASE_URL` and is ignored by Git.

Install Prisma dependencies:

```bash
npm install
```

Validate the Prisma setup:

```bash
npm run prisma:validate
```

Format the Prisma schema:

```bash
npm run prisma:format
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Check migration status:

```bash
npm run prisma:status
```

Create and apply the starter migration:

```bash
npm run prisma:migrate -- --name add_user_model
```

The `--name add_user_model` part names the migration. Use a new descriptive
name for each schema change, for example `add_email_to_user`.

`prisma migrate dev` creates a temporary shadow database to detect schema
differences. The local database role must be allowed to create databases. If
you receive Prisma error `P3014`, run this once from the repository root:

```bash
docker compose exec db psql -U auth_user -d postgres -c "ALTER ROLE ali CREATEDB;"
```

Then rerun the migration command.

Apply existing migrations in deployment or CI:

```bash
npm run prisma:deploy
```

Open Prisma Studio to inspect the database:

```bash
npm run prisma:studio
```

## Why Prisma migrations exist

The `prisma/migrations` directory stores the database history as versioned SQL
files. It lets every developer, CI job, and deployment create the same
PostgreSQL structure in the same order. Migration files should be committed to
Git. This is not a second database or a separate repository.

## Add models and update PostgreSQL

Edit `prisma/schema.prisma` and add or change a model. For example, the current
starter model is:

```prisma
model User {
  id   Int    @id @unique @default(autoincrement())
  name String
}
```

Then validate and format the schema:

```bash
npm run prisma:validate
npm run prisma:format
```

Generate the client for application code:

```bash
npm run prisma:generate
```

Create a named migration and apply it to PostgreSQL:

```bash
npm run prisma:migrate -- --name add_email_to_user
```

For quick local prototyping without creating migration files, push the schema
directly to PostgreSQL:

```bash
npx prisma db push
npm run prisma:generate
```

`db push` is for disposable or early local databases. Use named migrations for
changes that must be shared or deployed:

```bash
npm run prisma:migrate -- --name describe_change
git add prisma/schema.prisma prisma/migrations package.json package-lock.json
git commit -m "Add database change"
```

Apply committed migrations on another database or in deployment:

```bash
npm run prisma:deploy
```

View the generated SQL migration:

```bash
cat prisma/migrations/*/migration.sql
```

## Files

```text
backend/user-management/
  prisma/schema.prisma  Prisma generator and PostgreSQL datasource
  .env.example          Shareable database configuration template
  package.json          Prisma dependencies and commands
  package-lock.json      Locked dependency versions
  README.md             Setup instructions
```

## Next step

When you are ready to start coding, add your Prisma models to
`prisma/schema.prisma`, generate the client, and create the first migration.
Application framework files and authentication behavior should be added in a
separate step.
