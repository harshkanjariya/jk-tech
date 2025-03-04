# Project Setup

## Prerequisites
Before running this project, ensure you have **Docker** installed on your system.

## Starting the Project
To start the project, run the following command:
```sh
docker-compose up -d
```
This will start all the services defined in the `docker-compose.yml` file in detached mode.

## Docker Compose Configuration
The project uses **Docker Compose version 3.8** with the following services:

### 1. Database (PostgreSQL)
- **Image**: `postgres:latest`
- **Container Name**: `blog-db`
- **Ports**: `5432:5432` (PostgreSQL default port)
- **Environment Variables**:
    - `POSTGRES_USER=admin`
    - `POSTGRES_PASSWORD=admin`
    - `POSTGRES_DB=blog`
- **Volumes**:
    - `postgres_data:/var/lib/postgresql/data` (Persistent storage for database)
    - `./init.sql:/docker-entrypoint-initdb.d/init.sql` (Initialization script)

### 2. Backend
- **Build Path**: `./backend`
- **Ports**: `3000:3000` (Backend accessible on port 3000)
- **Depends on**: `db` (Ensures database starts before backend)
- **Environment Variables**:
    - `DATABASE_URL=postgres://admin:admin@db:5432/blog`

### 3. Frontend
- **Build Path**: `./frontend`
- **Ports**: `4200:80` (Frontend accessible on port 4200)
- **Depends on**: `backend` (Ensures backend starts before frontend)

### 4. TinyMCE Service
- **Build Path**: `./tinymce`
- **Container Name**: `tinymce`
- **Ports**: `8081:80` (Accessible on port 8081)

## Ports Overview
Before running the project, ensure the following ports are available:
- **5432** (Database)
- **3000** (Backend API)
- **4200** (Frontend UI)
- **8081** (TinyMCE editor)

## About This Setup
This project consists of three main services:
1. **PostgreSQL Database**: Stores blog-related data such as users, posts, and comments.
2. **Backend (Node.js/NestJS or Express)**: Handles business logic and API requests.
3. **Frontend (Angular, React, or Vue)**: Provides the user interface for interacting with the blog.
4. **TinyMCE Service**: A rich-text editor service to enable content editing capabilities.

Using Docker Compose simplifies the setup process by ensuring all required services start together with predefined configurations.

---
After running `docker-compose up -d`, access the services using the assigned ports.

