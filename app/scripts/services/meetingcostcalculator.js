app.factory('meetingCostService', function(constants) {

  var service = {};
 
  service.getMeetingCost = function(meeting) {
    return roundToZeroDecimals(getCurrentMeetingCost(meeting));
  }

  function roundToZeroDecimals(value) {
      return Math.round(value).toFixed(0);
  }

  function getCurrentMeetingCost(meeting) {
      return getMeetingCostPerSecond(meeting) * getElapsedMeetingTimeInSeconds(meeting);
  }

  function getMeetingCostPerSecond(meeting) {
      var numberOfAttendees = meeting.numberOfAttendees;
      var averageHourlyRate = meeting.averageHourlyRate;
      return numberOfAttendees * (averageHourlyRate / 3600);
  }

  function getElapsedMeetingTimeInSeconds(meeting) {
      var meetingCurrentTime = new Date();
      return (meetingCurrentTime - meeting.meetingStartTime - meeting.meetingPauseTime) / 1000;    
  }

  return service;
  
});