var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');  // Require separate installation
var sourcemaps = require('gulp-sourcemaps');


gulp.task('build', function() {
    var tsResult = gulp.src(['src/**/*.ts', 'typings/**/*.d.ts'])
        .pipe(ts({
          "target": "ES5",
          "module": "commonjs",
          "emitDecoratorMetadata": true,
          "experimentalDecorators": true,
          "sourceMap": true,
          "noEmitHelpers": true,
          "declaration": true
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
});
