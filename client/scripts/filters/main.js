'use strict';

var angular = require('angular'),

   shorten = require('./shorten'),
   abbreviateNumber = require('./abbreviateNumber'),
   duration = require('./duration');


  var filtersModule = angular.module('cam.cockpit.filters', []);

  filtersModule.filter('shorten', shorten);
  filtersModule.filter('abbreviateNumber', abbreviateNumber);
  filtersModule.filter('duration', duration);

  module.exports = filtersModule;
