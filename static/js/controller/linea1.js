/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('linea1Controller', function ($scope, $http, socket) {

    $scope.getDatuak = function () {
        $http.get('/planificacion/1/' + moment($scope.dt).format('YYYY-MM-DD') + '/' + moment($scope.dtSecond).format('YYYY-MM-DD')).success(function (data) {
            $scope.datuak = data;
        }).error(function () {
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

    $scope.arraton = function(of) {
        var miof="";
        var n = of.indexOf("$");
        if (n > 0) {
            var miarray = of.split('$');
            miof = miarray[1];

            var miurl = '/expertis/orden/' + miof;

            $http.get(miurl).success(function (data) {
                $scope.arraton = "A Frabricar: " + data[0].QFabricar + " // Iniciada: " + data[0].QIniciada + " // Fabricada: " + data[0].QFabricada;
            }).error(function () {
                console.log("error al obtener datos");
                return;
            });
        }
    }

    $scope.grafikoa = function() {

        $scope.$parent.chartData = [['A fabricar', 670], ['Fabricado',454]];

        $scope.$parent.chartConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Graficos de la OF'
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

    }

});