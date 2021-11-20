const weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";


$("#orderDeliveryDays").mouseover(function() {
    if ($("#orderDeliveryDaysDropdown").is(':disabled')) {
        $("#orderDeliveryDays").css('cursor','pointer').attr('title', 'First select order start date');

        var saveMessage = $('#saveMessage');
        saveMessage.html("First select order start date").addClass('warning');
        setTimeout(function(){
            saveMessage.html('');
            saveMessage.removeClass('warning');
          }, 2000);
    }
});

$('#startDate').change(function() {
    var startDate = $('#startDate').val();
    if (startDate == null || startDate.length < 1) {
        disableOrderDeliveryDaysDropdown();
        autoPopulateOrderDeliveryDate('');
        return;
    };

    console.log("Order start date updated to "  +startDate);
    enableOrderDeliveryDaysDropdown();
    var dayOfWeek = getWeekDayFromDate(startDate);
    console.log(`${startDate} falls on ${dayOfWeek}`);
    autoPopulateOrderDeliveryDate(dayOfWeek);
});


function enableOrderDeliveryDaysDropdown() {
    $("#orderDeliveryDaysDropdown").prop("disabled", false);
}

function disableOrderDeliveryDaysDropdown() {
    $("#orderDeliveryDaysDropdown").prop("disabled", true);

}
/** Auto populates the order delivery day dropdown by adding the week day that corresponds to the order start date selected by user */
function autoPopulateOrderDeliveryDate(dayOfWeek) {
    $("#orderDeliveryDaysDropdown").val(dayOfWeek).trigger('change');
}

/** Returns the week day on which date string falls on. For example, 20/11/2021 falls on a Saturday 
 * so, Satudarday is returned.
*/

function getWeekDayFromDate(dateString) {
    var dateAttributes = dateString.split("/");
    //dateAttributes[0] => day of the month, dateAttributes[1] => month, dateAttributes[2] => year
    var parsableDate = `${dateAttributes[1]}/${dateAttributes[0]}/${dateAttributes[2]}`;
    var timestamp = Date.parse(parsableDate);
    var dateObject = new Date(timestamp);
    var dayOfWeek = weekdays[dateObject.getDay()];
    return dayOfWeek;
}