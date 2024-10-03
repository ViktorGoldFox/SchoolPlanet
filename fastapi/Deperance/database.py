import pandas as pd 

data = pd.read_csv("DataBases/database.csv")

def checkLoginData(login: str, password: str):
    """
    Args:
        login (str): _description_
        password (str): _description_
        
    Проверка входа
    
    Return: true/false

    """
    
    data = pd.read_csv("DataBases/database.csv")
    
    return data[(data["login"] == login) & (data["password"] == password)].shape[0] == 1

def checkToken(token: str):
    """
    Args:
        login (str): _description_
        password (str): _description_
        
    Проверка входа
    
    Return: true/false

    """
    
    data = pd.read_csv("DataBases/database.csv")
    
    return data[data["token"] == token].shape[0] == 1


def writeNewToken(login: str, newToken: str):
    """_summary_

    Args:
        login (str): _description_
        newToken (str): _description_
        
    Запись нового токена в базу
    """
    data = pd.read_csv("DataBases/database.csv")
    
    index = data.index[data["login"] == login][0]
    
    data.loc[index,"token"] = newToken
    
    data.to_csv("DataBases/database.csv", index=False)
    
def checkAdminRole(token: str):
    data = pd.read_csv("DataBases/database.csv")
    
    if data[data["token"] == token].shape[0] == 0: return False
    
    index = data.index[data["token"] == token][0]
    
    return str(data.loc[index,"role"]) == "admin"
