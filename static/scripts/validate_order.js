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