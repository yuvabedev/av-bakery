function viewReport(report_name) {
    window.location.href = `/reportView?report_name=${report_name}`;
}

function initReport(reportName, criteriaDate) {
    var reportDefinition = getReportDefinition(reportName);
    var reportTitle = `<h2>${reportDefinition.title}</h2>`;
    $("#reportTitle").html(reportTitle);

    var formattedDate  =formatDateString(criteriaDate);
    $("#reportDate").html(formattedDate);
}

function runReport() {
    var reportName = $("#reportName").val();
    var criteriaDate = $("#criteriaDate").val();

    console.log(`Executing report ${reportName} for date ${criteriaDate}`);

    var formattedDate  =formatDateString(criteriaDate);
    $("#reportDate").html(formattedDate);

    var criteria = {};
    criteria.date = criteriaDate;
    criteria.reportName = reportName;
    $.get('reportRun', criteria)
    .done(function (data) {
        createReportAsTable(reportName, data);
        console.log('Report Finished Executing!');
    })
    .fail(function (e) {
      console.log(e);
    });    
}

function getReportDefinition(reportName) {
    var product_quantity_grouped_by_date = {};
    product_quantity_grouped_by_date.title = "Products and Quantity Ordered";
    product_quantity_grouped_by_date.columns = [ {title:"Product", field:"product_name", width:200}, {title:"Quantity", field:"quantity", width:200}]
    switch(reportName) {
        case "product_quantity_grouped_by_date":
            return product_quantity_grouped_by_date;
        default:
            //return null
            return null;
    } 
}

function createReportAsTable(reportName, reportData) {
    if (reportData.length < 1) {
        $('#reportRunMessage').html('No Data Found').addClass('warning');
        $('#reportTable').hide();
        return;
    }
    var reportDefinition = getReportDefinition(reportName);
    var reportColumns = reportDefinition.columns;
    console.log(reportColumns);
    console.log(reportData);

    new Tabulator("#reportTable", {
        data:reportData,           //load row data from array
        layout:"fitDataTable",      //fit columns to width of table
        responsiveLayout:"hide",  //hide columns that dont fit on the table
        tooltips:false,            //show tool tips on cells
        addRowPos:"top",          //when adding a new row, add it to the top of the table
        history:true,             //allow undo and redo actions on the table
        resizableRows:false,       //allow row order to be changed
        resizableColumns:false,       //allow row order to be changed
        initialSort:[             //set the initial sort order of the data
            {column:"name", dir:"asc"},
        ],
        columns:reportColumns,
    });
    $('#reportRunMessage').html('').removeClass('warning');
    $('#reportTable').show();
}

function formatDateString(dateString) {
    var timeStamp = Date.parse(dateString);
    var dateObject = new Date(timeStamp);
    var month = dateObject.toLocaleDateString("en-IN", {month: 'short' });
    var day = dateObject.getDate().toString();
    if (day.length < 2) {
      day = "0" + day;
    }
    var yyyy = dateObject.getFullYear();
    return month + " " + day + "," + yyyy;
  }