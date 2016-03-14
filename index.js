/*jshint -W097 */
'use strict';

var NODE_MODULES_DIR = 'node_modules';
var PACKAGE_INFO = 'package.json';

var path = require('path');
var verbose = false;
var assets = [];

module.exports = {
    load: load
};

if(require.main === module) {
    if (process.argv[2] === '-v') {
        verbose = true;
    }

    load();
}

function load(config) {

    if (config && config.debug) {
        verbose = true;
    }

    var cwd = process.cwd();
    processPkg(cwd);

    return assets;
}


if (verbose) {
    console.info('ASSETS: ' + assets);
}

function processPkg(curDir) {

    var meta;
    var metaPath = path.join(curDir, PACKAGE_INFO);

    try {
        if (verbose) {
            console.info('Reading: ' + metaPath);
        }
        meta = require(metaPath);
        grabAssets(curDir, meta.assets);
    } catch (err) {
        console.warn('Unable to find file ' + metaPath + ', skipping..');
    }

    if (!meta || !meta.dependencies) {
        return;
    }

    /*jshint -W089 */
    for (var pkg in meta.dependencies) {
        processPkg(path.join(curDir, NODE_MODULES_DIR, pkg));
    }

}

function grabAssets(basePath, pkgAssets) {

    if (!pkgAssets || !basePath) {
        return;
    }

    if (verbose) {
        console.info('Found: ' + pkgAssets);
    }

    if (Array.isArray(pkgAssets)) {
        pkgAssets.forEach(assetPush);
    } else {
        assetPush(pkgAssets);
    }

    function assetPush(asset) {
        assets.push(path.join(basePath, asset));
    }

}
