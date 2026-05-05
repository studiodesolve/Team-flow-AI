# TeamFlow AI: A Better Way to Manage Engineering Work

TeamFlow AI is a project management platform built specifically for engineering teams. It doesn't try to do too much; instead, it focuses on being clear, fast, and easy to use. The goal is simple: helping teams stay organized and get things done without all the clutter that traditional tools usually have.

## Why I Created TeamFlow AI

Most tools for managing tasks are hard to use and have too much going on. They often feel like glorified spreadsheets rather than real products. I wanted to build something that was smooth, fast, and actually looked good.

TeamFlow AI is my solution to the problem of information overload. It only shows what is truly important, helping engineers and managers focus on their work instead of figuring out how to use the tool.

## Who TeamFlow AI Is For

*   **Engineering Teams**: A simple space to manage tasks, sprints, and workflows.
*   **Project Managers**: A way to see how projects are going, how teams are doing, and when things are due.
*   **Portfolio & Learning**: This project is a result of my experience with full-stack development and modern web technologies.

## Main Features of TeamFlow AI

*   **Modern Design**: A dark interface inspired by Apple’s aesthetic, complete with smooth animations.
*   **Role-Based Access Control**: Clear separation between admin and team member permissions for better security.
*   **Live Dashboard**: Real-time information about project progress, pending tasks, and delays.
*   **Smart Project Workspace**: Automated calculations for team size, task progress, and overall status.
*   **Secure Authentication**: A reliable login system built with JWT.
*   **Responsive Design**: Optimized to work well on tablet and desktop screens.

## Technologies Used in TeamFlow AI

### Frontend
*   **React**: Using the latest features for a modern UI.
*   **Vite**: For lightning-fast builds and development.
*   **Tailwind CSS**: For a custom, clean design.
*   **Framer Motion**: For fluid animations and transitions.

### Backend
*   **Node.js & Express**: A robust server environment.
*   **MongoDB & Mongoose**: Flexible and powerful database management.
*   **JWT**: For secure authentication.

## How TeamFlow AI Is Deployed

*   **Railway**: For hosting and automated CI/CD.
*   **MongoDB Atlas**: For a cloud-based database.

---

## Getting Started with TeamFlow AI

### Things You Need
*   Node.js version 20 or higher
*   MongoDB (either locally or in the cloud)

### Setup Steps
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/studiodesolve/Team-flow-AI.git
    ```
2.  **Enter the directory**:
    ```bash
    cd ethara_AI
    ```
3.  **Install dependencies**:
    ```bash
    npm run build
    ```

### Environment Variables
Create a `.env` file in the `server` folder with:
*   `MONGODB_URI`: your_mongodb_connection_string
*   `JWT_SECRET`: your_secret_key
*   `PORT`: 5001

---

## Running TeamFlow AI

**Start the Backend**:
```bash
cd server
npm run dev
```

**Start the Frontend**:
```bash
cd client
npm run dev
```

**Live Link**: [TeamFlow AI Production](https://team-flow-ai-production.up.railway.app/login)

## Project Structure

*   `client/`: The React frontend.
*   `server/`: The Node.js backend.
*   `client/src/components`: UI components.
*   `client/src/pages`: Main application screens.
*   `client/src/services`: API integration logic.
*   `server/src/controllers`: Backend business logic.
*   `server/src/models`: Database schemas.
*   `server/src/middleware`: Authentication and security checks.

---

## Future Plans for TeamFlow AI
*   Real-time collaboration using WebSockets.
*   Drag-and-drop Kanban boards.
*   AI-powered task suggestions and breakdown.

## About the Author
TeamFlow AI was built by **Prince Yadav** as part of an effort to create scalable, real-world full-stack applications.
