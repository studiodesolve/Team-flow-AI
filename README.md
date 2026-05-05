# TeamFlow: Team Task Manager

A premium, full-stack task management application with Role-Based Access Control (RBAC), project tracking, and a modern glassmorphic dashboard.

## 🚀 Features

- **Authentication**: Secure Signup/Login with JWT and password hashing.
- **Project Management**: Create, view, and delete projects (Admins only for creation/deletion).
- **Task Tracking**: Kanban-style board for tasks with status (Todo, In Progress, Completed), priority levels, and due dates.
- **RBAC**: Distinct roles for Admins and Members to ensure proper permissions.
- **Modern UI**: Dark mode aesthetic with glassmorphism, fluid animations, and responsive layout.

### 🛠️ Tech Stack

- **Frontend**: React, Vite, Vanilla CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Mongoose ODM.
- **Database**: MongoDB (Atlas for Production).
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

This app is configured for deployment on **Railway**:
1. Connect your GitHub repo to Railway.
2. The project includes a `railway.json` for automatic configuration.
3. Set the environment variables in Railway dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure string for token signing.
   - `EMAIL_USER` & `EMAIL_PASS`: (Optional) For automated emails.
4. Railway will build the client and start the server automatically.

## 📝 License
MIT
