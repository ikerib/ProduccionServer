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

produccionApp.directive('dhxGantt', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template: '<div ng-transclude></div>',

    link:function ($scope, $element, $attrs, $controller){
      // console.log($attrs.data);
      //watch data collection, reload on changes
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
      gantt.config.open_tree_initially = true;
      gantt.config.duration_unit = "hour";//an hour
      gantt.config.duration_step = 1;
      gantt.config.details_on_create = true;

      gantt.config.subscales = [
            {unit:"hour", step:2, date:"%H"}
          ];
      gantt.ignore_time = null;

      gantt.attachEvent("onTaskClick", function(id,e){
        console.log(id);
        console.log(e);
        console.log(this.getTask(id));
      });

      gantt.attachEvent("onTaskDrag", function(id, mode, task, original){
        console.log(id);
          console.log(mode);
          console.log(task);
          console.log(original);
        });
      gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
          console.log(id);
          console.log(mode);
          console.log(e);
      });

      gantt.init($element[0]);
    }
  };
});


function templateHelper($element){
  var template = $element[0].innerHTML;
  return template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{task\.([^\}]+)\}\}/g, function(match, prop){
    if (prop.indexOf("|") != -1){
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

      if (!gantt.config.columnsSet)
          gantt.config.columnsSet = gantt.config.columns = [];

      if (!gantt.config.columns.length)
        config.tree = true;
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
  }
}]);

produccionApp.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
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
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            val = miarray[0].trim();
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
        val = val.replace("<BR>", "<br>");
        val = val.replace("<BR />", "<br>");
        val = val.replace("<br />", "<br>");
        var n = val.indexOf("<br>");
        if (n > 0) {
            var miarray = val.split('<br>');
            val = miarray[0].trim();
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

