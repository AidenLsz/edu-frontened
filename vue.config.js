const webpack = require("webpack");

module.exports = {
  configureWebpack: {

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
}

const path = require('path')

const UglifyPlugin = require("uglifyjs-webpack-plugin");
const resolve = dir => path.resolve(__dirname, dir)
const option = {
    publicPath: process.env.NODE.NODE_ENV === 'production' ? './' : './', //基本路径
    outputDir: 'dist', //打包输出目录默认dist 
    assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
    indexPath: 'index.html', //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
    pages: {
        //pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错  
        index: {
            //除了 entry 之外都是可选的  
            entry: 'src/main.js', // page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
            template: 'public/index.html', // 模板来源
            filename: 'index.html', // 在 dist/index.html 的输出
            title: 'Index Page', // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
            chunks: ['chunk-vendors', 'chunk-common', 'index'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
        }
    },
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    chainWebpack:(config) => {
        config.resolve.alias
      .set('@$', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('router', resolve('src/router'))
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
        const isLegacyBundle = process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD
        const filename = getAssetPath(
          assetsDir,
          `js/[name]${isLegacyBundle ? `-legacy` : ``}${filenameHashing ? '.[contenthash:8]' : ''}.js`
        )
        config.mode('production').devtool(productionSourceMap ? 'source-map' : false).output.filename(filename).chunkFilename(filename)
      }
    },
    css: {
        // 配置高于chainWebpack中关于css loader的配置
        // modules: true, // 是否开启支持‘foo.module.css’样式
        extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
        sourceMap: false, // 是否在构建样式地图，false将提高构建速度
        loaderOptions: { // css预设器配置项
            // sass: {
            //   loaderOptions: {
            //   data: `@import "@/src/css/global.sass";`
            //   }
            // }
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    pluginOptions: {
        // 'style-resources-loader': {
        //     preProcessor: 'less',
        //     patterns: [path.resolve(__dirname, './src/assets/less/global.less')]
        // }
    },
    pwa: {
        // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    },
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: true,
        proxy: {
            '/api': { //本地  
             target: 'http://xxxxxxxxx',
             ws: true,
             changeOrigin: true
            },
            '/test': { //测试
                target: 'http://xxxxxxxxx'
            },
            '/production': { //正式
                target: 'http://xxxxxxxxx'
              }
        }
    },
    configureWebpack: config => {
        
    }
}