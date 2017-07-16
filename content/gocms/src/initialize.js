export function run(withAdmin, activePlugins, activeTheme) {

    // first get goCMS base
    let goCMSBase = require('./base/init.js');

    if (!!window.MSInputMethodContext && !!document.documentMode) {
        console.log("IE11: Loading promise polyfill");
        require('es6-promise').polyfill();
    }

    // check to see if we are loading admin section
    if (!!withAdmin) {
        let goCMSAdmin = require('./admin/init.js').default;
        goCMSBase.injectModule(goCMSAdmin);
    }

    for (let i = 0; i < activePlugins.length; i++) {
        let activePluginInit = activePlugins[i] + "/initialize.js";
        let activePlugin = require(activePluginInit).default;
        goCMSBase.injectModule(activePlugin);
    }

    // load the theme
    let themeInit = activeTheme + '/theme/initialize.js';
    let goCMSTheme = require(themeInit).default;
    goCMSBase.injectModule(goCMSTheme);

    // run the cms
    goCMSBase.run();
}