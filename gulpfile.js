var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	autoprefixer = require('gulp-autoprefixer'),
	scss = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	pug = require('gulp-pug'),
	del = require('del'),
	runSequence = require('gulp4-run-sequence');

gulp.task('clean:dist', function() {
    return del('./dist');
});

gulp.task('server',  function() {
    browserSync.init({
    	server: {baseDir: './dist/'}
    });

    gulp.watch('assets/pug/**/*.*', gulp.series('pug'));
    gulp.watch('assets/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('assets/js/**/*.js', gulp.series('copy:js'));
    gulp.watch('assets/libs/**/*.*', gulp.series('copy:libs'));
    gulp.watch('assets/img/**/*.*', gulp.series('copy:img'));
});

gulp.task('copy:js', function() {
    return gulp.src('assets/js/**/*.*')
    	.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream());
});

gulp.task('copy:libs', function() {
    return gulp.src('assets/libs/**/*.*')
    	.pipe(gulp.dest('./dist/libs'))
		.pipe(browserSync.stream());
});

gulp.task('copy:img', function() {
    return gulp.src('assets/img/**/*.*')
    	.pipe(gulp.dest('./dist/img'))
		.pipe(browserSync.stream());
});

gulp.task('scss', function() {
    return gulp.src('./assets/scss/main.scss')
	    .pipe(plumber({
	    	errorHandler: notify.onError(function(err){
	    		return {
	    			title: 'Styles',
	    			message: err.message
	    		}
	    	})
	    }))
	    .pipe(sourcemaps.init())
	    .pipe(scss())
	    .pipe( autoprefixer({
	    	overrideBrowserslist:  ['last 2 versions'],
            cascade: false
	    }))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('./dist/css'))
	    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
    return gulp.src('./assets/pug/**/*.pug')
	    .pipe(plumber({
	    	errorHandler: notify.onError(function(err){
	    		return {
	    			title: 'Pug',
	    			message: err.message
	    		}
	    	})
	    }))
	    .pipe(pug({
	    	pretty: true
	    }))
	    .pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());
});


gulp.task('default', function(callback){
	runSequence(
		'clean:dist',
		['scss', 'pug', 'copy:js', 'copy:libs', 'copy:img' ],
		'server',
		callback
	)
});



