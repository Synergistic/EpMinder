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

    if ($stateParams.show) {
        if (Episodes.currentShow != $stateParams.show.id) {
            Episodes.DataById($stateParams.show.id)
                .success(function (data) 
                {
                    Episodes.currentShow = $stateParams.show.id;
     
                    for (var i = 0; i < Object.keys(data).length; i++) 
                    {
                        $scope.episodes.push(data[i]);
                        //$scope.episodes[$scope.episodes.length - 1].airtime = tConvert(data[i].airtime);
                        $scope.episodes[$scope.episodes.length - 1].summary = data[i].summary.replace("<p>", '').replace("</p>", '').replace("&amp;", '&');
                    }

                    $scope.episodes.sort(function (a, b) 
                    {
                        return Math.abs(1 - new Date(a.airdate) / new Date()) - Math.abs(1 - new Date(b.airdate) / new Date())
                    });
                    $scope.episodes.splice(6, $scope.episodes.length);

                    $scope.episodes.sort(function (a, b) {
                        return new Date(a.airdate) - new Date(b.airdate);
                    });

                    Episodes.store($scope.episodes);
                });
        }
        else {
            $scope.episodes = Episodes.all();
        }
    }

    $scope.addToFavorites = function () 
    {
        Favorites.add($stateParams.show);
        //Need to flip star icon to filled and change text to "Remove from Favorites"
    };
})

.controller('EpisodeDetailCtrl', function ($scope, $stateParams, Episodes)
{
    $scope.episode = Episodes.byId($stateParams.episodeId);
    
})

.controller('FavoritesCtrl', function ($scope, $http, $state, Favorites)
{
    $scope.shows = Favorites.all();

    $scope.GetEpisodesForFaves = function (s) {
        $state.go("tab.episodes", { show: s, quantity: 6 });
    };
});
