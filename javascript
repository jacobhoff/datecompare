

$(function () {

    // Implements the dataTables plugin on the HTML table
    var $dTable = $('#logTable').DataTable({
        "bStateSave": true,
        "sDom": '<"top"lpf<"clear">>rt<"bottom"lp<"clear">>',
        "aaSorting": [[0, 'desc']]
    });
    $("#logTable").css('visibility', 'visible');
    $(".dateControlBlock").css('visibility', 'visible');
    $("#running").hide();
    // The dataTables plugin creates the filtering and pagination controls for the table dynamically, so these 
    // lines will clone the date range controls currently hidden in the baseDateControl div and append them to 
    // the feedbackTable_filter block created by dataTables
    $dateControls = $("#baseDateControl").children("div").clone();
    $("#feedbackTable_filter").prepend($dateControls);

    // Implements the jQuery UI Datepicker widget on the date controls
    $('.datepicker').datepicker(
		{
		    format: 'm/d/yyyy',
		}
	);

    // Create event listeners that will filter the table whenever the user types in either date range box or
    // changes the value of either box using the Datepicker pop-up calendar
    $("#dateStart").keyup(function () { $dTable.draw(); });
    $("#dateStart").change(function () { $dTable.draw(); });
    $("#dateEnd").keyup(function () { $dTable.draw(); });
    $("#dateEnd").change(function () { $dTable.draw(); });


    $.fn.dataTableExt.afnFiltering.push(
		function (oSettings, aData, iDataIndex) {
		    var dateStart = parseDateValue($("#dateStart").val());
		    var dateEnd = parseDateValue($("#dateEnd").val());
		    // aData represents the table structure as an array of columns, so the script access the date value 
		    // in the first column of the table via aData[0]
		    var evalDate = parseDateValue(aData[0]);

		    var result = CompareDates(dateStart, dateEnd, evalDate);

		    if (result) {
		        return true;
		    }
		    else {
		        return false;
		    }
		});

});

function parseDateValue(rawDate) {
    var dateArray = rawDate.split("/");
    var parsedDate = parseInt(dateArray[0], 10) + '/' + parseInt(dateArray[1], 10) + "/" + parseInt(dateArray[2], 10);
    return parsedDate;
}
function CompareDates(min, max, date) {

    var minArray = min.split("/");
    var maxArray = max.split("/");
    var dateArray = date.split("/");
    //month
    if ((minArray[0] == "NaN" && parseInt(dateArray[0], 10) <= parseInt(maxArray[0], 10)) ||
                 (parseInt(dateArray[0], 10) >= parseInt(minArray[0], 10) && maxArray[0] == "NaN") ||
                 (parseInt(dateArray[0], 10) >= parseInt(minArray[0], 10) && parseInt(dateArray[0], 10) <= parseInt(maxArray[0], 10)) ||
        (parseInt(dateArray[0], 10) >= parseInt(minArray[0], 10) && parseInt(dateArray[0], 10) <= parseInt(maxArray[0], 10) && parseInt(minArray[2], 10) != parseInt(maxArray[2], 10)) ||
                 (parseInt(dateArray[0], 10) <= parseInt(minArray[0], 10) && parseInt(minArray[0], 10) > parseInt(maxArray[0], 10) && parseInt(minArray[2], 10) != parseInt(maxArray[2], 10)) ||
                 (parseInt(dateArray[0], 10) <= parseInt(minArray[0], 10) && maxArray[0] == "NaN" && parseInt(minArray[2], 10) != parseInt(maxArray[2], 10))) {
        var firstResult = true;
    }
    //day
    if ((minArray[1] == "NaN" && parseInt(dateArray[1], 10) <= parseInt(maxArray[1], 10)) ||
                 (parseInt(dateArray[1], 10) >= parseInt(minArray[1], 10) && maxArray[1] == "NaN") ||
                 (parseInt(dateArray[1], 10) >= parseInt(minArray[1], 10) && parseInt(dateArray[1], 10) <= parseInt(maxArray[1], 10)) ||
        (parseInt(dateArray[1], 10) >= parseInt(minArray[1], 10) && parseInt(dateArray[1], 10) <= parseInt(maxArray[1], 10) && parseInt(minArray[2], 10) != parseInt(maxArray[2], 10)) ||
        (parseInt(minArray[2], 10) != parseInt(maxArray[2], 10) && parseInt(dateArray[1], 10) >= parseInt(minArray[1], 10) && parseInt(minArray[1], 10) >= parseInt(maxArray[1], 10)) ||
                 ((parseInt(dateArray[1], 10) <= parseInt(minArray[1], 10)) && (parseInt(minArray[1], 10) > parseInt(maxArray[1], 10)) && (parseInt(minArray[2], 10) != parseInt(maxArray[2], 10))) ||
                 (parseInt(dateArray[1], 10) <= parseInt(minArray[1], 10) && maxArray[1] == "NaN" && parseInt(minArray[2], 10) != parseInt(maxArray[2], 10))) {
        var secondResult = true;
    }
    //year
    if ((minArray[2] == "NaN" && parseInt(dateArray[2], 10) <= parseInt(maxArray[2], 10)) ||
                 (parseInt(dateArray[2], 10) >= parseInt(minArray[2], 10) && maxArray[2] == "NaN") ||
                 (parseInt(dateArray[2], 10) >= parseInt(minArray[2], 10) && parseInt(dateArray[2], 10) <= parseInt(maxArray[2], 10))) {
        var thirdResult = true;
    }

    if (firstResult && secondResult && thirdResult) {
        return true;
    }
}
$('.datepicker').datepicker().on('changeDate', function () {
    $(".dropdown-menu").hide();
});
