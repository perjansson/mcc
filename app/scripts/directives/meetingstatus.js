app.directive('pjMeetingStatus', function() {
	return {
		restrict: 'A',
		template: '<div ng-show="meeting.status != &quot;notStarted&quot;" ng-click="shareMeeting()" data-toggle="tooltip" title="Click for details of this fantastic meeting" ng-class="{clickable: meeting.id != null}" class="meeting-cost label label-info">Meeting cost is: {{meeting.meetingCost}} {{meeting.currency}}</div>'
	}
});