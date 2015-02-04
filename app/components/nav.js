'use strict';

module.exports = (function () {
  var nav = {};
  var state = ['home', 'about', 'contact'];

  nav.render = function() {
  	var template = '<nav><ul>';

  	state.forEach(function(item){
    	template = template + '<li>' + item + '</li>';
  	});

  	return template + '</ul></nav>';
  };
 
  return nav;
}());