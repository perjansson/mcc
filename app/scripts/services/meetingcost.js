app.factory('meetingCostService', function(constants) {

  var service = {};
  var meeting = null;

  service.hasMeeting = function() {
    return meeting != null;
  }
 
  service.getMeeting = function() {
    return meeting;
  }
 
  service.getMeetingCost = function(updateMeeting) {
    meeting = updateMeeting;
    return roundToZeroDecimals(getCurrentMeetingCost());
  }

  function roundToZeroDecimals(value) {
      return Math.round(value).toFixed(0);
  }

  function getCurrentMeetingCost() {
      return getMeetingCostPerSecond(meeting) * getElapsedMeetingTimeInSeconds(meeting);
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

  return service;
  
});