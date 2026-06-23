CREATE DATABASE community_EventApp;
USE community_EventApp;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  category VARCHAR(50),
  event_date DATE
);

CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT,
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