# Quick Setup Guide for InternLead

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js (v18+) installed: `node --version`
- ✅ PostgreSQL (v12+) installed: `psql --version`
- ✅ npm installed: `npm --version`

## Quick Start (5 Minutes)

### Step 1: Database Setup (2 minutes)

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE internlead;
\q
```

### Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env file and update:
# DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/internlead?schema=public"

# Run migrations and seed data
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start backend server
npm run dev
```

Backend should now be running on http://localhost:5000

### Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start frontend server
npm run dev
```

Frontend should now be running on http://localhost:5173

## Access the Application

1. **Public Registration Page**: http://localhost:5173/register
2. **Admin Login**: http://localhost:5173/admin/login

### Default Admin Credentials
```
Email: admin@example.com
Password: Admin@123
```

⚠️ **Change this password in production!**

## Verify Everything Works

1. ✅ Open http://localhost:5173/register - Should see registration form
2. ✅ Fill and submit the form - Should see success page
3. ✅ Go to http://localhost:5173/admin/login
4. ✅ Login with admin credentials
5. ✅ You should see the student you just registered in the dashboard!

## Common Issues

### Issue: "Cannot connect to database"
**Solution**: 
- Make sure PostgreSQL is running
- Check DATABASE_URL in backend/.env has correct credentials
- Try: `psql -U postgres` to verify connection

### Issue: "Port 5000 already in use"
**Solution**: 
- Change PORT in backend/.env to another port (e.g., 5001)
- Update VITE_API_URL in frontend/.env accordingly

### Issue: "Module not found" errors
**Solution**: 
- Delete node_modules folder
- Run `npm install` again

### Issue: Prisma errors
**Solution**: 
```bash
cd backend
npx prisma generate
npx prisma migrate reset
npm run prisma:seed
```

## Next Steps

1. **Create a QR Campaign**:
   - Login to admin dashboard
   - Go to "QR Campaigns"
   - Click "Create Campaign"
   - Download the QR code

2. **Test QR Campaign**:
   - Open the registration URL from the campaign
   - Register as a new student
   - Check admin dashboard - the student should be linked to the campaign

3. **Explore Features**:
   - View student details
   - Update lead status
   - Add notes
   - Export data to CSV
   - Use WhatsApp integration

## Development Tips

### View Database Records
```bash
cd backend
npm run prisma:studio
```
This opens a GUI at http://localhost:5555

### Reset Everything
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Check Backend Health
```bash
curl http://localhost:5000/health
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

## Support

If you encounter any issues:
1. Check this SETUP.md file
2. Check README.md for detailed information
3. Verify all prerequisites are installed
4. Check console for error messages

## Success! 🎉

If everything is working:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Database connected and seeded
- ✅ Can register students
- ✅ Can login to admin panel
- ✅ Can see dashboard statistics

You're ready to use InternLead!
