# MyPrompter

MyPrompter is a small AI prompt-and-response web app. The React frontend sends prompts to an Express server, which requests a response from Google Gemini and returns it for display.

## Project layout

```text
.
├── palm-client/   React 19 + Vite frontend
└── palm-server/   Express API server + Google Gemini SDK
```

## Requirements

- Node.js 20 or newer
- npm
- A Google Gemini API key
- Network access from the server to Google's Gemini API

## Setup

Install dependencies in each project folder:

```bash
cd palm-server
npm install
cd ../palm-client
npm install
```

Create `palm-server/.env` and add your Gemini API key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
```

Keep this key on the server. Do not put it in the frontend or commit the `.env` file.

## Run locally

Open two terminals from the repository root.

Terminal 1 — start the API server:

```bash
cd palm-server
npm run dev
```

The server listens on port `3333` by default. Set `PORT` in `palm-server/.env` to use a different port.

Terminal 2 — start the Vite frontend:

```bash
cd palm-client
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Vite proxies `/api` requests to `http://localhost:3333` during development.

## Usage

Enter a prompt in the composer and press **Enter** or select **Send**. Use **Shift + Enter** to add a line break. Responses are rendered as Markdown.

## API

`POST /api` accepts JSON with a non-empty `prompt`:

```json
{
  "prompt": "Explain how rainbows form."
}
```

A successful response has this shape:

```json
{
  "answer": "..."
}
```

The server returns an error response if the prompt is missing or Gemini cannot generate a response. Connection and DNS failures are reported as `503 Service Unavailable`.

## Production build

Build the frontend with:

```bash
cd palm-client
npm run build
```

The generated static files are placed in `palm-client/dist`. The API server is started separately with `npm start` from `palm-server`. Configure your production web server to serve the frontend and route `/api` requests to the Express server; the Vite proxy is for local development only.

## Troubleshooting

- **Gemini connection or DNS error:** Confirm the server has internet access and can resolve `generativelanguage.googleapis.com`. Check VPN, firewall, and proxy settings.
- **Missing or invalid API key:** Confirm `GEMINI_API_KEY` is set in `palm-server/.env`, then restart the server.
- **Frontend cannot reach the API:** Make sure both development servers are running and that the API server is listening on the configured port.

## Scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `palm-client` | `npm run dev` | Start Vite development server |
| `palm-client` | `npm run build` | Build frontend assets |
| `palm-client` | `npm run lint` | Run ESLint |
| `palm-client` | `npm run preview` | Preview built frontend |
| `palm-server` | `npm run dev` | Start API server with nodemon |
| `palm-server` | `npm start` | Start API server |
