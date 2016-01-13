angular.module('starter.controllers', [])

.controller('SearchCtrl', function ($scope, $state, Shows) {

    $scope.ViewEpisodes = function (s)
    {
        //Called when a show element is clicked
        $state.go("tab.episodes", { show: s });
    };

    $scope.searchShows = function ()
    {
        //Called when 'enter' hit on search box
        Shows.search($("#search").val())
            .success(function (data)
            {
                $scope.shows = [];
                for (var i = 0; i < Object.keys(data).length; i++)
                {
                    $scope.shows.push(Shows.process(data[i]));
                }
            });

        document.activeElement.blur();
    };
})
.controller('EpisodesCtrl', function ($scope, $stateParams, Episodes, Favorites) {

    $scope.episodes = [];

    $scope.show = { 'name': 'Episodes' };
    console.log("StateParams" + $stateParams.show.name);
    if ($stateParams.show)
    {

        $scope.show = $stateParams.show;
        $stateParams.show = null;
        $scope.episodes = Episodes.all();

        if ($scope.show.status == "Running")
        {
            if (Episodes.currentShow != $scope.show.id) {
                Episodes.DataById($scope.show.id)
                    .success(function (data) {
                        Episodes.currentShow = $scope.show.id;
                        $scope.episodes = Episodes.process(data);
                    });
            }
        }
        else {
            $scope.episodes = [{ 'name': 'THIS SHOW HAS ENDED', 'class': true }];
        }
    }

    $scope.addToFavorites = function () 
    {
        Favorites.add($scope.show);
    };

    $scope.InFavorites = function () {
        return Favorites.exists($scope.show);
    };
})

.controller('EpisodeDetailCtrl', function ($scope, $stateParams, Episodes)
{
    $scope.episode = Episodes.byId($stateParams.episodeId);
    
})

.controller('FavoritesCtrl', function ($scope, $state, Favorites)
{
    $scope.shows = Favorites.all();

    $scope.GetEpisodesForFaves = function (s) {
        $state.go("tab.episodes", { show: s });
    };
})

.controller('WeekCtrl', function ($scope, $state, Episodes, Favorites) {
    $scope.shows = Favorites.all();
    $scope.episodes = [];

    for (var i = 0; i < $scope.shows.length; i++) {
        if ($scope.shows[i].status == "Running")
        {
            
            showname = $scope.shows[i].name;
            Episodes.DataById($scope.shows[i].id)
                    .success(function (data) {
                        eps = Episodes.getWeek(data);
                        for (var j = 0; j < eps.length; j++) {
                            $scope.episodes.push(eps[j]);
                        }
                        
                    });

        }


    };

});
