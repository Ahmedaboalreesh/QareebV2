# 🔥 API Documentation - Firebase Integration

This document describes the API endpoints for the car rental platform with Firebase Realtime Database and Storage integration.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Structure

### Collections
- `users` - User accounts and profiles
- `cars` - Car listings and details
- `car_photos` - Car photos metadata and storage URLs
- `bookings` - Booking records and status
- `activities` - User activity logs

## User Management

### Register User
```http
POST /api/register
Content-Type: application/json

{
  "full_name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "city": "الرياض",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": "userId123",
    "full_name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "city": "الرياض"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "user": {
    "id": "userId123",
    "full_name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "city": "الرياض"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "userId123",
    "full_name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "city": "الرياض",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Car Management

### Add Car
```http
POST /api/cars
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "carBrand": "تويوتا",
  "carModel": "كامري",
  "carYear": "2022",
  "carColor": "أبيض",
  "carType": "سيدان",
  "transmission": "أوتوماتيك",
  "fuelType": "بنزين",
  "mileage": "50000",
  "dailyRate": "200",
  "weeklyRate": "1200",
  "monthlyRate": "4500",
  "deposit": "1000",
  "availableFrom": "2024-01-01",
  "availableTo": "2024-12-31",
  "location": "الرياض",
  "pickupLocation": "مطار الملك خالد",
  "carDescription": "سيارة ممتازة للاستئجار",
  "features": "[\"مكيف\", \"GPS\", \"بلوتوث\"]",
  "photos": [File1, File2, File3] // Up to 6 images, 5MB each
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إضافة السيارة بنجاح",
  "car": {
    "id": "carId123",
    "user_id": "userId123",
    "brand": "تويوتا",
    "model": "كامري",
    "year": 2022,
    "color": "أبيض",
    "type": "سيدان",
    "transmission": "أوتوماتيك",
    "fuel_type": "بنزين",
    "mileage": 50000,
    "daily_rate": 200,
    "weekly_rate": 1200,
    "monthly_rate": 4500,
    "deposit": 1000,
    "available_from": "2024-01-01",
    "available_to": "2024-12-31",
    "location": "الرياض",
    "pickup_location": "مطار الملك خالد",
    "description": "سيارة ممتازة للاستئجار",
    "features": ["مكيف", "GPS", "بلوتوث"],
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User's Cars
```http
GET /api/cars
Authorization: Bearer <token>
```

**Response:**
```json
{
  "cars": [
    {
      "id": "carId123",
      "user_id": "userId123",
      "brand": "تويوتا",
      "model": "كامري",
      "year": 2022,
      "color": "أبيض",
      "type": "سيدان",
      "transmission": "أوتوماتيك",
      "fuel_type": "بنزين",
      "mileage": 50000,
      "daily_rate": 200,
      "weekly_rate": 1200,
      "monthly_rate": 4500,
      "deposit": 1000,
      "available_from": "2024-01-01",
      "available_to": "2024-12-31",
      "location": "الرياض",
      "pickup_location": "مطار الملك خالد",
      "description": "سيارة ممتازة للاستئجار",
      "features": ["مكيف", "GPS", "بلوتوث"],
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "photo_count": 3,
      "photos": [
        {
          "id": "photoId123",
          "car_id": "carId123",
          "filename": "car-1234567890.jpg",
          "original_name": "car-front.jpg",
          "file_size": 1024000,
          "mime_type": "image/jpeg",
          "download_url": "https://firebasestorage.googleapis.com/...",
          "storage_path": "car-photos/carId123/car-1234567890.jpg",
          "upload_date": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

### Get Car Details
```http
GET /api/cars/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "car": {
    "id": "carId123",
    "user_id": "userId123",
    "brand": "تويوتا",
    "model": "كامري",
    "year": 2022,
    "color": "أبيض",
    "type": "سيدان",
    "transmission": "أوتوماتيك",
    "fuel_type": "بنزين",
    "mileage": 50000,
    "daily_rate": 200,
    "weekly_rate": 1200,
    "monthly_rate": 4500,
    "deposit": 1000,
    "available_from": "2024-01-01",
    "available_to": "2024-12-31",
    "location": "الرياض",
    "pickup_location": "مطار الملك خالد",
    "description": "سيارة ممتازة للاستئجار",
    "features": ["مكيف", "GPS", "بلوتوث"],
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "photos": [
      {
        "id": "photoId123",
        "car_id": "carId123",
        "filename": "car-1234567890.jpg",
        "original_name": "car-front.jpg",
        "file_size": 1024000,
        "mime_type": "image/jpeg",
        "download_url": "https://firebasestorage.googleapis.com/...",
        "storage_path": "car-photos/carId123/car-1234567890.jpg",
        "upload_date": "2024-01-01T00:00:00.000Z"
      }
    ],
    "owner_name": "أحمد محمد"
  }
}
```

### Update Car Status
```http
PATCH /api/cars/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إيقاف السيارة"
}
```

### Delete Car
```http
DELETE /api/cars/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "تم حذف السيارة بنجاح"
}
```

## Booking Management

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "car_id": "carId123",
  "start_date": "2024-01-15",
  "end_date": "2024-01-17",
  "pickup_location": "مطار الملك خالد",
  "return_location": "مطار الملك خالد",
  "renter_notes": "أحتاج سيارة للعمل"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الحجز بنجاح",
  "booking": {
    "id": "bookingId123",
    "car_id": "carId123",
    "renter_id": "userId123",
    "start_date": "2024-01-15",
    "end_date": "2024-01-17",
    "total_amount": 400,
    "deposit_amount": 1000,
    "pickup_location": "مطار الملك خالد",
    "return_location": "مطار الملك خالد",
    "renter_notes": "أحتاج سيارة للعمل",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Renter Bookings
```http
GET /api/bookings/renter
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "bookingId123",
      "car_id": "carId123",
      "renter_id": "userId123",
      "start_date": "2024-01-15",
      "end_date": "2024-01-17",
      "total_amount": 400,
      "deposit_amount": 1000,
      "pickup_location": "مطار الملك خالد",
      "return_location": "مطار الملك خالد",
      "renter_notes": "أحتاج سيارة للعمل",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "brand": "تويوتا",
      "model": "كامري",
      "year": 2022,
      "daily_rate": 200,
      "deposit": 1000,
      "owner_name": "أحمد محمد",
      "owner_phone": "+966501234567"
    }
  ]
}
```

### Get Owner Bookings
```http
GET /api/bookings/owner
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "bookingId123",
      "car_id": "carId123",
      "renter_id": "userId456",
      "start_date": "2024-01-15",
      "end_date": "2024-01-17",
      "total_amount": 400,
      "deposit_amount": 1000,
      "pickup_location": "مطار الملك خالد",
      "return_location": "مطار الملك خالد",
      "renter_notes": "أحتاج سيارة للعمل",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "brand": "تويوتا",
      "model": "كامري",
      "year": 2022,
      "daily_rate": 200,
      "renter_name": "محمد أحمد",
      "renter_email": "mohamed@example.com",
      "renter_phone": "+966501234568"
    }
  ]
}
```

### Update Booking Status
```http
PATCH /api/bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "owner_notes": "موافق على الحجز"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث حالة الحجز بنجاح"
}
```

## Dashboard & Analytics

### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "stats": {
    "cars_count": 3,
    "active_bookings": 2,
    "monthly_earnings": 1200
  }
}
```

