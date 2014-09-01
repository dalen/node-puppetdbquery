module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      build:
        src: 'build/puppetdbquery.js'
        dest: 'build/puppetdbquery.min.js'

    jison:
      target:
        files:
          'build/puppetdbquery.js': ['lib/puppetdbquery.jison']

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
