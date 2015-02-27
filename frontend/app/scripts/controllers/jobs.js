'use strict';

/**
 * @ngdoc function
 * @name psJwtApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the psJwtApp
 */
angular.module('psJwtApp')
  .controller('JobsCtrl', function ($scope, API_URL, $http, alert) {

    $http.get(API_URL+'jobs')
      .success(function(res){
        $scope.jobs = res;
      })
      .error(function(err){
        alert('danger', 'Unable to get jobs', err.message);
      });




  });
