from typing import Union

from fastapi import FastAPI

from fastapi.logger import logger as fastapilog

import database as db

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/ping")
def ping_server():
    fastapilog.info("server pining!")
    
    return {"ping": True}


@app.get("/login")
def read_item(login: str, password: str):
    db_answer = db.checkLoginData(login, password)
    
    return {"Successfully": db_answer}