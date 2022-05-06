-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2022 at 03:21 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scd75`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`) VALUES
(1, 'hassan@gmail.com', 'hassan');

-- --------------------------------------------------------

--
-- Table structure for table `order_table`
--

CREATE TABLE `order_table` (
  `id` int(11) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `product_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_table`
--

INSERT INTO `order_table` (`id`, `order_id`, `date`, `product_name`) VALUES
(1, '37', 'Fri May 06 2022 18:16:57 GMT+0500 (Pakistan Standard Time)', 'TEST');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `price`) VALUES
(2, 'shampoo', '0.011'),
(3, 'shampoo', '0.011'),
(4, 'shampoo', '0.011'),
(5, 'shampoo', '0.011'),
(6, 'shampoo', '0.011'),
(7, 'shampoo', '0.011'),
(8, 'shampoo', '0.011'),
(9, 'shampoo', '0.011'),
(10, 'shampoo', '0.011'),
(11, 'shampoo', '0.011'),
(12, 'shampoo', '0.011'),
(13, 'shampoo', '0.011'),
(14, 'shampoo', '0.011'),
(15, 'shampoo', '0.011'),
(16, 'shampoo', '0.011'),
(17, 'shampoo', '0.011'),
(18, 'shampoo', '0.011'),
(19, 'undefined', 'undefined'),
(20, 'undefined', 'undefined'),
(21, 'undefined', 'undefined'),
(22, 'undefined', 'undefined'),
(23, 'undefined', 'undefined'),
(24, 'undefined', 'undefined'),
(25, 'undefined', 'undefined'),
(26, 'undefined', 'undefined'),
(27, 'undefined', 'undefined'),
(28, 's', '0.1'),
(29, 's', '0.1'),
(30, 's', '0.1'),
(31, 'shampoo', '0.1'),
(32, 'shampoo', '0.4'),
(33, 'shampoo', '0.1'),
(34, 'soap', '0.1'),
(35, 'soap', '0.1'),
(36, 'soap', '0.1'),
(37, 'soap', '0.1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_table`
--
ALTER TABLE `order_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_table`
--
ALTER TABLE `order_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
