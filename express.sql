-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 01-08-2026 a las 18:36:50
-- Versión del servidor: 8.0.45
-- Versión de PHP: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `express`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_categoria` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`, `slug`, `descripcion_categoria`, `created_at`, `updated_at`) VALUES
(1, 'Herramientas Manuales', 'herramientas-manuales', 'Herramientas operadas manualmente para trabajos de construcción y reparación', '2026-07-11 17:35:37', '2026-07-18 17:35:39'),
(2, 'Herramientas Electricas', 'herramientas-electricas', 'Herramientas motorizadas para trabajos profesionales y domésticos', '2026-07-11 17:35:37', '2026-07-18 17:35:55'),
(3, 'Fijaciones y Tornilleria', 'fijaciones-y-tornilleria', 'Elementos de fijación, tornillos, clavos y anclajes', '2026-07-11 17:35:37', '2026-07-18 17:36:11'),
(4, 'Electricidad', 'electricidad', 'Materiales eléctricos como cables, interruptores y accesorios', '2026-07-11 17:35:37', '2026-07-18 17:36:19'),
(5, 'Plomeria y Griferia', 'plomeria-y-griferia', 'Tuberías, conexiones y grifería para sistemas de agua', '2026-07-11 17:35:37', '2026-07-18 17:36:33'),
(6, 'Pinturas y Acabados', 'pinturas-y-acabados', 'Pinturas, brochas, rodillos y accesorios de pintura', '2026-07-11 17:35:37', '2026-07-18 17:36:45'),
(7, 'Construccion y Seguridad', 'construccion-y-seguridad', 'Materiales de construcción y elementos de seguridad', '2026-07-11 17:35:37', '2026-07-18 17:36:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int NOT NULL,
  `slug` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_producto` int NOT NULL,
  `id_ubicacion` int DEFAULT NULL,
  `precio_publico` decimal(12,2) NOT NULL,
  `costo_proveedor` decimal(12,2) NOT NULL,
  `stock_actual` int NOT NULL DEFAULT '0',
  `stock_minimo` int DEFAULT '0',
  `stock_maximo` int DEFAULT '0',
  `fecha_ultima_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `slug`, `id_producto`, `id_ubicacion`, `precio_publico`, `costo_proveedor`, `stock_actual`, `stock_minimo`, `stock_maximo`, `fecha_ultima_actualizacion`, `created_at`) VALUES
