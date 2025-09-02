# Firebase to Supabase Migration Guide

This guide will help you migrate your car rental platform from Firebase to Supabase.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Supabase Database
```bash
npm run init-supabase
```

### 3. Update Your HTML Files
Replace Firebase SDK with Supabase SDK in your HTML files:

**Before (Firebase):**
```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"></script>
```

**After (Supabase):**
```html
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="supabase-client.js"></script>
```

### 4. Update JavaScript Files
Replace Firebase service calls with Supabase service calls:

**Before (Firebase):**
```javascript
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Create user
const userCredential = await auth.createUserWithEmailAndPassword(email, password);
```

**After (Supabase):**
```javascript
// Initialize Supabase
const supabase = window.supabase;

// Create user
const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
});
```

## 📁 File Changes

### New Files Created:
- `supabase-config.js` - Server-side Supabase configuration
- `supabase-service.js` - Client-side Supabase service (replaces firebase-service.js)
- `supabase-client.js` - Browser Supabase client configuration
- `database/supabase-init.js` - Database initialization script

### Files to Update:
- All HTML files: Replace Firebase SDK with Supabase SDK
- All JavaScript files: Replace Firebase service calls with Supabase service calls
- `package.json`: Updated dependencies

### Files to Remove (after migration):
- `firebase-config.js`
- `firebase-service.js`
- `firebase-client.js`
- `database/firebase-init.js`

## 🔧 Configuration

### Environment Variables
Create a `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://nhmgolhyebehkmvlutir.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Database Connection
The database connection string is:
```
postgresql://postgres:aass1122@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres
```

## 📊 Database Schema

The migration creates the following tables:

1. **profiles** - User profiles and information
2. **cars** - Car listings and details
3. **car_photos** - Car images and photos
4. **bookings** - Rental bookings and reservations
5. **notifications** - User notifications
6. **reviews** - Car reviews and ratings
7. **payments** - Payment transactions

## 🔐 Authentication

### User Registration
```javascript
// Before (Firebase)
const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

// After (Supabase)
const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
});
```

### User Login
```javascript
// Before (Firebase)
const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

// After (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
});
```

### User Logout
```javascript
// Before (Firebase)
await firebase.auth().signOut();

// After (Supabase)
await supabase.auth.signOut();
```

## 🗄️ Database Operations

### Reading Data
```javascript
// Before (Firebase)
const snapshot = await db.ref('cars').once('value');
const cars = snapshot.val();

// After (Supabase)
const { data: cars, error } = await supabase
    .from('cars')
    .select('*');
```

### Writing Data
```javascript
// Before (Firebase)
await db.ref('cars').push(carData);

// After (Supabase)
const { data, error } = await supabase
    .from('cars')
    .insert(carData);
```

### Updating Data
```javascript
// Before (Firebase)
await db.ref(`cars/${carId}`).update(updates);

// After (Supabase)
const { error } = await supabase
    .from('cars')
    .update(updates)
    .eq('id', carId);
```

### Deleting Data
```javascript
// Before (Firebase)
await db.ref(`cars/${carId}`).remove();

// After (Supabase)
const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', carId);
```

## 📸 File Storage

### Upload Files
```javascript
// Before (Firebase)
const storageRef = storage.ref().child(fileName);
const snapshot = await storageRef.put(file);
const downloadURL = await snapshot.ref.getDownloadURL();

// After (Supabase)
const { data, error } = await supabase.storage
    .from('car-photos')
    .upload(fileName, file);

const { data: urlData } = supabase.storage
    .from('car-photos')
    .getPublicUrl(fileName);
```

## 🔔 Real-time Updates

### Listen to Changes
```javascript
// Before (Firebase)
db.ref('cars').on('value', (snapshot) => {
    const cars = snapshot.val();
    callback(cars);
});

// After (Supabase)
supabase
    .channel('cars')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cars' },
        (payload) => {
            // Handle changes
        }
    )
    .subscribe();
```

## 🚨 Common Issues & Solutions

### 1. Authentication Errors
- Ensure your Supabase anon key is correct
- Check that Row Level Security (RLS) policies are properly configured

### 2. Database Connection Issues
- Verify the connection string is correct
- Check that your IP is allowed in Supabase dashboard

### 3. CORS Issues
- Configure CORS settings in your Supabase dashboard
- Ensure your domain is in the allowed origins

### 4. RLS Policy Errors
- Review and update Row Level Security policies
- Test policies with different user roles

## 📋 Migration Checklist

- [ ] Install Supabase dependencies
- [ ] Initialize Supabase database
- [ ] Update HTML files to use Supabase SDK
- [ ] Replace Firebase service calls with Supabase calls
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test file uploads
- [ ] Test real-time updates
- [ ] Remove Firebase dependencies
- [ ] Update environment variables
- [ ] Test all features thoroughly

## 🆘 Support

If you encounter issues during migration:

1. Check the Supabase documentation: https://supabase.com/docs
2. Review the browser console for error messages
3. Check the server logs for backend errors
4. Verify your Supabase project settings

## 🎯 Benefits of Migration

- **Better Performance**: PostgreSQL is more performant than Firebase Realtime Database
- **SQL Support**: Full SQL capabilities for complex queries
- **Better Scalability**: PostgreSQL handles large datasets better
- **Cost Effective**: Often more cost-effective for production applications
- **Open Source**: PostgreSQL is open source and widely supported
- **Better Data Integrity**: ACID compliance and constraints

## 🔄 Rollback Plan

If you need to rollback to Firebase:

1. Keep your Firebase configuration files
2. Restore Firebase dependencies in package.json
3. Replace Supabase service calls with Firebase calls
4. Test thoroughly before deploying

---

**Note**: This migration maintains the same API structure, so your existing UI code should work with minimal changes. The main changes are in the service layer and database operations.
