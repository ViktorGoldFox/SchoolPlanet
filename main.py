from fastapi import FastAPI, HTTPException

from fastapi.logger import logger as fastapilog

from pydantic import BaseModel

from typing import List, Optional

from datetime import date

from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware

import database as db

import json
import pickle

import TokenGen

app = FastAPI()

origins = [
    "http://127.0.0.1",
    "http://localhost",
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins if set to ["*"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

class Homework(BaseModel):
    id: int
    lesson_name: str
    task: str
    task_date: date
    due_date: date

class HomeworkCreate(BaseModel):
    lesson_name: str
    task: str
    task_date: date
    due_date: date
    

class HomeworkUpdate(BaseModel):
    lesson_name: Optional[str] = None
    task: Optional[str] = None
    task_date: Optional[date] = None
    due_date: Optional[date] = None

homeworks = []

with open('homeworks_data.pkl', 'rb') as f:
    if f != None:
        homeworks = pickle.load(f)

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
    
    if (db_answer):    
        token = TokenGen.generateNewToken()
    
        db.writeNewToken(login, token)
        
        return {"Successfully": db_answer, "Token": token}
        
    return {"Successfully": db_answer}


@app.get("/checkToken")
def read_item(token: str):
    db_answer = db.checkToken(token)
        
    return {"Successfully": db_answer}


@app.get("/checkAdmin")
def read_item(token: str):
    db_answer = db.checkAdminRole(token)
        
    return {"Successfully": db_answer}

@app.get("/schedule")
def get_schedule():
    with open("Schedule.json", "r+") as file:
        data = file.read()
    
    return json.loads(data)

@app.post("/homeworks", response_model=Homework)
def create_homework(homework: HomeworkCreate):
    new_homework = Homework(
        id=len(homeworks) + 1,
        lesson_name=homework.lesson_name,
        task=homework.task,
        task_date=homework.task_date,
        due_date=homework.due_date
    )
    homeworks.append(new_homework.dict())
    
    with open('homeworks_data.pkl', 'wb') as f:
        pickle.dump(homeworks, f)
    
    return new_homework

# Эндпоинт для удаления домашнего задания по ID
@app.delete("/homeworks/{homework_id}", response_model=Homework)
def delete_homework(homework_id: int):
    for homework in homeworks:
        if homework["id"] == homework_id:
            homeworks.remove(homework)
            return homework
    with open('homeworks_data.pkl', 'wb') as f:
        pickle.dump(homeworks, f)
    raise HTTPException(status_code=404, detail="Homework not found")

# Эндпоинт для получения домашних заданий по дате сдачи (due_date)
@app.get("/homeworks/task_date/{task_date}", response_model=List[Homework])
def get_homeworks_by_date(task_date: date):
    filtered_homeworks = [hw for hw in homeworks if hw["task_date"] == task_date]
    if not filtered_homeworks:
        raise HTTPException(status_code=404, detail="No homework found for the given date")
    return filtered_homeworks

@app.get("/homeworks/due_date/{due_date}", response_model=List[Homework])
def get_homeworks_by_date(due_date: date):
    filtered_homeworks = [hw for hw in homeworks if hw["due_date"] == due_date]
    if not filtered_homeworks:
        raise HTTPException(status_code=404, detail="No homework found for the given date")
    return filtered_homeworks

@app.get("/homeworks/range_date", response_model=List[Homework])
def get_homeworks_by_date(one_date: date, two_date: date):
    filtered_homeworks = [hw for hw in homeworks if (hw["task_date"] >= one_date) & (hw["task_date"] <= two_date)]
    if not filtered_homeworks:
        raise HTTPException(status_code=404, detail="No homework found for the given date")
    return filtered_homeworks

@app.put("/homeworks/{homework_id}", response_model=Homework)
def update_homework(homework_id: int, homework_update: HomeworkUpdate):
    for homework in homeworks:
        if homework["id"] == homework_id:
            if homework_update.lesson_name is not None:
                homework["lesson_name"] = homework_update.lesson_name
            if homework_update.task is not None:
                homework["task"] = homework_update.task
            if homework_update.task_date is not None:
                homework["task_date"] = homework_update.task_date
            if homework_update.due_date is not None:
                homework["due_date"] = homework_update.due_date
            return homework
    raise HTTPException(status_code=404, detail="Homework not found")