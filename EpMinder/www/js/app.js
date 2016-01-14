// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.episodes', {
      url: '/episodes',
      params: { show: null, quantity: null },
      cache: false,
      views: {
          'tab-episodes': {
              templateUrl: 'templates/tab-episodes.html',
          controller: 'EpisodesCtrl'
        }
      }
    })
    .state('tab.episode-detail', {
        url: '/episodes/:episodeId',
        cache: false,
      views: {
        'tab-episodes': {
            templateUrl: 'templates/episode-detail.html',
          controller: 'EpisodeDetailCtrl'
        }
      }
    })

  .state('tab.favorites', {
      url: '/favorites',
    cache: false,
    views: {
        'tab-favorites': {
            templateUrl: 'templates/tab-favorites.html',
        controller: 'FavoritesCtrl'
      }
    }
  })
    .state('tab.week', {
        url: '/week',
        cache: false,
        views: {
            'tab-week': {
                templateUrl: 'templates/tab-week.html',
                controller: 'WeekCtrl'
            }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/search');

});



if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    onDeviceReady();
}


function onDeviceReady() {
    //localStorage.clear();
    if (!window.localStorage['favesList']) {
        //Fresh start
        var favesList = [];
        window.localStorage['favesList'] = JSON.stringify(favesList);
    }
};