# APEye

A modern, fast, and intuitive API testing client built for developers who value speed and simplicity. Test, debug, and organize your APIs with ease.

## Overview

APEye is a full-stack API testing application that provides a clean interface for making HTTP requests, organizing them into collections, and tracking your request history. Built with a Next.js frontend and Go backend, it offers a responsive experience with real-time feedback.

## Features

### Request Builder

- Support for all standard HTTP methods: GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS
- Query parameter builder with enable/disable toggles for individual parameters
- Custom headers configuration with common header suggestions
- Multiple authentication types:
  - Bearer Token
  - Basic Authentication
  - API Key (custom header)
- Request body support for multiple formats:
  - JSON
  - Form Data
  - URL Encoded (x-www-form-urlencoded)
  - Raw text

### Response Viewer

- Color-coded status badges indicating success, redirect, or error responses
- Response time and size metrics displayed for every request
- Syntax-highlighted response body with pretty print formatting
- Response headers inspection
- Copy response to clipboard or download as file

### Collections

- Create collections to organize related requests
- Save requests with custom names for easy retrieval
- Load saved requests back into the request builder with one click
- Expandable tree view for navigating collections and requests

### Request History

- Automatic logging of all executed requests
- Filter history by HTTP method, status code, or URL
- History grouped by date for easy navigation
- Re-run any historical request instantly
- Clear individual items or entire history

### User Experience

- Dark and light theme support with system preference detection
- Resizable panels for customizing your workspace layout
- Collapsible sidebar for maximizing workspace area
- Responsive design that works across screen sizes
- Toast notifications for action feedback

### Local Agent

- Dedicated local HTTP agent for localhost/private network request execution
- Health-aware frontend integration with agent status indicator
- Automatic history persistence for local-agent executed requests

## Tech Stack

### Frontend

- Next.js 14 with App Router
- React with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- shadcn/ui component library

### Backend

- Go with Gin framework
- GORM for database operations
- PostgreSQL database
- Better-Auth for authentication (email/password and Google OAuth)

## How It Works

APEye uses a proxy architecture where the Go backend executes HTTP requests on behalf of users. This approach avoids CORS restrictions and enables full request customization including custom headers and authentication that browsers would otherwise block.

When you send a request:

1. The frontend sends your request configuration to the backend
2. The backend constructs and executes the actual HTTP request
3. The response is captured with timing and size metrics
4. The result is returned to the frontend for display
5. The request is automatically saved to your history

For localhost and private network targets, APEye can use the local agent:

1. The frontend sends request configuration to `apeye-agent` running on `127.0.0.1`
2. The agent executes the request directly from your machine
3. The response is returned in the same format as backend proxy responses
4. The frontend saves the result to history through the existing backend history API

## Running the Local Agent

### For End Users (Windows)

1. Download `apeye-agent.exe` from:
   - `https://github.com/Akash-YS05/apeye-app/releases/latest/download/apeye-agent.exe`
2. Open PowerShell in the folder containing the binary.
3. Run:

```powershell
.\apeye-agent.exe
```

4. Copy the pairing token printed in the agent terminal.
5. In APEye, open Local Agent setup, paste token, and save.
6. Keep the process running while testing local URLs.
7. Optional quick check:

```powershell
curl -H "X-APEYE-Agent-Token: <token>" http://127.0.0.1:6363/health
```

### For Project Developers

From project root:

```bash
make agent
```

Or build a Windows binary locally:

```bash
cd apeye-backend
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -o ../apeye-agent.exe ./cmd/agent
```

The agent listens on `http://127.0.0.1:6363` by default.

Environment variables:

- `AGENT_PORT` - agent port (default: `6363`)
- `AGENT_GIN_MODE` - gin mode for agent (`debug`/`release`)
- `AGENT_ALLOWED_ORIGINS` - optional comma-separated CORS origin allowlist (if empty, agent allows all origins)
- `AGENT_AUTH_TOKEN` - optional static pairing token (if empty, generated at startup and printed in logs)

## Publishing Windows Agent

This repo includes a GitHub Actions workflow that builds and uploads `apeye-agent.exe` automatically when a GitHub release is published:

- Workflow file: `.github/workflows/release-agent-windows.yml`
- Trigger: release published
- Assets uploaded: `apeye-agent.exe`, `apeye-agent.exe.sha256`
- Optional code signing in workflow when these repo secrets are set:
  - `WINDOWS_SIGN_CERT_BASE64` (base64-encoded `.p12` certificate)
  - `WINDOWS_SIGN_CERT_PASSWORD`
  - `WINDOWS_SIGN_TIMESTAMP_URL` (optional)

Release steps:

1. Create and push a version tag (example: `v0.1.1`)
2. Open GitHub Releases and publish a new release for that tag
3. Wait for workflow completion
4. Verify asset exists at:
   - `https://github.com/Akash-YS05/apeye-app/releases/latest/download/apeye-agent.exe`

Optional integrity verification (Windows PowerShell):

```powershell
Invoke-WebRequest "https://github.com/Akash-YS05/apeye-app/releases/latest/download/apeye-agent.exe" -OutFile "apeye-agent.exe"
Invoke-WebRequest "https://github.com/Akash-YS05/apeye-app/releases/latest/download/apeye-agent.exe.sha256" -OutFile "apeye-agent.exe.sha256"
$expected = (Get-Content .\apeye-agent.exe.sha256).Split(' ')[0]
$actual = (Get-FileHash .\apeye-agent.exe -Algorithm SHA256).Hash.ToLower()
if ($actual -eq $expected) { "Checksum OK" } else { "Checksum mismatch" }
```

## License

MIT License
