# Iris AI Assistant - Full Stack Health App

A full-stack health application built with React/TypeScript, Tailwind CSS, Flask, and PostgreSQL.

## Project Structure

```
nexora-1/
├── frontend/                 # Vite React TypeScript app
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── package.json
├── backend/                  # Flask Python app
│   ├── app/
│   │   ├── routes/          # Blueprint routes
│   │   ├── models/          # Database models
│   │   ├── utils/           # Helper utilities
│   │   └── __init__.py      # App factory
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── wsgi.py              # Flask entry point
│   └── .env
├── docker-compose.yml        # Service orchestration
├── .env.example              # Environment variables template
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Node Version**: 18+

### Backend
- **Framework**: Flask 3.0
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy
- **Auth**: PyJWT
- **CORS**: Flask-CORS

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Setup

1. **Clone the repository**
```bash
cd /workspaces/nexora-1
```

2. **Create a `.env` file** (copy from `.env.example`)
```bash
cp .env.example .env
```

3. **Build and start containers**
```bash
docker-compose build
docker-compose up
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Database**: localhost:5432

### Health Check

Test the backend is running:
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Iris AI Assistant backend is running"
}
```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` with hot module reloading.

### Backend Development

```bash
cd backend
pip install -r requirements.txt
flask run
```

The backend will be available at `http://localhost:5000`.

### Environment Variables

See `.env.example` for all available configuration options:

```bash
# Database
POSTGRES_USER=iris_user
POSTGRES_PASSWORD=iris_password
POSTGRES_DB=iris_db
DATABASE_URL=postgresql://iris_user:iris_password@postgres:5432/iris_db

# Flask
FLASK_ENV=development
FLASK_APP=wsgi.py

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend
VITE_API_URL=http://localhost:5000
```

## Docker Compose Services

### PostgreSQL (postgres)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Health Check**: Enabled with 10s interval

### Flask Backend (backend)
- **Port**: 5000
- **Depends on**: PostgreSQL
- **Volume**: ./backend:/app (hot reload)
- **Command**: `flask run --host=0.0.0.0`

### Vite Frontend (frontend)
- **Port**: 5173
- **Volume**: ./frontend:/app with separate node_modules volume
- **Command**: `npm run dev`
- **Build Target**: development stage with hot reload

## Common Commands

### Docker Compose
```bash
# Build all services
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

### Database
```bash
# Access database shell
docker-compose exec postgres psql -U iris_user -d iris_db

# Run migrations (when implemented)
docker-compose exec backend flask db upgrade
```

## Project Roadmap

The project is currently initialized with:
- ✅ Project structure set up
- ✅ Docker containerization configured
- ✅ Flask app factory with modular Blueprint structure
- ✅ CORS enabled for frontend-backend communication
- ✅ Vite React app with TypeScript and Tailwind CSS
- ✅ PostgreSQL integration ready
- ⏳ Database models (ready for implementation)
- ⏳ Authentication endpoints (ready for implementation)
- ⏳ Frontend pages and components (ready for implementation)

## Notes

- The frontend uses the development target in the Dockerfile for hot reloading
- The backend runs in debug mode when `FLASK_ENV=development`
- All services communicate through the `iris_network` Docker bridge
- Database data persists in a Docker volume `postgres_data`

## Support

For issues or questions, please refer to the individual service documentation or create an issue in the repository.