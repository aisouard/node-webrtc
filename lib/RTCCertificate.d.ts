// Type definitions for node-webrtc
// Project: https://github.com/aisouard/node-webrtc/
// Definitions by: Axel Isouard <axel@isouard.fr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface RTCDtlsFingerprint {
    readonly algorithm: string;
    readonly value: string;
}

interface RTCCertificate {
    readonly expires: number;
    readonly fingerprints: RTCDtlsFingerprint[];
    // getAlgorithm(): AlgorithmIdentifier;
}
