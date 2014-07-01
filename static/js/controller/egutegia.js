/**
 * Created by ikerib on 30/06/14.
 */


produccionApp.controller('egutegiaController', function ($scope, $http, socket) {

    $scope.uiConfig = {
        calendar:{
//            height: 450,
            weekNumbers: true,
            editable: true,
            header:{
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventSources: [
                {
                    url: '/egutegia'
                }]
        }
    };

    $scope.eventSources = [];
});