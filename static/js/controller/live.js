/**
 * Created by ikerib on 11/02/2015
 */

produccionApp.controller('liveController', function ($scope, $http, socket, $cookieStore, myOFs, $interval) {

    var today = moment().format('MM-DD-YYYY');

    myOFs.getOFs().then(function(d) {
        var log = [];
        angular.forEach(d, function(value, key) {
            value.completado = 0;
        }, log);
        $scope.lOFs = d;
    });

    var timer=$interval(function(){

        angular.forEach($scope.lOFs, function(value, key){
            console.log(value);
            var val = value.ref;

            var of="";
            val = val.replace("<BR>", " <br> ").replace("<BR />", " <br> ").replace("<br />", " <br> ");
            if (val === undefined) { return false }
            var n = val.indexOf("<br>");
            if (n > 0) {
                var miarray = val.split('<br>');
                tof = miarray[1];
                console.log("TOF: " + tof);

                myOFs.getProgress(tof).then(function(d) {
                    console.log("-------");
                    console.log(d);
                    console.log("-------");
                    value.orden = miarray[0];
                    value.of = miarray[1];
                    value.QFabricar = parseFloat(d.QFabricar);
                    value.QFabricada = parseFloat(d.QFabricada);

                    value.progress = parseFloat(d.QFabricada) * 100 / parseFloat(d.QFabricar);
                    console.log("**********");
                    console.log(value);
                    console.log("**********");
                });
                // console.log(prog.data);
                // console.log("PROGRESS: " + val.progress);
            }
        });

      },10000);

      $scope.killtimer=function(){
        if(angular.isDefined(timer))
          {
            $interval.cancel(timer);
            timer=undefined;
          }
      };

});

produccionApp.factory('myOFs', function($http) {
   return {
        getOFs: function() {
             //return the promise directly.
             return $http.get('/api/getofs')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        });
        },
        getProgress: function(of) {
            //return the promise directly.
            console.log("Kaixooooo");

                console.log(of);
                return $http({
                    method: 'GET',
                    url: '/proxy/expertis/' +of,
                }).then(function(result) {
                    //resolve the promise as the data
                    return result.data;
                });


                // $http.get('/proxy/expertis/:of')
                //        .then(function(result) {
                //             //resolve the promise as the data
                //             return result.data;
                //         });
        }
   }
});

