#!/bin/bash

output_file="users_data.txt"

# Очищаем файл, если он уже существует
> "$output_file"

for id in {1..2}
do
  # Выполняем GET запрос и сохраняем результат в файл
  curl -k -X 'GET' \
  "http://127.0.0.1:8000/user/${id}" \
  -H 'accept: application/json' >> "$output_file"
  
  # Добавляем разделитель для удобства чтения
  echo -e "\n\n----- User ID: $id -----\n" >> "$output_file"
  
  sleep 1
done

echo "Данные успешно сохранены в $output_file"

