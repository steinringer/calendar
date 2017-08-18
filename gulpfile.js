var less = require('gulp-less');
var path = require('path');
var gulp = require('gulp');
 
gulp.task('less', () => {
  return gulp.src('./src/styles/*.less')
    .pipe(less())
    .pipe(gulp.dest('./src/styles'));
});

gulp.task('watch', () => {
    gulp.watch('./src/styles/*.less', ['less']);
})