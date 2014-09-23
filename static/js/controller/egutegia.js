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

    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        var $data = {};
        $data.id = event._id;
        $data.fetxa = dayDelta._days;

        $http.put(
            '/egutegiaeguneratu', $data
        ).success(function () {

            console.log("fin");
        });
    }
});