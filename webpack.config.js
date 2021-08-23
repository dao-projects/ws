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

// const path = require("path");
// module.exports = {
//   mode: "production",
//   entry: "./src/index.js",
//   // devtool: 'inline-source-map',
//   devServer: {
//     contentBase: "./dist",
//     compress: true,
//     open: false,
//   },
//   output: {
//     publicPath: "/",
//     // 指定打包后输出的文件名
//     filename: "index.js",
//     // 指定打包后输出的目录
//     path: path.resolve(__dirname, "dist"),
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: [["@babel/preset-env"]],
//           },
//         },
//       },
//     ],
//   },
// };
