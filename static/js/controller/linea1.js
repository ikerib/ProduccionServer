/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('linea1Controller', function ($scope, $http, $resource, socket, eskuratudatuak) {

    $scope.getDatuak = function () {

        // $scope.datuak = eskuratudatuak.getNestedDataBetter(moment($scope.dt).format('YYYY-MM-DD'),moment($scope.dtSecond).format('YYYY-MM-DD'));
        
        $scope.datuak =eskuratudatuak.getNestedDataBetter(moment($scope.dt).format('YYYY-MM-DD'),moment($scope.dtSecond).format('YYYY-MM-DD'))
        // .success (function(data) {
        //     $scope.datuak = data;
        //     console.log("hau da:");
        //     console.log(data);
        // })

        
        // $http.get('/planificacion/1/' + moment($scope.dt).format('YYYY-MM-DD') + '/' + moment($scope.dtSecond).format('YYYY-MM-DD'))
        // .success(function (data) {
            
            
        //     for ( var q=0; q < data.length; q++ ) {
        //         if ( data[q].linea1.length > 0 ) {
        //             for ( var w=0; w < data[q].linea1.length; w++ ) {

        //                 for ( var e=0; e < data[q].linea1[w].ordenes.length; e++) {
        //                     var miorden = data[q].linea1[w].ordenes[e];
        //                     var val = data[q].linea1[w].ordenes[e].ref;
        //                     if ( val === "") { break; }
        //                     var of="";
        //                     val = val.replace("<BR>", "<br>");
        //                     val = val.replace("<BR />", "<br>");
        //                     val = val.replace("<br />", "<br>");
        //                     if (val === undefined) {
        //                         return false
        //                     }
        //                     var n = val.indexOf("<br>");
        //                     if (n > 0) {
        //                         var miarray = val.split('<br>');
        //                         tof = miarray[1];
        //                     }
                            
        //                     var url = "http://servsm02.grupogureak.local:5080/expertis/delaoferta?of="+ tof;
        //                     $http.get(url,{cache:false})
        //                     .success(function(datuak){

        //                         for ( var k=0; k < datuak.length; k++ ) {
        //                             if ( datuak[k].QPendiente < datuak[k].QNecesaria ) {
        //                                 miorden.badutstock = 1;
        //                             } else {
        //                                 miorden.badutstock = 0;
        //                             }

        //                         }

        //                     })
        //                     .error(function(data, status, headers, config) {
        //                         console.log(data);
        //                     });

        //                 }    
        //             }                    
        //         }
        //     } 

        //     $scope.datuak = data;
        //     console.log(data);

        // }).error(function () {
        //     console.log("error al obtener datos");
        //     return;
        // });
    };
    $scope.getDatuak();

    socket.on('eguneratu', function (data) { // Listening in Socket in Angular Controller
        $scope.getDatuak();
    });

    $scope.updateUser = function (data, l) {

        var miid = l.$editable.attrs.miid;

        for (var i = $scope.datuak.length; i--;) {

            var d = $scope.datuak[i];

            if (d._id === miid) {
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

        for (var i = $scope.datuak.length; i--;) {

            var d = $scope.datuak[i];

            if (d._id === miid) {
                d.milinea = 1;
                $http.post('/saveplanificacion', d);
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
        var turno = l.$editable.attrs.turno;
        var fetxa = moment(l.$editable.attrs.fetxa, "YYYY-MM-DD").toISOString();
        var miturno = l.$editable.attrs.turno;

        var eguneratuSartu = false;

        for (var i = 0; i < $scope.datuak.length; i++) {
            var temp = $scope.datuak[i];
            if ((temp._id === miid)) {
                eguneratuSartu = true;

                if (milinea == "1") {
                    var aurkitua = false;
                    for (var k = 0; k < temp.linea1.length; k++) {

                        var t = temp.linea1[k];

                        if (t.turno === parseInt(miturno)) {
                            aurkitua = true;
                            if (t.ordenes.length > 0) {
                                t.ordenes.push({
                                    ref: midata
                                });
                            }
                        }

                    }
                    if (aurkitua == false) {
                        temp.linea1.push({
                            turno: parseInt(miturno),
                            ordenes: [
                                {
                                    ref: midata
                                }
                            ]
                        });

                    }
                } else {

                }
            }
        }

        if (eguneratuSartu == false) {

            var d = {
                linea: 1,
                fetxa: fetxa,
                turno: parseInt(miturno),
                ref: midata
            };

            $http.post('/sartu', d).success(function () {
                $scope.getDatuak();
            });

        } else {
            $scope.updateDataById(miid);
        }

    };

    $scope.sartu = function (midata, l) {
        var fetxa = l.$editable.attrs.fetxa;
        var miturno = l.$editable.attrs.turno;
        var milinea = l.$editable.attrs.miid;
        if (milinea === "") {
            milinea = l.$editable.attrs.linea;
        }

        var d = {
            linea: 1,
            fetxa: moment(fetxa, "YYYY-MM-DD").toISOString(),
            turno: parseInt(miturno),
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