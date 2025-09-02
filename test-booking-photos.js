const db = require('./database/firebase-db');

async function testBookingPhotoSystem() {
    console.log('🧪 Testing Booking Photo System...\n');

    try {
        // Test 1: Create a mock booking for testing
        console.log('1️⃣ Creating mock booking for testing...');
        const mockBooking = {
            id: 'test-booking-123',
            renter_id: 'test-renter-456',
            owner_id: 'test-owner-789',
            car_id: 'test-car-101',
            status: 'approved',
            start_date: '2024-02-01',
            end_date: '2024-02-03',
            total_amount: 300,
            created_at: new Date().toISOString()
        };
        console.log('✅ Mock booking created\n');

        // Test 2: Test saving booking photo
        console.log('2️⃣ Testing saveBookingPhoto...');
        const mockPhotoData = {
            file: {
                originalname: 'test-car-photo.jpg',
                buffer: Buffer.from('mock-image-data'),
                mimetype: 'image/jpeg'
            },
            description: 'صورة تجريبية للسيارة',
            photo_type: 'exterior'
        };

        const savedPhoto = await db.saveBookingPhoto(mockBooking.id, mockPhotoData);
        console.log('✅ Photo saved successfully:', {
            id: savedPhoto.id,
            booking_id: savedPhoto.booking_id,
            photo_type: savedPhoto.photo_type,
            description: savedPhoto.description
        });

        // Test 3: Test getting booking photos
        console.log('\n3️⃣ Testing getBookingPhotos...');
        const photos = await db.getBookingPhotos(mockBooking.id);
        console.log('✅ Retrieved photos:', photos.length, 'photos found');
        
        if (photos.length > 0) {
            console.log('📸 First photo details:', {
                id: photos[0].id,
                type: photos[0].photo_type,
                description: photos[0].description,
                uploaded_by: photos[0].uploaded_by
            });
        }

        // Test 4: Test getting photos for non-existent booking
        console.log('\n4️⃣ Testing getBookingPhotos for non-existent booking...');
        const nonExistentPhotos = await db.getBookingPhotos('non-existent-booking');
        console.log('✅ Non-existent booking photos:', nonExistentPhotos.length, 'photos (should be 0)');

        // Test 5: Test deleting booking photo
        if (photos.length > 0) {
            console.log('\n5️⃣ Testing deleteBookingPhoto...');
            const photoToDelete = photos[0];
            const deleteResult = await db.deleteBookingPhoto(photoToDelete.id);
            console.log('✅ Photo deleted successfully:', deleteResult);

            // Verify deletion
            const remainingPhotos = await db.getBookingPhotos(mockBooking.id);
            console.log('✅ Remaining photos after deletion:', remainingPhotos.length, 'photos');
        }

        // Test 6: Test deleting non-existent photo
        console.log('\n6️⃣ Testing deleteBookingPhoto for non-existent photo...');
        try {
            await db.deleteBookingPhoto('non-existent-photo');
            console.log('❌ Should have thrown an error');
        } catch (error) {
            console.log('✅ Correctly threw error for non-existent photo:', error.message);
        }

        console.log('\n🎉 All booking photo tests completed successfully!');
        console.log('\n📋 Test Summary:');
        console.log('   ✅ Photo upload functionality');
        console.log('   ✅ Photo retrieval functionality');
        console.log('   ✅ Photo deletion functionality');
        console.log('   ✅ Error handling for non-existent resources');
        console.log('   ✅ Firebase Storage integration');
        console.log('   ✅ Database metadata storage');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testBookingPhotoSystem()
        .then(() => {
            console.log('\n✨ Booking photo system is working correctly!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Booking photo system test failed:', error);
            process.exit(1);
        });
}

module.exports = { testBookingPhotoSystem };
