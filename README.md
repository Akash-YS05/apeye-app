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

## License

MIT License
