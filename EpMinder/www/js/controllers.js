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
                    $scope.episodes = Episodes.process(data);
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

    $scope.InFavorites = function () {
        return Favorites.exists($stateParams.show);
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
