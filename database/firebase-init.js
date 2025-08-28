const { database, ref, set } = require('../firebase-config');

async function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase Realtime Database...');
        
        // Create initial database structure
        const dbRef = ref(database);
        
        // Initialize empty collections
        const initialStructure = {
            users: {},
            cars: {},
            car_photos: {},
            bookings: {},
            activities: {},
            reviews: {},
            booking_photos: {}
        };
        
        await set(dbRef, initialStructure);
        
        console.log('✅ Firebase database initialized successfully!');
        console.log('📊 Database structure created:');
        console.log('   - users');
        console.log('   - cars');
        console.log('   - car_photos');
        console.log('   - bookings');
        console.log('   - activities');
        console.log('   - reviews');
        console.log('   - booking_photos');
        
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        process.exit(1);
    }
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeFirebase();
}

module.exports = { initializeFirebase };