### Get User Activities
```http
GET /api/activities?limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "activities": [
    {
      "id": "activityId123",
      "user_id": "userId123",
      "type": "car_added",
      "title": "تم إضافة سيارة جديدة",
      "description": "تويوتا كامري 2022",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Responses

### Validation Error
```json
{
  "error": "All fields are required"
}
```

### Authentication Error
```json
{
  "error": "Access token required"
}
```

### Authorization Error
```json
{
  "error": "Access denied"
}
```

### Not Found Error
```json
{
  "error": "Car not found"
}
```

### Server Error
```json
{
  "error": "Internal server error"
}
```

## File Upload

### Supported Formats
- **Images**: JPEG, PNG, GIF, WebP
- **Max Size**: 5MB per file
- **Max Files**: 6 photos per car

### Storage
- Files are stored in Firebase Storage
- Download URLs are generated automatically
- Files are organized by car ID

## Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to all API endpoints

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation
- File type validation

## Firebase Integration Notes

### Database Operations
- All data is stored in Firebase Realtime Database
- Real-time synchronization
- Automatic indexing for queries
- Offline support

### File Storage
- Images stored in Firebase Storage
- Automatic CDN distribution
- Secure download URLs
- Automatic cleanup on deletion

### Security Rules
- Database rules enforce access control
- Storage rules protect file access
- User data isolation
- Admin-only operations protected

---

**Note**: This API is designed to work with Firebase Realtime Database and Storage for optimal performance and scalability.

## Review Management

### Create Review
```http
POST /api/reviews
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "booking_id": "booking-id",
  "car_id": "car-id",
  "rating": 5,
  "cleanliness_rating": 5,
  "condition_rating": 4,
  "communication_rating": 5,
  "comment": "تجربة ممتازة، السيارة نظيفة والمالك متعاون",
  "review_type": "renter_to_owner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إضافة التقييم بنجاح",
  "review": {
    "id": "review-id",
    "booking_id": "booking-id",
    "car_id": "car-id",
    "renter_id": "renter-id",
    "owner_id": "owner-id",
    "rating": 5,
    "cleanliness_rating": 5,
    "condition_rating": 4,
    "communication_rating": 5,
    "comment": "تجربة ممتازة، السيارة نظيفة والمالك متعاون",
    "review_type": "renter_to_owner",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Get Car Reviews
```http
GET /api/cars/{carId}/reviews
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "review-id",
      "reviewer_name": "محمد أحمد",
      "rating": 5,
      "comment": "تجربة ممتازة",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "average_rating": {
    "average_rating": 4.8,
    "total_reviews": 10,
    "rating_breakdown": {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    }
  }
}
```

### Get User Reviews
```http
GET /api/reviews/user?type=given
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `type`: `given` (التقييمات المقدمة), `received` (التقييمات المستلمة), or null (جميع التقييمات)

### Update Review
```http
PUT /api/reviews/{reviewId}
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "rating": 4,
  "comment": "تقييم محدث"
}
```

### Delete Review
```http
DELETE /api/reviews/{reviewId}
Authorization: Bearer <jwt-token>
```

## Booking Photos Management (Optional Feature)

### Upload Booking Photos
**POST** `/api/bookings/:id/photos`

Upload photos for a specific booking (renter only, after approval).

**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
- `photos` (files): Image files (max 10 files, 5MB each)
- `photo_type` (string): Type of photos (general, exterior, interior, damage, condition)
- `description` (string): Description of photos (optional, max 500 chars)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم رفع الصور بنجاح",
  "photos": [
    {
      "id": "photoId",
      "booking_id": "bookingId",
      "file_name": "booking_photos/bookingId/timestamp_filename.jpg",
      "download_url": "https://firebasestorage.googleapis.com/...",
      "description": "وصف الصور",
      "photo_type": "general",
      "uploaded_by": "renter",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Response (Error - 400/403/404):**
```json
{
  "error": "Error message"
}
```

### Get Booking Photos
**GET** `/api/bookings/:id/photos`

Get all photos for a specific booking (renter or owner).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "photos": [
    {
      "id": "photoId",
      "booking_id": "bookingId",
      "file_name": "booking_photos/bookingId/timestamp_filename.jpg",
      "download_url": "https://firebasestorage.googleapis.com/...",
      "description": "وصف الصور",
      "photo_type": "general",
      "uploaded_by": "renter",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Delete Booking Photo
**DELETE** `/api/bookings/:id/photos/:photoId`

Delete a specific photo from a booking (renter only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم حذف الصورة بنجاح"
}
```

