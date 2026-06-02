CREATE DATABASE IF NOT EXISTS employee_task_tracker;
USE employee_task_tracker;

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  assigned_to INT NOT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Example users (password hash should come from bcrypt in app register API)
-- INSERT INTO users (name, email, password, role)
-- VALUES ('Admin User', 'admin@example.com', '<bcrypt-hash>', 'admin');
