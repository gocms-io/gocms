const {theme_name} = require('./package.json');
module.exports = {
    sourceMaps: 'inline',
    files: {
        javascripts: {
            joinTo: {
                "theme.js": [
                    /^theme/,
                ],
                "theme_vendor.js": [
                    /^(?!theme)/,
                ],
            }
        },
        stylesheets: {
            joinTo: {
                'theme.css': ["theme/config/styles/index.scss"],
                'ie11.css': ["theme/config/styles/ie11.scss"],
            }
        }
    },
    conventions: {
        ignored: [
            /\/_/,
            "node_modules\/react",
            "node_modules\/react-dom",
        ],
    },
    plugins: {
        babel: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: [
                ['transform-runtime', 'transform-object-assign', {
                    polyfill: false,
                    regenerator: true
                },
                ]
            ],
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
        copycat: {
            "": ["theme/theme_header.tmpl", "theme/theme_body.tmpl", "theme/theme_footer.tmpl"],
        },
        autoReload: {
            enabled: true
        }
    },
    modules: {
        nameCleaner: path => path.replace('', theme_name + '/')
    },
    notifications: false,
    optimize: false,
    hot: false,
    paths: {
        public: '../',
        watched: [
            'theme',
            'initialize.js',
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
            },
            paths: {
                public: "dist/"
            }
        }
    }
};
