# CBT Attendance Platform

A modern Computer-Based Training (CBT) attendance management system with biometric verification, face recognition, and comprehensive admin controls.

## 🚀 Features

### For Students
- **Biometric Verification** - Secure fingerprint scanning for attendance
- **Face Recognition** - AI-powered contactless attendance marking
- **ID Upload** - Alternative verification method with document upload
- **Real-time Dashboard** - View attendance history and statistics
- **Multiple Authentication Methods** - Support for various verification types

### For Administrators
- **Live Attendance Monitoring** - Real-time view of all attendance records
- **Student Management** - Complete student profile management
- **Analytics & Reporting** - Comprehensive attendance analytics
- **Admin Activity Logs** - Track all administrative actions
- **Secure Authentication** - Protected admin portal with role-based access

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth + Custom Admin System
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: FontAwesome + Lucide React
- **Development**: Vite + Hot Module Replacement

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account (for authentication)
- Modern web browser with camera access (for biometric features)

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGHOST=your_db_host
PGPORT=your_db_port

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### 3. Access the Application

- **Homepage**: http://localhost:5000
- **Student Portal**: http://localhost:5000/login
- **Admin Portal**: http://localhost:5000/admin

### 4. Default Admin Credentials

```
Email: admin@school.edu
Password: admin123

Email: administrator@institution.edu  
Password: admin456

# Or any email with password: admin
```

## 📱 Usage Guide

### Student Attendance

1. **Login/Signup** - Create account or login to student portal
2. **Choose Verification Method**:
   - **Face Scan**: Allow camera access and position face in frame
   - **Fingerprint**: Use device fingerprint scanner (simulated)
   - **ID Upload**: Take photo or upload ID document
3. **Mark Attendance** - Complete verification process
4. **View History** - Check attendance records and statistics

### Admin Dashboard

1. **Login** - Access admin portal with admin credentials
2. **Monitor Attendance** - View real-time attendance records
3. **Manage Students** - Add, edit, or remove student accounts
4. **View Analytics** - Access attendance reports and statistics
5. **Track Activity** - Monitor admin actions and system logs

## 🔧 Development

### Database Operations

```bash
# Push schema changes
npm run db:push

# Force push (if conflicts)
npm run db:push --force

# Generate migrations (if needed)
npx drizzle-kit generate:pg
```

### Project Structure

```
├── client/src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── BiometricCapture.tsx
│   ├── pages/           # Application pages
│   │   ├── Landing.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLogin.tsx
│   ├── lib/             # Utility libraries
│   └── App.tsx          # Main app component
├── server/              # Backend API
│   ├── routes.ts        # API endpoints
│   ├── db.ts           # Database connection
│   └── index.ts        # Server entry point
├── shared/
│   └── schema.ts       # Database schema & types
└── supabase/           # Supabase configuration
```

### Key Components

- **BiometricCapture**: Handles camera access, face recognition, and ID upload
- **AdminDashboard**: Real-time attendance monitoring and student management
- **StudentDashboard**: Student portal with attendance marking capabilities

## 🔒 Security Features

- **Encrypted Biometric Data**: All biometric information is encrypted before storage
- **Role-based Access Control**: Separate admin and student authentication systems
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **CSRF Protection**: Built-in request validation
- **Secure Sessions**: JWT-based authentication with Supabase

## 🌐 Database Schema

### Core Tables

- **students**: Student profiles and biometric data
- **attendance**: Attendance records with verification methods
- **admin_logs**: Administrative action tracking
- **users**: Admin user accounts

### Relationships

- Students → Attendance (One-to-Many)
- Admin Logs → Admin Actions (Tracked relationship)

## 📊 Attendance Methods

1. **Manual**: Traditional manual marking
2. **Face Scan**: AI-powered facial recognition
3. **Biometric**: Fingerprint verification  
4. **ID Upload**: Document verification

## 🚀 Deployment

The application is designed for deployment on Replit with automatic:
- Database provisioning
- Environment variable management
- SSL certificates
- Domain configuration

### Production Checklist

- [ ] Configure production database
- [ ] Set up Supabase production project
- [ ] Update environment variables
- [ ] Test all authentication flows
- [ ] Verify biometric features work
- [ ] Check admin dashboard functionality

## 🐛 Troubleshooting

### Common Issues

**Camera Access Denied**
- Ensure HTTPS connection
- Grant camera permissions in browser
- Check browser compatibility

**Database Connection Errors**
- Verify DATABASE_URL is correct
- Run `npm run db:push` to sync schema
- Check PostgreSQL service status

**Authentication Issues**
- Verify Supabase credentials
- Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Clear browser cache and localStorage

### Performance Tips

- Use Chrome/Firefox for best camera performance
- Ensure good lighting for face recognition
- Clean fingerprint sensor for better biometric readings

## 📈 Future Enhancements

- [ ] Mobile app support
- [ ] Advanced analytics dashboard
- [ ] Integration with Learning Management Systems
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Email notifications
- [ ] Bulk import/export functionality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or feature requests:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ for modern educational institutions**