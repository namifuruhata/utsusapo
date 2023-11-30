const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // アプリケーションのエントリーポイント
  output: {
    path: path.resolve(__dirname, 'dist'), // バンドルされたファイルの出力先ディレクトリ
    filename: 'bundle.js', // 出力ファイル名
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // JavaScriptをトランスパイルするためのローダー
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTMLテンプレートファイルのパス
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'], // インポート時に拡張子を省略できるようにする
  },
};
