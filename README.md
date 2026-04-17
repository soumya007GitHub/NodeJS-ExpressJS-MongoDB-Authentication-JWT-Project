# Node.js + Express + MongoDB — JWT authentication and contacts API

REST API for user registration, login, JWT-protected routes, and per-user contacts stored in MongoDB.

## Features

- User registration and login with bcrypt-hashed passwords
- Access tokens (JWT) signed with a server secret
- Protected routes: contacts CRUD and `GET /user/current` require a valid `Bearer` token
- **Revoked access after account deletion:** if a user is removed from the database but still holds an old JWT, the server verifies that the user id from the token still exists in the `users` collection before allowing any protected operation. If the account is gone, the request is rejected with **403** and a clear error message (contacts and other token-protected routes use this check)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended; project uses ES modules)
- A [MongoDB](https://www.mongodb.com/) deployment (local or Atlas)

## Environment variables

Create a `.env` file in the project root:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port for the Express server |
| `URL` | MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/your-db` or Atlas URI) |
| `ACCESS_TOKEN_SECRET` | Secret string used to sign and verify JWT access tokens |

Example (do not commit real secrets):

```env
PORT=5000
URL=mongodb://127.0.0.1:27017/contacts_app
ACCESS_TOKEN_SECRET=change_this_to_a_long_random_string
```

## Install and run

```bash
npm install
node server.js
```

With [nodemon](https://www.npmjs.com/package/nodemon) (already a dependency):

```bash
npx nodemon server.js
```

## API overview

Base URL: `http://localhost:<PORT>` (replace with your `PORT` from `.env`).

### Users (`/user`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/user/register` | No | Register `{ username, email, password }` |
| `POST` | `/user/login` | No | Login `{ email, password }` — returns `{ accessToken }` |
| `GET` | `/user/current` | Yes | Example protected user route |

### Contacts (`/contacts`)

All routes below require header:

`Authorization: Bearer <accessToken>`

Before handlers run, middleware validates the JWT and ensures the user id in the token still exists in MongoDB. If the user document was deleted, responses use **403** with an explanatory message.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/contacts` | List contacts for the authenticated user |
| `GET` | `/contacts/:id` | Get one contact by id |
| `POST` | `/contacts` | Create contact `{ name, email, phone }` |
| `PUT` | `/contacts/:id` | Update contact |
| `DELETE` | `/contacts/:id` | Delete contact |

## Project structure

```
server.js                 # App entry, Mongo connect, routes
routes/
  userRoutes.js           # Public register/login; protected current user
  contactRoutes.js        # All routes use validateToken
controllers/
  userController.js
  contactControllers.js
models/
  User.js
  Contact.js              # References user via userId
middleware/
  validateToken.js        # JWT verify + user must exist in DB
  errorHandler.js
```

## Security notes

- Keep `ACCESS_TOKEN_SECRET` private; rotate it if leaked (existing tokens will become invalid).
- This project uses short-lived access tokens (see `expiresIn` in `userController.js`). For production, consider refresh tokens, HTTPS, and rate limiting on login/register.

## License

ISC (see `package.json`).
