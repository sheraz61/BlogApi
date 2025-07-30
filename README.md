# BlogApi - Full Stack Blog Application

A modern blog application built with Node.js, Express, MongoDB, and React. This project features a robust backend API with user authentication, profile management, email verification, and admin functionality.

## 🚀 Features

### User Authentication & Management
- **User Registration** - Secure user registration with username/password
- **User Login/Logout** - JWT-based authentication with secure cookie handling
- **Profile Management** - Edit user profiles and manage personal information
- **Account Deletion** - Secure account deletion functionality

### Profile Image Management
- **Upload Profile Image** - Upload and update profile pictures using Cloudinary
- **Delete Profile Image** - Remove profile images with cloud storage cleanup
- **Image Storage** - Secure cloud-based image storage with public_id tracking

### Email Verification System
- **Email Addition** - Add email addresses to user accounts
- **Email Verification** - Secure email verification with OTP codes
- **Email Change** - Change email addresses with verification process
- **Verification Cancellation** - Cancel pending email verification processes

### Password Management
- **Password Change** - Secure password change for authenticated users
- **Forgot Password** - Password reset functionality with email verification
- **Password Reset Verification** - OTP-based password reset verification
- **Reset Cancellation** - Cancel pending password reset processes

### Admin Features
- **Admin Dashboard** - Overview of users, verified users, and posts
- **Admin Authentication** - Role-based access control for admin functions

### Security Features
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **CORS Configuration** - Cross-origin resource sharing setup
- **Input Validation** - Request validation and sanitization
- **Rate Limiting** - Protection against brute force attacks

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Nodemailer** - Email sending functionality
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Development server with auto-restart
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
BlogApi/
├── Backend/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── package.json           # Backend dependencies
│   ├── config/
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── controllers/
│   │   ├── user.controller.js # User-related operations
│   │   └── admin.controller.js # Admin operations
│   ├── db/
│   │   └── index.js           # Database connection
│   ├── middlewares/
│   │   ├── auth.js            # JWT authentication middleware
│   │   ├── isAdmin.js         # Admin role verification
│   │   └── multer.js          # File upload middleware
│   ├── models/
│   │   └── user.model.js      # User data model
│   ├── routes/
│   │   ├── user.routes.js     # User API endpoints
│   │   └── admin.routes.js    # Admin API endpoints
│   └── utils/
│       └── sendEmail.js       # Email utility functions
└── Frontend/                  # React frontend (in development)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Gmail account for email functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BlogApi
   ```

2. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the Backend directory:
   ```env
   PORT=9000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MAIL_USER=your_gmail_address
   MAIL_PASS=your_gmail_app_password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:9000`

## 📡 API Endpoints

### User Routes (`/api/v1/user`)

#### Authentication
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

#### Profile Management
- `GET /profile` - Get user profile
- `PUT /edit-profile` - Edit user profile
- `POST /upload-profile` - Upload profile image
- `PUT /update-profile-image` - Update profile image
- `DELETE /delete-profile` - Delete profile image
- `DELETE /delete` - Delete user account

#### Email Management
- `POST /add-email` - Add email to account
- `GET /verify-email` - Verify email with OTP
- `POST /change-email` - Change email address
- `GET /cancel-email` - Cancel email verification

#### Password Management
- `POST /change-password` - Change password
- `POST /forget-password` - Initiate password reset
- `POST /verify-forget-password` - Verify password reset
- `POST /cancel-forget` - Cancel password reset

### Admin Routes (`/api/v1/admin`)
- `GET /dashboard` - Admin dashboard statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid token in the request headers or cookies.

### Token Format
```
Authorization: Bearer <token>
```

## 📧 Email Features

The application includes comprehensive email functionality:
- Email verification with OTP codes
- Password reset emails
- Secure email change process
- Configurable email templates

## 🖼️ Image Upload

Profile images are stored using Cloudinary:
- Automatic image optimization
- Secure cloud storage
- Public ID tracking for cleanup
- Support for multiple image formats

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Request data validation
- **CORS Protection**: Configured cross-origin requests
- **Rate Limiting**: Protection against abuse
- **Secure Cookies**: HTTP-only cookies for token storage

## 🚧 Development Status

### ✅ Completed Features
- User authentication system
- Profile management
- Email verification system
- Password reset functionality
- Image upload and management
- Admin dashboard structure
- Database models and schemas
- API route structure

### 🚧 In Progress
- Frontend development
- Blog post functionality
- Advanced admin features
- User roles and permissions

### 📋 Planned Features
- Blog post creation and management
- Comment system
- User following system
- Advanced search functionality
- Real-time notifications
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sheraz Hussain**

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a work in progress. The frontend is currently under development, and additional features are being added regularly.