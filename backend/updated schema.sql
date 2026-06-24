-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: community_app
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_analytics`
--

DROP TABLE IF EXISTS `attendance_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_analytics` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `attendees_count` int DEFAULT '0',
  `attendance_date` date DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `attendance_analytics_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_analytics`
--

LOCK TABLES `attendance_analytics` WRITE;
/*!40000 ALTER TABLE `attendance_analytics` DISABLE KEYS */;
INSERT INTO `attendance_analytics` VALUES (1,1,25,'2026-07-05'),(2,2,30,'2026-07-10'),(3,3,40,'2026-07-15'),(4,4,20,'2026-07-20'),(5,5,35,'2026-07-25');
/*!40000 ALTER TABLE `attendance_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  `booking_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,2,1,'2026-06-24 12:25:15'),(2,2,3,'2026-06-24 12:25:15'),(3,3,2,'2026-06-24 12:25:15'),(4,3,3,'2026-06-24 12:25:15'),(5,4,1,'2026-06-24 12:25:15'),(6,4,4,'2026-06-24 12:25:15'),(7,5,5,'2026-06-24 12:25:15'),(8,5,6,'2026-06-24 12:25:15'),(9,6,2,'2026-06-24 12:25:15'),(10,6,7,'2026-06-24 12:25:15'),(11,9,3,'2026-06-24 12:25:15'),(12,9,5,'2026-06-24 12:25:15'),(13,10,1,'2026-06-24 12:25:15'),(14,10,8,'2026-06-24 12:25:15'),(15,11,4,'2026-06-24 12:25:15'),(16,11,6,'2026-06-24 12:25:15'),(17,2,2,'2026-06-24 12:25:15'),(18,3,5,'2026-06-24 12:25:15'),(19,4,7,'2026-06-24 12:25:15'),(20,5,8,'2026-06-24 12:25:15');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_analytics`
--

