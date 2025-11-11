# Expense Tracker App

A full-stack expense tracking application built with React, Express, and MySQL.

## Features

- User authentication with JWT tokens
- Add, edit, and delete expenses
- Category-based expense filtering
- Real-time expense analytics dashboard
- Monthly spending summaries
- Responsive design for all devices

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8 or higher)
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure MySQL Database:

Open your MySQL client and ensure the MySQL server is running. The application will create the database automatically.

3. Configure Environment Variables:

Edit the `.env` file in the root directory with your MySQL credentials:

```env
VITE_API_URL=http://localhost:3001/api

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=3001
```

**Important:** Replace `DB_PASSWORD` with your actual MySQL password.

4. Initialize the Database:

```bash
node server/init-db.js
```

This will create the database and tables automatically.

## Running the Application

Start both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend React app on `http://localhost:5173`

## Running Separately

If you want to run the servers separately:

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- fullName (String)
- createdAt, updatedAt (Timestamps)

### Expenses Table
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- title (String)
- amount (Decimal)
- category (String)
- date (Date)
- notes (Text, Optional)
- createdAt, updatedAt (Timestamps)

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/signin` - Login user
- GET `/api/auth/me` - Get current user

### Expenses
- GET `/api/expenses` - Get all user expenses
- POST `/api/expenses` - Create new expense
- PUT `/api/expenses/:id` - Update expense
- DELETE `/api/expenses/:id` - Delete expense

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- bcryptjs (Password Hashing)

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- User data isolation
- SQL injection prevention through Sequelize ORM

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Make sure MySQL server is running
2. Verify your credentials in `.env` file
3. Check if the port 3306 is available
4. Try running `node server/init-db.js` again

### Port Already in Use

If port 3001 or 5173 is already in use:
1. Change the PORT in `.env` for backend
2. Vite will automatically try the next available port for frontend

## License

MIT
