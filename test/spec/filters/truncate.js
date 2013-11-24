describe('Filter: truncate_characters', function () {

  // load the filter's module
  beforeEach(angular.module('MeetingCostCalculatorApp'));

  // initialize a new instance of the filter before each test
  var truncate;
  beforeEach(inject(function ($filter) {
    truncate = $filter('truncate_characters');
  }));

  it('should return the input prefixed with "truncate filter:"', function () {
    var text = 'angularjs';
    expect(truncate(text)).toBe('truncate filter: ' + text);
  });

});
