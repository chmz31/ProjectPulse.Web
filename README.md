# ProjectPulse Web

ProjectPulse Web is the React + TypeScript frontend for the ProjectPulse API, a .NET 8 REST API for managing user-owned projects.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env` when local configuration is needed. The frontend will use `VITE_API_BASE_URL` for the ProjectPulse API base URL once API integration is implemented.

```bash
VITE_API_BASE_URL=http://localhost:5241
```
