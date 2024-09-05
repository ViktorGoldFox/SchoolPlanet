import pandas as pd 

data = pd.read_csv("database.csv")

def checkLoginData(login: str, password: str):
    """
    Args:
        login (str): _description_
        password (str): _description_
        
    Проверка входа
    
    Return: true/false

    """
    
    data = pd.read_csv("database.csv")
    
    print(data[(data["login"] == login) & (data[data["password"] == password])].shape[0])
    
    return True
    