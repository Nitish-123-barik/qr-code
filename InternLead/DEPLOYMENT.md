# Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend + Database)

#### Backend on Render

1. Create account on [Render.com](https://render.com)
2. Create new PostgreSQL database
   - Copy the Internal Database URL
3. Create new Web Service
   - Connect your Git repository
   - Set build command: `cd backend && npm install && npm run build`
   - Set start command: `cd backend && npm start`
   - Add environment variables:
     ```
     DATABASE_URL=<your-render-postgres-url>
     JWT_SECRET=<generate-strong-secret>
     NODE_ENV=production
     FRONTEND_URL=https://your-app.vercel.app
     PORT=5000
     ```
4. Deploy!

#### Frontend on Vercel

1. Create account on [Vercel.com](https://vercel.com)
2. Import Git repository
3. Set framework preset: Vite
4. Set root directory: `frontend`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Deploy!

### Option 2: Heroku (Full Stack)

#### Backend

```bash
cd backend
heroku create your-app-backend
heroku addons:create heroku-postgresql:mini
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-app-frontend.herokuapp.com
git push heroku main
heroku run npm run prisma:migrate
heroku run npm run prisma:seed
```

#### Frontend

```bash
cd frontend
heroku create your-app-frontend
heroku config:set VITE_API_URL=https://your-app-backend.herokuapp.com/api
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Create App
2. Add two components:
   - Backend (Node.js)
   - Frontend (Static Site)
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

### Option 4: AWS (EC2 + RDS)

#### Setup EC2 Instance

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client
sudo apt-get install postgresql-client

# Clone repository
git clone your-repo-url
cd InternLead

# Setup backend
cd backend
npm install
npm run build

# Setup frontend
cd ../frontend
npm install
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start backend
cd ../backend
pm2 start dist/server.js --name internlead-backend

# Serve frontend with nginx or serve
sudo npm install -g serve
pm2 start "serve -s ../frontend/dist -p 3000" --name internlead-frontend
```

#### Setup RDS (PostgreSQL)
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get connection string
4. Update DATABASE_URL in backend .env

### Option 5: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: internlead
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/internlead
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      FRONTEND_URL: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

## Environment Variables for Production

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/internlead
JWT_SECRET=<STRONG_SECRET_KEY_AT_LEAST_32_CHARS>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Test student registration flow
- [ ] Test admin login
- [ ] Test QR code generation
- [ ] Test campaign creation
- [ ] Test CSV export
- [ ] Test WhatsApp integration
- [ ] Setup database backups
- [ ] Configure SSL/HTTPS
- [ ] Setup monitoring (e.g., Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Setup error logging
- [ ] Configure rate limiting
- [ ] Test on mobile devices
- [ ] Setup analytics (optional)
- [ ] Configure email notifications (optional)

## Database Migrations in Production

```bash
# Run migrations
npm run prisma:migrate

# If needed, reset and seed
npm run prisma:migrate reset
npm run prisma:seed
```

## Backup Strategy

### Automated PostgreSQL Backups

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/internlead_$TIMESTAMP.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

### Schedule with cron
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Health Check Endpoint
The API includes a health check at:
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "InternLead API is running"
}
```

### Recommended Monitoring Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Performance**: New Relic, DataDog
- **Logs**: Logtail, Papertrail

## Scaling Considerations

### Database
- Enable connection pooling
- Add read replicas for heavy read operations
- Implement caching (Redis)
- Index frequently queried fields

### Backend
- Enable clustering for multiple CPU cores
- Implement rate limiting
- Add Redis for session management
- Use load balancer for multiple instances

### Frontend
- Enable CDN for static assets
- Implement code splitting
- Lazy load routes and components
- Enable gzip compression
- Optimize images

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure headers (helmet.js)
- [ ] Implement CSRF protection
- [ ] Enable rate limiting
- [ ] Use strong JWT secrets
- [ ] Sanitize all inputs
- [ ] Keep dependencies updated
- [ ] Use prepared statements (Prisma does this)
- [ ] Implement proper CORS
- [ ] Use environment variables for secrets
- [ ] Regular security audits
- [ ] Implement API versioning

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

## Performance Optimization

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### Frontend
```javascript
// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Image optimization
// Use appropriate image formats (WebP)
// Lazy load images below fold
```

## Troubleshooting Production Issues

### Backend Not Starting
1. Check logs: `pm2 logs` or `heroku logs --tail`
2. Verify DATABASE_URL connection
3. Check NODE_ENV is set to production
4. Verify all dependencies are installed

### Database Connection Issues
1. Check DATABASE_URL format
2. Verify database is accessible from server
3. Check security groups/firewall rules
4. Test connection: `psql $DATABASE_URL`

### Frontend Build Issues
1. Check environment variables
2. Verify API_URL is correct
3. Check for TypeScript errors: `npm run build`
4. Clear cache and rebuild

### CORS Errors
1. Verify FRONTEND_URL in backend .env
2. Check CORS configuration in app.ts
3. Ensure protocol matches (http vs https)

## Maintenance

### Regular Tasks
- Weekly: Review error logs
- Monthly: Update dependencies
- Monthly: Review database size and performance
- Quarterly: Security audit
- Quarterly: Performance review

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update safely
npm update

# For major version updates, test thoroughly
```

## Cost Estimation

### Small Scale (< 1000 users/month)
- Render: Free tier (backend + database)
- Vercel: Free tier (frontend)
- **Total: $0/month**

### Medium Scale (< 10,000 users/month)
- Render: $7/month (backend) + $7/month (database)
- Vercel: Free tier (frontend)
- **Total: ~$14/month**

### Large Scale (> 10,000 users/month)
- DigitalOcean: $12/month (droplet) + $15/month (database)
- Or AWS: Variable based on usage
- **Total: ~$30-100/month**

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test locally in production mode
4. Check platform-specific documentation
5. Review error messages carefully

## Success!

Once deployed, your application will be available 24/7 to:
- ✅ Accept student registrations
- ✅ Track QR campaigns
- ✅ Manage leads
- ✅ Generate analytics

**Happy Deploying! 🚀**