## Notification System

### Get User Notifications
**GET** `/api/notifications?limit=20&offset=0`

Get user notifications with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number): Number of notifications to return (default: 20)
- `offset` (number): Number of notifications to skip (default: 0)

**Response (Success - 200):**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notificationId",
      "user_id": "userId",
      "type": "photo_uploaded",
      "title": "تم رفع صور جديدة للحجز",
      "description": "قام أحمد محمد برفع صور جديدة لحجز سيارة تويوتا كامري 2023",
      "related_id": "bookingId",
      "related_type": "booking",
      "is_read": false,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Unread Notifications Count
**GET** `/api/notifications/unread-count`

Get count of unread notifications for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 5
}
```

### Mark Notification as Read
**PUT** `/api/notifications/:id/read`

Mark a specific notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم تحديث الإشعار"
}
```

### Mark All Notifications as Read
**PUT** `/api/notifications/mark-all-read`

Mark all user notifications as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم تحديث جميع الإشعارات",
  "updated_count": 10
}
```

### Delete Notification
**DELETE** `/api/notifications/:id`

Delete a specific notification.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم حذف الإشعار"
}
```

### Notification Types

| Type | Description | Icon |
|------|-------------|------|
| `photo_uploaded` | إشعار رفع الصور | 📷 |
| `booking_status_updated` | إشعار تحديث حالة الحجز | 📅 |
| `review_received` | إشعار التقييمات | ⭐ |
| `booking_created` | إشعار الحجوزات الجديدة | ➕ |
| `payment_received` | إشعار الدفع | 💰 |

### Important Notes

1. **Authentication Required**: All notification endpoints require valid JWT token
2. **User Isolation**: Users can only access their own notifications
3. **Automatic Creation**: Photo upload notifications are created automatically when photos are uploaded
4. **Real-time Updates**: Notification badge updates in real-time across all pages
5. **Pagination**: Notifications support pagination for better performance
6. **Error Handling**: All endpoints include comprehensive error handling
