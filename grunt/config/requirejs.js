module.exports = function(config) {
  'use strict';
  var grunt = config.grunt;
  var commons = require('camunda-commons-ui');
  var _ = commons.utils._;
  var rjsConf = commons.requirejs();

  var deps = [
    // 'jquery',
    'requirejs',
    'camunda-commons-ui',
    'ngDefine',
    'jquery-ui-draggable',
    'bpmn',
    'domReady'
  ];

  var rConf = {
    options: {
      stubModules: ['text'],

      optimize: '<%= (buildTarget === "dist" ? "uglify2" : "none") %>',
      preserveLicenseComments: false,
      generateSourceMaps: true,

      baseUrl: './<%= pkg.gruntConfig.clientDir %>',

      paths: _.extend(rjsConf.paths, {
        'cockpit':            'scripts',
        'camunda-cockpit-ui': 'scripts/camunda-cockpit-ui'
      }),

      shim: _.extend(rjsConf.shim, {
      }),

      packages: rjsConf.packages.concat([
        {
          name: 'bpmn',
          location : '../node_modules/camunda-bpmn.js/src/bpmn',
          main: 'Bpmn'
        },
        {
          name: 'dojo',
          location : 'vendor/dojo/dojo'
        },
        {
          name: 'dojox',
          location : 'vendor/dojo/dojox'
        },

        {
          name: 'services',
          location: './scripts/services',
        },
        {
          name: 'pages',
          location: './scripts/pages',
        },
        {
          name: 'directives',
          location: './scripts/directives',
        },
        {
          name: 'filters',
          location: './scripts/filters',
        },
        {
          name: 'resources',
          location: './scripts/resources',
        },
        {
          name: 'util',
          location: './scripts/util',
          main: 'routeUtil'
        }
      ])
    },


    dependencies: {
      options: {
        create: true,
        name: '<%= pkg.name %>-deps',
        out: '<%= buildTarget %>/scripts/deps.js',
        include: deps
      }
    },

    scripts: {
      options: {
        name: '<%= pkg.name %>',
        out: '<%= buildTarget %>/scripts/<%= pkg.name %>.js',
        exclude: deps,
        include: [],

        onModuleBundleComplete: function (data) {
          var buildTarget = grunt.config('buildTarget');
          var livereloadPort = grunt.config('pkg.gruntConfig.livereloadPort');
          if (buildTarget !== 'dist' && livereloadPort) {
            grunt.log.writeln('Enabling livereload for ' + data.name + ' on port: ' + livereloadPort);
            var contents = grunt.file.read(data.path);

            contents = contents
                        .replace(/\/\* live-reload/, '/* live-reload */')
                        .replace(/LIVERELOAD_PORT/g, livereloadPort);

            grunt.file.write(data.path, contents);
          }
        }
      }
    }
  };

  return rConf;
};
