'use strict';

/**
 * @ngdoc directive
 * @name psJwtApp.directive:sameAs
 * @description
 * # sameAs
 */
angular.module('psJwtApp')
  .directive('validateEquals', function () {
    return {
      require: "ngModel",
      restrict: 'A',
      link: function(scope, elem, attr, ctrl){

        function validateEqual(value){
          var valid = (value === scope.$eval(attr.validateEquals));
          ctrl.$setValidity('equal', valid);
          return valid ? value : undefined;
        }

        ctrl.$parsers.push(validateEqual);

        ctrl.$formatters.push(validateEqual);

        scope.$watch(attr.validateEquals, function(){
          ctrl.$setViewValue(ctrl.$viewValue);
        });

      }
    };
  });
