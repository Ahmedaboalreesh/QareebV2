const { Client } = require('pg');

// Database connection configuration
const connectionString = 'postgresql://postgres:aass1122@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres';

// Create PostgreSQL client
const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// SQL statements to create tables
const createTablesSQL = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    user_type VARCHAR(20) CHECK (user_type IN ('renter', 'owner')) NOT NULL,
    profile_photo TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic')),
    fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    description TEXT,
    features TEXT[],
    location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_available BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car_photos table
CREATE TABLE IF NOT EXISTS car_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    delivery_choice VARCHAR(20) DEFAULT 'pickup' CHECK (delivery_choice IN ('pickup', 'delivery')),
    delivery_address TEXT,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    related_id UUID,
    related_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_car_photos_car_id ON car_photos(car_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Cars policies
CREATE POLICY "Anyone can view active cars" ON cars
    FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can view their own cars" ON cars
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own cars" ON cars
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own cars" ON cars
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own cars" ON cars
    FOR DELETE USING (auth.uid() = owner_id);

-- Car photos policies
CREATE POLICY "Anyone can view car photos" ON car_photos
    FOR SELECT USING (true);

CREATE POLICY "Car owners can manage photos" ON car_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_photos.car_id 
            AND cars.owner_id = auth.uid()
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Renters can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners can update their car bookings" ON bookings
    FOR UPDATE USING (auth.uid() = owner_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND (bookings.renter_id = auth.uid() OR bookings.owner_id = auth.uid())
        )
    );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate total days and amount for bookings
CREATE OR REPLACE FUNCTION calculate_booking_totals()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_days = (NEW.end_date - NEW.start_date)::integer;
    
    -- Get car daily rate
    SELECT daily_rate INTO NEW.total_amount
    FROM cars WHERE id = NEW.car_id;
    
    NEW.total_amount = NEW.total_amount * NEW.total_days;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for booking calculations
CREATE TRIGGER calculate_booking_totals_trigger BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION calculate_booking_totals();
`;

async function initializeDatabase() {
    try {
        console.log('🔌 Connecting to Supabase database...');
        await client.connect();
        console.log('✅ Connected to database successfully');

        console.log('📋 Creating tables and setting up database...');
        await client.query(createTablesSQL);
        console.log('✅ Database initialization completed successfully');

        // Test the connection
        const result = await client.query('SELECT NOW() as current_time');
        console.log('⏰ Database time:', result.rows[0].current_time);

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('🎉 Supabase database setup completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Setup failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };
