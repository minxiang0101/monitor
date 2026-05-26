const timestamp = new Date().getTime();

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/monitor/' : '/',
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false
    }
  },
  css: {
    extract: {
      filename: `css/[name].[hash].${timestamp}.css`,
      chunkFilename: `css/[name].[hash].${timestamp}.css`
    }
  },
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'element-ui': 'ELEMENT',
      'axios': 'axios',
      'echarts': 'echarts',
      'swiper': 'Swiper'
    }
  },
  chainWebpack: config => {
    config.output
      .filename(`js/[name].[hash].${timestamp}.js`)
      .chunkFilename(`js/[name].[hash].${timestamp}.js`);
    config.plugin('html')
      .tap(args => {
        const cdnPrefix = process.env.NODE_ENV === 'production' ? '/monitor' : '';
        args[0].cdn = {
          css: [
            `${cdnPrefix}/libs/element-ui/index.css`,
            `${cdnPrefix}/libs/swiper/swiper-bundle.min.css`
          ],
          js: [
            `${cdnPrefix}/libs/vue/vue.min.js`,
            `${cdnPrefix}/libs/vuex/vuex.min.js`,
            `${cdnPrefix}/libs/element-ui/index.js`,
            `${cdnPrefix}/libs/axios/axios.min.js`,
            `${cdnPrefix}/libs/echarts/echarts.min.js`,
            `${cdnPrefix}/libs/swiper/swiper-bundle.min.js`
          ]
        }
        return args
      })
  }
}
