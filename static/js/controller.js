var produccionApp = angular.module('produccionApp', ['ngRoute', 'ui.bootstrap', 'colorpicker.module', 'xeditable', 'ngSanitize']);

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
});

produccionApp.factory('socket', function () {
    var socket = io.connect('http://192.168.1.1:8081');
    // var socket = io.connect('http://localhost:8081');
    return socket;
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

produccionApp.controller('produccionController', function ($scope, $http) {

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

});

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
});

produccionApp.controller('linea2Controller', function ($scope, $http, socket) {

    $scope.getDatuak = function () {
        $http.get('/planificacion/2/' + moment($scope.dt).format('YYYY-MM-DD') + '/' + moment($scope.dtSecond).format('YYYY-MM-DD')).success(function (data) {
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
                d.milinea = 2;
                $http.post('/saveplanificacion', d);
            }

        }

//        return results;
    };

    $scope.updateData = function () {

        for (var i = $scope.datuak.length; i--;) {
            var d = $scope.datuak[i];
            d.milinea = 2;
            $http.post('/saveplanificacion', d);
        }

    };

    $scope.updateDataById = function (miid) {
        for (var i = $scope.datuak.length; i--;) {

            var d = $scope.datuak[i];

            if (d._id === miid) {
                d.milinea = 2;
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

        for (i = 0; i < $scope.datuak.length; i++) {
            var temp = $scope.datuak[i];
            if ((temp._id === miid)) {
                eguneratuSartu = true;

                if (milinea == "2") {
                    var aurkitua = false;
                    for (var k = 0; k < temp.linea2.length; k++) {

                        var t = temp.linea2[k];

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
                        temp.linea2.push({
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
                linea: 2,
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
            linea: 2,
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

produccionApp.controller('settingController', function ($scope, $http, socket) {

    $scope.getusers = function () {
        $http.get('/getsettings').success(function (data) {
            $scope.users = data;
        }).error(function () {
            console.log("error al obtener datos");
            return;
        });
    };
    $scope.getusers();

    socket.on('eguneratu', function (data) { // Listening in Socket in Angular Controller
        $scope.getusers();
    });

    // filter users to show
    $scope.filterUser = function (user) {
        return user.isDeleted !== true;
    };

    // mark user as deleted
    $scope.deleteUser = function (id) {
        var filtered = $filter('filter')($scope.users, {id: id});
        if (filtered.length) {
            filtered[0].isDeleted = true;
        }
    };

    // add user
    $scope.addUser = function () {
        $scope.users.push({
            id: $scope.users.length + 1,
            ref: '',
            backcolor: "#000000",
            forecolor: "#ffffff"
        });
    };

    // cancel all changes
    $scope.cancel = function () {
        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // undelete
            if (user.isDeleted) {
                delete user.isDeleted;
            }
            // remove new
            if (user.isNew) {
                $scope.users.splice(i, 1);
            }
        }
        ;
    };

    // save edits
    $scope.saveTable = function () {

        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // actually delete user
            if (user.isDeleted) {
                $scope.users.splice(i, 1);
            }

            if (user.backcolor === null) {
                user.backcolor = "#000000";
            }
            if (user.forecolor === null) {
                user.forecolor = "#ffffff";
            }


            if (user._id) {
                $http.post('/updatesetting', user);
            } else {
                $http.post('/insertsetting', user);
            }
            $scope.getusers();
        }

    };
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
        var n = val.indexOf("#");
        if (n > 0) {
            var miarray = val.split('#');
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
        var n = val.indexOf("#");
        if (n > 0) {
            var miarray = val.split('#');
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