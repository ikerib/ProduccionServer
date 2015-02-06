'use strict';
var produccionApp = angular.module('produccionApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'colorpicker.module',
        'xeditable', 'ngSanitize', 'ui.calendar', 'highcharts-ng', 'ngCookies','angularSpinner','ngDragDrop']);

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

        .when('/egutegia', {
            templateUrl:'pages/egutegia.html',
            controller:'egutegiaController'
        })

        .when('/login', {
            templateUrl:'pages/login.html',
            controller:'loginController'
        })

        .when('/gantt', {
            templateUrl:'pages/gantt.html',
            controller:'ganttController'
        })

        .when('/logout', {
            controller:'logoutController'
        });
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
    };
}]);

produccionApp.directive('dhxGantt', ['$http','usSpinnerService',function($http,usSpinnerService) {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template: '<div ng-transclude></div>',

    link:function ($scope, $element, $attrs, $controller){

        usSpinnerService.spin('spinner-gantt');

      $scope.$watch($attrs.data, function(collection){
        gantt.clearAll();

        if (collection !== undefined)  {
          gantt.parse(collection, "json");
        }
      }, true);

      //size of gantt
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        gantt.setSizes();
      });

      //init gantt
      gantt.config.grid_width = 200;
      gantt.config.open_tree_initially = true;
      gantt.config.duration_unit = "hour";//an hour
      gantt.config.duration_step = 1;
      gantt.config.details_on_create = true;
      gantt.config.subscales = [
            {unit:"week", step:1, date:"Week #%W"},
            {unit:"hour", step:2, date:"%H"}
          ];
      gantt.ignore_time = null;
      gantt.config.scale_height = 74;

      // Style weekend
      gantt.templates.scale_cell_class = function(date){
            if(date.getDay()===0||date.getDay()===6){
                return "weekend";
            }
        };
        gantt.templates.task_cell_class = function(item,date){
            if(date.getDay()===0||date.getDay()===6){
                return "weekend";
            }
        };

      // Style completed
      gantt.templates.task_class=function(start,end,task){
        if (task.progress >= 100) {
            return "completed_task";
        }
        return "";
      };


      gantt.attachEvent("onTaskClick", function(id,e){
        console.log(this.getTask(id));
      });

      gantt.attachEvent("onAfterTaskDrag", function(id, progress, e){

          var task = gantt.getTask(id);
          onAfterTaskDragUpdateDenborak(task);

      });

      gantt.attachEvent("onAfterTaskUpdate", function(id,item){
          var task = gantt.getTask(id);
          onAfterTaskDragUpdateDenborak(task);

      });

        gantt.attachEvent("onLightboxDelete", function(id){
            alert("Functión no implementada.");
            //var task = gantt.getTask(id);
            //if (task.duration > 60){
            //    alert("The duration is too long. Please, try again");
            //    return false;
            //}
            //return true;
        });

      gantt.attachEvent("onAfter");

      function onAfterTaskDragUpdateDenborak(task) {
        var miid = task._id;
        var fetxa = moment(task.start_date).toISOString();
        var midenbora = moment(task.start_date).format('HH:mm');
        var midenborafin = moment(task.end_date).format('HH:mm');

        var d = {
            id: miid,
            denbora: midenbora,
            denborafin: midenborafin,
            fetxa:fetxa
        };


        $http.post('/savedenbora', d).success(function () {});
        $http.post('/savedenborafinfetxa', d).success(function () {
          dhtmlx.message("Datos actualizados correctamente!");
          });
      }

      gantt.attachEvent("onGanttRender", function(){
          usSpinnerService.stop('spinner-gantt');
          console.log("Rendered");
          // $('.gantt_container').parent().addClass('guzia');
          // $('.gantt_grid_data').addClass('guzia');
          // $('.gantt_data_area').addClass('guzia');
          // $('.gantt_task').addClass('guzia');
      });
      gantt.init($element[0]);
    }
  };
}]);

function templateHelper($element){
  var template = $element[0].innerHTML;
  return template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g, function(match, prop){
    if (prop.indexOf("|") !== -1){
      var parts = prop.split("|");
      return "\"+gantt.aFilter('"+(parts[1]).trim()+"')(task."+(parts[0]).trim()+")+\"";
    }
    return '"+task.'+prop+'+"';
  });
}
produccionApp.directive('ganttTemplate', ['$filter', function($filter){
  gantt.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,

    link:function($scope, $element, $attrs, $controller){
      var template =  Function('sd','ed','task', 'return "'+templateHelper($element)+'"');
      gantt.templates[$attrs.ganttTemplate] = template;
    }
  };
}]);

produccionApp.directive('ganttColumn', ['$filter', function($filter){
  gantt.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,

    link:function($scope, $element, $attrs, $controller){
      var label  = $attrs.label || " ";
      var width  = $attrs.width || "*";
      var align  = $attrs.align || "left";

      var template =  Function('task', 'return "'+templateHelper($element)+'"');
      var config = { template:template, label:label, width:width, align:align };

      if (!gantt.config.columnsSet) {
          gantt.config.columnsSet = gantt.config.columns = [];
      }

      if (!gantt.config.columns.length) {
          config.tree = true;
      }

      gantt.config.columns.push(config);

    }
  };
}]);

produccionApp.directive('ganttColumnAdd', ['$filter', function($filter){
  return {
    restrict: 'AE',
    terminal:true,
    link:function(){
      gantt.config.columns.push({ width:45, name:"add" });
    }
  };
}]);

produccionApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

produccionApp.filter('searchBy', function () {
    return function (array, prop, val) {
        // filter has polyfills for older browsers. Check underscore.js if needed
        return array.filter(function (row) {
            return row[prop] === val;
        })[0];
        // this returns an array. You can pick the first element with [0]
    };
});

produccionApp.filter('searchByRefBackcolor', function () {

    return function (array, prop, val) {
        // miramos si tiene almohadilla
        if (val === undefined) {
            return false;
        }
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            val = miarray[0].trim();
        }
        var kk = array.filter(function (row) {
            return row[prop] === val;
        });

        if (kk.length > 0) {
            return kk[0].backcolor;
        }

        return  null;
    };
});

produccionApp.filter('searchByRefForecolor', function () {

    return function (array, prop, val) {
        // miramos si tiene almohadilla
        if (val === undefined) {
            return false;
        }
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            val = miarray[0].trim();
        }

        var kk = array.filter(function (row) {
            return row[prop] === val;
        });

        if (kk.length > 0) {
            return kk[0].forecolor;
        }

        return  null;
    };
});

produccionApp.filter('formatText', function (){
    return function(input) {
        if(!input) {return input;}

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

