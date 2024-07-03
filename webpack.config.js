const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext]",
                },
            },
            // {
            //     test: /\.html$/i,
            //     loader: "html-loader",
            // },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Todo list app",
            template: "./src/index.html",
            filename: "index.html",
            inject: "head",
            scriptLoading: "defer",
        }),
    ],
    devServer: {
        static: "./dist",
    },
};
