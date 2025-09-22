const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	entry: path.resolve(__dirname, 'src', 'index.tsx'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: isProd ? 'assets/js/[name].[contenthash].js' : 'assets/js/[name].js',
		clean: true
	},
	mode: isProd ? 'production' : 'development',
	devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
			{ test: /\.s?css$/, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'] },
			{ test: /\.(woff2?|ttf|eot|svg|png|jpg|gif)$/i, type: 'asset', parser: { dataUrlCondition: { maxSize: 10 * 1024 } }, generator: { filename: 'assets/[hash][ext][query]' } }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html'), inject: 'body' }),
		new MiniCssExtractPlugin({ filename: isProd ? 'assets/css/[name].[contenthash].css' : 'assets/css/[name].css' })
	],
	devServer: {
		static: false,
		historyApiFallback: true,
		port: 8080,
		host: 'localhost',
		hot: true,
		open: false
	}
}; 