(1, '', 1, 1, 25.00, 18.50, 120, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(2, '', 2, 2, 12.50, 8.20, 85, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(3, '', 3, 3, 18.90, 13.10, 60, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(4, '', 4, 1, 15.40, 10.50, 95, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(5, '', 5, 4, 6.80, 4.10, 200, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(6, '', 6, 5, 11.20, 7.50, 110, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(7, '', 7, 3, 8.50, 5.20, 150, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(8, '', 8, 6, 180.00, 135.00, 45, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(9, '', 9, 6, 85.00, 62.00, 35, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(10, '', 10, 7, 145.00, 105.00, 20, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(11, '', 11, 6, 210.00, 155.00, 15, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(12, '', 12, 8, 42.00, 29.50, 50, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(13, '', 13, 9, 290.00, 215.00, 8, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(14, '', 14, 10, 15.50, 11.00, 300, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(15, '', 15, 11, 3.20, 1.80, 500, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(16, '', 16, 10, 18.50, 12.90, 150, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(17, '', 17, 12, 4.80, 2.90, 400, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(18, '', 18, 13, 5.50, 3.10, 250, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(19, '', 19, 14, 22.00, 15.00, 80, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(20, '', 20, 15, 45.00, 32.00, 140, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(21, '', 21, 15, 68.00, 49.00, 90, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(22, '', 22, 16, 7.20, 4.50, 350, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(23, '', 23, 16, 18.50, 12.20, 120, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(24, '', 24, 17, 3.10, 1.75, 400, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(25, '', 25, 18, 1.20, 0.65, 800, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(26, '', 26, 19, 2.50, 1.30, 600, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(27, '', 27, 20, 8.20, 5.10, 150, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(28, '', 28, 21, 6.50, 3.90, 200, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(29, '', 29, 22, 5.80, 3.20, 180, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(30, '', 30, 23, 14.00, 9.50, 75, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(31, '', 31, 24, 45.00, 29.00, 40, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(32, '', 32, 25, 22.00, 13.00, 60, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(33, '', 33, 26, 75.00, 52.00, 40, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(34, '', 34, 27, 16.50, 11.20, 80, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(35, '', 35, 28, 4.20, 2.40, 250, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(36, '', 36, 28, 7.80, 4.50, 150, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(37, '', 37, 29, 13.80, 9.80, 500, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(38, '', 38, 30, 28.00, 19.50, 100, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(39, '', 39, 31, 3.50, 1.90, 300, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38'),
(40, '', 40, 31, 6.50, 3.80, 120, 0, 0, '2026-07-11 17:35:38', '2026-07-11 17:35:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `id_marca` int NOT NULL,
  `nombre_marca` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`id_marca`, `nombre_marca`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Stanley', 'stanley', '2026-07-11 17:35:36', '2026-07-18 17:37:32'),
(2, 'Truper', 'truper', '2026-07-11 17:35:36', '2026-07-18 17:37:41'),
(3, 'Bahco', 'bahco', '2026-07-11 17:35:36', '2026-07-18 17:37:47'),
(4, 'Irwin', 'irwin', '2026-07-11 17:35:36', '2026-07-18 17:37:53'),
(5, 'Bellota', 'bellota', '2026-07-11 17:35:36', '2026-07-18 17:38:01'),
(6, 'DeWalt', 'deWalt', '2026-07-11 17:35:36', '2026-07-18 17:38:08'),
(7, 'Bosch', 'bosch', '2026-07-11 17:35:36', '2026-07-18 17:38:15'),
(8, 'Makita', 'makita', '2026-07-11 17:35:36', '2026-07-18 17:38:22'),
(9, 'Black+Decker', 'black+decker', '2026-07-11 17:35:36', '2026-07-18 17:39:17'),
(10, 'Mejia', 'mejia', '2026-07-11 17:35:36', '2026-07-18 17:39:25'),
(11, 'Generic', 'generic', '2026-07-11 17:35:36', '2026-07-18 17:39:32'),
(12, 'Sidor', 'sidor', '2026-07-11 17:35:36', '2026-07-18 17:39:39'),
(13, 'Hilman', 'hilman', '2026-07-11 17:35:36', '2026-07-18 17:39:46'),
(14, 'Elecon', 'elecon', '2026-07-11 17:35:36', '2026-07-18 17:39:52'),
(15, 'Schneider', 'schneider', '2026-07-11 17:35:36', '2026-07-18 17:39:58'),
(16, 'BTicino', 'bitcino', '2026-07-11 17:35:36', '2026-07-18 17:40:18'),
(17, 'Conduven', 'conduven', '2026-07-11 17:35:36', '2026-07-18 17:40:26'),
(18, '3M', '3m', '2026-07-11 17:35:36', '2026-07-18 17:40:37'),
(19, 'Pavco', 'pavco', '2026-07-11 17:35:36', '2026-07-18 17:40:44'),
(20, 'FP', 'fp', '2026-07-11 17:35:36', '2026-07-18 17:40:50'),
(21, 'Grival', 'grival', '2026-07-11 17:35:36', '2026-07-18 17:40:59'),
(22, 'Montana', 'montana', '2026-07-11 17:35:36', '2026-07-18 17:41:07'),
(23, 'VP', 'vp', '2026-07-11 17:35:36', '2026-07-18 17:41:14'),
(24, 'Exito', 'exito', '2026-07-11 17:35:36', '2026-07-18 17:41:21'),
(25, 'Acerasa', 'acerasa', '2026-07-11 17:35:36', '2026-07-18 17:41:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int NOT NULL,
  `nombre_producto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_detallada` text COLLATE utf8mb4_unicode_ci,
  `id_marca` int DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_unidad` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre_producto`, `slug`, `descripcion_detallada`, `id_marca`, `id_categoria`, `id_unidad`, `created_at`, `updated_at`) VALUES
(1, 'Juego de Destornilladores Stanley', 'juego-de-destornilladores-stanley', 'Set de 10 piezas magneticas (Estria/Pala)', 1, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(2, 'Martillo de Una 16oz', 'martillo-de-una-16oz', 'Forjado en acero con mango de fibra de vidrio', 2, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(3, 'Llave Ajustable 10\" (Sapo)', 'llave-ajustable-10-sapo', 'Acero al cromo vanadio con escala metrica', 3, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(4, 'Alicate de Presion 10\"', 'alicate-de-presion-10', 'Boca curva con corta alambre integrado', 4, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(5, 'Cinta Metrica 5m / 16ft', 'cinta-metrica-5m-16ft', 'Cinta con seguro y revestimiento de nylon', 1, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(6, 'Arco de Segueta Profesional', 'arco-de-segueta-profesional', 'Tension alta regulable, mango ergonomico', 5, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(7, 'Juego de Llaves Allen (9 pcs)', 'juego-de-llaves-allen-9-pcs', 'Medidas milimetricas de alta resistencia', 2, 1, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(8, 'Taladro Percutor DeWalt 20V', 'taladro-percutor-dewalt-20v', 'Inalambrico, mandril de 1/2 pulgada con 2 baterias', 6, 2, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(9, 'Esmeriladora Angular 4-1/2\"', 'esmeriladora-angular-4-1-2', 'Motor de 850W, 11,000 RPM profesional', 7, 2, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(10, 'Sierra Circular 7-1/4\"', 'sierra-circular-7-1-4', 'Potencia de 1800W con disco de 24 dientes carburo', 8, 2, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(11, 'Rotomartillo SDS Plus 1\"', 'rotomartillo-sds-plus-1', 'Fuerza de impacto 2.6J, 3 modos de operacion', 6, 2, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(12, 'Lijadora Orbital de Palma', 'lijadora-orbital-de-palma', '1/4 de hoja, sistema de recoleccion de polvo', 9, 2, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(13, 'Tronzadora de Metales 14\"', 'tronzadora-de-metales-14', 'Motor de 2200W para corte industrial de perfiles', 7, 2, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(14, 'Caja de Tornillos Drywall 1x1000', 'caja-de-tornillos-drywall-1x1000', 'Tornillos punta aguja para drywall fosfatados', 10, 3, 2, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(15, 'Ramplug de Plastico 3/8\" (100 pcs)', 'ramplug-de-plastico-3-8-100-pcs', 'Ramplug gris expandible para concreto', 11, 3, 3, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(16, 'Tornillo Hexagonal 3/8 x 2\" (100 pcs)', 'tornillo-hexagonal-3-8-x-2-100-pcs', 'Grado 5, acero galvanizado alta resistencia', 11, 3, 2, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(17, 'Clavo de Acero para Concreto 2\"', 'clavo-de-acero-para-concreto-2', 'Clavo estriado de alta penetracion (1kg)', 12, 3, 4, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(18, 'Arandela Plana 3/8\" (200 pcs)', 'arandela-plana-3-8-200-pcs', 'Zincada, proteccion contra la corrosion', 11, 3, 2, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(19, 'Perno Anclaje de Expansion 1/2x4\"', 'perno-anclaje-de-expansion-1-2x4', 'Anclaje de camisa para cargas pesadas (20 pcs)', 13, 3, 2, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(20, 'Cable Electrico THW #12 AWG', 'cable-electrico-thw-12-awg', 'Rollo de 100 metros, cobre 7 hilos negro', 14, 4, 5, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(21, 'Cable Electrico THW #10 AWG', 'cable-electrico-thw-10-awg', 'Rollo de 100 metros, cobre 7 hilos blanco', 14, 4, 5, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(22, 'Breaker Enchufable 1 Polo 20A', 'breaker-enchufable-1-polo-20a', 'Interruptor termomagnetico tipo QO', 15, 4, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(23, 'Breaker Enchufable 2 Polos 40A', 'breaker-enchufable-2-polos-40a', 'Proteccion 240V para aires/motores', 15, 4, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(24, 'Tomacorriente Doble con Tierra', 'tomacorriente-doble-con-tierra', 'Color blanco, linea residencial estandar', 16, 4, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(25, 'Cajetin Metalico 4x4\"', 'cajetin-metalico-4x4', 'Cajetin rectangular galvanizado para empotrar', 17, 4, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(26, 'Cinta Aislante Negra 20m', 'cinta-aislante-negra-20m', 'Cinta de PVC retardante de llama alta flexibilidad', 18, 4, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(27, 'Tubo PVC 1/2\" Aguas Negras', 'tubo-pvc-1-2-aguas-negras', 'Tubo de 6 metros alta presion pavco', 19, 5, 6, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(28, 'Tubo PVC 3/4\" Agua Potable', 'tubo-pvc-3-4-agua-potable', 'Tubo de 6 metros liso para presion', 19, 5, 6, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(29, 'Llave de Chorro 1/2\" Metalica', 'llave-de-chorro-1-2-metalica', 'Grifo de jardin de bronce de alta durabilidad', 20, 5, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(30, 'Pegamento para PVC 1/4 Galon', 'pegamento-para-pvc-1-4-galon', 'Cemento solvente transparente secado rapido', 19, 5, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(31, 'Griferia de Lavamanos Monocontrol', 'griferia-de-lavamanos-monocontrol', 'Acabado cromado brillante, cuerpo de bronce', 21, 5, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(32, 'Codo PVC 90 Grados 1/2\"', 'codo-pvc-90-grados-1-2', 'Conexion lisa para agua a presion (100 pcs)', 19, 5, 2, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(33, 'Pintura Caucho Clase A Blanco', 'pintura-caucho-clase-a-blanco', 'Cupete de 5 galones, alta cobertura lavable', 22, 6, 8, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(34, 'Pintura Caucho Clase B Gris', 'pintura-caucho-clase-b-gris', 'Galon para interiores de facil aplicacion', 23, 6, 7, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(35, 'Brocha para Pintar 4\"', 'brocha-para-pintar-4', 'Cerdas sinteticas premium, mango de madera', 24, 6, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(36, 'Rodillo de Felpa Profesional 9\"', 'rodillo-de-felpa-profesional-9', 'Para superficies rugosas y lisas con bandeja', 24, 6, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(37, 'Laminas de Zinc 3.66m', 'laminas-de-zinc-3.66m', 'Acanalada, calibre estandar para techos', 25, 7, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(38, 'Malla Truckson 4x2M', 'malla-truckson-4x2m', 'Para refuerzo de pisos y losas de concreto', 12, 7, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(39, 'Guantes de Carnaza Reforzados', 'guantes-de-carnaza-reforzados', 'Proteccion para soldadura y carga pesada', 11, 7, 9, '2026-07-11 17:35:38', '2026-07-18 17:45:50'),
(40, 'Casco de Seguridad de Obra', 'casco-de-seguridad-de-obra', 'Plastico ABS con suspension de 4 puntos amarillo', 18, 7, 1, '2026-07-11 17:35:38', '2026-07-18 17:45:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id_ubicacion` int NOT NULL,
  `pasillo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estante` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zona` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ubicacion_completa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id_ubicacion`, `pasillo`, `estante`, `zona`, `ubicacion_completa`, `created_at`, `updated_at`) VALUES
(1, 'Pasillo A', 'Estante 2', NULL, 'Pasillo A - Estante 2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(2, 'Pasillo A', 'Estante 1', NULL, 'Pasillo A - Estante 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(3, 'Pasillo A', 'Estante 3', NULL, 'Pasillo A - Estante 3', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(4, 'Pasillo A', 'Mostrador', NULL, 'Pasillo A - Mostrador', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(5, 'Pasillo A', 'Estante 4', NULL, 'Pasillo A - Estante 4', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(6, 'Pasillo B', 'Vitrina 1', NULL, 'Pasillo B - Vitrina 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(7, 'Pasillo B', 'Vitrina 2', NULL, 'Pasillo B - Vitrina 2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(8, 'Pasillo B', 'Estante 1', NULL, 'Pasillo B - Estante 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(9, 'Pasillo B', 'Suelo Metales', NULL, 'Pasillo B - Suelo Metales', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(10, 'Pasillo C', 'Estante 1', NULL, 'Pasillo C - Estante 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(11, 'Pasillo C', 'Estante 2', NULL, 'Pasillo C - Estante 2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(12, 'Pasillo C', 'Tambores', NULL, 'Pasillo C - Tambores', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(13, 'Pasillo C', 'Estante 3', NULL, 'Pasillo C - Estante 3', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(14, 'Pasillo C', 'Estante 4', NULL, 'Pasillo C - Estante 4', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(15, 'Pasillo D', 'Estante Rulos', NULL, 'Pasillo D - Estante Rulos', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(16, 'Pasillo D', 'Cajones 1', NULL, 'Pasillo D - Cajones 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(17, 'Pasillo D', 'Estante 2', NULL, 'Pasillo D - Estante 2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(18, 'Pasillo D', 'Paleta Fondo', NULL, 'Pasillo D - Paleta Fondo', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(19, 'Pasillo D', 'Mostrador', NULL, 'Pasillo D - Mostrador', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(20, 'Patio Tubos', 'A1', NULL, 'Patio Tubos - A1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(21, 'Patio Tubos', 'A2', NULL, 'Patio Tubos - A2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(22, 'Pasillo E', 'Estante 1', NULL, 'Pasillo E - Estante 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(23, 'Pasillo E', 'Estante 2', NULL, 'Pasillo E - Estante 2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(24, 'Pasillo E', 'Vitrina Grifos', NULL, 'Pasillo E - Vitrina Grifos', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(25, 'Pasillo E', 'Gavetas', NULL, 'Pasillo E - Gavetas', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(26, 'Zona Pinturas', 'Paleta 1', 'Zona Pinturas', 'Zona Pinturas - Paleta 1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(27, 'Zona Pinturas', 'Estante 2', 'Zona Pinturas', 'Zona Pinturas - Estante 2', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(28, 'Zona Pinturas', 'Accesorios', 'Zona Pinturas', 'Zona Pinturas - Accesorios', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(29, 'Patio Techado', 'Z1', 'Patio Techado', 'Patio Techado - Z1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(30, 'Patio Hierros', 'H1', 'Patio Hierros', 'Patio Hierros - H1', '2026-07-11 17:35:37', '2026-07-11 17:35:37'),
(31, 'Pasillo F', 'Seguridad', NULL, 'Pasillo F - Seguridad', '2026-07-11 17:35:37', '2026-07-11 17:35:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_medida`
--

CREATE TABLE `unidades_medida` (
  `id_unidad` int NOT NULL,
  `nombre_unidad` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviatura` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `unidades_medida`
--

INSERT INTO `unidades_medida` (`id_unidad`, `nombre_unidad`, `abreviatura`, `created_at`) VALUES
(1, 'Unidad', 'unid', '2026-07-11 17:35:37'),
(2, 'Caja', 'cj', '2026-07-11 17:35:37'),
(3, 'Paquete', 'pq', '2026-07-11 17:35:37'),
(4, 'Kilo', 'kg', '2026-07-11 17:35:37'),
(5, 'Rollo', 'rl', '2026-07-11 17:35:37'),
(6, 'Tubo', 'tb', '2026-07-11 17:35:37'),
(7, 'Galon', 'gal', '2026-07-11 17:35:37'),
(8, 'Cuñete', 'ñete', '2026-07-11 17:35:37'),
(9, 'Par', 'par', '2026-07-11 17:35:37');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_productos_completos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_productos_completos` (
`categoria` varchar(100)
,`costo_proveedor` decimal(12,2)
,`created_at` timestamp
,`descripcion_detallada` text
,`estante` varchar(50)
,`id_producto` int
,`marca` varchar(100)
,`nombre_producto` varchar(255)
,`pasillo` varchar(50)
,`precio_publico` decimal(12,2)
,`stock_actual` int
,`stock_maximo` int
,`stock_minimo` int
,`ubicacion` varchar(255)
,`unidad_abreviatura` varchar(10)
,`unidad_medida` varchar(50)
,`updated_at` timestamp
,`zona` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_productos_por_categoria`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_productos_por_categoria` (
`nombre_categoria` varchar(100)
,`stock_total` decimal(32,0)
,`total_productos` bigint
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_stock_bajo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_stock_bajo` (
`id_producto` int
,`nombre_producto` varchar(255)
,`stock_actual` int
,`stock_maximo` int
,`stock_minimo` int
,`ubicacion_completa` varchar(255)
);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre_categoria` (`nombre_categoria`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `uk_producto_ubicacion` (`id_producto`),
  ADD KEY `idx_producto_inventario` (`id_producto`),
  ADD KEY `idx_ubicacion_inventario` (`id_ubicacion`),
  ADD KEY `idx_stock_actual` (`stock_actual`),
  ADD KEY `idx_inventario_stock` (`stock_actual`),
  ADD KEY `idx_inventario_precio` (`precio_publico`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id_marca`),
  ADD UNIQUE KEY `nombre_marca` (`nombre_marca`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `idx_nombre_producto` (`nombre_producto`),
  ADD KEY `idx_marca` (`id_marca`),
  ADD KEY `idx_categoria` (`id_categoria`),
  ADD KEY `id_unidad` (`id_unidad`),
  ADD KEY `idx_producto_marca` (`id_marca`),
  ADD KEY `idx_producto_categoria` (`id_categoria`),
  ADD KEY `idx_producto_nombre` (`nombre_producto`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id_ubicacion`),
  ADD UNIQUE KEY `ubicacion_completa` (`ubicacion_completa`);

--
-- Indices de la tabla `unidades_medida`
--
ALTER TABLE `unidades_medida`
  ADD PRIMARY KEY (`id_unidad`),
  ADD UNIQUE KEY `nombre_unidad` (`nombre_unidad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id_marca` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id_ubicacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `unidades_medida`
--
ALTER TABLE `unidades_medida`
  MODIFY `id_unidad` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_productos_completos`
--
DROP TABLE IF EXISTS `vista_productos_completos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_productos_completos`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre_producto` AS `nombre_producto`, `p`.`descripcion_detallada` AS `descripcion_detallada`, `m`.`nombre_marca` AS `marca`, `c`.`nombre_categoria` AS `categoria`, `u`.`nombre_unidad` AS `unidad_medida`, `u`.`abreviatura` AS `unidad_abreviatura`, `i`.`precio_publico` AS `precio_publico`, `i`.`costo_proveedor` AS `costo_proveedor`, `i`.`stock_actual` AS `stock_actual`, `i`.`stock_minimo` AS `stock_minimo`, `i`.`stock_maximo` AS `stock_maximo`, `ub`.`ubicacion_completa` AS `ubicacion`, `ub`.`pasillo` AS `pasillo`, `ub`.`estante` AS `estante`, `ub`.`zona` AS `zona`, `p`.`created_at` AS `created_at`, `p`.`updated_at` AS `updated_at` FROM (((((`productos` `p` left join `marcas` `m` on((`p`.`id_marca` = `m`.`id_marca`))) left join `categorias` `c` on((`p`.`id_categoria` = `c`.`id_categoria`))) left join `unidades_medida` `u` on((`p`.`id_unidad` = `u`.`id_unidad`))) left join `inventario` `i` on((`p`.`id_producto` = `i`.`id_producto`))) left join `ubicaciones` `ub` on((`i`.`id_ubicacion` = `ub`.`id_ubicacion`))) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_productos_por_categoria`
--
DROP TABLE IF EXISTS `vista_productos_por_categoria`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_productos_por_categoria`  AS SELECT `c`.`nombre_categoria` AS `nombre_categoria`, count(`p`.`id_producto`) AS `total_productos`, sum(`i`.`stock_actual`) AS `stock_total` FROM ((`categorias` `c` left join `productos` `p` on((`c`.`id_categoria` = `p`.`id_categoria`))) left join `inventario` `i` on((`p`.`id_producto` = `i`.`id_producto`))) GROUP BY `c`.`id_categoria` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_stock_bajo`
--
DROP TABLE IF EXISTS `vista_stock_bajo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_stock_bajo`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre_producto` AS `nombre_producto`, `i`.`stock_actual` AS `stock_actual`, `i`.`stock_minimo` AS `stock_minimo`, `i`.`stock_maximo` AS `stock_maximo`, `ub`.`ubicacion_completa` AS `ubicacion_completa` FROM ((`productos` `p` join `inventario` `i` on((`p`.`id_producto` = `i`.`id_producto`))) left join `ubicaciones` `ub` on((`i`.`id_ubicacion` = `ub`.`id_ubicacion`))) WHERE ((`i`.`stock_actual` <= `i`.`stock_minimo`) OR (`i`.`stock_minimo` = 0)) ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id_ubicacion`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id_marca`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`id_unidad`) REFERENCES `unidades_medida` (`id_unidad`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
