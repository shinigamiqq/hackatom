from fastapi import FastAPI
from user.main import app as user_app
from login.main import app as login_app
from account.main import app as account_app
from dummy.main import app as dummy_app
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(openapi_version="3.0.2", root_path="/api")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(account_app)
app.include_router(dummy_app)
app.include_router(user_app)
app.include_router(login_app)
