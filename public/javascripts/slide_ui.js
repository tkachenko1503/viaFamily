define(['jquery', 'ko', 'koControl', 'mediator', 'calendar'], function($, ko, AppVM, AppEvent, cal) {

    function init(App) {
        App.showSlideBar = function (select, event) {
            var weeks = App.days(),
                weekNum,
                margValue,
                ind,
                mainList = $('.main-days-list'),
                row = $(event.target).parents('.main-week'),
                i = 0,
                leng = weeks.length;

            for (i; i < leng; i += 1) {
                ind = weeks[i].week.indexOf(select);
                if (ind !== -1) {
                    weekNum = weeks[i].numb;
                    break;
                }
            }
            if (App.chosenDay() == select.id) {
                App.chosenDay('');
                App.activeSlider(58);
                mainList.css('margin-top', 0);
            } else {
                AppEvent.trigger('ui:getDaySlider', select.id);
                App.chosenDay(select.id);
                App.activeSlider(weekNum);
                margValue = (row.height() + 1) * weekNum;
                mainList.css('margin-top', -margValue);
            }
        };

        App.showPopup = function (slide, event) {
            var control = event.target;
            if (control.id == 'add-slide') {
                App.showFullSlide(false);
                App.editThisSlide(false);
                App.showEditForm(true);
            } else if (control.id == 'edit-this') {
                App.fullSlide(slide);
                App.showFullSlide(false);
                App.editThisSlide(true);
            } else {
                App.fullSlide(slide);
                App.showFullSlide(true);
                App.showEditForm(false);
                App.editThisSlide(false);
            }
            App.showOverlay(true);
            App.popupVisible('activeDialog');
        };

        App.closePopup = function () {
            App.showOverlay(false);
            App.popupVisible('none');
        };

        App.saveNewSlide = function(formData){
            var url = formData.name == 'edit' ? '/slide/'+formData[6].value : '/slide';
            var data = {
                name: formData[0].value,
                description: formData[1].value,
                whosee: formData[2].value,
                type: formData[4].value,
                schedule: formData[3].value
            };
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {data: data},
//                    dataType: "json",
                    beforeSend: function(){
                        AppVM.closePopup();
                    }
                }).done(function(status){
                    if(status == 'ok'){
                        AppEvent.trigger('ui:getViewData', 'current');
                    }
                });
        };

        App.sendLogin = function(formData){
            var data = {
                user: formData[0].value,
                pass: formData[1].value
            };
            $.ajax({
                url: '/login',
                type: 'POST',
                data: {data: data},
                beforeSend: function(){
                    AppVM.closePopup();
                }
            }).done(function(status){
                if(status == 'ok'){

                }
            });
        };
    };

    function getMonthViewData(month){
        if(month == 'current'){
            var dateData = {
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            }
        }
        $.ajax({
            url: '/calendar_data',
            type: 'POST',
            dataType: "json",
            data: {data: dateData}
        }).done(function(data){
            var currentData = AppVM.days();
            currentData.forEach(function(elem, index){
                data.forEach(function(secondElem, secondIndex){
                    for(var i = 0; i<7; i += 1){
                        if(elem.week[i].id == secondElem.id){
                            elem.week[i].dayEvents(secondElem.events)
                        }
                    }
                });
            });
        });
    };

    function makeMonth(previousResult, currentItem, i){
        var calendarDay = {
            title: new Date(currentItem).getDate(),
            id: currentItem.toDateString(),
            dayEvents: ko.observable({
                remind: 0,
                meets: 0,
                facts: 0
            })
        };
        previousResult.push(calendarDay);
        return previousResult;
    };

    function monthArray(target){
        var currentDate = new Date,
            year = currentDate.getFullYear(),
            month = currentDate.getMonth()+ 1,
            monthArray = new calendar.Calendar().monthdatescalendar(year, month);
        var len = monthArray.length;
        if(len < 6){
            var nextMonth = new calendar.Calendar().monthdatescalendar(year, month+1);
            if(monthArray[len - 1][0].getDate() === nextMonth[0][0].getDate()){
                monthArray.push(nextMonth[1]);
            }else{
                monthArray.push(nextMonth[0]);
            }
        }
        return monthArray;
    }

    function drawCalendar(month){
        var resObject,
            monthData = monthArray(month);
        resObject = monthData.map(function(itemArr, i, Arr){
            var row = {
                week: itemArr.reduce(makeMonth, []),
                numb: i
            }
            return row;
        });
        AppVM.days(resObject);
    };

    function getDaySlider(dayId){
        $.ajax({
            url: '/slide',
            type: 'GET',
            data: {day: dayId}
        }).done(function(data){
            AppVM.slidersData({sliders: data});
        });
    };

    function showLogForm(){
        AppVM.logged(true);
        AppVM.showOverlay(true);
        AppVM.popupVisible('activeDialog');
    };

    AppEvent.subscribe({
        'app:ready': init,
        'ui:drawCalendar': drawCalendar,
        'ui:getViewData': getMonthViewData,
        'ui:getDaySlider': getDaySlider,
        'user:logIn': showLogForm
    });
});