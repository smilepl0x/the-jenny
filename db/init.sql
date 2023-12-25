-- Adminer 4.8.1 MySQL 8.2.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

SET NAMES utf8mb4;

CREATE DATABASE `jenny` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `jenny`;

CREATE TABLE `games` (
  `game_id` int NOT NULL AUTO_INCREMENT,
  `role_id` varchar(20) NOT NULL,
  `game_name` varchar(100) NOT NULL,
  `max_party_size` int DEFAULT NULL,
  `registration_emoji` char(1) NOT NULL,
  `aliases` json DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sessions` (
  `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `channel_id` varchar(20) NOT NULL,
  `message_id` varchar(20) NOT NULL,
  `party_members` json DEFAULT NULL,
  `game_id` int DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DELIMITER ;;

CREATE TRIGGER `sessions_uuid` BEFORE INSERT ON `sessions` FOR EACH ROW
SET new.session_id = UUID();;

DELIMITER ;

-- 2023-12-25 01:01:27
