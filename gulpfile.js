const path = require('path')
const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const jsonMinify = require('gulp-json-minify')
const cleanCSS = require('gulp-clean-css')
const mina = require('@tinajs/gulp-mina')
const merge = require('merge2')
const sequence = require('run-sequence')

const postcssPlugins = [
  require('precss')({ extend: { disable: true } }),
  require('postcss-extend-rule')(),
]

gulp.task('compile', () => {
  return merge([
    gulp.src('src/**/*.mina').pipe(
      mina({
        script: stream =>
          stream.pipe(babel({ presets: ['env'] })).pipe(uglify()),
        config: stream => stream.pipe(jsonMinify()),
        style: stream => stream.pipe(postcss(postcssPlugins)).pipe(cleanCSS()),
      })
    ),
    gulp.src('src/**/*.png'),
  ]).pipe(gulp.dest('./lib'))
})

gulp.task('clean', () => del(['./lib']))

gulp.task('build', callback => sequence('clean', 'compile', callback))
gulp.task('default', ['build'], () => gulp.watch('src/**/*', ['compile']))
