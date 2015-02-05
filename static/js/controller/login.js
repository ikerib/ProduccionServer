/**
 * Created by ikerib on 01/07/14.
 */
"use strict";
produccionApp.controller('loginController', function ($scope, $cookieStore) {

    $scope.mipass='';
    $scope.iserror=false;

    $scope.dologin = function($cookies) {

        console.log($scope.mipass);

        if ( $scope.mipass === 'gitek' ) {
            $cookieStore.put('gitekplanificacion','1');
            window.location.href = "/";
        } else {
            $scope.iserror=true;
        }

    };

});