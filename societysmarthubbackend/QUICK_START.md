# Quick Start Guide

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
```
MONGODB_URI=mongodb://localhost:27017/society-management
JWT_ACCESS_SECRET=your-random-secret-here
JWT_REFRESH_SECRET=your-random-secret-here
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running
brew services start mongodb-community  # macOS
```

### 4. Create SuperAdmin
```bash
npm run seed:superadmin
```

Default credentials:
- Email: `superadmin@example.com`
- Password: `SuperAdmin@123`

### 5. Start Server
```bash
npm run dev
```

---

## Test the API

### 1. Login as SuperAdmin
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@example.com","password":"SuperAdmin@123"}'
```

Save the `accessToken` from response.

### 2. Create a Society
```bash
curl -X POST http://localhost:4000/api/superadmin/societies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Green Valley","address":"123 Main St"}'
```

Save the society `id`.

### 3. Create Society Admin
```bash
curl -X POST http://localhost:4000/api/superadmin/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name":"John Admin",
    "email":"admin@greenvalley.com",
    "password":"Admin123",
    "societyId":"SOCIETY_ID_HERE"
  }'
```

### 4. Login as Society Admin
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@greenvalley.com","password":"Admin123"}'
```

### 5. Create a User (as Society Admin)
```bash
curl -X POST http://localhost:4000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "name":"Jane User",
    "email":"jane@greenvalley.com",
    "password":"User123"
  }'
```

---

## Flow Summary

```
1. SuperAdmin logs in
   ↓
2. SuperAdmin creates Society
   ↓
3. SuperAdmin creates Society Admin for that Society
   ↓
4. Society Admin logs in
   ↓
5. Society Admin creates Users in their Society
   ↓
6. Users can login and access their account
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run seed:superadmin` | Create initial superadmin |

---

## API Endpoints Summary

### Authentication (No auth required)
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### SuperAdmin Only
- `POST /api/superadmin/societies` - Create society
- `GET /api/superadmin/societies` - List all societies
- `GET /api/superadmin/societies/:id` - Get society details
- `POST /api/superadmin/admins` - Create society admin
- `PATCH /api/superadmin/users/:id/toggle-status` - Toggle user status

### Society Admin Only
- `GET /api/admin/society` - Get my society
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - List users in my society
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user status

---

## Common Issues

**MongoDB connection failed?**
- Check MongoDB is running: `brew services list`
- Verify `MONGODB_URI` in `.env`

**Invalid token error?**
- Token expires in 15 minutes
- Use `/api/auth/refresh` to get new token

**Forbidden error?**
- Check you're using correct role's token
- SuperAdmin endpoints need superadmin token
- Admin endpoints need society_admin token

---

For detailed documentation, see [README.md](./README.md)
