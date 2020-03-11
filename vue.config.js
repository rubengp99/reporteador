module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/Report/',
  devServer: {
    disableHostCheck: true
  }
}
