import json
from urllib import request
import datetime

entered_show_text = "#$%^"
while not entered_show_text.replace(' ', '').isalpha():
    entered_show_text = input("Enter your show:")

print(entered_show_text + " thank you.")
#show_url = 'http://api.tvmaze.com/search/shows?q=' + entered_show_text.replace(' ', '+')
show_url = "http://api.tvmaze.com/singlesearch/shows?q=" + entered_show_text.replace(' ', '+') + "&embed=episodes"
try:
    response = request.urlopen(show_url)
    str_response = response.readall().decode('utf-8')
    obj = json.loads(str_response)
    hits = len(obj)

except request.URLError as e:
    print('Nope ' + e)


current_season = []
for episode in obj["_embedded"]["episodes"]:
    airdate = datetime.datetime(int(episode["airdate"][0:4]), int(episode["airdate"][5:7]), int(episode["airdate"][8:10]))
    if  airdate > datetime.datetime.today():
        current_season.append(episode)


print("There are " + str(len(current_season)) + " episodes remaining in the season for " + entered_show_text)
for episode in current_season:
    print(episode["airdate"] + " " + episode["name"])
