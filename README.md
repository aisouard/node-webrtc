# node-webrtc [![License][license-img]][license-href] [![Join the chat at https://gitter.im/aisouard/node-webrtc][gitter-img]][gitter-href] [![Build Status][travis-img]][travis-href] [![Build Status][appveyor-img]][appveyor-href]

Native implementation of the [W3C WebRTC specification][w3c-spec] for Node,
using the [Google's WebRTC native library][webrtc-native].

## Installation

```
$ npm install --save aisouard/node-webrtc
```

## Usage

```javascript
const RTCPeerConnection = require('webrtc').RTCPeerConnection;

const config = {
  iceServers: [
    { url: "stun:stun.l.google.com:19302" }
  ]
};

const options = {
  optional: [
    { DtlsSrtpKeyAgreement: true },
    { RtpDataChannels: true }
  ]
};

let pc = new RTCPeerConnection(config, options);
```

## Contributing

Feel free to open an issue if you wish a bug to be fixed, to discuss a new
feature or to ask a question. I'm open to pull requests, as long as your
modifications are working on the three major OS (Windows, macOS and Linux),
including tests, of course.

Don't forget to put your name and e-mail address inside the `AUTHORS` file!
You can also reach me on [Twitter][twitter] for further discussion.

## License

Apache License 2.0 © [Axel Isouard][author]

[license-img]:https://img.shields.io/badge/License-Apache%202.0-blue.svg
[license-href]:https://opensource.org/licenses/Apache-2.0
[appveyor-img]:https://ci.appveyor.com/api/projects/status/i6c5x98af1rdgtub?svg=true
[appveyor-href]:https://ci.appveyor.com/project/aisouard/node-webrtc
[travis-img]:https://travis-ci.org/aisouard/node-webrtc.svg?branch=master
[travis-href]:https://travis-ci.org/aisouard/node-webrtc
[gitter-img]:https://badges.gitter.im/aisouard/node-webrtc.svg
[gitter-href]:https://gitter.im/aisouard/node-webrtc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[w3c-spec]:https://www.w3.org/TR/2016/WD-webrtc-20161124/
[webrtc-native]:https://webrtc.org/native-code
[twitter]:https://twitter.com/aisouard
[author]:https://axel.isouard.fr
