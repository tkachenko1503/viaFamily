define(['ko'], function(ko) {

    var AppModel = {
        fullSlide : ko.observable({
            title: 'title',
            description: 'description',
            whoSee: ['Group1', 'Group2', 'Group3'],
            schedule: 'Mon Mar 24 2014 10:29:16',
            type: 'Meet'
        }),
        popupVisible : ko.observable('none'),
        showOverlay : ko.observable(false),
        showEditForm : ko.observable(false),
        editThisSlide : ko.observable(false),
        showFullSlide : ko.observable(false),
        chosenDay : ko.observable(),
        activeSlider : ko.observable(),
        popup : ko.observable(),
        days : ko.observableArray(),
        slidersData : ko.observable(),
        logged : ko.observable(false)
    };

    ko.bindingHandlers.logIn = {
        init: function(element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, valueAccessor);
        },
        update: function(element, valueAccessor){
            if(ko.utils.unwrapObservable(valueAccessor())){
                ko.bindingHandlers.visible.update(element, valueAccessor);
            }
        }
    };


    return AppModel;
});