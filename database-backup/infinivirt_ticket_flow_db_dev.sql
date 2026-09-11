-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-09-2026 a las 15:37:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `infinivirt_ticket_flow_db_dev`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE `clients` (
  `id` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `domain` varchar(70) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `phone`, `domain`, `is_active`, `created_at`, `updated_at`) VALUES
('157cfe1c-f4c1-4737-b734-5fcd09252415', 'Cliente de Prueba', 'cliente@test.com', NULL, NULL, 1, '2026-09-09 21:27:50.000', '2026-09-09 21:27:50.000'),
('22a4f2d6-f214-46db-9648-46b85e2cc17c', 'Flezy', 'admin@flezy.com.co', '3117222333', 'flezy.com.co', 1, '2026-09-11 00:44:34.255', '2026-09-11 00:44:34.255'),
('bc79c85a-77ff-4d19-93b5-3805930a9375', 'Flezy', 'admin@flezy.com.com', '3117222333', 'flezy.com.co', 1, '2026-09-11 00:46:59.234', '2026-09-11 00:46:59.234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `name` enum('ADMIN','SUPPORT_AGENT','SUPERVISOR') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
('514216ef-e448-4da7-9b5e-abb874359eec', 'SUPERVISOR', 'Supervisor operativo y de asignaciones', '2026-09-10 00:12:30.998'),
('e8e3cd22-decd-4207-a596-35f56404a35e', 'SUPPORT_AGENT', 'Agente de soporte para resolución de tickets', '2026-09-10 00:12:31.008'),
('f56aa016-1ed0-4aec-96ea-abd27482759c', 'ADMIN', 'Administrador total del sistema', '2026-09-10 00:12:30.985');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `created_by` varchar(36) NOT NULL,
  `assigned_to` varchar(36) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `status` enum('OPEN','IN_PROGRESS','PENDING','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `last_activity_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `due_at` datetime(3) DEFAULT NULL,
  `resolved_at` datetime(3) DEFAULT NULL,
  `closed_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tickets`
--

INSERT INTO `tickets` (`id`, `client_id`, `created_by`, `assigned_to`, `title`, `description`, `status`, `priority`, `created_at`, `updated_at`, `last_activity_at`, `due_at`, `resolved_at`, `closed_at`) VALUES
('4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', '157cfe1c-f4c1-4737-b734-5fcd09252415', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '157cfe1c-f4c1-4737-b734-5fcd09252415', 'Error al procesar pagos en checkout', 'El cliente reporta error 500 al enviar la tarjeta de crédito.', 'OPEN', 'HIGH', '2026-09-10 02:44:29.895', '2026-09-10 21:58:01.575', '2026-09-10 21:58:01.574', NULL, NULL, NULL),
('6d99f327-070a-4216-82d5-837bf0f62b1c', '157cfe1c-f4c1-4737-b734-5fcd09252415', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '8d146563-6539-418d-8193-a85800b3426c', 'Ese sistema viejo se cayó', 'Aburrido con el sistema comercial, a cada rato se cae ese sistema viejo', 'OPEN', 'CRITICAL', '2026-09-10 23:06:07.906', '2026-09-11 03:21:42.476', '2026-09-10 23:06:07.906', NULL, NULL, NULL),
('97670cc5-f941-43f3-842a-d9945337ef48', '157cfe1c-f4c1-4737-b734-5fcd09252415', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '157cfe1c-f4c1-4737-b734-5fcd09252415', 'Error al procesar pagos en checkout', 'El cliente reporta error 500 al enviar la tarjeta de crédito.', 'IN_PROGRESS', 'HIGH', '2026-09-10 02:39:24.581', '2026-09-10 21:58:11.752', '2026-09-10 21:58:11.751', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket_assignments`
--

CREATE TABLE `ticket_assignments` (
  `id` varchar(36) NOT NULL,
  `ticket_id` varchar(36) NOT NULL,
  `assigned_to` varchar(36) NOT NULL,
  `assigned_by` varchar(36) NOT NULL,
  `notes` varchar(520) DEFAULT NULL,
  `assigned_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `unassigned_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ticket_assignments`
--

INSERT INTO `ticket_assignments` (`id`, `ticket_id`, `assigned_to`, `assigned_by`, `notes`, `assigned_at`, `unassigned_at`) VALUES
('d27c8114-cdc6-4734-bfc1-0e4285c16b73', '97670cc5-f941-43f3-842a-d9945337ef48', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Asignación de ticket', '2026-09-10 03:40:19.325', NULL),
('fe0434dc-b11e-4160-b3ac-0029e50f4601', '6d99f327-070a-4216-82d5-837bf0f62b1c', '8d146563-6539-418d-8193-a85800b3426c', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Se asigna el Ticket al usuario ', '2026-09-11 03:21:42.479', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket_comments`
--

CREATE TABLE `ticket_comments` (
  `id` varchar(36) NOT NULL,
  `ticket_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment` text NOT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ticket_comments`
--

INSERT INTO `ticket_comments` (`id`, `ticket_id`, `user_id`, `comment`, `is_internal`, `created_at`, `updated_at`) VALUES
('20dce4c2-d078-41ef-b568-59a7aa0b62cc', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'SEgundo comentario...', 0, '2026-09-10 21:49:01.511', '2026-09-10 21:49:01.511'),
('28b5e840-04ff-479d-afca-bef361f67062', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Mi primer comentario', 0, '2026-09-10 21:47:14.258', '2026-09-10 21:47:14.258'),
('44b2e529-fc0e-4fce-b8d6-f064b1e18fd5', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Hola?', 0, '2026-09-10 21:58:01.550', '2026-09-10 21:58:01.550'),
('51865470-12cb-4a32-90d1-cda156c0acd4', '97670cc5-f941-43f3-842a-d9945337ef48', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Mi comentario', 0, '2026-09-10 21:58:11.742', '2026-09-10 21:58:11.742'),
('c3dd35bb-ae0f-4bc0-86ef-cf8fae6b7965', '97670cc5-f941-43f3-842a-d9945337ef48', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Se verificaron las trazas del cliente y efectivamente falla en la pasarela.', 1, '2026-09-10 04:35:21.183', '2026-09-10 04:35:21.183'),
('e0af16b2-6d95-4bf7-8207-a32915a9b903', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'cuarto?', 0, '2026-09-10 21:52:06.242', '2026-09-10 21:52:06.242'),
('e1b89f90-1d8d-4ac3-8c39-e9083bf505ce', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'Tercer comentario jajaja', 0, '2026-09-10 21:51:22.154', '2026-09-10 21:51:22.154'),
('e3d06bd3-e23d-4791-8ee2-16ceb0e866cd', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'fa03a976-8e5a-476d-b167-fb00f4efe352', 'quinto?', 0, '2026-09-10 21:52:55.317', '2026-09-10 21:52:55.317');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket_status_history`
--

CREATE TABLE `ticket_status_history` (
  `id` varchar(36) NOT NULL,
  `ticket_id` varchar(36) NOT NULL,
  `from_status` enum('OPEN','IN_PROGRESS','PENDING','RESOLVED','CLOSED') NOT NULL,
  `to_status` enum('OPEN','IN_PROGRESS','PENDING','RESOLVED','CLOSED') NOT NULL,
  `notes` varchar(520) DEFAULT NULL,
  `changed_by` varchar(36) NOT NULL,
  `changed_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ticket_status_history`
--

INSERT INTO `ticket_status_history` (`id`, `ticket_id`, `from_status`, `to_status`, `notes`, `changed_by`, `changed_at`) VALUES
('09d2001d-c085-4b4e-ac40-039101ba1d32', '97670cc5-f941-43f3-842a-d9945337ef48', 'OPEN', 'IN_PROGRESS', 'Tomando la incidencia para revisión en logs de pasarela', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '2026-09-10 02:55:20.795'),
('2d03b64e-0e55-4993-8888-47b137359c3e', '97670cc5-f941-43f3-842a-d9945337ef48', 'OPEN', 'OPEN', 'Ticket creado en el sistema.', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '2026-09-10 02:39:24.586'),
('434532d3-b2da-45e0-b564-1419e6e9b13c', '97670cc5-f941-43f3-842a-d9945337ef48', 'RESOLVED', 'OPEN', 'Tomando la incidencia para revisión en logs de pasarela', '157cfe1c-f4c1-4737-b734-5fcd09252415', '2026-09-10 05:16:43.067'),
('4791b892-3f4b-4ac0-9f3e-30f1ace46f98', '97670cc5-f941-43f3-842a-d9945337ef48', 'IN_PROGRESS', 'RESOLVED', 'Tomando la incidencia para revisión en logs de pasarela', '157cfe1c-f4c1-4737-b734-5fcd09252415', '2026-09-10 05:14:34.758'),
('8baf9c89-b6f6-4368-8744-ea412a5a174a', '4c2bde1b-56ae-43a9-bb6d-7d09d205b5bc', 'OPEN', 'OPEN', 'Ticket creado en el sistema.', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '2026-09-10 02:44:29.916'),
('99d3ccc6-2ce6-474c-9ad7-43b59999ec95', '6d99f327-070a-4216-82d5-837bf0f62b1c', 'OPEN', 'OPEN', 'Ticket creado en el sistema.', 'fa03a976-8e5a-476d-b167-fb00f4efe352', '2026-09-10 23:06:08.121'),
('dd95896b-0527-477f-98fe-d2ff2f49bc89', '97670cc5-f941-43f3-842a-d9945337ef48', 'OPEN', 'IN_PROGRESS', 'Tomando la incidencia para revisión en logs de pasarela', '157cfe1c-f4c1-4737-b734-5fcd09252415', '2026-09-10 05:19:30.265');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`) VALUES
('157cfe1c-f4c1-4737-b734-5fcd09252415', '514216ef-e448-4da7-9b5e-abb874359eec', 'Juan', 'Pérez', 'juan.agente@ticketflow.com', '$2b$10$/aECothxsCnoEad8JGEnGeRyDN/lKvzDyeWfyDGzAovme80iSaTU.', 1, '2026-09-10 01:13:54.721', '2026-09-10 01:13:54.721'),
('8d146563-6539-418d-8193-a85800b3426c', 'f56aa016-1ed0-4aec-96ea-abd27482759c', 'Chimuelo', 'Cat', 'chimuelito@gmail.com', '$2b$10$g4euPYmUsPC6T4tXVBH/4OhIufXLlCTUxkGEaRvTAaCEIktoNoPl6', 1, '2026-09-11 01:50:34.281', '2026-09-11 01:50:34.281'),
('fa03a976-8e5a-476d-b167-fb00f4efe352', 'f56aa016-1ed0-4aec-96ea-abd27482759c', 'Admin', 'Sistema', 'admin@ticketflow.com', '$2b$10$CbGs9v43F/cbcxs7jqYHEuhKtqc1OCIlecG7/Kclva8j1wSEi1EOy', 1, '2026-09-10 00:12:31.102', '2026-09-10 01:16:46.964');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2a22b133-3348-4d00-ac32-35a94aec1a66', '4093ffb0b590fdc4045754b501feb5853e3c5ff505a73626b543b83893c31249', '2026-09-09 22:55:55.987', '20260909225554_init_schema_mysql', NULL, NULL, '2026-09-09 22:55:54.041', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clients_email_key` (`email`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_key` (`name`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tickets_status_idx` (`status`),
  ADD KEY `tickets_priority_idx` (`priority`),
  ADD KEY `tickets_assigned_to_idx` (`assigned_to`),
  ADD KEY `tickets_client_id_idx` (`client_id`),
  ADD KEY `tickets_last_activity_at_idx` (`last_activity_at`),
  ADD KEY `tickets_created_by_fkey` (`created_by`);

--
-- Indices de la tabla `ticket_assignments`
--
ALTER TABLE `ticket_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_assignments_ticket_id_idx` (`ticket_id`),
  ADD KEY `ticket_assignments_assigned_to_fkey` (`assigned_to`),
  ADD KEY `ticket_assignments_assigned_by_fkey` (`assigned_by`);

--
-- Indices de la tabla `ticket_comments`
--
ALTER TABLE `ticket_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_comments_ticket_id_idx` (`ticket_id`),
  ADD KEY `ticket_comments_user_id_fkey` (`user_id`);

--
-- Indices de la tabla `ticket_status_history`
--
ALTER TABLE `ticket_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_status_history_ticket_id_idx` (`ticket_id`),
  ADD KEY `ticket_status_history_changed_by_fkey` (`changed_by`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_role_id_fkey` (`role_id`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ticket_assignments`
--
ALTER TABLE `ticket_assignments`
  ADD CONSTRAINT `ticket_assignments_assigned_by_fkey` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_assignments_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_assignments_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ticket_comments`
--
ALTER TABLE `ticket_comments`
  ADD CONSTRAINT `ticket_comments_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ticket_status_history`
--
ALTER TABLE `ticket_status_history`
  ADD CONSTRAINT `ticket_status_history_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_status_history_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
