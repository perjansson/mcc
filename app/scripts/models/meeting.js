function aMeeting() {

    var calcuateRoundedMeetingCost = function () {
        var roundedMeetingCost = Math.round(getExactMeetingCost()).toFixed(0);
        meeting.meetingCost = roundedMeetingCost;
        return  roundedMeetingCost;
    }

    var getExactMeetingCost = function () {
        return getMeetingCostPerSecond() * getElapsedMeetingTimeInSeconds();
    }

    function getMeetingCostPerSecond() {
        var numberOfAttendees = meeting.numberOfAttendees;
        var averageHourlyRate = meeting.averageHourlyRate;
        return numberOfAttendees * (averageHourlyRate / 3600);
    }

    function getElapsedMeetingTimeInSeconds() {
        var meetingCurrentTime = new Date();
        return (meetingCurrentTime - meeting.meetingStartTime - meeting.meetingPauseTime) / 1000;
    }

    var meeting = {
        id: null,
        name: null,
        numberOfAttendees: null,
        averageHourlyRate: null,
        currency: 'BTC',
        status: 'notStarted',
        isBoring: false,
        meetingStartTime: null,
        pauseTimeStamp: null,
        meetingPauseTime: null,
        meetingCost: null,
        goodMeeting: false,
        duration: null,
        prettyDuration: null,
        comparableMeetingCost: null,
        lastUpdatedAtTimeStamp: null,
        position: null,
        calcuateRoundedMeetingCost: calcuateRoundedMeetingCost,
        getExactMeetingCost: getExactMeetingCost
    };

    return meeting;

}