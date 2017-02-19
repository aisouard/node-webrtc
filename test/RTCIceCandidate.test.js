'use strict';

const chai = require('chai');
const assert = chai.assert;
const RTCIceCandidate = require('../').RTCIceCandidate;

let ipv6 = '0:1111:222:3333:4444:5555:6666:7777';
if (process.platform == 'darwin') {
  ipv6 = '::1111:222:3333:4444:5555:6666:7777';
}

const udpFoundation = 'candidate:123456789 1 udp 1234567891 ' +
  ipv6 + ' 12345 typ host generation 0 ufrag ABCD ' +
  'network-id 4 network-cost 50';

const tcpFoundation = 'candidate:123456789 1 tcp 1234567891 ' +
  ipv6 + ' 12345 typ host generation 0 ufrag ABCD ' +
  'network-id 4 network-cost 50';

const newCandidate = 'candidate:987654321 1 udp 987654321 ' +
  '7777:6666:555:4444:3333:2222:1111:0 54321 typ host ' +
  'generation 0 ufrag DCBA network-id 4 network-cost 50';

function dummyIceCandidate(foundation) {
  foundation = foundation || udpFoundation;

  return {
    candidate: foundation,
    sdpMid: 'data',
    sdpMLineIndex: 0
  };
}

describe('RTCIceCandidate', () => {
  describe('constructor', () => {
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
        new RTCIceCandidate({candidate: '', sdpMid: 0});
      }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
        'Expect line: candidate:<candidate-str>');
    });

    it('should throw a TypeError if both sdpMid and sdpMLineIndex are null',
      () => {
        assert.throws(() => {
          new RTCIceCandidate({candidate: ''});
        }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
          'Both \'sdpMid\' and \'sdpMLineIndex\' properties are null.');
      }
    );

    it('should not throw on valid parameters', () => {
      assert.doesNotThrow(() => {
        new RTCIceCandidate({candidate: newCandidate, sdpMid: 'data'});
      });
      assert.doesNotThrow(() => {
        new RTCIceCandidate({candidate: newCandidate, sdpMLineIndex: 0});
      });
      assert.doesNotThrow(() => {
        new RTCIceCandidate({candidate: newCandidate, sdpMid: 'data',
          sdpMidLineIndex: 0});
      });
    });
  });

  describe('properties', () => {
    describe('candidate', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.candidate, udpFoundation);
      });
      it('should be read-only', () => {
        iceCandidate.candidate = newCandidate;
        assert.strictEqual(iceCandidate.candidate, udpFoundation);
      });
    });

    describe('sdpMid', () => {
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(new RTCIceCandidate({
          candidate: newCandidate, sdpMid: 'data'
        }).sdpMid, 'data');
        assert.strictEqual(new RTCIceCandidate({
          candidate: newCandidate, sdpMid: 'audio'
        }).sdpMid, 'audio');
        assert.strictEqual(new RTCIceCandidate({
          candidate: newCandidate, sdpMid: 'video'
        }).sdpMid, 'video');
        assert.strictEqual(new RTCIceCandidate({
          candidate: newCandidate, sdpMid: ''
        }).sdpMid, null);
        assert.strictEqual(new RTCIceCandidate({
          candidate: newCandidate, sdpMid: null, sdpMLineIndex: 0
        }).sdpMid, null);
        assert.strictEqual(new RTCIceCandidate({
          candidate: newCandidate, sdpMLineIndex: 0
        }).sdpMid, null);
      });
      it('should be read-only', () => {
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
        iceCandidate.sdpMid = 'anotherMid';
        assert.strictEqual(iceCandidate.sdpMid, 'data');
      });
    });

    describe('sdpMLineIndex', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.sdpMLineIndex, 0);
      });
      it('should be read-only', () => {
        iceCandidate.sdpMLineIndex = 9;
        assert.strictEqual(iceCandidate.sdpMLineIndex, 0);
      });
    });

    describe('foundation', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.foundation, 'candidate:123456789 1 udp ' +
          '1234567891 ' + ipv6 + ' 12345 typ host ' +
          'generation 0 ufrag ABCD network-id 4 network-cost 50');
      });
      it('should be read-only', () => {
        iceCandidate.foundation = 'empty foundation';
        assert.strictEqual(iceCandidate.foundation, 'candidate:123456789 1 udp ' +
          '1234567891 ' + ipv6 + ' 12345 typ host ' +
          'generation 0 ufrag ABCD network-id 4 network-cost 50');
      });
    });

    describe('priority', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.priority, 1234567891);
      });
      it('should be read-only', () => {
        iceCandidate.priority = 9876543219;
        assert.strictEqual(iceCandidate.priority, 1234567891);
      });
    });

    describe('ip', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.ip, ipv6);
      });
      it('should be read-only', () => {
        iceCandidate.ip = '127.0.0.1';
        assert.strictEqual(iceCandidate.ip, ipv6);
      });
    });

    describe('protocol', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.protocol, 'udp');
      });
      it('should be read-only', () => {
        iceCandidate.protocol = 'tcp';
        assert.strictEqual(iceCandidate.protocol, 'udp');
      });
    });

    describe('port', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.port, 12345);
      });
      it('should be read-only', () => {
        iceCandidate.port = 8500;
        assert.strictEqual(iceCandidate.port, 12345);
      });
    });

    describe('type', () => {
      const iceCandidate = new RTCIceCandidate(dummyIceCandidate());
      it('should have the same value as passed in the constructor', () => {
        assert.strictEqual(iceCandidate.type, 'local');
      });
      it('should be read-only', () => {
        iceCandidate.type = 'remote';
        assert.strictEqual(iceCandidate.type, 'local');
      });
    });

    describe('tcpType', () => {
      it('should be null if protocol is set to udp', () => {
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(udpFoundation));
        assert.isNull(iceCandidate.tcpType);
      });

      it('should be null if tcptype is not set in foundation', () => {
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(tcpFoundation));
        assert.isNull(iceCandidate.tcpType);
      });

      it('should be active if tcptype is set to active in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host tcptype active generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.tcpType, 'active');
      });

      it('should be passive if tcptype is set to passive in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host tcptype passive generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.tcpType, 'passive');
      });

      it('should be so if tcptype is set to so in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host tcptype so generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.tcpType, 'so');
      });

      it('should throw an error on invalid tcptype set in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host tcptype invalid generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        assert.throws(() => {
          new RTCIceCandidate(dummyIceCandidate(foundation));
        }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
          'Invalid TCP candidate type.');
      });

      it('should throw an error on empty tcptype set in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host tcptype generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        assert.throws(() => {
          new RTCIceCandidate(dummyIceCandidate(foundation));
        }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
          'Invalid TCP candidate type.');
      });

      it('should be read-only', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host tcptype active generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        iceCandidate.tcpType = 'passive';
        assert.strictEqual(iceCandidate.tcpType, 'active');
      });
    });

    describe('relatedAddress', () => {
      it('should be null if raddr not set in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.isNull(iceCandidate.relatedAddress);
      });

      it('should be null if typ is set to host in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host raddr 127.0.0.1 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.isNull(iceCandidate.relatedAddress);
      });

      it('should be 127.0.0.1 if raddr is set to 127.0.0.1 in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay raddr 127.0.0.1 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.relatedAddress, '127.0.0.1');
      });

      it('should be empty if raddr is set to \'\' in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay raddr generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.relatedAddress, '');
      });

      it('should be null if raddr is invalid in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host raddr 127.0.01 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.isNull(iceCandidate.relatedAddress);
      });

      it('should be read-only', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay raddr 127.0.0.1 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        iceCandidate.relatedAddress = '192.168.1.1';
        assert.strictEqual(iceCandidate.relatedAddress, '127.0.0.1');
      });
    });

    describe('relatedPort', () => {
      it('should be null if rport not set in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.isNull(iceCandidate.relatedPort);
      });

      it('should be null if typ is set to host in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ host rport 8099 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.isNull(iceCandidate.relatedPort);
      });

      it('should be 8099 if rport is set to 8099 in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay rport 8099 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.relatedPort, 8099);
      });

      it('should throw an error on empty rport set in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay rport generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        assert.throws(() => {
          new RTCIceCandidate(dummyIceCandidate(foundation));
        }, Error, 'Failed to construct \'RTCIceCandidate\': ' +
          'Invalid value: generation.');
      });

      it('should be 65531 if rport is set to -5 in foundation', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay rport -5 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        assert.strictEqual(iceCandidate.relatedPort, 65531);
      });

      it('should be read-only', () => {
        const foundation = 'candidate:123456789 1 tcp 1234567891 ' +
          ipv6 + ' 12345 typ relay rport 8099 generation 0 ufrag ABCD ' +
          'network-id 4 network-cost 50';
        const iceCandidate = new RTCIceCandidate(dummyIceCandidate(foundation));
        iceCandidate.relatedPort = '32555';
        assert.strictEqual(iceCandidate.relatedPort, 8099);
      });
    });
  });

  describe('serializer', () => {
    let iceCandidate = new RTCIceCandidate(dummyIceCandidate());
    const initializer = JSON.parse(JSON.stringify(iceCandidate));

    it('should have the same properties as set in the constructor', () => {
      assert.strictEqual(initializer.candidate, udpFoundation);
      assert.strictEqual(initializer.sdpMid, 'data');
      assert.strictEqual(initializer.sdpMLineIndex, 0);
    });

    it('should have 3 properties', () => {
      assert.strictEqual(Object.keys(iceCandidate).length, 3);
    });
  });

  it('should convert to JSON properly', () => {
    let iceCandidate = new RTCIceCandidate(dummyIceCandidate());
    const initializer = JSON.parse(JSON.stringify(iceCandidate));

    iceCandidate = new RTCIceCandidate(initializer);
    assert.strictEqual(iceCandidate.candidate, udpFoundation);
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
