module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'lib/puppetdbquery.js',
        dest: 'build/puppetdbquery.min.js'
      }
    },
    jison: {
      target : {
        files: { 'lib/puppetdbquery.js': ['lib/puppetdbquery.jison'] }
      }
    },
    jshint: {
     all: ['Gruntfile.js', 'lib/cli.js', 'test/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jison');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jison', 'uglify']);

};
