const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        const dbPath = path.join(__dirname, 'data', 'car_rental.db');
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
        // تفعيل المفاتيح الأجنبية
        this.db.run('PRAGMA foreign_keys = ON');
    }

    // عمليات المستخدمين
    async createUser(userData) {
        return new Promise((resolve, reject) => {
            const { full_name, email, phone, city, password_hash } = userData;
            const sql = `
                INSERT INTO users (full_name, email, phone, city, password_hash)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            this.db.run(sql, [full_name, email, phone, city, password_hash], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...userData });
                }
            });
        });
    }

    async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, full_name, email, phone, city, created_at FROM users WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // عمليات السيارات
    async createCar(carData) {
        return new Promise((resolve, reject) => {
            const {
                user_id, brand, model, year, color, type, transmission,
                fuel_type, mileage, daily_rate, weekly_rate, monthly_rate,
                deposit, available_from, available_to, location, pickup_location,
                description, features
            } = carData;

            const sql = `
                INSERT INTO cars (
                    user_id, brand, model, year, color, type, transmission,
                    fuel_type, mileage, daily_rate, weekly_rate, monthly_rate,
                    deposit, available_from, available_to, location, pickup_location,
                    description, features
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                user_id, brand, model, year, color, type, transmission,
                fuel_type, mileage, daily_rate, weekly_rate, monthly_rate,
                deposit, available_from, available_to, location, pickup_location,
                description, JSON.stringify(features)
            ];

            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...carData });
                }
            });
        });
    }

    async getCarsByUserId(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.*, 
                       COUNT(cp.id) as photo_count
                FROM cars c
                LEFT JOIN car_photos cp ON c.id = cp.car_id
                WHERE c.user_id = ?
                GROUP BY c.id
                ORDER BY c.created_at DESC
            `;
            
            this.db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // تحويل features من JSON إلى array
                    rows.forEach(row => {
                        if (row.features) {
                            try {
                                row.features = JSON.parse(row.features);
                            } catch (e) {
                                row.features = [];
                            }
                        }
                    });
                    resolve(rows);
                }
            });
        });
    }

    async getCarById(carId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cars WHERE id = ?';
            this.db.get(sql, [carId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row && row.features) {
                        try {
                            row.features = JSON.parse(row.features);
                        } catch (e) {
                            row.features = [];
                        }
                    }
                    resolve(row);
                }
            });
        });
    }

    async updateCarStatus(carId, status) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE cars SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            this.db.run(sql, [status, carId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: carId, status });
                }
            });
        });
    }

    async deleteCar(carId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM cars WHERE id = ?';
            this.db.run(sql, [carId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: carId, deleted: true });
                }
            });
        });
    }

    // عمليات صور السيارات
    async saveCarPhoto(photoData) {
        return new Promise((resolve, reject) => {
            const { car_id, filename, original_name, file_size, mime_type } = photoData;
            const sql = `
                INSERT INTO car_photos (car_id, filename, original_name, file_size, mime_type)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            this.db.run(sql, [car_id, filename, original_name, file_size, mime_type], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...photoData });
                }
            });
        });
    }

    async getCarPhotos(carId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM car_photos WHERE car_id = ? ORDER BY upload_date ASC';
            this.db.all(sql, [carId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async deleteCarPhoto(photoId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM car_photos WHERE id = ?';
            this.db.run(sql, [photoId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: photoId, deleted: true });
                }
            });
        });
    }

    // عمليات النشاطات
    async createActivity(activityData) {
        return new Promise((resolve, reject) => {
            const { user_id, type, title, description } = activityData;
            const sql = `
                INSERT INTO activities (user_id, type, title, description)
                VALUES (?, ?, ?, ?)
            `;
            
            this.db.run(sql, [user_id, type, title, description], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...activityData });
                }
            });
        });
    }

    async getActivitiesByUserId(userId, limit = 10) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM activities 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT ?
            `;
            
            this.db.all(sql, [userId, limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // عمليات الحجوزات
    async createBooking(bookingData) {
        return new Promise((resolve, reject) => {
            const { 
                car_id, renter_id, start_date, end_date, total_amount, 
                deposit_amount, pickup_location, return_location, renter_notes 
            } = bookingData;
            const sql = `
                INSERT INTO bookings (
                    car_id, renter_id, start_date, end_date, total_amount, 
                    deposit_amount, pickup_location, return_location, renter_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            this.db.run(sql, [
                car_id, renter_id, start_date, end_date, total_amount, 
                deposit_amount, pickup_location, return_location, renter_notes
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...bookingData });
                }
            });
        });
    }

    async getBookingsByRenterId(renterId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT b.*, c.brand, c.model, c.year, c.daily_rate, c.deposit,
                       u.full_name as owner_name, u.phone as owner_phone
                FROM bookings b
                JOIN cars c ON b.car_id = c.id
                JOIN users u ON c.user_id = u.id
                WHERE b.renter_id = ?
                ORDER BY b.created_at DESC
            `;
            
            this.db.all(sql, [renterId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getBookingsByCarId(carId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT b.*, u.full_name as renter_name, u.email as renter_email, u.phone as renter_phone
                FROM bookings b
                JOIN users u ON b.renter_id = u.id
                WHERE b.car_id = ?
                ORDER BY b.created_at DESC
            `;
            
            this.db.all(sql, [carId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getBookingsByOwnerId(ownerId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT b.*, c.brand, c.model, c.year, c.daily_rate,
                       u.full_name as renter_name, u.email as renter_email, u.phone as renter_phone
                FROM bookings b
                JOIN cars c ON b.car_id = c.id
                JOIN users u ON b.renter_id = u.id
                WHERE c.user_id = ?
                ORDER BY b.created_at DESC
            `;
            
            this.db.all(sql, [ownerId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async updateBookingStatus(bookingId, status, ownerNotes = null) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE bookings 
                SET status = ?, owner_notes = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.db.run(sql, [status, ownerNotes, bookingId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: bookingId, status, ownerNotes });
                }
            });
        });
    }

    async getBookingById(bookingId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT b.*, c.brand, c.model, c.year, c.daily_rate, c.deposit,
                       c.user_id as owner_id, owner.full_name as owner_name, owner.phone as owner_phone,
                       renter.full_name as renter_name, renter.email as renter_email, renter.phone as renter_phone
                FROM bookings b
                JOIN cars c ON b.car_id = c.id
                JOIN users owner ON c.user_id = owner.id
                JOIN users renter ON b.renter_id = renter.id
                WHERE b.id = ?
            `;
            
            this.db.get(sql, [bookingId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // إحصائيات
    async getDashboardStats(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    (SELECT COUNT(*) FROM cars WHERE user_id = ?) as cars_count,
                    (SELECT COUNT(*) FROM bookings b 
                     JOIN cars c ON b.car_id = c.id 
                     WHERE c.user_id = ? AND b.status = 'active') as active_bookings,
                    (SELECT COALESCE(SUM(b.total_amount), 0) FROM bookings b 
                     JOIN cars c ON b.car_id = c.id 
                     WHERE c.user_id = ? AND b.status = 'completed' 
                     AND strftime('%Y-%m', b.created_at) = strftime('%Y-%m', 'now')) as monthly_earnings
            `;
            
            this.db.get(sql, [userId, userId, userId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // إغلاق قاعدة البيانات
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();
