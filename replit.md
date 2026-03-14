# Bank of Blockchain Platform

## Overview

Full-stack financial web platform inspired by bofblockchain.com. Users can manage multi-currency accounts, submit bank wire and crypto transfer requests, and track transactions. Admins have full control over users, balances, and transaction approvals.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Auth**: JWT (stored in localStorage as `bob_token`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express 5 backend API
│   └── bank-of-blockchain/ # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/                # Utility scripts
```

## Test Accounts

- **Admin**: admin@bankofblockchain.com / Admin@2026!
- **User**: jean@example.com / User@2026!

## Authentication Flow

- JWT token stored in localStorage as `bob_token`
- Auto-injected on all fetch requests via `window.fetch` override
- Role-based routing: admin → `/admin`, user → `/dashboard`
- Account statuses: `pending` (needs admin activation), `active`, `suspended`

## Pages

### Public Pages
- `/` — Landing page with hero, features, CTA
- `/about` — About page
- `/contact` — Contact page
- `/login` — Login form
- `/register` — Registration form (creates pending account)

### User Dashboard (`/dashboard`)
- `/dashboard` — Overview with balance cards and recent transactions
- `/dashboard/portfolio` — Multi-currency portfolio with chart
- `/dashboard/transfers` — Bank wire + crypto transfer forms
- `/dashboard/transactions` — Transaction history with filters
- `/dashboard/settings` — Profile, password, bank accounts management

### Admin Dashboard (`/admin`)
- `/admin` — Stats overview + recent activity
- `/admin/users` — User management (activate, suspend, delete)
- `/admin/transactions` — Validate/reject transactions
- `/admin/bank-transfers` — Validate/reject bank wire transfers
- `/admin/crypto-transfers` — Validate/reject crypto transfers
- `/admin/balances` — Edit user EUR/USD/BTC balances
- `/admin/notifications` — Send notifications to users
- `/admin/logs` — System action logs
- `/admin/security` — User role management

## API Routes

All routes are under `/api`:
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Current user info
- `GET/PATCH/DELETE /api/users/:id` — User management (admin)
- `POST /api/users/:id/activate|suspend` — Status changes (admin)
- `GET /api/balances/me` — Current user balances
- `GET/PATCH /api/balances/:userId` — Admin balance management
- `GET /api/transactions` — List transactions
- `POST /api/transactions/:id/validate|reject` — Admin actions
- `GET/POST /api/bank-transfers` — Bank wire transfers
- `POST /api/bank-transfers/:id/validate|reject` — Admin actions
- `GET/POST /api/crypto-transfers` — Crypto transfers
- `POST /api/crypto-transfers/:id/validate|reject` — Admin actions
- `GET/POST/DELETE /api/bank-accounts` — User bank accounts
- `GET/POST /api/notifications` — Notifications
- `POST /api/notifications/:id/read` — Mark as read
- `GET /api/logs` — System logs (admin)
- `GET /api/admin/stats` — Dashboard statistics (admin)

## DB Schema Tables

- `users` — accounts with role (user/admin) and status (pending/active/suspended)
- `balances` — per-user EUR, USD, BTC balances
- `transactions` — all financial transactions
- `bank_transfers` — bank wire transfer requests
- `crypto_transfers` — cryptocurrency transfer requests
- `bank_accounts` — saved bank account details
- `notifications` — user notifications
- `system_logs` — admin action audit trail

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT authentication, 7-day expiry
- Role-based access: admin-only routes protected
- SQL injection prevention via Drizzle ORM parameterized queries
