from datetime import datetime
import pandas as pd

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


def get_json_data(last_name: str, name: str):
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
    start_time = datetime.now()
    data = pd.read_excel(path_to_data,index_col = None, header=None) 

    data_row_lenght = data.shape[0]
    
    lesson_names = []
    
    for i in range(7, data_row_lenght):
        loc_data = data.loc[i, 1]
        
        if (loc_data != "nan") & (loc_data not in lesson_names):
            lesson_names.append(loc_data)
            
    end_time = datetime.now()
    print(f"Complite time: {(end_time - start_time)}")
    
    return lesson_names


def get_averange_on_lesson(path_to_data: str, lesson_name: str, chars: int):
    start_time = datetime.now()
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
    
    end_time = datetime.now()
    print(f"Complite time: {(end_time - start_time)}")
    
    return average
         
         
def get_all_average(path_to_data: str, chars: int):
    start_time = datetime.now()
    for lesson in get_lesson_names(path_to_data):
        print(f"{lesson}: {get_averange_on_lesson(path_to_data, lesson_name=lesson, chars=chars)}")
        
    end_time = datetime.now()
    print(f"Complite time: {(end_time - start_time)}")

if __name__ == "__main__":
    # print(get_data_all("data.xlsx"))
    # print(get_averange_on_lesson("data.xlsx", "Изобразительное искусство", 3))
    print(get_all_average("data.xlsx", chars=3))
    # get_json_data(last_name='Доронин', name="Виктор")