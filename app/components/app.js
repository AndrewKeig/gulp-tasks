'use strict';
/*global document*/

(function(){	
	var nav = require('./nav');
	var welcome = require('./welcome');

  var el1 = document.createElement('div');
  el1.innerHTML = nav.render();
  document.body.appendChild(el1);

  var el2 = document.createElement('div');
  el2.innerHTML = welcome.render();
  document.body.appendChild(el2);
}());