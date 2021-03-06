/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('produccionController', function ($scope, $http, $cookieStore) {
    "use strict";
    $scope.isadmin = false;
    $scope.vlinea1 = true;
    $scope.vlinea2 = true;
    $scope.vlinea3 = true;
    $scope.vweekend = true;
    $scope.arraton="Haz click en OF para refrescar datos.";
    $scope.estadofabricacion="";
    $scope.mostrarganttgrid = 1;
    if ( $cookieStore.get('gitekplanificacion') === "1" ) {
        $scope.isadmin = true;
    }

    $scope.datepickers = {
        dt: false,
        dtSecond: false
    };
    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.astea = ['0'];

    $scope.lortuastelehena = function (fetxa) {
        var egunzen = moment(fetxa, "YYYY/MM/DD").day();
        switch (egunzen) {
            case 0: // igandea
                return moment(fetxa, "YYYY/MM/DD").add('days', 1).format("YYYY/MM/DD");
            case 1: // astelehena
                return fetxa;
            case 2: // asteartea
                return moment(fetxa, "YYYY/MM/DD").subtract('days', 1).format("YYYY/MM/DD");
            case 3: // asteazkena
                return moment(fetxa, "YYYY/MM/DD").subtract('days', 2).format("YYYY/MM/DD");
            case 4: // osteguna
                return moment(fetxa, "YYYY/MM/DD").subtract('days', 3).format("YYYY/MM/DD");
            case 5: // Ostirala
                return moment(fetxa, "YYYY/MM/DD").subtract('days', 4).format("YYYY/MM/DD");
            case 6: // larunbata
                return moment(fetxa, "YYYY/MM/DD").subtract('days', 5).format("YYYY/MM/DD");
        }
    };

    var fetxa = $scope.lortuastelehena(moment().format("YYYY/MM/DD"));
    $scope.dt = fetxa;

    $scope.eratufetxak = function (fetxa) {
        $scope.eguna1 = moment(fetxa, 'YYYY/MM/DD').format("YYYY/MM/DD");
        $scope.eguna2 = moment(fetxa, 'YYYY/MM/DD').add('days', 1).format("YYYY/MM/DD");
        $scope.eguna3 = moment(fetxa, 'YYYY/MM/DD').add('days', 2).format("YYYY/MM/DD");
        $scope.eguna4 = moment(fetxa, 'YYYY/MM/DD').add('days', 3).format("YYYY/MM/DD");
        $scope.eguna5 = moment(fetxa, 'YYYY/MM/DD').add('days', 4).format("YYYY/MM/DD");
        $scope.eguna6 = moment(fetxa, 'YYYY/MM/DD').add('days', 5).format("YYYY/MM/DD");
        $scope.eguna7 = moment(fetxa, 'YYYY/MM/DD').add('days', 6).format("YYYY/MM/DD");
        $scope.astea = moment(fetxa, 'YYYY/MM/DD').isoWeek();
        $scope.dt = $scope.eguna1;
        $scope.dtSecond = $scope.eguna7;
        $scope.$broadcast('eguneratuDatuak');
    };
    $scope.eratufetxak(fetxa);

    $scope.aldatuastea = function (z) {
        var mifec;
        var fetxaberria;
        if (z < 0) {
            z = z * -1;
            mifec = moment($scope.dt).format('YYYY/MM/DD');
            if (moment(mifec).isValid() === false) {
                mifec = moment($scope.dt, 'YYYY/MM/DD').format('YYYY/MM/DD');
            }
            fetxaberria = moment(mifec).subtract('days', z).format("YYYY/MM/DD");
        } else {
            mifec = moment($scope.dt).format('YYYY/MM/DD');
            if (moment(mifec).isValid() === false) {
                mifec = moment($scope.dt, 'YYYY/MM/DD');
            }
            fetxaberria = moment(mifec, 'YYYY/MM/DD').add('days', z).format("YYYY/MM/DD");
        }
        $scope.eratufetxak(fetxaberria);
    };

    $scope.nameFilter = null;

    $scope.checkStatus = function (fec, nireindex) {

        fec = moment(fec).format("YYYY/MM/DD");

        switch (nireindex) {
            case 0:
                if ($scope.eguna1 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 1:
                if ($scope.eguna2 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 2:
                if ($scope.eguna3 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 3:
                if ($scope.eguna4 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 4:
                if ($scope.eguna5 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 5:
                if ($scope.eguna6 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 6:
                if ($scope.eguna7 === fec) {
                    return true;
                } else {
                    return false;
                }
                break;
        }
        var nirefec = "eguna" + nireindex;
        var esanfec = $scope.nirefec;

    };

    $scope.today = function () {
        $scope.dt = moment($scope.dt).toDate();
        $scope.dtSecond = moment($scope.dtSecond).toDate();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = !$scope.showWeeks;
    };
    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };
    $scope.toggleMin = function () {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
    };

    $scope.selectDate = function (dt) {
        var fetxa = $scope.lortuastelehena(moment(dt).format("YYYY/MM/DD"));
        $scope.dt = fetxa;
        $scope.eratufetxak(fetxa);
    };

    $scope.hemanEguna = function (numeguna) {
        switch (numeguna) {
            case "0":
                return $scope.eguna1;
            case "1":
                return $scope.eguna2;
            case "2":
                return $scope.eguna3;
            case "3":
                return $scope.eguna4;
            case "4":
                return $scope.eguna5;
            case "5":
                return $scope.eguna6;
            case "6":
                return $scope.eguna7;
        }
    };

    $scope.getusers = function () {
        $http.get('/getsettings').success(function (data) {
            $scope.users = data;
        }).error(function () {
            alert("error al obtener datos");
        });
    };
    $scope.getusers();

    $scope.dologout = function() {
        // console.log("logout");
        if ( $scope.isadmin ) {
            $cookieStore.remove("gitekplanificacion");
        }
        window.location.href = "/";
    };
    $scope.koo = $cookieStore.get('gitekplanificacion');

    $scope.grafikoa = function(val) {
        if ( ( val === "" ) || ( val === undefined ) ) { return false; }
        var of="";
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");


        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            of = miarray[1];
        }


        var url = "/proxy/expertis/"+of.trim();

        $http.get(url,{cache:false})
            .success(function(data){

                if ( (data === "") || (data.length === 0) ) {
                    return false;
                }
                $scope.chartData = [
                    ['A fabricar', parseFloat(data.QFabricar)],
                    ['Fabricada',parseFloat(data.QFabricada)],
                    ['Iniciada', parseFloat(data.QIniciada)]
                ];
                $scope.chartConfig = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Graficos del Articulo: ' + data.IDArticulo + ' en la Orden: ' + data.NOrden
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Producción',
                        data: $scope.chartData
                    }]
                };
            })
            .error(function(data, status, headers, config) {
                // console.log(data);
            });
    };

    $scope.arraton = function(val) {
        if ( ( val === "" ) || ( val === undefined ) ) { return false; }
        var of="";
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        if (val === undefined) {
            return false;
        }
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            of = miarray[1];
        }
        if ( of === "" ) {
            return false;
        }
        var url = "/proxy/expertis/"+of.trim();
        $http.get(url)
            .success(function (data) {
                if ( (data === "") || (data.length === 0) ) {
                    return false;
                }
                $scope.cantafabricar = parseInt(data.QFabricar);
                $scope.cantiniciada = parseInt(data.QIniciada);
                $scope.cantfabricada = parseInt(data.QFabricada);
            })
            .error(function () {
                alert("error al obtener datos");
                return;
            });
    };

    $scope.whatClassIsIt= function(amaituta){
        if(amaituta === 1) {
            return "tatxatu";
        }
    };

    $scope.ordenatu = function(orden, cont) {
        // console.log(orden);
        // console.log(cont);

        var $data = {};
        $data._id = orden._id;
        $data.fetxa = orden.fetxa;
        // console.log(orden.fetxa);
        $data.linea = orden.linea;

        if ( (orden.orden !== undefined) && ( orden.orden !== "") && ( isNaN(orden.orden) !== true ) && ( orden.orden !== null )) {
            $data.orden = orden.orden + cont;
        } else {
            $data.orden = 0;
        }

        $http.put(
            '/ordenatu', $data
        ).success(function () {
                $scope.$broadcast ('eguneratudatuak');
            });
    };

    $scope.updateOrden = function (data, l) {

        var miid = l.$editable.attrs.miid;
        var d = {
            id: miid,
            orden: data
        };

        $http.post('/saveorden', d).success(function () {
            $scope.$broadcast ('eguneratu');
        });

    };

    $scope.updateHoras = function (data, l) {

        var miid = l.$editable.attrs.miid;
        var d = {
            id: miid,
            horas: data
        };

        $http.post('/savehoras', d).success(function () {
            $scope.$broadcast ('eguneratu');
        });

    };

    $scope.updateDenbora = function (data, l) {

        var miid = l.$editable.attrs.miid;
        var d = {
            id: miid,
            denbora: data
        };

        $http.post('/savedenbora', d).success(function () {
            $scope.$broadcast ('eguneratu');
        });

    };

    $scope.updateDenboraFin = function (data, l) {

        var miid = l.$editable.attrs.miid;
        var d = {
            id: miid,
            denborafin: data
        };

        $http.post('/savedenborafin', d).success(function () {
            $scope.$broadcast ('eguneratu');
        });

    };


    // $scope.ikusimakusi = function(linea,data) {
    //     switch(linea) {
    //         case 1:
    //             (($scope.vlinea1 === 0) ? 1:0)
    //             break;
    //         case 2:
    //             (($scope.vlinea2 === 0) ? 1:0)
    //             break;
    //         case 3:
    //             (($scope.vlinea3 === 0) ? 1:0)
    //             break;
    //     }
    // }

});