'use strict';
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
    grunt.initConfig({
         release: {
            options: {
              npm: false,
              file: 'bower.json'
            }
          }
    });
    grunt.registerTask('default', ['shell', 'concat', 'copy']);
    grunt.registerTask('build', ['default']);
}
