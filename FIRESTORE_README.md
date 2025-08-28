# Firestore Database Implementation - منصة تأجير السيارات

## نظرة عامة | Overview

تم تنفيذ قاعدة بيانات Firestore شاملة لمنصة تأجير السيارات. النظام يدعم إدارة كاملة للبيانات مع ميزات متقدمة مثل الاستماع للتغييرات في الوقت الفعلي والبحث المتقدم.

## الملفات المتاحة | Available Files

### 1. `firestore-service.js` - الخدمة الرئيسية
الخدمة الأساسية التي تدير جميع عمليات قاعدة البيانات.

### 2. `firestore-examples.js` - أمثلة الاستخدام
أمثلة شاملة لجميع وظائف قاعدة البيانات.

### 3. `test-firestore.html` - صفحة الاختبار التفاعلية
صفحة ويب لاختبار جميع وظائف قاعدة البيانات مباشرة.

## هيكل قاعدة البيانات | Database Structure

### Collections | المجموعات

#### 1. `users` - ملفات المستخدمين
```javascript
{
  userId: "string",           // معرف المستخدم
  fullName: "string",         // الاسم الكامل
  email: "string",           // البريد الإلكتروني
  phone: "string",           // رقم الهاتف
  city: "string",            // المدينة
  userType: "renter|owner",  // نوع المستخدم
  profilePhoto: "string",    // صورة الملف الشخصي
  licenseNumber: "string",   // رقم الرخصة
  isVerified: "boolean",     // هل تم التحقق
  isActive: "boolean",       // هل الحساب نشط
  createdAt: "timestamp",    // تاريخ الإنشاء
  updatedAt: "timestamp"     // تاريخ التحديث
}
```

#### 2. `cars` - السيارات
```javascript
{
  ownerId: "string",         // معرف المالك
  brand: "string",          // الماركة
  model: "string",          // الموديل
  year: "number",           // سنة الصنع
  color: "string",          // اللون
  licensePlate: "string",   // رقم اللوحة
  city: "string",           // المدينة
  pricePerDay: "number",    // السعر اليومي
  pricePerHour: "number",   // السعر بالساعة
  description: "string",    // الوصف
  features: ["array"],      // الميزات
  photos: ["array"],        // الصور
  fuelType: "string",       // نوع الوقود
  transmission: "string",   // نوع الناقل
  seats: "number",          // عدد المقاعد
  mileage: "number",        // المسافة المقطوعة
  isAvailable: "boolean",   // هل متاح
  status: "active|inactive", // الحالة
  createdAt: "timestamp",   // تاريخ الإنشاء
  updatedAt: "timestamp"    // تاريخ التحديث
}
```

#### 3. `bookings` - الحجوزات
```javascript
{
  carId: "string",          // معرف السيارة
  renterId: "string",       // معرف المستأجر
  ownerId: "string",        // معرف المالك
  startDate: "timestamp",   // تاريخ البداية
  endDate: "timestamp",     // تاريخ النهاية
  totalDays: "number",      // عدد الأيام
  totalPrice: "number",     // السعر الإجمالي
  pickupLocation: "string", // موقع الاستلام
  returnLocation: "string", // موقع الإرجاع
  specialRequests: "string", // طلبات خاصة
  insurance: "boolean",     // التأمين
  deposit: "number",        // الوديعة
  status: "pending|confirmed|completed|cancelled", // حالة الحجز
  createdAt: "timestamp",   // تاريخ الإنشاء
  updatedAt: "timestamp"    // تاريخ التحديث
}
```

## الوظائف المتاحة | Available Functions

### 👤 إدارة ملفات المستخدمين | User Profile Management

#### إنشاء/تحديث ملف المستخدم
```javascript
import firestoreService from './firestore-service.js';

const userData = {
  fullName: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  city: 'الرياض',
  userType: 'renter'
};

const userProfile = await firestoreService.createUserProfile('user123', userData);
```

#### الحصول على ملف المستخدم
```javascript
const userProfile = await firestoreService.getUserProfile('user123');
```

#### تحديث ملف المستخدم
```javascript
const updates = {
  city: 'جدة',
  phone: '+966501234568',
  isVerified: true
};

await firestoreService.updateUserProfile('user123', updates);
```

