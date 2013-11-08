app.directive('pjMeetingStatus', function() {
	return {
		restrict: 'A',
		template: '<div ng-show="meeting.status != &quot;notStarted&quot;" ng-click="shareMeeting()" data-toggle="tooltip" title="Click to open a sharing url (in a new tab) for this fantastic meeting" ng-class="{clickable: meeting.id != null}" class="meeting-cost label label-info">Meeting cost is: {{meeting.meetingCost}} {{meeting.currency}}</div>'
	}
});