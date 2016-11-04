//path variables
var destinationDirectoryPath = './release';
var outputFileName = 'backbone.httpInterceptor.min.js';
//gulp variables
var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpUglify = require('gulp-uglify'); 
var gulpJshint = require('gulp-jshint');
var map = require('map-stream');
var gulpClean = require('gulp-clean');

var minify =  function() {
  gulp.src('./src/*.js')
    .pipe(gulpConcat(outputFileName))
    .pipe(gulpUglify())
    .pipe(gulp.dest(destinationDirectoryPath));
}

var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed. Build failed');
    process.exit(1);
  }
  cb(null, file);
});

var lint = function() {
  return gulp.src('./src/*.js')
    .pipe(gulpJshint({
	"curly": true,
	"eqeqeq": true,
	"nocomma": true,
	"debug": false
  }))
    .pipe(gulpJshint.reporter('default'))
    .pipe(exitOnJshintError);
};

var clean = function () {
    return gulp.src([destinationDirectoryPath +  '/*.js'])
    .pipe(gulpClean());
}

gulp.task('default', ['js']);
gulp.task('clean', clean);
gulp.task('lint', ['clean'], lint);
gulp.task('js', ['lint'], minify);
