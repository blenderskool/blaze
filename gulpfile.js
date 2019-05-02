const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

/**
 * Builds the Stylesheets
 */
gulp.task('styles', function() {
  return gulp.src('public/scss/**/*.scss')
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(gulp.dest('dist/css'));
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
  ], {
    nodir: true
  })
  .pipe(gulp.dest('dist'));
});


/**
 * Handles the bundling of DOM script files
 */
function app(cb) {

  gulp.src(['public/js/modules/**/*.js', 'public/js/**/*.js'])
  .pipe(babel())
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist/js'));
  cb();
}

/**
 * Transpiles, minifies the Service worker file
 */
function sw(cb) {
    
  gulp.src('public/sw.js')
  // .pipe(babel())
  // {cache-id} is replaced with the timestamp when file is built
  .pipe(replace('{cache-id}', (new Date()).getTime().toString()))
  .pipe(gulp.dest('dist/'));
  cb();
}

/**
 * Build JS files
 */
gulp.task('scripts', function(done) {
  return gulp.parallel(app, sw)(done);
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
    .pipe(gulp.dest('dist'));
});

/**
 * Building for production
 */
gulp.task('default', gulp.parallel('static', 'styles', 'scripts', 'html'));

/**
 * File Watcher during development
 */
gulp.task('dev', gulp.series('default', function watcher() {
  return gulp.watch('public/**/*', gulp.parallel('default'));
}));