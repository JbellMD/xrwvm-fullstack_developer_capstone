-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dealers table
CREATE TABLE IF NOT EXISTS dealers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    dealer_id INTEGER REFERENCES dealers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dealers_state ON dealers(state);
CREATE INDEX IF NOT EXISTS idx_reviews_dealer_id ON reviews(dealer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY users_select ON users FOR SELECT
    USING (true);  -- Anyone can view users

CREATE POLICY users_insert ON users FOR INSERT
    WITH CHECK (auth.uid() = id);  -- Users can only insert their own record

CREATE POLICY users_update ON users FOR UPDATE
    USING (auth.uid() = id)  -- Users can only update their own record
    WITH CHECK (auth.uid() = id);

-- Create policies for dealers table
CREATE POLICY dealers_select ON dealers FOR SELECT
    USING (true);  -- Anyone can view dealers

CREATE POLICY dealers_insert ON dealers FOR INSERT
    WITH CHECK (true);  -- Allow inserts for testing

CREATE POLICY dealers_update ON dealers FOR UPDATE
    USING (auth.role() = 'admin')  -- Only admins can update dealers
    WITH CHECK (auth.role() = 'admin');

-- Create policies for reviews table
CREATE POLICY reviews_select ON reviews FOR SELECT
    USING (true);  -- Anyone can view reviews

CREATE POLICY reviews_insert ON reviews FOR INSERT
    WITH CHECK (true);  -- Allow inserts for testing

CREATE POLICY reviews_update ON reviews FOR UPDATE
    USING (auth.uid()::text = user_id::text)  -- Users can only update their own reviews
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY reviews_delete ON reviews FOR DELETE
    USING (auth.uid()::text = user_id::text);  -- Users can only delete their own reviews

-- Add some sample dealers
INSERT INTO dealers (full_name, address, city, state, zip) VALUES
    ('ABC Motors', '123 Main St', 'New York', 'NY', '10001'),
    ('Best Cars Inc', '456 Oak Ave', 'Los Angeles', 'CA', '90001'),
    ('CarMax Downtown', '789 Market St', 'Chicago', 'IL', '60601'),
    ('Elite Auto Group', '321 Pine Rd', 'Houston', 'TX', '77001'),
    ('FastLane Motors', '654 Maple Dr', 'Phoenix', 'AZ', '85001')
ON CONFLICT DO NOTHING;
