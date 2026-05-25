# Society Management System - Backend API

A comprehensive Node.js/Express backend system for managing multiple societies with role-based access control (RBAC). This system supports three user roles: SuperAdmin, Society Admin, and Users.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [Authentication Flow](#authentication-flow)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)

---

## Overview

This backend manages a multi-society platform where:

- **SuperAdmin**: Creates and manages all societies and their admins
- **Society Admin**: Manages users within their assigned society
- **Users**: Regular members of a society

### Key Features

- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Society-scoped data isolation
- Secure password hashing with bcrypt
- HttpOnly cookies for refresh tokens
- Token rotation on refresh

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        SuperAdmin                            │
│  - Creates Societies                                         │
│  - Creates Society Admins                                    │
│  - Views all societies and users                             │
│  - Can activate/deactivate any user                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ creates
                  ▼
        ┌─────────────────┐
        │    Societies    │
        └────────┬────────┘
                 │
                 │ has
                 ▼
        ┌─────────────────┐
        │  Society Admin  │
        │  - Manages users│
        │  - In one       │
        │    society only │
        └────────┬────────┘
                 │
                 │ creates/manages
                 ▼
        ┌─────────────────┐
        │      Users      │
        │  - Belong to    │
        │    one society  │
        └─────────────────┘
```

---

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS
- **Environment**: dotenv

---

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- MongoDB v5 or higher
- npm or yarn

### Step 1: Clone & Install

```bash
cd societysmarthubbackend
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

### Step 3: Generate JWT Secrets

Generate secure random secrets for production:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`

### Step 4: Start MongoDB

Ensure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 5: Seed SuperAdmin

Create the initial superadmin account:

```bash
npm run seed:superadmin
```

**Default credentials** (if not specified in .env):
- Email: `superadmin@example.com`
- Password: `SuperAdmin@123`

### Step 6: Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on `http://localhost:4000`

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/society-management` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | `your-64-char-random-string` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `your-64-char-random-string` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `SUPERADMIN_NAME` | Initial superadmin name | `Super Admin` |
| `SUPERADMIN_EMAIL` | Initial superadmin email | `superadmin@example.com` |
| `SUPERADMIN_PASSWORD` | Initial superadmin password | `SuperAdmin@123` |

---

## Database Models

### User Model

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email (lowercase)
  passwordHash: String,   // Bcrypt hashed password
  role: String,           // "superadmin" | "society_admin" | "user"
  society: ObjectId,      // Reference to Society (null for superadmin)
  isActive: Boolean,      // Account active status
  createdAt: Date
}
```

### Society Model

```javascript
{
  name: String,           // Unique society name
  address: String,        // Physical address
  metadata: Mixed,        // Additional data
  createdBy: ObjectId,    // Reference to User (superadmin)
  createdAt: Date
}
```

### RefreshToken Model

```javascript
{
  user: ObjectId,         // Reference to User
  token: String,          // Unique refresh token
  expiresAt: Date,        // Token expiration
  revoked: Boolean,       // Revocation status
  createdAt: Date
}
```

---

## Authentication Flow

### 1. Login

```
User → POST /api/auth/login
     → Server validates credentials
     → Server generates accessToken (15min) & refreshToken (7d)
     → Server stores refreshToken in DB
     → Server sets refreshToken as HttpOnly cookie
     → Returns accessToken to client
```

### 2. Authenticated Requests

```
Client → Sends request with Authorization: Bearer <accessToken>
      → Server validates token
      → Server attaches user info to req.user
      → Proceeds to route handler
```

### 3. Token Refresh

```
Client → POST /api/auth/refresh (with refreshToken cookie)
      → Server validates refreshToken
      → Server revokes old refreshToken
      → Server generates new tokens
      → Returns new accessToken
```

### 4. Logout

```
Client → POST /api/auth/logout
      → Server revokes refreshToken
      → Server clears cookie
      → User logged out
```

---

## API Documentation

### Base URL

```
http://localhost:4000/api
```

All requests except `/auth/login` and `/health` require authentication via:
```
Authorization: Bearer <accessToken>
```

---

### Authentication Endpoints

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "society_admin",
    "society": "507f1f77bcf86cd799439012"
  }
}
```

#### Refresh Token

```http
POST /api/auth/refresh
```

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```

#### Logout

```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logged out"
}
```

---

### SuperAdmin Endpoints

All endpoints require `role: "superadmin"`

#### Create Society

```http
POST /api/superadmin/societies
```

**Request Body:**
```json
{
  "name": "Green Valley Society",
  "address": "123 Main St, City, State",
  "metadata": {
    "totalFlats": 100,
    "amenities": ["gym", "pool"]
  }
}
```

**Response:**
```json
{
  "message": "Society created successfully",
  "society": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Green Valley Society",
    "address": "123 Main St, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Societies

```http
GET /api/superadmin/societies
```

**Response:**
```json
{
  "count": 2,
  "societies": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Green Valley Society",
      "address": "123 Main St",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "Super Admin",
        "email": "superadmin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Society Details

```http
GET /api/superadmin/societies/:societyId
```

**Response:**
```json
{
  "society": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Green Valley Society",
    "address": "123 Main St",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Super Admin",
      "email": "superadmin@example.com"
    }
  },
  "users": {
    "count": 25,
    "list": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "society_admin",
        "isActive": true
      }
    ]
  }
}
```

#### Create Society Admin

```http
POST /api/superadmin/admins
```

**Request Body:**
```json
{
  "name": "John Admin",
  "email": "john@example.com",
  "password": "SecurePass123",
  "societyId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "message": "Society admin created successfully",
  "admin": {
    "id": "507f1f77bcf86cd799439012",
    "name": "John Admin",
    "email": "john@example.com",
    "role": "society_admin",
    "society": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Toggle User Status

```http
PATCH /api/superadmin/users/:userId/toggle-status
```

**Response:**
```json
{
  "message": "User activated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true
  }
}
```

---

### Society Admin Endpoints

All endpoints require `role: "society_admin"`

#### Get My Society

```http
GET /api/admin/society
```

**Response:**
```json
{
  "society": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Green Valley Society",
    "address": "123 Main St",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Super Admin",
      "email": "superadmin@example.com"
    }
  }
}
```

#### Create User

```http
POST /api/admin/users
```

**Request Body:**
```json
{
  "name": "Jane User",
  "email": "jane@example.com",
  "password": "UserPass123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Jane User",
    "email": "jane@example.com",
    "role": "user",
    "society": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### Get All Users in Society

```http
GET /api/admin/users
```

**Response:**
```json
{
  "count": 20,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Jane User",
      "email": "jane@example.com",
      "role": "user",
      "society": "507f1f77bcf86cd799439011",
      "isActive": true,
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

#### Get User Details

```http
GET /api/admin/users/:userId
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane User",
    "email": "jane@example.com",
    "role": "user",
    "society": "507f1f77bcf86cd799439011",
    "isActive": true,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### Update User

```http
PUT /api/admin/users/:userId
```

**Request Body:**
```json
{
  "name": "Jane Updated",
  "email": "jane.updated@example.com"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Jane Updated",
    "email": "jane.updated@example.com",
    "role": "user"
  }
}
```

#### Toggle User Status

```http
PATCH /api/admin/users/:userId/toggle-status
```

**Response:**
```json
{
  "message": "User deactivated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Jane User",
    "email": "jane@example.com",
    "isActive": false
  }
}
```

---

## User Roles & Permissions

### SuperAdmin

**Capabilities:**
- Create new societies
- Create society admins
- View all societies
- View all users across all societies
- Activate/deactivate any user (except superadmin)

**Restrictions:**
- Cannot be deactivated
- Not associated with any society

---

### Society Admin

**Capabilities:**
- View their assigned society details
- Create users in their society
- View all users in their society
- Update user details (name, email)
- Activate/deactivate users in their society

**Restrictions:**
- Can only manage users in their own society
- Cannot modify other admins or superadmins
- Cannot create other admins
- Cannot access other societies' data

---

### User

**Capabilities:**
- Login to the system
- Access their own profile

**Restrictions:**
- Cannot create or manage other users
- Limited to their society's scope
- No administrative privileges

---

## Security Best Practices

### Implemented

✅ Password hashing with bcrypt (12 rounds)
✅ JWT-based authentication
✅ HttpOnly cookies for refresh tokens
✅ Token rotation on refresh
✅ Role-based access control (RBAC)
✅ Society-scoped data isolation
✅ Account deactivation support
✅ CORS configuration
✅ Helmet for security headers
✅ Input validation

### Recommended for Production

- Add rate limiting (express-rate-limit)
- Implement input sanitization
- Add request validation (express-validator or Joi)
- Set up HTTPS
- Use environment-specific configurations
- Implement audit logging
- Add password complexity requirements
- Set up database backups
- Monitor for suspicious activities

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (invalid/missing token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## Testing the API

### Using cURL

**1. Login as SuperAdmin:**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@example.com","password":"SuperAdmin@123"}'
```

**2. Create a Society:**

```bash
curl -X POST http://localhost:4000/api/superadmin/societies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Test Society","address":"123 Test St"}'
```

**3. Create Society Admin:**

```bash
curl -X POST http://localhost:4000/api/superadmin/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name":"Admin User",
    "email":"admin@test.com",
    "password":"Admin123",
    "societyId":"SOCIETY_ID_FROM_STEP_2"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables:
   - `base_url`: `http://localhost:4000/api`
   - `access_token`: (auto-set from login response)
3. Create a pre-request script to auto-add Authorization header
4. Use Collections to organize endpoints by role

---

## Project Structure

```
societysmarthubbackend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login, refresh, logout
│   │   ├── superAdminController.js # SuperAdmin operations
│   │   └── adminController.js    # Society admin operations
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── roles.js              # Role-based access control
│   │   ├── societyScope.js       # Society isolation (optional)
│   │   ├── validate.js           # Input validation
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── user.js               # User model
│   │   ├── Society.js            # Society model
│   │   └── RefreshToken.js       # RefreshToken model
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── superAdmin.js         # SuperAdmin routes
│   │   └── admin.js              # Society admin routes
│   ├── services/
│   │   └── jwtService.js         # JWT sign/verify functions
│   ├── scripts/
│   │   └── seedSuperAdmin.js     # Seed script
│   ├── app.js                    # Express app setup
│   └── index.js                  # Server entry point
├── .env.example                  # Environment template
├── package.json
└── README.md
```

---

## Troubleshooting

### Issue: "Invalid token" error

**Solution:** Access token may have expired (15min lifetime). Use the refresh endpoint to get a new token.

### Issue: "Forbidden" error

**Solution:** Check if the user has the correct role for the endpoint. Verify the JWT payload contains the right role.

### Issue: "Society not found"

**Solution:** Ensure the society exists and the user has access to it. Society admins can only access their assigned society.

### Issue: Cannot create superadmin

**Solution:** Check MongoDB connection. Verify the seed script runs successfully. Ensure no existing superadmin exists.

---

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] User profile management
- [ ] Society-specific settings
- [ ] Audit logs
- [ ] File uploads (avatars, documents)
- [ ] Notifications system
- [ ] Multi-factor authentication (MFA)
- [ ] API rate limiting
- [ ] Comprehensive test suite

---

## License

ISC

---

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Node.js, Express, and MongoDB**
