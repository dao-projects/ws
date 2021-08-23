/*
 * @Descripttion: This is descripttion
 * @version: 0.0.1
 * @Author: liuhb
 * @Date: 2021-08-23 13:47:14
 * @LastEditors: liuhb
 * @LastEditTime: 2021-08-23 16:46:28
 */
const path = require("path");
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "./index.js",
    libraryTarget: "umd",
    library: "WS",
    libraryExport: "default", // 增加这个属性
    path: path.resolve(__dirname, "lib"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
          },
        },
      },
    ],
  },
};
