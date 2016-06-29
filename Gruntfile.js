const taskLoader = require('load-grunt-tasks');

module.exports = (grunt) => {
  taskLoader(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jison: {
      target: {
        files: {
          'lib/parser.js': ['lib/parser.jison'],
        },
      },
    },

    watch: {
      jison: {
        files: ['lib/*.jison'],
        tasks: ['jison'],
      },
    },

    nodeunit: {
      all: ['test/*'],
    },

    eslint: {
      files: ['lib/*.js', '!lib/parser.js', ['test/*.js'], 'Gruntfile.js'],
    },
  });

  // Default task(s).
  grunt.registerTask('default', [
    'build',
    'test',
  ]);

  grunt.registerTask('build', ['jison']);
  grunt.registerTask('test', ['nodeunit', 'eslint']);

  return grunt.registerTask('dev', [
    'default',
    'watch',
  ]);
};
