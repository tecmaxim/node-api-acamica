-- Database: students_storage
-- ------------------------------------------------------

CREATE Database students_storage;

USE students_storage;

CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `installments` mediumtext,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `payment_methods_description_IDX` (`description`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `idStudent` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `career` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `birthday` date NOT NULL,
  `phone` int unsigned DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`idStudent`),
  KEY `students_name_IDX` (`name`,`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `students_payment_method`
--

CREATE TABLE `student_payment_method` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `idStudent` int NOT NULL,
  `idPayment` int NOT NULL,
  `installments` tinyint(2) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `students_paymets_option_fk_students` (`idStudent`),
  KEY `students_paymets_option_FK_payments_methods` (`idPayment`),
  CONSTRAINT `students_paymets_option_FK_payments_methods` FOREIGN KEY (`idPayment`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `students_paymets_option_fk_students` FOREIGN KEY (`idStudent`) REFERENCES `students` (`idStudent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;