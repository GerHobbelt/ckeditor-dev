'use strict';

angular.module('angular-adapter', []).run(['$rootScope', '$timeout', function($rootScope, $timeout) {

  CKEDITOR.notifyAngular = function(event, params) {
    $timeout(function() {
      $rootScope.$broadcast(event, params);
    });
  };
}]);

