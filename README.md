# AdminOS — User Management Dashboard

A full-stack admin panel built with Vue 3 and Express.js, featuring role-based access control, user management, and a glassmorphism UI design.

---

## Features

- JWT Authentication — secure login and registration
- Role-Based Access Control — superadmin, admin, and user roles
- User Management — ban, unban, delete accounts, and change roles
- Activity Logs — full audit trail of every admin action
- Dashboard Stats — total users, active, banned, admins, new this week
- Security — Helmet.js headers, rate limiting, bcrypt password hashing, parameterized queries
- Glassmorphism UI — dark theme with frosted glass cards and purple/blue gradients

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MySQL | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet.js | Secure HTTP headers |
| express-rate-limit | Brute force protection |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| Vue 3 | Frontend framework |
| Vite | Build tool |
| Vuetify 3 | UI component library |
| Pinia | Global state management |
| Vue Router | Client-side routing |
| Axios | HTTP client |
| Google Fonts (Syne + Outfit) | Typography |

---

## Project Structure

```
user-management-dashboard/
├── client/                   # Vue 3 frontend
│   └── src/
│       ├── api/              # Axios instance + interceptors
│       ├── components/       # Reusable UI components
│       ├── router/           # Vue Router + route guards
│       ├── stores/           # Pinia state stores
│       └── views/            # Page components
└── server/                   # Express backend
    ├── controllers/          # Route logic
    ├── db/                   # MySQL connection
    ├── middleware/           # Auth + role middleware
    └── routes/               # API route definitions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone the repo
```bash
git clone https://github.com/moadh704/user-management-dashboard.git
cd user-management-dashboard
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=usermanagement
JWT_SECRET=your_jwt_secret
```

### 3. Setup the database
Run this in your MySQL shell:
```sql
CREATE DATABASE usermanagement;
USE usermanagement;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
  status ENUM('active', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  target_user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role)
VALUES (
  'Super Admin',
  'superadmin@admin.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'superadmin'
);
```

Default superadmin password: `password`

### 4. Setup the frontend
```bash
cd ../client
npm install
```

### 5. Run the project

Start the backend (inside `/server`):
```bash
npm run dev
```

Start the frontend (inside `/client`):
```bash
npm run dev
```

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |

### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/users | Admin+ |
| GET | /api/users/stats | Admin+ |
| GET | /api/users/logs | Superadmin |
| PUT | /api/users/:id/ban | Admin+ |
| PUT | /api/users/:id/unban | Admin+ |
| PUT | /api/users/:id/role | Superadmin |
| DELETE | /api/users/:id | Superadmin |

---

## Security Practices

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiry
- Parameterized SQL queries to prevent injection
- Helmet.js for secure response headers
- Rate limiting — 10 requests per 15 min on auth routes
- Role-based middleware on every protected route
- Frontend route guards matching backend permissions

---

## Roadmap

- [ ] Input validation with express-validator
- [ ] Create user form in frontend
- [ ] Role change UI in users table
- [ ] Deploy — Railway (backend) + Vercel (frontend)
- [ ] Refresh token system
- [ ] Profile page per user
