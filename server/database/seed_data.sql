-- First, let's create some test users
INSERT INTO users (email, username) VALUES
    ('john.doe@example.com', 'johndoe'),
    ('jane.smith@example.com', 'janesmith'),
    ('mike.wilson@example.com', 'mikewilson'),
    ('sarah.brown@example.com', 'sarahb'),
    ('alex.jones@example.com', 'alexj')
ON CONFLICT (email) DO NOTHING;

-- Now, let's add 20 dealers with realistic data
INSERT INTO dealers (full_name, address, city, state, zip) VALUES
    ('Luxury Motors NYC', '789 5th Avenue', 'New York', 'NY', '10022'),
    ('California Dream Cars', '456 Palm Drive', 'Los Angeles', 'CA', '90210'),
    ('Sunshine Auto Group', '123 Beach Road', 'Miami', 'FL', '33139'),
    ('Mountain View Motors', '567 Highland Drive', 'Denver', 'CO', '80202'),
    ('Windy City Wheels', '890 Michigan Ave', 'Chicago', 'IL', '60601'),
    ('Texas Star Autos', '234 Rodeo Drive', 'Houston', 'TX', '77001'),
    ('Pacific Northwest Cars', '456 Rain Street', 'Seattle', 'WA', '98101'),
    ('Desert Sun Motors', '789 Cactus Road', 'Phoenix', 'AZ', '85001'),
    ('Atlanta Auto Exchange', '123 Peachtree St', 'Atlanta', 'GA', '30301'),
    ('Boston Premium Auto', '456 Harbor Drive', 'Boston', 'MA', '02108'),
    ('Vegas Luxury Imports', '789 Strip Avenue', 'Las Vegas', 'NV', '89101'),
    ('Nashville Auto Gallery', '321 Music Row', 'Nashville', 'TN', '37203'),
    ('Portland Green Motors', '654 Forest Avenue', 'Portland', 'OR', '97201'),
    ('Detroit Motor City', '987 Ford Street', 'Detroit', 'MI', '48201'),
    ('Twin Cities Auto Mall', '654 Lake Drive', 'Minneapolis', 'MN', '55401'),
    ('Carolina Auto Exchange', '321 Pine Street', 'Charlotte', 'NC', '28202'),
    ('Rocky Mountain Motors', '789 Peak View', 'Salt Lake City', 'UT', '84101'),
    ('Garden State Auto', '456 Shore Road', 'Newark', 'NJ', '07101'),
    ('Hawaii Paradise Cars', '123 Palm Beach Rd', 'Honolulu', 'HI', '96813'),
    ('Austin Tech Motors', '890 Silicon Hills', 'Austin', 'TX', '78701')
ON CONFLICT DO NOTHING;

-- Add sample reviews for each dealer
INSERT INTO reviews (dealer_id, user_id, rating, comment)
SELECT 
    d.id as dealer_id,
    u.id as user_id,
    FLOOR(RANDOM() * 3 + 3)::integer as rating, -- Generates ratings between 3 and 5
    CASE FLOOR(RANDOM() * 5)::integer
        WHEN 0 THEN 'Great service and fantastic selection of vehicles!'
        WHEN 1 THEN 'Professional staff, competitive prices. Would recommend.'
        WHEN 2 THEN 'Very satisfied with my purchase. The process was smooth and easy.'
        WHEN 3 THEN 'Excellent customer service and follow-up. Will definitely return.'
        WHEN 4 THEN 'Clean facility, knowledgeable staff, and fair prices.'
    END as comment
FROM 
    dealers d
    CROSS JOIN users u
WHERE 
    RANDOM() < 0.7 -- This ensures not every user reviews every dealer
LIMIT 50; -- This limits the total number of reviews

-- Add some specific high and low rated reviews for variety
INSERT INTO reviews (dealer_id, user_id, rating, comment)
SELECT 
    d.id,
    u.id,
    CASE WHEN RANDOM() < 0.5 THEN 1 ELSE 2 END,
    CASE WHEN RANDOM() < 0.5 
        THEN 'Had some issues with the paperwork process. Could be improved.'
        ELSE 'Communication could have been better. Average experience.'
    END
FROM 
    dealers d
    CROSS JOIN users u
WHERE 
    RANDOM() < 0.2
LIMIT 10;
