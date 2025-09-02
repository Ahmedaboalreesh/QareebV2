const { Client } = require('pg');

// Test Supabase database connection
async function testSupabaseConnection() {
    const connectionString = 'postgresql://postgres:aass1122@db.nhmgolhyebehkmvlutir.supabase.co:5432/postgres';
    
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔌 Testing Supabase database connection...');
        
        await client.connect();
        console.log('✅ Successfully connected to Supabase database');

        // Test basic query
        const result = await client.query('SELECT NOW() as current_time, version() as db_version');
        console.log('⏰ Database time:', result.rows[0].current_time);
        console.log('📊 Database version:', result.rows[0].db_version.split(' ')[0]);

        // Test if tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        if (tablesResult.rows.length > 0) {
            console.log('📋 Existing tables:');
            tablesResult.rows.forEach(row => {
                console.log(`  - ${row.table_name}`);
            });
        } else {
            console.log('📋 No tables found - database may need initialization');
        }

        console.log('🎉 Supabase connection test completed successfully!');

    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Tip: Check if the database is accessible and credentials are correct');
        } else if (error.code === '28P01') {
            console.error('💡 Tip: Invalid username or password');
        } else if (error.code === '3D000') {
            console.error('💡 Tip: Database does not exist');
        }
        
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the test
testSupabaseConnection();
