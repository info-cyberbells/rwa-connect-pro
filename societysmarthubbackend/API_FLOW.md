# API Flow and System Design

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT/FRONTEND                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXPRESS SERVER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Middleware Stack (app.js)                                 │ │
│  │  1. helmet() - Security headers                            │ │
│  │  2. cors() - Cross-origin requests                         │ │
│  │  3. express.json() - Parse JSON bodies                     │ │
│  │  4. cookieParser() - Parse cookies                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Route Handlers                                            │ │
│  │  - /api/auth/* → authRouter                                │ │
│  │  - /api/superadmin/* → superAdminRouter                    │ │
│  │  - /api/admin/* → adminRouter                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Authentication Middleware (auth.js)                       │ │
│  │  - Verify JWT access token                                 │ │
│  │  - Attach user info to req.user                            │ │
│  │  - Check if user is active                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Authorization Middleware (roles.js)                       │ │
│  │  - Check if user has required role                         │ │
│  │  - Enforce role-based access control                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Controller Functions                                      │ │
│  │  - Business logic                                          │ │
│  │  - Data validation                                         │ │
│  │  - Database operations                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Error Handler (errorHandler.js)                           │ │
│  │  - Catch and format errors                                 │ │
│  │  - Send error responses                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MONGODB DATABASE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    users     │  │  societies   │  │refreshtokens │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### Login Process

```
1. Client sends credentials
   POST /api/auth/login
   Body: { email, password }
        ↓
2. authController.login()
   - Find user by email
   - Compare password with bcrypt
   - Generate accessToken (15min)
   - Generate refreshToken (7d)
        ↓
3. Save refreshToken to DB
   RefreshToken.create({
     user, token, expiresAt
   })
        ↓
4. Set refreshToken as HttpOnly cookie
   res.cookie("refreshToken", ...)
        ↓
5. Return accessToken to client
   { accessToken, user }
```

### Authenticated Request Flow

```
1. Client sends request with token
   Authorization: Bearer <accessToken>
        ↓
2. auth middleware
   - Extract token from header
   - Verify token signature
   - Decode payload
        ↓
3. Attach user info
   req.user = {
     id: payload.sub,
     role: payload.role,
     society: payload.society
   }
        ↓
4. Check user is active
   User.findById(id).isActive === true
        ↓
5. Proceed to next middleware/controller
```

### Token Refresh Flow

```
1. Client sends refresh request
   POST /api/auth/refresh
   Cookie: refreshToken
        ↓
2. authController.refresh()
   - Verify refreshToken
   - Find token in DB
   - Check not revoked
        ↓
3. Revoke old token
   token.revoked = true
        ↓
4. Generate new tokens
   - New refreshToken
   - New accessToken
        ↓
5. Save new refreshToken to DB
        ↓
6. Return new accessToken
   { accessToken }
```

---

## Role-Based Access Control

### SuperAdmin Flow

```
Login as SuperAdmin
        ↓
Create Society
POST /api/superadmin/societies
        ↓
Society created in DB
        ↓
Create Society Admin
POST /api/superadmin/admins
Body: { name, email, password, societyId }
        ↓
Admin user created with:
- role: "society_admin"
- society: societyId
        ↓
View All Societies
GET /api/superadmin/societies
        ↓
Get Society Details
GET /api/superadmin/societies/:id
- Returns society info
- Returns all users in society
```

### Society Admin Flow

```
Login as Society Admin
        ↓
Access token contains:
- role: "society_admin"
- society: <societyId>
        ↓
View My Society
GET /api/admin/society
        ↓
Create User
POST /api/admin/users
Body: { name, email, password }
- Automatically assigns user to admin's society
- role: "user"
        ↓
List Users in My Society
GET /api/admin/users
- Only returns users where:
  society === req.user.society
  role === "user"
        ↓
Update User
PUT /api/admin/users/:id
- Only if user.society === admin.society
        ↓
Toggle User Status
PATCH /api/admin/users/:id/toggle-status
- Activate/deactivate users
```

---

## Data Flow Examples

### Example 1: SuperAdmin Creates Complete Setup

```
Step 1: Login
POST /api/auth/login
{ "email": "superadmin@example.com", "password": "..." }
→ Response: { accessToken, user }

Step 2: Create Society
POST /api/superadmin/societies
Headers: Authorization: Bearer <accessToken>
Body: { "name": "Green Valley", "address": "123 Main St" }
→ Response: { society: { id, name, ... } }

Step 3: Create Society Admin
POST /api/superadmin/admins
Headers: Authorization: Bearer <accessToken>
Body: {
  "name": "John Admin",
  "email": "john@greenvalley.com",
  "password": "Admin123",
  "societyId": "<society-id-from-step-2>"
}
→ Response: { admin: { id, name, email, role, society } }
```

### Example 2: Society Admin Manages Users

```
Step 1: Login as Society Admin
POST /api/auth/login
{ "email": "john@greenvalley.com", "password": "Admin123" }
→ Response: {
  accessToken,
  user: { id, email, role: "society_admin", society: "..." }
}

Step 2: Create User
POST /api/admin/users
Headers: Authorization: Bearer <accessToken>
Body: { "name": "Jane User", "email": "jane@greenvalley.com", "password": "User123" }
→ User created with society = admin's society

Step 3: List All Users
GET /api/admin/users
Headers: Authorization: Bearer <accessToken>
→ Returns only users in Green Valley society

Step 4: Update User
PUT /api/admin/users/:userId
Headers: Authorization: Bearer <accessToken>
Body: { "name": "Jane Updated", "email": "jane.new@greenvalley.com" }
→ Only works if user is in admin's society
```

---

## Security Layers

### Layer 1: Network Security
- CORS configured
- Helmet for security headers
- HTTPS (recommended in production)

### Layer 2: Authentication
- JWT tokens
- Access token (15min lifetime)
- Refresh token (7d lifetime, HttpOnly cookie)
- Token rotation on refresh

### Layer 3: Authorization
- Role-based access control
- Route-level permissions
- Resource-level permissions

### Layer 4: Data Isolation
- Society-scoped queries
- Admin can only access their society
- Users can only see their society

### Layer 5: Account Security
- Password hashing (bcrypt, 12 rounds)
- Account activation/deactivation
- Active status check on every request

---

## Database Relations

```
SuperAdmin (User)
  └─ creates → Society
                  ├─ has → Society Admin (User)
                  │         └─ creates → Regular User (User)
                  └─ has → Regular User (User)

User Collection:
{
  _id: ObjectId,
  role: "superadmin" | "society_admin" | "user",
  society: ObjectId | null,  // null for superadmin
  ...
}

Society Collection:
{
  _id: ObjectId,
  name: String,
  createdBy: ObjectId,  // Reference to SuperAdmin
  ...
}

RefreshToken Collection:
{
  _id: ObjectId,
  user: ObjectId,       // Reference to User
  token: String,
  expiresAt: Date,
  revoked: Boolean
}
```

---

## Middleware Execution Order

For a request to `/api/admin/users`:

```
1. helmet()
   ↓
2. cors()
   ↓
3. express.json()
   ↓
4. cookieParser()
   ↓
5. Router match: /api/admin/*
   ↓
6. auth middleware
   - Verify JWT
   - Attach req.user
   ↓
7. permit("society_admin")
   - Check req.user.role === "society_admin"
   ↓
8. Controller: getSocietyUsers()
   - Business logic
   - DB query
   ↓
9. Send response
   ↓
10. errorHandler (if error occurs)
```

---

## Error Handling Flow

```
Error occurs in controller
        ↓
throw error / next(error)
        ↓
Express catches error
        ↓
errorHandler middleware
        ↓
Format error response
{
  message: "Error description",
  status: 400/401/403/404/500
}
        ↓
Send to client
```

---

## Common Scenarios

### Scenario 1: Unauthorized Access Attempt

```
User with role "user" tries:
POST /api/superadmin/societies

Flow:
1. auth middleware → ✓ Valid token
2. permit("superadmin") → ✗ role is "user"
3. Return 403 Forbidden
```

### Scenario 2: Cross-Society Access Attempt

```
Admin from Society A tries:
PUT /api/admin/users/:userId
where userId belongs to Society B

Flow:
1. auth middleware → ✓ Valid token
2. permit("society_admin") → ✓ Role matches
3. updateUser controller
   - Query: User.findOne({ _id: userId, society: adminSociety })
   - Result: null (user not in admin's society)
4. Return 404 Not Found
```

### Scenario 3: Token Expiration

```
Client sends request with expired accessToken

Flow:
1. auth middleware
   - verifyAccessToken(token)
   - Throws error: "TokenExpiredError"
2. Catch error
3. Return 401 Unauthorized
4. Client uses refresh endpoint
5. Gets new accessToken
6. Retries request
```

---

## Performance Considerations

1. **Database Indexes**
   - User.email (unique)
   - RefreshToken.token (unique)
   - User.society (for queries)

2. **Token Caching**
   - Access token stored client-side
   - Reduces DB hits for auth

3. **Selective Field Projection**
   - `.select("-passwordHash")` excludes sensitive data
   - Reduces payload size

4. **Society-Scoped Queries**
   - Filters at DB level
   - More efficient than application filtering

---

This flow documentation helps understand:
- How requests are processed
- Security layers in action
- Role-based access control
- Data isolation mechanisms
- Error handling strategies
