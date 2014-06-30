/**
 * Created by ikerib on 30/06/14.
 */


produccionApp.controller('egutegiaController', function ($scope, $http, socket) {

    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header:{
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };
    $scope.eventSources = [
        {title: 'Long Event',start: new Date('2014-06-04'),end: new Date('2014-06-06')}
    ];

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];


//    $('#calendar').fullCalendar({
//        theme: true,
//        firstDay: 1,
//        header: {
//            left: 'today prev,next',
//            center: 'title',
//            right: 'month,agendaWeek,agendaDay'
//        },
//        defaultView: 'agendaWeek',
//        minTime: '6:00am',
//        maxTime: '6:00pm',
//        allDaySlot: false,
//        columnFormat: {
//            month: 'ddd',
//            week: 'ddd dd/MM',
//            day: 'dddd M/d'
//        },
//        eventSources: [
//            {
//                url: 'calendar_events.json',
//                editable: false
//            }
//        ],
//        droppable: true,
//        drop: function(date, all_day){
//            external_event_dropped(date, all_day, this);
//        },
//        eventClick: function(cal_event, js_event, view){
//            calendar_event_clicked(cal_event, js_event, view);
//        },
//        editable: true
//    });
//
//    //Initialise external events
//    initialise_external_event('.external-event');


//    $http.get('DataRetriever.jsp').success(function(data) {
//        for(var i = 0; i < data.length; i++)
//        {
//            $scope.events[i] = {id:data[i].id, title: data[i].task,start: new Date(data[i].start), end: new Date(data[i].end),allDay: false};
//        }
//    });


});