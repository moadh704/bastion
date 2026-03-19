# Bastion — User Management Dashboard

![Stack](https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Stack](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![Stack](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Stack](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)
![Stack](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify)

A full-stack admin dashboard built with Vue 3 and Express.js, designed to demonstrate production-level full-stack development with a strong emphasis on security, clean architecture, and modern UI design.

---

## 🎯 What Is Bastion?

Bastion is a complete user management platform where administrators can control user accounts, monitor platform activity, and manage access levels in real time. It was built from scratch as a showcase of full-stack Vue + Express development — covering everything from database design and REST API architecture to JWT authentication, role-based access control, and a polished glassmorphism frontend.

Every decision in this project was made with real-world standards in mind — not just "make it work" but "make it right."

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based login system with 7-day token expiry and automatic session handling — expired tokens redirect the user to login instantly instead of showing broken UI
- Passwords hashed with bcrypt using 10 salt rounds — never stored in plain text
- Role-based access control across three levels: **Superadmin**, **Admin**, and **User** — enforced on both the backend (middleware) and frontend (route guards)
- Self-protection logic — no admin can ban, delete, or demote their own account, preventing accidental or malicious lockouts
- Rate limiting on auth routes — max 10 attempts per 15 minutes to prevent brute force attacks
- Helmet.js for secure HTTP response headers out of the box
- CORS restricted to whitelisted origins only — no open access in production
- All database queries are parameterized — fully protected against SQL injection
- Input validation on every endpoint using express-validator

### 👥 User Management
- Full CRUD on user accounts — create, view, ban, unban, delete
- Role management — superadmin can promote or demote any user instantly
- Admin password reset — superadmin can reset any user's password from the panel
- Personal password change — every user can update their own password from their profile page
- Users cannot be created with duplicate emails — validated on both frontend and backend

### 📊 Dashboard & Monitoring
- Live stats cards — total users, active accounts, banned accounts, admin count, and new signups this week
- Full activity audit log — every admin action (ban, delete, role change, password reset, user creation) is recorded with actor name, action, target, and timestamp
- Recent activity feed on the dashboard showing the latest 8 actions at a glance

### 🔍 Data Tools
- Search users in real time by name or email
- Filter users by role — superadmin, admin, or user
- Export the full user list to a CSV file with one click — includes ID, name, email, role, status, and join date
- Pagination on the users table — handles large datasets cleanly

### 🎨 UI & Experience
- Glassmorphism design — frosted glass cards, layered gradients, and depth through blur effects
- **4 fully switchable color themes** — Purple, Cyber, Matrix, and Crimson — each one changes the mesh background, sidebar accents, gradients, and avatar colors simultaneously. Theme persists across sessions via localStorage
- Custom typography — Syne for headings (bold, geometric) and Outfit for body text (clean, readable)
- Toast notification system — every action gives immediate success or error feedback
- Confirmation dialogs before every destructive action — no accidental deletes or bans
- User avatar initials with deterministic random colors — each user always gets the same color based on their name
- Route guards on the frontend — users are redirected based on their role if they try to access unauthorized pages
- 404 page for unknown routes — no blank crashes

---

## 🏗️ Architecture

The project follows a clean separation of concerns across both frontend and backend:

**Backend** is structured around the MVC pattern:
- `routes/` — define API endpoints and attach middleware
- `controllers/` — handle business logic for each endpoint
- `middleware/` — JWT verification and role checking run before protected routes
- `db/` — single MySQL connection pool shared across the app

**Frontend** is structured around Vue 3's Composition API:
- `views/` — full page components mapped to routes
- `components/` — reusable UI pieces (table, stats cards, navbar, dialogs)
- `stores/` — Pinia stores manage global state (auth, users, UI)
- `api/` — single Axios instance with request and response interceptors

This means adding a new feature always follows the same pattern: add a route → add a controller → add a store action → add a view or component. Clean, predictable, scalable.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend Framework | Vue 3 (Composition API) | Reactive, component-based, modern |
| Build Tool | Vite | Fast dev server, instant HMR |
| UI Library | Vuetify 3 | Rich components, consistent design system |
| State Management | Pinia | Lightweight, intuitive, Vue 3 native |
| Routing | Vue Router 4 | Client-side routing with navigation guards |
| HTTP Client | Axios | Interceptors for auth headers + error handling |
| Backend Framework | Express.js | Minimal, flexible, industry standard |
| Database | MySQL 8 | Relational, reliable, widely used |
| Authentication | JSON Web Tokens | Stateless, scalable auth |
| Password Security | bcryptjs | Industry standard password hashing |
| Input Validation | express-validator | Clean, chainable validation rules |
| Security Headers | Helmet.js | One line, dozens of security headers |
| Rate Limiting | express-rate-limit | Brute force and abuse protection |
| Fonts | Syne + Outfit (Google Fonts) | Distinctive, modern typography pair |

---

## 🔒 Security Summary

This project was built with security as a first-class concern, not an afterthought:

- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT with cryptographically strong 128-character secret
- ✅ Parameterized queries — SQL injection proof
- ✅ Input validation on all routes
- ✅ Helmet.js security headers
- ✅ Rate limiting on authentication endpoints
- ✅ CORS whitelist — production only accepts requests from the deployed frontend
- ✅ Role-based access enforced on both frontend and backend independently
- ✅ Self-protection — admins cannot lock themselves out
- ✅ Token expiry handled gracefully — auto logout and redirect

---

## 📁 Project Structure

```
user-management-dashboard/
├── client/                  # Vue 3 + Vite frontend
│   └── src/
│       ├── api/             # Axios instance with interceptors
│       ├── components/      # Reusable UI components
│       ├── router/          # Routes + navigation guards
│       ├── stores/          # Pinia state (auth, users, ui)
│       └── views/           # Page components
└── server/                  # Express.js backend
    ├── controllers/         # Business logic
    ├── db/                  # MySQL connection
    ├── middleware/           # JWT + role protection
    └── routes/              # API endpoint definitions
```

---

## 🚀 Live Demo

🔗 **[Live Demo](#)** — coming soon

🔗 **[GitHub Repository](https://github.com/moadh704/user-management-dashboard)**

---

## 📌 Project Status

✅ Complete and deployed — built as the first project in a full-stack Vue + Express series, focusing on real-world patterns, clean architecture, and security-first development.