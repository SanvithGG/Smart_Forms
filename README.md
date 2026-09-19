# Smart Forms

Smart Forms is an interactive, branching-logic form builder and respondent questionnaire application.

## Repository Architecture

The project is cleanly divided into a **frontend** and **backend**:

```
Smart_Forms/
├── frontend/             # React JS + Tailwind CSS + Vite
│   ├── src/              # React components, pages, hooks, styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── backend/              # Spring Boot (Java 17 / Maven)
    ├── src/              # Controllers, services, entities, repositories
    ├── pom.xml
    └── mvnw, mvnw.cmd
```

---

## Tech Stack

### Frontend
- **Framework**: React 19 (`.jsx` / JavaScript)
- **Styling**: Tailwind CSS v4 + Radix UI
- **Build Tool**: Vite 8
- **Routing**: React Router v7
- **API Client**: Axios (configured to connect to the backend at port 8088)

### Backend
- **Framework**: Spring Boot 3.3.2
- **Language**: Java 17
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: H2 (local file-based default) / PostgreSQL (production)
- **Security**: Spring Security + Stateless JWT authentication
- **Migration**: Flyway

---

## Quick Start

### 1. Run the Backend (Spring Boot)
```bash
cd backend
./mvnw.cmd spring-boot:run
```
The backend starts on `http://localhost:8088`.

### 2. Run the Frontend (React JS + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`.
