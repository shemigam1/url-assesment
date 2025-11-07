# URL Shortener Service

A full-stack URL shortening application built with a React/TypeScript frontend and a Node.js/Express backend. This project provides a clean user interface to create short, shareable links and a robust, well-documented API for programmatic access. The backend uses a simple in-memory storage system, making it lightweight and easy to run without any database dependencies.

## Key Features

- **URL Shortening**: Convert long URLs into concise, shareable links.
- **Deduplication**: Returns the existing short link if a URL has already been processed.
- **Click Tracking**: Monitors the number of visits for each shortened link.
- **API-First Design**: A well-documented REST API for all core functionalities.
- **Responsive UI**: A clean and intuitive user interface built with React and Tailwind CSS.

## Technologies Used

| Category     | Technology                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend**  | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/)                                  |
| **Tooling**  | [ESLint](https://eslint.org/), [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)                                                           |

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone git@github.com:shemigam1/url-assesment.git
    cd url-assesment
    ```

2.  **Setup the Backend Server**

    - Navigate to the server directory and install dependencies.
      ```bash
      cd server
      npm install
      ```
    - The server runs on port `8080` by default. No environment variables are strictly required to run it locally.

3.  **Setup the Frontend Client**

    - In a new terminal, navigate to the client directory and install dependencies.
      ```bash
      cd client
      npm install
      ```

4.  **Run the Application**

    - **Start the backend server**: In the `/server` directory, run:

      ```bash
      npm run dev
      ```

      The API will be available at `http://localhost:8080`.

    - **Start the frontend client**: In the `/client` directory, run:
      ```bash
      npm run dev
      ```
      The application will open in your browser at `http://localhost:5173` (or another available port).

# URL Shortener API

## Overview

This is a lightweight, in-memory URL shortening API built with Node.js and Express. It provides endpoints for creating short URLs, redirecting to original URLs, and retrieving usage statistics.

## Features

- **Express**: High-performance web framework for Node.js.
- **TypeScript**: Provides static typing for robust and maintainable code.
- **In-Memory Storage**: Utilizes simple JavaScript objects for data persistence during runtime, requiring no external database.
- **CORS**: Enabled for seamless integration with frontend clients.

## Environment Variables

While not mandatory for local development, the following variables can be configured in a `.env` file in the `/server` directory:

| Variable     | Description                                    | Example                            |
| ------------ | ---------------------------------------------- | ---------------------------------- |
| `PORT`       | The port for the API server to listen on.      | `PORT=8080`                        |
| `CLIENT_URL` | The base URL used to construct the short link. | `CLIENT_URL=http://localhost:8080` |

## API Documentation

### Base URL

`http://localhost:8080`

### Endpoints

#### POST /shorten

Creates a new short URL or returns an existing one if the original URL has already been shortened.

**Request**:

```json
{
  "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
}
```

_`url` (string, required)_: The original URL to be shortened. Must start with `http://` or `https://`.

**Response**:
A `201 Created` status is returned for a new link, and `200 OK` for an existing one.

```json
{
  "shortUrl": "http://localhost:8080/aB1cD2"
}
```

**Errors**:

- `400 Bad Request`: "URL is required"
- `400 Bad Request`: "URL must be valid and start with http:// or https://"
- `500 Internal Server Error`: "Failed to shorten URL"

---

#### GET /:code

Redirects to the original URL associated with the short code and increments the visit count. This endpoint can also return JSON stats instead of redirecting.

**Request**:

- Path Parameter `code`: The unique code for the short URL. (e.g., `/aB1cD2`)
- To receive stats instead of a redirect, include the query parameter `?stats=true` or set the `Accept` header to `application/json`.

**Response**:

- **Default Behavior**: A `302 Found` redirect to the original URL.
- **Stats Behavior**: A `200 OK` response with usage statistics.
  ```json
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
    "createdAt": 1672531200000,
    "visits": 5
  }
  ```

**Errors**:

- `400 Bad Request`: "Invalid code format"
- `404 Not Found`: "URL not found"
- `500 Internal Server Error`: "Internal server error"

---

#### GET /api/stats/:code

Retrieves usage statistics for a short URL without redirecting.

**Request**:

- Path Parameter `code`: The unique code for the short URL. (e.g., `/api/stats/aB1cD2`)

**Response**:
A `200 OK` response with the statistics object.

```json
{
  "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
  "createdAt": 1672531200000,
  "visits": 5
}
```

**Errors**:

- `400 Bad Request`: "Invalid code format"
- `404 Not Found`: "URL not found"
- `500 Internal Server Error`: "Internal server error"

---

#### GET /health

A health check endpoint to verify that the server is running.

**Request**:
No parameters or body required.

**Response**:
A `200 OK` response with the server status and timestamp.

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Errors**:

- `500 Internal Server Error`: "Internal server error"

## Author

**Semilore**

- **LinkedIn**: [Semilore Omotade-Michaels](https://www.linkedin.com/in/semiloreomotade/)
- **Twitter**: [@shemigam1](https://twitter.com/shemigam1)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
