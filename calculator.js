var meetingStartTime;
var meetingPauseTime = 0;
var pauseTimeStamp = 0;
var timerId = 0;
const delay = 50;

$(function () {
    $('#startMeetingButton').click(function () {
        $('#controlWhenStopped').toggle();
        $('#controlWhenStarted').toggle();
        $('#controlWhenNotBoring').toggle();
        start();
    });
});

$(function () {
    $('#stopMeetingButton').click(function () {
        $('#controlWhenStopped').toggle();
        $('#controlWhenStarted').toggle();
        $('#playground').toggle();
        stop();
    });
});

$(function () {
    $('#pauseMeetingButton').click(function () {
        $('#controlWhenRunning').toggle();
        $('#controlWhenPaused').toggle();
        pause();
    });
});

$(function () {
    $('#resumeMeetingButton').click(function () {
        $('#controlWhenRunning').toggle();
        $('#controlWhenPaused').toggle();
        resume();
    });
});

$(function () {
    $('#boringMeetingButton').click(function () {
        $('#playground').toggle();
        $('#controlWhenNotBoring').toggle();
        $('#controlWhenBoring').toggle();
        animateToBottom();
    });
});

$(function () {
    $('#notBoringMeetingButton').click(function () {
        $('#playground').toggle();
        $('#controlWhenNotBoring').toggle();
        $('#controlWhenBoring').toggle();
    });
});

function animateToBottom() {
    $('html, body').scrollTop($('body').prop("scrollHeight"));
    return false;
}

function start() {
    clearInterval(timerId);
    meetingStartTime = new Date();
    timerId = setInterval(meetingCostCalculator, delay);
}

function resume() {
    meetingPauseTime = meetingPauseTime + (new Date() - pauseTimeStamp);
    pauseTimeStamp = 0;
    timerId = setInterval(meetingCostCalculator, delay);
}

function pause() {
    pauseTimeStamp = new Date();
    clearInterval(timerId);
}

function stop() {
    pause();
    reset();
}

function reset() {
    meetingPauseTime = 0;
    pauseTimeStamp = 0;
    $('#controlWhenStopped').show();
    $('#controlWhenStarted').hide();
    $('#controlWhenRunning').show();
    $('#controlWhenPaused').hide();
    $('#controlWhenNotBoring').hide();
    $('#controlWhenBoring').hide();
    $('#playground').hide();
}

var meetingCostCalculator = function () {
    var meetingCurrentTime = new Date();
    var numberOfAttendees = $('#numberOfAttendees');
    var averageHourlyRate = $('#averageHourlyRate');
    var meetingCostPerSecond = numberOfAttendees.val() * (averageHourlyRate.val() / 3600);
    var elapsedMeetingTimeInSeconds = (meetingCurrentTime - meetingStartTime - meetingPauseTime) / 1000;
    var currentMeetingCost = meetingCostPerSecond * elapsedMeetingTimeInSeconds;
    var rounded = Math.round(currentMeetingCost).toFixed(0);
    $('#meetingCost').text("Meeting cost: " + rounded + " " + $('#currency').val());
}