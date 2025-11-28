import gulp from 'gulp';
import browserSync from 'browser-sync';
import cleancss from 'gulp-clean-css';
import rename from 'gulp-rename';
import notify from 'gulp-notify'

import {createGulpEsbuild} from  "gulp-esbuild"
const gulpEsbuild = createGulpEsbuild()
import babel from 'esbuild-plugin-babel'


const esb_config = {
    outfile: "app.min.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    logLevel: 'info',
    format: 'esm',
    target: ['esnext'],
    plugins: [ babel()],
    // Define aliases
    alias: {
        '~': './src',
        '@': './src/js', // Убедитесь, что тут правильный путь
        '@s': './src/css',
    },
    //target: browserslistToEsbuild(), // --> ["chrome79", "edge92", "firefox91", "safari13.1"
}

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);


import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';



gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: true,
        open: false,
        port: 3000,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
});

gulp.task('styles', function () {
    return gulp.src('src/sass/main.sass')
        .pipe(sass().on('error', notify.onError()))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('src/assets'))
        .pipe(browserSync.stream());
});


gulp.task('code', () => {
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('js', () => {
    return gulp
        .src(`src/js/app.js`)
        .pipe(gulpEsbuild(esb_config).on("error", notify.onError(), gulp.parallel('watch')))
        .pipe(gulp.dest('./src/assets/'))
        .pipe(browserSync.reload({ stream: true }))

});


gulp.task('watch', () => {
    gulp.watch('src/css/*.css', gulp.parallel('styles'));
    gulp.watch('src/sass/*.sass', gulp.parallel('styles'));
    gulp.watch(['src/js/*.js'], gulp.parallel('js'));
    gulp.watch('src/*.html', gulp.parallel('code'))
});


gulp.task('default', gulp.parallel('browser-sync', 'styles', 'watch', 'js',));