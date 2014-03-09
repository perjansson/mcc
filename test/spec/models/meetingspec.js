describe("Meeting", function () {

    var meeting = null;

    beforeEach(function () {
        meeting = aMeeting();
    });

    it("a new meeting should have null as id", function () {
        expect(meeting.id).toBeNull();
    });

});