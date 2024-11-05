from datetime import datetime
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


def getSchedule(classNum: str):
    with open(f"DataBases/{classNum}/Schedule.json", "r+") as file:
        data = file.read()
        
    return data


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
    

def getUserClass(token: str):
    data = pd.read_csv("DataBases/database.csv")
    
    if data[data["token"] == token].shape[0] == 0: return False
    
    index = data.index[data["token"] == token][0]
    
    return str(data.loc[index, 'class'])


def getProfileData(token: str):
    data = pd.read_csv("DataBases/database.csv")

    if data[data["token"] == token].shape[0] == 0: return False

    index = data.index[data["token"] == token][0]

    return {
        "name": str(data.loc[index, 'name']),
        "last_name": str(data.loc[index, 'last_name']),
        "class": str(data.loc[index, 'class'])
    }
    


def checkAdminRole(token: str):
    data = pd.read_csv("DataBases/database.csv")
    
    if data[data["token"] == token].shape[0] == 0: return False
    
    index = data.index[data["token"] == token][0]
    
    return str(data.loc[index,"role"]) == "admin"


def load_estimation_database(path_to_data: str, save_path: str):
    data = pd.read_excel(path_to_data,index_col = None, header=None) 

    data_row_lenght = data.shape[0]

    for i in range(7, data_row_lenght):
        if str(data.loc[i, 0]) != 'nan':    
            name = str(data.loc[i,0].split()[0] + "_" + data.loc[i,0].split()[1])

            lesson_name_all = []
            estimations_all = []
            fourth_all = []
            average_all = []
            omissions_all = []

            for les_i in range(15):
                lesson_name = str(data.loc[int(i + les_i), 1])
                if lesson_name in lesson_name_all:
                    continue
                
                lesson_name_all.append(lesson_name)
                
                if str(data.loc[int(i + les_i), 2]) != "nan": estimations = data.loc[int(i + les_i), 2] 
                else: estimations = '-'

                estimations_all.append(estimations)

                if str(data.loc[int(i + les_i), 4]) != "nan": fourth = data.loc[int(i + les_i), 4] 
                else: fourth = '-'

                fourth_all.append(fourth)

                if str(data.loc[int(i + les_i), 3]) != "nan": average = data.loc[int(i + les_i), 3] 
                else: average = '-'

                average_all.append(average)

                omissions_all.append(data.loc[int(i + les_i), 5])

            df = pd.DataFrame({'lesson': lesson_name_all, 'estimation': estimations_all, 'average': average_all, 'fourth': fourth_all, "omissions": omissions_all})
            df.to_csv(f'{save_path}/{name}.csv', index=False)


def getNames(token: str):
    csv = pd.read_csv("DataBases/database.csv")
    
    if csv[csv["token"] == token].shape[0] == 0: return False
    
    index = csv.index[csv["token"] == token][0]
    
    last_name = csv.loc[index, 'last_name']
    name = csv.loc[index, 'name']
    
    return [last_name, name]


def get_json_data(token: str, classNum: str):
    last_name, name = getNames(token)
    
    if (str(last_name) == "0") | (str(name) == "0"):
        return False
    
    file_path = f"DataBases/{classNum}/{last_name}_{name}.csv"
    
    data = pd.read_csv(file_path)
    
    data_row_lenght = data.shape[0]
    
    lesson_name_all = []
    estimations_all = []
    average_all = []
    fourth_all = []
    omissions_all = [] 
    
    for index in range(data_row_lenght):
        lesson_name_all.append(data.loc[index, 'lesson'])
        estimations_all.append(data.loc[index, 'estimation'])
        average_all.append(str(data.loc[index, 'average']))
        fourth_all.append(data.loc[index, 'fourth'])
        omissions_all.append(str(data.loc[index, 'omissions']))
        
    data_json = {'lesson': lesson_name_all, 'estimation': estimations_all, 'average': average_all, 'fourth': fourth_all, "omissions": omissions_all}
    
    return data_json
    
    
