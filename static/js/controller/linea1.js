/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('linea1Controller', function ($scope, $http, $resource, socket, usSpinnerService) {

    $scope.getDatuak = function () {
        usSpinnerService.spin('spinner-1');
        $http.get('/planificacionlinea1/' + moment($scope.dt).format('YYYY-MM-DD') + '/' + moment($scope.dtSecond).format('YYYY-MM-DD'))
        .success(function (data) {
            $scope.datuak = data;
            // usSpinnerService.stop('spinner-1');
        })
        .error(function () {
            console.log("error al obtener datos");
            return;
        });
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
                if (temp.ordenes.length > 0) {
                    temp.ordenes.push({
                        ref: midata
                    });
                }
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



    
});