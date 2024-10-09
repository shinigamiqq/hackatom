from re import T
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis_om import get_redis_connection
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


app = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
DATABSE_URL = "postgresql://postgres@localhost:5432/hackatom"

engine = create_engine(url=DATABSE_URL)
SessionLocal = sessionmaker(autoflush=False, bind=engine)

user_id = 0

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id: int = Column(Integer, primary_key=True, index=True)
    username: str = Column(String, unique=True, index=True)
    name: str = Column(String)


class Login(Base):
    __tablename__ = "users_passwords"
    id: int = Column(Integer, primary_key=True, index=True)
    username: str = Column(String, unique=True, index=True)
    password: str = Column(String)

class LoginRequest(BaseModel):
    username: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(username, password):
    with SessionLocal() as db:
        user = db.query(Login).filter(Login.username == username).first()
        #user_id = db.query(User).filter(User.id == id).first()
        if user and user.password == password:
            return True
    return False

@app.post("/login")
async def login(login_request: LoginRequest):
    if not verify_password(login_request.username, login_request.password):
        raise HTTPException(status_code=401, detail='неверный пароль')
    token = "dummy_token"
    return JSONResponse({"auth": True, "user_id": user_id,
                         "access_token": token, "token_type": "bearer"})
