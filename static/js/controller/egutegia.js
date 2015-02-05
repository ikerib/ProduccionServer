/**
 * Created by ikerib on 30/06/14.
 */
"use strict";
produccionApp.controller('egutegiaController', function ($scope, $http, socket, $cookieStore) {
    if ( $cookieStore.get('gitekplanificacion') === "1" ) {
        $scope.uiConfig = {
            calendar:{
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
                    }
                ],

                eventRender: function (event, element) {
                    element.find('span.fc-event-title').html(element.find('span.fc-event-title').text().replace("<br>","-").substr(0, 20));
                    switch(event.linea) {
                        case 1:
                            $(element).css("backgroundColor", "blue");
                            break;
                        case 2:
                            $(element).css("backgroundColor", "green");
                            break;
                        case 3:
                            $(element).css("backgroundColor", "orange");
                            break;
                    }
                }
            }
        };
    } else {
        $scope.uiConfig = {
            calendar:{
                weekNumbers: true,
                editable: false,
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
                    }
                ],

                eventRender: function (event, element) {
                    element.find('span.fc-event-title').html(element.find('span.fc-event-title').text().replace("<br>","-").substr(0, 20));
                    switch(event.linea) {
                        case 1:
                            $(element).css("backgroundColor", "blue");
                            break;
                        case 2:
                            $(element).css("backgroundColor", "green");
                            break;
                        case 3:
                            $(element).css("backgroundColor", "orange");
                            break;
                    }
                }
            }
        };
    }

    $scope.eventSources = [];

    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        var $data = {};
        $data._id = event._id;
        $data.fetxa = moment(event._start).add(dayDelta._days);
        $http.put(
            '/egutegiaeguneratu', $data
        ).success(function () {
                console.log("fin");
        });
    };
});