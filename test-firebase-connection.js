// Test Firebase Database Connection
const { database, ref, set, get } = require('./firebase-config');

async function testFirebaseConnection() {
    try {
        console.log('🔥 Testing Firebase Database Connection...');
        
        // Test writing data
        const testRef = ref(database, 'test_connection');
        await set(testRef, {
            message: 'Firebase connection successful!',
            timestamp: new Date().toISOString(),
            project: 'qareeb-aba0c'
        });
        
        console.log('✅ Successfully wrote test data to Firebase');
        
        // Test reading data
        const snapshot = await get(testRef);
        const data = snapshot.val();
        
        console.log('✅ Successfully read test data from Firebase:');
        console.log('   Message:', data.message);
        console.log('   Timestamp:', data.timestamp);
        console.log('   Project:', data.project);
        
        // Clean up test data
        await set(testRef, null);
        console.log('✅ Test data cleaned up');
        
        console.log('\n🎉 Firebase Database Connection Test: PASSED');
        console.log('📊 Database URL: https://qareeb-aba0c-default-rtdb.firebaseio.com/');
        console.log('🏗️  Project ID: qareeb-aba0c');
        
    } catch (error) {
        console.error('❌ Firebase Connection Test Failed:', error);
        console.error('Please check your Firebase configuration and credentials');
    }
}

// Run the test
testFirebaseConnection();
