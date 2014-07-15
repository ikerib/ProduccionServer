var produccionApp = angular.module('produccionApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'colorpicker.module', 'xeditable', 'ngSanitize', 'ui.calendar', 'highcharts-ng', 'ngCookies']);

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

produccionApp.factory('eskuratudatuak', function ($http, $q){
    return {
        getNestedDataBetter: function (desde, hasta){
            var values = {name: 'misko', gender: 'male'};
             var log = [];
             
            return $q.all (
                $http.get('/planificacion/1/' + desde + '/' + hasta)
            )
            .then (function(results) {
                console.log("here!");

                angular.forEach(results.data, function(eguna) {
                    console.log("xie!");
                    if ( eguna.linea1.length > 0 ) {
                        // console.log(eguna);
                        angular.forEach(eguna.linea1, function(turno) {
                            // console.log(turno);
                            if ( turno.ordenes.length > 0 ) {
                                angular.forEach(turno.ordenes, function(orden) {
                                    var val = orden.ref;
                                    // console.log(val);
                                    if ( val != "" ) {
                                        var of="";
                                        val = val.replace("<BR>", "<br>");
                                        val = val.replace("<BR />", "<br>");
                                        val = val.replace("<br />", "<br>");
                                        if (val === undefined) {
                                            return false
                                        }
                                        var n = val.indexOf("<br>");
                                        if (n > 0) {
                                            var miarray = val.split('<br>');
                                            tof = miarray[1];
                                        }

                                        var url = "http://servsm02.grupogureak.local:5080/expertis/delaoferta?of="+ tof;
                                        return $q.all($http.get(url))
                                        .then(function(datuak){
                                            // console.log(datuak);
                                            console.log("not finish yet");
                                            for ( var k=0; k < datuak.length; k++ ) {
                                                if ( datuak[k].QPendiente < datuak[k].QNecesaria ) {
                                                    orden.badutstock = 1;
                                                } else {
                                                    orden.badutstock = 0;
                                                }

                                            }
                                            
                                        })
                                    } 
                                });
                                
                            }
                        });
                    }
                });
                console.log("finish!");
                return results.data;
            });
        }
    };
});

produccionApp.factory('eskuratudatuak2', function ($http, $q){
  return {
    getNestedDataBetter: function (desde, hasta){
      //create your deferred promise.
      var deferred = $q.defer();
      
      //do your thing.
      $http.get('/planificacion/1/' + desde + '/' + hasta)
        .then(function(result){
            console.log("orain");
          var parents = result.data;
          angular.forEach(parents, function(eguna) {

            if ( eguna.linea1.length > 0 ) {
                // console.log(eguna);
                angular.forEach(eguna.linea1, function(turno) {
                    // console.log(turno);
                    if ( turno.ordenes.length > 0 ) {
                        angular.forEach(turno.ordenes, function(orden) {
                            var val = orden.ref;
                            // console.log(val);
                            if ( val != "" ) {
                                var of="";
                                val = val.replace("<BR>", "<br>");
                                val = val.replace("<BR />", "<br>");
                                val = val.replace("<br />", "<br>");
                                if (val === undefined) {
                                    return false
                                }
                                var n = val.indexOf("<br>");
                                if (n > 0) {
                                    var miarray = val.split('<br>');
                                    tof = miarray[1];
                                }
                                
                                var url = "http://servsm02.grupogureak.local:5080/expertis/delaoferta?of="+ tof;
                                return $q.all($http.get(url))
                                .then(function(datuak){
                                    // console.log(datuak);
                                    console.log("ez da amaitu");
                                    for ( var k=0; k < datuak.length; k++ ) {
                                        if ( datuak[k].QPendiente < datuak[k].QNecesaria ) {
                                            orden.badutstock = 1;
                                        } else {
                                            orden.badutstock = 0;
                                        }

                                    }
                                    
                                })
                            } 
                        });
                        
                    }
                });
            }
          });
            console.log("amaitu da?");
            deferred.resolve(parents);
            console.log("finito");
      //return your promise to the user.
      
        });
        return deferred.promise;
        return $q.all([
        $http.get('items_part_1.json'),
          $http.get('items_part_2.json')
      ])
        
      //process all of the results from the two promises 
      // above, and join them together into a single result.
      // since then() returns a promise that resolves ot the
      // return value of it's callback, this is all we need 
      // to return from our service method.
      .then(function(results) {
        var data = [];
        angular.forEach(results, function(result) {
          data = data.concat(result.data);
        });
        return data;
      });
    }
  };
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

