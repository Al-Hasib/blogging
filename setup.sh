#!/bin/bash
set -e

echo "=== Bengali Tech Blog - Setup Script ==="
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Error: Docker is required. Install from https://docs.docker.com/get-docker/"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo "Error: docker compose plugin is required."; exit 1; }

# Create .env files if not exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
    # Generate a random secret key
    SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))" 2>/dev/null || echo "django-insecure-$(openssl rand -hex 24)")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/change-me-to-a-random-secret-key/$SECRET/" backend/.env
    else
        sed -i "s/change-me-to-a-random-secret-key/$SECRET/" backend/.env
    fi
    echo "  → SECRET_KEY generated"
fi

if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend/.env.local from .env.example..."
    cp frontend/.env.example frontend/.env.local
fi

echo ""
echo "Starting services with Docker Compose..."
echo "  - PostgreSQL (port 5432)"
echo "  - Redis (port 6379)"
echo "  - Django Backend (port 8000)"
echo "  - Celery Worker"
echo "  - Next.js Frontend (port 3000)"
echo ""

docker compose build
docker compose up -d db redis

echo ""
echo "Waiting for PostgreSQL to be ready..."
sleep 5

docker compose run --rm backend python manage.py migrate
docker compose run --rm backend python manage.py createsuperuser --noinput --username admin --email admin@example.com 2>/dev/null || echo "  → Superuser 'admin' already exists (or skipped)"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:8000/api/v1/"
echo "  API Docs: http://localhost:8000/api/v1/docs/"
echo "  Admin:    http://localhost:8000/admin/"
echo ""
echo "  Start all services:  docker compose up"
echo "  Stop all services:   docker compose down"
echo "  View logs:           docker compose logs -f"
echo ""
