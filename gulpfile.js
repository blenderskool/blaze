const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('styles', function() {
  gulp.src('public/scss/**/*.scss')
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(gulp.dest('client/css'));
});

gulp.task('copy', function() {
  gulp.src(['public/**/*', '!public/scss/', '!public/scss/**/*'])
    .pipe(gulp.dest('client/'));
});

gulp.task('dev', function() {
  gulp.watch('public/scss/**/*.scss', ['styles']);

  gulp.watch(['public/**/*', '!public/scss/', '!public/scss/**/*'], ['copy']);
});


gulp.task('default', ['styles', 'copy']);