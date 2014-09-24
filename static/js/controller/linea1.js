/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('linea1Controller', function ($scope, $http, $resource, socket, usSpinnerService) {
    $scope.sortableOptions = {
        update: function(e, ui) { 
            console.log("update");
            console.log(e);
            console.log(ui);
        },
        axis: 'x'
    };
    $scope.getDatuak = function () {
        usSpinnerService.spin('spinner-1');
        var dsd = moment($scope.dt).format('YYYY-MM-DD');
        var hst = moment($scope.dtSecond).format('YYYY-MM-DD');

        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna1 = data;
        }).error(function () { 
            $scope.asteeguna1="";
        });

        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna2 = data;
        }).error(function () { 
            $scope.asteeguna2 = "";
        });
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna3 = data;
        }).error(function () { 
            $scope.asteeguna3 = "";
        });
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna4 = data;
        }).error(function () { 
            $scope.asteeguna4 = "";
        });
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna5 = data;
        }).error(function () { 
            $scope.asteeguna5 = "";
        });
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna6 = data;
        }).error(function () { 
            $scope.asteeguna6 = "";
        });
        
        dsd = moment(dsd).add('days', 1).format('YYYY-MM-DD');
        $http.get('/planificacionlinea1/' + dsd + '/' + hst).success(function (data) {
            $scope.asteeguna7 = data;
        }).error(function () { 
            $scope.asteeguna7 = "";
            usSpinnerService.stop('spinner-1');
        });
    };
    $scope.getDatuak();

    $scope.$on('eguneratudatuak', function(e) {  
        $scope.getDatuak();      
    });

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

    $scope.onDrop = function($event,$data, linea,eguna){
        $data.id = $data._id;
        $data.lineaberria = linea;
        $data.egunaberria = eguna;
        $http({
            url: '/ezabatu',
            method: "POST",
            data: $data,
            headers: {'Content-Type': 'application/json'}
        })
        .success(function (data, status, headers, config) {
            console.log("success");
            var midata = config.data.ref;
            var fetxa = config.data.egunaberria + " 11:11:11";
            var milinea = config.data.lineaberria;
            var fetxaformatua = moment(fetxa, 'YYYY-MM-DD hh:mm:ss').toISOString();
            var d = {
                linea: milinea,
                fetxa: fetxaformatua,
                ref: midata
            };

            $http.post('/sartu', d).success(function () {
                console.log("baiiiiii");
                $scope.getDatuak();
            
            });
        }).error(function (data, status, headers, config) {
            alert("tssssss!!");
        });
    };
    
});