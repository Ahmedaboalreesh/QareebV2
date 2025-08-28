const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// إنشاء مجلد قاعدة البيانات إذا لم يكن موجوداً
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// إنشاء مجلد الصور إذا لم يكن موجوداً
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'car_rental.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 بدء تهيئة قاعدة البيانات...');

// إنشاء جدول المستخدمين
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        user_type TEXT DEFAULT 'renter',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('❌ خطأ في إنشاء جدول المستخدمين:', err);
    } else {
        console.log('✅ تم إنشاء جدول المستخدمين');
    }
});

// إنشاء جدول السيارات
db.run(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL,
        transmission TEXT NOT NULL,
        fuel_type TEXT NOT NULL,
        mileage INTEGER NOT NULL,
        daily_rate DECIMAL(10,2) NOT NULL,
        weekly_rate DECIMAL(10,2),
        monthly_rate DECIMAL(10,2),
        deposit DECIMAL(10,2) NOT NULL,
        available_from DATE NOT NULL,
        available_to DATE NOT NULL,
        location TEXT NOT NULL,
        pickup_location TEXT NOT NULL,
        description TEXT,
        features TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error('❌ خطأ في إنشاء جدول السيارات:', err);
    } else {
        console.log('✅ تم إنشاء جدول السيارات');
    }
});

// إنشاء جدول صور السيارات
db.run(`
    CREATE TABLE IF NOT EXISTS car_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error('❌ خطأ في إنشاء جدول صور السيارات:', err);
    } else {
        console.log('✅ تم إنشاء جدول صور السيارات');
    }
});

// إنشاء جدول الحجوزات
db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER NOT NULL,
        renter_id INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        deposit_amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        owner_notes TEXT,
        renter_notes TEXT,
        pickup_location TEXT,
        return_location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE,
        FOREIGN KEY (renter_id) REFERENCES users (id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error('❌ خطأ في إنشاء جدول الحجوزات:', err);
    } else {
        console.log('✅ تم إنشاء جدول الحجوزات');
    }
});

// إنشاء جدول النشاطات
db.run(`
    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error('❌ خطأ في إنشاء جدول النشاطات:', err);
    } else {
        console.log('✅ تم إنشاء جدول النشاطات');
    }
});

// إنشاء فهارس لتحسين الأداء
db.run(`CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id)`, (err) => {
    if (err) console.error('❌ خطأ في إنشاء فهرس cars_user_id:', err);
});

db.run(`CREATE INDEX IF NOT EXISTS idx_car_photos_car_id ON car_photos(car_id)`, (err) => {
    if (err) console.error('❌ خطأ في إنشاء فهرس car_photos_car_id:', err);
});

db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id)`, (err) => {
    if (err) console.error('❌ خطأ في إنشاء فهرس bookings_car_id:', err);
});

db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`, (err) => {
    if (err) console.error('❌ خطأ في إنشاء فهرس bookings_user_id:', err);
});

db.run(`CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id)`, (err) => {
    if (err) console.error('❌ خطأ في إنشاء فهرس activities_user_id:', err);
});

// إغلاق قاعدة البيانات
db.close((err) => {
    if (err) {
        console.error('❌ خطأ في إغلاق قاعدة البيانات:', err);
    } else {
        console.log('🎉 تم تهيئة قاعدة البيانات بنجاح!');
        console.log('📁 موقع قاعدة البيانات:', dbPath);
        console.log('📁 مجلد الصور:', uploadsDir);
    }
});
