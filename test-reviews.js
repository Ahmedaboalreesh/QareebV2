const { database, ref, set, get, push, remove } = require('./firebase-config');

async function testReviewSystem() {
    try {
        console.log('🔥 Testing Review System...');
        
        // Test 1: Create a review
        console.log('\n📝 Test 1: Creating a review...');
        const reviewData = {
            booking_id: 'test-booking-1',
            car_id: 'test-car-1',
            renter_id: 'test-renter-1',
            owner_id: 'test-owner-1',
            rating: 5,
            cleanliness_rating: 5,
            condition_rating: 4,
            communication_rating: 5,
            comment: 'تجربة ممتازة، السيارة نظيفة والمالك متعاون',
            review_type: 'renter_to_owner',
            created_at: new Date().toISOString()
        };
        
        const reviewRef = ref(database, 'reviews');
        const newReviewRef = push(reviewRef);
        await set(newReviewRef, reviewData);
        
        console.log('✅ Review created successfully');
        console.log('📊 Review ID:', newReviewRef.key);
        
        // Test 2: Read reviews
        console.log('\n📖 Test 2: Reading reviews...');
        const reviewsSnapshot = await get(reviewRef);
        
        if (reviewsSnapshot.exists()) {
            const reviews = reviewsSnapshot.val();
            const reviewCount = Object.keys(reviews).length;
            console.log('✅ Reviews read successfully');
            console.log('📊 Total reviews:', reviewCount);
            
            // Display first review
            const firstReviewId = Object.keys(reviews)[0];
            const firstReview = reviews[firstReviewId];
            console.log('📋 Sample review:', {
                id: firstReviewId,
                rating: firstReview.rating,
                comment: firstReview.comment,
                type: firstReview.review_type
            });
        } else {
            console.log('❌ No reviews found');
        }
        
        // Test 3: Calculate average rating
        console.log('\n📊 Test 3: Calculating average rating...');
        if (reviewsSnapshot.exists()) {
            const reviews = reviewsSnapshot.val();
            const reviewList = Object.values(reviews);
            const totalRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviewList.length;
            
            console.log('✅ Average rating calculated');
            console.log('📊 Average rating:', averageRating.toFixed(1));
            console.log('📊 Total reviews:', reviewList.length);
        }
        
        // Test 4: Filter reviews by type
        console.log('\n🔍 Test 4: Filtering reviews by type...');
        if (reviewsSnapshot.exists()) {
            const reviews = reviewsSnapshot.val();
            const reviewList = Object.values(reviews);
            
            const renterToOwner = reviewList.filter(r => r.review_type === 'renter_to_owner');
            const ownerToRenter = reviewList.filter(r => r.review_type === 'owner_to_renter');
            
            console.log('✅ Reviews filtered successfully');
            console.log('📊 Renter to Owner reviews:', renterToOwner.length);
            console.log('📊 Owner to Renter reviews:', ownerToRenter.length);
        }
        
        // Test 5: Clean up test data
        console.log('\n🧹 Test 5: Cleaning up test data...');
        await remove(newReviewRef);
        console.log('✅ Test review deleted successfully');
        
        console.log('\n🎉 Review system test completed successfully!');
        console.log('📝 The review system is working correctly');
        
    } catch (error) {
        console.error('❌ Review system test failed:');
        console.error('Error:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('1. Check Firebase connection');
        console.error('2. Verify database permissions');
        console.error('3. Check internet connection');
    }
}

// Run test if this file is executed directly
if (require.main === module) {
    testReviewSystem();
}

module.exports = { testReviewSystem };
