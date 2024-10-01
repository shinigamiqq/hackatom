from fastapi import FastAPI
from user.main import app as user_app
from login.main import app as login_app

app = FastAPI()

app.include_router(user_app)
app.include_router(login_app)

