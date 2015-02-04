'use strict';

var assert 	= require('assert');

describe('when getting nav', function() {

	var nav = require('../app/components/nav');

	it('should return navigation', function() {
		var html = nav.render();
		assert(html === '<nav><ul><li>home</li><li>about</li><li>contact</li></ul></nav>');
	});
});
