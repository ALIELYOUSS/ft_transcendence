#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        printf 'Error: required command not found: %s\n' "$1" >&2
        exit 1
    fi
}

require_command node
require_command npm

node_version="$(node --version)"
npm_version="$(npm --version)"
printf 'Using Node.js %s and npm %s\n' "$node_version" "$npm_version"

install_project() {
    local project_dir="$1"
    local project_name="$2"

    printf '\nInstalling %s dependencies...\n' "$project_name"
    if [[ -f "$ROOT_DIR/$project_dir/package-lock.json" ]]; then
        npm --prefix "$ROOT_DIR/$project_dir" ci
    else
        npm --prefix "$ROOT_DIR/$project_dir" install
    fi
}

install_project backend backend
install_project frontend frontend

printf '\nGenerating Prisma Client...\n'
npm --prefix "$ROOT_DIR/backend" run prisma:generate

printf '\nValidating Prisma schema...\n'
npm --prefix "$ROOT_DIR/backend" run prisma:validate

if [[ ! -f "$ROOT_DIR/backend/.env" ]]; then
    printf '\nNo backend/.env file was found.\n'
    printf 'Create it from backend/.env.example, then add your local secrets before starting the API.\n'
else
    printf '\nbackend/.env already exists; leaving it unchanged.\n'
fi

printf '\nInstallation complete.\n'
printf 'Start PostgreSQL with: docker compose up -d db adminer\n'
printf 'Start the backend with: npm --prefix backend run start:dev\n'
printf 'Start the frontend with: npm --prefix frontend run dev\n'
