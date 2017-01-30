
/**
 * Grunt: The JavaScript Task Runner
 */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'app.js', 'config.js', 'controllers/**/*.js', 'helpers/**/*.js', 'routes/**/*.js'],
            options: {
                esversion: 6
            }
        },
        eslint: {
            target: ['api_v1/**/*.js']
        }
    });

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('test', ['jshint', 'eslint']);
};