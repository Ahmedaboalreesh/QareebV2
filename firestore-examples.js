// Firestore Database Examples
// Comprehensive examples for using Firestore with cars, bookings, and user profiles

import firestoreService from './firestore-service.js';

// ==================== USER PROFILES EXAMPLES ====================

// Example 1: Create a new user profile
async function createUserProfileExample() {
  try {
    const userId = 'user123';
    const userData = {
      fullName: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      city: 'الرياض',
      userType: 'renter', // 'renter' or 'owner'
      profilePhoto: 'https://example.com/photo.jpg',
      licenseNumber: '123456789',
      isVerified: false
    };

    const userProfile = await firestoreService.createUserProfile(userId, userData);
    console.log('✅ User profile created:', userProfile);
    return userProfile;
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
  }
}

// Example 2: Get user profile
async function getUserProfileExample() {
  try {
    const userId = 'user123';
    const userProfile = await firestoreService.getUserProfile(userId);
    
    if (userProfile) {
      console.log('✅ User profile found:', userProfile);
    } else {
      console.log('❌ User profile not found');
    }
    return userProfile;
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
  }
}

// Example 3: Update user profile
async function updateUserProfileExample() {
  try {
    const userId = 'user123';
    const updates = {
      city: 'جدة',
      phone: '+966501234568',
      isVerified: true
    };

    await firestoreService.updateUserProfile(userId, updates);
    console.log('✅ User profile updated successfully');
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
  }
}

// Example 4: Get all users with filters
async function getAllUsersExample() {
  try {
    // Get all renters in Riyadh
    const renters = await firestoreService.getAllUsers({
      userType: 'renter',
      city: 'الرياض'
    });
    console.log('✅ Renters in Riyadh:', renters);

    // Get all active users
    const activeUsers = await firestoreService.getAllUsers({
      isActive: true
    });
    console.log('✅ Active users:', activeUsers);
  } catch (error) {
    console.error('❌ Error getting users:', error);
  }
}

// ==================== CARS EXAMPLES ====================

// Example 5: Add a new car
async function addCarExample() {
  try {
    const carData = {
      ownerId: 'user123',
      brand: 'تويوتا',
      model: 'كامري',
      year: 2022,
      color: 'أبيض',
      licensePlate: 'أ ب ج 1234',
      city: 'الرياض',
      pricePerDay: 150,
      pricePerHour: 25,
      description: 'سيارة ممتازة للاستئجار',
      features: ['مكيف', 'GPS', 'بلوتوث'],
      photos: [
        'https://example.com/car1.jpg',
        'https://example.com/car2.jpg'
      ],
      fuelType: 'بنزين',
      transmission: 'أوتوماتيك',
      seats: 5,
      mileage: 15000
    };

    const car = await firestoreService.addCar(carData);
    console.log('✅ Car added:', car);
    return car;
  } catch (error) {
    console.error('❌ Error adding car:', error);
  }
}

// Example 6: Get car by ID
async function getCarExample() {
  try {
    const carId = 'car123';
    const car = await firestoreService.getCar(carId);
    
    if (car) {
      console.log('✅ Car found:', car);
    } else {
      console.log('❌ Car not found');
    }
    return car;
  } catch (error) {
    console.error('❌ Error getting car:', error);
  }
}

// Example 7: Update car
async function updateCarExample() {
  try {
    const carId = 'car123';
    const updates = {
      pricePerDay: 180,
      isAvailable: false,
      description: 'سيارة ممتازة للاستئجار - محدثة'
    };

    await firestoreService.updateCar(carId, updates);
    console.log('✅ Car updated successfully');
  } catch (error) {
    console.error('❌ Error updating car:', error);
  }
}

// Example 8: Get cars with filters
async function getCarsExample() {
  try {
    // Get all available cars in Riyadh
    const availableCars = await firestoreService.getAvailableCars({
      city: 'الرياض'
    });
    console.log('✅ Available cars in Riyadh:', availableCars);

    // Get cars by owner
    const ownerCars = await firestoreService.getCarsByOwner('user123');
    console.log('✅ Owner cars:', ownerCars);

    // Get all cars
    const allCars = await firestoreService.getAllCars();
    console.log('✅ All cars:', allCars);
  } catch (error) {
    console.error('❌ Error getting cars:', error);
  }
}

// Example 9: Search cars
async function searchCarsExample() {
  try {
    const searchParams = {
      city: 'الرياض',
      brand: 'تويوتا',
      minPrice: 100,
      maxPrice: 200,
      isAvailable: true
    };

    const searchResults = await firestoreService.searchCars(searchParams);
    console.log('✅ Search results:', searchResults);
  } catch (error) {
    console.error('❌ Error searching cars:', error);
  }
}

// ==================== BOOKINGS EXAMPLES ====================

// Example 10: Create a new booking
async function createBookingExample() {
  try {
    const bookingData = {
      carId: 'car123',
      renterId: 'user456',
      ownerId: 'user123',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      totalDays: 3,
      totalPrice: 450,
      pickupLocation: 'الرياض - المطار',
      returnLocation: 'الرياض - المطار',
      specialRequests: 'مطلوب GPS',
      insurance: true,
      deposit: 500
    };

    const booking = await firestoreService.createBooking(bookingData);
    console.log('✅ Booking created:', booking);
    return booking;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
  }
}

// Example 11: Get booking by ID
async function getBookingExample() {
  try {
    const bookingId = 'booking123';
    const booking = await firestoreService.getBooking(bookingId);
    
    if (booking) {
      console.log('✅ Booking found:', booking);
    } else {
      console.log('❌ Booking not found');
    }
    return booking;
  } catch (error) {
    console.error('❌ Error getting booking:', error);
  }
}

