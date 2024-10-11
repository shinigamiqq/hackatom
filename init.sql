-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- Создание таблицы паролей пользователей
CREATE TABLE IF NOT EXISTS users_passwords (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Вставка данных
INSERT INTO users (username, name) VALUES
('admin', 'Кудж Станислав'),
('katya', 'Мизулина Екатерина'),
('bebrina', 'Бебрина Елизавета'),
('skufchik', 'Скуфов Скуф'),
('viperr', 'Монгол Олег'),
('monesy', 'Осипов Илья'),
('playboi_carti', 'Джордан Террелл Картер');

INSERT INTO users_passwords (username, password) VALUES
('admin', 'qwerty123'),
('katya', '12345678'),
('bebrina', 'password'),
('skufchik', '1234'),
('viperr', 'qwertyuiop'),
('monesy', '123456'),
('playboi_carti', '666666');
