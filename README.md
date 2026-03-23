# Utahime Bookstore 

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)

## 1. Project Title

BetaBook (internal repository name: NhaSach)

## 2. Description

### Purpose

BetaBook is a modern web-based bookstore/HR dashboard intended for enterprise operations. It provides a UI for book inventory, customers, invoices, promotions, approvals, employee management, leave workflows, resignations, and reporting.

### Target Users

- Store managers and administrators
- HR and operations staff
- Approval workflow users
- Reporting analysts

### Main Functionality

- Authentication and permission-based routes
- Dashboard overview with charts and metrics
- Book, customer, invoice, promotion, regulation CRUD pages
- Leave requests, approvals, and resignation tracking
- Import data interface
- Responsive custom component library built on Radix UI

## 3. Tech Stack

- Frontend
  - React 18
  - TypeScript
  - Vite
  - React Router DOM
  - Radix UI components
  - Tailwind CSS (via custom styles and utility classes)
  - Recharts (data visualization)
  - React Hook Form
  - Axios for API calls
  - Sonner toast notifications

- Tooling
  - ESLint
  - Prettier
  - Husky + lint-staged + commitlint
  - Bun/NPM package lock

- Others
  - Cookies + local storage services
  - Dark/light themes with next-themes
  - Command palette via cmdk

> Note: No backend source is in this repository, API layer is implied through `src/api/api.ts` and `src/services/*.ts`.

## 4. Folder Structure

```
├── bun.lock
├── commitlint.config.js
├── eslint.config.js
├── index.html
├── note.md
├── package.json
├── package-lock.json
├── README.md
├── vite.config.ts
└── src
    ├── api
    │   └── api.ts
    ├── App.tsx
    ├── Attributions.md
    ├── bases
    │   ├── constants
    │   │   ├── app.constants.ts
    │   │   └── jwt.constants.ts
    │   └── enums
    │       └── jwt.enum.ts
    ├── components
    │   ├── figma
    │   │   └── ImageWithFallback.tsx
    │   ├── permission.ts
    │   ├── ProtectedRoute.tsx
    │   ├── services
    │   └── ui
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── ... (radix wrappers)
    ├── guidelines
    │   └── Guidelines.md
    ├── index.css
    ├── interfaces
    ├── layouts
    │   └── DashboardLayouts.tsx
    ├── main.tsx
    ├── pages
    │   ├── Approval
    │   ├── Auth
    │   ├── book
    │   ├── customer
    │   ├── dashboard
    │   ├── employee
    │   ├── import
    │   ├── invoice
    │   ├── leave
    │   ├── login
    │   ├── promotion
    │   ├── regulation
    │   ├── report
    │   ├── resignation
    │   └── userprofile
    ├── routes
    │   └── route.permission.ts
    ├── services
    │   ├── auth.service.ts
    │   ├── cookies.service.ts
    │   └── local-store.service.ts
    ├── styles
    │   └── globals.css
    └── utilis
        └── checkLogin.ts
```

### Key directories/files

- `src/App.tsx`: main application component with route definitions
- `src/main.tsx`: client entry point
- `src/pages`: feature-based pages for modules
- `src/components/ui`: shared design system wrappers (Radix + UI)
- `src/routes/route.permission.ts`: route access controls
- `src/services`: core business logic and local persistence
- `src/api/api.ts`: HTTP client wrapper

## 5. Installation

1. Clone the repository:

```bash
git clone <repo-url> BetaBook
cd BetaBook
```

2. Install dependencies (npm or bun):

```bash
npm install
```

or

```bash
bun install
```

3. (Optional) Ensure pre-commit hooks are ready:

```bash
npm run prepare
```

## 6. How to Run the Application

### Development

```bash
npm run dev
```

Then open `http://localhost:5173` (or port reported by Vite).

### Build / Production

```bash
npm run build
```

Deploy static output from `dist/` to any static hosting service.

### Formatting & lint

```bash
npm run format
```

Lint checks are run via commit hooks (`lint-staged` + `eslint`), and will run on changed files when committing.

## 10. Commit Convetions Note 

![](https://capgo.app/conventional_commits.webp)
