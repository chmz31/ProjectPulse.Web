# ProjectPulse Web

React + TypeScript frontend for the ProjectPulse API.

This app provides a compact portfolio/demo frontend for managing user-owned projects through the ProjectPulse backend API.

Backend repository: [ProjectPulse](https://github.com/chmz31/ProjectPulse)

## Features

- Register and login
- Persistent local session
- Project dashboard
- Create, edit, and delete projects
- API integration through environment configuration
- Dark responsive UI

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- ProjectPulse API

## Relationship With The Backend

ProjectPulse Web is designed to consume the .NET 8 ProjectPulse API. The API base URL is configured through `VITE_API_BASE_URL`, so the frontend can point to a local backend during development.

## Backend Requirement

This frontend expects the ProjectPulse API to be running locally.

Default backend URL:

<http://localhost:5241>

Health check:

<http://localhost:5241/health>

Expected response:

{
  "status": "ok"
}

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file from the example:

```powershell
Copy-Item .env.example .env
```

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The local ProjectPulse API should be running and reachable at the configured API base URL.

## Environment

Required environment variable:

```bash
VITE_API_BASE_URL=http://localhost:5241
```

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Current Scope And Limitations

- Session tokens are stored in `localStorage` for portfolio/demo use.
- Automatic refresh-token rotation is not implemented yet.
- Deployment configuration is not included yet.
