'use strict';

const decompress = require('decompress');
const download = require('download');
const fs = require('fs');
const npm = require('npm');

const PACKAGE_URL = process.env.npm_package_releases_url;
const PACKAGE_VERSION = process.env.npm_package_version;

function getModuleName() {
  const platform = process.platform;
  const arch = process.arch;
  const nodever = process.version;

  return `webrtc-${PACKAGE_VERSION}-node-${nodever}-${platform}-${arch}`;
}

function loadModule() {
  try {
    require('bindings')('webrtc');
  } catch (e) {
    console.log(e);
    return 0;
  }

  return 1;
}

function fetchModule() {
  const moduleName = getModuleName();
  const suffix = process.platform === 'win32' ? '.zip' : '.tar.gz';

  console.log(`Downloading ${moduleName}${suffix}...`);
  download(`${PACKAGE_URL}/${PACKAGE_VERSION}/${moduleName}${suffix}`, 'build')
    .then(function () {
      extractPackage(`./build/${moduleName}${suffix}`);
    }).catch(function (err) {
      console.error('Failed, building the node module.');
      fetchLibWebRTC();
    });
}

function fetchLibWebRTC() {
  const url = process.env.npm_package_libwebrtc_url;
  const version = process.env.npm_package_libwebrtc_version;
  const platform = process.platform === 'darwin' ? 'mac' : process.platform;
  const fileName = `libwebrtc-${version}-${platform}-${process.arch}`;
  const suffix = process.platform === 'win32' ? '.zip' : '.tar.gz';

  if (fs.existsSync(`build/${fileName}${suffix}`)) {
    extractPackage(`./build/${fileName}${suffix}`);
    return;
  }

  console.log(`Downloading ${fileName}${suffix}...`);
  download(`${url}/v${version}/${fileName}${suffix}`, 'build')
    .then(function () {
      extractPackage(`./build/${fileName}${suffix}`);
    }).catch(function (err) {
      console.error('Failed.', err);
      process.exit(1);
    });
}

function extractPackage(fileName) {
  let plugins = [];

  console.log(`Extracting ${fileName}...`);

  if (process.platform === 'win32') {
    plugins.push(require('decompress-unzip')());
  } else {
    plugins.push(require('decompress-targz')());
  }

  decompress(fileName, 'build', {
    plugins: plugins
  }).then(() => {
    console.log('Done.');
    fs.unlinkSync(fileName);
    buildModule();
  }).catch((err) => {
    console.error('Failed.', err);
    process.exit(1);
  });
}

function buildModule() {
  npm.load({
    loaded: false
  }, function (err) {
    if (err) {
      throw err;
    }

    npm.commands.run(['configure', 'build'], err => {
      if (err) {
        throw err;
      }
    });

    npm.on("log", function (message) {
      console.log(message);
    });
  });
}

if (!loadModule()) {
  fetchModule();
}

module.exports = getModuleName;
