/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('ganttController', function ($scope, $http, socket, $cookieStore) {
  // $scope.niregantt = {
  //   data:
  //   [
  //     {
  //       id:1,
  //       text:"Project #2",
  //       start_date:"01-04-2013",
  //       duration:18,
  //       order:10,
  //       progress:0.4,
  //       open: true
  //     },
  //     {
  //       id:2,
  //       text:"Task #1",
  //       start_date:"02-04-2013",
  //       duration:8,
  //       order:10,
  //       progress:0.6,
  //       parent:1
  //     },
  //     {
  //       id:3,
  //       text:"Task #2",
  //       start_date:"11-04-2013",
  //       duration:8,
  //       order:20,
  //       progress:0.6,
  //       parent:1
  //     }
  //   ]
  //   ,
  //   links:
  //   [
  //     { id:1, source:1, target:2, type:"1"},
  //     { id:2, source:2, target:3, type:"0"},
  //     { id:3, source:3, target:4, type:"0"},
  //     { id:4, source:2, target:5, type:"2"},
  //   ]
  // };

  $scope.gantdatuak={ data: [] };
  $scope.niregantt = function () {
      //usSpinnerService.spin('spinner-1');
      var dsd = moment($scope.dt).format('YYYY-MM-DD');
      var hst = moment($scope.dtSecond).format('YYYY-MM-DD');

      $http.get('/api/getgantt/' + dsd ).success(function (data) {
          $scope.gantdatuak = data;
          console.log(data);
          return data;
      }).error(function () {
          console.log("Hau dek akatsa hau!");
          // $scope.gantdatuak={ data: [] };
          return { data: [] };
      });
  };
  $scope.niregantt();

});