-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ago 05, 2023 alle 19:11
-- Versione del server: 10.4.22-MariaDB
-- Versione PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `piscina`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `description` varchar(700) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `activities`
--

INSERT INTO `activities` (`id`, `name`, `photo`, `description`) VALUES
(1, 'Scuola Nuoto', 'http://127.0.0.1:3001/images/file-1691167480180.jpg', 'L\'attività di scuola nuoto è un programma educativo e formativo che mira a insegnare le competenze di nuoto ai partecipanti di giovane età'),
(2, 'Perfezionamento', NULL, ' il perfezionamento si concentra sulla raffinazione delle tecniche, sull\'aumento della prestazione e sulla superazione dei limiti personali. Attraverso l\'istruzione mirata, l\'allenamento specifico e la pratica intensiva, i partecipanti all\'attività di perfezionamento sviluppano una padronanza più elevata delle abilità richieste e possono raggiungere livelli di eccellenza.'),
(3, 'Nuoto Master', 'http://127.0.0.1:3001/images/file-1691167501127.jpg', 'Il nuoto master è un\'attività dedicata agli adulti che desiderano continuare a praticare il nuoto per il fitness, il benessere e la competizione a livello avanzato. Si tratta di un programma adattato alle esigenze degli adulti di diverse età e livelli di abilità, che offre l\'opportunità di migliorare le tecniche di nuoto, aumentare la resistenza e partecipare a competizioni tra pari.'),
(4, 'Agonistica', 'http://127.0.0.1:3001/images/file-1691167510662.jpg', 'L\'attività agonistica nel contesto del nuoto si riferisce a un programma intensivo e focalizzato rivolto a nuotatori di livello avanzato e competitivo. Gli atleti che partecipano all\'attività agonistica sono motivati a competere a livelli regionali, nazionali e internazionali, cercando di raggiungere le massime prestazioni nel nuoto.'),
(5, 'Acqua Gym', 'http://127.0.0.1:3001/images/file-1691167536059.jpg', 'L\'acqua gym, anche conosciuta come ginnastica in acqua o fitness in acqua, è un\'attività fisica che si svolge in piscina. Si tratta di un allenamento completo che combina esercizi aerobici, di resistenza e di tonificazione muscolare, sfruttando la resistenza dell\'acqua per ottenere benefici per la salute e il benessere.');

-- --------------------------------------------------------

--
-- Struttura della tabella `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Struttura della tabella `challenges`
--

CREATE TABLE `challenges` (
  `id` int(11) NOT NULL,
  `distance` int(11) DEFAULT NULL,
  `style` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `challenges`
--

INSERT INTO `challenges` (`id`, `distance`, `style`) VALUES
(1, 50, 'stile libero'),
(2, 100, 'stile libero'),
(3, 200, 'stile libero'),
(4, 400, 'stile libero'),
(5, 800, 'stile libero'),
(6, 1500, 'stile libero'),
(7, 50, 'delfino'),
(8, 100, 'delfino'),
(9, 200, 'delfino'),
(10, 50, 'rana'),
(11, 100, 'rana'),
(12, 200, 'rana'),
(13, 50, 'dorso'),
(14, 100, 'dorso'),
(15, 200, 'dorso');

-- --------------------------------------------------------

--
-- Struttura della tabella `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `company`
--

INSERT INTO `company` (`id`, `name`, `email`, `telephone`, `address`, `instagram`, `photo`) VALUES
(1, 'aqua-fit', 'email@prova.com', '123456', 'Via xxx numero zzz', '@nome', 'http://127.0.0.1:3001/images/file-1690904155174.png');

-- --------------------------------------------------------

