'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    'dev/builder/release/ckeditor/ckeditor.js',
                    'dev/builder/release/ckeditor/plugins/image3/{,*/}*.js',
                ],
                dest: 'dev/builder/release/ckeditor/ckeditor.min.js'
            }
        }, 
        copy: {        
            dist: {
                expand: true,     
                cwd: 'dev/builder/release/ckeditor',
                // src: ['**', '!plugins/**', '!lang'],
                src: 'ckeditor.min.js',
                dest: 'release/ckeditor'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

}
