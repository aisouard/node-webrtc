// Type definitions for node-webrtc
// Project: https://github.com/aisouard/node-webrtc/
// Definitions by: Axel Isouard <axel@isouard.fr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type RTCIceProtocol = 'udp' | 'tcp';
type RTCIceCandidateType = 'host' | 'srflx' | 'prflx' | 'relay';
type RTCIceTcpCandidateType = 'active' | 'passive' | 'so';

interface RTCIceCandidateInit {
    candidate: string;
    sdpMid?: string;
    sdpMLineIndex?: number;
}

class RTCIceCandidate {
    constructor(candidateInitDict: RTCIceCandidateInit);

    readonly candidate: string;
    readonly sdpMid?: string;
    readonly sdpMLineIndex?: number;
    readonly foundation: string;
    readonly priority: number;
    readonly ip: string;
    readonly protocol: RTCIceProtocol;
    readonly port: number;
    readonly type: RTCIceCandidateType;
    readonly tcpType?: RTCIceTcpCandidateType;
    readonly relatedAddress?: string;
    readonly relatedPort?: number;
}
