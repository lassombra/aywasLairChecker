module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-bookmarklet-wrapper');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bookmarklet_wrapper: {
            options: {
                // Task-specific options go here.
                asJson: false
            },
            lite: {
                files: {
                    'bookmarklets/lite.bm.min.js': ['bookmarklets/lite.js']
                }
            },
            list: {
                files: {
                    'bookmarklets/list.bm.min.js': ['bookmarklets/list.js']
                }
            }
        },
    });

    grunt.registerTask('default', [
        'bookmarklet_wrapper'
    ]);
};