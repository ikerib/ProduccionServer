/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('linea1Controller', function ($scope, $http, $resource, socket, usSpinnerService) {

    $scope.getDatuak = function () {
        usSpinnerService.spin('spinner-1');
        var dsd = moment($scope.dt).format('YYYY-MM-DD');
        var hst = moment($scope.dtSecond).format('YYYY-MM-DD');

        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna1 = data;
        }).error(function () { console.log("error al obtener datos");return;});

        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna2 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna3 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna4 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna5 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna6 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna7 = data;
        }).error(function () { console.log("error al obtener datos");return;});

    };
    $scope.getDatuak();

    socket.on('eguneratu', function (data) { // Listening in Socket in Angular Controller
        $scope.getDatuak();
    });

    $scope.updateUser = function (data, l) {

        var fetxa = l.$editable.attrs.fetxa + " 11:11:11";
        var miid = l.$editable.attrs.miid;
        var fetxaformatua = moment(fetxa, 'YYYY-MM-DD hh:mm:ss').toISOString();
        var d = {
            id: miid,
            linea: 1,
            fetxa: fetxaformatua,
            ref: data
        };

        if ( d.ref === "" ) {
            $http.post('/ezabatu', d).success(function () {
                $scope.getDatuak();
            });
        } else {
            $http.post('/saveplanificacion', d).success(function () {
                $scope.getDatuak();
            });
       }       

    };

    $scope.updateData = function () {

        for (var i = $scope.datuak.length; i--;) {
            var d = $scope.datuak[i];
            d.milinea = 1;
            $http.post('/saveplanificacion', d);
        }

    };

    $scope.updateDataById = function (miid) {

        var milen = $scope.datuak.length;

        for (var i = 0; i < milen; i++) {

            var d = $scope.datuak[i];

            if (d[0].id === miid) {
                d.milinea = 1;
                $http.post('/saveplanificacion', d[0]);
            }

        }
    };

    $scope.addData = function (midata, l) {
        var miid = l.$editable.attrs.miid;
        // id ez badauka, insert
        if (( miid === "" ) || ( miid === undefined )) {
            $scope.sartu(midata, l);
            return 0;
        } else {
            var d = {
                fetxa: moment(l.$editable.attrs.fetxa, "YYYY-MM-DD").toISOString(),
                linea: 1,
                ref: midata
            }
            $http.post('/saveplanificacion', d);
        }
    };

    $scope.sartu = function (midata, l) {
        var fetxa = l.$editable.attrs.fetxa + " 11:11:11";
        var milinea = 1;
        var fetxaformatua = moment(fetxa, 'YYYY-MM-DD hh:mm:ss').toISOString();
        var d = {
            linea: 1,
            fetxa: fetxaformatua,
            ref: midata
        };


        $http.post('/sartu', d).success(function () {
            $scope.getDatuak();
        });

    };

    $scope.$on('eguneratuDatuak', function (e) {
        $scope.getDatuak();
    });

    $scope.set_color = function (kolorea) {
        return { color: kolorea }
    }

    $scope.onDragComplete = function(data, evt){
       // console.log("drag success, data:", data);
    }

    $scope.onDropComplete = function(index, data, evt){
        console.log(data);
        console.log(index);
        
    }
    
});