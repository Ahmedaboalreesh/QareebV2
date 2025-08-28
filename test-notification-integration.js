const db = require('./database/firebase-db');

async function testNotificationIntegration() {
    console.log('🔔 Testing Notification Integration with Photo Upload...\n');

    try {
        // Test 1: Create mock users
        console.log('1️⃣ Creating mock users...');
        const mockOwner = {
            id: 'test-owner-' + Date.now(),
            full_name: 'مالك السيارة التجريبي',
            email: 'owner@test.com',
            phone: '+966501234567',
            city: 'الرياض'
        };

        const mockRenter = {
            id: 'test-renter-' + Date.now(),
            full_name: 'المستأجر التجريبي',
            email: 'renter@test.com',
            phone: '+966507654321',
            city: 'الرياض'
        };

        // Save users to database
        await db.createUser(mockOwner);
        await db.createUser(mockRenter);
        console.log('✅ Mock users created');

        // Test 2: Create mock car
        console.log('\n2️⃣ Creating mock car...');
        const mockCar = {
            user_id: mockOwner.id,
            brand: 'تويوتا',
            model: 'كامري',
            year: 2023,
            color: 'أبيض',
            type: 'سيدان',
            transmission: 'أوتوماتيك',
            fuel_type: 'بنزين',
            mileage: 50000,
            daily_rate: 200,
            weekly_rate: 1200,
            monthly_rate: 4500,
            deposit: 1000,
            available_from: '2024-01-01',
            available_to: '2024-12-31',
            location: 'الرياض',
            pickup_location: 'مطار الملك خالد الدولي',
            description: 'سيارة تجريبية للاختبار',
            features: ['مكيف', 'GPS', 'بلوتوث']
        };

        const createdCar = await db.createCar(mockCar);
        console.log('✅ Mock car created:', createdCar.id);

        // Test 3: Create mock booking
        console.log('\n3️⃣ Creating mock booking...');
        const mockBooking = {
            car_id: createdCar.id,
            renter_id: mockRenter.id,
            start_date: '2024-02-01',
            end_date: '2024-02-03',
            total_amount: 400,
            deposit_amount: 1000,
            pickup_location: 'مطار الملك خالد الدولي',
            return_location: 'مطار الملك خالد الدولي',
            renter_notes: 'حجز تجريبي للاختبار'
        };

        const createdBooking = await db.createBooking(mockBooking);
        console.log('✅ Mock booking created:', createdBooking.id);

        // Test 4: Update booking status to approved
        console.log('\n4️⃣ Updating booking status to approved...');
        await db.updateBookingStatus(createdBooking.id, 'approved', 'تمت الموافقة على الحجز التجريبي');
        console.log('✅ Booking status updated to approved');

        // Test 5: Simulate photo upload and notification creation
        console.log('\n5️⃣ Testing photo upload notification...');
        const mockPhoto = {
            id: 'photo-' + Date.now(),
            booking_id: createdBooking.id,
            file_name: 'booking_photos/' + createdBooking.id + '/test_photo.jpg',
            download_url: 'https://via.placeholder.com/300x200/007bff/ffffff?text=صورة+تجريبية',
            description: 'صورة تجريبية للاختبار',
            photo_type: 'general',
            uploaded_by: 'renter',
            created_at: new Date().toISOString()
        };

        // This should trigger notification creation
        await db.createPhotoUploadNotification(createdBooking.id, mockPhoto);
        console.log('✅ Photo upload notification created');

        // Test 6: Verify notification was created for car owner
        console.log('\n6️⃣ Verifying notification for car owner...');
        const ownerNotifications = await db.getNotificationsByUserId(mockOwner.id, 10);
        const photoUploadNotifications = ownerNotifications.filter(n => n.type === 'photo_uploaded');

        if (photoUploadNotifications.length > 0) {
            console.log('✅ Photo upload notification found for car owner');
            console.log('📋 Notification details:', {
                id: photoUploadNotifications[0].id,
                title: photoUploadNotifications[0].title,
                description: photoUploadNotifications[0].description,
                is_read: photoUploadNotifications[0].is_read
            });
        } else {
            console.log('❌ No photo upload notification found for car owner');
        }

        // Test 7: Test notification management
        console.log('\n7️⃣ Testing notification management...');
        
        // Get unread count
        const unreadCount = await db.getUnreadNotificationsCount(mockOwner.id);
        console.log(`📊 Unread notifications count: ${unreadCount}`);

        // Mark notification as read
        if (photoUploadNotifications.length > 0) {
            await db.markNotificationAsRead(photoUploadNotifications[0].id);
            console.log('✅ Notification marked as read');

            // Verify unread count decreased
            const newUnreadCount = await db.getUnreadNotificationsCount(mockOwner.id);
            console.log(`📊 New unread count: ${newUnreadCount}`);
        }

        // Test 8: Create multiple photo uploads
        console.log('\n8️⃣ Testing multiple photo uploads...');
        const additionalPhotos = [
            {
                id: 'photo-exterior-' + Date.now(),
                booking_id: createdBooking.id,
                file_name: 'booking_photos/' + createdBooking.id + '/exterior_photo.jpg',
                download_url: 'https://via.placeholder.com/300x200/28a745/ffffff?text=صورة+خارجية',
                description: 'صورة خارجية للسيارة',
                photo_type: 'exterior',
                uploaded_by: 'renter',
                created_at: new Date().toISOString()
            },
            {
                id: 'photo-interior-' + Date.now(),
                booking_id: createdBooking.id,
                file_name: 'booking_photos/' + createdBooking.id + '/interior_photo.jpg',
                download_url: 'https://via.placeholder.com/300x200/ffc107/ffffff?text=صورة+داخلية',
                description: 'صورة داخلية للسيارة',
                photo_type: 'interior',
                uploaded_by: 'renter',
                created_at: new Date().toISOString()
            }
        ];

        for (const photo of additionalPhotos) {
            await db.createPhotoUploadNotification(createdBooking.id, photo);
        }
        console.log('✅ Multiple photo upload notifications created');

        // Test 9: Verify all notifications
        console.log('\n9️⃣ Verifying all notifications...');
        const allOwnerNotifications = await db.getNotificationsByUserId(mockOwner.id, 20);
        const photoNotifications = allOwnerNotifications.filter(n => n.type === 'photo_uploaded');
        
        console.log(`📊 Total notifications for owner: ${allOwnerNotifications.length}`);
        console.log(`📷 Photo upload notifications: ${photoNotifications.length}`);

        // Test 10: Test notification types and content
        console.log('\n🔟 Testing notification content...');
        photoNotifications.forEach((notification, index) => {
            console.log(`📋 Notification ${index + 1}:`);
            console.log(`   - Title: ${notification.title}`);
            console.log(`   - Description: ${notification.description}`);
            console.log(`   - Type: ${notification.type}`);
            console.log(`   - Related ID: ${notification.related_id}`);
            console.log(`   - Is Read: ${notification.is_read}`);
        });

        // Test 11: Test notification for different user (renter should not get photo upload notifications)
        console.log('\n1️⃣1️⃣ Testing notifications for renter...');
        const renterNotifications = await db.getNotificationsByUserId(mockRenter.id, 10);
        const renterPhotoNotifications = renterNotifications.filter(n => n.type === 'photo_uploaded');
        
        console.log(`📊 Total notifications for renter: ${renterNotifications.length}`);
        console.log(`📷 Photo upload notifications for renter: ${renterPhotoNotifications.length}`);
        
        if (renterPhotoNotifications.length === 0) {
            console.log('✅ Correct: Renter does not receive photo upload notifications');
        } else {
            console.log('❌ Error: Renter should not receive photo upload notifications');
        }

        console.log('\n🎉 Notification integration test completed successfully!');
        console.log('\n📊 Test Summary:');
        console.log(`   - Created ${mockOwner.full_name} (Owner)`);
        console.log(`   - Created ${mockRenter.full_name} (Renter)`);
        console.log(`   - Created car: ${mockCar.brand} ${mockCar.model} ${mockCar.year}`);
        console.log(`   - Created booking: ${createdBooking.id}`);
        console.log(`   - Created ${photoNotifications.length} photo upload notifications`);
        console.log(`   - Owner notifications: ${allOwnerNotifications.length}`);
        console.log(`   - Renter notifications: ${renterNotifications.length}`);

    } catch (error) {
        console.error('❌ Notification integration test failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

// Run the integration test
testNotificationIntegration().then(() => {
    console.log('\n🏁 Notification integration test finished');
    process.exit(0);
}).catch(error => {
    console.error('💥 Integration test failed:', error);
    process.exit(1);
});
