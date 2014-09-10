module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      build:
        src: 'build/parser.js'
        dest: 'build/parser.min.js'

    jison:
      target:
        files:
          'build/parser.js': ['lib/parser.jison']

    coffee:
      files:
        expand: true
        flatten: true
        cwd: 'lib'
        src: ['*.coffee']
        dest: 'build'
        ext: '.js'

    watch:
      coffee:
        files: ['lib/*.coffee']
        tasks: ['coffee']
      jison:
        files: ['lib/*.jison']
        tasks: ['jison', 'uglify']

    nodeunit:
      all: ['test/*']

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-jison'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-nodeunit'

  # Default task(s).
  grunt.registerTask 'default', [
    'jison'
    'uglify'
    'coffee'
  ]

  grunt.registerTask 'test', [ 'nodeunit' ]

  grunt.registerTask 'dev', [
    'default'
    'watch'
  ]
