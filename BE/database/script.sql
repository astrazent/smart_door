DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS doors;

CREATE TABLE doors (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    door_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    server_domain VARCHAR(255), -- Tên miền hoặc địa chỉ server quản lý cửa
    is_active BOOLEAN DEFAULT TRUE,
    current_status ENUM('OPENED', 'CLOSED') DEFAULT 'CLOSED',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_uid VARCHAR(50) NOT NULL UNIQUE,
    user_id INT UNSIGNED,
    is_active BOOLEAN DEFAULT TRUE,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE attendance (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    door_id INT UNSIGNED,
    check_in_time DATETIME DEFAULT NULL,
    check_out_time DATETIME DEFAULT NULL,
    duration_minutes INT GENERATED ALWAYS AS (
        TIMESTAMPDIFF(MINUTE, check_in_time, check_out_time)
    ) STORED,
    status ENUM('CHECKED_IN', 'CHECKED_OUT') DEFAULT 'CHECKED_IN',
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE SET NULL
);

CREATE TABLE history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    door_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED,
    action ENUM('OPEN', 'CLOSE', 'FAILED') NOT NULL,
    door_status ENUM('OPENED', 'CLOSED') NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO users (full_name, username, email, phone, role, password_hash) VALUES
('Nguyen Van A', 'nguyena', 'nguyena@example.com', '0901000001', 'admin', '$2a$10$XXfVMaNWOkbuSCDBFUt6Oe4SzgraxK6topyQmLK08fl2.oSr2FZcS'),
('Tran Thi B', 'tranb', 'tranb@example.com', '0901000002', 'member', '$2a$10$xjY2sqT.94SnKSG740dq2OkIlhm4quFk9rM8SOzpk/UG9iz9drgdK'),
('Le Van C', 'lec', 'lec@example.com', '0901000003', 'member', '$2a$10$ODbw93tP0nixoSu6WoZ4WuVAtLWSiaAzLz6z/RfLxGAk6Bp49Y6Bu'),
('Pham Thi D', 'phamd', 'phamd@example.com', '0901000004', 'member', '$2a$10$g8kkQprqpBUQQ.Kz4CBPj.zOZwc.iDRMB5uQhk8XLPoi7fNFLwSCC'),
('Do Van E', 'doe', 'doe@example.com', '0901000005', 'member', '$2a$10$fU1ncARTVQVSbCPXx0GDKexeigLyVErPqHbnu/S2Cdr3JHWq5knxW');

INSERT INTO cards (card_uid, user_id, is_active) VALUES
('F6 4E 93 05', 1, TRUE),
('F7 58 2D C2', 2, TRUE),
('C7 D3 40 C2', 3, TRUE),
('57 E1 1E C2', 4, TRUE),
('17 2F 0C C2', 5, TRUE),
('87 99 17 C2', NULL, TRUE),
('37 85 F7 05', NULL, FALSE),
('67 22 88 A5', 3, TRUE),
('A1 B2 C3 D4', 1, TRUE),
('99 11 22 33', NULL, TRUE);

INSERT INTO doors (door_code, name, location, server_domain, is_active, current_status) VALUES
('DOOR_MAIN', 'Cửa chính', 'Tầng 1', NULL, TRUE, 'CLOSED'),
('DOOR_BACK', 'Cửa sau', 'Tầng 1', NULL, TRUE, 'CLOSED'),
('DOOR_STORAGE', 'Cửa kho', 'Tầng 2', NULL, TRUE, 'CLOSED'),
('DOOR_TECH', 'Cửa kỹ thuật', 'Tầng 3', NULL, TRUE, 'OPENED');

INSERT INTO attendance (user_id, door_id, check_in_time, check_out_time, status, note)
VALUES
-- Nguyen Van A
(1, 1, DATE_SUB(NOW(), INTERVAL 10 MINUTE), DATE_SUB(NOW(), INTERVAL 5 MINUTE), 'CHECKED_OUT', 'Nguyen Van A vào cửa chính'),
(1, 3, DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR), DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR), 'CHECKED_OUT', 'Nguyen Van A vào kho'),

-- Tran Thi B
(2, 2, DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 8 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 1 DAY), INTERVAL 8 HOUR), INTERVAL 30 MINUTE), 'CHECKED_OUT', 'Tran Thi B vào cửa sau'),
(2, 1, DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 DAY), INTERVAL 8 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 8 DAY), INTERVAL 8 HOUR), INTERVAL 5 MINUTE), 'CHECKED_OUT', 'Tran Thi B vào cửa chính'),

