-- Migration pour créer la base de données hergo-back

-- Table User
CREATE TABLE IF NOT EXISTS `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('VOYAGEUR','HOTE','ADMIN') NOT NULL DEFAULT 'VOYAGEUR',
  `status` enum('ACTIF','SUSPENDU','BANNI') NOT NULL DEFAULT 'ACTIF',
  `phone` varchar(191) DEFAULT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Voyage
CREATE TABLE IF NOT EXISTS `Voyage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idVoyageur` int NOT NULL,
  `destination` varchar(191) NOT NULL,
  `dateDebut` datetime(3) NOT NULL,
  `dateFin` datetime(3) NOT NULL,
  `nombrePersonnes` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Voyage_idVoyageur_fkey` (`idVoyageur`),
  CONSTRAINT `Voyage_idVoyageur_fkey` FOREIGN KEY (`idVoyageur`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Logement
CREATE TABLE IF NOT EXISTS `Logement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `prixJour` double NOT NULL,
  `capacite` int NOT NULL,
  `adresse` varchar(191) NOT NULL,
  `ville` varchar(191) NOT NULL,
  `pays` varchar(191) NOT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `statut` enum('PUBLIE','BROUILLON','EN_ATTENTE','REJETE') NOT NULL DEFAULT 'PUBLIE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `idProprietaire` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Logement_idProprietaire_fkey` (`idProprietaire`),
  CONSTRAINT `Logement_idProprietaire_fkey` FOREIGN KEY (`idProprietaire`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Image
CREATE TABLE IF NOT EXISTS `Image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(191) NOT NULL,
  `idLogement` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Image_idLogement_fkey` (`idLogement`),
  CONSTRAINT `Image_idLogement_fkey` FOREIGN KEY (`idLogement`) REFERENCES `Logement` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Equipement
CREATE TABLE IF NOT EXISTS `Equipement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) NOT NULL,
  `idLogement` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Equipement_idLogement_fkey` (`idLogement`),
  CONSTRAINT `Equipement_idLogement_fkey` FOREIGN KEY (`idLogement`) REFERENCES `Logement` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Espace
CREATE TABLE IF NOT EXISTS `Espace` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `idLogement` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Espace_idLogement_fkey` (`idLogement`),
  CONSTRAINT `Espace_idLogement_fkey` FOREIGN KEY (`idLogement`) REFERENCES `Logement` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Reservation
CREATE TABLE IF NOT EXISTS `Reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idVoyageur` int NOT NULL,
  `idLogement` int NOT NULL,
  `dateDebut` datetime(3) NOT NULL,
  `dateFin` datetime(3) NOT NULL,
  `nombrePersonnes` int NOT NULL,
  `prixTotal` double NOT NULL,
  `statut` enum('EN_ATTENTE','CONFIRME','ANNULE','TERMINE') NOT NULL DEFAULT 'EN_ATTENTE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Reservation_idVoyageur_fkey` (`idVoyageur`),
  KEY `Reservation_idLogement_fkey` (`idLogement`),
  CONSTRAINT `Reservation_idVoyageur_fkey` FOREIGN KEY (`idVoyageur`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Reservation_idLogement_fkey` FOREIGN KEY (`idLogement`) REFERENCES `Logement` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Review
CREATE TABLE IF NOT EXISTS `Review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idVoyageur` int NOT NULL,
  `idLogement` int NOT NULL,
  `note` int NOT NULL DEFAULT 5,
  `commentaire` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Review_idVoyageur_fkey` (`idVoyageur`),
  KEY `Review_idLogement_fkey` (`idLogement`),
  CONSTRAINT `Review_idVoyageur_fkey` FOREIGN KEY (`idVoyageur`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Review_idLogement_fkey` FOREIGN KEY (`idLogement`) REFERENCES `Logement` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Notification
CREATE TABLE IF NOT EXISTS `Notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `message` varchar(191) NOT NULL,
  `type` enum('RESERVATION','MESSAGE','SYSTEM','PAIEMENT') NOT NULL,
  `lu` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Notification_idUser_fkey` (`idUser`),
  CONSTRAINT `Notification_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Reclamation
CREATE TABLE IF NOT EXISTS `Reclamation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idVoyageur` int NOT NULL,
  `idLogement` int NOT NULL,
  `sujet` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `statut` enum('EN_ATTENTE','EN_TRAITEMENT','RESOLU','REJETE') NOT NULL DEFAULT 'EN_ATTENTE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Reclamation_idVoyageur_fkey` (`idVoyageur`),
  KEY `Reclamation_idLogement_fkey` (`idLogement`),
  CONSTRAINT `Reclamation_idVoyageur_fkey` FOREIGN KEY (`idVoyageur`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Reclamation_idLogement_fkey` FOREIGN KEY (`idLogement`) REFERENCES `Logement` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;