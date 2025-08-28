const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { ref, remove } = require('./firebase-config');
require('dotenv').config();

const db = require('./database/firebase-db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for memory storage (for Firebase Storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Register user
app.post('/api/register', async (req, res) => {
    try {
        const { full_name, email, phone, city, password } = req.body;

        // Validate input
        if (!full_name || !email || !phone || !city || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await db.createUser({
            full_name,
            email,
            phone,
            city,
            password_hash
        });

        // Create welcome activity
        await db.createActivity({
            user_id: user.id,
            type: 'welcome',
            title: 'تم إنشاء حسابك بنجاح',
            description: 'مرحباً بك في منصة شارك سيارتك'
        });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                city: user.city
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Get user by email
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                city: user.city
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add car
app.post('/api/cars', authenticateToken, upload.array('photos', 6), async (req, res) => {
    try {
        const carData = {
            user_id: req.user.id,
            brand: req.body.carBrand,
            model: req.body.carModel,
            year: parseInt(req.body.carYear),
            color: req.body.carColor,
            type: req.body.carType,
            transmission: req.body.transmission,
            fuel_type: req.body.fuelType,
            mileage: parseInt(req.body.mileage),
            daily_rate: parseFloat(req.body.dailyRate),
            weekly_rate: req.body.weeklyRate ? parseFloat(req.body.weeklyRate) : null,
            monthly_rate: req.body.monthlyRate ? parseFloat(req.body.monthlyRate) : null,
            deposit: parseFloat(req.body.deposit),
            available_from: req.body.availableFrom,
            available_to: req.body.availableTo,
            location: req.body.location,
            pickup_location: req.body.pickupLocation,
            description: req.body.carDescription,
            features: req.body.features ? JSON.parse(req.body.features) : []
        };

        // Create car
        const car = await db.createCar(carData);

        // Save photos
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = path.extname(file.originalname);
                const filename = 'car-' + uniqueSuffix + ext;
                
                await db.saveCarPhoto({
                    car_id: car.id,
                    filename: filename,
                    original_name: file.originalname,
                    file_size: file.size,
                    mime_type: file.mimetype,
                    buffer: file.buffer
                });
            }
        }

        // Create activity
        await db.createActivity({
            user_id: req.user.id,
            type: 'car_added',
            title: 'تم إضافة سيارة جديدة',
            description: `${car.brand} ${car.model} ${car.year}`
        });

        res.status(201).json({
            success: true,
            message: 'تم إضافة السيارة بنجاح',
            car: { ...car, id: car.id }
        });

    } catch (error) {
        console.error('Add car error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's cars
app.get('/api/cars', authenticateToken, async (req, res) => {
    try {
        const cars = await db.getCarsByUserId(req.user.id);
        
        // Get photos for each car
        for (let car of cars) {
            const photos = await db.getCarPhotos(car.id);
            car.photos = photos;
        }

        res.json({ cars });
    } catch (error) {
        console.error('Get cars error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get car by ID
app.get('/api/cars/:id', authenticateToken, async (req, res) => {
    try {
        const car = await db.getCarById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check if user owns this car
        if (car.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get photos
        const photos = await db.getCarPhotos(car.id);
        car.photos = photos;

        res.json({ car });
    } catch (error) {
        console.error('Get car error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update car status
app.patch('/api/cars/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const carId = req.params.id;

        // Get car to check ownership
        const car = await db.getCarById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        if (car.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update status
        await db.updateCarStatus(carId, status);

        // Create activity
        await db.createActivity({
            user_id: req.user.id,
            type: 'car_status_changed',
            title: status === 'active' ? 'تم تفعيل السيارة' : 'تم إيقاف السيارة',
            description: `${car.brand} ${car.model} ${car.year}`
        });

        res.json({
            success: true,
            message: status === 'active' ? 'تم تفعيل السيارة' : 'تم إيقاف السيارة'
        });

    } catch (error) {
        console.error('Update car status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete car
app.delete('/api/cars/:id', authenticateToken, async (req, res) => {
    try {
        const carId = req.params.id;

        // Get car to check ownership
        const car = await db.getCarById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        if (car.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete car (photos will be deleted automatically due to CASCADE)
        await db.deleteCar(carId);

        // Create activity
        await db.createActivity({
            user_id: req.user.id,
            type: 'car_deleted',
            title: 'تم حذف سيارة',
            description: `${car.brand} ${car.model} ${car.year}`
        });

        res.json({
            success: true,
            message: 'تم حذف السيارة بنجاح'
        });

    } catch (error) {
        console.error('Delete car error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await db.getDashboardStats(req.user.id);
        res.json({ stats });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user activities
app.get('/api/activities', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const activities = await db.getActivitiesByUserId(req.user.id, limit);
        res.json({ activities });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== BOOKING ENDPOINTS =====

// Create booking (renter)
app.post('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const {
            car_id,
            start_date,
            end_date,
            pickup_location,
            return_location,
            renter_notes
        } = req.body;

        // Validate required fields
        if (!car_id || !start_date || !end_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get car details
        const car = await db.getCarById(car_id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check if car is available
        if (car.status !== 'active') {
            return res.status(400).json({ error: 'Car is not available for booking' });
        }

        // Calculate total amount and deposit
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const total_amount = days * car.daily_rate;
        const deposit_amount = car.deposit;

        // Create booking
        const booking = await db.createBooking({
            car_id,
            renter_id: req.user.id,
            start_date,
            end_date,
            total_amount,
            deposit_amount,
            pickup_location,
            return_location,
            renter_notes
        });

        // Create activity for renter
        await db.createActivity({
            user_id: req.user.id,
            type: 'booking_created',
            title: 'تم إنشاء حجز جديد',
            description: `${car.brand} ${car.model} ${car.year} - ${start_date} إلى ${end_date}`
        });

        // Create activity for car owner
        await db.createActivity({
            user_id: car.user_id,
            type: 'booking_request',
            title: 'طلب حجز جديد',
            description: `طلب حجز لسيارة ${car.brand} ${car.model} ${car.year} من ${req.user.full_name}`
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحجز بنجاح',
            booking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get bookings for renter
app.get('/api/bookings/renter', authenticateToken, async (req, res) => {
    try {
        const bookings = await db.getBookingsByRenterId(req.user.id);
        res.json({ bookings });
    } catch (error) {
        console.error('Get renter bookings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get bookings for car owner
app.get('/api/bookings/owner', authenticateToken, async (req, res) => {
    try {
        const bookings = await db.getBookingsByOwnerId(req.user.id);
        res.json({ bookings });
    } catch (error) {
        console.error('Get owner bookings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get booking by ID
app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await db.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user has access to this booking
        if (booking.renter_id !== req.user.id && booking.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ booking });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update booking status (car owner only)
app.patch('/api/bookings/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status, owner_notes } = req.body;
        const bookingId = req.params.id;

        // Get booking details
        const booking = await db.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user is the car owner
        if (booking.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Update booking status
        await db.updateBookingStatus(bookingId, status, owner_notes);

        // Create activity for owner
        await db.createActivity({
            user_id: req.user.id,
            type: 'booking_status_updated',
            title: `تم ${status === 'approved' ? 'الموافقة على' : status === 'rejected' ? 'رفض' : 'تحديث'} الحجز`,
            description: `حجز سيارة ${booking.brand} ${booking.model} ${booking.year}`
        });

        // Create activity for renter
        await db.createActivity({
            user_id: booking.renter_id,
            type: 'booking_status_updated',
            title: `تم ${status === 'approved' ? 'الموافقة على' : status === 'rejected' ? 'رفض' : 'تحديث'} حجزك`,
            description: `حجز سيارة ${booking.brand} ${booking.model} ${booking.year}`
        });

        res.json({
            success: true,
            message: 'تم تحديث حالة الحجز بنجاح'
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get car photos
app.get('/api/cars/:id/photos', authenticateToken, async (req, res) => {
    try {
        const carId = req.params.id;
        const photos = await db.getCarPhotos(carId);
        res.json({ photos });
    } catch (error) {
        console.error('Get car photos error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== REVIEW ENDPOINTS =====

// Create review
app.post('/api/reviews', authenticateToken, async (req, res) => {
    try {
        const {
            booking_id,
            car_id,
            rating,
            cleanliness_rating,
            condition_rating,
            communication_rating,
            comment,
            review_type
        } = req.body;

        // Validate required fields
        if (!booking_id || !car_id || !rating || !review_type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Get booking details
        const booking = await db.getBookingById(booking_id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user has permission to review
        if (review_type === 'renter_to_owner') {
            if (booking.renter_id !== req.user.id) {
                return res.status(403).json({ error: 'Access denied' });
            }
        } else if (review_type === 'owner_to_renter') {
            if (booking.owner_id !== req.user.id) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        // Check if review already exists for this booking and type
        const existingReviews = await db.getReviewByBookingId(booking_id);
        const existingReview = existingReviews.find(review => review.review_type === review_type);
        if (existingReview) {
            return res.status(400).json({ error: 'Review already exists for this booking' });
        }

        // Create review
        const review = await db.createReview({
            booking_id,
            car_id,
            renter_id: booking.renter_id,
            owner_id: booking.owner_id,
            rating: parseInt(rating),
            cleanliness_rating: cleanliness_rating ? parseInt(cleanliness_rating) : null,
            condition_rating: condition_rating ? parseInt(condition_rating) : null,
            communication_rating: communication_rating ? parseInt(communication_rating) : null,
            comment,
            review_type
        });

        // Create activity
        await db.createActivity({
            user_id: req.user.id,
            type: 'review_created',
            title: 'تم إضافة تقييم جديد',
            description: `تقييم ${rating}/5 نجوم`
        });

        res.status(201).json({
            success: true,
            message: 'تم إضافة التقييم بنجاح',
            review
        });

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get reviews by car ID
app.get('/api/cars/:id/reviews', authenticateToken, async (req, res) => {
    try {
        const carId = req.params.id;
        const reviews = await db.getReviewsByCarId(carId);
        const averageRating = await db.getAverageRatingByCarId(carId);
        
        res.json({ 
            reviews, 
            average_rating: averageRating 
        });
    } catch (error) {
        console.error('Get car reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user reviews
app.get('/api/reviews/user', authenticateToken, async (req, res) => {
    try {
        const { type } = req.query; // 'given', 'received', or null for all
        const reviews = await db.getReviewsByUserId(req.user.id, type);
        
        res.json({ reviews });
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update review
app.put('/api/reviews/:id', authenticateToken, async (req, res) => {
    try {
        const reviewId = req.params.id;
        const {
            rating,
            cleanliness_rating,
            condition_rating,
            communication_rating,
            comment
        } = req.body;

        // Get existing review
        const reviews = await db.getReviewsByUserId(req.user.id);
        const existingReview = reviews.find(review => review.id === reviewId);
        
        if (!existingReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user owns this review
        if (existingReview.renter_id !== req.user.id && existingReview.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update review
        const updatedReview = await db.updateReview(reviewId, {
            rating: rating ? parseInt(rating) : existingReview.rating,
            cleanliness_rating: cleanliness_rating ? parseInt(cleanliness_rating) : existingReview.cleanliness_rating,
            condition_rating: condition_rating ? parseInt(condition_rating) : existingReview.condition_rating,
            communication_rating: communication_rating ? parseInt(communication_rating) : existingReview.communication_rating,
            comment: comment || existingReview.comment
        });

        res.json({
            success: true,
            message: 'تم تحديث التقييم بنجاح',
            review: updatedReview
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete review
app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
    try {
        const reviewId = req.params.id;

        // Get existing review
        const reviews = await db.getReviewsByUserId(req.user.id);
        const existingReview = reviews.find(review => review.id === reviewId);
        
        if (!existingReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if user owns this review
        if (existingReview.renter_id !== req.user.id && existingReview.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete review
        await db.deleteReview(reviewId);

        res.json({
            success: true,
            message: 'تم حذف التقييم بنجاح'
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Booking Photos Endpoints (Optional feature for renters after approval)
// Upload booking photos
app.post('/api/bookings/:id/photos', authenticateToken, upload.array('photos', 10), async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { description, photo_type } = req.body;
        
        // Get booking details
        const booking = await db.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        // Check if user is the renter of this booking
        if (booking.renter_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. Only the renter can upload photos.' });
        }
        
        // Check if booking is approved (owner has approved)
        if (booking.status !== 'approved') {
            return res.status(400).json({ error: 'Photos can only be uploaded after the booking is approved by the owner.' });
        }
        
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No photos uploaded' });
        }
        
        const uploadedPhotos = [];
        
        // Upload each photo
        for (const file of req.files) {
            const photoData = {
                file,
                description: description || '',
                photo_type: photo_type || 'general'
            };
            
            const photo = await db.saveBookingPhoto(bookingId, photoData);
            uploadedPhotos.push(photo);
        }
        
        res.json({
            success: true,
            message: 'تم رفع الصور بنجاح',
            photos: uploadedPhotos
        });
        
    } catch (error) {
        console.error('Upload booking photos error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get booking photos
app.get('/api/bookings/:id/photos', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        // Get booking details
        const booking = await db.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        // Check if user is the renter or owner of this booking
        if (booking.renter_id !== req.user.id && booking.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Get photos
        const photos = await db.getBookingPhotos(bookingId);
        
        res.json({
            success: true,
            photos: photos
        });
        
    } catch (error) {
        console.error('Get booking photos error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete booking photo
app.delete('/api/bookings/:id/photos/:photoId', authenticateToken, async (req, res) => {
    try {
        const { id: bookingId, photoId } = req.params;
        
        // Get booking details
        const booking = await db.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        // Check if user is the renter of this booking
        if (booking.renter_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. Only the renter can delete photos.' });
        }
        
        // Get photo details to verify it belongs to this booking
        const photos = await db.getBookingPhotos(bookingId);
        const photo = photos.find(p => p.id === photoId);
        
        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        // Delete photo
        await db.deleteBookingPhoto(photoId);
        
        res.json({
            success: true,
            message: 'تم حذف الصورة بنجاح'
        });
        
    } catch (error) {
        console.error('Delete booking photo error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== NOTIFICATION ENDPOINTS =====

// Get user notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const notifications = await db.getNotificationsByUserId(req.user.id, limit);
        
        res.json({
            success: true,
            notifications: notifications
        });
        
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get unread notifications count
app.get('/api/notifications/unread-count', authenticateToken, async (req, res) => {
    try {
        const count = await db.getUnreadNotificationsCount(req.user.id);
        
        res.json({
            success: true,
            count: count
        });
        
    } catch (error) {
        console.error('Get unread notifications count error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        // Verify notification belongs to user
        const notifications = await db.getNotificationsByUserId(req.user.id, 1000);
        const notification = notifications.find(n => n.id === notificationId);
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        await db.markNotificationAsRead(notificationId);
        
        res.json({
            success: true,
            message: 'تم تحديث الإشعار'
        });
        
    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark all notifications as read
app.put('/api/notifications/mark-all-read', authenticateToken, async (req, res) => {
    try {
        const result = await db.markAllNotificationsAsRead(req.user.id);
        
        res.json({
            success: true,
            message: 'تم تحديث جميع الإشعارات',
            updated_count: result.updated_count
        });
        
    } catch (error) {
        console.error('Mark all notifications as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete notification
app.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        // Verify notification belongs to user
        const notifications = await db.getNotificationsByUserId(req.user.id, 1000);
        const notification = notifications.find(n => n.id === notificationId);
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        // Delete notification
        const notificationRef = ref(db.db, `notifications/${notificationId}`);
        await remove(notificationRef);
        
        res.json({
            success: true,
            message: 'تم حذف الإشعار'
        });
        
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get car by ID (for details page)
app.get('/api/cars/:id', authenticateToken, async (req, res) => {
    try {
        const carId = req.params.id;
        const car = await db.getCarById(carId);
        
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        // Get car photos
        const photos = await db.getCarPhotos(carId);
        
        // Get owner information
        const owner = await db.getUserById(car.user_id);
        
        // Get car reviews and average rating
        const reviews = await db.getReviewsByCarId(carId);
        const averageRating = await db.getAverageRatingByCarId(carId);
        
        // Combine car data with photos, owner info, and reviews
        const carData = {
            ...car,
            photos: photos,
            owner_name: owner ? owner.full_name : 'غير محدد',
            features: car.features ? JSON.parse(car.features) : [],
            reviews: reviews,
            rating: averageRating
        };
        
        res.json({ car: carData });
    } catch (error) {
        console.error('Get car details error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
        }
    }
    
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await db.close();
    process.exit(0);
});
