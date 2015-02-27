'use strict';

/**
 * @ngdoc function
 * @name psJwtApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the psJwtApp
 */
angular.module('psJwtApp')
  .controller('LogoutCtrl', function ($scope, authToken, $state) {
    authToken.removeToken();
    $state.go('main');
  });
