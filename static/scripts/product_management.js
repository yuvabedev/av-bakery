/**
 * If vegan is selected autoselect eggless and dairy free checkboxes and disable them
 * @param {*} currentElement 
 */
function updateVeganRelatedCheckboxes(currentElement) {
    var ischecked= $(currentElement).is(':checked');

    if (ischecked) {
        $('#is_dairyfree').prop('checked', true);
        $("#is_dairyfree").prop ("disabled", true);
        $('.dairyfree').css("background-color", "#e1e1e1");

        $('#is_eggless').prop('checked', true);
        $("#is_eggless").prop ("disabled", true);
        $('.eggless').css("background-color", "#e1e1e1");

    } else {
        $('#is_dairyfree').prop('checked', false);
        $("#is_dairyfree").prop ("disabled", false);
        $('.dairyfree').css("background-color", "#f7f7f7");


        $('#is_eggless').prop('checked', false);
        $("#is_eggless").prop ("disabled", false);
        $('.eggless').css("background-color", "#f7f7f7");
    }
}