#### الحصول على جميع المستخدمين مع التصفية
```javascript
// جميع المستأجرين في الرياض
const renters = await firestoreService.getAllUsers({
  userType: 'renter',
  city: 'الرياض'
});

// جميع المستخدمين النشطين
const activeUsers = await firestoreService.getAllUsers({
  isActive: true
});
```

### 🚗 إدارة السيارات | Car Management

#### إضافة سيارة جديدة
```javascript
const carData = {
  ownerId: 'user123',
  brand: 'تويوتا',
  model: 'كامري',
  year: 2022,
  color: 'أبيض',
  licensePlate: 'أ ب ج 1234',
  city: 'الرياض',
  pricePerDay: 150,
  description: 'سيارة ممتازة للاستئجار'
};

const car = await firestoreService.addCar(carData);
```

#### الحصول على سيارة
```javascript
const car = await firestoreService.getCar('car123');
```

#### تحديث السيارة
```javascript
const updates = {
  pricePerDay: 180,
  isAvailable: false,
  description: 'سيارة ممتازة للاستئجار - محدثة'
};

await firestoreService.updateCar('car123', updates);
```

#### الحصول على السيارات مع التصفية
```javascript
// جميع السيارات المتاحة في الرياض
const availableCars = await firestoreService.getAvailableCars({
  city: 'الرياض'
});

// سيارات مالك معين
const ownerCars = await firestoreService.getCarsByOwner('user123');
```

#### البحث في السيارات
```javascript
const searchParams = {
  city: 'الرياض',
  brand: 'تويوتا',
  minPrice: 100,
  maxPrice: 200,
  isAvailable: true
};

const searchResults = await firestoreService.searchCars(searchParams);
```

### 📅 إدارة الحجوزات | Booking Management

#### إنشاء حجز جديد
```javascript
const bookingData = {
  carId: 'car123',
  renterId: 'user456',
  ownerId: 'user123',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-01-17'),
  totalDays: 3,
  totalPrice: 450,
  pickupLocation: 'الرياض - المطار',
  returnLocation: 'الرياض - المطار'
};

const booking = await firestoreService.createBooking(bookingData);
```

#### الحصول على الحجز
```javascript
const booking = await firestoreService.getBooking('booking123');
```

#### تحديث حالة الحجز
```javascript
await firestoreService.updateBookingStatus('booking123', 'confirmed');
```

#### الحصول على الحجوزات مع التصفية
```javascript
// حجوزات مستأجر معين
const renterBookings = await firestoreService.getBookingsByRenter('user456');

// حجوزات مالك معين
const ownerBookings = await firestoreService.getBookingsByOwner('user123');

// حجوزات سيارة معينة
const carBookings = await firestoreService.getBookingsByCar('car123');

// الحجوزات المعلقة
const pendingBookings = await firestoreService.getPendingBookings();
```

### 🔄 الاستماع للتغييرات في الوقت الفعلي | Real-time Listeners

#### الاستماع لتغييرات ملف المستخدم
```javascript
const unsubscribe = firestoreService.onUserProfileChange('user123', (userProfile) => {
  if (userProfile) {
    console.log('تم تحديث ملف المستخدم:', userProfile);
  } else {
    console.log('تم حذف ملف المستخدم');
  }
});

// إيقاف الاستماع
unsubscribe();
```

#### الاستماع لتغييرات السيارات
```javascript
const filters = {
  city: 'الرياض',
  isAvailable: true
};

const unsubscribe = firestoreService.onCarsChange((cars) => {
  console.log('تم تحديث قائمة السيارات:', cars);
}, filters);
```

#### الاستماع لتغييرات الحجوزات
```javascript
const filters = {
  renterId: 'user456',
  status: 'pending'
};

const unsubscribe = firestoreService.onBookingsChange((bookings) => {
  console.log('تم تحديث قائمة الحجوزات:', bookings);
}, filters);
```

## سير العمل الكامل | Complete Workflow

