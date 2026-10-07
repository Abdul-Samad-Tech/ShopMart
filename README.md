# ShopMart

Pakistani online supermarket. Groceries, fresh produce, household, and more, with prices in PKR.

## Stack

- Frontend: React 19, Vite, Redux Toolkit, React Router, Tailwind CSS 3.4, Axios
- Backend: Express 5, Mongoose, MongoDB
- Auth: httpOnly cookie (not localStorage). Google sign-in optional.
- Mail: Nodemailer. Assistant: Gemini, server-side only.

## Project structure

```
├── frontend/
│   ├── src/
│   │   ├── animations/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── server/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validation/
│   │   └── index.js
│   ├── scripts/
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy env files and fill in your own values (no real secrets belong in git):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start MongoDB. Local option:

```bash
npm run db:local
```

4. Seed the catalog (development):

```bash
npm run seed
```

5. Run the API and the Vite app together:

```bash
npm run dev
```

The shop is at http://localhost:5173. The API is at http://localhost:5000. Vite proxies `/api` to the API, so the auth cookie stays on the same site in development.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | API and frontend together |
| `npm run dev:server` | API only |
| `npm run dev:client` | Frontend only, after the API is up |
| `npm run build` | Production frontend build |
| `npm run lint` | Frontend lint |
| `npm run preview` | Preview the frontend build |
| `npm run seed` | Seed categories, products, and content |
| `npm run admin:create` | Create an admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `npm run users:reset` | Reset development demo users |
| `npm run db:check` | Check the MongoDB connection |
| `npm run gemini:check` | Check the Gemini key without printing it |

## Environment variables

Server values live in `backend/.env`. See `backend/.env.example` for the full list: `MONGODB_URI`, `CLIENT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, SMTP settings, `GOOGLE_CLIENT_ID`, and `GEMINI_API_KEY`.

Frontend values live in `frontend/.env`: `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`.

In production the process refuses to start if `JWT_SECRET` or `JWT_REFRESH_SECRET` is missing, shorter than 32 characters, or still a placeholder. Demo users are created only when `NODE_ENV` is not `production`.

Auth uses an httpOnly, `SameSite=Lax` cookie (`Secure` in production). Keep the shop and the API on the same site (or proxy `/api`) so the browser sends that cookie.

## API

Public and session routes include:

- `GET /api/health`
- `GET /api/products`, `GET /api/products/:id`, `GET /api/categories`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`
- `GET /api/auth/me`, `POST /api/auth/logout`
- `POST /api/orders`, `GET /api/orders/track/:id`
- `POST /api/contact`, `POST /api/chat`, `POST /api/promo/validate`

Logged-in routes such as `/api/users/me` and `/api/admin/*` read the auth cookie. A `Bearer` token is still accepted for tools like Postman; the browser app does not store one.
