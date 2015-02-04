/**
 * Created by ikerib on 30/06/14.
 */

produccionApp.controller('ganttController', function ($scope, $http, socket, $cookieStore) {

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

  $scope.originalscale = function() {
      gantt.config.duration_unit = "hour";//an hour
      gantt.config.duration_step = 1;
      gantt.config.details_on_create = true;
      gantt.config.subscales = [
            {unit:"week", step:1, date:"Week #%W"},
            {unit:"hour", step:2, date:"%H"}
          ];
      gantt.ignore_time = null;
      gantt.config.scale_height = 74;
      gantt.render();
  }

  $scope.dayscale = function() {
    gantt.config.scale_unit = "day";
    gantt.config.step = 1;
    gantt.config.date_scale = "%d %M";
    gantt.config.subscales = [];
    gantt.config.scale_height = 27;
    gantt.templates.date_scale = null;
    gantt.render();
  }

  $scope.weekscale = function() {
    var weekScaleTemplate = function(date){
      var dateToStr = gantt.date.date_to_str("%d %M");
      var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
      return dateToStr(date) + " - " + dateToStr(endDate);
    };

    gantt.config.scale_unit = "week";
    gantt.config.step = 1;
    gantt.templates.date_scale = weekScaleTemplate;
    gantt.config.subscales = [
      {unit:"day", step:1, date:"%D" }
    ];
    gantt.config.scale_height = 50;
    gantt.render();
  }

  $scope.monthscale = function(){
    gantt.config.scale_unit = "month";
    gantt.config.date_scale = "%F, %Y";
    gantt.config.subscales = [
        {unit:"day", step:1, date:"%j, %D" }
    ];
    gantt.config.scale_height = 50;
    gantt.templates.date_scale = null;
    gantt.render();

  };

  $scope.yearscale = function(){
    gantt.config.scale_unit = "year";
        gantt.config.step = 1;
        gantt.config.date_scale = "%Y";
        gantt.config.min_column_width = 50;
        gantt.config.scale_height = 90;
        gantt.templates.date_scale = null;
        gantt.config.subscales = [
          {unit:"month", step:1, date:"%M" }
        ];

    gantt.render();

  };

  $scope.filtrarGantt = function() {
      // gantt.config.start_date = new Date(2013, 08, 10);
      gantt.config.start_date = $scope.dtganttini;
      // gantt.config.end_date = new Date(2013, 08, 20);
      gantt.config.end_date = $scope.dtganttfin;
      gantt.render();
  }

  $scope.ganttgridtoogle = function(){
    if ( $scope.mostrarganttgrid === 1 ) {
      gantt.config.grid_width = 0;
      $scope.mostrarganttgrid = 0;
    } else {
      gantt.config.grid_width = 200;
      $scope.mostrarganttgrid = 1;
    }
    gantt.render();
  }

});