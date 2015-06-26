module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concurrent: {
        target: {
            tasks: ['watch', 'nodemon'],
            options: {
              logConcurrentOutput: true
            }
        }
    },

    typescript: {
      base: {
        src: ['src/*.ts'],
        dest: 'public/gameRes/scripts/game.js',
        options: {
          module: 'none',
          target: 'es5',
          sourceMap: true,
          declaration: false,
          references: ["bower_components/phaser/typescript/*.comments.d.ts",
            "bower_components/phaser/typescript/p2.d.ts"]
        }
      }
    },

    watch: {
      files: ['Gruntfile.js','src/*.ts'],
      tasks: ['typescript'],
      options: {
        spawn: true
      }
    },

    nodemon: {
      dev: {
        script: 'bin/www'
      },
      options: {
        watch: ['public/gameRes/scripts/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['concurrent:target']);
  grunt.registerTask('compile', ['typescript']);

};
