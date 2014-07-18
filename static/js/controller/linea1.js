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
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna2 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna3 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna4 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna5 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna6 = data;
        }).error(function () { console.log("error al obtener datos");return;});
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna7 = data;
        }).error(function () { console.log("error al obtener datos");return;});

    };
    $scope.getDatuak();

    socket.on('eguneratu', function (data) { // Listening in Socket in Angular Controller
        $scope.getDatuak();
    });

    $scope.updateUser = function (data, l) {

        var miid = l.$editable.attrs.miid;

        for (var i = $scope.datuak.length; i--;) {

            var d = $scope.datuak[i][0];

            if (d.id === miid) {
                d.milinea = 1;
                $http.post('/saveplanificacion', d);
            }

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
        if (miid === "") {
            $scope.sartu(midata, l);
            return 0;
        }

        var milinea = l.$editable.attrs.linea;
        var fetxa = moment(l.$editable.attrs.fetxa, "YYYY-MM-DD").toISOString();
        var miturno = l.$editable.attrs.turno;
        var aurkitua = false;

        for (var i = 0; i < $scope.datuak.length; i++) {
            var temp = $scope.datuak[i][0];
            if ((temp.id === miid)) {
                aurkitua = true;
                temp.ordenes.push({
                    ref: midata,
                    orden:temp.ordenes.length
                });
                
            } 
        }

        if (aurkitua == true) {
            $scope.updateDataById(miid);
        }

    };

    $scope.sartu = function (midata, l) {
        var fetxa = l.$editable.attrs.fetxa + " 11:11:11";
        var milinea = l.$editable.attrs.miid;
        if (milinea === "") {
            milinea = l.$editable.attrs.linea;
        }


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
       data.remove();
    }

    $scope.onDropComplete = function(index, data, evt){
        console.log(data);
        console.log(index);
        
    }
    
});