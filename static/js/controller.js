var produccionApp = angular.module('produccionApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'colorpicker.module', 'xeditable', 'ngSanitize', 'ui.calendar', 'highcharts-ng', 'ngCookies','angularSpinner']);

produccionApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'produccionController'
        })

        // route for the about page
        .when('/setting', {
            templateUrl: 'pages/setting.html',
            controller: 'settingController'
        })

        .when('/egutegia', {
            templateUrl:'pages/egutegia.html',
            controller:'egutegiaController'
        })

        .when('/login', {
            templateUrl:'pages/login.html',
            controller:'loginController'
        })

        .when('/logout', {
            controller:'logoutController'
        })
});

produccionApp.factory('socket', function () {
    var socket = io.connect('http://192.168.1.1:8081');
    // var socket = io.connect('http://localhost:8081');
    return socket;
});

produccionApp.directive('autoActive', ['$location', function ($location) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element) {
            function setActive() {
                var path = $location.path();
                if (path) {
                    angular.forEach(element.find('li'), function (li) {
                        var anchor = li.querySelector('a');
                        if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                            angular.element(li).addClass('active');
                        } else {
                            angular.element(li).removeClass('active');
                        }
                    });
                }
            }

            setActive();

            scope.$on('$locationChangeSuccess', setActive);
        }
    }
}]);

produccionApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

produccionApp.filter('searchBy', function () {
    return function (array, prop, val) {
        // filter has polyfills for older browsers. Check underscore.js if needed
        return array.filter(function (row) {
            return row[prop] == val;
        })[0];
        // this returns an array. You can pick the first element with [0]
    }
});

produccionApp.filter('searchByRefBackcolor', function () {

    return function (array, prop, val) {
        // miramos si tiene almohadilla
        if (val === undefined) {
            return false
        }
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            val = miarray[0];
        }
        var kk = array.filter(function (row) {
            return row[prop] == val;
        });

        if (kk.length > 0) {
            return kk[0].backcolor;
        }

        return  null;
    }
});

produccionApp.filter('searchByRefForecolor', function () {

    return function (array, prop, val) {
        // miramos si tiene almohadilla
        if (val === undefined) {
            return false
        }
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            val = miarray[0];
        }

        var kk = array.filter(function (row) {
            return row[prop] == val;
        });

        if (kk.length > 0) {
            return kk[0].forecolor;
        }

        return  null;
    }
});

produccionApp.filter('formatText', function (){
    return function(input) {
        if(!input) return input;

        var output = input
            //replace possible line breaks.
            .replace(/(\r\n|\r|\n)/g, '<br/>')
            .replace('\#','<br/>')
            //replace tabs
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
            //replace spaces.
            .replace(/ /g, '&nbsp;');

        return output;
    };
});

