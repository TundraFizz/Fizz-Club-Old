-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2017 at 12:15 AM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fizz_club`
--

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` int(10) NOT NULL,
  `region` varchar(10) NOT NULL,
  `tag` varchar(10) NOT NULL,
  `club_table` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `region`, `tag`, `club_table`) VALUES
(33, 'NA', 'Fizz', 'club_na_fizz'),
(34, 'NA', 'Swag', 'club_na_swag'),
(35, 'OCE', 'Fish', 'club_oce_fish');

-- --------------------------------------------------------

--
-- Table structure for table `club_na_fizz`
--

CREATE TABLE `club_na_fizz` (
  `id` int(10) NOT NULL,
  `summoner_id` int(20) NOT NULL,
  `summoner_name` varchar(20) NOT NULL,
  `summoner_level` int(10) NOT NULL,
  `summoner_icon` int(10) NOT NULL,
  `fizz_points` int(20) NOT NULL,
  `last_played` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `club_na_fizz`
--

INSERT INTO `club_na_fizz` (`id`, `summoner_id`, `summoner_name`, `summoner_level`, `summoner_icon`, `fizz_points`, `last_played`) VALUES
(1, 77191987, 'GnarsBadFurDay', 39, 3147, 10900, '2017-12-11 04:22:36'),
(2, 20782632, 'Tundra Fizz', 50, 773, 272380, '2017-12-16 08:27:56'),
(3, 22307408, 'Sohleks', 41, 1160, 54183, '2017-11-13 01:46:07'),
(4, 26433460, 'Abdul', 39, 3185, 25049, '2017-12-10 07:43:03');

-- --------------------------------------------------------

--
-- Table structure for table `club_na_swag`
--

CREATE TABLE `club_na_swag` (
  `id` int(10) NOT NULL,
  `summoner_id` int(20) NOT NULL,
  `summoner_name` varchar(20) NOT NULL,
  `summoner_level` int(10) NOT NULL,
  `summoner_icon` int(10) NOT NULL,
  `fizz_points` int(20) NOT NULL,
  `last_played` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `club_na_swag`
--

INSERT INTO `club_na_swag` (`id`, `summoner_id`, `summoner_name`, `summoner_level`, `summoner_icon`, `fizz_points`, `last_played`) VALUES
(1, 66452348, 'Atlantean Fizz', 30, 773, 25716, '2016-11-27 03:33:15'),
(2, 24386577, 'Fisherman Fizz', 53, 3099, 193080, '2017-12-17 10:23:17'),
(3, 38034131, 'GeGe InInDerr', 42, 3232, 5170, '2017-12-19 20:30:15'),
(4, 43875891, 'kimalsgud', 41, 3186, 784, '2017-01-27 04:33:44'),
(5, 47821759, 'PG 0ne Magneto', 45, 3013, 38434, '2017-10-30 02:22:49'),
(6, 63416411, 'Void Fizz', 30, 773, 7579, '2017-07-03 09:41:59'),
(7, 35080935, 'LegacyOfDanny', 40, 3016, 635, '2017-08-21 08:27:47'),
(8, 23628508, 'LittleBro123', 38, 3233, 16801, '2017-11-19 05:52:34');

-- --------------------------------------------------------

--
-- Table structure for table `club_oce_fish`
--

CREATE TABLE `club_oce_fish` (
  `id` int(10) NOT NULL,
  `summoner_id` int(20) NOT NULL,
  `summoner_name` varchar(20) NOT NULL,
  `summoner_level` int(10) NOT NULL,
  `summoner_icon` int(10) NOT NULL,
  `fizz_points` int(20) NOT NULL,
  `last_played` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `club_oce_fish`
--

INSERT INTO `club_oce_fish` (`id`, `summoner_id`, `summoner_name`, `summoner_level`, `summoner_icon`, `fizz_points`, `last_played`) VALUES
(1, 315144, 'Fish', 30, 563, 7668, '2017-03-18 12:41:44');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(10) NOT NULL,
  `group_name` text NOT NULL,
  `manage_accounts` tinyint(1) NOT NULL DEFAULT '0',
  `manage_clubs` tinyint(1) NOT NULL DEFAULT '0',
  `club_leader` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `group_name`, `manage_accounts`, `manage_clubs`, `club_leader`) VALUES
(1, 'Admin', 1, 1, 1),
(2, 'Club Leader', 0, 0, 1),
(3, 'Club Member', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(20) NOT NULL,
  `groups_id` int(10) NOT NULL,
  `username` varchar(20) NOT NULL,
  `clubs_in` text NOT NULL,
  `password_hash` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `groups_id`, `username`, `clubs_in`, `password_hash`) VALUES
(1, 1, 'admin', '2,3', '$2a$12$8uzCQNWrLaciebRtLm5AL.yS02HPJ0TPpBNGCsVPWCbBFWhgH5a2m');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club_na_fizz`
--
ALTER TABLE `club_na_fizz`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club_na_swag`
--
ALTER TABLE `club_na_swag`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `club_oce_fish`
--
ALTER TABLE `club_oce_fish`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `club_na_fizz`
--
ALTER TABLE `club_na_fizz`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `club_na_swag`
--
ALTER TABLE `club_na_swag`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `club_oce_fish`
--
ALTER TABLE `club_oce_fish`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
