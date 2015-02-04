'use strict';

module.exports = (function () {
  var welcome = {};

  welcome.render = function() {
    return '<h1>Hello world.</h1>';
  };
 
  return welcome;
}());