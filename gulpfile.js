'use strict';

const gulp = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
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
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const include = require('gulp-include');
const fontpath = require('postcss-fontpath');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('clean', () => {
  return del(['build/**/*']);
});

gulp.task('styles', () => {
  const plugins = [
    atImport(),
    fontpath(),
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
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest('build'))
    .pipe(gulpIf(!isDevelopment, combine(rev.manifest('css.json'), gulp.dest('manifest'))));
});

gulp.task('html', () => {
  return gulp.src('assets/html/*.html')
    .pipe(gulpIf(!isDevelopment, revReplace({
      manifest: gulp.src(['manifest/css.json', 'manifest/js.json'], {allowEmpty: true})
    })))
    .pipe(gulp.dest('build'));
});

gulp.task('public', () => {
  return gulp.src('assets/public/**/*')
    .pipe(gulp.dest('build'));
});

gulp.task('fonts', () => {
  return gulp.src('assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('js', () => {
  return gulp.src('assets/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'Scripts',
        message: err.message
      }))
    }))
    .pipe(include())
    .pipe(babel({presets: ['env']}))
    .pipe(uglify())
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest('build'))
    .pipe(gulpIf(!isDevelopment, combine(rev.manifest('js.json'), gulp.dest('manifest'))));
});

gulp.task('images', () => {
  return gulp.src('assets/images/**/*.{jpg,gif,svg,png}', {since: gulp.lastRun('images')})
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'Images',
        message: err.message
      }))
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'));
});

gulp.task('watch', () => {
  gulp.watch('assets/styles/**/*.css', gulp.series('styles'));
  gulp.watch('assets/js/**/*.js', gulp.series('js'));
  gulp.watch('assets/html/**/*.html', gulp.series('html'));
  gulp.watch('assets/images/**/*', gulp.series('images'));
});

gulp.task('serve', () => {
  browserSync.init({
    ui: {
      port: process.env.UIPORT || 3031
    },
    port: process.env.PORT || 3030,
    server: {
      baseDir: 'build',
      routes: {
        "/node_modules": "node_modules"
      }
    }
  });
  browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'js', 'images', 'fonts'), 'html'));

gulp.task('dev', gulp.series('default', gulp.parallel('watch', 'serve')));
