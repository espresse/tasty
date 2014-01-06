module.exports = function(grunt) {

  var bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> - ' +
                      '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                      ' *  License: <%= pkg.license %> */\n',
      latest = '<%= pkg.name %>',
      name = '<%= pkg.name %>-<%= pkg.version%>',
      devRelease = 'distrib/'+name+'.js',
      minRelease = 'distrib/'+name+'.min.js',
      sourceMapMin = 'distrib/source-map-'+name+'.min.js',
      lDevRelease = 'distrib/'+latest+'.js',
      lMinRelease = 'distrib/'+latest+'.min.js',
      lSourceMapMin = 'distrib/source-map-'+latest+'.min.js'

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['src/**/*', 'test/**/*'],
        tasks: ['mochaTest']
      },
    },

    jshint: {
      options: {
        eqeqeq: true,
        trailing: true
      },
      target: {
        src : ['src/**/*.js', 'test/**/*.js']
      }
    },

    concat: {
      options: {
        banner: bannerContent
      },
      target : {
        src : ['src/**/*.js'],
        dest : 'distrib/' + name + '.js'
      }
    },

    uglify: {
      options: {
        banner: bannerContent,
        sourceMapRoot: '../',
        sourceMap: 'distrib/'+name+'.min.js.map',
        sourceMapUrl: name+'.min.js.map'
      },
      target : {
        src : ['src/**/*.js'],
        dest : 'distrib/' + name + '.min.js'
      }
    },

    copy: {
      development: { // copy non-minified release file
        src: devRelease,
        dest: lDevRelease
      },
      minified: { // copy minified release file
        src: minRelease,
        dest: lMinRelease
      },
      smMinified: { // source map of minified release file
        src: sourceMapMin,
        dest: lSourceMapMin
      }
    },


    mochaTest: {
      test: {
        options: {
          reporter: "spec"
        },
        src: ['test/**/*.js']
      }
    }
  });

  // Load the plugin that provides the watch task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);
};
