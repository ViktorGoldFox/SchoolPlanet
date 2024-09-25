import json 

with open("Schedule.json", "r+") as file:
    data = file.read()

# print(data)

data_json = json.loads(data)

print(data_json)