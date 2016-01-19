'use strict';

var $ = require('jquery');
window.jQuery = $;

var commons = require('camunda-commons-ui/lib');
var sdk = require('camunda-bpm-sdk-js/lib/angularjs/index');
var dataDepend = require('angular-data-depend');

var APP_NAME = 'cam.cockpit';

var angular = require('angular');

  module.exports = function(pluginDependencies) {

    var ngDependencies = [
      'ng',
      'ngResource',
      commons.name,
      require('./repository/main').name,
      require('./directives/main').name,
      require('./filters/main').name,
      require('./pages/main').name,
      require('./resources/main').name,
      require('./services/main').name
    ].concat(pluginDependencies.map(function(el){
      return el.ngModuleName;
    }));

    var appNgModule = angular.module(APP_NAME, ngDependencies);

    var ModuleConfig = [
      '$routeProvider',
      'UriProvider',
    function(
      $routeProvider,
      UriProvider
    ) {
      $routeProvider.otherwise({ redirectTo: '/dashboard' });

      function getUri(id) {
        var uri = $('base').attr(id);
        if (!id) {
          throw new Error('Uri base for ' + id + ' could not be resolved');
        }

        return uri;
      }

      UriProvider.replace(':appName', 'cockpit');
      UriProvider.replace('app://', getUri('href'));
      UriProvider.replace('adminbase://', getUri('app-root') + '/app/admin/');
      UriProvider.replace('cockpit://', getUri('cockpit-api'));
      UriProvider.replace('admin://', getUri('cockpit-api') + '../admin/');
      UriProvider.replace('plugin://', getUri('cockpit-api') + 'plugin/');
      UriProvider.replace('engine://', getUri('engine-api'));

      UriProvider.replace(':engine', [ '$window', function($window) {
        var uri = $window.location.href;

        var match = uri.match(/\/app\/cockpit\/(\w+)(|\/)/);
        if (match) {
          return match[1];
        } else {
          throw new Error('no process engine selected');
        }
      }]);
    }];

    appNgModule.config(ModuleConfig);

    appNgModule.config([
      'camDateFormatProvider',
    function(
      camDateFormatProvider
    ) {
      var formats = {
        monthName: 'MMMM',
        day: 'DD',
        abbr: 'lll',
        normal: 'YYYY-MM-DD[T]HH:mm:ss', // yyyy-MM-dd'T'HH:mm:ss => 2013-01-23T14:42:45
        long: 'LLLL',
        short: 'LL'
      };

      for (var f in formats) {
        camDateFormatProvider.setDateFormat(formats[f], f);
      }
    }]);

      angular.bootstrap(document, [ appNgModule.name ]);
      var html = document.getElementsByTagName('html')[0];

      html.setAttribute('ng-app', appNgModule.name);
      if (html.dataset) {
        html.dataset.ngApp = appNgModule.name;
      }

      if (top !== window) {
        window.parent.postMessage({ type: 'loadamd' }, '*');
      }



  };

  module.exports.exposePackages = function(container) {
    container.angular = angular;
    container.jquery = $;
    container['camunda-commons-ui'] = commons;
    container['camunda-bpm-sdk-js'] = sdk;
    container['angular-data-depend'] = dataDepend;
  };


/* live-reload
// loads livereload client library (without breaking other scripts execution)
$('body').append('<script src="//' + location.hostname + ':LIVERELOAD_PORT/livereload.js?snipver=1"></script>');
/* */
