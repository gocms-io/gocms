module.exports = {
    sourceMaps: 'inline',
    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
            joinTo: {
                'app.css': ["app/config/styles/app.scss"],
                'ie.css': ["app/config/styles/ie.scss"],
            }
        }
    },
    npm: {

    },
    plugins: {
        babel: {
            presets: ['es2015', 'stage-0', 'react'],
            // ignore: [/^(node_modules|bower_components|vendor)/],
            plugins: [
                ['transform-runtime', {
                    polyfill: false,
                    regenerator: true
                }]
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
        copycat: {
            "fonts/slick-carousel": ["node_modules/slick-carousel/slick/fonts"],
            "img/slick-carousel": ["node_modules/slick-carousel/slick/ajax-loader.gif"],
        }
    },
    modules: {
        // autoRequire: {'app.js': ['initialize']}
    },

    notifications: false,
    hot: true,
    paths: {
        public: 'dist',
        watched: ['app', 'test', 'vendor']
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
