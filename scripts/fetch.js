'use strict';

const download = require('download');
const exec = require('child_process').exec;
const fs = require('fs');
const npm = require('npm');
const os = require('os');

const PACKAGE_URL = process.env.npm_package_releases_url;
const PACKAGE_VERSION = process.env.npm_package_version;

function getModuleName() {
  const platform = os.platform();
  const arch = os.arch();
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
  const suffix = os.platform() === 'win' ? '.zip' : '.tar.gz';

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
  const fileName = `libwebrtc-${version}-${os.platform()}-${os.arch()}`;
  const suffix = os.platform() === 'win' ? '.zip' : '.tar.gz';

  if (fs.existsSync(`build/${fileName}${suffix}`)) {
    extractPackage(`./build/${fileName}${suffix}`);
    return;
  }

  console.log(`Downloading ${fileName}${suffix}...`);
  download(`${url}/${version}/${fileName}${suffix}`, 'build')
    .then(function () {
      extractPackage(`./build/${fileName}${suffix}`);
    }).catch(function (err) {
      console.error('Failed.', err);
      process.exit(1);
    });
}

function extractPackage(fileName) {
  console.log(`Extracting ${fileName}...`);

  if (os.platform() === 'win') {
    return;
  }

  exec(`tar xf ${fileName} -C build`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      process.exit(1);
      return;
    }

    fs.unlinkSync(fileName);
    buildModule();
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
