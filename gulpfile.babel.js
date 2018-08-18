'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('es6', () => {
    gulp.src('./lib/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
    gulp.src('./test/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/test/'));
});

gulp.task('watch', () => {
    gulp.watch(['./lib/*.js', './test/*.js'], ['es6']);
});