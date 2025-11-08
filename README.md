# 🚜 FarmX Market - Farming Simulator Mods Platform

A modern MERN stack web application for uploading, browsing, and downloading Farming Simulator game mods. The platform supports both free mods (instant download) and paid mods (contact admin via Instagram/Telegram).

## 🎯 Features

### Core Features
- **Authentication & Authorization**: JWT-based secure login/register with role-based access (User, Admin)
- **Mod Management**: Upload, browse, and download mods with dynamic categories and ratings
- **Mod Request System**: Community-driven mod requests with voting and image support
- **Paid Mod System**: Contact admin via Instagram/Telegram for paid mods (INR currency)
- **Responsive Design**: Glass morphism design with dark theme and scroll-based navbar
- **Search & Filtering**: Real-time search with dynamic category filters
- **Dashboard**: Role-based dashboards with user and admin management

### User Roles
- **User**: Browse, download, upload mods, create mod requests, vote on requests
- **Admin**: Manage users, categories, mod requests, and all user features

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js (ES Modules)
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for file/image storage
- **Nodemailer** for email notifications
- **Multer** for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file storage)
- Email service (Gmail recommended)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```
 
Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmmods
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

4. **Start the server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```
 
Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 📁 Project Structure

```
farmx-market/
├── backend/
│   ├── config/          # Database and service configurations
│   ├── middleware/      # Authentication and upload middleware
│   ├── models/          # MongoDB schemas (User, Mod, Category, ModRequest)
│   ├── routes/          # API routes (auth, mods, categories, modRequests, users)
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file (ES Modules)
└── frontend/
    ├── src/
    │   ├── components/  # Reusable React components
    │   ├── pages/       # Page components (Home, Mods, Dashboard, About, Contact, Help)
    │   ├── store/       # Redux store and slices
    │   ├── utils/       # Utility functions
    │   └── hooks/       # Custom React hooks
    └── public/          # Static assets
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `farmmods`
3. Update `MONGODB_URI` in backend `.env`

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update Cloudinary credentials in backend `.env`

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Update email credentials in backend `.env`

## 🎨 Key Features Implementation

### Authentication Flow
- JWT-based authentication with role-based access control
- Protected routes on both frontend and backend
- Automatic token refresh and logout on expiry

### Mod Management
- File upload with Cloudinary integration (images and mod files)
- Dynamic category system with admin management
- Search and filtering capabilities
- Rating system with user feedback

### Mod Request System
- Community-driven mod requests with descriptions and images
- Voting system for popular requests
- Admin management of request status
- Image upload support for request visualization

### Paid Mod System
- Admin contact via Instagram/Telegram links
- INR currency pricing
- No automated payment processing
- Direct social media communication

### Responsive Design
- Glass morphism design with dark theme default
- Scroll-based navbar with transparency effects
- Mobile-first approach with Tailwind CSS
- Smooth animations with Framer Motion

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update connection string in environment variables
3. Configure network access and database users

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Mods
- `GET /api/mods` - Get all mods (with filters)
- `GET /api/mods/:id` - Get single mod
- `POST /api/mods` - Create new mod (User/Admin)
- `PUT /api/mods/:id` - Update mod (Owner/Admin)
- `DELETE /api/mods/:id` - Delete mod (Owner/Admin)
- `POST /api/mods/:id/download` - Download mod
- `POST /api/mods/:id/rating` - Add rating

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Mod Requests
- `GET /api/modRequests` - Get all mod requests
- `POST /api/modRequests` - Create mod request (User)
- `PUT /api/modRequests/:id` - Update request status (Admin)
- `POST /api/modRequests/:id/vote` - Vote on request (User)
- `DELETE /api/modRequests/:id/vote` - Remove vote (User)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/my-mods` - Get user's mods
- `GET /api/users/dashboard-stats` - Get dashboard statistics
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user role (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Farming Simulator community for inspiration
- React and Node.js communities for excellent documentation
- Tailwind CSS for the amazing utility-first CSS framework

## 🌟 Recent Updates

- **Dynamic Categories**: Admin-managed category system
- **Mod Request Feature**: Community voting system with image support
- **Glass Morphism UI**: Modern dark theme with scroll effects
- **Social Integration**: Instagram/Telegram contact for paid mods
- **Simplified Roles**: User/Admin system (all users can upload mods)
- **Enhanced Navigation**: Scroll-based navbar with footer links

---

**Happy Farming! 🚜**