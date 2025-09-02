# Firebase Database Guide - Car Rental Platform

## 🎯 Overview

This car rental platform is configured to use **Firebase Realtime Database** as the main database system. The database is hosted at:

**Database URL**: `https://qareeb-aba0c-default-rtdb.firebaseio.com/`  
**Project ID**: `qareeb-aba0c`  
**Project Console**: https://console.firebase.google.com/u/0/project/qareeb-aba0c/database/qareeb-aba0c-default-rtdb/data/~2F

## 🔧 Configuration Files

### 1. Server-side Configuration (`firebase-config.js`)
- Handles server-side Firebase operations
- Includes Firebase Admin SDK for secure server operations
- Manages database, storage, and authentication

### 2. Client-side Configuration (`firebase-client.js`)
- Provides client-side Firebase integration
- Includes comprehensive service class for all database operations
- Handles real-time listeners and data synchronization

## 📊 Database Structure

The Firebase database is organized with the following collections:

```
qareeb-aba0c-default-rtdb/
├── users/                 # User accounts and profiles
├── cars/                  # Car listings and details
├── car_photos/           # Car images and media
├── bookings/             # Rental bookings and reservations
├── activities/           # User activity logs
├── reviews/              # Car reviews and ratings
├── booking_photos/       # Photos related to bookings
├── notifications/        # User notifications
├── payments/             # Payment records and transactions
└── favorites/            # User favorite cars
```

## 🚀 Getting Started

### Prerequisites
1. **Node.js** installed on your system
2. **Firebase credentials** properly configured
3. **Environment variables** set up (see `.env.example`)

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Test Firebase connection**:
   ```bash
   node test-firebase-connection.js
   ```

4. **Initialize database structure** (optional):
   ```bash
   node database/firebase-init.js
   ```

## 🔑 Key Features

### 1. User Management
- User registration and authentication
- Profile management
- User preferences and settings

### 2. Car Management
- Car listing creation and editing
- Photo upload and management
- Availability and pricing management

### 3. Booking System
- Real-time booking creation
- Booking status tracking
- Payment integration

### 4. Real-time Features
- Live notifications
- Real-time booking updates
- Instant messaging capabilities

### 5. Review System
- Car ratings and reviews
- User feedback management
- Rating calculations

## 📱 Usage Examples

### Creating a User
```javascript
const firebaseService = new FirebaseService();
const userId = await firebaseService.createUser({
    full_name: 'Ahmed Alreesh',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    city: 'Riyadh'
});
```

### Adding a Car
```javascript
const carId = await firebaseService.createCar({
    owner_id: userId,
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    daily_rate: 150,
    location: 'Riyadh'
});
```

### Creating a Booking
```javascript
const bookingId = await firebaseService.createBooking({
    car_id: carId,
    renter_id: userId,
    start_date: '2024-01-15',
    end_date: '2024-01-17',
    total_amount: 450
});
```

## 🔒 Security Rules

The Firebase database includes security rules to ensure:
- Users can only access their own data
- Car owners can only manage their own cars
- Booking data is properly protected
- Payment information is secure

## 📈 Monitoring and Analytics

### Firebase Console Features
- **Realtime Database**: View and edit data in real-time
- **Authentication**: Manage user accounts and security
- **Storage**: Handle file uploads and media
- **Analytics**: Track app usage and performance
- **Crashlytics**: Monitor app stability

### Database Monitoring
- Monitor read/write operations
- Track database performance
- Set up alerts for unusual activity
- View usage statistics

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check Firebase configuration
   - Verify API keys and credentials
   - Ensure proper network connectivity

2. **Authentication Errors**
   - Verify Firebase Admin SDK credentials
   - Check environment variables
   - Ensure proper service account setup

3. **Permission Denied**
   - Review Firebase security rules
   - Check user authentication status
   - Verify data access permissions

### Debug Commands
```bash
# Test Firebase connection
node test-firebase-connection.js

# Initialize database structure
node database/firebase-init.js

# Start development server
npm run dev
```

## 📞 Support

For Firebase-related issues:
1. Check Firebase Console for error logs
2. Review Firebase documentation
3. Contact Firebase support if needed

## 🔄 Migration from SQLite

The project includes both SQLite and Firebase configurations. To fully migrate to Firebase:

1. **Data Migration**: Export SQLite data and import to Firebase
2. **Code Updates**: Replace SQLite calls with Firebase service calls
3. **Testing**: Verify all functionality works with Firebase
4. **Deployment**: Update production environment

## 📋 Environment Variables

Required environment variables for Firebase:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=qareeb-aba0c.firebaseapp.com
FIREBASE_DATABASE_URL=https://qareeb-aba0c-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=qareeb-aba0c
FIREBASE_STORAGE_BUCKET=qareeb-aba0c.appspot.com
FIREBASE_MESSAGING_SENDER_ID=1234567890
FIREBASE_APP_ID=1:1234567890:web:abcdef123456

# Firebase Admin SDK
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_client_cert_url
```

## 🎉 Conclusion

The Firebase database is now the main database system for your car rental platform. It provides:

- **Real-time synchronization** across all devices
- **Scalable architecture** for growth
- **Built-in security** and authentication
- **Comprehensive monitoring** and analytics
- **Easy integration** with web and mobile apps

Your platform is ready to handle real-time car rentals with full Firebase integration!