def get_data_all(path_to_data: str):
    start_time = datetime.now()
    data = pd.read_excel(path_to_data,index_col = None, header=None) 

    data_row_lenght = data.shape[0]

    data_all = []

    for i in range(7, data_row_lenght):
        if str(data.loc[i, 0]) != 'nan':    
            name = str(data.loc[i,0].split()[0] + "_" + data.loc[i,0].split()[1])
            lesson_name_all = []
            estimations_all = []
            fourth_all = []
            average_all = []
            omissions_all = []

            for les_i in range(15):
                if (i + les_i) >= data_row_lenght:
                    break
                lesson_name_all.append(str(data.loc[int(i + les_i), 1]))
                
                if str(data.loc[int(i + les_i), 2]) != "nan": estimations = data.loc[int(i + les_i), 2] 
                else: estimations = '-'

                estimations_all.append(estimations)

                if str(data.loc[int(i + les_i), 4]) != "nan": fourth = data.loc[int(i + les_i), 4] 
                else: fourth = '-'

                fourth_all.append(fourth)

                if str(data.loc[int(i + les_i), 3]) != "nan": average = data.loc[int(i + les_i), 3] 
                else: average = '-'

                average_all.append(average)

                omissions_all.append(data.loc[int(i + les_i), 5])

            data_json = {
                "student": name,
                "lesson_name_all": lesson_name_all,
                "estimations_all": estimations_all,
                "fourth_all": fourth_all,
                "average_all": average_all,
                "omissions_all": omissions_all
            }
            data_all.append(data_json)    
            
    end_time = datetime.now()
    print(f"Complite time: {(end_time - start_time)}")
    
    return data_all        


def get_json_data_sinle(last_name: str, name: str):
    file_path = f"dataframes/{last_name}_{name}.csv"
    
    data = pd.read_csv(file_path)
    
    data_row_lenght = data.shape[0]
    
    lesson_name_all = []
    estimations_all = []
    average_all = []
    fourth_all = []
    omissions_all = [] 
    
    for index in range(data_row_lenght):
        lesson_name_all.append(data.loc[index, 'lesson'])
        estimations_all.append(data.loc[index, 'estimation'])
        average_all.append(str(data.loc[index, 'average']))
        fourth_all.append(data.loc[index, 'fourth'])
        omissions_all.append(str(data.loc[index, 'omissions']))
        
    data_json = {'lesson': lesson_name_all, 'estimation': estimations_all, 'average': average_all, 'fourth': fourth_all, "omissions": omissions_all}
    
    print(data_json)
   

def get_lesson_names(path_to_data: str):
    data = pd.read_excel(path_to_data,index_col = None, header=None) 

    data_row_lenght = data.shape[0]
    
    lesson_names = []
    
    for i in range(7, data_row_lenght):
        loc_data = data.loc[i, 1]
        
        if (str(loc_data) != "nan") & (loc_data not in lesson_names):
            lesson_names.append(loc_data)
    
    return lesson_names

def get_names(path_to_data: str):
    data = pd.read_excel(path_to_data,index_col = None, header=None) 

    data_row_lenght = data.shape[0]
    
    names = []
    
    for i in range(7, data_row_lenght):
        loc_data = data.loc[i, 0]
        
        if (str(loc_data) != "nan") & (loc_data not in names):
            names.append(loc_data)
    
    return names


def get_averange_on_lesson(path_to_data: str, lesson_name: str, chars: int):
    data = pd.read_excel(path_to_data,index_col = None, header=None) 

    data_row_lenght = data.shape[0]
    
    estimations = []
    
    for i in range(7, data_row_lenght):
        if data.loc[i, 1] == lesson_name:
            loc_data = data.loc[i, 2]

            if (str(loc_data) != "nan") & (loc_data not in estimations):
                for i_2 in loc_data:
                    if i_2 != " ":
                        estimations.append(int(i_2))
            
    average = round(sum(estimations) / len(estimations), chars)
    
    return average
         
         
def get_all_average(path_to_data: str, chars: int):    
    global_data = []
    
    index = 0
    for lesson in get_lesson_names(path_to_data):
        global_data.append({
            "name": lesson,
            "averange": get_averange_on_lesson(path_to_data, lesson, chars)
        })
        index += 1
        
    global_data += "}"
    
    return global_data

if __name__ == "__main__":
    pass
    # load_estimation_database(path_to_data="data.xlsx", save_path="DataBases/7")
    # get_json_data(token="p_11-JM3S4CubA3dDweObA")
