app.filter('meetingstatus', function() {
	return function(meeting) {
		return "Meeting cost is: " + meeting.meetingCost + " " + meeting.currency;
	}
});