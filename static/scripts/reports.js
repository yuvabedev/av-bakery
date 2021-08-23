function viewReport(report_name) {
    window.location.href = `/reportView?report_name=${report_name}`;
}

function runReport(report_name) {
    console.log(`Executing report ${report_name}`);

    $.get('reportRun')
    .done(function (data) {
      console.log('Report Finished Executing!');
    })
    .fail(function (e) {
      console.log(e);
    });    
}