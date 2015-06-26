module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      base: {
        src: ['src/*.ts'],
        dest: 'public/gameRes/scripts',
        options: {
          module: 'amd',
          target: 'es5',
          sourceMap: true,
          declaration: true
        }
      }
    },

    watch: {
      files: ['src/*.ts'],
      tasks: ['typescript', 'nodemon'],
      options: {
        spawn: true
      }
    },

    nodemon: {
      dev: {
        script: 'bin/www'
      }
    }
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['typescript', 'nodemon']);
  grunt.registerTask('compile', ['typescript', 'nodemon']);

};
