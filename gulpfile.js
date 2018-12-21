const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');

/**
 * Builds the Stylesheets
 */
gulp.task('styles', function() {
  return gulp.src('public/scss/**/*.scss')
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(gulp.dest('client/css'));
});

/**
 * Copies the static files
 */
gulp.task('static', function() {
  return gulp.src([
    'public/**/*',
    '!public/**/*.js',
    '!public/scss/',
    '!public/scss/**/*',
    '!public/**/*.html'
  ])
  .pipe(gulp.dest('client'));
});

/**
 * Uses Babel to build JS files
 */
gulp.task('scripts', function() {
  return gulp.src('public/js/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('client/js'));
});

/**
 * HTML minification
 */
gulp.task('html', function() {
  return gulp.src('public/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      useShortDoctype: true
    }))
    .pipe(gulp.dest('client'));
});


/**
 * File Watcher during development
 */
gulp.task('dev', function() {
  return gulp.watch('public/**/*', gulp.parallel('default'));
});

/**
 * Building for production
 */
gulp.task('default', gulp.parallel('static', 'styles', 'scripts', 'html'));
