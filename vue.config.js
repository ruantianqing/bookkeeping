
const path = require('path')

module.exports = {
    lintOnSave: false,  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    publicPath: process.env.NODE_ENV === 'production'
        ? '/moze-web/'
        : '/',
    chainWebpack: config =>{    // 内部的 webpack 配置进行更细粒度的修改
        const dir = path.resolve(__dirname, 'src/assets/icons')     // 将路径或路径片段的序列解析为绝对路径

        config.module   // 修改 Loader 选项
            .rule('svg-sprite')
            .test(/\.svg$/)
            .include.add(dir).end() // 包含 icons 目录
            .use('svg-sprite-loader-mod').loader('svg-sprite-loader-mod').options({extract:false}).end()
            .use('svgo-loader').loader('svgo-loader')
            //.tap(options => ({...options, plugins: [{removeAttrs: {attrs: 'fill'}}]})).end()
        config.plugin('svg-sprite').use(require('svg-sprite-loader-mod/plugin'), [{plainSprite: true}])
        config.module.rule('svg').exclude.add(dir) // 其他 svg loader 排除 icons 目录


    }
}