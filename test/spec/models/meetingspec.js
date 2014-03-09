describe("Meeting default values", function () {

    var meeting = null;

    beforeEach(function () {
        meeting = aMeeting();
    });

    it("a new meeting should have null as id", function () {
        expect(meeting.id).toBeNull();
    });

    it("a new meeting should not be started", function () {
        expect(meeting.status).toEqual('notStarted');
    });

    it("a new meeting should BTC as default currency", function () {
        expect(meeting.currency).toEqual('BTC');
    });

});

describe("Cost calculator logic", function () {

    var meeting = null;

    beforeEach(function () {
        meeting = aMeeting();
    });

    it("a meeting not started should have null as meeting cost", function () {
        expect(meeting.meetingCost).toBeNull;
    });

    it("a 1 hour meeting with 10 people with average hourly rate of 1000 SEK should have a rounded meeting cost of 10000 SEK", function () {
        var now = new Date();
        var tenMinutesAgo = now - 3600000;
        meeting.numberOfAttendees = 10;
        meeting.averageHourlyRate = 1000;
        meeting.currency = 'SEK';
        meeting.meetingStartTime = tenMinutesAgo;
        expect(meeting.getRoundedMeetingCost()).toBeCloseTo(10000);
    });

});