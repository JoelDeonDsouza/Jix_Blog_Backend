# 🚀 Jix Blog API Endpoints

This repository contains the backend server for the **Jix Blog**, built with **JavaScript** and **Express.js**. It exposes a collection of RESTful API endpoints for managing blogs, users, comments, and more.

---

## 🧰 Tech Stack

### Core

- JavaScript (Node.js)
- Express.js

### Authentication

- [Clerk](https://clerk.dev) (`@clerk/express`)

### Database

- MongoDB
- Mongoose

### Media & File Handling

- [ImageKit](https://imagekit.io)

### Webhooks & Events

- [Svix](https://www.svix.com) (for webhook delivery)

### Utilities

- `dotenv` – Environment variables
- `cors` – Cross-Origin Resource Sharing
- `morgan` – HTTP request logger
- `nodemon` – Development auto-reloading

---

## 📚 API Endpoints

#### Blog Routes

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | `/blogs/list`        | Get list of all blogs |
| GET    | `/blogs/:slug`       | Get a blog by slug    |
| GET    | `/blogs/upload-auth` | Get upload auth token |
| PATCH  | `/blogs/featured`    | Blog is featured      |
| POST   | `/blogs/create`      | Create a new blog     |
| DELETE | `/blogs/delete/:id`  | Delete a blog by ID   |

#### User Routes

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | `/users/saved` | Get saved blog posts |
| POST   | `/user/save`   | Save a blog post     |

#### Comments Routes

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/comments/list`    | Get all comments             |
| GET    | `/comments/:blogId` | Get comments for a blog post |
| POST   | `/comments/create`  | Create a new comment         |
| DELETE | `/comments/:id`     | Delete a comment by ID       |

#### Clerk Webhook Route

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | `/webhooks/clerk` | Handles Clerk webhooks |

## Run Locally

Clone the project

```bash
  git clone https://github.com/JoelDeonDsouza/Jix_Blog_Backend.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm  start
```

## 📦 Environment Variables (`.env`)

```env
PORT=10000

# Database

JIX_DATA_BASE_CONNECTION_STRING=

# Clerk configuration

CLERK_WEBHOOK_SIGNING_SECRET=

CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

# ImageKit configuration

IMAGEKIT_URL_ENDPOINT=

IMAGEKIT_PUBLIC_KEY=

IMAGEKIT_PRIVATE_KEY=
```
