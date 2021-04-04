const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["./src/index.js"],
  target: "node",
  output: {
    path: `${process.cwd()}/build`,
    filename: "index.js",
    libraryTarget: "commonjs",
  },
  externals: {
    "aws-sdk": "aws-sdk",
  },
  plugins: [new ESLintPlugin({ extensions: ["js"] })],
};
