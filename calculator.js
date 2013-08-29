var meetingStartTime;
var timerId = 0;

$(function () {
    $("#startMeetingButton").click(function() {
        meetingStartTime = new Date();
        clearInterval(timerId);
        timerId = setInterval(meetingCostCalculator, 50);
    })
});

var meetingCostCalculator = function() {
    var meetingCurrentTime = new Date();
    var numberOfAttendees = $('#numberOfAttendees');
    var averageHourlyRate = $('#averageHourlyRate');
    var meetingCostPerSecond = numberOfAttendees.val() * (averageHourlyRate.val() / 3600);
    var elapsedMeetingTimeInSeconds = (meetingCurrentTime - meetingStartTime) / 1000;
    var currentMeetingCost = meetingCostPerSecond * elapsedMeetingTimeInSeconds;
    var rounded = Math.round(currentMeetingCost).toFixed(0);
    $('#meetingCost').text("Meeting cost: " + rounded + " " + $('#currency').val());
}