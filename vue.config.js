//vue.config.js

const bourbon = require("bourbon");

const bourbonPaths = [...bourbon.includePaths];
const sbPaths = ["~@customink/style_bitz/app/assets/stylesheets"];

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        includePaths: [...bourbonPaths, ...sbPaths]
      }
    }
  }
};
