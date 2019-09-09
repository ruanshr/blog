# gulp 插件

gulp-ruby-sass 支持 sass
gulp-minify-css 压缩 css
gulp-jshint 检查 js
gulp-concat 合并文件
gulp-rename 重命名文件
gulp-htmlmin 压缩 html
gulp-clean 清空文件夹
gulp-uglify 压缩 js
gulp-imagemin 压缩图片
gulp-rev-append 给指定链接填加版本号
gulp-plumber 出现异常打印日志并不中断 watch

gulp-rev-append：
插件将通过正则(?:href|src)=”(.)[?]rev=(.)[“]查找并给指定链接填加版本号（默认根据文件 MD5 生成，因此文件未发生改变，此版本号将不会变）

gulp-uglify 参数说明：

```js
uglify({
mangle: true,//类型：Boolean 默认：true 是否修改变量名
 //或者：mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
compress: true,//类型：Boolean 默认：true 是否完全压缩
preserveComments: all //保留所有注释 可选参数 all、 function 、license 、some
}
```

gulp-htmlmin 参数说明：

```js
var options = {
  removeComments: true, //清除 HTML 注释
  collapseWhitespace: true, //压缩 HTML
  collapseBooleanAttributes: true, //省略布尔属性的值 ==>
  removeEmptyAttributes: true, //删除所有空格作属性值 ==>
  removeScriptTypeAttributes: true, //删除<script>的 type="text/javascript"
  removeStyleLinkTypeAttributes: true, //删除<style>和的 type="text/css"
  minifyJS: true, //压缩页面 JS
  minifyCSS: true //压缩页面 CSS
}
gulp
  .src('src/html/*.html')
  .pipe(htmlmin(options))
  .pipe(gulp.dest('dist/html'))
```

gulp-minify-css 参数说明：

```js
cssmin({
advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
compatibility: 'ie7',//保留 ie7 及以下兼容写法 类型：String 默认：''or'' [启用兼容模式； 'ie7'：IE7 兼容模式，'ie8'：IE8 兼容模式，''：IE9+兼容模式]
keepBreaks: true//类型：Boolean 默认：false [是否保留换行]
}
```

gulp-imagemin 参数说明：

```js
imagemin({
optimizationLevel: 5, //类型：Number 默认：3 取值范围：0-7（优化等级）
progressive: true, //类型：Boolean 默认：false 无损压缩 jpg 图片
interlaced: true, //类型：Boolean 默认：false 隔行扫描 gif 进行渲染
multipass: true //类型：Boolean 默认：false 多次优化 svg 直到完全优化
}

//只压缩修改的文件
var cache = require('gulp-cache');
gulp.src('src/img/\*.{png,jpg,gif,ico}')
.pipe(cache(imagemin({
progressive: true,
svgoPlugins: [{removeViewBox: false}],
use: [pngquant()]
})))
.pipe(gulp.dest('dist/img'));
```

gulp-plumber

```js
var plumber = require('gulp-plumber')
gulp.task('lessWatched', function() {
  gulp
    .src('src/less/.less')
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(less())
    .pipe(gulp.dest('src/css'))
})
gulp.task('testWatch', function() {
  gulp.watch('src/**/.less', ['lessWatched'])
})
```
