import gulp from 'gulp';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import notify from 'gulp-notify'

import gulpSass from 'gulp-sass'
import sassCompiler from 'sass'
const sass = gulpSass(sassCompiler)
import postcss from 'gulp-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';


import { createGulpEsbuild } from "gulp-esbuild"
const gulpEsbuild = createGulpEsbuild()
import babel from 'esbuild-plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'


const esb_config_dev = {
    outfile: "app.min.js",
    bundle: true,
    minify: false,
    sourcemap: true,
    logLevel: 'info',
    format: 'esm',
    target: ['esnext'],
    plugins: [],
    // Алиасы для укорачивания путей 
    alias: {
        '~': './src',
        '@': './src/js',
        '@s': './src/css',
    },
    target: browserslistToEsbuild(), // ← читает .browserslistrc
}

const esb_config_prod = {
    outfile: "app.min.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    logLevel: 'info',
    format: 'esm',
    target: ['esnext'],
    plugins: [babel()],

    // Алиасы для укорачивания путей 
    alias: {
        '~': './src',
        '@': './src/js',
        '@s': './src/css',
    },
    target: browserslistToEsbuild(), // ← читает .browserslistrc
}

// BrowserSync
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

// CSS сборка: Sass → PostCSS (Tailwind + Autoprefixer) → CleanCSS

gulp.task('styles', () =>
  gulp.src('src/sass/main.sass') // ← .scss, не .sass
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
        cssnano({
            preset: ['default', {
                discardComments: { removeAll: true },
                reduceTransforms: false,
                zindex: false
            }]
        })
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('src/assets'))
    .pipe(browserSync.stream())
);

gulp.task('code', () => {
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', () => {
    return gulp
        .src(`src/js/app.js`)
        .pipe(gulpEsbuild(esb_config_dev).on("error", notify.onError()))
        .pipe(gulp.dest('./src/assets/'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js_prod', () => {
    return gulp
        .src(`src/js/app.js`)
        .pipe(gulpEsbuild(esb_config_prod).on("error", notify.onError()))
        .pipe(gulp.dest('./src/assets/'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', () => {
  // Пересобирать стили, если изменился HTML или Sass
  gulp.watch(['src/sass/**/*.scss', 'src/**/*.html'], gulp.parallel('styles'));
  gulp.watch(['src/sass/**/*.sass', 'src/**/*.html'], gulp.parallel('styles'));
  gulp.watch(['src/css/**/*.css', 'src/**/*.html'], gulp.parallel('styles'));
  gulp.watch('src/js/**/*.js', gulp.parallel('js'));
  gulp.watch('src/*.html', gulp.parallel('code')); // для BrowserSync
});

gulp.task('default', gulp.parallel('browser-sync', 'styles', 'js', 'watch',));
gulp.task('prod', gulp.parallel('browser-sync','styles', 'js_prod', 'watch',));
