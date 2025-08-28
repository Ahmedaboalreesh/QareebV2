// Firestore Database Service for Car Rental Platform
// This service handles all Firestore operations for cars, bookings, and user profiles

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
  authDomain: "qareeb-aba0c.firebaseapp.com",
  databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
  projectId: "qareeb-aba0c",
  storageBucket: "qareeb-aba0c.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class FirestoreService {
  constructor() {
    this.db = db;
    console.log('🔥 Firestore Service initialized');
  }

  // ==================== USER PROFILES ====================

  // Create or update user profile
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userProfile = {
        ...userData,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };

      await setDoc(userRef, userProfile);
      console.log('✅ User profile created/updated:', userId);
      return userProfile;
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('✅ User profile updated:', userId);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  // Get all users (with optional filters)
  async getAllUsers(filters = {}) {
    try {
      let q = collection(this.db, 'users');
      
      // Apply filters
      if (filters.userType) {
        q = query(q, where('userType', '==', filters.userType));
      }
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters.city) {
        q = query(q, where('city', '==', filters.city));
      }

      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return users;
    } catch (error) {
      console.error('❌ Error getting users:', error);
      throw error;
    }
  }

  // ==================== CARS MANAGEMENT ====================

  // Add a new car
  async addCar(carData) {
    try {
      const carsRef = collection(this.db, 'cars');
      const car = {
        ...carData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAvailable: true,
        status: 'active'
      };

      const docRef = await addDoc(carsRef, car);
      console.log('✅ Car added with ID:', docRef.id);
      return { id: docRef.id, ...car };
    } catch (error) {
      console.error('❌ Error adding car:', error);
      throw error;
    }
  }

  // Get car by ID
  async getCar(carId) {
    try {
      const carRef = doc(this.db, 'cars', carId);
      const carSnap = await getDoc(carRef);

      if (carSnap.exists()) {
        return { id: carSnap.id, ...carSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting car:', error);
      throw error;
    }
  }

  // Update car
  async updateCar(carId, updates) {
    try {
      const carRef = doc(this.db, 'cars', carId);
      await updateDoc(carRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Car updated:', carId);
    } catch (error) {
      console.error('❌ Error updating car:', error);
      throw error;
    }
  }

  // Delete car
  async deleteCar(carId) {
    try {
      const carRef = doc(this.db, 'cars', carId);
      await deleteDoc(carRef);
      console.log('✅ Car deleted:', carId);
    } catch (error) {
      console.error('❌ Error deleting car:', error);
      throw error;
    }
  }

  // Get all cars (with optional filters)
  async getAllCars(filters = {}) {
    try {
      let q = collection(this.db, 'cars');
      
      // Apply filters
      if (filters.ownerId) {
        q = query(q, where('ownerId', '==', filters.ownerId));
      }
      if (filters.isAvailable !== undefined) {
        q = query(q, where('isAvailable', '==', filters.isAvailable));
      }
      if (filters.city) {
        q = query(q, where('city', '==', filters.city));
      }
      if (filters.brand) {
        q = query(q, where('brand', '==', filters.brand));
      }
      if (filters.model) {
        q = query(q, where('model', '==', filters.model));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      // Add ordering
      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const cars = [];
      
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

      return cars;
    } catch (error) {
      console.error('❌ Error getting cars:', error);
      throw error;
    }
  }

  // Get cars by owner
  async getCarsByOwner(ownerId) {
    return this.getAllCars({ ownerId });
  }

  // Get available cars
  async getAvailableCars(filters = {}) {
    return this.getAllCars({ ...filters, isAvailable: true });
  }

  // Search cars
  async searchCars(searchParams) {
    try {
      let q = collection(this.db, 'cars');
      
      // Apply search filters
      if (searchParams.city) {
        q = query(q, where('city', '==', searchParams.city));
      }
      if (searchParams.brand) {
        q = query(q, where('brand', '==', searchParams.brand));
      }
      if (searchParams.model) {
        q = query(q, where('model', '==', searchParams.model));
      }
      if (searchParams.minPrice) {
        q = query(q, where('pricePerDay', '>=', searchParams.minPrice));
      }
      if (searchParams.maxPrice) {
        q = query(q, where('pricePerDay', '<=', searchParams.maxPrice));
      }
      if (searchParams.isAvailable !== undefined) {
        q = query(q, where('isAvailable', '==', searchParams.isAvailable));
      }

      // Add ordering
      q = query(q, orderBy('pricePerDay', 'asc'));

      const querySnapshot = await getDocs(q);
      const cars = [];
      
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });

      return cars;
    } catch (error) {
      console.error('❌ Error searching cars:', error);
      throw error;
    }
  }

  // ==================== BOOKINGS MANAGEMENT ====================

  // Create a new booking
  async createBooking(bookingData) {
    try {
      const bookingsRef = collection(this.db, 'bookings');
      const booking = {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending' // pending, confirmed, completed, cancelled
      };

      const docRef = await addDoc(bookingsRef, booking);
      console.log('✅ Booking created with ID:', docRef.id);
      return { id: docRef.id, ...booking };
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  async getBooking(bookingId) {
    try {
      const bookingRef = doc(this.db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);

      if (bookingSnap.exists()) {
        return { id: bookingSnap.id, ...bookingSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting booking:', error);
      throw error;
    }
  }

  // Update booking
  async updateBooking(bookingId, updates) {
    try {
      const bookingRef = doc(this.db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Booking updated:', bookingId);
    } catch (error) {
      console.error('❌ Error updating booking:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    return this.updateBooking(bookingId, { status });
  }

  // Delete booking
  async deleteBooking(bookingId) {
    try {
      const bookingRef = doc(this.db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
      console.log('✅ Booking deleted:', bookingId);
    } catch (error) {
      console.error('❌ Error deleting booking:', error);
      throw error;
    }
  }

  // Get all bookings (with optional filters)
  async getAllBookings(filters = {}) {
    try {
      let q = collection(this.db, 'bookings');
      
      // Apply filters
      if (filters.renterId) {
        q = query(q, where('renterId', '==', filters.renterId));
      }
      if (filters.carId) {
        q = query(q, where('carId', '==', filters.carId));
      }
      if (filters.ownerId) {
        q = query(q, where('ownerId', '==', filters.ownerId));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      // Add ordering
      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const bookings = [];
      
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return bookings;
    } catch (error) {
      console.error('❌ Error getting bookings:', error);
      throw error;
    }
  }

  // Get bookings by renter
  async getBookingsByRenter(renterId) {
    return this.getAllBookings({ renterId });
  }

  // Get bookings by car owner
  async getBookingsByOwner(ownerId) {
    return this.getAllBookings({ ownerId });
  }

  // Get bookings by car
  async getBookingsByCar(carId) {
    return this.getAllBookings({ carId });
  }

  // Get pending bookings
  async getPendingBookings() {
    return this.getAllBookings({ status: 'pending' });
  }

  // ==================== REAL-TIME LISTENERS ====================

  // Listen to user profile changes
  onUserProfileChange(userId, callback) {
    const userRef = doc(this.db, 'users', userId);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  }

  // Listen to cars changes
  onCarsChange(callback, filters = {}) {
    let q = collection(this.db, 'cars');
    
    // Apply filters
    if (filters.ownerId) {
      q = query(q, where('ownerId', '==', filters.ownerId));
    }
    if (filters.isAvailable !== undefined) {
      q = query(q, where('isAvailable', '==', filters.isAvailable));
    }
    if (filters.city) {
      q = query(q, where('city', '==', filters.city));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });
      callback(cars);
    });
  }

  // Listen to bookings changes
  onBookingsChange(callback, filters = {}) {
    let q = collection(this.db, 'bookings');
    
    // Apply filters
    if (filters.renterId) {
      q = query(q, where('renterId', '==', filters.renterId));
    }
    if (filters.ownerId) {
      q = query(q, where('ownerId', '==', filters.ownerId));
    }
    if (filters.carId) {
      q = query(q, where('carId', '==', filters.carId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      callback(bookings);
    });
  }

  // ==================== UTILITY METHODS ====================

  // Convert Firestore timestamp to Date
  convertTimestamp(timestamp) {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  }

  // Convert Date to Firestore timestamp
  convertToTimestamp(date) {
    if (date instanceof Date) {
      return Timestamp.fromDate(date);
    }
    return date;
  }

  // Generate unique ID
  generateId() {
    return doc(collection(this.db, 'temp')).id;
  }

  // Check if document exists
  async documentExists(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('❌ Error checking document existence:', error);
      return false;
    }
  }

  // Get collection count
  async getCollectionCount(collectionName, filters = {}) {
    try {
      let q = collection(this.db, collectionName);
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        q = query(q, where(key, '==', filters[key]));
      });

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('❌ Error getting collection count:', error);
      throw error;
    }
  }
}

// Create global instance
const firestoreService = new FirestoreService();

// Export for use in other files
export { firestoreService, db };
export default firestoreService;
