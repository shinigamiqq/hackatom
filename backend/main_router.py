from fastapi import FastAPI
from user.main import app as user_app
from login.main import app as login_app
from account.main import app as account_app
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_app)
app.include_router(login_app)
app.include_router(account_app)

#app.openapi = lambda: app.openapi_schema()

