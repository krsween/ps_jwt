'use strict';

/**
 * @ngdoc service
 * @name psJwtApp.auth
 * @description
 * # auth
 * Service in the psJwtApp.
 */
angular.module('psJwtApp')
  .service('auth', function auth(API_URL, $http, authToken, $state, $window, $q) {

    function authSuccess(res){
      authToken.setToken(res.token);
      $state.go('main');
    }



    return {
      login: function(email, password){
        return $http.post(API_URL+ 'login', { "email": email, "password": password }).success(authSuccess);
      },
      register: function(email, password){
        return $http.post(API_URL+ 'register', { "email": email, "password": password }).success(authSuccess);
      },
      googleAuth: function(){

        var urlBuilder = [];

        urlBuilder.push(
          'response_type=token',
          'client_id=358839370710-mmafp65tfe44l1if4f4oumj5jv13bef6.apps.googleusercontent.com',
          'redirect_uri=' + $window.location.origin,
          'scope=profile email');

        var url = 'https://accounts.google.com/o/oauth2/auth?' + urlBuilder.join('&'),
            options = "width=500, height=500, left=" + ($window.outerWidth-500)/2 + ", top=" + ($window.outerHeight-500)/2.5;

        var deferred = $q.defer();

        $window.open(url, ' ', options);
        $window.focus();

        $window.addEventListener('message', function (event) {
          if (event.origin === $window.location.origin) {
            var code = event.data;
            popup.close();

            $http.post(API_URL + 'auth/google', {
              code: code,
              clientId: clientId,
              redirectUri: $window.location.origin
            }).success(function (jwt) {
              authSuccessful(jwt);
              deferred.resolve(jwt);
            });
          }
        });

        return deferred.promise;
      }
    }

  });
