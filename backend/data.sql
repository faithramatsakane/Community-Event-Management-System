sql

-- USERS DATA


INSERT INTO users (name, email, password, role) VALUES
('System Admin', 'admin@community.com', 'admin123', 'admin'),
('John Smith', 'john.smith@email.com', 'user123', 'user'),
('Sarah Johnson', 'sarah.johnson@email.com', 'user123', 'user'),
('Michael Brown', 'michael.brown@email.com', 'user123', 'user'),
('Emily Davis', 'emily.davis@email.com', 'user123', 'user'),
('David Wilson', 'david.wilson@email.com', 'user123', 'user'),
('Jessica Taylor', 'jessica.taylor@email.com', 'user123', 'event_organizer'),
('Daniel Anderson', 'daniel.anderson@email.com', 'user123', 'event_organizer'),
('Olivia Thomas', 'olivia.thomas@email.com', 'user123', 'user'),
('James Martin', 'james.martin@email.com', 'user123', 'user'),
('Sophia Moore', 'sophia.moore@email.com', 'user123', 'user');


-- EVENTS DATA
-- organizer_id references event organizers
-- Jessica = user_id 7
-- Daniel = user_id 8


INSERT INTO events
(organizer_id, title, description, category, event_date)
VALUES
(7, 'Community Cleanup',
'Neighborhood cleanup initiative',
'Environment',
'2026-07-05'),

(8, 'Youth Leadership Workshop',
'Leadership development for youth',
'Education',
'2026-07-10'),

(7, 'Tech Career Expo',
'Technology careers and networking',
'Technology',
'2026-07-15'),

(8, 'Health Awareness Day',
'Community health awareness program',
'Health',
'2026-07-20'),

(7, 'Entrepreneurship Seminar',
'Business and entrepreneurship training',
'Business',
'2026-07-25'),

(8, 'Coding Bootcamp',
'Programming fundamentals training',
'Technology',
'2026-08-01'),

(7, 'Tree Planting Campaign',
'Environmental conservation event',
'Environment',
'2026-08-05'),

(8, 'Financial Literacy Workshop',
'Personal finance education',
'Business',
'2026-08-10');


-- BOOKINGS DATA


INSERT INTO bookings (user_id, event_id) VALUES
(2,1),
(2,3),
(3,2),
(3,3),
(4,1),
(4,4),
(5,5),
(5,6),
(6,2),
(6,7),
(9,3),
(9,5),
(10,1),
(10,8),
(11,4),
(11,6),
(2,2),
(3,5),
(4,7),
(5,8);


-- EVENT ANALYTICS DATA


INSERT INTO event_analytics
(event_id, total_bookings, analytics_date)
VALUES
(1,3,'2026-06-19'),
(2,3,'2026-06-19'),
(3,4,'2026-06-19'),
(4,2,'2026-06-19'),
(5,3,'2026-06-19'),
(6,2,'2026-06-19'),
(7,2,'2026-06-19'),
(8,2,'2026-06-19');


-- USER ANALYTICS DATA


INSERT INTO user_analytics
(user_id, bookings_count)
VALUES
(2,3),
(3,3),
(4,2),
(5,3),
(6,2),
(9,2),
(10,2),
(11,2);


-- CATEGORY ANALYTICS DATA


INSERT INTO category_analytics
(category, total_events, total_bookings)
VALUES
('Environment',2,5),
('Education',1,3),
('Technology',2,6),
('Health',1,2),
('Business',2,5);


-- REGISTRATION ANALYTICS DATA


INSERT INTO registration_analytics
(registration_date, total_registrations)
VALUES
('2026-06-15',2),
('2026-06-16',3),
('2026-06-17',1),
('2026-06-18',4),
('2026-06-19',1);


-- ATTENDANCE ANALYTICS DATA


INSERT INTO attendance_analytics
(event_id, attendees_count, attendance_date)
VALUES
(1,25,'2026-07-05'),
(2,30,'2026-07-10'),
(3,40,'2026-07-15'),
(4,20,'2026-07-20'),
(5,35,'2026-07-25');


-- DASHBOARD SUMMARY DATA


INSERT INTO dashboard_summary
(total_users, total_events, total_bookings)
VALUES
(11, 8, 20);

