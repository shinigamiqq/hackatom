#!/bin/bash

output_file="users_data.txt"

> "$output_file"

for id in {1..2}
do
  curl -k -X 'GET' \
  "http://127.0.0.1/api/user/${id}" \
  -H 'accept: application/json' >> "$output_file"
  
  echo -e "\n\n----- User ID: $id -----\n" >> "$output_file"
  
  sleep 1
done

echo "Данные успешно сохранены в $output_file"

