from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm.util import identity_key
from starlette.types import HTTPExceptionHandler
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
import logging


app = APIRouter()

oath2_scheme = OAuth2PasswordBearer(tokenUrl="token")
DATABASE_URL = "postgresql://postgres:postgres@postgres_db:5432/hackatom"

engine = create_engine(url=DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id: int = Column(Integer, primary_key=True, index=True)
    username: str = Column(String, unique=True, index=True)
    name: str = Column(String)

class UserResponse(BaseModel):
    id: int
    username: str
    name: str

logging.basicConfig(level=logging.INFO)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/user/{id}', response_model=UserResponse, tags=["users"])
async def get_user(id: int, db: SessionLocal = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=401, detail='пользователь не найден')
    else:
        return UserResponse(id=user.id, username=user.username, name=user.name)

