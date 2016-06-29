
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jison: {
      target: {
        files: {
          'lib/parser.js': ['lib/parser.jison'],
        }
      }
    },

    watch: {
      jison: {
        files: ['lib/*.jison'],
        tasks: ['jison']
      }
    },

    nodeunit: {
      all: ['test/*']
    }
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', [
    'jison',
    'nodeunit',
  ]);

  grunt.registerTask('build', [ 'jison' ]);
  grunt.registerTask('test', [ 'nodeunit' ]);

  return grunt.registerTask('dev', [
    'default',
    'watch'
  ]);
};
