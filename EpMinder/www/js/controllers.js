angular.module('starter.controllers', [])

.controller('SearchCtrl', function ($scope, $state, Shows) {

    $scope.ViewEpisodes = function (s)
    {
        $scope.confirmDialog();
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
    if ($stateParams.show)
    {

        $scope.show = $stateParams.show;
        $scope.episodes = Episodes.all();

        if ($stateParams.show.status == "Running")
        {
            if (Episodes.currentShow != $stateParams.show.id) {
                Episodes.DataById($stateParams.show.id)
                    .success(function (data) {
                        Episodes.currentShow = $stateParams.show.id;
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
        Favorites.add($stateParams.show);
    };

    $scope.InFavorites = function () {
        return Favorites.exists($stateParams.show);
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
        console.log(s.name);
        $state.go("tab.episodes", { show: s });
    };
});
