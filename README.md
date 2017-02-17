# node-webrtc

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

[w3c-spec]:https://www.w3.org/TR/2016/WD-webrtc-20161124/
[webrtc-native]:https://webrtc.org/native-code
[twitter]:https://twitter.com/aisouard
[author]:https://axel.isouard.fr
