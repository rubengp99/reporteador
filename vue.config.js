module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/reporteador/',
  devServer: {
    disableHostCheck: true
  },
}
