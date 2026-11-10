# InternLead - Student Internship Registration & QR Lead Management System

A complete, production-ready full-stack web application for managing student leads through QR code-based registration campaigns. Built with React, TypeScript, Node.js, Express, PostgreSQL, and Prisma.

## 🚀 Features

### Public Features
- **Mobile-First Registration**: Beautiful, responsive registration form optimized for mobile devices
- **QR Code Campaigns**: Each campaign has unique QR codes for tracking registration sources
- **Multiple Interests**: Students can select multiple areas of interest
- **Real-time Validation**: Form validation with user-friendly error messages
- **Success Confirmation**: Detailed success page with registration details

### Admin Features
- **Secure Dashboard**: JWT-based authentication with protected routes
- **Analytics Dashboard**: Real-time statistics and insights
  - Total registrations, new leads, contacted, interested, enrolled, rejected
  - Today's, this week's, and this month's registrations
  - Lead status distribution charts
- **Student Management**:
  - View all student registrations
  - Advanced search and filtering (by name, phone, college, status, campaign, date)
  - Detailed student profiles with full information
  - Lead status management (New → Contacted → Interested → Follow Up → Enrolled)
  - Add notes to student profiles
  - Status change history tracking
  - Export to CSV
  - WhatsApp integration for direct contact
- **QR Campaign Management**:
  - Create and manage multiple campaigns
  - Generate unique QR codes for each campaign
  - Track registrations per campaign
  - Campaign performance analytics
  - Download/print QR codes
  - Copy registration URLs
  - Activate/deactivate campaigns

## 🛠️ Technology Stack

### Frontend
- **React** 18+ with TypeScript
- **Vite** for fast development and building
- **React Router** for routing
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Zod** for validation
- **Axios** for API requests
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** as database
- **Prisma ORM** for database management
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-rate-limit** for API protection
- **QRCode** library for QR generation
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd InternLead
```

### 2. Backend Setup

#### a. Install Dependencies

```bash
cd backend
npm install
```

#### b. Configure Environment Variables

Create a `.env` file in the backend directory (or copy `.env.example`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/internlead?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `username` and `password` with your PostgreSQL credentials.

#### c. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE internlead;

# Exit
\q
```

#### d. Run Prisma Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will create all necessary database tables.

#### e. Seed the Database

```bash
npm run prisma:seed
```

This creates:
- 1 Admin user (email: admin@example.com, password: Admin@123)
- Sample interests
- 3 Sample campaigns with QR codes
- 5 Sample student registrations

**⚠️ IMPORTANT**: Change the admin password in production!

### 3. Frontend Setup

#### a. Install Dependencies

```bash
cd ../frontend
npm install
```

#### b. Configure Environment Variables

Create a `.env` file in the frontend directory (or copy `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Access the Application

- **Public Registration**: http://localhost:5173/register
- **Admin Login**: http://localhost:5173/admin/login
- **API Health Check**: http://localhost:5000/health

### Default Admin Credentials (Demo)

```
Email: admin@example.com
Password: Admin@123
```

## 📁 Project Structure

```
InternLead/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seeding script
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Route controllers
│   │   ├── middleware/            # Express middleware
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Server entry point
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI components
│   │   │   ├── layout/            # Layout components
│   │   │   └── admin/             # Admin-specific components
│   │   ├── pages/
│   │   │   ├── public/            # Public pages
│   │   │   └── admin/             # Admin pages
│   │   ├── services/              # API service layer
│   │   ├── context/               # React context (Auth)
│   │   ├── hooks/                 # Custom hooks
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   ├── .env                       # Environment variables
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt for password security
- **Rate Limiting**: Prevents brute force and spam attacks
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS Configuration**: Controlled cross-origin requests
- **Protected Routes**: Authentication required for admin routes
- **Environment Variables**: Sensitive data stored in .env files

## 🗄️ Database Schema

### Main Tables

- **admins**: Admin user accounts
- **students**: Student registrations
- **interests**: Available interests
- **student_interests**: Many-to-many relationship
- **campaigns**: QR campaigns
- **qr_codes**: QR code data for campaigns
- **lead_notes**: Notes added by admins
- **lead_status_history**: Status change tracking
- **settings**: Application settings

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin profile
- `POST /api/auth/logout` - Logout

### Public
- `POST /api/register` - Student registration

### Students (Admin Only)
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `PUT /api/students/:id/status` - Update lead status
- `POST /api/students/:id/notes` - Add note
- `GET /api/export/csv` - Export students to CSV

### Campaigns (Admin Only)
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `PATCH /api/campaigns/:id/toggle-status` - Toggle campaign status
- `GET /api/campaigns/:id/qrcode` - Generate QR code

### Analytics (Admin Only)
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/registrations` - Registrations over time
- `GET /api/analytics/interests` - Interest distribution
- `GET /api/analytics/campaigns` - Campaign performance

## 🚀 Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The build output will be in the `dist` directory. Deploy this to your hosting platform.

## 🌐 Deployment

### Backend Deployment Options
- **Heroku**: Easy deployment with PostgreSQL addon
- **DigitalOcean**: App Platform or Droplet
- **AWS**: EC2 or Elastic Beanstalk
- **Render**: Simple deployment with managed PostgreSQL

### Frontend Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Simple static hosting
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting for static sites

### Environment Variables for Production

**Backend:**
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Update `DATABASE_URL` to production database
- Update `FRONTEND_URL` to production frontend URL

**Frontend:**
- Update `VITE_API_URL` to production API URL

## 📱 QR Code Workflow

1. Admin creates a campaign in the dashboard
2. System generates unique registration URL: `https://your-domain.com/register/campaign-slug`
3. Admin downloads/prints the QR code
4. QR code is placed on posters, banners, or pamphlets
5. Students scan QR code → Registration page opens
6. Student fills form and submits
7. Data appears instantly in Admin Dashboard
8. Admin can track which campaign generated each lead

## 🎯 Lead Management Workflow

1. **New Lead**: Student registers
2. **Contacted**: Admin contacts the student
3. **Interested**: Student shows interest
4. **Follow Up**: Requires follow-up
5. **Enrolled**: Student enrolled in program
6. **Not Interested/Rejected**: Not proceeded

Each status change is tracked with timestamp and admin details.

## 🔄 Maintenance

### View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a GUI to view and edit database records.

### Reset Database

```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure migrations are run: `npm run prisma:migrate`

### Frontend API errors
- Check VITE_API_URL in frontend .env
- Ensure backend is running
- Check CORS settings in backend

### Database connection issues
- Verify PostgreSQL credentials
- Check PostgreSQL is accepting connections
- Try `psql -U postgres` to test connection

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For issues or questions, please create an issue in the repository.

## 🎉 Acknowledgments

Built with modern web technologies for efficient student lead management and QR campaign tracking.

---

**Note**: This is a demo application. For production use:
1. Change all default credentials
2. Implement proper security audits
3. Add comprehensive error handling
4. Set up proper monitoring and logging
5. Implement backup strategies for the database
6. Add SSL/HTTPS for secure connections
7. Implement proper rate limiting based on your needs
8. Add additional validation and sanitization
