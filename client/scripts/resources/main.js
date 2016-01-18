'use strict';

var angular = require('angular'),

  commonsUi = require('camunda-commons-ui/lib/util/index'),
  processDefinitionResource = require('./processDefinitionResource'),
  incidentResource = require('./incidentResource'),
  processInstanceResource = require('./processInstanceResource'),
  localExecutionVariableResource = require('./localExecutionVariableResource'),
  jobResource = require('./jobResource'),
  taskResource = require('./taskResource'),
  jobDefinitionResource = require('./jobDefinitionResource');

  var resourcesModule = angular.module('cam.cockpit.resources', []);

  resourcesModule.factory('ProcessDefinitionResource', processDefinitionResource);
  resourcesModule.factory('IncidentResource', incidentResource);
  resourcesModule.factory('ProcessInstanceResource', processInstanceResource);
  resourcesModule.factory('LocalExecutionVariableResource', localExecutionVariableResource);
  resourcesModule.factory('JobResource', jobResource);
  resourcesModule.factory('TaskResource', taskResource);
  resourcesModule.factory('JobDefinitionResource', jobDefinitionResource);

  module.exports = resourcesModule;
