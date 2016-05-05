'use strict';

angular.module('rezervoarApp')
    .directive('calendar', function () {
        return {
            restrict: 'A',
            link: function postLink(scope, elem, attrs) {
                var weekday = new Array(7);
                weekday[0] = "Nedelja";
                weekday[1] = "Ponedeljak";
                weekday[2] = "Utorak";
                weekday[3] = "Sreda";
                weekday[4] = "Četvrtak";
                weekday[5] = "Petak";
                weekday[6] = "Subota";

                $.datepicker.setDefaults({
                    showAnim: "fadeIn",
                    duration: 200,
                    dateFormat: "dd.mm.yy.",
                    changeMonth: true,
                    changeYear: true,
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    dayNamesMin: ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su"],
                    dayNames: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
                    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
                    monthNames: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
                    firstDay: 1
                });

                $("#datepicker").datepicker({
                    onSelect: function (dateText, inst) {
                        var dateAsString = dateText;
                        $(".date-custom em").html(dateAsString);

                        var dateAsObject = $(this).datepicker('getDate');
                        var dayOfWeek = dateAsObject.getUTCDay();

                        $(".date-custom b").html(weekday[dayOfWeek]);
                    }
                }).datepicker("setDate", new Date());

                var startDateString = $("#datepicker").val();
                $(".date-custom em").html(startDateString);

                var startDateSplited = startDateString.split(".");
                var startDate = new Date(startDateSplited[2], startDateSplited[1] - 1, startDateSplited[0]);
                var dayName = startDate.getDay();

                $(".date-custom b").html(weekday[dayName]);

                $('.date-custom').click(function ()
                {
                    $('#datepicker').datepicker("show");
                });
            }
        }
    });
