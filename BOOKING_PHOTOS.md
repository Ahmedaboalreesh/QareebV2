# 📸 Booking Photos Upload System

## Overview

The Booking Photos Upload System is an **optional feature** that allows renters to upload photos of the car after the car owner approves the rental request. This feature enhances transparency and documentation between renters and car owners.

## 🎯 Key Features

### Optional Upload
- **Not mandatory**: Renters can choose whether to upload photos or not
- **Post-approval only**: Photos can only be uploaded after the owner approves the booking
- **Renter-only access**: Only the renter can upload photos for their booking

### Photo Management
- **Multiple photos**: Up to 10 photos per booking
- **File size limit**: Maximum 5MB per photo
- **Supported formats**: JPG, PNG, GIF
- **Photo categorization**: Different types (general, exterior, interior, damage, condition)
- **Descriptions**: Optional text descriptions for each photo set

### Security & Access Control
- **Authentication required**: Only authenticated users can access
- **Authorization checks**: Only the renter can upload/delete photos for their booking
- **Booking validation**: Photos can only be uploaded for approved bookings

## 🗄️ Database Structure

### Firebase Realtime Database Collection: `booking_photos`

```json
{
  "booking_photos": {
    "photo_id_1": {
      "id": "photo_id_1",
      "booking_id": "booking_123",
      "file_name": "booking_photos/booking_123/1705123456789_photo1.jpg",
      "download_url": "https://firebasestorage.googleapis.com/...",
      "description": "صورة للسيارة من الأمام",
      "photo_type": "exterior",
      "uploaded_by": "renter",
      "created_at": "2024-01-15T10:00:00Z"
    }
  }
}
```

### Firebase Storage Structure
```
booking_photos/
├── booking_123/
│   ├── 1705123456789_photo1.jpg
│   ├── 1705123456790_photo2.jpg
│   └── 1705123456791_photo3.jpg
└── booking_456/
    ├── 1705123456792_photo1.jpg
    └── 1705123456793_photo2.jpg
```

## 🔧 API Endpoints

### 1. Upload Booking Photos
```http
POST /api/bookings/{bookingId}/photos
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

Form Data:
- photos: [file1, file2, ...] (up to 10 images, max 5MB each)
- photo_type: "general" | "exterior" | "interior" | "damage" | "condition"
- description: "Optional description of the photos"
```

