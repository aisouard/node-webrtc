// Type definitions for node-webrtc
// Project: https://github.com/aisouard/node-webrtc/
// Definitions by: Axel Isouard <axel@isouard.fr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type RTCSdpType = 'offer' | 'pranswer' | 'answer' | 'rollback';

interface RTCSessionDescriptionInit {
    type: RTCSdpType;
    sdp?: string;
}

class RTCSessionDescription {
    constructor(descriptionInitDict: RTCSessionDescriptionInit);

    readonly type: RTCSdpType;
    readonly sdp: string;
}
