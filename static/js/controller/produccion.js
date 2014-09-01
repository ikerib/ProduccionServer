/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('produccionController', function ($scope, $http, $cookieStore) {

    $scope.isadmin = false;
    $scope.arraton="Haz click en OF para refrescar datos.";
    if ( $cookieStore.get('gitekplanificacion') === "1" ) {
        $scope.isadmin = true;
    }

    $scope.datepickers = {
        dt: false,
        dtSecond: false
    }
    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.astea = ['0'];

    $scope.lortuastelehena = function (fetxa) {
        egunzen = moment(fetxa, "YYYY/MM/DD").day();
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
        if (z < 0) {
            z = z * -1;
            var mifec = moment($scope.dt).format('YYYY/MM/DD');
            if (moment(mifec).isValid() == false) {
                mifec = moment($scope.dt, 'YYYY/MM/DD').format('YYYY/MM/DD');
            }
            var fetxaberria = moment(mifec).subtract('days', z).format("YYYY/MM/DD");
        } else {
            var mifec = moment($scope.dt).format('YYYY/MM/DD');
            if (moment(mifec).isValid() == false) {
                mifec = moment($scope.dt, 'YYYY/MM/DD');
            }
            var fetxaberria = moment(mifec, 'YYYY/MM/DD').add('days', z).format("YYYY/MM/DD");
        }
        $scope.eratufetxak(fetxaberria);
    }

    $scope.nameFilter = null;

    $scope.checkStatus = function (fec, nireindex) {

        fec = moment(fec).format("YYYY/MM/DD");

        switch (nireindex) {
            case 0:
                if ($scope.eguna1 == fec) {
                    return true;
                } else {
                    return false;
                }
            case 1:
                if ($scope.eguna2 == fec) {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if ($scope.eguna3 == fec) {
                    return true;
                } else {
                    return false;
                }
            case 3:
                if ($scope.eguna4 == fec) {
                    return true;
                } else {
                    return false;
                }
            case 4:
                if ($scope.eguna5 == fec) {
                    return true;
                } else {
                    return false;
                }
            case 5:
                if ($scope.eguna6 == fec) {
                    return true;
                } else {
                    return false;
                }
            case 6:
                if ($scope.eguna7 == fec) {
                    return true;
                } else {
                    return false;
                }
        }
        var nirefec = "eguna" + nireindex;
        var esanfec = $scope.nirefec;

    };

    $scope.today = function () {
        // $scope.dt = new Date();
        $scope.dt = moment($scope.dt).toDate();
        // $scope.dtSecond = new Date();
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
        console.log(dt);
        var fetxa = $scope.lortuastelehena(moment(dt).format("YYYY/MM/DD"));
        $scope.dt = fetxa;
        $scope.eratufetxak(fetxa);
    }

    $scope.hemanEguna = function (numeguna) {
        switch (numeguna) {
            case "0":
                return $scope.eguna1;
                break;
            case "1":
                return $scope.eguna2;
                break;
            case "2":
                return $scope.eguna3;
                break;
            case "3":
                return $scope.eguna4;
                break;
            case "4":
                return $scope.eguna5;
                break;
            case "5":
                return $scope.eguna6;
                break;
            case "6":
                return $scope.eguna7;
                break;
        }
    };

    $scope.getusers = function () {
        $http.get('/getsettings').success(function (data) {
            $scope.users = data;
        }).error(function () {
            console.log("error al obtener datos");
            return;
        });
    };
    $scope.getusers();

    $scope.dologout = function() {
        console.log("logout");
        if ( $scope.isadmin ) {
            $cookieStore.remove("gitekplanificacion");
        }
        window.location.href = "/";
    }
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


        var url = "http://servsm02.grupogureak.local:5080/expertis/delaoferta?of="+of.trim();

        $http.get(url,{cache:false})
        .success(function(data){

            if ( (data === "") || (data.length === 0) ) {
                return false;
            }
            $scope.chartData = [
                ['A fabricar', parseFloat(data[0].QFabricar)], 
                ['Fabricada',parseFloat(data[0].QFabricada)],
                ['Iniciada', parseFloat(data[0].QIniciada)]
            ];
            $scope.chartConfig = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Graficos del Articulo: ' + data[0].IDArticulo + ' en la Orden: ' + data[0].NOrden
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
            }
        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });
    }

    $scope.arraton = function(val) {
        if ( ( val === "" ) || ( val === undefined ) ) { return false; }
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
            of = miarray[1];
        }
        if ( of === "" ) {
            return false;
        }
        var url = "http://servsm02.grupogureak.local:5080/expertis/delaoferta?of="+of.trim();
        $http.get(url)
        .success(function (data) {
            if ( (data === "") || (data.length === 0) ) {
                return false;
            }
            $scope.arratontooltip = "A Frabricar: " + parseInt(data[0].QFabricar) 
                            + "<br />Iniciada: " + parseInt(data[0].QIniciada) 
                            + "<br />Fabricada: " + parseInt(data[0].QFabricada);
        })
        .error(function () {
            console.log("error al obtener datos");
            return;
        });
    }


});