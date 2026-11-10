# 🚀 InternLead - Quick Reference Card

## ⚡ 2-Minute Setup

```bash
# 1. Create database
psql -U postgres
CREATE DATABASE internlead;
\q

# 2. Backend (Terminal 1)
cd backend
npm install
npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
npm run dev

# 3. Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

---

## 🔗 Access URLs

| What | URL |
|------|-----|
| **Student Registration** | http://localhost:5173/register |
| **Admin Login** | http://localhost:5173/admin/login |
| **API** | http://localhost:5000 |
| **API Health** | http://localhost:5000/health |

---

## 🔑 Demo Credentials

```
Email:    admin@example.com
Password: Admin@123
```

⚠️ Change after first login!

---

## 📁 Key Files

| File | Location | Purpose |
|------|----------|---------|
| **Database Schema** | `backend/prisma/schema.prisma` | Database structure |
| **Backend ENV** | `backend/.env` | Backend config |
| **Frontend ENV** | `frontend/.env` | Frontend config |
| **API Routes** | `backend/src/routes/` | All API endpoints |
| **Pages** | `frontend/src/pages/` | All UI pages |

---

## 🔧 Common Commands

### Backend
```bash
cd backend

npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production
npm run prisma:studio    # View database GUI
npm run prisma:seed      # Reset & seed database
```

### Frontend
```bash
cd frontend

npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## 📊 Database

### Tables
- `admins` - Admin users
- `students` - Student registrations
- `interests` - Available interests
- `student_interests` - Student-Interest mapping
- `campaigns` - QR campaigns
- `qr_codes` - QR code data
- `lead_notes` - Admin notes
- `lead_status_history` - Status changes

### Ports
- Backend: `5000`
- Frontend: `5173`
- Database: `5432`

---

## 🎯 User Flows

### Student Registration
1. Scan QR code or visit URL
2. Fill registration form
3. Select interests
4. Submit
5. See success page

### Admin Workflow
1. Login to dashboard
2. View statistics
3. Manage students
4. Update status
5. Add notes
6. Export data
7. Create campaigns
8. Generate QR codes

---

## 📱 Features Quick List

✅ Student registration  
✅ QR campaign tracking  
✅ Admin dashboard  
✅ Lead management  
✅ Status tracking  
✅ Notes system  
✅ CSV export  
✅ WhatsApp integration  
✅ Search & filters  
✅ Mobile responsive  

---

## 🐛 Quick Fixes

### Can't connect to database?
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in backend/.env
```

### Port already in use?
```bash
# Change in backend/.env:
PORT=5001

# Update in frontend/.env:
VITE_API_URL=http://localhost:5001/api
```

### Reset everything?
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

---

## 📖 Documentation

| Doc | What's Inside |
|-----|---------------|
| **START_HERE.md** | 5-min setup guide |
| **README.md** | Complete docs |
| **SETUP.md** | Detailed setup |
| **DEPLOYMENT.md** | Deploy to production |
| **FEATURES.md** | All 150+ features |
| **PROJECT_SUMMARY.md** | Feature checklist |

---

## 🎨 Customization Points

### Branding
- Company name: `frontend/src/utils/constants.ts`
- Colors: `frontend/tailwind.config.js`
- Logo: Add to `frontend/public/`

### Features
- Interests: `backend/prisma/seed.ts`
- Courses: `frontend/src/utils/constants.ts`
- Lead Statuses: `frontend/src/utils/constants.ts`

### Messages
- Success message: Database `settings` table
- WhatsApp template: Database `settings` table
- Email: Admin profile

---

## 🔐 Security Checklist

- [ ] Changed admin password
- [ ] Updated JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Updated FRONTEND_URL
- [ ] Enabled HTTPS
- [ ] Configured rate limits
- [ ] Setup backups

---

## 📈 Key Metrics

| Metric | Value |
|--------|-------|
| Total Files | 80+ |
| Lines of Code | 5,000+ |
| Components | 20+ |
| API Endpoints | 20+ |
| Features | 150+ |

---

## ✅ Status: COMPLETE

- ✅ Backend complete
- ✅ Frontend complete
- ✅ Database setup
- ✅ Authentication working
- ✅ All features working
- ✅ Docs complete
- ✅ Ready for deployment

---

## 🚀 Production Checklist

- [ ] Run `npm run build` for both
- [ ] Setup production database
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test QR code flow
- [ ] Test admin dashboard
- [ ] Setup monitoring
- [ ] Configure backups

---

## 💡 Pro Tips

1. Use Prisma Studio to view data: `npm run prisma:studio`
2. Check backend health: `curl http://localhost:5000/health`
3. Test API with Postman or Thunder Client
4. Use browser DevTools for frontend debugging
5. Check console for errors
6. Export data regularly for backups

---

## 📞 Need Help?

1. Check **START_HERE.md** first
2. Read **README.md** for details
3. Check error messages
4. Verify .env files
5. Ensure PostgreSQL is running
6. Check ports are free

---

## 🎯 Test Checklist

- [ ] Register a student
- [ ] Login as admin
- [ ] View dashboard stats
- [ ] Search students
- [ ] Update lead status
- [ ] Add a note
- [ ] Create campaign
- [ ] Generate QR code
- [ ] Export CSV
- [ ] Click WhatsApp

All working? You're ready! 🎉

---

## 📱 QR Code Workflow

```
Create Campaign → Generate QR → Print/Share
        ↓
Student Scans QR → Fills Form → Submits
        ↓
Appears in Dashboard → Admin Contacts
        ↓
Update Status → Add Notes → Track Progress
        ↓
Export Data → Analyze → Improve
```

---

## 🎉 You're All Set!

Save this card for quick reference.

**Happy Lead Management! 🚀**

---

### Emergency Contacts
- Backend logs: Check terminal running `npm run dev`
- Frontend logs: Check browser console (F12)
- Database: `npm run prisma:studio` (backend folder)
- API test: `http://localhost:5000/health`

---

**InternLead v1.0.0** | Production Ready | August 2026
