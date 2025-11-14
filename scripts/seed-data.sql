-- Seed initial data for Jashn platform

-- Insert sample users
INSERT INTO users (name, email, phone, password_hash, user_type, address) VALUES
('Vedant Shinde', 'vedant@jashn.com', '9876543210', 'hashed_password_1', 'admin', 'Mumbai, India'),
('Moin Shaikh', 'moin@jashn.com', '9876543211', 'hashed_password_2', 'admin', 'Mumbai, India'),
('Priya Sharma', 'priya.sharma@email.com', '9876543212', 'hashed_password_3', 'client', 'Delhi, India'),
('Rahul Kumar', 'rahul.kumar@email.com', '9876543213', 'hashed_password_4', 'planner', 'Mumbai, India'),
('Anjali Patel', 'anjali.patel@email.com', '9876543214', 'hashed_password_5', 'planner', 'Bangalore, India'),
('Amit Singh', 'amit.singh@email.com', '9876543215', 'hashed_password_6', 'client', 'Pune, India');

-- Insert planners
INSERT INTO planners (user_id, experience_years, bio, rating) VALUES
(4, 5, 'Expert event planner with 5 years of experience', 4.8),
(5, 8, 'Creative and detail-oriented event coordinator', 4.9);

-- Insert vendors
INSERT INTO vendors (name, service_type, email, phone, price_range, rating, description, image_url) VALUES
('Décor Dreams', 'Decoration', 'decor@dreams.com', '9876543220', '50000-200000', 4.7, 'Premium decoration services for all events', '/placeholder.svg?height=200&width=200'),
('Taste Buds Catering', 'Catering', 'catering@taste.com', '9876543221', '100000-500000', 4.9, 'Delicious multi-cuisine catering', '/placeholder.svg?height=200&width=200'),
('Entertainment Plus', 'Entertainment', 'info@entertainment.com', '9876543222', '30000-150000', 4.6, 'DJ, Live bands, and performance artists', '/placeholder.svg?height=200&width=200'),
('Grand Venues', 'Venue', 'book@grandvenues.com', '9876543223', '200000-1000000', 4.8, 'Luxury banquet halls and outdoor spaces', '/placeholder.svg?height=200&width=200'),
('Bloom Flowers', 'Flowers', 'florals@bloom.com', '9876543224', '20000-100000', 4.7, 'Fresh and exotic floral arrangements', '/placeholder.svg?height=200&width=200');

-- Insert services
INSERT INTO services (vendor_id, service_name, description, price, category) VALUES
(1, 'Elegant Stage Decoration', 'Complete stage decoration with LED and flowers', 75000, 'decoration'),
(1, 'Table Setup & Centerpieces', 'Decorated tables with custom centerpieces', 50000, 'decoration'),
(2, 'Multi-Cuisine Buffet', '5-course buffet with premium cuisines', 300, 'catering'),
(2, 'Premium Cocktail Service', 'Bar service with premium drinks', 150, 'catering'),
(3, 'DJ & Sound System', 'Professional DJ with state-of-the-art sound', 60000, 'entertainment'),
(3, 'Live Band Performance', 'Live music performance for 2 hours', 80000, 'entertainment'),
(4, 'Luxury Banquet Hall', 'Premium AC banquet with capacity 500', 150000, 'venue'),
(4, 'Outdoor Garden Space', 'Beautiful garden venue with facilities', 100000, 'venue'),
(5, 'Bridal Bouquet & Arrangements', 'Custom bridal flowers', 25000, 'flowers'),
(5, 'Venue Flower Decoration', 'Complete venue floral setup', 60000, 'flowers');

-- Insert sample events
INSERT INTO events (user_id, planner_id, event_type, event_date, location, budget, status, guest_count) VALUES
(3, 1, 'Wedding', '2025-12-15', 'Mumbai, India', 500000, 'planning', 250),
(6, 2, 'Corporate Event', '2025-11-20', 'Bangalore, India', 300000, 'planning', 150);