--
-- Struttura della tabella `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `events`
--

INSERT INTO `events` (`id`, `name`, `location`, `startDate`, `endDate`) VALUES
(1, 'evento1', 'piscina di nesima ', '2023-07-04', '2023-07-05'),
(2, 'evento2', 'piscina comunale palermo', '2023-07-05', '2023-07-09'),
(33, 'Trofeo X', 'Catania - La playa', '2023-09-13', '2023-10-21');

--
-- Trigger `events`
--
DELIMITER $$
CREATE TRIGGER `control dates` BEFORE INSERT ON `events` FOR EACH ROW BEGIN
  IF NEW.startDate > NEW.endDate THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La data di inizio deve essere precedente alla data di fine.';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struttura della tabella `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` varchar(500) DEFAULT NULL,
  `last_edit` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `notes`
--

INSERT INTO `notes` (`id`, `user_id`, `title`, `body`, `last_edit`) VALUES
(1, 1, 'Allenamento 1', 'testo di prova provaml', NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `staff`
--

INSERT INTO `staff` (`id`, `name`, `surname`, `photo`, `instagram`, `linkedin`) VALUES
(1, 'Giuseppe', 'Rossi', 'http://127.0.0.1:3001/images/file-1691166966620.jpg', 'https://instagram.com', 'https://it.linkedin.com/'),
(2, 'Giovanni', 'Torrisi', 'http://127.0.0.1:3001/images/file-1691167008011.jpg', 'https://instagram.com', 'https://it.linkedin.com/'),
(3, 'Lorenzo', 'Verdi', 'http://127.0.0.1:3001/images/file-1691167079176.jpg', 'https://instagram.com', 'https://it.linkedin.com/'),
(4, 'Carla', 'Bianchi', 'http://127.0.0.1:3001/images/file-1691166985975.jpg', 'https://instagram.com', 'https://it.linkedin.com/'),
(5, 'Gaia', 'Verdi', NULL, 'https://instagram.com', 'https://it.linkedin.com/');

-- --------------------------------------------------------

--
-- Struttura della tabella `subscriptions`
--

CREATE TABLE `subscriptions` (
  `user_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `state` tinyint(1) DEFAULT NULL,
  `endDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `subscriptions`
--

INSERT INTO `subscriptions` (`user_id`, `activity_id`, `state`, `endDate`) VALUES
(1, 2, NULL, '2023-08-02'),
(1, 3, NULL, '2023-08-05'),
(1, 5, NULL, '2023-08-29'),
(2, 3, NULL, '2023-07-01'),
(3, 2, NULL, '2023-07-30');

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `username`, `email`, `password`, `photo`) VALUES
(1, 'Giovanni', 'Torrisi', 'giovi28', 'giovanni.torrisi6@gmail.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'http://127.0.0.1:3001/images/file-1690904780676.png'),
(2, 'user', 'user', 'user', 'user@user.com', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', 'http://127.0.0.1:3001/images/file-1691250356594.jpg'),
(3, 'Lorenzo', 'Torrisi', 'lore', 'Olank1968@teleworm.us', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `users_challenges`
--

CREATE TABLE `users_challenges` (
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL,
  `time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `users_challenges`
--

INSERT INTO `users_challenges` (`user_id`, `event_id`, `challenge_id`, `time`) VALUES
(1, 1, 1, '1.20.9'),
(1, 1, 3, '2.19.00'),
(1, 2, 3, '2.29.0'),
(1, 33, 2, NULL),
(1, 33, 8, NULL),
(1, 33, 9, NULL),
(2, 1, 1, '0.33'),
(3, 1, 6, '21.0.0'),
(3, 1, 8, '1.24.1'),
(3, 1, 14, '1.13.90');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indici per le tabelle `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`user_id`,`activity_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `users_challenges`
--
ALTER TABLE `users_challenges`
  ADD PRIMARY KEY (`user_id`,`event_id`,`challenge_id`),
  ADD KEY `challenge_id` (`challenge_id`),
  ADD KEY `users_challenges_ibfk_2` (`event_id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `challenges`
--
ALTER TABLE `challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT per la tabella `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT per la tabella `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`);

--
-- Limiti per la tabella `users_challenges`
--
ALTER TABLE `users_challenges`
  ADD CONSTRAINT `users_challenges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_challenges_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_challenges_ibfk_3` FOREIGN KEY (`challenge_id`) REFERENCES `challenges` (`id`),
  ADD CONSTRAINT `users_challenges_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
