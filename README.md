# Employee Task Tracker (Node.js + MySQL + React)

A full-stack application where admins can manage employees and tasks, and employees can update their assigned task status.

## Tech Stack

- Backend: Node.js, Express, MySQL, JWT, bcryptjs
- Frontend: React (Vite), React Router
- Database: MySQL

## Project Structure

```
add_admin/
  backend/
    server.js
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
  frontend/
    src/
      components/
      context/
      pages/
  database/
    schema.sql
  docs/
    employee-task-tracker.postman_collection.json
```

## Features Implemented

### Backend

- JWT authentication
- Password hashing with bcryptjs
- Role-based middleware (`admin`, `employee`)
- Clean architecture (`routes`, `controllers`, `services`, `models`)
- Error handling middleware
- SQL `JOIN` used in task queries to return employee details with tasks

### APIs

Auth:
- `POST /auth/register`
- `POST /auth/login`

Users:
- `GET /users` (admin only)
- `GET /users/:id/tasks`

Tasks:
- `POST /tasks` (admin only)
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`

### Frontend

- Login page with role-based redirect
- Admin dashboard:
  - employee list
  - create task form
  - tasks table with edit option
- Employee dashboard:
  - own tasks only
  - status update flow: pending -> in_progress -> completed

## Setup Instructions

## 1. Clone and install

```bash
cd add_admin

cd backend
npm install

cd ../frontend
npm install
```

## 2. Configure environment

Backend:

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` values as needed:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `CLIENT_URL`

Frontend:

```bash
cd frontend
cp .env.example .env
```

## 3. Setup database

Run the schema file in MySQL:

```sql
SOURCE /absolute/path/to/add_admin/database/schema.sql;
```

Or import it from MySQL Workbench/phpMyAdmin.

## 4. Run the app

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open frontend at `http://localhost:5173`.

## API Documentation / Postman

Import the collection:

- `docs/employee-task-tracker.postman_collection.json`

## Notes

- To create the first admin account, use `POST /auth/register` with `role: "admin"`.
- Employees should be registered with `role: "employee"`.
- `GET /tasks` returns all tasks for admin and only assigned tasks for employee.

<!-- ## Optional Screenshots

Add screenshots in a folder such as `docs/screenshots/`. -->

docker exec -it ett-mysql mysql -uroot -proot123 employee_task_tracker

SHOW TABLES;
SELECT * FROM users;
SELECT * FROM tasks;
DESCRIBE users;
DESCRIBE tasks;