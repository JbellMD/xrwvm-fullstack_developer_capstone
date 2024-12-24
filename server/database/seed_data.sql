-- First, let's create some test users
INSERT INTO users (email, username) VALUES
    ('john.doe@example.com', 'johndoe'),
    ('jane.smith@example.com', 'janesmith'),
    ('mike.wilson@example.com', 'mikewilson'),
    ('sarah.brown@example.com', 'sarahb'),
    ('alex.jones@example.com', 'alexj')
ON CONFLICT (email) DO NOTHING;

-- Now, let's add some dealers with realistic data
INSERT INTO dealers (full_name, address, city, state, zip) VALUES
    ('Luxury Motors NYC', '789 5th Avenue', 'New York', 'NY', '10022'),
    ('California Dream Cars', '456 Palm Drive', 'Los Angeles', 'CA', '90210'),
    ('Sunshine Auto Group', '123 Beach Road', 'Miami', 'FL', '33139'),
    ('Mountain View Motors', '567 Highland Drive', 'Denver', 'CO', '80202'),
    ('Windy City Wheels', '890 Michigan Ave', 'Chicago', 'IL', '60601')
ON CONFLICT DO NOTHING;

-- Add sample reviews
INSERT INTO reviews (dealer_id, user_id, rating, comment)
SELECT 
    d.id as dealer_id,
    u.id as user_id,
    FLOOR(3 + random() * 3)::integer as rating, -- Generates ratings between 3 and 5
    CASE FLOOR(random() * 3)::integer
        WHEN 0 THEN 'Great service and fantastic selection!'
        WHEN 1 THEN 'Professional staff, competitive prices.'
        WHEN 2 THEN 'Very satisfied with my purchase.'
    END as comment
FROM 
    dealers d
    CROSS JOIN users u
WHERE 
    NOT EXISTS (
        SELECT 1 
        FROM reviews r 
        WHERE r.dealer_id = d.id AND r.user_id = u.id
    )
LIMIT 15;
