from fastapi import File, UploadFile
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import subprocess
import os

app = APIRouter()

@app.post("/execute_file")
async def execute_file(code_file: UploadFile = File(...)):
    file_path = f"{code_file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await code_file.read())

    try:
        subprocess.run(["python", file_path])
        result = "Код выполнен."
    except subprocess.CalledProcessError as e:
        result = f"Ошибка выполнения кода: {e}"

    os.remove(file_path)

    return JSONResponse({"result": result})

