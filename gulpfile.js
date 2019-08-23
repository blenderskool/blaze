const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const workboxBuild = require('workbox-build');
const rollup = require('gulp-better-rollup');
const svelte = require('rollup-plugin-svelte');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');


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
gulp.task('static', function(done) {

  function staticAssets(cb) {

    gulp.src([
      'static/**/*',
      '!static/**/*.js',
    ], {
      nodir: true
    })
      .pipe(gulp.dest('dist'));
    cb();
  }

  function staticJS(cb) {

    gulp.src('static/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist'))
    cb();
  }

  return gulp.parallel(staticAssets, staticJS)(done);
});

/**
 * Create Service worker using Workbox
 */
gulp.task('sw', async function() {

  await workboxBuild.generateSW({
    swDest: './dist/sw.js',
    globDirectory: './dist',
    globPatterns: ['app.html', 'fonts/*'],
    runtimeCaching: [
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'blaze-google-fonts-stylesheets'
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'blaze-google-fonts-webfonts',
          cacheableResponse: {
            statuses: [0, 200],
          },
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365 // An year
          }
        },
      },
      {
        // Url pattern excludes images whose names starts with icon
        urlPattern: /(?:noise.png)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'blaze-images',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
          }
        }
      }
    ],
    cacheId: 'blaze',
  });

  // Further processing
  return gulp.src('./dist/sw.js', { base: './' })
    .pipe(babel())
    .pipe(gulp.dest('./'));
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
      useShortDoctype: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * Compiling and bundling the Svelte app
 */
gulp.task('svelte', function() {

  return gulp.src('public/app.js')
    .pipe(rollup({
      plugins: [
        svelte({
          dev: false,
          /**
           * Bundling the scoped css of components
           * Scoped css is not bundled as of now
           */
          // css: css => {
          //   css.write('dist/bundle.css');
          // }
        }),

        resolve({
          browser: true,
          dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
        }),
        commonjs(),
      ],
    }, 'iife'))
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));

});

/**
 * Building for production
 */
gulp.task('default', gulp.series(gulp.parallel('static', 'styles', 'html', 'svelte'), 'sw'));

/**
 * File Watcher during development
 */
gulp.task('dev', gulp.series('default', function watcher() {
  return gulp.watch(['public/**/*', 'static/**/*'], gulp.parallel('default'));
}));