DROP TABLE IF EXISTS `category_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_analytics` (
  `analytics_id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `total_events` int DEFAULT '0',
  `total_bookings` int DEFAULT '0',
  PRIMARY KEY (`analytics_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_analytics`
--

LOCK TABLES `category_analytics` WRITE;
/*!40000 ALTER TABLE `category_analytics` DISABLE KEYS */;
INSERT INTO `category_analytics` VALUES (1,'Environment',2,5),(2,'Education',1,3),(3,'Technology',2,6),(4,'Health',1,2),(5,'Business',2,5);
/*!40000 ALTER TABLE `category_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_summary`
--

DROP TABLE IF EXISTS `dashboard_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_summary` (
  `summary_id` int NOT NULL AUTO_INCREMENT,
  `total_users` int DEFAULT '0',
  `total_events` int DEFAULT '0',
  `total_bookings` int DEFAULT '0',
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`summary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_summary`
--

LOCK TABLES `dashboard_summary` WRITE;
/*!40000 ALTER TABLE `dashboard_summary` DISABLE KEYS */;
INSERT INTO `dashboard_summary` VALUES (1,11,8,20,'2026-06-24 12:28:19');
/*!40000 ALTER TABLE `dashboard_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_analytics`
--

DROP TABLE IF EXISTS `event_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_analytics` (
  `analytics_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `total_bookings` int DEFAULT '0',
  `analytics_date` date DEFAULT NULL,
  PRIMARY KEY (`analytics_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_analytics_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_analytics`
--

LOCK TABLES `event_analytics` WRITE;
/*!40000 ALTER TABLE `event_analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `organizer_id` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`event_id`),
  KEY `fk_event_organizer` (`organizer_id`),
  CONSTRAINT `fk_event_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Community Cleanup','Environment','2026-07-05',7,'Neighborhood cleanup initiative'),(2,'Youth Leadership Workshop','Education','2026-07-10',8,'Leadership development for youth'),(3,'Tech Career Expo','Technology','2026-07-15',7,'Technology careers and networking'),(4,'Health Awareness Day','Health','2026-07-20',8,'Community health awareness program'),(5,'Entrepreneurship Seminar','Business','2026-07-25',7,'Business and entrepreneurship training'),(6,'Coding Bootcamp','Technology','2026-08-01',8,'Programming fundamentals training'),(7,'Tree Planting Campaign','Environment','2026-08-05',7,'Environmental conservation event'),(8,'Financial Literacy Workshop','Business','2026-08-10',8,'Personal finance education');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration_analytics`
--

DROP TABLE IF EXISTS `registration_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration_analytics` (
  `analytics_id` int NOT NULL AUTO_INCREMENT,
  `registration_date` date DEFAULT NULL,
  `total_registrations` int DEFAULT '0',
  PRIMARY KEY (`analytics_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration_analytics`
--

LOCK TABLES `registration_analytics` WRITE;
/*!40000 ALTER TABLE `registration_analytics` DISABLE KEYS */;
INSERT INTO `registration_analytics` VALUES (1,'2026-06-15',2),(2,'2026-06-16',3),(3,'2026-06-17',1),(4,'2026-06-18',4),(5,'2026-06-19',1);
/*!40000 ALTER TABLE `registration_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_analytics`
--

DROP TABLE IF EXISTS `user_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_analytics` (
  `analytics_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `bookings_count` int DEFAULT '0',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`analytics_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_analytics_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_analytics`
--

LOCK TABLES `user_analytics` WRITE;
/*!40000 ALTER TABLE `user_analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `signup_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('admin','user','event_organizer') DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Admin','admin@community.com','2026-06-24 11:40:51','admin','admin123'),(2,'John Smith','john.smith@email.com','2026-06-24 11:40:51','user','user123'),(3,'Sarah Johnson','sarah.johnson@email.com','2026-06-24 11:40:51','user','user123'),(4,'Michael Brown','michael.brown@email.com','2026-06-24 11:40:51','user','user123'),(5,'Emily Davis','emily.davis@email.com','2026-06-24 11:40:51','user','user123'),(6,'David Wilson','david.wilson@email.com','2026-06-24 11:40:51','user','user123'),(7,'Jessica Taylor','jessica.taylor@email.com','2026-06-24 11:40:51','event_organizer','user123'),(8,'Daniel Anderson','daniel.anderson@email.com','2026-06-24 11:40:51','event_organizer','user123'),(9,'Olivia Thomas','olivia.thomas@email.com','2026-06-24 11:40:51','user','user123'),(10,'James Martin','james.martin@email.com','2026-06-24 11:40:51','user','user123'),(11,'Sophia Moore','sophia.moore@email.com','2026-06-24 11:40:51','user','user123');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_category_performance`
--

DROP TABLE IF EXISTS `vw_category_performance`;
/*!50001 DROP VIEW IF EXISTS `vw_category_performance`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_category_performance` AS SELECT 
 1 AS `category`,
 1 AS `total_events`,
 1 AS `total_bookings`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_event_bookings`
--

DROP TABLE IF EXISTS `vw_event_bookings`;
/*!50001 DROP VIEW IF EXISTS `vw_event_bookings`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_event_bookings` AS SELECT 
 1 AS `event_id`,
 1 AS `title`,
 1 AS `category`,
 1 AS `total_bookings`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_user_activity`
--

DROP TABLE IF EXISTS `vw_user_activity`;
/*!50001 DROP VIEW IF EXISTS `vw_user_activity`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_user_activity` AS SELECT 
 1 AS `user_id`,
 1 AS `name`,
 1 AS `bookings_made`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_category_performance`
--

/*!50001 DROP VIEW IF EXISTS `vw_category_performance`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_category_performance` AS select `e`.`category` AS `category`,count(distinct `e`.`event_id`) AS `total_events`,count(`b`.`booking_id`) AS `total_bookings` from (`events` `e` left join `bookings` `b` on((`e`.`event_id` = `b`.`event_id`))) group by `e`.`category` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_event_bookings`
--

/*!50001 DROP VIEW IF EXISTS `vw_event_bookings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_event_bookings` AS select `e`.`event_id` AS `event_id`,`e`.`title` AS `title`,`e`.`category` AS `category`,count(`b`.`booking_id`) AS `total_bookings` from (`events` `e` left join `bookings` `b` on((`e`.`event_id` = `b`.`event_id`))) group by `e`.`event_id`,`e`.`title`,`e`.`category` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_user_activity`
--

/*!50001 DROP VIEW IF EXISTS `vw_user_activity`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_user_activity` AS select `u`.`user_id` AS `user_id`,`u`.`name` AS `name`,count(`b`.`booking_id`) AS `bookings_made` from (`users` `u` left join `bookings` `b` on((`u`.`user_id` = `b`.`user_id`))) group by `u`.`user_id`,`u`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


