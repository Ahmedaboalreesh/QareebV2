const db = require('./database/firebase-db');

async function testNotificationSystem() {
    console.log('🔔 Testing Notification System...\n');

    try {
        // Test 1: Create notification
        console.log('1️⃣ Testing createNotification...');
        const notificationData = {
            user_id: 'test-user-123',
            type: 'photo_uploaded',
            title: 'تم رفع صور جديدة للحجز',
            description: 'قام أحمد محمد برفع صور جديدة لحجز سيارة تويوتا كامري 2023',
            related_id: 'booking-123',
            related_type: 'booking'
        };

        const createdNotification = await db.createNotification(notificationData);
        console.log('✅ Notification created:', {
            id: createdNotification.id,
            title: createdNotification.title,
            type: createdNotification.type,
            is_read: createdNotification.is_read
        });

        // Test 2: Get notifications by user ID
        console.log('\n2️⃣ Testing getNotificationsByUserId...');
        const notifications = await db.getNotificationsByUserId('test-user-123', 5);
        console.log(`✅ Found ${notifications.length} notifications for user`);

        if (notifications.length > 0) {
            console.log('📋 Notifications:', notifications.map(n => ({
                id: n.id,
                title: n.title,
                type: n.type,
                is_read: n.is_read,
                created_at: n.created_at
            })));
        }

        // Test 3: Get unread notifications count
        console.log('\n3️⃣ Testing getUnreadNotificationsCount...');
        const unreadCount = await db.getUnreadNotificationsCount('test-user-123');
        console.log(`✅ Unread notifications count: ${unreadCount}`);

        // Test 4: Mark notification as read
        console.log('\n4️⃣ Testing markNotificationAsRead...');
        if (notifications.length > 0) {
            const firstNotification = notifications[0];
            const markedAsRead = await db.markNotificationAsRead(firstNotification.id);
            console.log('✅ Notification marked as read:', {
                id: markedAsRead.id,
                is_read: markedAsRead.is_read
            });

            // Verify unread count decreased
            const newUnreadCount = await db.getUnreadNotificationsCount('test-user-123');
            console.log(`✅ New unread count: ${newUnreadCount}`);
        }

        // Test 5: Mark all notifications as read
        console.log('\n5️⃣ Testing markAllNotificationsAsRead...');
        const markAllResult = await db.markAllNotificationsAsRead('test-user-123');
        console.log('✅ Marked all notifications as read:', {
            updated_count: markAllResult.updated_count
        });

        // Test 6: Create multiple notifications for testing
        console.log('\n6️⃣ Creating multiple test notifications...');
        const testNotifications = [
            {
                user_id: 'test-user-123',
                type: 'booking_status_updated',
                title: 'تم تحديث حالة الحجز',
                description: 'تم الموافقة على حجز سيارة مرسيدس C-Class',
                related_id: 'booking-456',
                related_type: 'booking'
            },
            {
                user_id: 'test-user-123',
                type: 'review_received',
                title: 'تقييم جديد',
                description: 'تلقيت تقييماً جديداً من المستأجر',
                related_id: 'review-789',
                related_type: 'review'
            },
            {
                user_id: 'test-user-456',
                type: 'photo_uploaded',
                title: 'صور جديدة للحجز',
                description: 'قام محمد علي برفع صور جديدة',
                related_id: 'booking-789',
                related_type: 'booking'
            }
        ];

        for (const notificationData of testNotifications) {
            await db.createNotification(notificationData);
        }
        console.log('✅ Created 3 additional test notifications');

        // Test 7: Get notifications for different users
        console.log('\n7️⃣ Testing notifications for different users...');
        const user123Notifications = await db.getNotificationsByUserId('test-user-123', 10);
        const user456Notifications = await db.getNotificationsByUserId('test-user-456', 10);
        
        console.log(`✅ User 123 has ${user123Notifications.length} notifications`);
        console.log(`✅ User 456 has ${user456Notifications.length} notifications`);

        // Test 8: Test photo upload notification creation
        console.log('\n8️⃣ Testing photo upload notification creation...');
        const mockPhoto = {
            id: 'photo-123',
            booking_id: 'booking-123',
            file_name: 'test-photo.jpg',
            download_url: 'https://example.com/photo.jpg',
            description: 'صورة تجريبية',
            photo_type: 'general',
            uploaded_by: 'renter',
            created_at: new Date().toISOString()
        };

        await db.createPhotoUploadNotification('booking-123', mockPhoto);
        console.log('✅ Photo upload notification created');

        console.log('\n🎉 All notification tests completed successfully!');

    } catch (error) {
        console.error('❌ Notification test failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

// Run the test
testNotificationSystem().then(() => {
    console.log('\n🏁 Notification system test finished');
    process.exit(0);
}).catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
});
