// Firebase Client Configuration for Car Rental Platform
// This file provides Firebase Realtime Database integration for client-side usage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", // Replace with your actual API key
  authDomain: "qareeb-aba0c.firebaseapp.com",
  databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
  projectId: "qareeb-aba0c",
  storageBucket: "qareeb-aba0c.appspot.com",
  messagingSenderId: "1234567890", // Replace with actual sender ID
  appId: "1:1234567890:web:abcdef123456" // Replace with actual app ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

// Firebase Database Service Class
class FirebaseService {
  constructor() {
    this.db = database;
    console.log('🔥 Firebase Database initialized');
  }

  // User Management
  async createUser(userData) {
    try {
      const userRef = this.db.ref('users');
      const newUserRef = userRef.push();
      await newUserRef.set({
        ...userData,
        created_at: new Date().toISOString(),
        is_active: true
      });
      return newUserRef.key;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const snapshot = await this.db.ref(`users/${userId}`).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const snapshot = await this.db.ref('users').orderByChild('email').equalTo(email).once('value');
      const users = snapshot.val();
      if (users) {
        const userId = Object.keys(users)[0];
        return { id: userId, ...users[userId] };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      await this.db.ref(`users/${userId}`).update({
        ...updates,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Car Management
  async createCar(carData) {
    try {
      const carRef = this.db.ref('cars');
      const newCarRef = carRef.push();
      await newCarRef.set({
        ...carData,
        created_at: new Date().toISOString(),
        is_available: true
      });
      return newCarRef.key;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  async getCarsByOwner(ownerId) {
    try {
      const snapshot = await this.db.ref('cars').orderByChild('owner_id').equalTo(ownerId).once('value');
      const cars = snapshot.val();
      if (cars) {
        return Object.keys(cars).map(key => ({ id: key, ...cars[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting cars by owner:', error);
      throw error;
    }
  }

  async getAllCars() {
    try {
      const snapshot = await this.db.ref('cars').once('value');
      const cars = snapshot.val();
      if (cars) {
        return Object.keys(cars).map(key => ({ id: key, ...cars[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting all cars:', error);
      throw error;
    }
  }

  async getCarById(carId) {
    try {
      const snapshot = await this.db.ref(`cars/${carId}`).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error getting car:', error);
      throw error;
    }
  }

  async updateCar(carId, updates) {
    try {
      await this.db.ref(`cars/${carId}`).update({
        ...updates,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  async deleteCar(carId) {
    try {
      await this.db.ref(`cars/${carId}`).remove();
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }

  // Booking Management
  async createBooking(bookingData) {
    try {
      const bookingRef = this.db.ref('bookings');
      const newBookingRef = bookingRef.push();
      await newBookingRef.set({
        ...bookingData,
        created_at: new Date().toISOString(),
        status: 'pending'
      });
      return newBookingRef.key;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookingsByRenter(renterId) {
    try {
      const snapshot = await this.db.ref('bookings').orderByChild('renter_id').equalTo(renterId).once('value');
      const bookings = snapshot.val();
      if (bookings) {
        return Object.keys(bookings).map(key => ({ id: key, ...bookings[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting bookings by renter:', error);
      throw error;
    }
  }

  async getBookingsByOwner(ownerId) {
    try {
      const snapshot = await this.db.ref('bookings').orderByChild('owner_id').equalTo(ownerId).once('value');
      const bookings = snapshot.val();
      if (bookings) {
        return Object.keys(bookings).map(key => ({ id: key, ...bookings[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting bookings by owner:', error);
      throw error;
    }
  }

  async updateBooking(bookingId, updates) {
    try {
      await this.db.ref(`bookings/${bookingId}`).update({
        ...updates,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Notification Management
  async createNotification(notificationData) {
    try {
      const notificationRef = this.db.ref('notifications');
      const newNotificationRef = notificationRef.push();
      await newNotificationRef.set({
        ...notificationData,
        created_at: new Date().toISOString(),
        is_read: false
      });
      return newNotificationRef.key;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getNotificationsByUser(userId) {
    try {
      const snapshot = await this.db.ref('notifications').orderByChild('user_id').equalTo(userId).once('value');
      const notifications = snapshot.val();
      if (notifications) {
        return Object.keys(notifications).map(key => ({ id: key, ...notifications[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      await this.db.ref(`notifications/${notificationId}`).update({
        is_read: true,
        read_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Review Management
  async createReview(reviewData) {
    try {
      const reviewRef = this.db.ref('reviews');
      const newReviewRef = reviewRef.push();
      await newReviewRef.set({
        ...reviewData,
        created_at: new Date().toISOString()
      });
      return newReviewRef.key;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getReviewsByCar(carId) {
    try {
      const snapshot = await this.db.ref('reviews').orderByChild('car_id').equalTo(carId).once('value');
      const reviews = snapshot.val();
      if (reviews) {
        return Object.keys(reviews).map(key => ({ id: key, ...reviews[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting reviews by car:', error);
      throw error;
    }
  }

  // Photo Management
  async createBookingPhoto(photoData) {
    try {
      const photoRef = this.db.ref('booking_photos');
      const newPhotoRef = photoRef.push();
      await newPhotoRef.set({
        ...photoData,
        created_at: new Date().toISOString()
      });
      return newPhotoRef.key;
    } catch (error) {
      console.error('Error creating booking photo:', error);
      throw error;
    }
  }

  async getPhotosByBooking(bookingId) {
    try {
      const snapshot = await this.db.ref('booking_photos').orderByChild('booking_id').equalTo(bookingId).once('value');
      const photos = snapshot.val();
      if (photos) {
        return Object.keys(photos).map(key => ({ id: key, ...photos[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting photos by booking:', error);
      throw error;
    }
  }

  // Payment Management
  async createPayment(paymentData) {
    try {
      const paymentRef = this.db.ref('payments');
      const newPaymentRef = paymentRef.push();
      await newPaymentRef.set({
        ...paymentData,
        created_at: new Date().toISOString(),
        status: 'pending'
      });
      return newPaymentRef.key;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(paymentId, updates) {
    try {
      await this.db.ref(`payments/${paymentId}`).update({
        ...updates,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  // Favorites Management
  async addToFavorites(userId, carId) {
    try {
      const favoriteRef = this.db.ref(`favorites/${userId}/${carId}`);
      await favoriteRef.set({
        added_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  async removeFromFavorites(userId, carId) {
    try {
      await this.db.ref(`favorites/${userId}/${carId}`).remove();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  async getFavoritesByUser(userId) {
    try {
      const snapshot = await this.db.ref(`favorites/${userId}`).once('value');
      const favorites = snapshot.val();
      if (favorites) {
        return Object.keys(favorites).map(carId => ({ car_id: carId, ...favorites[carId] }));
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  }

  // Real-time listeners
  onUserDataChange(userId, callback) {
    return this.db.ref(`users/${userId}`).on('value', (snapshot) => {
      callback(snapshot.val());
    });
  }

  onBookingsChange(userId, userType, callback) {
    const query = userType === 'owner' 
      ? this.db.ref('bookings').orderByChild('owner_id').equalTo(userId)
      : this.db.ref('bookings').orderByChild('renter_id').equalTo(userId);
    
    return query.on('value', (snapshot) => {
      const bookings = snapshot.val();
      if (bookings) {
        const bookingsArray = Object.keys(bookings).map(key => ({ id: key, ...bookings[key] }));
        callback(bookingsArray);
      } else {
        callback([]);
      }
    });
  }

  onNotificationsChange(userId, callback) {
    return this.db.ref('notifications').orderByChild('user_id').equalTo(userId).on('value', (snapshot) => {
      const notifications = snapshot.val();
      if (notifications) {
        const notificationsArray = Object.keys(notifications).map(key => ({ id: key, ...notifications[key] }));
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
}

// Create global instance
const firebaseService = new FirebaseService();

// Export for use in other files
window.firebaseService = firebaseService;

