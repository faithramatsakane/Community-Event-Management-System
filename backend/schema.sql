booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

SHOW DATABASES;

USE community_app;
SHOW TABLES;

CREATE TABLE event_analytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    total_bookings INT DEFAULT 0,
    analytics_date DATE,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE user_analytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bookings_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE category_analytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50),
    total_events INT DEFAULT 0,
    total_bookings INT DEFAULT 0
);

CREATE TABLE dashboard_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    total_users INT DEFAULT 0,
    total_events INT DEFAULT 0,
    total_bookings INT DEFAULT 0,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW vw_event_bookings AS
SELECT
    e.event_id,
    e.title,
    e.category,
    COUNT(b.booking_id) AS total_bookings
FROM events e
LEFT JOIN bookings b
ON e.event_id = b.event_id
GROUP BY e.event_id, e.title, e.category;

CREATE VIEW vw_user_activity AS
SELECT
    u.user_id,
    u.name,
    COUNT(b.booking_id) AS bookings_made
FROM users u
LEFT JOIN bookings b
ON u.user_id = b.user_id
GROUP BY u.user_id, u.name;

CREATE VIEW vw_category_performance AS
SELECT
    e.category,
    COUNT(DISTINCT e.event_id) AS total_events,
    COUNT(b.booking_id) AS total_bookings
FROM events e
LEFT JOIN bookings b
ON e.event_id = b.event_id
GROUP BY e.category;