// Example 12: Update booking status
async function updateBookingStatusExample() {
  try {
    const bookingId = 'booking123';
    await firestoreService.updateBookingStatus(bookingId, 'confirmed');
    console.log('✅ Booking status updated to confirmed');
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
  }
}

// Example 13: Get bookings with filters
async function getBookingsExample() {
  try {
    // Get bookings by renter
    const renterBookings = await firestoreService.getBookingsByRenter('user456');
    console.log('✅ Renter bookings:', renterBookings);

    // Get bookings by owner
    const ownerBookings = await firestoreService.getBookingsByOwner('user123');
    console.log('✅ Owner bookings:', ownerBookings);

    // Get bookings for specific car
    const carBookings = await firestoreService.getBookingsByCar('car123');
    console.log('✅ Car bookings:', carBookings);

    // Get pending bookings
    const pendingBookings = await firestoreService.getPendingBookings();
    console.log('✅ Pending bookings:', pendingBookings);
  } catch (error) {
    console.error('❌ Error getting bookings:', error);
  }
}

// ==================== REAL-TIME LISTENERS EXAMPLES ====================

// Example 14: Listen to user profile changes
function listenToUserProfileExample() {
  const userId = 'user123';
  
  const unsubscribe = firestoreService.onUserProfileChange(userId, (userProfile) => {
    if (userProfile) {
      console.log('👤 User profile updated:', userProfile);
    } else {
      console.log('👤 User profile deleted');
    }
  });

  // To stop listening
  // unsubscribe();
  return unsubscribe;
}

// Example 15: Listen to cars changes
function listenToCarsExample() {
  const filters = {
    city: 'الرياض',
    isAvailable: true
  };
  
  const unsubscribe = firestoreService.onCarsChange((cars) => {
    console.log('🚗 Cars updated:', cars);
  }, filters);

  // To stop listening
  // unsubscribe();
  return unsubscribe;
}

// Example 16: Listen to bookings changes
function listenToBookingsExample() {
  const filters = {
    renterId: 'user456',
    status: 'pending'
  };
  
  const unsubscribe = firestoreService.onBookingsChange((bookings) => {
    console.log('📅 Bookings updated:', bookings);
  }, filters);

  // To stop listening
  // unsubscribe();
  return unsubscribe;
}

// ==================== UTILITY EXAMPLES ====================

// Example 17: Check if document exists
async function checkDocumentExistsExample() {
  try {
    const exists = await firestoreService.documentExists('users', 'user123');
    console.log('✅ Document exists:', exists);
  } catch (error) {
    console.error('❌ Error checking document existence:', error);
  }
}

// Example 18: Get collection count
async function getCollectionCountExample() {
  try {
    const userCount = await firestoreService.getCollectionCount('users');
    console.log('✅ Total users:', userCount);

    const availableCarsCount = await firestoreService.getCollectionCount('cars', {
      isAvailable: true
    });
    console.log('✅ Available cars:', availableCarsCount);
  } catch (error) {
    console.error('❌ Error getting collection count:', error);
  }
}

// ==================== COMPLETE WORKFLOW EXAMPLE ====================

// Example 19: Complete car rental workflow
async function completeRentalWorkflowExample() {
  try {
    console.log('🚀 Starting complete rental workflow...');

    // 1. Create user profiles
    const ownerProfile = await firestoreService.createUserProfile('owner123', {
      fullName: 'محمد أحمد',
      email: 'mohamed@example.com',
      phone: '+966501234569',
      city: 'الرياض',
      userType: 'owner'
    });

    const renterProfile = await firestoreService.createUserProfile('renter456', {
      fullName: 'فاطمة علي',
      email: 'fatima@example.com',
      phone: '+966501234570',
      city: 'الرياض',
      userType: 'renter'
    });

    // 2. Add a car
    const car = await firestoreService.addCar({
      ownerId: 'owner123',
      brand: 'هيونداي',
      model: 'سوناتا',
      year: 2023,
      color: 'أزرق',
      licensePlate: 'د ه و 5678',
      city: 'الرياض',
      pricePerDay: 120,
      description: 'سيارة فاخرة للاستئجار'
    });

    // 3. Create a booking
    const booking = await firestoreService.createBooking({
      carId: car.id,
      renterId: 'renter456',
      ownerId: 'owner123',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-22'),
      totalDays: 3,
      totalPrice: 360
    });

    // 4. Update booking status
    await firestoreService.updateBookingStatus(booking.id, 'confirmed');

    // 5. Update car availability
    await firestoreService.updateCar(car.id, { isAvailable: false });

    console.log('✅ Complete rental workflow finished successfully!');
    
    return {
      ownerProfile,
      renterProfile,
      car,
      booking
    };
  } catch (error) {
    console.error('❌ Error in complete workflow:', error);
  }
}

// Export all examples
export {
  createUserProfileExample,
  getUserProfileExample,
  updateUserProfileExample,
  getAllUsersExample,
  addCarExample,
  getCarExample,
  updateCarExample,
  getCarsExample,
  searchCarsExample,
  createBookingExample,
  getBookingExample,
  updateBookingStatusExample,
  getBookingsExample,
  listenToUserProfileExample,
  listenToCarsExample,
  listenToBookingsExample,
  checkDocumentExistsExample,
  getCollectionCountExample,
  completeRentalWorkflowExample
};