### مثال سير العمل الكامل لتأجير السيارة
```javascript
async function completeRentalWorkflow() {
  try {
    // 1. إنشاء ملفات المستخدمين
    const ownerProfile = await firestoreService.createUserProfile('owner123', {
      fullName: 'محمد أحمد',
      email: 'mohamed@example.com',
      phone: '+966501234569',
      city: 'الرياض',
      userType: 'owner'
    });

    const renterProfile = await firestoreService.createUserProfile('renter456', {
      fullName: 'فاطمة علي',
      email: 'fatima@example.com',
      phone: '+966501234570',
      city: 'الرياض',
      userType: 'renter'
    });

    // 2. إضافة سيارة
    const car = await firestoreService.addCar({
      ownerId: 'owner123',
      brand: 'هيونداي',
      model: 'سوناتا',
      year: 2023,
      color: 'أزرق',
      licensePlate: 'د ه و 5678',
      city: 'الرياض',
      pricePerDay: 120,
      description: 'سيارة فاخرة للاستئجار'
    });

    // 3. إنشاء حجز
    const booking = await firestoreService.createBooking({
      carId: car.id,
      renterId: 'renter456',
      ownerId: 'owner123',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-22'),
      totalDays: 3,
      totalPrice: 360
    });

    // 4. تحديث حالة الحجز
    await firestoreService.updateBookingStatus(booking.id, 'confirmed');

    // 5. تحديث توفر السيارة
    await firestoreService.updateCar(car.id, { isAvailable: false });

    console.log('تم إكمال سير العمل بنجاح!');
  } catch (error) {
    console.error('خطأ في سير العمل:', error);
  }
}
```

## الميزات المتقدمة | Advanced Features

### 🔍 البحث المتقدم | Advanced Search
- البحث بالمدينة والماركة والموديل
- تصفية بالسعر (حد أدنى وأقصى)
- البحث بالتوفر والحالة

### 📊 الإحصائيات | Statistics
```javascript
// عدد المستخدمين
const userCount = await firestoreService.getCollectionCount('users');

// عدد السيارات المتاحة
const availableCarsCount = await firestoreService.getCollectionCount('cars', {
  isAvailable: true
});
```

### ⏰ إدارة التواريخ | Date Management
```javascript
// تحويل Firestore timestamp إلى Date
const date = firestoreService.convertTimestamp(timestamp);

// تحويل Date إلى Firestore timestamp
const timestamp = firestoreService.convertToTimestamp(date);
```

### 🔐 التحقق من الوجود | Existence Check
```javascript
const exists = await firestoreService.documentExists('users', 'user123');
```

## الاختبار | Testing

### 1. اختبار سريع
افتح `test-firestore.html` في المتصفح لاختبار جميع الوظائف.

### 2. اختبار في وحدة التحكم
```javascript
import firestoreService from './firestore-service.js';

// اختبار إنشاء ملف مستخدم
const userProfile = await firestoreService.createUserProfile('test123', {
  fullName: 'مستخدم تجريبي',
  email: 'test@example.com',
  userType: 'renter'
});

console.log('تم إنشاء المستخدم:', userProfile);
```

## الأمان | Security

### قواعد الأمان الموصى بها
```javascript
// قواعد Firestore الأمان
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المستخدمين - يمكن للمستخدم الوصول لملفه فقط
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // السيارات - يمكن للجميع القراءة، المالك فقط التعديل
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // الحجوزات - المستأجر والمالك فقط
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.renterId || 
         request.auth.uid == resource.data.ownerId);
    }
  }
}
```

## أفضل الممارسات | Best Practices

### 1. إدارة المستمعين
```javascript
let listeners = [];

// إضافة مستمع
const unsubscribe = firestoreService.onCarsChange((cars) => {
  console.log('Cars updated:', cars);
});
listeners.push(unsubscribe);

// إيقاف جميع المستمعين
listeners.forEach(unsubscribe => unsubscribe());
listeners = [];
```

### 2. معالجة الأخطاء
```javascript
try {
  const result = await firestoreService.createUserProfile(userId, userData);
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
  // معالجة الخطأ بشكل مناسب
}
```

### 3. تحسين الأداء
```javascript
// استخدام التصفية لتقليل البيانات المحملة
const cars = await firestoreService.getAllCars({
  city: 'الرياض',
  isAvailable: true
});

// إيقاف المستمعين عند عدم الحاجة
useEffect(() => {
  const unsubscribe = firestoreService.onCarsChange(setCars);
  return () => unsubscribe();
}, []);
```

## الدعم | Support

للمساعدة أو الاستفسارات:
1. راجع ملفات الأمثلة
2. اختبر باستخدام `test-firestore.html`
3. تحقق من وحدة تحكم المتصفح للأخطاء
4. راجع إعدادات Firebase Console

---

**ملاحظة**: جميع الوظائف جاهزة للاستخدام وتم اختبارها. النظام يدعم اللغة العربية بالكامل ويتبع أفضل ممارسات Firestore.
