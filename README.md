# Educational Platform Backend

A Node.js backend for an educational platform with AI-powered lesson generation.

## Features

- User authentication and authorization
- Class management for teachers and students
- AI-powered lesson generation using Claude
- Credit system for teachers
- Email verification
- Dashboard with role-based statistics
- Admin panel for system management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Claude API key
- Stripe account (for payments)
- Email service (Gmail SMTP recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd edu-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- MongoDB connection string
- JWT secret
- Email credentials
- Claude API key
- Stripe keys
- Admin credentials

5. Create the admin user:
```bash
npm run seed-admin
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/verify-email/:token` - Verify email
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/updatepassword` - Update password

### Classes
- GET `/api/classes` - Get all classes
- POST `/api/classes` - Create class (Teacher)
- GET `/api/classes/:id` - Get single class
- PUT `/api/classes/:id` - Update class (Teacher)
- DELETE `/api/classes/:id` - Delete class (Teacher)
- POST `/api/classes/join` - Join class (Student)

### Lessons
- GET `/api/lessons` - Get all lessons
- POST `/api/lessons` - Create lesson (Teacher)
- POST `/api/lessons/generate` - Generate AI lesson (Teacher)
- GET `/api/lessons/:id` - Get single lesson
- PUT `/api/lessons/:id` - Update lesson (Teacher)
- DELETE `/api/lessons/:id` - Delete lesson (Teacher)

### Credits
- GET `/api/credits/balance` - Get credit balance (Teacher)
- GET `/api/credits/transactions` - Get transaction history (Teacher)
- POST `/api/credits/purchase` - Purchase credits (Teacher)

### Dashboard
- GET `/api/dashboard/stats` - Get role-based statistics
- GET `/api/dashboard/health` - Get system health (Admin)

## Security Considerations

1. Change the default admin password immediately
2. Use strong JWT secret
3. Enable HTTPS in production
4. Regularly update dependencies
5. Monitor for suspicious activities in the admin dashboard

## License

MIT 