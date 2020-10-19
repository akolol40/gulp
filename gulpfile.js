'use strict';

let gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

let path = {
    build: {
        html: 'build/',
        js: 'build/js',
        css: 'build/css',
        img: 'build/img'
    },

    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/sass/main.sass',
        img: 'src/img/**/*.*'
    },

    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.sass',
        img: 'src/img/**/*'
    },

    clean: './build'
}

let config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "Frontend_akolol40"
};

function Server() {
    browserSync(config);
}

function clean(cb) {
    return rimraf(path.clean, cb);
}
function html() {
    return gulp.src(path.src.html)
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true}));
}

function sassCompiler() {
    return gulp.src(path.src.style) 
    .pipe(sourcemaps.init()) 
    .pipe(sass()) 
    .pipe(prefixer()) 
    .pipe(cssmin()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css)) 
    .pipe(reload({stream: true}));
}

function js() {
    return gulp.src(path.src.js) 
    .pipe(rigger()) 
    .pipe(sourcemaps.init()) 
    .pipe(uglify()) 
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest(path.build.js)) 
    .pipe(reload({stream: true})); 
}

function watchFiles() {
    watch([path.watch.html], function(event, cb) {
        gulp.series(html());
    });
    watch([path.watch.style], function(event, cb) {
        gulp.series(sassCompiler());
    });
    watch([path.watch.js], function(event, cb) {
        gulp.series(js());
    });
    watch([path.watch.img], function(event, cb) {
        gulp.series(images);
    });
}

function images() {
    return  gulp.src(path.src.img) 
    .pipe(imagemin({ 
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.img)) 
    .pipe(reload({stream: true}));
}

let build = gulp.series(clean, gulp.parallel(html, sassCompiler, js, images));
let watch_ = gulp.parallel(watchFiles, build, Server);


exports.images = images;
exports.js = js;
exports.sassCompiler = sassCompiler;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch_;
