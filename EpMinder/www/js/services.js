angular.module('starter.services', [])

.factory('Shows', function ($http) {
    shows = [];


    var processShow = function (showObj) {
        var newName = "FixMe";
        var newYear = "FixMe";
        var newCountry = "FixMe";
        var newNetwork = "";
        var newImage = "http://influxis.com/app/uploads/2013/09/tv.jpg";

        //name
        if (showObj.show.name) 
            newName = showObj.show.name;

        //image
        if (showObj.show.image) 
            newImage = showObj.show.image.medium;

        //year
        if (showObj.show.premiered) 
            newYear = showObj.show.premiered.slice(0,4);

        //network
        if (showObj.show.network) {
            newNetwork = showObj.show.network.name;

            //country
            if (showObj.show.network.country)
                newCountry = showObj.show.network.country.code;
        }
        else {
            newNetwork = showObj.show.webChannel.name;
            newCountry = showObj.show.webChannel.country.code;
        }

        return {
            name: newName,
            id: showObj.show.id,
            year: newYear,
            country: newCountry,
            network: newNetwork,
            image: newImage,
            status: showObj.show.status
        };

    };
    


    return {
        search: function (searchTerm) {
            return $http.get("http://api.tvmaze.com/search/shows?q=" + searchTerm.replace(' ', '+'));
        },
        process: function (showJSON) {
            return processShow(showJSON);
        }
    };
})

.factory('Episodes', function ($http) {
    episodes = [];
    currentShow = 0;

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    function tConvert(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }


    function GetThisWeek(data) {
        tempEpisodes = [];
        for (var i = 0; i < Object.keys(data).length; i++) {
            tempEpisodes.push(data[i]);
            tempEpisodes[tempEpisodes.length - 1].summary = data[i].summary.replace("<p>", '').replace("</p>", '').replace("&amp;", '&');
            tempEpisodes[tempEpisodes.length - 1].airtime = tConvert(tempEpisodes[tempEpisodes.length - 1].airtime);
            tempEpisodes[tempEpisodes.length - 1].showname = data[i].url.split('/')[5].split(/[0-9]/)[0].toUpperCase().replace(/-/g, ' ');
        }

        var nextWeekEpisodes = tempEpisodes.filter(function (e) {

            return (new Date(e.airdate) - new Date().addDays(-1)) > 0 && (new Date(e.airdate) - new Date().addDays(7) < 0);
        });

        return nextWeekEpisodes;
    }

    function ExtractEpisodes(data) {
        
        var tempEpisodes = [];
        for (var i = 0; i < Object.keys(data).length; i++) {
            tempEpisodes.push(data[i]);
            tempEpisodes[tempEpisodes.length - 1].summary = data[i].summary.replace("<p>", '').replace("</p>", '').replace("&amp;", '&');
        }

        tempEpisodes.sort(function (a, b) {
            var distanceA = Math.abs(new Date() - new Date(a.airdate));
            var distanceB = Math.abs(new Date() - new Date(b.airdate));

            return distanceA - distanceB;
        });

        var previousEpisodes = tempEpisodes.filter(function (e) {
            return new Date(e.airdate) - new Date().addDays(-1) < 0;
        }).slice(0, 3);

        var newEpisodes = tempEpisodes.filter(function (e) {
            return new Date(e.airdate) - new Date().addDays(-1) > 0;
        }).slice(0, 3);

        if (previousEpisodes.length > 0) {
            previousEpisodes.splice(0, 0, { 'name': 'PREVIOUS EPISODE' + (previousEpisodes.length > 1 ? 'S' : ''), 'class': true });
        }
        if (newEpisodes.length > 0) {
            newEpisodes.splice(0, 0, { 'name': 'NEW EPISODE' + (newEpisodes.length > 1 ? 'S' : ''), 'class': true });
        }
        else {
            newEpisodes.splice(0, 0, { 'name': 'NO NEW EPISODES SCHEDULED', 'class': true });
        }

        return newEpisodes.concat(previousEpisodes);

    }
    

    return {
        all: function () {
            return episodes;
        },
        store: function (epList){
            episodes = epList;
        },
        DataById: function(id){
            return $http.get('http://api.tvmaze.com/shows/' + id + '/episodes');
        },
        process: function (data) {
            episodes = ExtractEpisodes(data);
            return episodes;
        },
        getWeek: function (shows) {
            eps = []
            for (var i = 0; i < shows.length; i++) {
                if (shows[i].status == "Running") {

                    showname = shows[i].name;
                    this.DataById(shows[i].id)
                            .success(function (data) {
                                e = GetThisWeek(data)
                                for (var j = 0; j < e.length; j++) {
                                    eps.push(e[j]);
                                }

                            }).then(function(){
                                eps.sort(function (a, b) {
                                    var distanceA = Math.abs(new Date() - new Date(a.airdate));
                                    var distanceB = Math.abs(new Date() - new Date(b.airdate));

                                    return distanceA - distanceB;
                                });
                            }).finally(function(){
                                for (var i = 0; i < eps.length; i++) {
                                    eps[i].index = i;
                                }});
                }

            };

            return eps;


        },
        byId: function (epId) {
        for (var i = 0; i < episodes.length; i++) {
            if (episodes[i].id === parseInt(epId)) {
                return episodes[i];
            }
        }
        return null;
    }
    };
})

.factory('Favorites', function () {
    

    function SaveDataToLocalStorage(data) {
        var favesList = [];

        favesList = JSON.parse(window.localStorage['favesList']);

        // Push the new data (whether it be an object or anything else) onto the array
        favesList.push(data.name + data.country);

        // Re-serialize the array back into a string and store it in localStorage
        window.localStorage['favesList'] = JSON.stringify(favesList);
        window.localStorage[data.name + data.country] = JSON.stringify(data);
    };

    function RetrieveFaves() {
        var favesList = [];
        var favesObjs = [];

        favesList = JSON.parse(window.localStorage['favesList']);

        for (var fave in favesList) {
            favesObjs.push(
                    JSON.parse(window.localStorage[favesList[fave]])
                );
        }
        return favesObjs;
    };

    function RemoveDataFromLocalStorage(f) {
        var favesList = [];

        favesList = JSON.parse(window.localStorage['favesList']);
        for (var i = 0; i < favesList.length; i++) {
            if (favesList[i] == (f.name + f.country)) {
                favesList.splice(i, 1);
            }
        }

        // Re-serialize the array back into a string and store it in localStorage
        window.localStorage['favesList'] = JSON.stringify(favesList);
    };

    function ExistsInStorage(f) {

        var favesList = [];

        favesList = JSON.parse(window.localStorage['favesList']);

        for (var i = 0; i < favesList.length; i++) {
            if (favesList[i] == (f.name + f.country)) {
                return true;
            }
        }
        return false;
    };


    return {
        all: function () {
            return RetrieveFaves();
        },
        exists: function(showToCheck){
            return ExistsInStorage(showToCheck);
        },
        add: function (newFave) {
            if (ExistsInStorage(newFave)) {
                RemoveDataFromLocalStorage(newFave);
            }
            else {
                SaveDataToLocalStorage(newFave);
            }
            
        },
        byId: function (favesId) {

        }
    };
})
