// Supabase Service - Main Database Service for Car Rental Platform
// This service replaces Firebase and handles all data operations

class SupabaseService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.init();
    }

    // Initialize Supabase
    async init() {
        try {
            // Check if Supabase is available
            if (typeof supabase === 'undefined') {
                throw new Error('Supabase SDK not loaded');
            }

            // Initialize Supabase if not already initialized
            if (!window.supabase) {
                const supabaseConfig = {
                    supabaseUrl: 'https://nhmgolhyebehkmvlutir.supabase.co',
                    supabaseKey: 'your-anon-key-here' // This should be set in your HTML
                };
                
                // Create Supabase client
                this.supabase = supabase.createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);
            } else {
                this.supabase = window.supabase;
            }

            console.log('🔵 Supabase Service initialized successfully');
            
            // Set up auth state listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    this.currentUser = session?.user;
                    console.log('Auth state changed: User logged in');
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    console.log('Auth state changed: User logged out');
                }
            });

        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            throw error;
        }
    }

    // ==================== AUTHENTICATION ====================

    // Register new user
    async registerUser(userData) {
        try {
            // Create Supabase Auth user
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password
            });

            if (authError) throw authError;

            const user = authData.user;

            // Store additional user data in profiles table
            const { error: profileError } = await this.supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: userData.email,
                    full_name: userData.full_name,
                    phone: userData.phone,
                    city: userData.city,
                    user_type: userData.user_type, // 'renter' or 'owner'
                    created_at: new Date().toISOString(),
                    is_active: true,
                    profile_photo: userData.profile_photo || null
                });

            if (profileError) throw profileError;

            console.log('✅ User registered successfully:', user.id);
            return { user, profile: userData };

        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    }

    // Login user
    async loginUser(email, password) {
        try {
            const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (authError) throw authError;

            const user = authData.user;

            // Get user profile from database
            const { data: profile, error: profileError } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            if (!profile) {
                throw new Error('User profile not found');
            }

            console.log('✅ User logged in successfully:', user.id);
            return { user, profile };

        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    }

    // Logout user
    async logoutUser() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            console.log('✅ User logged out successfully');
        } catch (error) {
            console.error('❌ Logout failed:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get current user profile
    async getCurrentUserProfile() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const { data: profile, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) throw error;
            return profile;
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentUser.id);

            if (error) throw error;

            console.log('✅ User profile updated successfully');
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            throw error;
        }
    }

    // ==================== CARS MANAGEMENT ====================

    // Create new car
    async createCar(carData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { data: car, error } = await this.supabase
                .from('cars')
                .insert({
                    owner_id: this.currentUser.id,
                    ...carData,
                    created_at: new Date().toISOString(),
                    is_available: true,
                    status: 'active'
                })
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Car created successfully:', car.id);
            return car;

        } catch (error) {
            console.error('❌ Error creating car:', error);
            throw error;
        }
    }

    // Get all cars
    async getAllCars() {
        try {
            const { data: cars, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('status', 'active');

            if (error) throw error;

            return cars || [];

        } catch (error) {
            console.error('❌ Error getting cars:', error);
            throw error;
        }
    }

    // Get cars by owner
    async getCarsByOwner(ownerId = null) {
        try {
            const userId = ownerId || this.currentUser?.id;
            if (!userId) {
                throw new Error('No user ID provided');
            }

            const { data: cars, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('owner_id', userId);

            if (error) throw error;

            return cars || [];

        } catch (error) {
            console.error('❌ Error getting cars by owner:', error);
            throw error;
        }
    }

    // Get car by ID
    async getCarById(carId) {
        try {
            const { data: car, error } = await this.supabase
                .from('cars')
                .select('*')
                .eq('id', carId)
                .single();

            if (error) throw error;

            return car;

        } catch (error) {
            console.error('❌ Error getting car:', error);
            throw error;
        }
    }

    // Update car
    async updateCar(carId, updates) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('cars')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', carId);

            if (error) throw error;

            console.log('✅ Car updated successfully:', carId);

        } catch (error) {
            console.error('❌ Error updating car:', error);
            throw error;
        }
    }

    // Delete car
    async deleteCar(carId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('cars')
                .delete()
                .eq('id', carId);

            if (error) throw error;

            console.log('✅ Car deleted successfully:', carId);

        } catch (error) {
            console.error('❌ Error deleting car:', error);
            throw error;
        }
    }

    // ==================== BOOKINGS MANAGEMENT ====================

    // Create new booking
    async createBooking(bookingData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { data: booking, error } = await this.supabase
                .from('bookings')
                .insert({
                    renter_id: this.currentUser.id,
                    ...bookingData,
                    created_at: new Date().toISOString(),
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Booking created successfully:', booking.id);
            return booking;

        } catch (error) {
            console.error('❌ Error creating booking:', error);
            throw error;
        }
    }

    // Get bookings by user
    async getBookingsByUser(userType = 'renter') {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
            const { data: bookings, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq(queryField, this.currentUser.id);

            if (error) throw error;

            return bookings || [];

        } catch (error) {
            console.error('❌ Error getting bookings:', error);
            throw error;
        }
    }

    // Update booking status
    async updateBookingStatus(bookingId, status) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const { error } = await this.supabase
                .from('bookings')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);

            if (error) throw error;

            console.log('✅ Booking status updated:', bookingId, status);

        } catch (error) {
            console.error('❌ Error updating booking status:', error);
            throw error;
        }
    }

    // ==================== PHOTOS MANAGEMENT ====================

    // Upload car photo
    async uploadCarPhoto(carId, file) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            const fileName = `cars/${carId}/${Date.now()}_${file.name}`;
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('car-photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('car-photos')
                .getPublicUrl(fileName);

            // Save photo reference to database
            const { data: photoData, error: dbError } = await this.supabase
                .from('car_photos')
                .insert({
                    car_id: carId,
                    url: urlData.publicUrl,
                    filename: fileName,
                    uploaded_by: this.currentUser.id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (dbError) throw dbError;

            console.log('✅ Car photo uploaded successfully:', urlData.publicUrl);
            return photoData;

        } catch (error) {
            console.error('❌ Error uploading car photo:', error);
            throw error;
        }
    }

    // Get car photos
    async getCarPhotos(carId) {
        try {
            const { data: photos, error } = await this.supabase
                .from('car_photos')
                .select('*')
                .eq('car_id', carId);

            if (error) throw error;

            return photos || [];

        } catch (error) {
            console.error('❌ Error getting car photos:', error);
            throw error;
        }
    }

    // Delete car photo
    async deleteCarPhoto(photoId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            // Get photo data first
            const { data: photo, error: getError } = await this.supabase
                .from('car_photos')
                .select('*')
                .eq('id', photoId)
                .single();

            if (getError) throw getError;

            if (!photo) {
                throw new Error('Photo not found');
            }

            // Delete from storage
            const { error: storageError } = await this.supabase.storage
                .from('car-photos')
                .remove([photo.filename]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await this.supabase
                .from('car_photos')
                .delete()
                .eq('id', photoId);

            if (dbError) throw dbError;

            console.log('✅ Car photo deleted successfully:', photoId);

        } catch (error) {
            console.error('❌ Error deleting car photo:', error);
            throw error;
        }
    }

    // ==================== NOTIFICATIONS ====================

    // Create notification
    async createNotification(notificationData) {
        try {
            const { data: notification, error } = await this.supabase
                .from('notifications')
                .insert({
                    ...notificationData,
                    created_at: new Date().toISOString(),
                    is_read: false
                })
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Notification created successfully:', notification.id);
            return notification;

        } catch (error) {
            console.error('❌ Error creating notification:', error);
            throw error;
        }
    }

    // Get user notifications
    async getUserNotifications(userId) {
        try {
            const { data: notifications, error } = await this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            return notifications || [];

        } catch (error) {
            console.error('❌ Error getting notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId) {
        try {
            const { error } = await this.supabase
                .from('notifications')
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq('id', notificationId);

            if (error) throw error;

            console.log('✅ Notification marked as read:', notificationId);

        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            throw error;
        }
    }

    // ==================== REAL-TIME LISTENERS ====================

    // Listen to user data changes
    onUserDataChange(userId, callback) {
        return this.supabase
            .channel(`profiles:${userId}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
                (payload) => {
                    callback(payload.new ? { id: userId, ...payload.new } : null);
                }
            )
            .subscribe();
    }

    // Listen to cars changes
    onCarsChange(callback) {
        return this.supabase
            .channel('cars')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'cars' },
                (payload) => {
                    // Get all cars when there's a change
                    this.getAllCars().then(callback);
                }
            )
            .subscribe();
    }

    // Listen to bookings changes
    onBookingsChange(userId, userType, callback) {
        const queryField = userType === 'owner' ? 'owner_id' : 'renter_id';
        
        return this.supabase
            .channel(`bookings:${userId}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'bookings', filter: `${queryField}=eq.${userId}` },
                (payload) => {
                    // Get updated bookings when there's a change
                    this.getBookingsByUser(userType).then(callback);
                }
            )
            .subscribe();
    }

    // Listen to notifications changes
    onNotificationsChange(userId, callback) {
        return this.supabase
            .channel(`notifications:${userId}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
                (payload) => {
                    // Get updated notifications when there's a change
                    this.getUserNotifications(userId).then(callback);
                }
            )
            .subscribe();
    }

    // Cleanup listeners
    off(channel) {
        this.supabase.removeChannel(channel);
    }

    // ==================== UTILITY METHODS ====================

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Get user type
    async getUserType() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const profile = await this.getCurrentUserProfile();
            return profile?.user_type || null;
        } catch (error) {
            console.error('❌ Error getting user type:', error);
            return null;
        }
    }

    // Generate unique ID
    generateId() {
        return crypto.randomUUID();
    }

    // Format timestamp
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString('ar-SA');
    }
}

// Create global instance
const supabaseService = new SupabaseService();

// Export for use in other files
window.supabaseService = supabaseService;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Supabase Service ready');
});
