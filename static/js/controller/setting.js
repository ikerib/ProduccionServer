/**
 * Created by ikerib on 30/06/14.
 */

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