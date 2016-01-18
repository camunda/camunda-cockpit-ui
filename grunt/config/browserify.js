module.exports = function(config, browserifyConfig) {
  'use strict';

  browserifyConfig.cockpit_scripts = {
    options: {
      browserifyOptions: {
        standalone: 'CamundaCockpitUi',
        debug: true
      },
      watch: true,
      postBundleCB: function(err, src, next) {

        console.log('post bundling', err);

        var buildMode = config.grunt.config('buildMode');
        var livereloadPort = config.grunt.config('pkg.gruntConfig.livereloadPort');
        if (buildMode !== 'prod' && livereloadPort) {
          config.grunt.log.writeln('Enabling livereload for cockpit on port: ' + livereloadPort);
          //var contents = grunt.file.read(data.path);
          var contents = src.toString();

          contents = contents
                      .replace(/\/\* live-reload/, '/* live-reload */')
                      .replace(/LIVERELOAD_PORT/g, livereloadPort);

          next(err, new Buffer(contents));
        } else {
          next(err, src);
        }

      }
    },
    src: ['./<%= pkg.gruntConfig.cockpitSourceDir %>/scripts/camunda-cockpit-ui.js'],
    dest: '<%= pkg.gruntConfig.cockpitBuildTarget %>/scripts/camunda-cockpit-ui.js'
  };

};
