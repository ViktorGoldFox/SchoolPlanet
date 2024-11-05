from fastapi import FastAPI, HTTPException

from fastapi.logger import logger as fastapilog

from pydantic import BaseModel

from typing import List, Optional

from datetime import date

import uvicorn

from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, PlainTextResponse

import Deperance.database as db

import json
import pickle

import Deperance.TokenGen as TokenGen

#app = FastAPI(docs_url=None)
app = FastAPI()
origins = [
    "http://127.0.0.1:3000",
    "http://localhost",
    "https://freesheld.com"
     #Add other origins if needed
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
    #flags: list[str]
    #images: list[str]
    task_date: date
    due_date: date

class HomeworkCreate(BaseModel):
    lesson_name: str
    task: str
    #flags: list[str]
    #images: list[str]
    task_date: date
    due_date: date
    

class HomeworkUpdate(BaseModel):
    lesson_name: Optional[str] = None
    task: Optional[str] = None
    task_date: Optional[date] = None
    due_date: Optional[date] = None

homeworks = {
    "7": [],
}

with open('DataBases/7/homeworks_data.pkl', 'rb') as f:
    if f != None:
        homeworks["7"] = pickle.load(f)

@app.get("/")
def root_endpoint():
    return RedirectResponse("/main")


@app.get("/ping")
def ping_server():
    fastapilog.info("server pining!")
    
    return {"ping": True}


@app.get("/login")
def read_item(login: str, password: str):
    db_answer = db.checkLoginData(login, password)
    
    if db_answer:    
        token = TokenGen.generateNewToken()
    
        db.writeNewToken(login, token)
        
        return {"Successfully": db_answer, "Token": token}
    else:
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
def get_schedule(token: str):
    classNum = db.getUserClass(token)
    
    data = db.getSchedule(classNum)
    
    return json.loads(data)

@app.get("/estimation")
def estimation_get(token: str):
    classNum = db.getUserClass(token)
    print(classNum)
    db_answer = db.get_json_data(token, classNum)
    
    print(db_answer)
    
    if db_answer == False: raise HTTPException(status_code=404, detail="User not found")
    
    return db_answer

@app.post("/homeworks", response_model=Homework)
def create_homework(homework: HomeworkCreate, token: str):
    classNum = db.getUserClass(token)
    
    if db.checkAdminRole(token):
        new_homework = Homework(
        id=len(homeworks[classNum]) + 1,
        lesson_name=homework.lesson_name,
        task=homework.task,
        # flags=homework.flags,
        # images=homework.images,
        task_date=homework.task_date,
        due_date=homework.due_date
    )
        homeworks[classNum].append(new_homework.dict())

        
        with open(f'DataBases/{classNum}/homeworks_data.pkl', 'wb') as f:
            pickle.dump(homeworks[classNum], f)

        return new_homework
    else: 
        raise HTTPException(status_code=404, detail="No root rules")

# Эндпоинт для удаления домашнего задания по ID
@app.delete("/homeworks", response_model=Homework)
def delete_homework(homework_id: int, token: str):
    if db.checkAdminRole(token):
        classNum = db.getUserClass(token)
        
        for homework in homeworks[classNum]:
            if homework["id"] == homework_id:
                homeworks[classNum].remove(homework)
                
                classNum = db.getUserClass(token)
                
                with open(f'DataBases/{classNum}/homeworks_data.pkl', 'wb') as f:
                    pickle.dump(homeworks[classNum], f)
                 
                return homework
            
        {"found": False}
    else:
        raise HTTPException(status_code=404, detail="No root rules")

# Эндпоинт для получения домашних заданий по дате сдачи (due_date)
@app.get("/homeworks/task_date/{task_date}")
def get_homeworks_by_date(task_date: date, token: str):
    classNum = db.getUserClass(token)
    
    filtered_homeworks = [hw for hw in homeworks[classNum] if hw["task_date"] == task_date]
    if not filtered_homeworks:
        return {"found": False}
    return {"found": True, "data": filtered_homeworks}

@app.get("/homeworks/due_date/{due_date}")
def get_homeworks_by_date(due_date: date, token: str):
    classNum = db.getUserClass(token)
    
    filtered_homeworks = [hw for hw in homeworks[classNum] if hw["due_date"] == due_date]
    if not filtered_homeworks:
        return {"found": False}
    return {"found": True, "data": filtered_homeworks}

@app.get("/homeworks/range_date")
def get_homeworks_by_date(one_date: date, two_date: date, token: str):
    classNum = db.getUserClass(token)
    
    filtered_homeworks = [hw for hw in homeworks[classNum] if (hw["task_date"] >= one_date) & (hw["task_date"] <= two_date)]
    if not filtered_homeworks:
       return {"found": False}
    return {"found": True, "data": filtered_homeworks}

@app.get("/profile")
def get_profile(token: str):
    profile_data = db.getProfileData(token)

    print(profile_data)
    
    return profile_data

@app.get("/console")
def get_profile(token: str):
    if db.checkAdminRole(token):
        classNum = db.getUserClass(token)
        
        averange_data = db.get_all_average(f"DataBases/{classNum}/data.xlsx", 2)
        names_data = db.get_names(f"DataBases/{classNum}/data.xlsx")
        
        
        return {"averange": averange_data, "names": names_data}

# @app.put("/homeworks/{homework_id}", response_model=Homework)
# def update_homework(homework_id: int, homework_update: HomeworkUpdate):
#     for homework in homeworks:
#         if homework["id"] == homework_id:
#             if homework_update.lesson_name is not None:
#                 homework["lesson_name"] = homework_update.lesson_name
#             if homework_update.task is not None:
#                 homework["task"] = homework_update.task
#             if homework_update.task_date is not None:
#                 homework["task_date"] = homework_update.task_date
#             if homework_update.due_date is not None:
#                 homework["due_date"] = homework_update.due_date
#             return homework
#     raise HTTPException(status_code=404, detail="Homework not found")
