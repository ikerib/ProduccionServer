/**
 * Created by ikerib on 01/07/14.
 */
"use strict";
produccionApp.controller('logoutController', function ($scope, $cookieStore) {

	if ( $scope.isadmin ) {
		$cookieStore.put('gitekplanificacion','0');
	}
	window.location.href = "/";

});