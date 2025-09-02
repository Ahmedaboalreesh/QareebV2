const { database, ref, set, get } = require('./firebase-config');

async function testFirebaseConnection() {
    try {
        console.log('🔥 Testing Firebase connection...');
        
        // Test write operation
        const testRef = ref(database, 'test');
        await set(testRef, {
            message: 'Firebase connection test',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Write test successful');
        
        // Test read operation
        const snapshot = await get(testRef);
        if (snapshot.exists()) {
            console.log('✅ Read test successful');
            console.log('📊 Test data:', snapshot.val());
        } else {
            console.log('❌ Read test failed - no data found');
        }
        
        // Clean up test data
        await set(testRef, null);
        console.log('✅ Cleanup successful');
        
        console.log('🎉 Firebase connection test completed successfully!');
        console.log('📝 You can now run the application with: npm start');
        
    } catch (error) {
        console.error('❌ Firebase connection test failed:');
        console.error('Error:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('1. Check your .env file has correct Firebase credentials');
        console.error('2. Verify Firebase project is active');
        console.error('3. Check internet connection');
        console.error('4. Ensure Firebase Realtime Database is enabled');
        console.error('\n📖 See SETUP.md for detailed setup instructions');
    }
}

// Run test if this file is executed directly
if (require.main === module) {
    testFirebaseConnection();
}

module.exports = { testFirebaseConnection };
