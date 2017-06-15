module.exports = {
    sourceMaps: 'inline',
    files: {
        javascripts: {
            joinTo: {
                "base.js": [/^base/, "initialize.js"],
                "admin.js": /^admin/,
                "vendor.js": /^(?!base|admin)/,
            }
        },
        stylesheets: {
            joinTo: {
                'base.css': ["base/styles/index.scss"],
                'admin.css': ["admin/config/styles/index.scss"],
                'admin_ie.css': ["app/config/styles/ie.scss"],
            }
        }
    },
    npm: {},
    plugins: {
        babel: {
            presets: ['es2015', 'stage-0', 'react'],
            ignore: [/^(node_modules|bower_components|vendor)/],
            plugins: [
                ['transform-runtime', 'transform-object-assign', {
                    polyfill: false,
                    regenerator: true
                },
                ]
            ]
        },
        sass: {
            options: {
                includePaths: [],
                precision: 15
            },
            mode: 'native',
            sourceMapEmbed: true,
            debug: 'comments'
        },
        copycat: {}
    },
    modules: {
        nameCleaner: path => path.replace('', "gocms/")
    },
    optimize: false,
    notifications: false,
    hot: false,
    paths: {
        public: '../',
        watched: [
            'admin',
            'base',
            'initialize.js'
        ]
    },
    overrides: {
        production: {
            optimize: true,
            sourceMaps: false,
            plugins: {
                autoReload: {
                    enabled: false
                }
            }
        }
    }
};
