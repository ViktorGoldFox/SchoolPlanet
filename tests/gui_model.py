from doctest import debug
from uu import Error
import requests
import json

from logzero import logger, logfile

logfile("logs.logs")

def exit_programm():
    exit()
    

def pining_server():
    logger.info("pining server...")
    try:
        data = requests.get("http://127.0.0.1:8000/ping")
        ping = data.text
    except Exception as Error:
        logger.error(Error)
        logger.critical("Server not ping")
        
        exit_programm()
    
    logger.debug(f"ping: {ping}")
    
    return ping


def LoadLoginPage():
    login = str(input("login"))
    password = str(input("password"))
    
    logger.debug(f"login: {login}, password: {password}")
    
    try:
        data = requests.get(f"http://127.0.0.1:8000/login?login={login}&password={password}")
        
        if data.status_code == 422:
            logger.critical("Error in data intro server")
        
            exit_programm()
        
        logger.debug(data)
        logger.debug(data.text)
    except Exception as Error:
        logger.critical("Server not ping")
        
        exit_programm()
    
    if bool(json.loads(data.text)["Successfully"]):
        print("Successfully")
    else:
        print("fail")
        
        LoadLoginPage()
    

def LoadMain():
    logger.info("starting load main...")
    
    pining_server()

    LoadLoginPage()


if __name__ == "__main__":
    LoadMain()