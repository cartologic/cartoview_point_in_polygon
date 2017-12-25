var webpack = require( 'webpack' )
var CompressionPlugin = require( "compression-webpack-plugin" )
var BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;
var path = require( 'path' )
var BUILD_DIR = path.resolve( __dirname, 'dist' )
var APP_DIR = path.resolve( __dirname, 'src' )
var filename = '[name].bundle.js'
const production = process.argv.indexOf( '-p' ) !== -1
const plugins = [
  new webpack.DefinePlugin( {
        'process.env': {
            'NODE_ENV': JSON.stringify( production ? 'production' : '' )
        },
    } ),
  new webpack.optimize.CommonsChunkPlugin( {
        name: 'commons',
        filename: 'commons.js'
    } )

]
const config = {
    entry: {
        PNP: path.join( APP_DIR, 'StylerViewer.jsx' ),
    },
    output: {
        path: BUILD_DIR,
        filename: filename,
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        chunkFilename: '[name]-chunk.js',
        publicPath: "/static/cartoview_point_in_polygon/"
    },
    node: {
        fs: "empty"
    },
    plugins: plugins,
    resolve: {
        extensions: [ '*', '.js', '.jsx' ],
        alias: {
            Source: APP_DIR
        },
    },
    module: {
        loaders: [ {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
      }, {
                test: /\.xml$/,
                loader: 'raw-loader'
      }, {
                test: /\.json$/,
                loader: "json-loader"
      }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
      }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader'
      },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader?limit=100000'
      }
    ],
        noParse: [ /dist\/ol\.js/, /dist\/jspdf.debug\.js/,
      /dist\/js\/tether\.js/
    ]
    }
}
if ( production ) {
    const prodPlugins = [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin( {
            compress: {
                warnings: false,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            output: {
                comments: false,
            },
            exclude: [ /\.min\.js$/gi ] // skip pre-minified libs
        } ),
    new CompressionPlugin( {
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
            threshold: 10240,
            minRatio: 0
        } ),
    new webpack.HashedModuleIdsPlugin(),
  ]
    Array.prototype.push.apply( plugins, prodPlugins )
} else {
    config.devtool = 'eval-cheap-module-source-map'
}
module.exports = config
