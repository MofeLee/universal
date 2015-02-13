angular.module('elements')
  .config(function ($routeProvider) {

    function authenticated ($q, $location, BaseUser) {
      var deferred = $q.defer();
      var isAuthenticated = BaseUser.getCurrentId();
      if (!isAuthenticated) {
        $location.path('/login');
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    $routeProvider.when('/settings', {
      templateUrl: '/elements/page-settings/page-settings.html',
      controller: 'PageSettingsCtrl',
      resolve: { authenticated: authenticated }
    });

  })
  .controller('PageSettingsCtrl', function($scope, $auth, $alert, $http, BaseUser) {

    $scope.user = BaseUser.getCurrent();

    $scope.updateProfile = function() {
      var data = {
        id: BaseUser.getCurrentId(),
        displayName: $scope.user.displayName,
        email: $scope.user.email,
        location: $scope.user.location,
        phone: $scope.user.phone
      };

      BaseUser
        .upsert(data)
        .$promise
        .then(function () {
          $scope.user = BaseUser.getCurrent();
          $alert({
            content: 'Profile has been updated',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          $scope.user = BaseUser.getCurrent();
          $alert({
            content: 'You have successfully linked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

    $scope.unlink = function(provider) {
      console.log(provider);
      BaseUser.unlink({
          id: $scope.user.id,
          provider: provider
        })
        .$promise
        .then(function() {
          $scope.user[provider] = undefined;
          $alert({
            content: 'You have successfully unlinked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          $alert({
            content: response.data ? response.data.message : 'Could not unlink ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

  })
  .directive('partSettingsAccounts', function () { 
    return {
      restrict: 'E',
      templateUrl: '/elements/page-settings/part-settings-accounts.html',
      controller: 'PageSettingsCtrl',
      replace: true
    };
  })
  .directive('partSettingsEmail', function () { 
    return {
      restrict: 'E',
      templateUrl: '/elements/page-settings/part-settings-email.html',
      controller: 'PageSettingsCtrl',
      replace: true
    };
  })
  .directive('partSettingsNotifications', function () { 
    return {
      restrict: 'E',
      templateUrl: '/elements/page-settings/part-settings-notifications.html',
      controller: 'PageSettingsCtrl',
      replace: true
    };
  })
  .directive('partSettingsPassword', function () { 
    return {
      restrict: 'E',
      templateUrl: '/elements/page-settings/part-settings-password.html',
      controller: 'PageSettingsCtrl',
      replace: true
    };
  })
  .directive('partSettingsProfile', function () { 
    return {
      restrict: 'E',
      templateUrl: '/elements/page-settings/part-settings-profile.html',
      controller: 'PageSettingsCtrl',
      replace: true
    };
  });