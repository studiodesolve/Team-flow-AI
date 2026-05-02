# TeamFlow: Team Task Manager

A premium, full-stack task management application with Role-Based Access Control (RBAC), project tracking, and a modern glassmorphic dashboard.

## 🚀 Features

- **Authentication**: Secure Signup/Login with JWT and password hashing.
- **Project Management**: Create, view, and delete projects (Admins only for creation/deletion).
- **Task Tracking**: Kanban-style board for tasks with status (Todo, In Progress, Completed), priority levels, and due dates.
- **RBAC**: Distinct roles for Admins and Members to ensure proper permissions.
- **Modern UI**: Dark mode aesthetic with glassmorphism, fluid animations, and responsive layout.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Vanilla CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: SQLite (Local Dev) / PostgreSQL (Production).
- **Security**: JWT, BcryptJS.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ethara_AI
```

### 2. Backend Setup
```bash
cd server
npm install
npx prisma migrate dev --name init
npm start
```
*The server will run on [http://localhost:5001](http://localhost:5001)*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*The app will be live at [http://localhost:5173](http://localhost:5173)*

## 🌐 Deployment

This app is ready to be deployed on **Railway**:
1. Connect your GitHub repo to Railway.
2. Add a PostgreSQL database service.
3. Set the environment variables (`DATABASE_URL`, `JWT_SECRET`).
4. Railway will automatically detect the `server` and `client` folders if configured as a monorepo or two separate services.

## 📝 License
MIT
