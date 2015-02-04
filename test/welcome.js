'use strict';

var assert 	= require('assert');

describe('when getting nav', function() {

	var welcome = require('../app/components/welcome');

	it('should return navigation', function() {
		var html = welcome.render();
		assert(html === '<h1>Hello world.</h1>');
	});
});
