# Matrimony Web Application

A modern, full-featured matrimony web application built with React, TypeScript, TailwindCSS, and Zustand for state management.

## 🎯 Features Implemented

### 1. **Authentication System**
- Dual role system: Admin and User
- Secure login/logout functionality
- Admin credentials: admin@matrimony.com / admin123
- No public admin signup (only existing admins can create new admins)

### 2. **User Registration**
- Gender-based dynamic forms
- **Male profiles**: Must upload image + income field
- **Female profiles**: No image upload (privacy) + work_status field
- Comprehensive registration with guardian information
- Automatic status set to PENDING after registration

### 3. **Profile Status Workflow**
- **PENDING**: After registration, waiting for admin approval
- **APPROVED**: Can access full platform features
- **REJECTED**: Cannot access system, shown rejection reason
- **UNDER_REVIEW**: When user edits profile, goes back for admin review

### 4. **Admin Panel**
#### Dashboard
- Stats cards showing:
  - Total Users
  - Pending Profiles
  - Approved Profiles
  - Rejected Profiles
- Recent activity feed
- Quick actions

#### User Management
- View all users with search and filter
- Approve/Reject profiles with reason
- View detailed user information
- Delete users
- Status-based filtering

#### Admin Management
- Create new admins
- View admin list
- Delete admins (cannot delete last admin)

### 5. **User Dashboard**
- Browse opposite gender profiles only (males see females, females see males)
- Search by name or city
- City-based filtering
- Card-based profile display showing:
  - Name and age
  - City
  - Education
  - Marital status
- Click to view detailed profile

### 6. **Profile Management**
- View own profile
- Edit profile information
- Editing triggers UNDER_REVIEW status
- Profile under review banner notification
- Complete profile details including:
  - Personal information
  - Contact details
  - Guardian information
  - Education and work details

### 7. **Gender-Based Rules**
- Males can only see female profiles
- Females can only see male profiles
- Male profiles must have images
- Female profiles do not show images (privacy protection)
- Gender-specific fields (income for males, work_status for females)

### 8. **UI/UX Features**
- Modern, app-like interface (NO website-style footers)
- Responsive design (mobile, tablet, desktop)
- Light & Dark theme support
- Smooth animations and transitions
- Sidebar navigation
- Sticky navbar
- Toast notifications for user feedback
- Gradient backgrounds and modern card designs

### 9. **Data Models**
Complete type-safe data structures:
- Admin model
- User model with all required fields
- Enums for status, gender, marital status, work status
- Guardian information
- Address information

### 10. **State Management**
- Zustand store with persistence
- Centralized state management
- localStorage for data persistence
- Reactive updates across components

## 📁 Project Structure

```
/src
├── /app
│   ├── /components
│   │   ├── /admin          # Admin-specific components
│   │   ├── /user           # User-specific components
│   │   ├── /layouts        # Layout components
│   │   └── ThemeProvider.tsx
│   ├── /pages
│   │   ├── /admin          # Admin pages
│   │   ├── /user           # User pages
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── routes.ts           # React Router configuration
│   └── App.tsx             # Main app component
├── /lib
│   ├── types.ts            # TypeScript types and enums
│   └── store.ts            # Zustand state management
└── /styles                 # Global styles
```

## 🚀 Key Technologies

- **React 18** with TypeScript
- **React Router 7** (Data mode)
- **Zustand** for state management
- **TailwindCSS v4** for styling
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Next Themes** for dark mode

## 🎨 Design Principles

1. **App-like Interface**: No website footers, modern dashboard layout
2. **Responsive**: Works on all screen sizes
3. **Accessible**: Proper ARIA labels and semantic HTML
4. **Dark Mode**: Full dark theme support
5. **Smooth UX**: Loading states, transitions, and feedback

## 🔐 Security Features

- Role-based access control
- Protected routes
- Password fields (would use bcrypt in production)
- Input validation
- XSS protection through React
- Proper error handling

## 📊 Status-Based Access Rules

### PENDING Users
- Cannot access dashboard
- Shown waiting screen
- Must wait for admin approval

### APPROVED Users
- Full access to browse profiles
- Can edit own profile
- Can view other profiles

### REJECTED Users
- Cannot access system
- Shown rejection message with reason
- Can contact support

### UNDER_REVIEW Users
- Can still browse profiles
- Shown banner notification
- Waiting for admin re-approval

## 🎯 Admin Capabilities

- View comprehensive statistics
- Manage all user profiles
- Approve/reject with reasons
- Create additional admins
- Delete users and admins
- Search and filter users
- View detailed user information

## 📱 User Experience

- Clean, modern interface
- Easy navigation with sidebar
- Theme toggle in navbar
- Profile cards with key information
- Detailed profile views
- Simple profile editing
- Status notifications

## 🔄 Workflow

1. **User Registration** → Status: PENDING
2. **Admin Reviews** → Approve or Reject
3. **If Approved** → User can access dashboard
4. **User Edits Profile** → Status: UNDER_REVIEW
5. **Admin Re-reviews** → Back to APPROVED

## 🎁 Demo Data

- Pre-configured admin account
- Clean slate for user data
- All stored in localStorage

## 📝 Notes

- This is a frontend-only implementation
- Data persists in localStorage
- For production, integrate with a backend API and database
- Password hashing would be done server-side
- Image uploads would use cloud storage
- Email notifications would be implemented server-side

## 🚀 Getting Started

The application is ready to run. Simply:
1. Open in browser
2. Login with admin credentials or register as a user
3. Explore the features!

**Admin Login**: admin@matrimony.com / admin123

---

Built with ❤️ using modern web technologies
