# BaytBD Group Digital Platform

> **One Group. Three Businesses. One Digital Ecosystem.**  
> Unified corporate portal, multi-vertical business showcase (Agro, Development, IT), e-commerce platform, and centralized governance console built on the **PERN stack (PostgreSQL, Express.js, React, Node.js)**.

---

## 🎨 4–5 Color Theme Token System

The platform dynamically transitions color tokens based on the active business vertical while maintaining corporate coherence:

| Business Vertical | Theme Token | Primary Accent | Background Tint | Visual Identity |
| :--- | :--- | :--- | :--- | :--- |
| **BaytBD Corporate** | `corporate` | Deep Navy `#1e3a8a` | Slate `#f8fafc` | Trust, authority, institutional leadership |
| **Bayt Agro** | `agro` | Emerald Green `#16a34a` | Mint `#f0fdf4` | Organic farming, BSTI certification, purity |
| **Bayt Development** | `development` | Architectural Gold `#d97706` | Champagne `#fffbeb` | High-rise skyline, luxury living, LEED |
| **Bayt IT** | `it` | Electric Cyan `#0284c7` | Ice `#f0f9ff` | Cloud, sub-100ms latency, high-tech |

Themes can be easily customized or extended in [`frontend/src/index.css`](file:///home/sakil/Desktop/baytbd/frontend/src/index.css) via CSS variables:
* `--theme-primary`
* `--theme-primary-hover`
* `--theme-surface`
* `--theme-border`
* `--theme-text`

---

## 🔔 Toast Notifications (Sonner)

Rich stacked toast notifications are integrated across all user interactions:
- **Agro E-Commerce**: Item added to cart, item removed, quantity adjusted, order placement confirmation with order number.
- **Real Estate**: Property private visit & floor plan inquiry submission.
- **IT Services**: Technical consultation & project discovery requests.
- **Careers**: Instant feedback upon submitting job applications with resume links.
- **Contact**: General inquiries routed to target business verticals.
- **Admin Panel**: Order status changes (`PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED`).

---

## 🚀 Quick Start Guide

### 1. Database (PostgreSQL)
The PostgreSQL cluster runs with user-space socket at `.pgsocket` (or standard port 5432/5433):
```bash
# Start PostgreSQL server (if not already running)
/usr/lib/postgresql/16/bin/postgres -D /home/sakil/Desktop/baytbd/.pgdata -k /home/sakil/Desktop/baytbd/.pgsocket -p 5433
```

### 2. Backend API (`Express + Prisma`)
```bash
cd backend
npm install
npx prisma db push      # Sync database schema
npm run prisma:seed    # Seed sample products, projects, team, and admin user
npm run dev            # Starts backend on http://localhost:5000
```

### 3. Frontend Application (`React + Vite + Tailwind`)
```bash
cd frontend
npm install
npm run dev            # Starts Vite dev server on http://localhost:5173
# OR
npm run build          # Builds production bundle to dist/
```

*Note: The backend Express server also serves the production frontend build directly from `frontend/dist`, allowing you to run the complete unified full-stack application on a single port (`http://localhost:5000`).*

---

## 🔐 Pre-Seeded Super Admin Credentials

Navigate to `/admin/login` on the website to access the centralized governance console:

- **Email**: `admin@baytbd.com`
- **Password**: `Admin@123456`
- **Role**: `SUPER_ADMIN`

### Admin Management Capabilities:
- **Dashboard Overview**: Real-time KPI counters (Total Orders, Pending Orders, Live Products, Properties, Services, Inquiries).
- **Order Management Console**: Review customer orders, delivery addresses, items, payment methods (COD, bKash, Nagad), and live status updates with toast feedback.
- **Property Lead Tracker**: Track inquiries submitted for Bayt Development landmark projects.

---

## 📁 Project Structure

```
baytbd/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Complete PostgreSQL models
│   │   └── seed.ts             # Pre-seeded real estate, agro & IT data
│   ├── src/
│   │   ├── config/prisma.ts    # Prisma Client instance
│   │   ├── controllers/        # Agro, Dev, IT, CMS, Auth controllers
│   │   ├── middlewares/        # Auth JWT & RBAC requireRole
│   │   ├── routes/             # RESTful API endpoints
│   │   └── server.ts           # Express entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Dynamic Navbar with vertical switcher & Footer
│   │   │   └── agro/           # CartDrawer with shipping progress meter
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx# 4-5 Color theme manager
│   │   │   ├── CartContext.tsx # Persistent shopping cart + Sonner toasts
│   │   │   └── AuthContext.tsx # Staff JWT auth & session
│   │   ├── pages/              # Home, About, Agro, Dev, IT, News, Careers, Contact
│   │   │   └── admin/          # Admin Login & Management Dashboard
│   │   ├── services/api.ts     # Axios API service
│   │   ├── types/index.ts      # TypeScript interfaces
│   │   ├── App.tsx             # React Router v6 configuration
│   │   └── index.css           # CSS Variable theme tokens
│   ├── tailwind.config.js
│   └── vite.config.ts
```