-- Le Van C
(3, 3, DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 7 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 7 HOUR), INTERVAL 4 MINUTE), 'CHECKED_OUT', 'Le Van C vào kho'),
(3, 2, DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 DAY), INTERVAL 22 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 DAY), INTERVAL 22 HOUR), INTERVAL 10 MINUTE), 'CHECKED_OUT', 'Le Van C vào cửa sau'),

-- Pham Thi D
(4, 4, DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 15 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 3 DAY), INTERVAL 15 HOUR), INTERVAL 20 MINUTE), 'CHECKED_OUT', 'Pham Thi D thử mở cửa kỹ thuật'),

-- Do Van E
(5, 1, DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 DAY), INTERVAL 8 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 4 DAY), INTERVAL 8 HOUR), INTERVAL 5 MINUTE), 'CHECKED_OUT', 'Do Van E vào cửa chính'),
(5, 3, DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 DAY), INTERVAL 9 HOUR), DATE_ADD(DATE_ADD(DATE_SUB(NOW(), INTERVAL 10 DAY), INTERVAL 9 HOUR), INTERVAL 5 MINUTE), 'CHECKED_OUT', 'Do Van E vào kho');

INSERT INTO history (door_id, user_id, action, door_status, note, time) VALUES
(1, 1, 'OPEN', 'OPENED', 'Nguyen Van A mở cửa chính', NOW() - INTERVAL 10 MINUTE),
(1, 1, 'CLOSE', 'CLOSED', 'Nguyen Van A đóng cửa chính', NOW() - INTERVAL 9 MINUTE),
(2, 2, 'OPEN', 'OPENED', 'Tran Thi B mở cửa sau', NOW() - INTERVAL 1 DAY + INTERVAL 8 HOUR),
(3, 3, 'OPEN', 'OPENED', 'Le Van C mở cửa kho', NOW() - INTERVAL 2 DAY + INTERVAL 7 HOUR),
(3, 3, 'CLOSE', 'CLOSED', 'Le Van C đóng cửa kho', NOW() - INTERVAL 2 DAY + INTERVAL 7 HOUR + INTERVAL 4 MINUTE),
(4, 4, 'FAILED', 'CLOSED', 'Pham Thi D mở cửa kỹ thuật thất bại', NOW() - INTERVAL 3 DAY + INTERVAL 15 HOUR),
(1, 5, 'OPEN', 'OPENED', 'Do Van E mở cửa chính bằng thẻ hợp lệ', NOW() - INTERVAL 4 DAY + INTERVAL 8 HOUR),
(1, 5, 'CLOSE', 'CLOSED', 'Do Van E đóng cửa chính', NOW() - INTERVAL 4 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
(2, 3, 'OPEN', 'OPENED', 'Le Van C mở cửa sau bằng thẻ phụ', NOW() - INTERVAL 5 DAY + INTERVAL 22 HOUR),
(2, 3, 'CLOSE', 'CLOSED', 'Le Van C đóng cửa sau', NOW() - INTERVAL 5 DAY + INTERVAL 22 HOUR + INTERVAL 10 MINUTE),
(3, 1, 'FAILED', 'CLOSED', 'Nguyen Van A thử mở cửa kho nhưng bị từ chối', NOW() - INTERVAL 6 DAY + INTERVAL 9 HOUR),
(4, NULL, 'CLOSE', 'CLOSED', 'Cửa kỹ thuật tự động đóng lúc 23:00', NOW() - INTERVAL 7 DAY + INTERVAL 23 HOUR),
(1, 2, 'OPEN', 'OPENED', 'Tran Thi B mở cửa chính', NOW() - INTERVAL 8 DAY + INTERVAL 8 HOUR),
(1, 2, 'CLOSE', 'CLOSED', 'Tran Thi B đóng cửa chính', NOW() - INTERVAL 8 DAY + INTERVAL 8 HOUR + INTERVAL 5 MINUTE),
(2, 4, 'OPEN', 'OPENED', 'Pham Thi D mở cửa sau', NOW() - INTERVAL 9 DAY + INTERVAL 7 HOUR),
(2, 4, 'FAILED', 'CLOSED', 'Thẻ lỗi khi mở cửa sau', NOW() - INTERVAL 9 DAY + INTERVAL 7 HOUR + INTERVAL 2 MINUTE),
(3, 5, 'OPEN', 'OPENED', 'Do Van E mở cửa kho', NOW() - INTERVAL 10 DAY + INTERVAL 9 HOUR),
(3, 5, 'CLOSE', 'CLOSED', 'Do Van E đóng cửa kho', NOW() - INTERVAL 10 DAY + INTERVAL 9 HOUR + INTERVAL 5 MINUTE);
