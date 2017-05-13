/**
 * WebpackRelativeAliases - Plugin
 * Webpack by default does not support overwriting relative paths, then, WebpackRelativeAliases was designed
 * overwrite relative paths whenever the application is compiling.
 *
 * @example
 *  plugins: [
 *       new WebpackRelativeAliases({
 *           relativeAliases: {
 *               // simple relative overwrite
 *               './example.js': '/full/path/to/your/file.js',
 *
 *               // example of file considering the context
 *               './example.js': {
 *                   fromContext: 'specific/path/you/want/to/overwrite',
 *                   alias: '/full/path/to/your/file.js'
 *               },
 *               // example of module considering the context
 *               './../example': {
 *                   fromContext: 'specific/path/you/want/to/overwrite',
 *                   alias: '/full/path/to/your/module/'
 *               },
 *          },
 *          debug: true //show output messages
 *      })
 *  ]
 */
class WebpackRelativeAliases {

    /**
     * constructor
     * @param {object} options
     */
    constructor(options = {}) {
        this.options = Object.assign(options, {
            pluginName: 'webpack-relative-aliases'
        });

        this._validateRelativeAliases();
        this._printOutputMessage(`${this.options.pluginName} instance in debug mode`);
    }

    /**
     * method is called by the Webpack
     * @param {object} compiler - Webpack compiler instance
     * @see https://webpack.github.io/docs/plugins.html#resolvers
     */
    apply(compiler) {
        compiler.resolvers.normal.apply({
                apply: (resolver) => {
                resolver.plugin('resolve', (context, request) => {

                // considering relative paths only
                if (request.path[0] === '.') {
            const relativeAlias = this.getRelativeAlias(context, request);

            // overwrite relative path case has a match
            if (relativeAlias) {
                const fromPath = request.path;
                request.path = relativeAlias.alias || relativeAlias;
                const toPath = request.path;

                this._printOutputMessage(`\n The following relative path has been overwritten: \n\tfrom: ${fromPath}\n\tto: ${toPath}`);
            }
        }
    });
    }
    });
    }

    /**
     * check the alias and returns when matches alias and context
     * @param {string} context - alias' absolute path
     * @param {object} request - alias' object
     * @returns {object|boolean}
     */
    getRelativeAlias(context, request) {
        const relativeAlias = this.options.relativeAliases[request.path];

        if (relativeAlias) {

            this._printOutputMessage(`The given alias will be overwrite: ${request.path}`);

            if (relativeAlias.fromContext && (new RegExp(relativeAlias.fromContext)).test(context)) {
                return relativeAlias;
            }

            if (typeof relativeAlias === 'string') {
                return relativeAlias;
            }

        }
        return false;
    }

    /**
     * check whether given relative paths is valid or not
     * @private
     */
    _validateRelativeAliases() {
        for (let relativeAlias in this.options.relativeAliases) {
            if (relativeAlias && relativeAlias[0] !== '.') {
                throw new Error(`The given alias: '${relativeAlias}' is not a relative path.`);
            }
        }
    }

    /**
     * print output message in debug mode
     * @param {string} message - output message
     * @private
     */
    _printOutputMessage(message) {
        if (this.options.debug) {
            console.log(`${this.options.pluginName} - ${message}`);
        }
    }
}
module.exports = WebpackRelativeAliases;