-- Komiks·Lab — резервна копія бази
-- 2026-09-24T10:47:42+00:00 · MySQL · таблиць: 20
-- УВАГА: файл містить пошти й хеші паролів учасників. Зберігайте його в безпеці.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------- kl_bans ----------
DROP TABLE IF EXISTS `kl_bans`;
CREATE TABLE `kl_bans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `ip_hash` char(64) DEFAULT NULL,
  `until_at` int(11) NOT NULL,
  `reason` varchar(120) NOT NULL DEFAULT '',
  `by_id` int(10) unsigned DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kl_bans_user` (`user_id`),
  KEY `kl_bans_ip` (`ip_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_bans` (`id`, `user_id`, `ip_hash`, `until_at`, `reason`, `by_id`, `created_at`) VALUES ('1', NULL, NULL, '1789847881', 'wall', '1', '1789844281');
INSERT INTO `kl_bans` (`id`, `user_id`, `ip_hash`, `until_at`, `reason`, `by_id`, `created_at`) VALUES ('2', '1', NULL, '1790076452', 'wall', '1', '1789990052');
INSERT INTO `kl_bans` (`id`, `user_id`, `ip_hash`, `until_at`, `reason`, `by_id`, `created_at`) VALUES ('3', '1', NULL, '1790185701', 'wall', '1', '1790182101');

-- ---------- kl_billing ----------
DROP TABLE IF EXISTS `kl_billing`;
CREATE TABLE `kl_billing` (
  `user_id` int(10) unsigned NOT NULL,
  `customer` varchar(64) NOT NULL DEFAULT '',
  `subscription` varchar(64) NOT NULL DEFAULT '',
  `status` varchar(24) NOT NULL DEFAULT '',
  `period_end` int(11) DEFAULT NULL,
  `updated_at` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- kl_blocks ----------
DROP TABLE IF EXISTS `kl_blocks`;
CREATE TABLE `kl_blocks` (
  `user_id` int(10) unsigned NOT NULL,
  `blocked_id` int(10) unsigned NOT NULL,
  `created_at` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`blocked_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- kl_captcha_used ----------
DROP TABLE IF EXISTS `kl_captcha_used`;
CREATE TABLE `kl_captcha_used` (
  `nonce` char(16) NOT NULL,
  `exp` int(11) NOT NULL,
  PRIMARY KEY (`nonce`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_captcha_used` (`nonce`, `exp`) VALUES ('e67d25cc564adc07', '1790209498');

-- ---------- kl_comments ----------
DROP TABLE IF EXISTS `kl_comments`;
CREATE TABLE `kl_comments` (
  `id` char(12) NOT NULL,
  `owner` char(6) NOT NULL,
  `name` varchar(40) NOT NULL,
  `avatar` varchar(80) NOT NULL,
  `text` varchar(1200) NOT NULL,
  `akey_hash` char(64) NOT NULL,
  `created_at` int(11) NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `ip_hash` char(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kl_comments_owner` (`owner`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_comments` (`id`, `owner`, `name`, `avatar`, `text`, `akey_hash`, `created_at`, `user_id`, `ip_hash`) VALUES ('09b886131001', 'WZECR2', 'BILOHASH', '🦁|beanie|mask|stripes|pink', 'Hi, Laurence, Veldig bra?', '8f966516e94897b599f675ae4d9e939eebd85dbe2fcc7a0018d7fa4b27ec3cd5', '1789853715', '1', '0e95045ad155c230c58133c11cec009f504b09eb38a198b4fa5808d9031e3329');
INSERT INTO `kl_comments` (`id`, `owner`, `name`, `avatar`, `text`, `akey_hash`, `created_at`, `user_id`, `ip_hash`) VALUES ('5ffc09e905b1', 'WZECR2', 'Hana', '🦁|beanie|mask|stripes|pink', 'hi', 'eb7fbb4bb8b342c131b7c406efd6b34b58a853aaea59ea40691bda44cafc3e71', '1790015065', '7', '42c07084338788171d8315e4c9c578068528a39e68764ecd54f2a3dde9e2d548');

-- ---------- kl_feedback ----------
DROP TABLE IF EXISTS `kl_feedback`;
CREATE TABLE `kl_feedback` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kind` varchar(10) NOT NULL,
  `text` varchar(2000) NOT NULL,
  `email` varchar(190) NOT NULL DEFAULT '',
  `page` varchar(190) NOT NULL DEFAULT '',
  `lang` varchar(5) NOT NULL DEFAULT '',
  `user_id` int(10) unsigned DEFAULT NULL,
  `ip_hash` char(64) DEFAULT NULL,
  `ua` varchar(190) NOT NULL DEFAULT '',
  `created_at` int(11) NOT NULL,
  `done_at` int(11) DEFAULT NULL,
  `file` varchar(120) NOT NULL DEFAULT '',
  `file_name` varchar(120) NOT NULL DEFAULT '',
  `file_type` varchar(40) NOT NULL DEFAULT '',
  `file_size` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `kl_feedback_new` (`done_at`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_feedback` (`id`, `kind`, `text`, `email`, `page`, `lang`, `user_id`, `ip_hash`, `ua`, `created_at`, `done_at`, `file`, `file_name`, `file_type`, `file_size`) VALUES ('1', 'topic', 'Додай більше найкращих гравців придумай візьми із бази', 'rbilohash@gmail.com', '#/', 'uk', '1', 'f7910e06c0f0cf8c97c9d319bf7d6bff87d9947e6a44b123b2e58e29f755d562', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36', '1790209211', '1790209328', '20260924-3e39c326ade6cfad.jpg', '1.jpg', 'image/jpeg', '257490');

-- ---------- kl_hunt ----------
DROP TABLE IF EXISTS `kl_hunt`;
CREATE TABLE `kl_hunt` (
  `code` char(5) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `state` mediumtext NOT NULL,
  `updated` int(11) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('GGR5Y', 'b01823f3b327bc2111250639b66de46de172b1fed8d7d889f0ef29a9992c6ca5', '{\"kind\":\"run\",\"phase\":\"lobby\",\"x\":0,\"left\":0,\"hint\":\"Se til høyre — der kommer noe!\",\"lastWord\":\"\",\"players\":[],\"items\":[]}', '1789856860');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('HYK27', 'c77ec7a494d5ca53ea29011936064eef4c486b2a47ecc10669f6c11b3b32b1f9', '{\"kind\":\"run\",\"phase\":\"lobby\",\"x\":0,\"left\":0,\"hint\":\"Se til høyre — der kommer noe!\",\"lastWord\":\"\",\"players\":[],\"items\":[]}', '1789857609');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('K4J7P', '368b3c1ff855b770b9080948cd8f6e4537f8b5df554b6b52572f31c279208022', '{\"phase\":\"lobby\",\"players\":[],\"want\":10}', '1789858128');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('KQ7EQ', 'e1ca97e4a1595ee2c46c58b867a5c2a6a580bc6b5fde6094f33189f8e51b3ccd', '{\"phase\":\"lobby\",\"players\":[],\"want\":10}', '1789857593');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('LBSWW', '0e9f30771a42562750bc96602719a9176d3b9a26e52c5a7b080def23bffd3a98', '{\"phase\":\"lobby\",\"players\":[],\"i\":0,\"total\":0,\"round\":null,\"want\":10}', '1789856920');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('P7JT4', '45bea683267ded2cacb23520efd2d982ab6384c179b3b8b5a9032fe160a4b5e6', '{\"phase\":\"lobby\",\"players\":[],\"i\":0,\"total\":0,\"round\":null,\"want\":8}', '1789857039');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('PL6YK', '5b4b8e52353e4681679b10539f893acd664a59f911f364ca0187f3c407a8dcc7', '{\"phase\":\"lobby\",\"players\":[],\"want\":10}', '1789857585');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('QRLDL', 'ca1481d47bfc7a1fcfb25fa05e85f2f8acf6f974e812b8fa17d8beaf2c6e0aea', '{\"phase\":\"lobby\",\"players\":[],\"want\":10}', '1789856968');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('TEST2', '0db3c6f1f48bcf3f5ba800b356bbf5a6f92e273c96447b501b1b69efa4a3f0c3', '{\"phase\":\"lobby\",\"players\":[],\"want\":10}', '1789855972');
INSERT INTO `kl_hunt` (`code`, `token_hash`, `state`, `updated`) VALUES ('YTBZH', 'bb0f444125fce20e994413fe42f773d92509c381ed770e28d3134f9c702a433a', '{\"phase\":\"lobby\",\"players\":[],\"want\":10}', '1789857729');

-- ---------- kl_hunt_ev ----------
DROP TABLE IF EXISTS `kl_hunt_ev`;
CREATE TABLE `kl_hunt_ev` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` char(5) NOT NULL,
  `body` text NOT NULL,
  `ts` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kl_hunt_ev_code` (`code`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('1', 'GGR5Y', '{\"t\":\"hello\",\"name\":\"BILOHASH\",\"avatar\":\"🦊\",\"pid\":\"rk96rx58b\"}', '1789856868');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('2', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856869');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('3', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856870');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('4', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856870');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('5', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856871');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('6', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856872');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('7', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856872');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('8', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856873');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('9', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856873');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('10', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856874');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('11', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856874');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('12', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856875');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('13', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856875');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('14', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856876');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('15', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856877');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('16', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856877');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('17', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856878');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('18', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856878');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('19', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856879');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('20', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856879');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('21', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856880');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('22', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856881');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('23', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856881');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('24', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856882');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('25', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856883');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('26', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856883');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('27', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856884');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('28', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856884');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('29', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856885');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('30', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856885');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('31', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856886');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('32', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856887');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('33', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856887');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('34', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856888');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('35', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856888');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('36', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856889');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('37', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856890');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('38', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856890');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('39', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856891');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('40', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856891');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('41', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856892');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('42', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856892');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('43', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856893');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('44', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856894');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('45', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856894');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('46', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856895');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('47', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856895');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('48', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856896');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('49', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856896');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('50', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856897');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('51', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856897');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('52', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856898');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('53', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856899');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('54', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856899');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('55', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856900');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('56', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856900');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('57', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856901');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('58', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856901');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('59', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856902');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('60', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856903');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('61', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856903');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('62', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856904');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('63', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856904');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('64', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856905');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('65', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856905');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('66', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856906');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('67', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856906');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('68', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856907');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('69', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856908');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('70', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856908');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('71', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856909');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('72', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856909');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('73', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856910');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('74', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856911');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('75', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856911');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('76', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856912');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('77', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856912');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('78', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856913');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('79', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856913');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('80', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856914');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('81', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856914');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('82', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856915');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('83', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856916');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('84', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856916');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('85', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856917');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('86', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856917');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('87', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856918');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('88', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856918');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('89', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856919');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('90', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856920');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('91', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856920');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('92', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856921');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('93', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856921');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('94', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856922');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('95', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856922');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('96', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856923');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('97', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856923');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('98', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856924');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('99', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856925');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('100', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856925');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('101', 'GGR5Y', '{\"t\":\"ping\",\"pid\":\"rk96rx58b\"}', '1789856926');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('102', 'LBSWW', '{\"t\":\"hello\",\"name\":\"BILOHASH\",\"avatar\":\"🦊\",\"pid\":\"r73d562o6\"}', '1789856931');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('103', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856932');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('104', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856932');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('105', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856933');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('106', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856933');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('107', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856934');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('108', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856934');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('109', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856935');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('110', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856936');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('111', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856936');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('112', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856937');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('113', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856938');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('114', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856938');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('115', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856939');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('116', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856939');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('117', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856940');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('118', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856940');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('119', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856941');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('120', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856942');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('121', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856942');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('122', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856943');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('123', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856944');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('124', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856944');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('125', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856945');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('126', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856946');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('127', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856946');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('128', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856947');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('129', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856947');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('130', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856948');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('131', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856948');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('132', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856949');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('133', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856949');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('134', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856950');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('135', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856951');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('136', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856951');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('137', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856952');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('138', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856952');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('139', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856953');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('140', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856954');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('141', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856954');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('142', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856955');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('143', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856955');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('144', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856956');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('145', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856956');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('146', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856957');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('147', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856958');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('148', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856958');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('149', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856959');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('150', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856959');
INSERT INTO `kl_hunt_ev` (`id`, `code`, `body`, `ts`) VALUES ('151', 'LBSWW', '{\"t\":\"ping\",\"pid\":\"r73d562o6\"}', '1789856960');

-- ---------- kl_invites ----------
DROP TABLE IF EXISTS `kl_invites`;
CREATE TABLE `kl_invites` (
  `code_hash` char(64) NOT NULL,
  `inviter_id` int(10) unsigned NOT NULL,
  `created_at` int(11) NOT NULL,
  `expires_at` int(11) NOT NULL,
  `used_by` int(10) unsigned DEFAULT NULL,
  `used_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`code_hash`),
  KEY `kl_invites_inviter` (`inviter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_invites` (`code_hash`, `inviter_id`, `created_at`, `expires_at`, `used_by`, `used_at`) VALUES ('aa0dee2091142c08ae2f0252a5bf90fac479aada1d7ec0df425048663a28b662', '1', '1790111677', '1792703677', NULL, NULL);
INSERT INTO `kl_invites` (`code_hash`, `inviter_id`, `created_at`, `expires_at`, `used_by`, `used_at`) VALUES ('ddefa365bc2d34932a7ab510db01f671b2891d9791eb7f1497bb95a8b8356b3c', '1', '1789990091', '1792582091', NULL, NULL);

-- ---------- kl_messages ----------
DROP TABLE IF EXISTS `kl_messages`;
CREATE TABLE `kl_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_id` int(10) unsigned NOT NULL,
  `to_id` int(10) unsigned NOT NULL,
  `text` varchar(1000) NOT NULL,
  `created_at` int(11) NOT NULL,
  `read_at` int(11) DEFAULT NULL,
  `reported_at` int(11) DEFAULT NULL,
  `hidden_from` tinyint(4) NOT NULL DEFAULT 0,
  `hidden_to` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `kl_msg_to` (`to_id`,`read_at`),
  KEY `kl_msg_pair` (`from_id`,`to_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- kl_meta ----------
DROP TABLE IF EXISTS `kl_meta`;
CREATE TABLE `kl_meta` (
  `k` varchar(40) NOT NULL,
  `v` varchar(255) NOT NULL,
  PRIMARY KEY (`k`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.chat_prompt', '');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.model', '');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_greeting', 'Hei! Det er meg. Har du tid til en liten prat nå?');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_model', 'gpt-realtime');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_noise', 'near_field');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_prompt', '# Role\nYou are a warm, ordinary Norwegian person having a short phone call with someone who is learning\nNorwegian. You are NOT a teacher and NOT an assistant — you are a friend, neighbour, colleague or\nshop assistant who happens to be talking to them on t');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_prompt_id', '');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_stt', 'gpt-realtime-whisper');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.rt_voice', 'ash');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.tts_provider', 'openai');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('ai.tts_voice', 'marin');
INSERT INTO `kl_meta` (`k`, `v`) VALUES ('schema', '11');

-- ---------- kl_notices ----------
DROP TABLE IF EXISTS `kl_notices`;
CREATE TABLE `kl_notices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `ip_hash` char(64) DEFAULT NULL,
  `kind` varchar(12) NOT NULL,
  `text` varchar(300) NOT NULL DEFAULT '',
  `by_id` int(10) unsigned DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `seen_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kl_notices_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_notices` (`id`, `user_id`, `ip_hash`, `kind`, `text`, `by_id`, `created_at`, `seen_at`) VALUES ('1', NULL, NULL, 'ban', 'Перша перемога', '1', '1789844281', NULL);
INSERT INTO `kl_notices` (`id`, `user_id`, `ip_hash`, `kind`, `text`, `by_id`, `created_at`, `seen_at`) VALUES ('2', '1', NULL, 'warn', 'Det er test!', '1', '1789849530', '1789849604');
INSERT INTO `kl_notices` (`id`, `user_id`, `ip_hash`, `kind`, `text`, `by_id`, `created_at`, `seen_at`) VALUES ('3', '1', NULL, 'ban', 'Зу', '1', '1789990052', '1790003764');
INSERT INTO `kl_notices` (`id`, `user_id`, `ip_hash`, `kind`, `text`, `by_id`, `created_at`, `seen_at`) VALUES ('4', '1', NULL, 'ban', 'Лаоаоапоа', '1', '1790182101', '1790182123');

-- ---------- kl_players ----------
DROP TABLE IF EXISTS `kl_players`;
CREATE TABLE `kl_players` (
  `code` char(6) NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `secret_hash` char(64) NOT NULL,
  `name` varchar(40) NOT NULL,
  `avatar` varchar(80) NOT NULL,
  `learn` varchar(80) NOT NULL,
  `level` varchar(3) NOT NULL,
  `stars` int(11) NOT NULL,
  `badges` int(11) NOT NULL,
  `streak` int(11) NOT NULL,
  `act` varchar(16) NOT NULL,
  `snap` text NOT NULL,
  `seen` int(11) NOT NULL,
  `updated` int(11) NOT NULL,
  `since` int(11) NOT NULL,
  `active` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`code`),
  KEY `kl_players_seen` (`seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('483TMF', NULL, 'cf3b2fe7b38e41ce1351f494bf8ce3977cce4e4d3081b34873ec52fbfa5c3f38', 'Alina', '🐑', 'norsk', 'A1', '0', '0', '0', 'account', 'eyJuIjoiQWxpbmEiLCJhIjoi8J-QkSIsImZjIjoiNDgzVE1GIiwiYyI6IjIwMjYtMDktMThUMjI6MTM6MDUuNTk5WiIsImF0IjoiMjAyNi0wOS0yNCIsInYiOls2NSwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXSwiciI6W119', '1790246108', '1790246108', '1790246042', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('ABGYTN', NULL, 'fb21c42a316e3ea9f60f90249054736d3973221a64a28899a362af36ad73b9c4', 'Moderator', '🐼', 'norsk', 'A1', '0', '0', '1', 'account', 'eyJuIjoiTW9kZXJhdG9yIiwiYSI6IvCfkLwiLCJmYyI6IkFCR1lUTiIsImMiOiIyMDI2LTA5LTE5VDE2OjQ2OjU5Ljc1N1oiLCJhdCI6IjIwMjYtMDktMTkiLCJ2IjpbMzAsMSwwLDAsMCwwLDAsMSwwLDAsMCwwLDAsMCwwLDAsMF0sInIiOltdfQ', '1789836825', '1789836825', '1789836429', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('ESPEN7', '4', '11beefd0991d24e5b3d09f2a2be375eae85b3a88a9c49573816cd0a462005a3c', 'Espen', '🐻|gamer||norflag|aurora', 'norsk,math', 'A2', '34', '6', '9', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('HANA2K', '7', 'cb43d4ff65c78687ef985d2ef2c24124bdc2f4ab9e9f25fcb148a4d617397a9d', 'Hana', '🦉|jester||norflag|midnight', 'norsk,english', 'B1', '55', '9', '14', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('HDDHPH', '1', 'd964deb33a4b0285029a78de1ee70744859dc826d482daa519de1dbebdebf945', 'BILOHASH', '🐮|beanie|patch|medal', 'norsk,english,math,logic', 'B2', '1823', '29', '8', 'tests', 'eyJuIjoiQklMT0hBU0giLCJhIjoi8J-QrnxiZWFuaWV8cGF0Y2h8bWVkYWwiLCJmYyI6IkhEREhQSCIsImMiOiIyMDI2LTA5LTE5VDE4OjI4OjExKzAwOjAwIiwiYXQiOiIyMDI2LTA5LTI0IiwidiI6WzY1LDI1LDU4LDEzMCwyNzQsMCwwLDgsODYsMjgsNCwxMSwwLDExLDAsMjIwOSw3XSwiciI6W1si8J-agCBNYXRoIFJvY2tldCIsMzgsNDMsMiwiMjAyNi0wOS0yNCIsMCwwXSxbIuKZnyBTamFrayDQv9GA0L7RgtC4IEFkYW0iLDIsMiwzLCIyMDI2LTA5LTIzIiwwLDBdLFsi8J-agCBNYXRoIFJvY2tldCIsMzYsNDEsMiwiMjAyNi0wOS0yMyIsMCwwXSxbIvCfk4og0JzQvtGXINC_0L7QvNC40LvQutC4IiwyLDQsMSwiMjAyNi0wOS0yMyIsMCwwXSxbIktvbmp1bmtzam9uZXIgb2cgc3VianVua3Nqb25lciIsMTAsMTEsMywiMjAyNi0wOS0yMyIsMCwwXV19', '1790246317', '1790246317', '1789852254', '163');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('KAJA2N', '3', '115626d666e04915976845b82f7af5d7d2089e51e827c8177bf2ad18f8c73571', 'Kaja', '🐧|beanie||norflag|ice', 'norsk', 'A1', '18', '3', '5', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('LIV2NT', '5', 'c589e147a5c8fa6a430e7ae9c4ec36a075bd54198336435604f5876516de108d', 'Liv', '🦊|wizard|||ice', 'norsk', 'A1', '12', '2', '3', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('NUR2KA', '9', '09e05a51a2ae18af0a16a93a4404e37e1cb553997694d78bc372d828c1386a09', 'Noor', '🐰|unicorn||bolt|ice', 'norsk', 'A1', '8', '2', '2', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('SOND3R', '6', '40608fe14f5fc099c17e7dcd383145174dd859658b728bf6f7f1fc41d3ec75da', 'Sondre', '🐺|astro||bolt|neon', 'norsk,logic', 'A2', '41', '7', '11', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('TAREK2', '8', 'f912b683462a1ee00593c952c4bb97fa13ea4faf58e03f9fde6eb0b7afe5f3e5', 'Tarek', '🐯|samurai|cyber||lava', 'norsk,math', 'A2', '29', '5', '7', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('ULAV2N', '10', 'a507d6e180cb6b1f20c298a366283e8303501385ed9339626179c18bf460cf8f', 'Olav', '🦁|astro|laser|norflag|lava', 'norsk,logic,math', 'B1', '62', '11', '20', 'read', '', '1790246862', '1790246862', '1789037262', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('V376PP', NULL, '021e481c84c8ec00ef40f46dc4bf633b6880155e43f3fc9e15e38560aefacf70', 'Liv', '🦊', 'norsk', 'A1', '0', '0', '0', 'account', 'eyJuIjoiTGl2IiwiYSI6IvCfpooiLCJmYyI6IlYzNzZQUCIsImMiOiIyMDI2LTA5LTE5VDIxOjI4OjQ1KzAwOjAwIiwiYXQiOiIyMDI2LTA5LTE5IiwidiI6WzMwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDBdLCJyIjpbXX0', '1789854983', '1789854983', '1789854983', '0');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('WZECR2', '2', '00f2d487a47c9ccaa83ebfed1ce89f5b457a1eed9ca133437149eedcf48424ac', 'Laurence', '🦊', 'norsk,math', 'A1', '270', '3', '1', 'read', 'eyJuIjoiTGF1cmVuY2UiLCJhIjoi8J-miiIsImZjIjoiV1pFQ1IyIiwiYyI6IjIwMjYtMDktMTlUMTg6MzM6MjIrMDA6MDAiLCJhdCI6IjIwMjYtMDktMjAiLCJ2IjpbMzAsMCwyLDYsMCwwLDAsMSwyLDIsMCwyLDAsMCwwLDExNjQsMF0sInIiOltbIvCfmoAgTWF0aCBSb2NrZXQiLDIyLDIyLDMsIjIwMjYtMDktMjAiLDAsMF0sWyJBbGZhYmV0dGVzdCIsMTAsMTAsMywiMjAyNi0wOS0yMCIsMCwwXV19', '1789941964', '1789941964', '1789854551', '5');
INSERT INTO `kl_players` (`code`, `user_id`, `secret_hash`, `name`, `avatar`, `learn`, `level`, `stars`, `badges`, `streak`, `act`, `snap`, `seen`, `updated`, `since`, `active`) VALUES ('YSD9RM', NULL, '2fecdf16cc9043f658a9cf9ce1c9a444675f3d71246d92e87db11fd56bdb73c1', 'BILOHASH', '🦊', 'norsk', 'A1', '0', '0', '1', 'player', 'eyJuIjoiQklMT0hBU0giLCJhIjoi8J-miiIsImZjIjoiWVNEOVJNIiwiYyI6IjIwMjYtMDktMTlUMTU6NTY6MjEuMjE0WiIsImF0IjoiMjAyNi0wOS0xOSIsInYiOlszMCwwLDAsMCwwLDAsMCwxLDAsMCwwLDAsMCwwLDAsMCwwXSwiciI6W119', '1789833620', '1789833620', '1789833389', '0');

-- ---------- kl_rate ----------
DROP TABLE IF EXISTS `kl_rate`;
CREATE TABLE `kl_rate` (
  `k` varchar(100) NOT NULL,
  `n` int(11) NOT NULL,
  `reset_at` int(11) NOT NULL,
  PRIMARY KEY (`k`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('02ee9b39f37299b9d72f7b3075e46404aaae158a:3600', '1', '1790196006');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('04b50620d00abf56670e8aefe70a410022c63207:3600', '3', '1790190150');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('05541e3201657761882ce71979e95f67e95a30f1:3600', '24', '1790219547');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('05bdda4995d8003bb49d147abf325d90b9b22963:86400', '10', '1790278743');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('097fbceaadad547258aaae06f4d0cf7c900f0f55:3600', '1', '1790212811');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('0b7ba3a08a7d5829aea678d8edf8bc2a0e184ecb:3600', '1', '1789939713');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('0cd274031b424dad986eec360d9bf07282f1e5dc:900', '1', '1790195245');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('104fc00b17c8439f20d22ac33465eec48bcb5cb7:3600', '1', '1790070426');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('10c4bf7821209f70a48114bfdda561e5975880ce:3600', '1', '1790194967');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('16144249339360732864e9b40bc2c508a31ec7f9:3600', '12', '1790197581');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('189300fc30c745df668fb7455dec0bb3cba50e4d:3600', '22', '1789909562');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('1f9765ecd02f2cb27398d442a78e93e26d1269ed:30', '1', '1790182127');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('21d9ebc5c36198f8853621dd04b2c986904d9443:86400', '1', '1790278843');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('23270213dcc74317b824f89bf67064e767215171:3600', '5', '1790185680');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('2456e4b3b1cb530bdbd23217ebd97ea03956bf2d:3600', '1', '1789852917');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('27cc3e2d0a2dbd89cb8464ab150729ba2c20085b:3600', '2', '1790185535');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('28089fa56bccf20616a0074007f4cc5182bd0298:3600', '28', '1790247867');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('294ff6922f42e8939f634a118105c521a3805144:3600', '36', '1789904332');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('2aa85dfb0fa146a27fa8011e2a5f87d4b53448d2:3600', '6', '1790071936');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('2ac5cecf632bbc01ace294c289b41fdf43c2ccd7:30', '1', '1789853745');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('2cf0e17d771223d84fb16671f9c563beb7f00243:900', '1', '1790070069');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('2ddcfb326b1b0264d66f0c984ac75ee33eabed46:900', '2', '1789843301');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('33ab3650795969d6616192e3dfa4c7f89d155f59:3600', '2', '1790185539');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('35384cbff338187d8d3df622f9614633a47da6aa:900', '1', '1790069233');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('389907efb0fdd9bf0a82f072548bbc9394ba64cb:900', '1', '1790016008');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('3ac59fb7bbb55a75836dc7e2bf091a066a926618:3600', '1', '1789846695');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('3c84c8f568f60a8717305ce639ec14778030b232:3600', '1', '1790242456');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('3cb0ee3de4bb089517d296bacb1470beaadcfdb3:3600', '1', '1790060562');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('3e500264da12b24e60e1ba1358d946c6259c677a:3600', '40', '1790214522');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('3ef4af5ae92cb0bcc1033ad6c7bfe962c01566a3:3600', '1', '1789934894');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('41950e989ba03e75d19fd0155fee20007f275e28:3600', '2', '1790207232');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('425e42411ab0a1f603c5a691f836d51d339b0c1e:3600', '5', '1789853278');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('458eee86aea4f42b94f6550a60b32e55ac1f2235:3600', '1', '1790249879');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('4c4d8a2ee7db6d7d4419f953d95e02d152aef6c0:3600', '1', '1790200892');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('4d01c044f142f55243804a3b75dcc4e00136ac10:86400', '1', '1790259224');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('51129040dd1e775ef9b4be52581529122ae6a5fb:900', '2', '1789849948');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('5271c082cb859ffd184170ee922e9602cf26e207:3600', '3', '1790064204');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('552a8e34a063a2eb497ac3b5f8a5648a874ceb98:3600', '1', '1790249917');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('56ff0940ca4d612094ecc4e3915faef7aaf16aff:30', '1', '1789990078');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('5999fb4fd9289a2d6eef976238c8cd81adce5f5c:900', '1', '1790246513');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('59ebe5078a361beb1ad32a4c3b6db298e39703b8:3600', '1', '1790242472');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('5a5e749aaef684c2e5d783726a888aa74c0638ba:60', '8', '1789857093');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('5bbfec9df730b7fc784f7e506a8933e7b04c3028:3600', '6', '1790083865');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('5e6b3f324abadaca6eccb249683930dbb37bebc0:3600', '2', '1789957866');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('639ebc74f6f9518f724deae297c0d89b1411fc47:3600', '2', '1790249821');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('64bc473f95b6c6666692052e108def0936af6409:86400', '1', '1790198077');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('64d2aa40daf3415a8fce90a417b85b89b61223b0:900', '1', '1790013714');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('64e36b3525e9a1126c054c50e57dbc471636ee94:900', '2', '1790212327');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('683ebeb2a2fb8f0b94169459e6bf60bf52e4fae7:3600', '4', '1790200830');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6b35ccdf351d2793c3a4ff3bb36c1fb6e1508e79:86400', '1', '1790281629');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6bf3f9316728db952f63701869c3a2ead593239d:3600', '1', '1790249973');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6d18bdd2836d68e2db5a1435730a8c3abd0fe2ff:900', '1', '1789855868');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6d6efcaf290f07d89ecca3da834f02a5bbcfbb91:3600', '1', '1789853146');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6ddce4d790828a1f1e1127022b80d7409fbb131d:900', '1', '1789891272');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6f55aeb442b645c12405e8b37a4427fa73f2ef1b:3600', '1', '1790212798');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6fac9228d3a1fa6506c7e24161f1644dc7d9af4b:900', '3', '1790172848');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6fad3c61bffc9ac068ce3903c0928eb9606e5b70:900', '1', '1790016008');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('6fdbd9fdb3deafb0353cdddbda65d96cbdd54eb3:900', '1', '1790015701');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('716d74d3deaa4de24c42f1e9414037abdec66b77:3600', '1', '1789993646');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('738474d3952e597432f1b195516759d7594dd5a1:900', '3', '1790247106');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7719a68055487a67a53ee1f1a2ad06078df3b27a:3600', '3', '1790249642');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('791537a1449b211dcc27c812eee3bee03eecf101:3600', '1', '1790248728');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('79d765efad9d2c50b74912409139daea8e28718f:3600', '2', '1790101919');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7a48fe076bb598e9b2151f1690a561726853a041:3600', '5', '1790186656');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7aa35eef80972d7785d474a675deae44acc521a8:900', '2', '1789906858');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7aae3545c66fb46e9f646f5531f8c593e29dd9c2:60', '3', '1789858152');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7beb4e37bb1203133b2500860171a5a416da1d45:900', '1', '1790206956');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7d0946cbe1dca36e8f0943286ad9221d689f1e3f:86400', '2', '1790277748');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7d7c0eed427052c468613df4507eea7ed93dded3:3600', '4', '1790195968');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('7f90a8a4ebc7b36cba07dedce3c0e984776389d4:3600', '9', '1790176590');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('849b39b21eaf229bd9fdc4df9f78b03c316d5f17:900', '2', '1789849887');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('84dc8fdbc817f0d49079258af339da9c6d080b4e:3600', '1', '1790062789');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('84e0b3473602c8dca247be09c317d2f045fc8ccc:3600', '1', '1790249973');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('85f4535352dc6f834587ab9e6c9c32f6bf2729e1:900', '2', '1790099218');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('893b9faf151d20cd0f9f2787ef885e5e19031047:86400', '1', '1790292527');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('8947d049335f0c26ebf0eb0f8fe336c29e81fae7:900', '3', '1790247106');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('8d07f2782e3ef0632b16e9e2088c87f7bcd2de5b:86400', '2', '1790277929');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('8f9019bac317e6288719622395aedb4c76c81dd9:3600', '15', '1790040964');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('907cda826f9e0b57105d6a0f1a8548a16d65d92b:900', '1', '1790194877');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('90e5225eabe4d130d954f56b01466a20419b312b:3600', '1', '1789858633');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('92183dcd1f626a20ae24324884389bd7a6b5f88a:60', '50', '1789856991');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('93589e3dadca7d85f785c76ad9374a136b608006:900', '1', '1790186385');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('93cccd0cf88dae6accba8e3414160ba8a5a4fa23:86400', '1', '1790277472');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('93dc1da88e3573109c3a559d75c51050c087e1ba:3600', '1', '1790245155');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('95ba5506e4d87fee8f54c750edd6b4952f0815e1:3600', '6', '1790215028');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('9a5a470105caf55551eac187dc3e71a6c40ffdb0:900', '4', '1790006367');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('9b949a5a08ccf46e02a3ec72c21abbb5a341b548:3600', '1', '1790005632');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('9c8918dc7b303d2b4f075e2c6c2807d00daf5581:900', '1', '1790172550');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('9f3532360587d52b2f1f0be4c8005090ecd40b8a:3600', '1', '1790212463');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('9f49ca7b9825da0a38ed7bb1bcdde5f1026634c3:3600', '26', '1790189307');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('a156f279eb1253735c0515bc9a379d96668d129e:3600', '1', '1790176424');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('a76806f8d1ed80f4d6b09e7d1486b03d56582cf8:900', '1', '1790186387');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('a7e5878cb9bfc358f2fab43fe1d288af87a5c98e:30', '1', '1789849353');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('a953764876c39b6a588b181268ca97a3330d497c:3600', '1', '1790077165');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('a9a3c547a6c0eac11949a1d39dca5f229f1b6f68:86400', '1', '1790280452');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('ae972ac1026a786d25553e5a2f74ded4df20d891:86400', '1', '1790026861');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('b1e8640036dce856c103bfb82a9dd13d780d22d8:86400', '1', '1790101465');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('b9fd0962ee12b77dbd6452522c2d24b791b42409:900', '2', '1789906859');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('ba338708beea8580c8c2f98764b2d36ef8b35392:3600', '1', '1789857313');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('be260a288f75f764da75b32bacfb04573b290b23:86400', '1', '1789935723');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('beafb3e8964a3e9b636959ab04a8b2741b3a0d8f:3600', '4', '1790189088');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('c3af07ffbfff596d7269de59e6aeec1994665059:3600', '6', '1789858569');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('c3c1cfec2304d26887851ab1fba80732c04fdbf7:3600', '15', '1789992479');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('c787af76305f86cd11de391eb02be885260a2040:3600', '1', '1790249822');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('d057a975ddbe868c647743f01e9f05f67c9458d6:3600', '21', '1790175252');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('d08e12d88a9d8d8c7fffa213a82ba7d4033e844a:3600', '10', '1790115999');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('d0bc631f359efc77c647f9f55eb51a1b5f4f0e5f:900', '1', '1789850018');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('d2dbcaaec12afdb072ffe7bc3f0ecaf38aab96f2:3600', '1', '1790070426');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('d5ab183852d687bda6fd8ce5272db359f8784863:86400', '1', '1790076448');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('dadb75da1393ff801647f23d69541706ba2fe714:3600', '37', '1790189310');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('dd78f4e171814b7e1d91abffe9f65950fedf4905:3600', '6', '1789852719');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('de62ec2a03248ada9052b2597de06e05c34eacdb:3600', '1', '1790214600');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('df13bcc2a82bfc7a24e417b143bad92d2f11d8ad:3600', '4', '1790016411');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('df48f19f6ae0760c5b4f2c89ae995e34a1aece75:3600', '1', '1790237006');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('dfd4709735bf9c4441613baedd82577b757df322:3600', '2', '1790150586');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e36f3da43cc729904673f5c297436ac445beb312:30', '1', '1789940491');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e57b726b06233f369f09e05cb793795df7551b54:900', '1', '1790186385');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e5fe653896fa3ca09fd141cfa80f31b1521d9477:900', '1', '1790246513');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e697c585ceecfd298d706a3c52e8ff8f528186dc:3600', '1', '1790214873');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e6acf7cf090062df484bc63c15fd7b911ffd2c4e:86400', '3', '1790278768');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e6ef3fd009cea24db7008edc654a2c6c6b5dafa0:900', '1', '1790193598');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e7b854791292a300c20df1dc1a35d1faef3ba762:86400', '1', '1790297673');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('e961404bedbf0e82948c1bb698174214f4c9c9fd:3600', '1', '1790077165');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('eb9d2399882713a5775814bd3cec032477f5823e:3600', '2', '1790018655');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('ee32576a2885419c3356a17f0ebf51bd6619b31b:3600', '3', '1790245154');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('ef506deb164f5c81b4ef5b9b76d7e37e3beae8e2:86400', '1', '1790281570');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f00d2abed22bc3aadbccda2d0243690c4df2d343:3600', '7', '1789909559');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f38fe8154d3f829a6bb175f84daf022a0e9a1395:3600', '1', '1789944058');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f548fde37211cdc481d0b0edb30922b51974fab0:3600', '6', '1789988929');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f6dc0b1a5d114ac182d9d831c4cb3a6f0375952d:3600', '1', '1789858634');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f86cfe4cddb620b0c2210d3f5c3b1f0c2c474e94:86400', '1', '1790268497');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f9363683f3471e4fcb98ef915cdb649cfe1b64c3:3600', '1', '1790196043');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('f93d23199cfefb7a3128916c1585cc07a2a7d0f0:3600', '1', '1790071934');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('fb9421345e38cee5d80b7678dd47daf75923934e:3600', '1', '1790118594');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('fcbdfc9bc28222d9657b5274dbcc43eaf9b7c993:30', '1', '1790015095');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('fe516102ed3abd47e803a00925b37f8bd0d2d881:3600', '25', '1790118675');
INSERT INTO `kl_rate` (`k`, `n`, `reset_at`) VALUES ('ff5989e3e87d491c7e4b585139d2e97b44a9ef59:86400', '1', '1789940115');

-- ---------- kl_sessions ----------
DROP TABLE IF EXISTS `kl_sessions`;
CREATE TABLE `kl_sessions` (
  `token_hash` char(64) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` int(11) NOT NULL,
  `expires_at` int(11) NOT NULL,
  `last_seen` int(11) NOT NULL,
  `ua` varchar(190) NOT NULL DEFAULT '',
  PRIMARY KEY (`token_hash`),
  KEY `kl_sessions_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('1493bca7b2f6c7c9e8228be04d47cacbc0dbb29522471c32acdf2f3b3ce457f1', '1', '1790212279', '1792804279', '1790233406', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/153.0.8010.24 Mobile/15E148 Safari/604.1');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('1ddd61cec225357c743ed511db698d580f1d3fb6c0b07fb48d542f2bb4398d8f', '3', '1790193977', '1792785977', '1790193977', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('1f14e4657b5f0fb421ae5832b4881e2d5fb43f38c7d4292dc4a5a5b0cd5a8c98', '1', '1790245613', '1792837613', '1790245613', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('269d4389cf27536ad2e30d037ca5de41c50f01106e7d85b14676e0dff8d1b798', '1', '1790211427', '1792803427', '1790245128', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('4dce700f2d941c9ffe93f885936096187a3b6fb6c622972032dcfd0de8c9e7fc', '4', '1790098318', '1792690318', '1790098318', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('68a735f2d57bcbe780e1a52e3629d0ea7b67aa707877844b22a531f8149440d5', '2', '1789906411', '1792498411', '1789906411', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('94f637ab61740bb374d3409c5281c5f115dc5d528ba71e2390d9069c53f034c4', '1', '1789849118', '1792441118', '1790012805', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/153.0.8010.24 Mobile/15E148 Safari/604.1');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('a0523da6f6586f1a8151350aa1cd0cbac59e6d7092773ce165886dfbbee53337', '1', '1790206056', '1792798056', '1790244267', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('a30bce0de24b53a01c4e732cbbe9125f5b22a4eb6ceb33e4fa2b85fcef95a9fe', '3', '1790171651', '1792763651', '1790171651', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('aea4345e950ebd00683eaec17184c133acc28712b8880e3168d4ef8d088ed312', '2', '1789905959', '1792497959', '1789905959', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('cf48b06c5053ef37d7075fbbf11e2095710f22fc44b121a9bcc0f0cfb1e8b972', '3', '1789853349', '1792445349', '1789853349', 'Python-urllib/3.14');
INSERT INTO `kl_sessions` (`token_hash`, `user_id`, `created_at`, `expires_at`, `last_seen`, `ua`) VALUES ('f202b45dd8afd843083f63de9ca6b744cba44a0f8be76430de29bdbde3b020e8', '10', '1790098337', '1792690337', '1790207302', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0');

-- ---------- kl_teachers ----------
DROP TABLE IF EXISTS `kl_teachers`;
CREATE TABLE `kl_teachers` (
  `user_id` int(10) unsigned NOT NULL,
  `school` varchar(120) NOT NULL DEFAULT '',
  `role` varchar(80) NOT NULL DEFAULT '',
  `country` varchar(60) NOT NULL DEFAULT '',
  `proof` varchar(1200) NOT NULL DEFAULT '',
  `link` varchar(190) NOT NULL DEFAULT '',
  `file` varchar(120) NOT NULL DEFAULT '',
  `file_name` varchar(120) NOT NULL DEFAULT '',
  `file_type` varchar(40) NOT NULL DEFAULT '',
  `status` varchar(10) NOT NULL DEFAULT 'pending',
  `note` varchar(300) NOT NULL DEFAULT '',
  `created_at` int(11) NOT NULL,
  `decided_at` int(11) DEFAULT NULL,
  `by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_teachers` (`user_id`, `school`, `role`, `country`, `proof`, `link`, `file`, `file_name`, `file_type`, `status`, `note`, `created_at`, `decided_at`, `by_id`) VALUES ('1', 'skole', 'god i norsk', 'Drammen', 'посилання на сторінку школи, де видно ваше ім’я;\nфото робочого посвідчення або бейджа (дані можна закрити пальцем);\nскан розкладу, шкільна пошта, лист від адміністрації;\nбудь-що інше, що переконає нас.', 'https://google.com', '20260923-9cf94b8ebd57b120.jpg', '1.jpg', 'image/jpeg', 'ok', '', '1790206127', '1790209315', '1');

-- ---------- kl_tokens ----------
DROP TABLE IF EXISTS `kl_tokens`;
CREATE TABLE `kl_tokens` (
  `token_hash` char(64) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `kind` varchar(12) NOT NULL,
  `expires_at` int(11) NOT NULL,
  `used_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`token_hash`),
  KEY `kl_tokens_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('05134cfcd938f63ce6cfb310a0fefa1781a1a2b94753c956f346fc1e322a4db6', '12', 'verify', '1790239626', NULL);
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('0e7ba1735f498ef1f50eff68dfc8017cd8c34112536a1ec8fb6f1c1aebe33fba', '14', 'verify', '1790419194', '1790246441');
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('2db862d2cb628ed416702e589d3de1a00d2d983f067b09e644acd3eb5677996c', '14', 'verify', '1790419173', '1790246394');
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('30924a0a3b9d7052c2278e4448554af2c9e73c6e8b2ff0e2787112b388f9dc58', '11', 'reset', '1790608715', NULL);
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('56967f2b00689c8ccfc359a89e49077275fe0cfdd20bd120a862427109824101', '1', 'reset', '1789858634', NULL);
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('acea6574209555a0fc3665c277da0af0ce58e78c45c19c30787183e956cbf550', '2', 'reset', '1790447602', NULL);
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('d0cc70ecfdd3243b46c794c62e6b7de17a596b24f149a1801d92499cb0470dc0', '13', 'verify', '1790246365', NULL);
INSERT INTO `kl_tokens` (`token_hash`, `user_id`, `kind`, `expires_at`, `used_at`) VALUES ('f67a81918f1a2fdb0dde105c7bf7b84e4c3a38c79f78bec6b2909b97a630963e', '14', 'verify', '1790419241', NULL);

-- ---------- kl_user_data ----------
DROP TABLE IF EXISTS `kl_user_data`;
CREATE TABLE `kl_user_data` (
  `user_id` int(10) unsigned NOT NULL,
  `k` varchar(64) NOT NULL,
  `v` mediumtext NOT NULL,
  `updated_at` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`k`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'alphaVisited', 'true', '1790207580');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'avatar', '\"🐮|beanie|patch|medal\"', '1790202085');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'callOfferAt', '1790240625896', '1790240633');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'cards', '{\"aviser\":{\"box\":1,\"due\":1789672035398},\"borte\":{\"box\":1,\"due\":1789672045861},\"ikke\":{\"box\":1,\"due\":1789672047821},\"gjerne\":{\"box\":1,\"due\":1789672051169},\"beliggenheten\":{\"box\":1,\"due\":1789672056000},\"hvordan\":{\"box\":1,\"due\":1789672059360},\"skogen\":{\"box\":1,\"due\":1789672061119},\"maler\":{\"box\":1,\"due\":1789672062656},\"ved siden av\":{\"box\":1,\"due\":1789672072382},\"egentlig\":{\"box\":1,\"due\":1789672079884},\"giftig\":{\"box\":1,\"due\":1789672088946},\"feber\":{\"box\":1,\"due\":1789672091901},\"åtte\":{\"box\":1,\"due\":1789672094282},\"klokka ti\":{\"box\":1,\"due\":1789672095903},\"mulighet\":{\"box\":1,\"due\":1789672099198},\"balkong\":{\"box\":1,\"due\":1789672102314},\"snøball\":{\"box\":1,\"due\":1789672106450},\"vondt i halsen\":{\"box\":1,\"due\":1789672110606},\"rydder\":{\"box\":1,\"due\":1789672113367},\"bodd\":{\"box\":1,\"due\":1789672116810},\"redd\":{\"box\":1,\"due\":1789673881348},\"trenger\":{\"box\":1,\"due\":1789673882818},\"nye\":{\"box\":1,\"due\":1789673884597},\"flink\":{\"box\":1,\"due\":1789673885778},\"lørdag\":{\"box\":1,\"due\":1789673887491},\"der borte\":{\"box\":1,\"due\":1789717853603},\"åtti\":{\"box\":1,\"due\":1789717855135},\"hundre\":{\"box\":1,\"due\":1789717856407},\"tjue\":{\"box\":1,\"due\":1789717857704},\"hvor\":{\"box\":1,\"due\":1789717861991},\"melk\":{\"box\":1,\"due\":1789717863412},\"blomster\":{\"box\":1,\"due\":1789726047973},\"trodde\":{\"box\":1,\"due\":1789726060298},\"kjempestor\":{\"box\":1,\"due\":1789728751532},\"tusen takk\":{\"box\":1,\"due\":1789728753484},\"kroner\":{\"box\":1,\"due\":1789728755045},\"kutja\":{\"box\":1,\"due\":1789745217119},\"nydelig\":{\"box\":1,\"due\":1789745220189},\"begge\":{\"box\":1,\"due\":1789745226166},\"pinnekjøtt\":{\"box\":1,\"due\":1789745234903},\"kakao\":{\"box\":1,\"due\":1789828479723},\"sammen\":{\"box\":1,\"due\":1789828482654},\"lett\":{\"box\":1,\"due\":1789828487696},\"betale med kort\":{\"box\":1,\"due\":1789828493769},\"en hyttetur\":{\"box\":1,\"due\":1789828501423},\"hjem\":{\"box\":1,\"due\":1789828504689},\"glad i deg\":{\"box\":1,\"due\":1789828509184},\"betyr\":{\"box\":1,\"due\":1789828512288},\"vi er fire\":{\"box\":1,\"due\":1789828516729},\"bestille\":{\"box\":1,\"due\":1789828523244},\"hvitt\":{\"box\":1,\"due\":1789657354040},\"kaldt\":{\"box\":1,\"due\":1789657356158},\"varm dere\":{\"box\":1,\"due\":1789657367482},\"lukter\":{\"box\":1,\"due\":1789660415956},\"sukker\":{\"box\":1,\"due\":1789660422990},\"mel\":{\"box\":1,\"due\":1789660426224},\"bake\":{\"box\":1,\"due\":1789660430680},\"morgen\":{\"box\":1,\"due\":1789660432704},\"smøret\":{\"box\":1,\"due\":1789660441579},\"skatter\":{\"box\":1,\"due\":1789660445059},\"hjelpe\":{\"box\":1,\"due\":1789660447449},\"ferdig\":{\"box\":1,\"due\":1789660450512},\"egg\":{\"box\":1,\"due\":1789660452710},\"kake\":{\"box\":1,\"due\":1789660455365},\"spis\":{\"box\":1,\"due\":1789660457924},\"beste\":{\"box\":1,\"due\":1789660461015},\"godt\":{\"box\":1,\"due\":1789660463221},\"kjøkkenet\":{\"box\":1,\"due\":1789660466663},\"skjev\":{\"box\":1,\"due\":1789660472202},\"morsom\":{\"box\":1,\"due\":1790183801062},\"å synes\":{\"box\":1,\"due\":1790183807343},\"en mening\":{\"box\":1,\"due\":1790183811133},\"to ganger\":{\"box\":1,\"due\":1790183814139},\"å stole på\":{\"box\":1,\"due\":1790183817275},\"å smake\":{\"box\":1,\"due\":1790183819313},\"sikkert\":{\"box\":1,\"due\":1790183824081},\"erfaringen\":{\"box\":1,\"due\":1790187201071},\"ute\":{\"box\":1,\"due\":1790187202639},\"eple\":{\"box\":1,\"due\":1790187203953},\"sende\":{\"box\":1,\"due\":1790187206970},\"onkelen\":{\"box\":1,\"due\":1790187209707},\"tradisjonell\":{\"box\":1,\"due\":1790187212160},\"bankid\":{\"box\":1,\"due\":1790187228246},\"en barnehage\":{\"box\":1,\"due\":1790187231261}}', '1790187231');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'chess3d', 'false', '1789848486');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'chessBot', '\"BQAD9M\"', '1790201565');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'chessColor', '\"w\"', '1789848306');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'chessElo', '806', '1790201766');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'chessStats', '{\"w\":3,\"d\":1,\"l\":1,\"hist\":[772,786,801,793,806]}', '1790201766');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'chessTime', '0', '1789848303');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'days', '[\"2026-09-17\",\"2026-09-18\",\"2026-09-19\",\"2026-09-20\",\"2026-09-21\",\"2026-09-22\",\"2026-09-23\",\"2026-09-24\"]', '1790201766');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'dirListed', 'true', '1790246317');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'en.seen.e1', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'en.seen.e2', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'en.seen.e3', '[0]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'en.seen.e4', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'en.seen.e6', '[0]', '1790202134');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'en.seen.e7', '[0]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'errlog', '{\"line:Hvor lenge tar det?\":{\"n\":1,\"type\":\"who\",\"uk\":\"\",\"en\":\"\",\"line\":\"Hvor lenge tar det?\",\"quiz\":\"p118\",\"qtitle\":\"Den raske bilen\",\"last\":\"2026-09-23T19:47:06.258Z\"},\"timen\":{\"n\":1,\"type\":\"blank\",\"uk\":\"година (i timen — на годину)\",\"en\":\"the hour (i timen — per hour)\",\"line\":\"Hundre og åtti kilometer i timen! Wow!\",\"quiz\":\"p118\",\"qtitle\":\"Den raske bilen\",\"last\":\"2026-09-23T19:47:08.771Z\"},\"line:Og jeg vil ha jordbæris!\":{\"n\":1,\"type\":\"panel\",\"uk\":\"\",\"en\":\"\",\"line\":\"Og jeg vil ha jordbæris!\",\"quiz\":\"p118\",\"qtitle\":\"Den raske bilen\",\"last\":\"2026-09-23T19:47:10.663Z\"},\"O\":{\"n\":1,\"type\":\"letter\",\"uk\":\"\",\"en\":\"\",\"line\":\"\",\"quiz\":\"alphabet\",\"qtitle\":\"Alfabettest\",\"last\":\"2026-09-23T20:02:58.099Z\"},\"Å\":{\"n\":2,\"type\":\"listen\",\"uk\":\"частка перед інфінітивом (як «to» в англ.); «Å nei!» — Ой ні!\",\"en\":\"to (before a verb); «Å nei!» — Oh no!\",\"line\":\"\",\"quiz\":\"mistakes\",\"qtitle\":\"📊 Мої помилки\",\"last\":\"2026-09-23T20:03:56.102Z\"},\"Z\":{\"n\":2,\"type\":\"listen\",\"uk\":\"\",\"en\":\"\",\"line\":\"\",\"quiz\":\"mistakes\",\"qtitle\":\"📊 Мої помилки\",\"last\":\"2026-09-23T20:03:52.620Z\"},\"line:Det er min kopp. Din kopp er rød!\":{\"n\":1,\"type\":\"who\",\"uk\":\"\",\"en\":\"\",\"line\":\"Det er min kopp. Din kopp er rød!\",\"quiz\":\"p121\",\"qtitle\":\"Min, mi, mitt eller mine?\",\"last\":\"2026-09-23T20:14:19.376Z\"},\"line:Er dette koppen din eller koppen min?\":{\"n\":1,\"type\":\"panel\",\"uk\":\"\",\"en\":\"\",\"line\":\"Er dette koppen din eller koppen min?\",\"quiz\":\"p121\",\"qtitle\":\"Min, mi, mitt eller mine?\",\"last\":\"2026-09-23T20:14:29.536Z\"},\"klokke\":{\"n\":2,\"type\":\"listen\",\"uk\":\"годинник\",\"en\":\"clock\",\"line\":\"\",\"quiz\":\"mistakes\",\"qtitle\":\"📊 Мої помилки\",\"last\":\"2026-09-23T20:17:39.315Z\"},\"et klasserom\":{\"n\":1,\"type\":\"emoji\",\"uk\":\"клас\",\"en\":\"a classroom\",\"line\":\"\",\"quiz\":\"words\",\"qtitle\":\"Ord\",\"last\":\"2026-09-23T20:18:51.553Z\"},\"et pass\":{\"n\":1,\"type\":\"listen\",\"uk\":\"паспорт\",\"en\":\"a passport\",\"line\":\"\",\"quiz\":\"words\",\"qtitle\":\"Ord\",\"last\":\"2026-09-23T20:19:20.389Z\"},\"Hvilken\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"який\",\"en\":\"which\",\"line\":\"\",\"quiz\":\"grammar:question-words\",\"qtitle\":\"Spørreord — Питальні слова\",\"last\":\"2026-09-23T20:31:46.046Z\"},\"Hvem\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"хто, чий\",\"en\":\"who, whose\",\"line\":\"\",\"quiz\":\"grammar:question-words\",\"qtitle\":\"Spørreord — Питальні слова\",\"last\":\"2026-09-23T20:31:57.134Z\"},\"Hvorfor\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"чому\",\"en\":\"why\",\"line\":\"\",\"quiz\":\"grammar:question-words\",\"qtitle\":\"Spørreord — Питальні слова\",\"last\":\"2026-09-23T20:32:13.348Z\"},\"Hvordan\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"як\",\"en\":\"how\",\"line\":\"\",\"quiz\":\"grammar:question-words\",\"qtitle\":\"Spørreord — Питальні слова\",\"last\":\"2026-09-23T20:32:33.875Z\"},\"Hva\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"що\",\"en\":\"what\",\"line\":\"\",\"quiz\":\"grammar:question-words\",\"qtitle\":\"Spørreord — Питальні слова\",\"last\":\"2026-09-23T20:32:52.773Z\"},\"Det\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"це, воно; у безособових реченнях не перекладається\",\"en\":\"it; that; there (as in «there is»)\",\"line\":\"\",\"quiz\":\"grammar:pron-subj\",\"qtitle\":\"Personlige pronomen — Особові займенники\",\"last\":\"2026-09-23T22:06:51.869Z\"},\"line:Har du hentekoden?\":{\"n\":1,\"type\":\"panel\",\"uk\":\"\",\"en\":\"\",\"line\":\"Har du hentekoden?\",\"quiz\":\"p112\",\"qtitle\":\"På posten\",\"last\":\"2026-09-23T22:09:16.950Z\"},\"line:Husleia kan som hovedregel bare justeres\":{\"n\":1,\"type\":\"panel\",\"uk\":\"\",\"en\":\"\",\"line\":\"Husleia kan som hovedregel bare justeres etter konsumprisindeksen én gang i året.\",\"quiz\":\"p153\",\"qtitle\":\"Rettigheter som leietaker\",\"last\":\"2026-09-23T23:39:56.390Z\"},\"di\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"твоя\",\"en\":\"your (feminine)\",\"line\":\"\",\"quiz\":\"grammar:possessive\",\"qtitle\":\"Eiendomspronomen\",\"last\":\"2026-09-23T23:43:42.802Z\"},\"en vare\":{\"n\":1,\"type\":\"emoji\",\"uk\":\"товар\",\"en\":\"an item\",\"line\":\"\",\"quiz\":\"words:butikk\",\"qtitle\":\"🛒 På butikken\",\"last\":\"2026-09-23T23:56:28.570Z\"},\"dyr\":{\"n\":1,\"type\":\"emoji\",\"uk\":\"дорогий\",\"en\":\"expensive\",\"line\":\"\",\"quiz\":\"words:butikk\",\"qtitle\":\"🛒 På butikken\",\"last\":\"2026-09-23T23:56:40.341Z\"},\"kommer fra\":{\"n\":1,\"type\":\"listen\",\"uk\":\"походить з\",\"en\":\"comes from\",\"line\":\"\",\"quiz\":\"level:A1\",\"qtitle\":\"Nivåtest A1\",\"last\":\"2026-09-24T00:04:26.740Z\"},\"gikk\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"ішов, пішов\",\"en\":\"went\",\"line\":\"\",\"quiz\":\"grammar:verb-past\",\"qtitle\":\"Verb i preteritum\",\"last\":\"2026-09-24T00:18:18.214Z\"},\"ventet\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"чекав\",\"en\":\"waited\",\"line\":\"\",\"quiz\":\"grammar:verb-past\",\"qtitle\":\"Verb i preteritum\",\"last\":\"2026-09-24T00:18:20.952Z\"},\"så\":{\"n\":1,\"type\":\"grammar\",\"uk\":\"так, такий; потім\",\"en\":\"so; then; saw (se)\",\"line\":\"\",\"quiz\":\"grammar:verb-past\",\"qtitle\":\"Verb i preteritum\",\"last\":\"2026-09-24T00:18:40.947Z\"},\"ikke\":{\"n\":1,\"type\":\"blank\",\"uk\":\"не\",\"en\":\"not\",\"line\":\"Aha! Tror er når du ikke vet sikkert.\",\"quiz\":\"level:A2\",\"qtitle\":\"Nivåtest A2\",\"last\":\"2026-09-24T00:18:46.436Z\"},\"line:Det er en tradisjonell drakt fra et best\":{\"n\":1,\"type\":\"panel\",\"uk\":\"\",\"en\":\"\",\"line\":\"Det er en tradisjonell drakt fra et bestemt sted i Norge.\",\"quiz\":\"level:A2\",\"qtitle\":\"Nivåtest A2\",\"last\":\"2026-09-24T00:18:52.498Z\"},\"åpne\":{\"n\":1,\"type\":\"blank\",\"uk\":\"відчиняти\",\"en\":\"to open\",\"line\":\"Kan du åpne munnen og si «a»?\",\"quiz\":\"level:A2\",\"qtitle\":\"Nivåtest A2\",\"last\":\"2026-09-24T00:19:01.718Z\"},\"resept\":{\"n\":1,\"type\":\"type\",\"uk\":\"рецепт\",\"en\":\"a prescription\",\"line\":\"Nei, disse får du uten resept.\",\"quiz\":\"level:A2\",\"qtitle\":\"Nivåtest A2\",\"last\":\"2026-09-24T00:19:40.748Z\"},\"line:Nei, det er pennalet deres – barna i kla\":{\"n\":1,\"type\":\"truefalse\",\"uk\":\"\",\"en\":\"\",\"line\":\"Nei, det er pennalet deres – barna i klasse 2B.\",\"quiz\":\"level:A2\",\"qtitle\":\"Nivåtest A2\",\"last\":\"2026-09-24T00:19:53.984Z\"},\"line:Ikke noe problem. Du kan få en av mine b\":{\"n\":1,\"type\":\"truefalse\",\"uk\":\"\",\"en\":\"\",\"line\":\"Ikke noe problem. Du kan få en av mine brødskiver.\",\"quiz\":\"level:A2\",\"qtitle\":\"Nivåtest A2\",\"last\":\"2026-09-24T00:20:14.188Z\"},\"kontant\":{\"n\":1,\"type\":\"emoji\",\"uk\":\"готівкою\",\"en\":\"in cash\",\"line\":\"\",\"quiz\":\"words:butikk\",\"qtitle\":\"🛒 På butikken\",\"last\":\"2026-09-24T10:31:45.010Z\"},\"å bytte\":{\"n\":1,\"type\":\"emoji\",\"uk\":\"обміняти\",\"en\":\"to exchange\",\"line\":\"\",\"quiz\":\"words:butikk\",\"qtitle\":\"🛒 På butikken\",\"last\":\"2026-09-24T10:31:54.296Z\"},\"en pose\":{\"n\":1,\"type\":\"emoji\",\"uk\":\"пакет\",\"en\":\"a bag\",\"line\":\"\",\"quiz\":\"words:butikk\",\"qtitle\":\"🛒 På butikken\",\"last\":\"2026-09-24T10:32:37.680Z\"},\"tall:94\":{\"n\":1,\"type\":\"number\",\"uk\":\"\",\"en\":\"\",\"line\":\"\",\"quiz\":\"numbers\",\"qtitle\":\"Talltest\",\"last\":\"2026-09-24T10:33:12.544Z\"}}', '1790245991');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'filters', '{\"level\":\"B2\",\"cat\":\"all\",\"status\":\"all\"}', '1790245971');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'friendCode', '\"HDDHPH\"', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'friends', '[{\"code\":\"9F2XA8\",\"name\":\"Alina\",\"avatar\":\"🦝|||bowtie\",\"status\":\"friend\",\"best\":true,\"since\":\"2026-09-18T22:16:38.817Z\"},{\"code\":\"WZECR2\",\"name\":\"?\",\"avatar\":\"🙂\",\"status\":\"pending\",\"best\":false,\"since\":\"2026-09-19T18:38:35.653Z\"},{\"code\":\"ABGYTN\",\"name\":\"?\",\"avatar\":\"🙂\",\"status\":\"pending\",\"best\":false,\"since\":\"2026-09-23T17:01:09.519Z\"}]', '1790182870');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'gameCfg', '{\"source\":\"gram:adjective\",\"count\":10,\"time\":30,\"hostPlays\":true,\"sound\":true,\"storyMode\":\"read\"}', '1790174892');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'guestQuizKeys', '[\"numbers\",\"level:A2\",\"grammar:verb-past\",\"words:butikk\",\"p153\",\"p112\",\"grammar:pron-subj\",\"grammar:question-words\",\"words\",\"level:A1\",\"mistakes\",\"alphabet\",\"grammar:conjunctions\",\"p118\",\"p115\",\"p108\",\"p102\",\"clock\",\"grammar:reflexive\",\"grammar:possessive\",\"p90\",\"p120\",\"p121\"]', '1790245974');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathBest', '2209', '1790241530');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathBest_expert', '1894', '1790241530');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathBest_hard', '1997', '1789989826');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathBest_medium', '762', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathBest_tiny', '2209', '1789941091');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathDur', '120', '1790079287');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'mathLevel', '\"expert\"', '1790197074');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'meetMode', '\"auto\"', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'newsSeen', '\"2026-09-25\"', '1790245236');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'numbersVisited', 'true', '1790210743');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'pairs.p111.expert', '{\"moves\":26,\"secs\":67}', '1790194891');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'pairs.p90.kids', '{\"moves\":18,\"secs\":47}', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'pairs.p93.adults', '{\"moves\":24,\"secs\":89}', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'pairs.p95.kids', '{\"moves\":21,\"secs\":63}', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'parentUntil', '1790209570565', '1790207770');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'plan', '{\"from\":\"zero\",\"goal\":\"B2\",\"pace\":\"intense\"}', '1790209626');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'progress', '{\"words:mat\":{\"stars\":2,\"best\":86,\"plays\":1},\"grammar:word-order\":{\"stars\":1,\"best\":40,\"plays\":1},\"words\":{\"stars\":3,\"best\":93,\"plays\":1},\"en:e4\":{\"stars\":1,\"best\":50,\"plays\":1},\"p100\":{\"stars\":2,\"best\":60,\"plays\":1},\"p101\":{\"stars\":2,\"best\":70,\"plays\":1},\"grammar:pron-subj\":{\"stars\":2,\"best\":80,\"plays\":1},\"grammar:question-words\":{\"stars\":2,\"best\":70,\"plays\":1},\"clock\":{\"stars\":2,\"best\":80,\"plays\":2},\"grammar:verb-present\":{\"stars\":2,\"best\":70,\"plays\":1},\"alphabet\":{\"stars\":3,\"best\":100,\"plays\":1},\"numbers\":{\"stars\":3,\"best\":100,\"plays\":1},\"words:familie\":{\"stars\":3,\"best\":90,\"plays\":1},\"p92\":{\"stars\":3,\"best\":90,\"plays\":1},\"words:farger\":{\"stars\":3,\"best\":90,\"plays\":1},\"words:klaer\":{\"stars\":3,\"best\":100,\"plays\":1},\"words:kropp\":{\"stars\":2,\"best\":80,\"plays\":1},\"rocket\":{\"stars\":3,\"best\":94,\"plays\":9},\"p103\":{\"stars\":2,\"best\":70,\"plays\":1},\"p93\":{\"stars\":2,\"best\":80,\"plays\":1},\"words:skole\":{\"stars\":3,\"best\":90,\"plays\":1},\"chess:easy\":{\"stars\":3,\"best\":100,\"plays\":5},\"words:frukt\":{\"stars\":2,\"best\":80,\"plays\":1},\"words:dyr\":{\"stars\":3,\"best\":90,\"plays\":1},\"words:hjem\":{\"stars\":3,\"best\":100,\"plays\":1},\"words:tid\":{\"stars\":3,\"best\":90,\"plays\":1},\"words:vaer\":{\"stars\":3,\"best\":90,\"plays\":1},\"words:verb\":{\"stars\":3,\"best\":100,\"plays\":1},\"grammar:modal\":{\"stars\":3,\"best\":90,\"plays\":3},\"grammar:nouns\":{\"stars\":2,\"best\":80,\"plays\":2},\"p91\":{\"stars\":3,\"best\":100,\"plays\":1},\"p90\":{\"stars\":2,\"best\":80,\"plays\":1},\"p94\":{\"stars\":1,\"best\":30,\"plays\":1},\"p07\":{\"stars\":1,\"best\":50,\"plays\":1},\"p96\":{\"stars\":2,\"best\":70,\"plays\":3},\"p97\":{\"stars\":1,\"best\":40,\"plays\":1},\"math:mul\":{\"stars\":3,\"best\":100,\"plays\":1},\"p104\":{\"stars\":2,\"best\":60,\"plays\":1},\"grammar\":{\"stars\":3,\"best\":90,\"plays\":6},\"race:easy\":{\"stars\":3,\"best\":100,\"plays\":4},\"p95\":{\"stars\":2,\"best\":60,\"plays\":1},\"p109\":{\"stars\":2,\"best\":70,\"plays\":1},\"p111\":{\"stars\":3,\"best\":90,\"plays\":2},\"p112\":{\"stars\":1,\"best\":50,\"plays\":1},\"math:add\":{\"stars\":3,\"best\":100,\"plays\":1},\"p113\":{\"stars\":2,\"best\":60,\"plays\":1},\"race:medium\":{\"stars\":1,\"best\":50,\"plays\":2},\"level:A1\":{\"stars\":2,\"best\":80,\"plays\":1},\"words:folelser\":{\"stars\":2,\"best\":80,\"plays\":2},\"p110\":{\"stars\":2,\"best\":80,\"plays\":1},\"grammar:perfect\":{\"stars\":1,\"best\":40,\"plays\":2},\"p114\":{\"stars\":2,\"best\":70,\"plays\":1},\"p102\":{\"stars\":2,\"best\":89,\"plays\":1},\"p108\":{\"stars\":2,\"best\":70,\"plays\":1},\"p115\":{\"stars\":2,\"best\":80,\"plays\":1},\"p118\":{\"stars\":2,\"best\":60,\"plays\":1},\"grammar:conjunctions\":{\"stars\":3,\"best\":91,\"plays\":1},\"mistakes\":{\"stars\":1,\"best\":50,\"plays\":1}}', '1790241530');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'quizlog', '[{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":38,\"total\":43,\"stars\":2,\"date\":\"2026-09-24T09:18:49.536Z\"},{\"key\":\"chess:easy\",\"title\":\"♟ Sjakk проти Adam\",\"score\":2,\"total\":2,\"stars\":3,\"date\":\"2026-09-23T22:16:05.754Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":36,\"total\":41,\"stars\":2,\"date\":\"2026-09-23T20:59:42.747Z\"},{\"key\":\"mistakes\",\"title\":\"📊 Мої помилки\",\"score\":2,\"total\":4,\"stars\":1,\"date\":\"2026-09-23T20:03:56.965Z\"},{\"key\":\"grammar:conjunctions\",\"title\":\"Konjunksjoner og subjunksjoner\",\"score\":10,\"total\":11,\"stars\":3,\"date\":\"2026-09-23T17:50:56.433Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":18,\"total\":30,\"stars\":2,\"date\":\"2026-09-23T17:47:04.091Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":28,\"total\":36,\"stars\":2,\"date\":\"2026-09-23T17:42:23.573Z\"},{\"key\":\"p118\",\"title\":\"Den raske bilen\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-23T17:38:28.285Z\"},{\"key\":\"p115\",\"title\":\"Hytteturen\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-23T17:27:01.872Z\"},{\"key\":\"p108\",\"title\":\"Friluftsliv og allemannsretten\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-23T17:14:24.721Z\"},{\"key\":\"p102\",\"title\":\"Jobbintervjuet\",\"score\":8,\"total\":9,\"stars\":2,\"date\":\"2026-09-23T17:10:18.427Z\"},{\"key\":\"p114\",\"title\":\"Lunsj på jobben\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T22:32:59.726Z\"},{\"key\":\"grammar:modal\",\"title\":\"Modalverb + infinitiv — Модальні дієслова\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-22T22:23:47.852Z\"},{\"key\":\"grammar:modal\",\"title\":\"Modalverb + infinitiv — Модальні дієслова\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T22:22:57.010Z\"},{\"key\":\"grammar:perfect\",\"title\":\"Perfektum — Перфект (har + дієприкметник)\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-22T22:21:39.191Z\"},{\"key\":\"grammar:perfect\",\"title\":\"Perfektum — Перфект (har + дієприкметник)\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-22T22:20:56.602Z\"},{\"key\":\"clock\",\"title\":\"Hva er klokka?\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T22:19:33.357Z\"},{\"key\":\"p110\",\"title\":\"Hva gjorde du i helga?\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T22:16:46.567Z\"},{\"key\":\"race:medium\",\"title\":\"🏁 Логік-гонка · 🟡 Середньо\",\"score\":5,\"total\":10,\"stars\":1,\"date\":\"2026-09-22T21:18:35.008Z\",\"place\":4,\"of\":4},{\"key\":\"words:folelser\",\"title\":\"😊 Følelser\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T21:17:04.621Z\"},{\"key\":\"words:folelser\",\"title\":\"😊 Følelser\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T21:16:05.181Z\"},{\"key\":\"level:A1\",\"title\":\"Nivåtest A1\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T21:12:14.948Z\"},{\"key\":\"race:medium\",\"title\":\"🏁 Logikkløpet · 🟡 Middels\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-22T20:59:57.291Z\",\"place\":4,\"of\":4},{\"key\":\"p113\",\"title\":\"For et vær!\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T20:58:34.953Z\"},{\"key\":\"math:add\",\"title\":\"🧮 add\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-22T12:17:19.977Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":42,\"total\":46,\"stars\":3,\"date\":\"2026-09-22T12:16:35.923Z\"},{\"key\":\"chess:easy\",\"title\":\"♟ Sjakk mot Emma\",\"score\":1,\"total\":2,\"stars\":1,\"date\":\"2026-09-22T12:08:07.213Z\"},{\"key\":\"p112\",\"title\":\"På posten\",\"score\":5,\"total\":10,\"stars\":1,\"date\":\"2026-09-22T11:38:33.974Z\"},{\"key\":\"p96\",\"title\":\"Hvor er Pus?\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T11:35:53.848Z\"},{\"key\":\"p96\",\"title\":\"Hvor er Pus?\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-22T11:34:27.907Z\"},{\"key\":\"race:easy\",\"title\":\"🏁 Logic Race · 🟢 Easy\",\"score\":0,\"total\":10,\"stars\":0,\"date\":\"2026-09-22T08:40:52.776Z\",\"place\":4,\"of\":4},{\"key\":\"race:easy\",\"title\":\"🏁 Логік-гонка · 🟢 Легко\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-22T08:19:38.867Z\",\"place\":2,\"of\":4},{\"key\":\"race:easy\",\"title\":\"🏁 Logikkløpet · 🟢 Lett\",\"score\":0,\"total\":10,\"stars\":0,\"date\":\"2026-09-22T07:37:46.437Z\",\"place\":4,\"of\":4},{\"key\":\"p111\",\"title\":\"Første dag på norskkurs\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-21T19:45:57.247Z\"},{\"key\":\"p111\",\"title\":\"Første dag på norskkurs\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-21T19:44:11.180Z\"},{\"key\":\"p109\",\"title\":\"Familien min\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-21T19:39:24.510Z\"},{\"key\":\"p95\",\"title\":\"Bursdagen til Nora\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-21T17:49:08.817Z\"},{\"key\":\"race:easy\",\"title\":\"🏁 Logikkløpet · 🟢 Lett\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-21T11:25:36.560Z\",\"place\":3,\"of\":4},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":42,\"total\":47,\"stars\":2,\"date\":\"2026-09-21T11:23:43.550Z\"},{\"key\":\"grammar\",\"title\":\"Grammatikk\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-20T22:28:53.810Z\"},{\"key\":\"grammar\",\"title\":\"Grammatikk\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-20T22:27:45.778Z\"},{\"key\":\"grammar\",\"title\":\"Grammatikk\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-20T22:26:31.637Z\"},{\"key\":\"grammar\",\"title\":\"Grammatikk\",\"score\":3,\"total\":10,\"stars\":1,\"date\":\"2026-09-20T22:22:27.290Z\"},{\"key\":\"grammar\",\"title\":\"Grammatikk\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-20T22:20:24.451Z\"},{\"key\":\"grammar\",\"title\":\"Grammatikk\",\"score\":5,\"total\":10,\"stars\":1,\"date\":\"2026-09-20T22:18:29.763Z\"},{\"key\":\"grammar:nouns\",\"title\":\"Substantiv: en, ei, et — Іменники: en, ei, et\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-20T22:15:00.786Z\"},{\"key\":\"p104\",\"title\":\"Hva er klokka?\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-20T22:08:46.230Z\"},{\"key\":\"math:mul\",\"title\":\"🧮 mul\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-20T22:03:42.973Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":45,\"total\":48,\"stars\":3,\"date\":\"2026-09-20T21:51:28.816Z\"},{\"key\":\"p97\",\"title\":\"Hyggelig å hilse på deg!\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-20T21:38:39.173Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":20,\"total\":37,\"stars\":1,\"date\":\"2026-09-20T07:57:42.433Z\"},{\"key\":\"chess:easy\",\"title\":\"♟ Sjakk проти Ingrid\",\"score\":2,\"total\":2,\"stars\":3,\"date\":\"2026-09-20T07:49:52.053Z\"},{\"key\":\"chess:easy\",\"title\":\"♟ Sjakk проти Emma\",\"score\":2,\"total\":2,\"stars\":3,\"date\":\"2026-09-19T20:08:59.403Z\"},{\"key\":\"p94\",\"title\":\"Snømannen\",\"score\":3,\"total\":10,\"stars\":1,\"date\":\"2026-09-19T19:24:55.266Z\"},{\"key\":\"p90\",\"title\":\"Mia og den magiske kaken\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-19T19:07:04.121Z\"},{\"key\":\"p91\",\"title\":\"Første dag på skolen\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T19:05:42.509Z\"},{\"key\":\"grammar:nouns\",\"title\":\"Substantiv: en, ei, et — Nouns: en, ei, et\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-19T18:57:34.954Z\"},{\"key\":\"grammar:modal\",\"title\":\"Modalverb + infinitiv — Modal verbs\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-19T18:56:11.075Z\"},{\"key\":\"words:verb\",\"title\":\"🏃 Hverdagsverb\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T18:54:41.281Z\"},{\"key\":\"words:vaer\",\"title\":\"🌦️ Været og årstider\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T18:53:49.952Z\"},{\"key\":\"words:tid\",\"title\":\"📅 Dager og måneder\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T18:53:13.490Z\"},{\"key\":\"words:hjem\",\"title\":\"🏠 Hjemme\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T18:52:11.577Z\"},{\"key\":\"words:dyr\",\"title\":\"🐾 Dyr\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T18:51:29.494Z\"},{\"key\":\"words:frukt\",\"title\":\"🍎 Frukt og grønnsaker\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-19T18:50:45.720Z\"},{\"key\":\"chess:easy\",\"title\":\"♟ Sjakk vs Emma\",\"score\":0,\"total\":2,\"stars\":0,\"date\":\"2026-09-19T18:05:24.933Z\"},{\"key\":\"words:skole\",\"title\":\"🏫 Skolen\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T15:49:50.427Z\"},{\"key\":\"p93\",\"title\":\"På butikken\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-19T15:41:21.680Z\"},{\"key\":\"p103\",\"title\":\"Frokost med familien\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-19T14:44:16.726Z\"},{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":17,\"total\":18,\"stars\":3,\"date\":\"2026-09-19T12:08:04.846Z\"},{\"key\":\"words:kropp\",\"title\":\"🧍 Kroppen\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T19:29:38.772Z\"},{\"key\":\"words:klaer\",\"title\":\"👕 Klær\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-18T19:16:30.196Z\"},{\"key\":\"words:farger\",\"title\":\"🎨 Farger\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-18T19:14:57.084Z\"},{\"key\":\"p92\",\"title\":\"Tur i skogen\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-18T15:49:52.713Z\"},{\"key\":\"words:familie\",\"title\":\"👨‍👩‍👧 Familien\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-18T15:44:17.182Z\"},{\"key\":\"numbers\",\"title\":\"Talltest\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-18T15:42:04.235Z\"},{\"key\":\"alphabet\",\"title\":\"Alfabettest\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-18T15:41:11.706Z\"},{\"key\":\"grammar:verb-present\",\"title\":\"Verb i presens — Дієслова: теперішній час\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T15:38:52.511Z\"},{\"key\":\"clock\",\"title\":\"Hva er klokka?\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T15:36:59.508Z\"},{\"key\":\"grammar:question-words\",\"title\":\"Spørreord — Питальні слова\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T15:33:09.670Z\"},{\"key\":\"grammar:pron-subj\",\"title\":\"Personlige pronomen — Особові займенники\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T15:30:21.123Z\"},{\"key\":\"p101\",\"title\":\"Dugnad i borettslaget\",\"score\":7,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T15:25:24.923Z\"},{\"key\":\"p100\",\"title\":\"Leiligheten\",\"score\":6,\"total\":10,\"stars\":2,\"date\":\"2026-09-18T12:14:01.073Z\"},{\"key\":\"en:e4\",\"title\":\"🇬🇧 My Birthday Party\",\"score\":5,\"total\":10,\"stars\":1,\"date\":\"2026-09-18T12:09:05.552Z\"},{\"key\":\"words\",\"title\":\"Ord\",\"score\":13,\"total\":14,\"stars\":3,\"date\":\"2026-09-18T11:33:06.442Z\"},{\"key\":\"grammar:word-order\",\"title\":\"Ordstilling (V2) — Порядок слів (V2)\",\"score\":4,\"total\":10,\"stars\":1,\"date\":\"2026-09-18T11:24:48.929Z\"},{\"key\":\"words:mat\",\"title\":\"🍽️ Mat og drikke\",\"score\":12,\"total\":14,\"stars\":2,\"date\":\"2026-09-18T10:48:32.409Z\"},{\"key\":\"p90\",\"title\":\"Mia og den magiske kaken\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-17T17:47:29.271Z\"}]', '1790241530');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'raceDur', '60', '1790064525');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'raceLevel', '\"medium\"', '1790201464');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'recordedGames', '[\"rocket-NJVAX-0\"]', '1790185441');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p07', '[0,1]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p08', '[0,1,2,3,4,5,6,7]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p100', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p101', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p102', '[0,1,2,3,4,5,6]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p103', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p104', '[0,1,2,3,4,5]', '1789942052');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p107', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p108', '[0,1,2,3,4,5]', '1790183596');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p109', '[0,1,2,3,4,5,6,7]', '1790015433');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p110', '[0,1,2,3,4,5,6,7]', '1790115315');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p111', '[0,1,2,3,4,5,6,7,8,9,10,11]', '1790019707');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p112', '[0,1,2,3,4,5,6,7,8,9,10,11]', '1790077055');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p113', '[0,1,11,2,3,4,5,6,7,8,9,10]', '1790110594');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p114', '[0,1,2,3,4,5,6,7,8,9,10,11]', '1790116304');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p115', '[0,1,2,3,4,5,6,7,8,9,10,11]', '1790184365');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p116', '[0,1,2,3,4,5]', '1790205561');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p118', '[0,1,2,3,4,5,6,7,8,9,10,11]', '1790184965');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p120', '[0]', '1790173663');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p121', '[0]', '1790172373');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p123', '[0,1,2,3,4,5]', '1790192645');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p124', '[0]', '1790194511');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p125', '[0,1,2]', '1790206968');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p153', '[0,1,2,3,4,5]', '1790206763');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p90', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p91', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p92', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p93', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p94', '[0,1,2,3,4,5]', '1789845778');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p95', '[0,4,1,2,3,5]', '1789848208');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p96', '[0,1,2,3,4,5]', '1789848208');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p97', '[0,1,2,3,4,5]', '1789940228');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'seen.p98', '[0,1,2,3,4,5]', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'settings', '{\"level\":\"expert\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4}', '1790245864');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'shareProfile', 'true', '1789852254');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'stats', '{\"cardsReviewed\":30,\"alphaVisits\":36,\"pairs\":4,\"quizzes\":86,\"games\":11,\"perfect\":28,\"speak3\":11,\"rocket\":9,\"chessWins\":3,\"calls\":12}', '1790245356');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'unlockedItems', '[\"color:rainbow\",\"glasses:mask\",\"hat:halo\",\"hat:pirate\",\"glasses:patch\",\"hat:witch\",\"glasses:pixel\"]', '1790201767');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'usageSec', '270', '1790172098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'wallAuthorKey', '\"c67625e305fc1d3a85acb195a1aab303\"', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'wallMine', '[\"HDDHPH:cd5ef1ae54b6\",\"HDDHPH:4f90bb5ec58d\",\"WZECR2:46899568015b\",\"WZECR2:09b886131001\",\"ABGYTN:97ea44ce2b1f\",\"HDDHPH:5a8298979e67\"]', '1790182099');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'wallSecret', '\"3ce314cd90ac403f0493988d2c8f46f7\"', '1789843098');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'wallWaitUntil', '1790182127662', '1790182099');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('1', 'wordsKnown', '[\"helse|feber\",\"helse|en medisin\",\"helse|en resept\",\"helse|en tannlege\",\"helse|et plaster\",\"natur|en skog\",\"natur|en blomst\",\"familie|en far\",\"familie|en bror\",\"familie|ei søster\",\"familie|ei datter\",\"familie|en bestemor\",\"familie|en mann\",\"familie|ei kone\",\"familie|et barn\",\"farger|rød\",\"farger|blå\",\"farger|gul\",\"farger|grønn\",\"farger|svart\",\"farger|hvit\",\"farger|oransje\",\"farger|rosa\",\"klaer|ei jakke\",\"klaer|en genser\",\"klaer|ei bukse\",\"klaer|en sko\",\"klaer|en sokk\",\"klaer|ei lue\",\"klaer|en sekk\",\"kropp|et hode\",\"kropp|et hår\",\"kropp|et øye\",\"kropp|et øre\",\"kropp|en nese\",\"kropp|en tann\",\"kropp|et kne\",\"mat|et brød\",\"mat|en ost\",\"mat|ei pølse\",\"mat|et egg\",\"mat|en fisk\",\"mat|et kjøtt\",\"mat|en pizza\",\"mat|en suppe\",\"mat|ei kake\",\"mat|en ris\",\"mat|en is\",\"mat|en melk\",\"mat|en kaffe\",\"mat|en te\",\"mat|en juice\",\"mat|et vann\",\"mat|en sjokolade\",\"mat|en vaffel\",\"frukt|et eple\",\"frukt|en banan\",\"frukt|en appelsin\",\"frukt|en ananas\",\"frukt|en potet\",\"frukt|en tomat\",\"frukt|en agurk\",\"frukt|en paprika\",\"frukt|en brokkoli\",\"dyr|en hund\",\"dyr|en katt\",\"dyr|ei ku\",\"dyr|en gris\",\"dyr|en sau\",\"dyr|en fugl\",\"dyr|en mus\",\"dyr|en fisk\",\"dyr|en slange\",\"hjem|et hus\",\"hjem|et rom\",\"hjem|et kjøkken\",\"hjem|et soverom\",\"hjem|et bad\",\"hjem|et vindu\",\"hjem|en dør\",\"hjem|en stol\",\"hjem|et bord\",\"hjem|en seng\",\"hjem|en sofa\",\"hjem|en lampe\",\"hjem|et kjøleskap\",\"hjem|en komfyr\",\"hjem|en dusj\",\"hjem|et toalett\",\"hjem|en nøkkel\",\"skole|en lærer\",\"skole|et klasserom\",\"skole|ei tavle\",\"skole|ei bok\",\"skole|en blyant\",\"skole|en penn\",\"skole|et viskelær\",\"skole|ei saks\",\"skole|en sekk\",\"skole|norsk\",\"skole|en datamaskin\",\"tid|mandag\",\"tid|tirsdag\",\"tid|onsdag\",\"tid|lørdag\",\"tid|søndag\",\"tid|januar\",\"tid|februar\",\"tid|mars\",\"tid|april\",\"tid|mai\",\"tid|juni\",\"tid|juli\",\"tid|august\",\"tid|september\",\"tid|oktober\",\"tid|november\",\"tid|desember\",\"tid|i dag\",\"tid|i går\",\"tid|i morgen\",\"tid|ei uke\",\"tid|et år\",\"vaer|sol\",\"vaer|regn\",\"vaer|snø\",\"vaer|kald\",\"vaer|varm\",\"vaer|sommer\",\"vaer|nordlys\",\"byen|en buss\",\"byen|et tog\",\"byen|en bil\",\"byen|en sykkel\",\"byen|en båt\",\"byen|en gate\",\"byen|en butikk\",\"byen|et sykehus\",\"byen|et apotek\",\"byen|en bank\",\"byen|en park\",\"byen|en kafé\",\"byen|et bibliotek\",\"byen|en billett\",\"byen|en stasjon\",\"yrker|en lege\",\"yrker|en lærer\",\"yrker|en kokk\",\"yrker|en politi\",\"yrker|en brannmann\",\"yrker|en snekker\",\"yrker|en elektriker\",\"yrker|en frisør\",\"yrker|en sjåfør\",\"yrker|en pilot\",\"yrker|en advokat\",\"yrker|en tannlege\",\"yrker|en kasserer\",\"yrker|en rørlegger\",\"yrker|en programmerer\",\"yrker|en journalist\",\"natur|et fjell\",\"natur|en strand\",\"natur|en hytte\",\"natur|ei elv\",\"fritid|fotball\",\"fritid|ski\",\"fritid|håndball\",\"fritid|dans\",\"fritid|løping\",\"fritid|musikk\",\"fritid|en gitar\",\"fritid|en film\",\"fritid|et spill\",\"fritid|fisking\",\"fritid|lesing\",\"helse|vondt\",\"helse|en allergi\",\"verb|å spise\",\"verb|å drikke\",\"verb|å sove\",\"verb|å gå\",\"verb|å løpe\",\"verb|å lese\",\"verb|å skrive\",\"verb|å snakke\",\"verb|å høre\",\"verb|å se\",\"verb|å kjøpe\",\"verb|å lage mat\",\"verb|å vaske\",\"verb|å jobbe\",\"verb|å danse\",\"verb|å kjøre\",\"verb|å ringe\",\"verb|å hjelpe\",\"verb|å lære\",\"hverdagsfraser|god morgen\",\"hverdagsfraser|tusen takk\",\"hverdagsfraser|vær så god\",\"hverdagsfraser|hvordan går det?\",\"hverdagsfraser|vi ses\",\"hverdagsfraser|ha det bra\",\"hverdagsfraser|hva heter du?\",\"hverdagsfraser|hvor kommer du fra?\",\"hverdagsfraser|jeg bor i …\",\"hverdagsfraser|god helg\",\"miljo|ei natur\",\"friluft|en ryggsekk\",\"friluft|en sopp\",\"friluft|ei ski\",\"friluft|et vann\",\"friluft|å gå tur\",\"kultur2|ei grunnlov\",\"kultur2|et tog\",\"kultur2|en bunad\",\"kultur2|ei påske\",\"kultur2|ei dialekt\",\"kultur2|bokmål\",\"samtale|til slutt\",\"samtale|det går bra\",\"samtale|unnskyld\",\"samtale|jeg forstår ikke\",\"samtale|kan du gjenta?\",\"samtale|kanskje\",\"folk|ei brille\",\"teknologi|ei datamaskin\",\"teknologi|en mobil\",\"teknologi|ei nettside\",\"teknologi|ei e-post\",\"teknologi|en bruker\",\"reise|et kart\",\"reise|en buss\",\"reise|en billett\",\"reise|et tog\",\"reise|et fly\",\"offentlig|ei kommune\",\"offentlig|et kontor\",\"offentlig|en fastlege\",\"offentlig|ei legevakt\",\"offentlig|et sykehus\",\"penger|en bank\",\"penger|en konto\",\"penger|et bankkort\",\"penger|ei faktura\",\"penger|ei betaling\",\"penger|skatt\",\"penger|et skattekort\",\"penger|ei krone\",\"bolig2|et hus\",\"bolig2|ei nøkkel\",\"bolig2|et gulv\",\"bolig2|et tak\",\"bolig2|ei vaskemaskin\",\"bolig2|strøm\",\"bolig2|ei trapp\",\"bolig2|et depositum\",\"jobb2|en kontrakt\",\"jobb2|en sjef\",\"jobb2|en kollega\",\"jobb2|en arbeidsgiver\",\"jobb2|ei arbeidstid\",\"jobb2|ei pause\",\"jobb2|et møte\",\"jobb2|en oppgave\",\"jobb2|en CV\",\"jobb2|et intervju\",\"kjokken|en kopp\",\"kjokken|et glass\",\"kjokken|en kniv\",\"butikk|en butikk\",\"butikk|et kort\",\"butikk|en pose\",\"verb|å lukke\"]', '1790194680');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'alphaVisited', 'true', '1789906110');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'days', '[\"2026-09-20\"]', '1789906026');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'dirListed', 'true', '1789906508');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'en.seen.e2', '[0,1]', '1789906271');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'filters', '{\"level\":\"all\",\"cat\":\"all\",\"status\":\"all\"}', '1789906425');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'friendCode', '\"WZECR2\"', '1789843019');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'friends', '[{\"code\":\"HDDHPH\",\"name\":\"BILOHASH\",\"avatar\":\"🦁|beanie|sun|stripes|pink\",\"status\":\"incoming\",\"best\":false,\"since\":\"2026-09-19T18:38:35.839Z\"}]', '1789843139');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'gameCfg', '{\"source\":\"mix\",\"count\":10,\"time\":20,\"hostPlays\":true,\"sound\":true,\"storyMode\":\"read\"}', '1789854610');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'mathBest', '1164', '1789906233');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'mathBest_medium', '1164', '1789906233');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'mathLevel', '\"medium\"', '1789906164');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'plan', '{\"from\":\"A1\",\"goal\":\"A2\",\"pace\":\"normal\"}', '1789906006');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'progress', '{\"alphabet\":{\"stars\":3,\"best\":100,\"plays\":1},\"rocket\":{\"stars\":3,\"best\":100,\"plays\":1}}', '1789906233');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'quizlog', '[{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":22,\"total\":22,\"stars\":3,\"date\":\"2026-09-20T12:10:24.010Z\"},{\"key\":\"alphabet\",\"title\":\"Alfabettest\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-20T12:08:15.408Z\"}]', '1789906233');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'seen.p90', '[0,1]', '1789906508');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4}', '1789906415');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'shareProfile', 'true', '1789854554');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'stats', '{\"alphaVisits\":2,\"quizzes\":2,\"perfect\":2,\"rocket\":1,\"speak3\":3}', '1789906519');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('2', 'wallSecret', '\"a96d138ecfffaea8ad37839062175cea\"', '1789843089');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'alphaVisited', 'true', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'cards', '{\"hvitt\":{\"box\":1,\"due\":1789657354040},\"kaldt\":{\"box\":1,\"due\":1789657356158},\"varm dere\":{\"box\":1,\"due\":1789657367482},\"lukter\":{\"box\":1,\"due\":1789660415956},\"lørdag\":{\"box\":1,\"due\":1789660418307},\"sukker\":{\"box\":1,\"due\":1789660422990},\"mel\":{\"box\":1,\"due\":1789660426224},\"bake\":{\"box\":1,\"due\":1789660430680},\"morgen\":{\"box\":1,\"due\":1789660432704},\"tusen takk\":{\"box\":1,\"due\":1789660435502},\"smøret\":{\"box\":1,\"due\":1789660441579},\"skatter\":{\"box\":1,\"due\":1789660445059},\"hjelpe\":{\"box\":1,\"due\":1789660447449},\"ferdig\":{\"box\":1,\"due\":1789660450512},\"egg\":{\"box\":1,\"due\":1789660452710},\"kake\":{\"box\":1,\"due\":1789660455365},\"spis\":{\"box\":1,\"due\":1789660457924},\"beste\":{\"box\":1,\"due\":1789660461015},\"godt\":{\"box\":1,\"due\":1789660463221},\"kjøkkenet\":{\"box\":1,\"due\":1789660466663},\"skjev\":{\"box\":1,\"due\":1789660472202},\"trenger\":{\"box\":1,\"due\":1789660477105},\"ikke\":{\"box\":1,\"due\":1789660479469}}', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'days', '[\"2026-09-17\",\"2026-09-19\",\"2026-09-23\"]', '1790194065');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'demoQuizKeys', '[\"p121\"]', '1790171847');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'dirListed', 'true', '1790194338');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'filters', '{\"level\":\"all\",\"cat\":\"all\",\"status\":\"all\"}', '1790194015');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'friendCode', '\"KAJA2N\"', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'friends', '[{\"code\":\"J9UQWG\",\"name\":\"Liv\",\"avatar\":\"🦊\",\"status\":\"incoming\",\"best\":false,\"since\":\"2026-09-23T13:54:19.103Z\"}]', '1790171659');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'gameCfg', '{\"source\":\"cat:mat\",\"count\":10,\"time\":20,\"hostPlays\":false,\"sound\":true}', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'guestQuizKeys', '[\"p121\"]', '1790171847');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'mathLevel', '\"expert\"', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'newsSeen', '\"2026-09-25\"', '1790194009');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'progress', '{\"p07\":{\"stars\":1,\"best\":50,\"plays\":1},\"p96\":{\"stars\":2,\"best\":70,\"plays\":1},\"p90\":{\"stars\":2,\"best\":80,\"plays\":1},\"math:div\":{\"stars\":3,\"best\":100,\"plays\":2}}', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'quizlog', '[{\"key\":\"math:div\",\"title\":\"🧮 div\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T21:30:43.985Z\"},{\"key\":\"math:div\",\"title\":\"🧮 div\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T21:29:13.407Z\"},{\"key\":\"p90\",\"title\":\"Mia og den magiske kaken\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-17T17:47:29.271Z\"}]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'raceLevel', '\"easy\"', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p07', '[0,1]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p08', '[0,1,2,3,4,5,6,7]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p120', '[0,1,2,3]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p121', '[0,1,2,3,4,5,6,7]', '1790171843');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p90', '[0,1,2,3,4,5]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p91', '[0,1,2,3,4,5]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p92', '[0]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p93', '[0,1,2,3,4,5]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p94', '[0]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p95', '[0,1,2,3,4,5]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'seen.p96', '[0,1,2,3,4,5]', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4,\"tr\":\"en\",\"dir\":\"uk\",\"showTr\":true}', '1790171652');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'stats', '{\"quizzes\":4,\"cardsReviewed\":20,\"games\":1,\"alphaVisits\":1,\"perfect\":2,\"calls\":1}', '1790194065');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'usageSec', '300', '1790194224');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('3', 'wallSecret', '\"48d535cb954972af2cda7f5b9435e77e\"', '1790193981');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('4', 'friendCode', '\"ESPEN7\"', '1790098319');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('4', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4}', '1790098319');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('4', 'usageSec', '15', '1790098329');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('5', 'dirListed', 'true', '1789854985');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('5', 'friendCode', '\"V376PP\"', '1789854970');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('5', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4}', '1789854969');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('5', 'shareProfile', 'true', '1789854985');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('5', 'usageSec', '45', '1789855007');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('5', 'wallSecret', '\"77fb8151fd3549244bc6caccdcdf80a0\"', '1789854985');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'alphaVisited', 'true', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'cards', '{\"hvitt\":{\"box\":1,\"due\":1789657354040},\"kaldt\":{\"box\":1,\"due\":1789657356158},\"varm dere\":{\"box\":1,\"due\":1789657367482},\"lukter\":{\"box\":1,\"due\":1789660415956},\"lørdag\":{\"box\":1,\"due\":1789660418307},\"sukker\":{\"box\":1,\"due\":1789660422990},\"mel\":{\"box\":1,\"due\":1789660426224},\"bake\":{\"box\":1,\"due\":1789660430680},\"morgen\":{\"box\":1,\"due\":1789660432704},\"tusen takk\":{\"box\":1,\"due\":1789660435502},\"smøret\":{\"box\":1,\"due\":1789660441579},\"skatter\":{\"box\":1,\"due\":1789660445059},\"hjelpe\":{\"box\":1,\"due\":1789660447449},\"ferdig\":{\"box\":1,\"due\":1789660450512},\"egg\":{\"box\":1,\"due\":1789660452710},\"kake\":{\"box\":1,\"due\":1789660455365},\"spis\":{\"box\":1,\"due\":1789660457924},\"beste\":{\"box\":1,\"due\":1789660461015},\"godt\":{\"box\":1,\"due\":1789660463221},\"kjøkkenet\":{\"box\":1,\"due\":1789660466663},\"skjev\":{\"box\":1,\"due\":1789660472202},\"trenger\":{\"box\":1,\"due\":1789660477105},\"ikke\":{\"box\":1,\"due\":1789660479469}}', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'days', '[\"2026-09-17\",\"2026-09-19\"]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'dirListed', 'false', '1790068336');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'filters', '{\"level\":\"all\",\"cat\":\"all\",\"status\":\"all\"}', '1790068377');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'friendCode', '\"HANA2K\"', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'friends', '[{\"code\":\"WZECR2\",\"name\":\"?\",\"avatar\":\"🙂\",\"status\":\"pending\",\"best\":false,\"since\":\"2026-09-21T18:24:00.471Z\"}]', '1790015042');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'gameCfg', '{\"source\":\"cat:mat\",\"count\":10,\"time\":20,\"hostPlays\":true,\"sound\":true,\"storyMode\":\"read\"}', '1790068364');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'mathLevel', '\"expert\"', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'progress', '{\"p07\":{\"stars\":1,\"best\":50,\"plays\":1},\"p96\":{\"stars\":2,\"best\":70,\"plays\":1},\"p90\":{\"stars\":2,\"best\":80,\"plays\":1},\"math:div\":{\"stars\":3,\"best\":100,\"plays\":2}}', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'quizlog', '[{\"key\":\"math:div\",\"title\":\"🧮 div\",\"score\":9,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T21:30:43.985Z\"},{\"key\":\"math:div\",\"title\":\"🧮 div\",\"score\":10,\"total\":10,\"stars\":3,\"date\":\"2026-09-19T21:29:13.407Z\"},{\"key\":\"p90\",\"title\":\"Mia og den magiske kaken\",\"score\":8,\"total\":10,\"stars\":2,\"date\":\"2026-09-17T17:47:29.271Z\"}]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'raceLevel', '\"easy\"', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p07', '[0,1]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p08', '[0,1,2,3,4,5,6,7]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p90', '[0,1,2,3,4,5]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p91', '[0,1,2,3,4,5]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p92', '[0]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p93', '[0,1,2,3,4,5]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p94', '[0]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p95', '[0,1,2,3,4,5]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'seen.p96', '[0,1,2,3,4,5]', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4,\"tr\":\"en\",\"dir\":\"uk\",\"showTr\":true}', '1790068336');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'stats', '{\"quizzes\":4,\"cardsReviewed\":20,\"games\":1,\"alphaVisits\":1,\"perfect\":2}', '1790014803');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'usageSec', '255', '1790068371');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'wallAuthorKey', '\"a7a0e48f776b83104d82c3b714990b82\"', '1790015059');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'wallMine', '[\"WZECR2:5ffc09e905b1\"]', '1790015067');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'wallSecret', '\"23e41744e2693d21922c043002e1404b\"', '1790068336');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('7', 'wallWaitUntil', '1790015095635', '1790015067');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'alphaVisited', 'true', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'avatar', '\"🐼\"', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'callOfferAt', '1790191322969', '1790191325');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'chessTime', '15', '1790211963');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'days', '[\"2026-09-22\",\"2026-09-23\"]', '1790191359');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'demoQuizKeys', '[\"grammar:pron-subj\"]', '1790212120');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'dirListed', 'false', '1790200391');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'filters', '{\"level\":\"all\",\"cat\":\"all\",\"status\":\"all\"}', '1790212244');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'friendCode', '\"NUR2KA\"', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'gameCfg', '{\"source\":\"mix\",\"count\":10,\"time\":20,\"hostPlays\":false,\"sound\":true,\"storyMode\":\"read\"}', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'guestQuizKeys', '[\"grammar:pron-subj\"]', '1790212120');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'newsSeen', '\"2026-09-24\"', '1790210989');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'progress', '{\"rocket\":{\"stars\":2,\"best\":77,\"plays\":1}}', '1790197414');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'quizlog', '[{\"key\":\"rocket\",\"title\":\"🚀 Math Rocket\",\"score\":30,\"total\":39,\"stars\":2,\"date\":\"2026-09-23T21:03:31.877Z\",\"place\":1,\"of\":2}]', '1790197414');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'recordedGames', '[\"rocket-TTN3D-1145.504\"]', '1790197414');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'seen.p112', '[0,1,2]', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'seen.p90', '[0,1,2,3,4,5]', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4}', '1790185488');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'stats', '{\"alphaVisits\":1,\"calls\":1,\"quizzes\":1,\"games\":1}', '1790197414');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'usageSec', '1140', '1790212262');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('9', 'wallSecret', '\"f61f4bc1c62799356c370dd9ca4dcecd\"', '1790197232');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('10', 'filters', '{\"level\":\"all\",\"cat\":\"all\",\"status\":\"all\"}', '1790208863');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('10', 'friendCode', '\"ULAV2N\"', '1790098338');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('10', 'newsSeen', '\"2026-09-24\"', '1790173060');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('10', 'seen.p90', '[0]', '1790173090');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('10', 'settings', '{\"level\":\"kids\",\"levelFilter\":\"all\",\"rate\":1,\"voices\":[],\"voiceMode\":\"cheerful\",\"cheerPitch\":1.35,\"audio\":true,\"v\":4}', '1790098338');
INSERT INTO `kl_user_data` (`user_id`, `k`, `v`, `updated_at`) VALUES ('10', 'usageSec', '195', '1790208863');

-- ---------- kl_users ----------
DROP TABLE IF EXISTS `kl_users`;
CREATE TABLE `kl_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(190) NOT NULL,
  `name` varchar(40) NOT NULL,
  `pass_hash` varchar(255) NOT NULL,
  `lang` varchar(5) NOT NULL DEFAULT 'en',
  `friend_code` char(6) NOT NULL,
  `share_profile` tinyint(4) NOT NULL DEFAULT 0,
  `verified_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `last_login` int(11) DEFAULT NULL,
  `consent_at` int(11) NOT NULL,
  `is_admin` tinyint(4) NOT NULL DEFAULT 0,
  `blocked_at` int(11) DEFAULT NULL,
  `is_moderator` tinyint(4) NOT NULL DEFAULT 0,
  `premium` tinyint(4) NOT NULL DEFAULT 0,
  `can_invite` tinyint(4) NOT NULL DEFAULT 0,
  `invited_by` int(10) unsigned DEFAULT NULL,
  `msg_pref` tinyint(4) NOT NULL DEFAULT 1,
  `premium_until` int(11) DEFAULT NULL,
  `is_demo` tinyint(4) NOT NULL DEFAULT 0,
  `founder` int(11) DEFAULT NULL,
  `is_teacher` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `friend_code` (`friend_code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('1', 'rbilohash@gmail.com', 'BILOHASH', '$argon2id$v=19$m=65536,t=4,p=1$TzlEQmEwd2pjTmtQUUNHeQ$e3gneMkrx/5vcuoBEhk1bMRYAJPWwffrL+MqdFXtutM', 'uk', 'HDDHPH', '0', '1789842491', '1789842491', '1790245613', '1789842491', '1', NULL, '0', '1', '1', NULL, '2', NULL, '0', '1', '1');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('2', 'laurence@gmail.com', 'Laurence', '$argon2id$v=19$m=65536,t=4,p=1$UXFzTi5OSmUwT2R5MTNUYg$5v5Fmlk92gnhb2474VlgfdWeQHqhHo76vlgSuCt4y9o', 'en', 'WZECR2', '1', '1789842802', '1789842802', '1789906411', '1789842802', '0', NULL, '1', '1', '1', NULL, '1', NULL, '0', '2', '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('3', 'kaja@demo.bilohash.com', 'Kaja', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'KAJA2N', '1', '1789853325', '1789853325', '1790193977', '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('4', 'espen@demo.bilohash.com', 'Espen', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'ESPEN7', '1', '1789853325', '1789853325', '1790098318', '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('5', 'liv@demo.bilohash.com', 'Liv', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'LIV2NT', '1', '1789853325', '1789853325', '1789854968', '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('6', 'sondre@demo.bilohash.com', 'Sondre', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'SOND3R', '1', '1789853325', '1789853325', NULL, '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('7', 'hana@demo.bilohash.com', 'Hana', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'en', 'HANA2K', '1', '1789853325', '1789853325', '1790068333', '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('8', 'tarek@demo.bilohash.com', 'Tarek', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'TAREK2', '1', '1789853325', '1789853325', NULL, '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('9', 'noor@demo.bilohash.com', 'Noor', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'NUR2KA', '1', '1789853325', '1789853325', '1790185487', '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('10', 'olav@demo.bilohash.com', 'Olav', '$argon2id$v=19$m=65536,t=4,p=1$R1JrM3l2ZVlnL1hNVGd0dA$CSfm6mSYvPW8SoXCKmFbUjqAwdFIt8pj9A089+LliGs', 'no', 'ULAV2N', '1', '1789853325', '1789853325', '1790098337', '1789853325', '0', NULL, '0', '0', '0', NULL, '0', NULL, '1', NULL, '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('11', 'eman@gmail.com', 'Eman', '$argon2id$v=19$m=65536,t=4,p=1$d05PMDROd1ZYRlRHVy5ndQ$/D5FnePtpwPh8Txx/b7NMdIrYjlNEGYURDEteHPkkCw', 'ar', 'HA5GR8', '0', '1790003915', '1790003915', NULL, '1790003915', '0', NULL, '0', '1', '1', NULL, '1', NULL, '0', '3', '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('12', 'humphreyowens@yahoo.com', 'Humphrey', '$argon2id$v=19$m=65536,t=4,p=1$LmIzTVltSWluSDZ3Lm5Baw$AAF+XvDK6n+3INsS3NyaL7W7J6ZgSBxEhCCGWl4HQrQ', 'en', 'R7QW6M', '0', '1790068063', '1790066826', NULL, '1790066826', '0', NULL, '0', '1', '1', NULL, '1', NULL, '0', '4', '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('13', 'voronovam839@gmail.com', 'Mariia', '$argon2id$v=19$m=65536,t=4,p=1$UFVYS25SR3pNSHEzNm9OUw$1R91tyH9RU5Ae7GfkUcj/6kD145ZxkO0nRo+Q17aNyA', 'uk', 'X8JFSX', '0', '1790073580', '1790073565', NULL, '1790073565', '0', NULL, '1', '1', '1', NULL, '1', NULL, '0', '5', '0');
INSERT INTO `kl_users` (`id`, `email`, `name`, `pass_hash`, `lang`, `friend_code`, `share_profile`, `verified_at`, `created_at`, `last_login`, `consent_at`, `is_admin`, `blocked_at`, `is_moderator`, `premium`, `can_invite`, `invited_by`, `msg_pref`, `premium_until`, `is_demo`, `founder`, `is_teacher`) VALUES ('14', 'alinches.hup@gmail.com', 'Alina Ostapovych', '$argon2id$v=19$m=65536,t=4,p=1$aGtpcUxWbXNSR0lzckluMA$0hHsVI2cdmQaG8R676/uFbipiygCiSxRYMDk7vt+wG8', 'uk', 'NQX4VG', '0', NULL, '1790246373', NULL, '1790246373', '0', NULL, '0', '0', '0', NULL, '1', NULL, '0', NULL, '0');

-- ---------- kl_walls ----------
DROP TABLE IF EXISTS `kl_walls`;
CREATE TABLE `kl_walls` (
  `owner` char(6) NOT NULL,
  `secret_hash` char(64) DEFAULT NULL,
  `open` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`owner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('483TMF', '8a7f7b151901204c123081cb34aae73e6e08673d76fc4545f792af110e766896', '1');
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('ABGYTN', 'a2b09d73396f34392f744ab21f59d7c12e804d299d1f0562370b8f5eece7799a', '1');
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('HDDHPH', 'a914a82c7a0301575811e337075348f2aefd8e58ffbd5952265d0727ee4a20ae', '1');
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('KAJA2N', '51162d253648e0096dd5d789f95fa01366812a49feb7a90370f3cd4b6cb3e1ca', '1');
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('V376PP', 'bb076d62c661cf740049b513eec496f6a787fc5daa65ace1530b81969dd6d7df', '1');
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('WZECR2', '5805a57bd98e3970f7359506365f16367ac9048e702ff4293135b6544a85e756', '1');
INSERT INTO `kl_walls` (`owner`, `secret_hash`, `open`) VALUES ('YSD9RM', '5c862c327fd5ee094039b0d09034808d6a8699501c6bbe073397b36fbe532809', '1');

SET FOREIGN_KEY_CHECKS = 1;
-- кінець
