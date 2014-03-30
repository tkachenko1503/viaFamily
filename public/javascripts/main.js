requirejs.config({
    "baseUrl": 'javascripts',
    "paths": {
        "jquery": '/vendor/bower_components/jquery/jquery.min',
        "ko": '/vendor/bower_components/knockout/build/output/knockout-latest',
        "calendar": 'node-calendar'
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "calendar": {
            exports: "cal"
        }
    }
});

requirejs(['jquery', 'ko', 'koControl', 'slide_ui', 'mediator'],
    function   ($, ko, AppVM, slide_ui, AppEvent) {

        function init(App){
            AppEvent.trigger('ui:drawCalendar', 'current');
            AppEvent.trigger('ui:getViewData', 'current');
            ko.applyBindings(App);
        };



        AppEvent.subscribe('app:ready', init);

        $(document).ready( function(){
            AppEvent.trigger('app:ready', AppVM);
        });
    });