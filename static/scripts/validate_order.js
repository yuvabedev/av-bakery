const weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

var itemsToKeep = new Array(1);

$("#orderDeliveryDays").mouseover(function() {
    if ($("#orderDeliveryDaysDropdown").is(':disabled')) {
        var warningMessage = 'First select order start date';
        $("#orderDeliveryDays").css('cursor','pointer').attr('title', warningMessage);
        displayMessage(warningMessage);
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


$('#orderDeliveryDaysDropdown').on('select2:unselecting', function(event) {
    var valueUnselected = event.params.args.data.text;

    if (itemsToKeep.indexOf(valueUnselected) > -1) {
        event.preventDefault();
        var startDate = $('#startDate').val();
        var warningMessage = `${valueUnselected} can not be removed. It falls on the delivery start date ${startDate}`;
        console.log(warningMessage);
        displayMessage(warningMessage);
        return;
    }
    
    console.log(`Order delivery day removed ${valueUnselected}`);

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
    if (dayOfWeek != null && dayOfWeek.length > 0) {
        itemsToKeep = [];
        itemsToKeep.push(dayOfWeek);
    }
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

function displayMessage(message) {
    var saveMessage = $('#saveMessage');
    saveMessage.html(message).addClass('warning');
    setTimeout(function(){
        saveMessage.html('');
        saveMessage.removeClass('warning');
      }, 2000);
}