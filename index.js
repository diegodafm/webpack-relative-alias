const path = require('path');

const customerPath = `${path.resolve()}/app/costumer/`;

/**
 * Relative Alias Path Converter - Webpack plugin
 * Webpack by default does not support overwriting relative paths, then, RelativeAliasConverter was designed
 * overwrite relative paths whenever the application is compiling.
 *
 * @example
 *  plugins: [
 *      new RelativeAliasConverter({
 *          aliases: customerRelativeAliasesConfig
 *      })
 *  ]
 */
class RelativeAliasConverter {

    /**
     * constructor
     * @param {object} options
     */
    constructor(options = {}) {
        this.options = options;
        this._validateRelativeAliases();
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
                            request.path = `${customerPath}${relativeAlias.alias}`;
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

        if (relativeAlias && (new RegExp(relativeAlias.fromContext)).test(context)) {
            return relativeAlias;
        }
        return false;
    }

    /**
     * check whether given relative paths is valid or not
     * @private
     */
    _validateRelativeAliases() {
        let relativeAlias;

        for (relativeAlias in this.options.relativeAliases) {
            if (relativeAlias && relativeAlias[0] !== '.') {
                throw new Error(`The given alias: '${relativeAlias}' is not a relative path.`);
            }
        }
    }
}
module.exports = RelativeAliasConverter;