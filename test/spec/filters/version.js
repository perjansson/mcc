'use strict';

describe('Filter: version', function () {

  // load the filter's module
  beforeEach(module('mccWebApp'));

  // initialize a new instance of the filter before each test
  var version;
  beforeEach(inject(function ($filter) {
    version = $filter('version');
  }));

  it('should return the input prefixed with "version filter:"', function () {
    var text = 'angularjs';
    expect(version(text)).toBe('version filter: ' + text);
  });

});
