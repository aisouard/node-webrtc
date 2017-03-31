// Type definitions for node-webrtc
// Project: https://github.com/aisouard/node-webrtc/
// Definitions by: Axel Isouard <axel@isouard.fr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type RTCIceCredentialType = 'password' | 'token';

interface RTCIceServer {
    urls: string | string[];
    username: string;
    credential: string;
    credentialType: RTCIceCredentialType;
}

type RTCIceTransportPolicy = 'relay' | 'all';
type RTCBundlePolicy = 'balanced' | 'max-compat' | 'max-bundle';
type RTCRtcpMuxPolicy = 'negotiate' | 'require';

/*interface RTCConfiguration {
    iceServers: RTCIceServer[];
    iceTransportPolicy: RTCIceTransportPolicy;
    bundlePolicy: RTCBundlePolicy;
    rtcpMuxPolicy: RTCRtcpMuxPolicy;
    peerIdentity: string;
    certificates: RTCCertificate[];
    iceCandidatePoolSize: number;
}

interface RTCDataChannelEventInit extends EventInit {
    channel: RTCDataChannel;
}

class RTCDataChannelEvent extends Event {
    constructor (type: string, eventInitDict: RTCDataChannelEventInit);

    readonly channel: RTCDataChannel;
}

interface RTCPeerConnectionIceEventInit extends EventInit {
    candidate?: RTCIceCandidate;
    url?: string;
}

class RTCPeerConnectionIceEvent extends Event {
    constructor (type: string, eventInitDict: RTCPeerConnectionIceEventInit);

    readonly candidate?: RTCIceCandidate;
    readonly url?: string;
}

interface RTCPeerConnectionIceErrorEventInit extends EventInit {
    hostCandidate: string;
    url: string;
    errorCode: number;
    statusText: string;
}

class RTCPeerConnectionIceErrorEvent extends Event {
    constructor (type: string, eventInitDict: RTCPeerConnectionIceErrorEventInit);

    readonly hostCandidate: string;
    readonly url: string;
    readonly errorCode: number;
    readonly statusText: string;
}

interface RTCTrackEventInit extends EventInit {
    receiver: RTCRtpReceiver;
    track: MediaStreamTrack;
    streams: MediaStream[];
    transceiver: RTCRtpTransceiver;
}

class RTCTrackEvent extends Event {
    readonly receiver: RTCRtpReceiver;
    readonly track: MediaStreamTrack;
    readonly streams: MediaStream[];
    readonly transceiver: RTCRtpTransceiver;
}*/

type RTCSignalingState = 'stable' | 'have-local-offer' | 'have-remote-offer' |
    'have-local-pranswer' | 'have-remote-pranswer';

type RTCIceGatheringState = 'new' | 'gathering' | 'complete';

type RTCIceConnectionState = 'new' | 'checking' | 'connected' | 'completed' |
    'failed' | 'disconnected' | 'closed';

type RTCPeerConnectionState = 'new' | 'connecting' | 'connected' |
    'disconnected' | 'failed' | 'closed';

interface RTCOfferOptions {
    iceRestart: boolean;
}

class RTCPeerConnection {
    constructor (configuration?: RTCConfiguration);

    createOffer(options: RTCOfferOptions,
                successCallback: (descriptionInitDict: RTCSessionDescriptionInit) => void,
                failureCallback: (error: Error) => void);

    createOffer(successCallback: (descriptionInitDict: RTCSessionDescriptionInit) => void,
                failureCallback: (error: Error) => void);

    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;

    setLocalDescription(descriptionInitDict: RTCSessionDescriptionInit): Promise<void>;
    setLocalDescription(descriptionInitDict: RTCSessionDescriptionInit, successCallback: (error: Error) => void, failureCallback: (error: Error) => void);

    readonly currentLocalDescription: RTCSessionDescription;
    readonly pendingLocalDescription: RTCSessionDescription;
    readonly currentRemoteDescription: RTCSessionDescription;
    readonly pendingRemoteDescription: RTCSessionDescription;
    readonly signalingState: RTCSignalingState;
    readonly iceGatheringState: RTCIceGatheringState;
    readonly iceConnectionState: RTCIceConnectionState;
    readonly connectionState: RTCPeerConnectionState;

    static generateCertificate(keygenAlgorithm: AlgorithmIdentifier): Promise<RTCCertificate>;

    /*onconnectionstatechange: Event;
    ondatachannel: RTCDataChannelEvent;
    onicecandidate: RTCPeerConnectionIceEvent;
    onicecandidateerror: RTCPeerConnectionIceErrorEvent;
    oniceconnectionstatechange: Event;
    onicegatheringstatechange: Event;
    onisolationchange: Event;
    onnegotiationneeded: Event;
    onsignalingstatechange: Event;
    ontrack: RTCTrackEvent;*/
}
