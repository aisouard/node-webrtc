'use strict';

const chai = require('chai');
const assert = chai.assert;
const RTCIceCandidate = require('../').RTCIceCandidate;

let ipv6 = '0:1111:222:3333:4444:5555:6666:7777';
if (process.platform == 'darwin') {
  ipv6 = '::1111:222:3333:4444:5555:6666:7777';
}

const candidate = 'candidate:123456789 1 udp 1234567891 ' +
  ipv6 + ' 12345 typ host ' +
  'generation 0 ufrag ABCD network-id 4 network-cost 50';

const newCandidate = 'candidate:987654321 1 udp 987654321 ' +
  '7777:6666:555:4444:3333:2222:1111:0 54321 typ host ' +
  'generation 0 ufrag DCBA network-id 4 network-cost 50';

function dummyIceCandidate() {
  return {
    candidate: candidate,
    sdpMid: 'data',
    sdpMLineIndex: 0
  };
}

describe('RTCIceCandidate', () => {
  it('should be invoked exclusively with the \'new\' operator', () => {
    assert.throws(() => {
      RTCIceCandidate();
    }, Error, 'Class constructors cannot be invoked without \'new\'');
  });

  it('should throw a TypeError when invoked with empty parameters', () => {
    assert.throws(() => {
      new RTCIceCandidate();
    }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
      '1 argument required, but only 0 present.');
  });

  it('should throw when invoked with invalid parameters', () => {
    assert.throws(() => {
      new RTCIceCandidate(26);
    }, TypeError, 'Failed to construct \'RTCIceCandidate\': ' +
      'parameter 1 (\'candidateInitDict\') is not an object.');
    assert.throws(() => {
      new RTCIceCandidate('another string');
    }, TypeError, 'Failed to construct \'RTCIceCandidate\': ' +
      'parameter 1 (\'candidateInitDict\') is not an object.');
    assert.throws(() => {
      new RTCIceCandidate({});
    }, TypeError, 'Failed to construct \'RTCIceCandidate\': ' +
      'The \'candidate\' property is not a string, or is empty.');
    assert.throws(() => {
      new RTCIceCandidate({candidate: 0});
    }, TypeError, 'Failed to construct \'RTCIceCandidate\': ' +
      'The \'candidate\' property is not a string, or is empty.');
    assert.throws(() => {
      new RTCIceCandidate({candidate: ''});
    }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
      'Expect line: candidate:<candidate-str>');
  });

  it('should not throw on valid parameters', () => {
    assert.doesNotThrow(() => {
      new RTCIceCandidate({candidate: newCandidate});
    });
  });

  it('should have the same values as the object passed in the constructor',
    () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      assert.strictEqual(iceCandidate.candidate, candidate);
      assert.strictEqual(iceCandidate.sdpMid, 'data');
      assert.strictEqual(iceCandidate.sdpMLineIndex, 0);
    }
  );

  it('should have its properties set correctly', () => {
    const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
    assert.strictEqual(iceCandidate.candidate, candidate);
    assert.strictEqual(iceCandidate.sdpMid, 'data');
    assert.strictEqual(iceCandidate.sdpMLineIndex, 0);
    assert.strictEqual(iceCandidate.foundation, 'candidate:123456789 1 udp ' +
      '1234567891 ' + ipv6 + ' 12345 typ host ' +
      'generation 0 ufrag ABCD network-id 4 network-cost 50');
    assert.strictEqual(iceCandidate.priority, 1234567891);
    assert.strictEqual(iceCandidate.ip, ipv6);
    assert.strictEqual(iceCandidate.protocol, 'udp');
    assert.strictEqual(iceCandidate.port, 12345);
    assert.strictEqual(iceCandidate.type, 'local');
    assert.isNull(iceCandidate.tcpType);
    assert.isNull(iceCandidate.relatedAddress);
    assert.isNull(iceCandidate.relatedPort);
  });

  it('should convert to JSON properly', () => {
    let iceCandidate = new RTCIceCandidate(dummyIceCandidate());
    const initializer = JSON.parse(JSON.stringify(iceCandidate));

    iceCandidate = new RTCIceCandidate(initializer);
    assert.strictEqual(iceCandidate.candidate, candidate);
    assert.strictEqual(iceCandidate.sdpMid, 'data');
    assert.strictEqual(iceCandidate.sdpMLineIndex, 0);
    assert.strictEqual(iceCandidate.foundation, 'candidate:123456789 1 udp ' +
      '1234567891 ' + ipv6 + ' 12345 typ host ' +
      'generation 0 ufrag ABCD network-id 4 network-cost 50');
    assert.strictEqual(iceCandidate.priority, 1234567891);
    assert.strictEqual(iceCandidate.ip, ipv6);
    assert.strictEqual(iceCandidate.protocol, 'udp');
    assert.strictEqual(iceCandidate.port, 12345);
    assert.strictEqual(iceCandidate.type, 'local');
    assert.isNull(iceCandidate.tcpType);
    assert.isNull(iceCandidate.relatedAddress);
    assert.isNull(iceCandidate.relatedPort);
  });

  it('should have read-only properties', () => {
    const iceCandidate = new RTCIceCandidate(dummyIceCandidate());

    iceCandidate.candidate = newCandidate;
    iceCandidate.sdpMid = 'anotherMid';
    iceCandidate.sdpMLineIndex = 12;
    iceCandidate.foundation = 'empty foundation';
    iceCandidate.priority = 9876543219;
    iceCandidate.ip = '127.0.0.1';
    iceCandidate.protocol = 'tcp';
    iceCandidate.port = 3255;
    iceCandidate.type = 'remote';
    iceCandidate.tcpType = 'passive';
    iceCandidate.relatedAddress = '127.0.0.1';
    iceCandidate.relatedPort = 3255;

    assert.strictEqual(iceCandidate.candidate, candidate);
    assert.strictEqual(iceCandidate.sdpMid, 'data');
    assert.strictEqual(iceCandidate.sdpMLineIndex, 0);
    assert.strictEqual(iceCandidate.foundation, 'candidate:123456789 1 udp ' +
      '1234567891 ' + ipv6 + ' 12345 typ host ' +
      'generation 0 ufrag ABCD network-id 4 network-cost 50');
    assert.strictEqual(iceCandidate.priority, 1234567891);
    assert.strictEqual(iceCandidate.ip, ipv6);
    assert.strictEqual(iceCandidate.protocol, 'udp');
    assert.strictEqual(iceCandidate.port, 12345);
    assert.strictEqual(iceCandidate.type, 'local');
    assert.isNull(iceCandidate.tcpType);
    assert.isNull(iceCandidate.relatedAddress);
    assert.isNull(iceCandidate.relatedPort);
  });
});
