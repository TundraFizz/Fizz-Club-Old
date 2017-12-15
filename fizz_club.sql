-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2017 at 12:20 AM
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
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `summoner_id` int(20) NOT NULL,
  `summoner_name` varchar(20) NOT NULL,
  `summoner_region` varchar(10) NOT NULL,
  `summoner_level` int(10) NOT NULL,
  `summoner_icon` int(10) NOT NULL,
  `fizz_points` int(20) NOT NULL,
  `club_tag` varchar(10) NOT NULL,
  `last_played` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `summoner_id`, `summoner_name`, `summoner_region`, `summoner_level`, `summoner_icon`, `fizz_points`, `club_tag`, `last_played`) VALUES
(1, 20782632, 'Tundra Fizz', 'NA', 30, 100, 123456, 'Fizz', '2017-12-14 05:53:59'),
(2, 76750532, 'Super Galaxy', 'NA', 12, 100, 1234, 'Fizz', '2017-12-14 06:04:08');

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
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
