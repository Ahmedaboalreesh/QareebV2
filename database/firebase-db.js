const { database, storage, ref, set, get, push, update, remove, query, orderByChild, equalTo, storageRef, uploadBytes, getDownloadURL, deleteObject } = require('../firebase-config');

class FirebaseDatabase {
    constructor() {
        this.db = database;
    }

    // User operations
    async createUser(userData) {
        try {
            const { full_name, email, phone, city, password_hash } = userData;
            
            // Check if user already exists
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error('Email already registered');
            }

            // Create new user with auto-generated ID
            const userRef = ref(this.db, 'users');
            const newUserRef = push(userRef);
            
            const user = {
                id: newUserRef.key,
                full_name,
                email,
                phone,
                city,
                password_hash,
                created_at: new Date().toISOString()
            };

            await set(newUserRef, user);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const usersRef = ref(this.db, 'users');
            const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
            const snapshot = await get(emailQuery);
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userId = Object.keys(userData)[0];
                return { id: userId, ...userData[userId] };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const userRef = ref(this.db, `users/${id}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                return { id, ...userData };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Car operations
    async createCar(carData) {
        try {
            const {
                user_id, brand, model, year, color, type, transmission,
                fuel_type, mileage, daily_rate, weekly_rate, monthly_rate,
                deposit, available_from, available_to, location, pickup_location,
                description, features
            } = carData;

            const carRef = ref(this.db, 'cars');
            const newCarRef = push(carRef);
            
            const car = {
                id: newCarRef.key,
                user_id,
                brand,
                model,
                year,
                color,
                type,
                transmission,
                fuel_type,
                mileage,
                daily_rate,
                weekly_rate,
                monthly_rate,
                deposit,
                available_from,
                available_to,
                location,
                pickup_location,
                description,
                features: Array.isArray(features) ? features : [],
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await set(newCarRef, car);
            return car;
        } catch (error) {
            throw error;
        }
    }

    async getCarsByUserId(userId) {
        try {
            const carsRef = ref(this.db, 'cars');
            const userCarsQuery = query(carsRef, orderByChild('user_id'), equalTo(userId));
            const snapshot = await get(userCarsQuery);
            
            if (snapshot.exists()) {
                const carsData = snapshot.val();
                const cars = Object.keys(carsData).map(key => ({
                    id: key,
                    ...carsData[key]
                }));
                
                // Get photo count for each car
                for (let car of cars) {
                    const photos = await this.getCarPhotos(car.id);
                    car.photo_count = photos.length;
                }
                
                return cars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async getCarById(carId) {
        try {
            const carRef = ref(this.db, `cars/${carId}`);
            const snapshot = await get(carRef);
            
            if (snapshot.exists()) {
                const carData = snapshot.val();
                return { id: carId, ...carData };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async updateCarStatus(carId, status) {
        try {
            const carRef = ref(this.db, `cars/${carId}`);
            await update(carRef, {
                status,
                updated_at: new Date().toISOString()
            });
            return { id: carId, status };
        } catch (error) {
            throw error;
        }
    }

    async deleteCar(carId) {
        try {
            const carRef = ref(this.db, `cars/${carId}`);
            await remove(carRef);
            
            // Delete associated photos
            const photosRef = ref(this.db, 'car_photos');
            const carPhotosQuery = query(photosRef, orderByChild('car_id'), equalTo(carId));
            const photosSnapshot = await get(carPhotosQuery);
            
            if (photosSnapshot.exists()) {
                const photosData = photosSnapshot.val();
                const deletePromises = Object.keys(photosData).map(photoId => 
                    remove(ref(this.db, `car_photos/${photoId}`))
                );
                await Promise.all(deletePromises);
            }
            
            return { id: carId, deleted: true };
        } catch (error) {
            throw error;
        }
    }

    // Car photo operations
    async saveCarPhoto(photoData) {
        try {
            const { car_id, filename, original_name, file_size, mime_type, buffer } = photoData;
            
            // Upload file to Firebase Storage
            const storageRefPath = storageRef(storage, `car-photos/${car_id}/${filename}`);
            const metadata = {
                contentType: mime_type,
                customMetadata: {
                    car_id: car_id,
                    original_name: original_name
                }
            };
            
            await uploadBytes(storageRefPath, buffer, metadata);
            
            // Get download URL
            const downloadURL = await getDownloadURL(storageRefPath);
            
            // Save photo metadata to database
            const photoRef = ref(this.db, 'car_photos');
            const newPhotoRef = push(photoRef);
            
            const photo = {
                id: newPhotoRef.key,
                car_id,
                filename,
                original_name,
                file_size,
                mime_type,
                download_url: downloadURL,
                storage_path: `car-photos/${car_id}/${filename}`,
                upload_date: new Date().toISOString()
            };

            await set(newPhotoRef, photo);
            return photo;
        } catch (error) {
            throw error;
        }
    }

    async getCarPhotos(carId) {
        try {
            const photosRef = ref(this.db, 'car_photos');
            const carPhotosQuery = query(photosRef, orderByChild('car_id'), equalTo(carId));
            const snapshot = await get(carPhotosQuery);
            
            if (snapshot.exists()) {
                const photosData = snapshot.val();
                return Object.keys(photosData).map(key => ({
                    id: key,
                    ...photosData[key]
                })).sort((a, b) => new Date(a.upload_date) - new Date(b.upload_date));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async deleteCarPhoto(photoId) {
        try {
            // Get photo data first
            const photoRef = ref(this.db, `car_photos/${photoId}`);
            const snapshot = await get(photoRef);
            
            if (snapshot.exists()) {
                const photoData = snapshot.val();
                
                // Delete from Firebase Storage
                if (photoData.storage_path) {
                    const storageRefPath = storageRef(storage, photoData.storage_path);
                    await deleteObject(storageRefPath);
                }
                
                // Delete from database
                await remove(photoRef);
            }
            
            return { id: photoId, deleted: true };
        } catch (error) {
            throw error;
        }
    }

    // Activity operations
    async createActivity(activityData) {
        try {
            const { user_id, type, title, description } = activityData;
            
            const activityRef = ref(this.db, 'activities');
            const newActivityRef = push(activityRef);
            
            const activity = {
                id: newActivityRef.key,
                user_id,
                type,
                title,
                description,
                created_at: new Date().toISOString()
            };

            await set(newActivityRef, activity);
            return activity;
        } catch (error) {
            throw error;
        }
    }

    // Notification operations
    async createNotification(notificationData) {
        try {
            const { user_id, type, title, description, related_id, related_type } = notificationData;
            
            const notificationRef = ref(this.db, 'notifications');
            const newNotificationRef = push(notificationRef);
            
            const notification = {
                id: newNotificationRef.key,
                user_id,
                type,
                title,
                description,
                related_id: related_id || null,
                related_type: related_type || null,
                is_read: false,
                created_at: new Date().toISOString()
            };

            await set(newNotificationRef, notification);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    async getNotificationsByUserId(userId, limit = 20) {
        try {
            const notificationsRef = ref(this.db, 'notifications');
            const userNotificationsQuery = query(notificationsRef, orderByChild('user_id'), equalTo(userId));
            const snapshot = await get(userNotificationsQuery);
            
            if (snapshot.exists()) {
                const notificationsData = snapshot.val();
                const notifications = Object.keys(notificationsData).map(key => ({
                    id: key,
                    ...notificationsData[key]
                }));
                
                return notifications
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, limit);
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const notificationRef = ref(this.db, `notifications/${notificationId}`);
            await update(notificationRef, { is_read: true });
            return { id: notificationId, is_read: true };
        } catch (error) {
            throw error;
        }
    }

    async markAllNotificationsAsRead(userId) {
        try {
            const notifications = await this.getNotificationsByUserId(userId, 1000);
            const unreadNotifications = notifications.filter(n => !n.is_read);
            
            const updates = {};
            unreadNotifications.forEach(notification => {
                updates[`notifications/${notification.id}/is_read`] = true;
            });
            
            if (Object.keys(updates).length > 0) {
                await update(ref(this.db), updates);
            }
            
            return { updated_count: unreadNotifications.length };
        } catch (error) {
            throw error;
        }
    }

    async getUnreadNotificationsCount(userId) {
        try {
            const notifications = await this.getNotificationsByUserId(userId, 1000);
            return notifications.filter(n => !n.is_read).length;
        } catch (error) {
            throw error;
        }
    }

    async getActivitiesByUserId(userId, limit = 10) {
        try {
            const activitiesRef = ref(this.db, 'activities');
            const userActivitiesQuery = query(activitiesRef, orderByChild('user_id'), equalTo(userId));
            const snapshot = await get(userActivitiesQuery);
            
            if (snapshot.exists()) {
                const activitiesData = snapshot.val();
                const activities = Object.keys(activitiesData).map(key => ({
                    id: key,
                    ...activitiesData[key]
                }));
                
                return activities
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, limit);
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    // Booking operations
    async createBooking(bookingData) {
        try {
            const { 
                car_id, renter_id, start_date, end_date, total_amount, 
                deposit_amount, pickup_location, return_location, renter_notes 
            } = bookingData;
            
            const bookingRef = ref(this.db, 'bookings');
            const newBookingRef = push(bookingRef);
            
            const booking = {
                id: newBookingRef.key,
                car_id,
                renter_id,
                start_date,
                end_date,
                total_amount,
                deposit_amount,
                pickup_location,
                return_location,
                renter_notes,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await set(newBookingRef, booking);
            return booking;
        } catch (error) {
            throw error;
        }
    }

    async getBookingsByRenterId(renterId) {
        try {
            const bookingsRef = ref(this.db, 'bookings');
            const renterBookingsQuery = query(bookingsRef, orderByChild('renter_id'), equalTo(renterId));
            const snapshot = await get(renterBookingsQuery);
            
            if (snapshot.exists()) {
                const bookingsData = snapshot.val();
                const bookings = Object.keys(bookingsData).map(key => ({
                    id: key,
                    ...bookingsData[key]
                }));
                
                // Get car and owner details for each booking
                for (let booking of bookings) {
                    const car = await this.getCarById(booking.car_id);
                    if (car) {
                        booking.brand = car.brand;
                        booking.model = car.model;
                        booking.year = car.year;
                        booking.daily_rate = car.daily_rate;
                        booking.deposit = car.deposit;
                        
                        const owner = await this.getUserById(car.user_id);
                        if (owner) {
                            booking.owner_name = owner.full_name;
                            booking.owner_phone = owner.phone;
                        }
                    }
                }
                
                return bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async getBookingsByOwnerId(ownerId) {
        try {
            // First get all cars owned by this user
            const cars = await this.getCarsByUserId(ownerId);
            const carIds = cars.map(car => car.id);
            
            if (carIds.length === 0) return [];
            
            // Get all bookings for these cars
            const bookingsRef = ref(this.db, 'bookings');
            const allBookingsSnapshot = await get(bookingsRef);
            
            if (allBookingsSnapshot.exists()) {
                const bookingsData = allBookingsSnapshot.val();
                const bookings = Object.keys(bookingsData)
                    .map(key => ({ id: key, ...bookingsData[key] }))
                    .filter(booking => carIds.includes(booking.car_id));
                
                // Get car and renter details for each booking
                for (let booking of bookings) {
                    const car = await this.getCarById(booking.car_id);
                    if (car) {
                        booking.brand = car.brand;
                        booking.model = car.model;
                        booking.year = car.year;
                        booking.daily_rate = car.daily_rate;
                    }
                    
                    const renter = await this.getUserById(booking.renter_id);
                    if (renter) {
                        booking.renter_name = renter.full_name;
                        booking.renter_email = renter.email;
                        booking.renter_phone = renter.phone;
                    }
                }
                
                return bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async updateBookingStatus(bookingId, status, ownerNotes = null) {
        try {
            const bookingRef = ref(this.db, `bookings/${bookingId}`);
            const updateData = {
                status,
                updated_at: new Date().toISOString()
            };
            
            if (ownerNotes) {
                updateData.owner_notes = ownerNotes;
            }
            
            await update(bookingRef, updateData);
            return { id: bookingId, status, ownerNotes };
        } catch (error) {
            throw error;
        }
    }

    async getBookingById(bookingId) {
        try {
            const bookingRef = ref(this.db, `bookings/${bookingId}`);
            const snapshot = await get(bookingRef);
            
            if (snapshot.exists()) {
                const bookingData = snapshot.val();
                const booking = { id: bookingId, ...bookingData };
                
                // Get car details
                const car = await this.getCarById(booking.car_id);
                if (car) {
                    booking.brand = car.brand;
                    booking.model = car.model;
                    booking.year = car.year;
                    booking.daily_rate = car.daily_rate;
                    booking.deposit = car.deposit;
                    booking.owner_id = car.user_id;
                    
                    const owner = await this.getUserById(car.user_id);
                    if (owner) {
                        booking.owner_name = owner.full_name;
                        booking.owner_phone = owner.phone;
                    }
                }
                
                // Get renter details
                const renter = await this.getUserById(booking.renter_id);
                if (renter) {
                    booking.renter_name = renter.full_name;
                    booking.renter_email = renter.email;
                    booking.renter_phone = renter.phone;
                }
                
                return booking;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Dashboard stats
    async getDashboardStats(userId) {
        try {
            const cars = await this.getCarsByUserId(userId);
            const carsCount = cars.length;
            
            // Get active bookings
            const ownerBookings = await this.getBookingsByOwnerId(userId);
            const activeBookings = ownerBookings.filter(booking => booking.status === 'active').length;
            
            // Calculate monthly earnings
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyBookings = ownerBookings.filter(booking => {
                const bookingDate = new Date(booking.created_at);
                return booking.status === 'completed' && 
                       bookingDate.getMonth() === currentMonth && 
                       bookingDate.getFullYear() === currentYear;
            });
            
            const monthlyEarnings = monthlyBookings.reduce((total, booking) => total + booking.total_amount, 0);
            
            return {
                cars_count: carsCount,
                active_bookings: activeBookings,
                monthly_earnings: monthlyEarnings
            };
        } catch (error) {
            throw error;
        }
    }

    // Review operations
    async createReview(reviewData) {
        try {
            const { 
                booking_id, car_id, renter_id, owner_id, rating, 
                cleanliness_rating, condition_rating, communication_rating,
                comment, review_type 
            } = reviewData;
            
            const reviewRef = ref(this.db, 'reviews');
            const newReviewRef = push(reviewRef);
            
            const review = {
                id: newReviewRef.key,
                booking_id,
                car_id,
                renter_id,
                owner_id,
                rating,
                cleanliness_rating,
                condition_rating,
                communication_rating,
                comment,
                review_type, // 'renter_to_owner' or 'owner_to_renter'
                created_at: new Date().toISOString()
            };

            await set(newReviewRef, review);
            return review;
        } catch (error) {
            throw error;
        }
    }

    async getReviewsByCarId(carId) {
        try {
            const reviewsRef = ref(this.db, 'reviews');
            const carReviewsQuery = query(reviewsRef, orderByChild('car_id'), equalTo(carId));
            const snapshot = await get(carReviewsQuery);
            
            if (snapshot.exists()) {
                const reviewsData = snapshot.val();
                const reviews = Object.keys(reviewsData).map(key => ({
                    id: key,
                    ...reviewsData[key]
                }));
                
                // Get user details for each review
                for (let review of reviews) {
                    const user = await this.getUserById(review.renter_id);
                    if (user) {
                        review.reviewer_name = user.full_name;
                        review.reviewer_avatar = user.avatar || null;
                    }
                }
                
                return reviews
                    .filter(review => review.review_type === 'renter_to_owner')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async getReviewsByUserId(userId, reviewType = null) {
        try {
            const reviewsRef = ref(this.db, 'reviews');
            let userReviewsQuery;
            
            if (reviewType === 'received') {
                userReviewsQuery = query(reviewsRef, orderByChild('owner_id'), equalTo(userId));
            } else if (reviewType === 'given') {
                userReviewsQuery = query(reviewsRef, orderByChild('renter_id'), equalTo(userId));
            } else {
                // Get all reviews for user (both given and received)
                const snapshot = await get(reviewsRef);
                if (snapshot.exists()) {
                    const reviewsData = snapshot.val();
                    const reviews = Object.keys(reviewsData)
                        .map(key => ({ id: key, ...reviewsData[key] }))
                        .filter(review => review.renter_id === userId || review.owner_id === userId);
                    
                    // Get user details for each review
                    for (let review of reviews) {
                        const reviewer = await this.getUserById(review.renter_id);
                        const reviewed = await this.getUserById(review.owner_id);
                        if (reviewer) {
                            review.reviewer_name = reviewer.full_name;
                        }
                        if (reviewed) {
                            review.reviewed_name = reviewed.full_name;
                        }
                    }
                    
                    return reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                }
                return [];
            }
            
            const snapshot = await get(userReviewsQuery);
            if (snapshot.exists()) {
                const reviewsData = snapshot.val();
                const reviews = Object.keys(reviewsData).map(key => ({
                    id: key,
                    ...reviewsData[key]
                }));
                
                // Get user details for each review
                for (let review of reviews) {
                    const reviewer = await this.getUserById(review.renter_id);
                    const reviewed = await this.getUserById(review.owner_id);
                    if (reviewer) {
                        review.reviewer_name = reviewer.full_name;
                    }
                    if (reviewed) {
                        review.reviewed_name = reviewed.full_name;
                    }
                }
                
                return reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async getReviewByBookingId(bookingId) {
        try {
            const reviewsRef = ref(this.db, 'reviews');
            const bookingReviewsQuery = query(reviewsRef, orderByChild('booking_id'), equalTo(bookingId));
            const snapshot = await get(bookingReviewsQuery);
            
            if (snapshot.exists()) {
                const reviewsData = snapshot.val();
                return Object.keys(reviewsData).map(key => ({
                    id: key,
                    ...reviewsData[key]
                }));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async updateReview(reviewId, updateData) {
        try {
            const reviewRef = ref(this.db, `reviews/${reviewId}`);
            await update(reviewRef, {
                ...updateData,
                updated_at: new Date().toISOString()
            });
            return { id: reviewId, ...updateData };
        } catch (error) {
            throw error;
        }
    }

    async deleteReview(reviewId) {
        try {
            const reviewRef = ref(this.db, `reviews/${reviewId}`);
            await remove(reviewRef);
            return { id: reviewId, deleted: true };
        } catch (error) {
            throw error;
        }
    }

    async getAverageRatingByCarId(carId) {
        try {
            const reviews = await this.getReviewsByCarId(carId);
            if (reviews.length === 0) {
                return {
                    average_rating: 0,
                    total_reviews: 0,
                    rating_breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                };
            }
            
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            
            const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            reviews.forEach(review => {
                ratingBreakdown[review.rating]++;
            });
            
            return {
                average_rating: Math.round(averageRating * 10) / 10,
                total_reviews: reviews.length,
                rating_breakdown: ratingBreakdown
            };
        } catch (error) {
            throw error;
        }
    }

    // Booking Photo operations (Optional feature for renters after approval)
    async saveBookingPhoto(bookingId, photoData) {
        try {
            const { file, description, photo_type } = photoData;
            
            // Upload file to Firebase Storage
            const fileName = `booking_photos/${bookingId}/${Date.now()}_${file.originalname}`;
            const fileRef = storageRef(storage, fileName);
            await uploadBytes(fileRef, file.buffer);
            const downloadURL = await getDownloadURL(fileRef);
            
            // Save photo metadata to database
            const photoRef = ref(this.db, 'booking_photos');
            const newPhotoRef = push(photoRef);
            
            const photo = {
                id: newPhotoRef.key,
                booking_id: bookingId,
                file_name: fileName,
                download_url: downloadURL,
                description: description || '',
                photo_type: photo_type || 'general',
                uploaded_by: 'renter',
                created_at: new Date().toISOString()
            };
            
            await set(newPhotoRef, photo);
            
            // Create notification for car owner
            await this.createPhotoUploadNotification(bookingId, photo);
            
            return photo;
        } catch (error) {
            throw error;
        }
    }

    // Helper function to create photo upload notification
    async createPhotoUploadNotification(bookingId, photo) {
        try {
            // Get booking details to find the car owner
            const booking = await this.getBookingById(bookingId);
            if (!booking) {
                console.error('Booking not found for notification:', bookingId);
                return;
            }

            // Get car details to include car name in notification
            const car = await this.getCarById(booking.car_id);
            if (!car) {
                console.error('Car not found for notification:', booking.car_id);
                return;
            }

            // Get renter details for notification
            const renter = await this.getUserById(booking.renter_id);
            if (!renter) {
                console.error('Renter not found for notification:', booking.renter_id);
                return;
            }

            // Create notification for car owner
            const notificationData = {
                user_id: booking.owner_id,
                type: 'photo_uploaded',
                title: 'تم رفع صور جديدة للحجز',
                description: `قام ${renter.full_name} برفع صور جديدة لحجز سيارة ${car.brand} ${car.model} ${car.year}`,
                related_id: bookingId,
                related_type: 'booking'
            };

            await this.createNotification(notificationData);
            console.log('Photo upload notification created for car owner:', booking.owner_id);
            
        } catch (error) {
            console.error('Error creating photo upload notification:', error);
            // Don't throw error to avoid breaking the photo upload process
        }
    }

    async getBookingPhotos(bookingId) {
        try {
            const photosRef = ref(this.db, 'booking_photos');
            const bookingPhotosQuery = query(photosRef, orderByChild('booking_id'), equalTo(bookingId));
            const snapshot = await get(bookingPhotosQuery);
            
            if (snapshot.exists()) {
                const photosData = snapshot.val();
                return Object.keys(photosData).map(key => ({
                    id: key,
                    ...photosData[key]
                })).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async deleteBookingPhoto(photoId) {
        try {
            const photoRef = ref(this.db, `booking_photos/${photoId}`);
            const snapshot = await get(photoRef);
            
            if (snapshot.exists()) {
                const photoData = snapshot.val();
                
                // Delete from Firebase Storage
                const fileRef = storageRef(storage, photoData.file_name);
                await deleteObject(fileRef);
                
                // Delete from database
                await remove(photoRef);
                return { id: photoId, deleted: true };
            }
            throw new Error('Photo not found');
        } catch (error) {
            throw error;
        }
    }

    // Close database connection (not needed for Firebase)
    async close() {
        // Firebase doesn't require explicit connection closing
        return Promise.resolve();
    }
}

module.exports = new FirebaseDatabase();
