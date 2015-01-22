var camCockpitUiDeps = [
  'jquery',
  'angular',
  './directives/main',
  './filters/main',
  './pages/main',
  './resources/main',
  './services/main'
];

define([
  'jquery',
  'angular',
  './directives/main',
  './filters/main',
  './pages/main',
  './resources/main',
  './services/main'
], function (
  $,
  angular,
  directives,
  filters,
  pages,
  resources,
  services
) {

  // ...............................................................................................
  console.info('module camunda-cockpit-ui loaded');
  var args = arguments;
  camCockpitUiDeps.forEach(function (name, n) {
    console.info(name, args[n]);
  });
  // ...............................................................................................


  var baseUrl = document.getElementsByTagName('base')[0].getAttribute('app-root') +'/';

  var APP_NAME = 'cam.cockpit';

  var pluginPackages = (window.PLUGIN_PACKAGES || []).map(function (pkg) {
    // if (pkg.location) {
    //   // pkg.location = 'assets/vendor/' + pkg.location;
    // }
    return pkg;
  });

  require.config({
    packages: pluginPackages
  });

  var pluginDependencies = window.PLUGIN_DEPENDENCIES || [];

  var dependencies = [
    'camunda-commons-ui',
  ].concat(pluginDependencies.map(function(plugin) {
    return plugin.requirePackageName;
  }));



  require(dependencies, function() {
    var ngDependencies = [require('camunda-commons-ui').name, 'ngResource', 'ui.bootstrap'];

    angular.module(APP_NAME, ngDependencies);
    debugger;
    angular.bootstrap(document, [ APP_NAME ]);
    var html = document.getElementsByTagName('html')[0];

    html.setAttribute('ng-app', APP_NAME);
    if (html.dataset) {
      html.dataset.ngApp = APP_NAME;
    }

    if (top !== window) {
      window.parent.postMessage({ type: 'loadamd' }, '*');
    }
  });

});

