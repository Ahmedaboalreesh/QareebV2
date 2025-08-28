# 🔥 Firebase Integration Setup Guide

This guide will help you set up Firebase Realtime Database and Storage for the car rental platform.

## Prerequisites

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Firebase Account**
   - Create account at [firebase.google.com](https://firebase.google.com/)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `qareeb-aba0c` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Enable Realtime Database
1. In Firebase Console, go to "Realtime Database"
2. Click "Create database"
3. Choose location (preferably close to your users)
4. Start in test mode (we'll secure it later)
5. Click "Done"

### Enable Storage
1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose location (same as database)
4. Start in test mode
5. Click "Done"

## Step 3: Get Service Account Credentials

1. In Firebase Console, go to Project Settings (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely
5. **Important**: Never commit this file to version control

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in the Firebase credentials from the JSON file:

```env
# Firebase Configuration
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@qareeb-aba0c.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40qareeb-aba0c.iam.gserviceaccount.com
```

## Step 5: Install Dependencies

```bash
npm install
```

This will install:
- `firebase` - Firebase client SDK
- `firebase-admin` - Firebase admin SDK
- Other project dependencies

## Step 6: Initialize Firebase Database

```bash
npm run init-firebase
```

This creates the initial database structure:
- `users` - User accounts
- `cars` - Car listings
- `car_photos` - Car photos metadata
- `bookings` - Booking records
- `activities` - User activities

## Step 7: Start the Application

```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Step 8: Test the Integration

1. Open `http://localhost:3000`
2. Register a new account
3. Add a car with photos
4. Check Firebase Console to see data being saved

## Database Structure

### Users Collection
```json
{
  "users": {
    "userId1": {
      "id": "userId1",
      "full_name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+966501234567",
      "city": "الرياض",
      "password_hash": "hashed_password",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Cars Collection
```json
{
  "cars": {
    "carId1": {
      "id": "carId1",
      "user_id": "userId1",
      "brand": "تويوتا",
      "model": "كامري",
      "year": 2022,
      "color": "أبيض",
      "type": "سيدان",
      "transmission": "أوتوماتيك",
      "fuel_type": "بنزين",
      "mileage": 50000,
      "daily_rate": 200,
      "weekly_rate": 1200,
      "monthly_rate": 4500,
      "deposit": 1000,
      "available_from": "2024-01-01",
      "available_to": "2024-12-31",
      "location": "الرياض",
      "pickup_location": "مطار الملك خالد",
      "description": "سيارة ممتازة للاستئجار",
      "features": ["مكيف", "GPS", "بلوتوث"],
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Car Photos Collection
```json
{
  "car_photos": {
    "photoId1": {
      "id": "photoId1",
      "car_id": "carId1",
      "filename": "car-1234567890.jpg",
      "original_name": "car-front.jpg",
      "file_size": 1024000,
      "mime_type": "image/jpeg",
      "download_url": "https://firebasestorage.googleapis.com/...",
      "storage_path": "car-photos/carId1/car-1234567890.jpg",
      "upload_date": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Security Rules

### Realtime Database Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "cars": {
      ".read": true,
      ".write": "auth != null"
    },
    "car_photos": {
      ".read": true,
      ".write": "auth != null"
    },
    "bookings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "activities": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /car-photos/{carId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**
   - Check that Firebase credentials are correct in `.env`
   - Verify project ID matches your Firebase project

2. **"Permission denied" error**
   - Check Firebase security rules
   - Ensure database is in test mode for initial setup

3. **"File upload failed" error**
   - Check Storage rules
   - Verify file size limits (5MB max)

4. **"Database connection failed" error**
   - Check internet connection
   - Verify Firebase project is active
   - Check service account permissions

### Debug Mode

Enable debug logging by adding to `.env`:
```env
DEBUG=firebase:*
```

## Migration from SQLite

If migrating from the existing SQLite database:

1. Export data from SQLite
2. Use Firebase Admin SDK to import data
3. Update file paths for photos
4. Test all functionality

## Production Deployment

1. **Secure Firebase Rules**
   - Update database rules for production
   - Set up proper authentication
   - Configure CORS settings

2. **Environment Variables**
   - Use production Firebase project
   - Set secure JWT secret
   - Configure proper CORS origins

3. **Monitoring**
   - Set up Firebase Analytics
   - Monitor database usage
   - Set up alerts for errors

## Support

For issues with Firebase setup:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- Project GitHub Issues

---

**Note**: This setup replaces the local SQLite database with Firebase Realtime Database and Firebase Storage for better scalability and cloud storage capabilities.
