-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema datawarehouse
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema datawarehouse
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `datawarehouse` DEFAULT CHARACTER SET utf8 ;
USE `datawarehouse` ;

-- -----------------------------------------------------
-- Table `datawarehouse`.`channels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`channels` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`regions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`regions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`countries` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `regions_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_countries_regions1_idx` (`regions_id` ASC) ,
  CONSTRAINT `fk_countries_regions1`
    FOREIGN KEY (`regions_id`)
    REFERENCES `datawarehouse`.`regions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`cities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`cities` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `countries_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_cities_countries_idx` (`countries_id` ASC) ,
  CONSTRAINT `fk_cities_countries`
    FOREIGN KEY (`countries_id`)
    REFERENCES `datawarehouse`.`countries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`companies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `email` VARCHAR(25) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `cities_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_companies_cities1_idx` (`cities_id` ASC) ,
  CONSTRAINT `fk_companies_cities1`
    FOREIGN KEY (`cities_id`)
    REFERENCES `datawarehouse`.`cities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  `isadmin` BIT(1) NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`contacts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`contacts` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(24) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `position` VARCHAR(45) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  `address` VARCHAR(45) NULL DEFAULT NULL,
  `interest` INT(3) NULL DEFAULT 0,
  `imgUrl` VARCHAR(45) NULL DEFAULT NULL,
  `users_id` INT(11) NOT NULL,
  `regions_id` INT(11) NOT NULL,
  `companies_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_contacts_users1_idx` (`users_id` ASC) ,
  INDEX `fk_contacts_regions1_idx` (`regions_id` ASC) ,
  INDEX `fk_contacts_companies1_idx` (`companies_id` ASC) ,
  CONSTRAINT `fk_contacts_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `datawarehouse`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contacts_regions1`
    FOREIGN KEY (`regions_id`)
    REFERENCES `datawarehouse`.`regions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contacts_companies1`
    FOREIGN KEY (`companies_id`)
    REFERENCES `datawarehouse`.`companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`preferences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`preferences` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `datawarehouse`.`contacts_channels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datawarehouse`.`contacts_channels` (
  `id` INT(11) NOT NULL,
  `acount` VARCHAR(45) NOT NULL,
  `channels_id` INT(11) NOT NULL,
  `preferences_id` INT(11) NOT NULL,
  `contacts_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_contacts_channels_channels1_idx` (`channels_id` ASC) ,
  INDEX `fk_contacts_channels_preferences1_idx` (`preferences_id` ASC) ,
  INDEX `fk_contacts_channels_contacts1_idx` (`contacts_id` ASC) ,
  CONSTRAINT `fk_contacts_channels_channels1`
    FOREIGN KEY (`channels_id`)
    REFERENCES `datawarehouse`.`channels` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contacts_channels_preferences1`
    FOREIGN KEY (`preferences_id`)
    REFERENCES `datawarehouse`.`preferences` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contacts_channels_contacts1`
    FOREIGN KEY (`contacts_id`)
    REFERENCES `datawarehouse`.`contacts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `datawarehouse`.`channels`
-- -----------------------------------------------------
START TRANSACTION;
USE `datawarehouse`;
INSERT INTO `datawarehouse`.`channels` (`id`, `name`) VALUES (1, 'Whatsapp');
INSERT INTO `datawarehouse`.`channels` (`id`, `name`) VALUES (2, 'Facebook');
INSERT INTO `datawarehouse`.`channels` (`id`, `name`) VALUES (3, 'Instagram');
INSERT INTO `datawarehouse`.`channels` (`id`, `name`) VALUES (4, 'Email');
INSERT INTO `datawarehouse`.`channels` (`id`, `name`) VALUES (5, 'Phone');
INSERT INTO `datawarehouse`.`channels` (`id`, `name`) VALUES (6, 'Others');

COMMIT;


-- -----------------------------------------------------
-- Data for table `datawarehouse`.`preferences`
-- -----------------------------------------------------
START TRANSACTION;
USE `datawarehouse`;
INSERT INTO `datawarehouse`.`preferences` (`id`, `name`) VALUES (1, 'Sin Preferencia');
INSERT INTO `datawarehouse`.`preferences` (`id`, `name`) VALUES (2, 'Canal Favorito');
INSERT INTO `datawarehouse`.`preferences` (`id`, `name`) VALUES (3, 'No molestar');

COMMIT;

