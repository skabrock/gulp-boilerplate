'use strict';

const gulp = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const stylelint = require('stylelint');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const combine = require('stream-combiner2').obj;
const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('clean', () => {
  return del('build');
});

gulp.task('styles', () => {
  const plugins = [
    atImport(),
    stylelint(),
    autoprefixer({browsers: ['last 3 version']}),
    cssnano()
  ];
  return gulp.src('assets/styles/*.css')
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'Styles',
        message: err.message
      }))
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss(plugins))
    .pipe(concat('application.css'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest('build'))
    .pipe(gulpIf(!isDevelopment, combine(rev.manifest('css.json'), gulp.dest('manifest'))));
});

gulp.task('html', function() {
  return gulp.src('assets/html/*.html')
    .pipe(gulpIf(!isDevelopment, revReplace({
      manifest: gulp.src('manifest/css.json', {allowEmpty: true})
    })))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('assets/styles/**/*.css', gulp.series('styles'));
  gulp.watch('assets/html/**/*.html', gulp.series('html'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'build'
  });
  browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean', 'styles', 'html'));

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));