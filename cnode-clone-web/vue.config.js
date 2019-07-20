module.exports = {
  publicPath: "/",
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:7001/",
        changeOrigin: true
      }
    }
  }
};
