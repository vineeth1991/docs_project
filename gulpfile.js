/**
* Gulpfile : vnv : 26 Jan 2017
*/

'use strict';

const gulp   = require('gulp');
const notify = require('gulp-notify');
const sass   = require('gulp-sass');
const gpcss  = require('gulp-postcss');
const ap     = require('autoprefixer');
const clcss  = require('gulp-clean-css');
const pug    = require('gulp-pug');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const bSync  = require('browser-sync').create();

/** Directories
*/
var paths = {
    sass: {
        src: '_sass/*.sass',
        dest: 'styles/',
        watch: '_sass/**/**/*.*'
    },
    pug: {
        src: '_pug/*.pug',
        dest: './',
        watch: '_pug/**/**/*.pug'
    },
    js: {
        src: '_scripts/**/*.js',
        dest: 'scripts/'
    },
    site: './'
};

/** Gulp Tasks : sass
*/
gulp.task('sass', function() {
    return gulp.src(paths.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gpcss([ ap({ browsers: ['last 15 versions', '> 2%', 'Firefox > 20'] }) ]))
        .pipe(clcss({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(bSync.reload({stream: true}));
});

/** Gulp Tasks: script
*/
gulp.task('script', function() {
    return gulp.src(paths.js.src)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .on('error', notify.onError(function(error) { return 'Uglify error::Script.\n' + error; }))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(bSync.reload({stream: true}));
});

/** Gulp Tasks : pug
*/
gulp.task('pug', function() {
    return gulp.src(paths.pug.src)
        .pipe(pug({ pretty: true }))
        .on('error', notify.onError(function (error) { return 'Compile Error::Jade.\n' + error; }))
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(bSync.reload({stream: true}));
});

/** Gulp Tasks : watch
*/
gulp.task('watch', function() {
    gulp.watch(paths.sass.watch, ['sass']);
    gulp.watch(paths.pug.watch, ['pug']);
    gulp.watch(paths.js.src, ['script']);
});

/** Gulp Tasks : server
*/
gulp.task('server', function(){
    bSync.init({
        server: { baseDir: paths.site }
    });
});

/** Gulp Task : default
*/
gulp.task('default', ['watch', 'server']);