**Response:**
```json
{
  "success": true,
  "message": "تم رفع الصور بنجاح",
  "photos": [
    {
      "id": "photo-id",
      "booking_id": "booking-id",
      "file_name": "booking_photos/booking-id/timestamp_filename.jpg",
      "download_url": "https://firebasestorage.googleapis.com/...",
      "description": "صور للسيارة",
      "photo_type": "general",
      "uploaded_by": "renter",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 2. Get Booking Photos
```http
GET /api/bookings/{bookingId}/photos
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "photos": [
    {
      "id": "photo-id",
      "booking_id": "booking-id",
      "file_name": "booking_photos/booking-id/timestamp_filename.jpg",
      "download_url": "https://firebasestorage.googleapis.com/...",
      "description": "صور للسيارة",
      "photo_type": "general",
      "uploaded_by": "renter",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 3. Delete Booking Photo
```http
DELETE /api/bookings/{bookingId}/photos/{photoId}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "تم حذف الصورة بنجاح"
}
```

## 🎨 User Interface

### Upload Page (`upload-booking-photos.html`)
- **Booking Information Display**: Shows booking details at the top
- **File Upload Form**: Multiple file selection with drag-and-drop support
- **Photo Type Selection**: Dropdown for categorizing photos
- **Description Field**: Optional text description with character counter
- **Upload Guidelines**: Helpful tips for users
- **Existing Photos Display**: Shows previously uploaded photos
- **Photo Management**: Delete individual photos

### Integration Points
- **My Bookings Page**: "Upload Photos" button for approved bookings
- **Booking Details**: View uploaded photos in booking information
- **Navigation**: Seamless integration with existing navigation

## 🔒 Security Features

### Authentication & Authorization
- **JWT Token Required**: All endpoints require valid authentication
- **Renter-Only Upload**: Only the booking renter can upload photos
- **Owner-Only View**: Car owners can view photos for their bookings
- **Booking Status Validation**: Photos only allowed for approved bookings

### File Validation
- **File Type Check**: Only image files allowed
- **File Size Limit**: Maximum 5MB per file
- **File Count Limit**: Maximum 10 files per upload
- **Malware Protection**: File content validation

### Data Protection
- **Secure Storage**: Files stored in Firebase Storage with proper access controls
- **Metadata Security**: Photo metadata stored in Firebase Realtime Database
- **URL Expiration**: Download URLs can be configured with expiration

## 🧪 Testing

### Test Script: `test-booking-photos.js`
```bash
npm run test-booking-photos
```

**Test Coverage:**
- ✅ Photo upload functionality
- ✅ Photo retrieval functionality
- ✅ Photo deletion functionality
- ✅ Error handling for non-existent resources
- ✅ Firebase Storage integration
- ✅ Database metadata storage

### Manual Testing Scenarios
1. **Upload Photos**: Test uploading multiple photos with different types
2. **View Photos**: Verify photos display correctly in the UI
3. **Delete Photos**: Test individual photo deletion
4. **Authorization**: Test access control for different user types
5. **File Validation**: Test various file types and sizes
6. **Error Handling**: Test error scenarios and edge cases

## 📱 User Experience

### Upload Flow
1. **Access**: User clicks "Upload Photos" button on approved booking
2. **Validation**: System checks booking status and user permissions
3. **Selection**: User selects photos and categorizes them
4. **Upload**: Photos are uploaded to Firebase Storage
5. **Confirmation**: User receives success message and can view uploaded photos

### Photo Types
- **General**: General photos of the car
- **Exterior**: External photos of the car
- **Interior**: Internal photos of the car
- **Damage**: Photos documenting any damage (if applicable)
- **Condition**: Photos showing the overall condition

### Guidelines for Users
- Upload clear, high-quality photos
- Include photos from different angles
- Document any damage or issues
- Add descriptive captions when helpful
- Photos are visible to the car owner

## 🔄 Integration with Existing Systems

### Booking System
- **Status Integration**: Only available for approved bookings
- **User Integration**: Tied to specific booking and renter
- **Notification System**: Can trigger notifications to car owners

### Review System
- **Complementary Feature**: Works alongside the review system
- **Documentation**: Provides visual documentation for reviews
- **Evidence**: Can serve as evidence in case of disputes

### Dashboard Integration
- **Photo Count**: Can be displayed in booking statistics
- **Activity Log**: Photo uploads can be logged in user activity

## 🚀 Future Enhancements

### Potential Improvements
- **Photo Compression**: Automatic image optimization
- **Photo Editing**: Basic editing tools (crop, rotate, filters)
- **Bulk Operations**: Select and delete multiple photos
- **Photo Albums**: Organize photos into albums
- **Sharing**: Share photos with other users
- **Analytics**: Track photo upload patterns and usage

### Advanced Features
- **AI Analysis**: Automatic damage detection
- **Photo Verification**: Verify photo authenticity
- **Geolocation**: Add location data to photos
- **Timestamps**: Automatic timestamp overlay
- **Watermarking**: Add platform watermark to photos

## 📊 Performance Considerations

### Storage Optimization
- **File Compression**: Automatic image compression
- **CDN Integration**: Use CDN for faster photo delivery
- **Caching**: Implement proper caching strategies
- **Cleanup**: Regular cleanup of unused photos

### Database Optimization
- **Indexing**: Proper indexing on booking_id and user_id
- **Pagination**: Implement pagination for large photo collections
- **Query Optimization**: Efficient queries for photo retrieval

## 🔧 Configuration

### Environment Variables
```env
# Firebase Configuration
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_client_cert_url

# Upload Limits
MAX_PHOTOS_PER_BOOKING=10
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```

### Firebase Rules
```javascript
// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /booking_photos/{bookingId}/{fileName} {
      allow read: if request.auth != null && 
        (resource.metadata.renter_id == request.auth.uid || 
         resource.metadata.owner_id == request.auth.uid);
      allow write: if request.auth != null && 
        request.resource.metadata.renter_id == request.auth.uid;
    }
  }
}
```

## 📝 Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size and type restrictions
2. **Photos Not Displaying**: Verify Firebase Storage permissions
3. **Access Denied**: Ensure user is the booking renter
4. **Storage Quota**: Monitor Firebase Storage usage

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check Firebase console for storage and database errors
4. Validate JWT token and user permissions
5. Test with different file types and sizes

---

**Note**: This feature is designed to be optional and user-friendly, providing additional documentation capabilities without being mandatory for the booking process.
