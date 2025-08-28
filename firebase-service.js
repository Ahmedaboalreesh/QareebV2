// Firebase Service - Main Database Service for Car Rental Platform
// This service replaces localStorage and handles all data operations

class FirebaseService {
    constructor() {
        this.db = null;
        this.auth = null;
        this.storage = null;
        this.currentUser = null;
        this.init();
    }

    // Initialize Firebase
    async init() {
        try {
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK not loaded');
            }

            // Initialize Firebase if not already initialized
            if (!firebase.apps.length) {
                const firebaseConfig = {
                    apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
                    authDomain: "qareeb-aba0c.firebaseapp.com",
                    databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
                    projectId: "qareeb-aba0c",
                    storageBucket: "qareeb-aba0c.appspot.com",
                    messagingSenderId: "1234567890",
                    appId: "1:1234567890:web:abcdef123456"
                };
                
                try {
                    firebase.initializeApp(firebaseConfig);
                    console.log('✅ Firebase initialized with config');
                } catch (initError) {
                    console.error('❌ Firebase initialization error:', initError);
                    throw initError;
                }
            }

            this.db = firebase.database();
            this.auth = firebase.auth();
            this.storage = firebase.storage();

            console.log('🔥 Firebase Service initialized successfully');
            
            // Set up auth state listener
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            });

        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            throw error;
        }
    }

    // ==================== AUTHENTICATION ====================

    // Register new user
    async registerUser(userData) {
        try {
            console.log('🔄 Starting user registration for:', userData.email);
            
            // Validate required fields
            if (!userData.email || !userData.password || !userData.full_name) {
                throw new Error('Missing required fields: email, password, or full_name');
            }

            // Create Firebase Auth user
            console.log('🔄 Creating Firebase Auth user...');
            const userCredential = await this.auth.createUserWithEmailAndPassword(
                userData.email, 
                userData.password
            );

            const user = userCredential.user;
            console.log('✅ Firebase Auth user created:', user.uid);

            // Store additional user data in Realtime Database
            const userProfile = {
                uid: user.uid,
                email: userData.email,
                full_name: userData.full_name,
                phone: userData.phone || '',
                city: userData.city || '',
                user_type: userData.user_type || 'renter', // 'renter' or 'owner'
                created_at: new Date().toISOString(),
                is_active: true,
                profile_photo: userData.profile_photo || null,
                newsletter: userData.newsletter || false
            };

            console.log('🔄 Saving user profile to database...');
            await this.db.ref(`users/${user.uid}`).set(userProfile);
            console.log('✅ User profile saved to database');

            console.log('✅ User registered successfully:', user.uid);
            return { user, profile: userProfile };

        } catch (error) {
            console.error('❌ Registration failed:', error);
            
            // Log specific error details
            if (error.code) {
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
            }
            
            throw error;
        }
    }

    // Login user
    async loginUser(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Get user profile from database
            const snapshot = await this.db.ref(`users/${user.uid}`).once('value');
            const profile = snapshot.val();

            if (!profile) {
                throw new Error('User profile not found');
            }

            console.log('✅ User logged in successfully:', user.uid);
            return { user, profile };

        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    }

    // Logout user
    async logoutUser() {
        try {
            await this.auth.signOut();
            this.currentUser = null;
            console.log('✅ User logged out successfully');
        } catch (error) {
            console.error('❌ Logout failed:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get current user profile
    async getCurrentUserProfile() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const snapshot = await this.db.ref(`users/${this.currentUser.uid}`).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            await this.db.ref(`users/${this.currentUser.uid}`).update({
                ...updates,
                updated_at: new Date().toISOString()
            });

            console.log('✅ User profile updated successfully');
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            throw error;
        }
    }

    // ==================== CARS MANAGEMENT ====================

    // Create new car
    async createCar(carData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const carRef = this.db.ref('cars');
            const newCarRef = carRef.push();

            const car = {
                id: newCarRef.key,
                owner_id: this.currentUser.uid,
                ...carData,
                created_at: new Date().toISOString(),
                is_available: true,
                status: 'active'
            };

            await newCarRef.set(car);

            console.log('✅ Car created successfully:', newCarRef.key);
            return car;

        } catch (error) {
            console.error('❌ Error creating car:', error);
            throw error;
        }
    }

    // Get all cars
    async getAllCars() {
        try {
            const snapshot = await this.db.ref('cars').once('value');
            const cars = snapshot.val();

            if (cars) {
                return Object.keys(cars).map(key => ({
                    id: key,
                    ...cars[key]
                }));
            }

            return [];

        } catch (error) {
            console.error('❌ Error getting cars:', error);
            throw error;
        }
    }

    // Get cars by owner
    async getCarsByOwner(ownerId = null) {
        try {
            const userId = ownerId || this.currentUser?.uid;
            if (!userId) {
                throw new Error('No user ID provided');
            }

            const snapshot = await this.db.ref('cars')
                .orderByChild('owner_id')
                .equalTo(userId)
                .once('value');

            const cars = snapshot.val();

            if (cars) {
                return Object.keys(cars).map(key => ({
                    id: key,
                    ...cars[key]
                }));
            }

            return [];

        } catch (error) {
            console.error('❌ Error getting cars by owner:', error);
            throw error;
        }
    }

    // Get car by ID
    async getCarById(carId) {
        try {
            const snapshot = await this.db.ref(`cars/${carId}`).once('value');
            const car = snapshot.val();

            if (car) {
                return { id: carId, ...car };
            }

            return null;

        } catch (error) {
            console.error('❌ Error getting car:', error);
            throw error;
        }
    }

    // Update car
    async updateCar(carId, updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            await this.db.ref(`cars/${carId}`).update({
                ...updates,
                updated_at: new Date().toISOString()
            });

            console.log('✅ Car updated successfully:', carId);

        } catch (error) {
            console.error('❌ Error updating car:', error);
            throw error;
        }
    }

    // Delete car
    async deleteCar(carId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            await this.db.ref(`cars/${carId}`).remove();
            console.log('✅ Car deleted successfully:', carId);

        } catch (error) {
            console.error('❌ Error deleting car:', error);
            throw error;
        }
    }

    // ==================== BOOKINGS MANAGEMENT ====================

    // Create new booking
    async createBooking(bookingData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const bookingRef = this.db.ref('bookings');
            const newBookingRef = bookingRef.push();

            const booking = {
                id: newBookingRef.key,
                renter_id: this.currentUser.uid,
                ...bookingData,
                created_at: new Date().toISOString(),
                status: 'pending'
            };

            await newBookingRef.set(booking);

            console.log('✅ Booking created successfully:', newBookingRef.key);
            return booking;

        } catch (error) {
            console.error('❌ Error creating booking:', error);
            throw error;
        }
    }

    // Get bookings by user
    async getBookingsByUser(userType = 'renter') {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
            const snapshot = await this.db.ref('bookings')
                .orderByChild(queryField)
                .equalTo(this.currentUser.uid)
                .once('value');

            const bookings = snapshot.val();

            if (bookings) {
                return Object.keys(bookings).map(key => ({
                    id: key,
                    ...bookings[key]
                }));
            }

            return [];

        } catch (error) {
            console.error('❌ Error getting bookings:', error);
            throw error;
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            await this.db.ref(`bookings/${bookingId}`).update({
                status: status,
                updated_at: new Date().toISOString()
            });

            console.log('✅ Booking status updated:', bookingId, status);

        } catch (error) {
            console.error('❌ Error updating booking status:', error);
            throw error;
        }
    }

    // ==================== PHOTOS MANAGEMENT ====================

    // Upload car photo
    async uploadCarPhoto(carId, file) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const fileName = `cars/${carId}/${Date.now()}_${file.name}`;
            const storageRef = this.storage.ref().child(fileName);
            
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            // Save photo reference to database
            const photoRef = this.db.ref('car_photos');
            const newPhotoRef = photoRef.push();

            const photoData = {
                id: newPhotoRef.key,
                car_id: carId,
                url: downloadURL,
                filename: fileName,
                uploaded_by: this.currentUser.uid,
                created_at: new Date().toISOString()
            };

            await newPhotoRef.set(photoData);

            console.log('✅ Car photo uploaded successfully:', downloadURL);
            return photoData;

        } catch (error) {
            console.error('❌ Error uploading car photo:', error);
            throw error;
        }
    }

    // Get car photos
    async getCarPhotos(carId) {
        try {
            const snapshot = await this.db.ref('car_photos')
                .orderByChild('car_id')
                .equalTo(carId)
                .once('value');

            const photos = snapshot.val();

            if (photos) {
                return Object.keys(photos).map(key => ({
                    id: key,
                    ...photos[key]
                }));
            }

            return [];

        } catch (error) {
            console.error('❌ Error getting car photos:', error);
            throw error;
        }
    }

    // Delete car photo
    async deleteCarPhoto(photoId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            // Get photo data first
            const snapshot = await this.db.ref(`car_photos/${photoId}`).once('value');
            const photo = snapshot.val();

            if (!photo) {
                throw new Error('Photo not found');
            }

            // Delete from storage
            const storageRef = this.storage.ref().child(photo.filename);
            await storageRef.delete();

            // Delete from database
            await this.db.ref(`car_photos/${photoId}`).remove();

            console.log('✅ Car photo deleted successfully:', photoId);

        } catch (error) {
            console.error('❌ Error deleting car photo:', error);
            throw error;
        }
    }

    // ==================== NOTIFICATIONS ====================

    // Create notification
    async createNotification(notificationData) {
        try {
            const notificationRef = this.db.ref('notifications');
            const newNotificationRef = notificationRef.push();

            const notification = {
                id: newNotificationRef.key,
                ...notificationData,
                created_at: new Date().toISOString(),
                is_read: false
            };

            await newNotificationRef.set(notification);

            console.log('✅ Notification created successfully:', newNotificationRef.key);
            return notification;

        } catch (error) {
            console.error('❌ Error creating notification:', error);
            throw error;
        }
    }

    // Get user notifications
    async getUserNotifications(userId) {
        try {
            const snapshot = await this.db.ref('notifications')
                .orderByChild('user_id')
                .equalTo(userId)
                .once('value');

            const notifications = snapshot.val();

            if (notifications) {
                return Object.keys(notifications).map(key => ({
                    id: key,
                    ...notifications[key]
                }));
            }

            return [];

        } catch (error) {
            console.error('❌ Error getting notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId) {
        try {
            await this.db.ref(`notifications/${notificationId}`).update({
                is_read: true,
                read_at: new Date().toISOString()
            });

            console.log('✅ Notification marked as read:', notificationId);

        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            throw error;
        }
    }

    // ==================== REAL-TIME LISTENERS ====================

    // Listen to user data changes
    onUserDataChange(userId, callback) {
        return this.db.ref(`users/${userId}`).on('value', (snapshot) => {
            const userData = snapshot.val();
            callback(userData ? { id: userId, ...userData } : null);
        });
    }

    // Listen to cars changes
    onCarsChange(callback) {
        return this.db.ref('cars').on('value', (snapshot) => {
            const cars = snapshot.val();
            if (cars) {
                const carsArray = Object.keys(cars).map(key => ({
                    id: key,
                    ...cars[key]
                }));
                callback(carsArray);
            } else {
                callback([]);
            }
        });
    }

    // Listen to bookings changes
    onBookingsChange(userId, userType, callback) {
        const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
        const query = this.db.ref('bookings').orderByChild(queryField).equalTo(userId);
        
        return query.on('value', (snapshot) => {
            const bookings = snapshot.val();
            if (bookings) {
                const bookingsArray = Object.keys(bookings).map(key => ({
                    id: key,
                    ...bookings[key]
                }));
                callback(bookingsArray);
            } else {
                callback([]);
            }
        });
    }

    // Listen to notifications changes
    onNotificationsChange(userId, callback) {
        return this.db.ref('notifications')
            .orderByChild('user_id')
            .equalTo(userId)
            .on('value', (snapshot) => {
                const notifications = snapshot.val();
                if (notifications) {
                    const notificationsArray = Object.keys(notifications).map(key => ({
                        id: key,
                        ...notifications[key]
                    }));
                    callback(notificationsArray);
                } else {
                    callback([]);
                }
            });
    }

    // Cleanup listeners
    off(path) {
        this.db.ref(path).off();
    }

    // ==================== UTILITY METHODS ====================

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Get user type
    async getUserType() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const profile = await this.getCurrentUserProfile();
            return profile?.user_type || null;
        } catch (error) {
            console.error('❌ Error getting user type:', error);
            return null;
        }
    }

    // Generate unique ID
    generateId() {
        return this.db.ref().push().key;
    }

    // Format timestamp
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString('ar-SA');
    }
}

// Create global instance
const firebaseService = new FirebaseService();

// Export for use in other files
window.firebaseService = firebaseService;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Firebase Service ready');
});
