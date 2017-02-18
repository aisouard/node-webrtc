'use strict';

const chai = require('chai');
const assert = chai.assert;
const RTCSessionDescription = require('../').RTCSessionDescription;

const sdp = {
  'sdp':'v=0\r\no=- 1234567891234567891 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r' +
  '\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.' +
  '0.0\r\na=ice-ufrag:ABCD\r\na=ice-pwd:ABCDEFGHIJKLMNOPQRSTUVWX\r\na=finger' +
  'print:sha-256 11:22:33:44:55:66:77:88:99:11:22:33:44:55:66:77:88:99:11:22' +
  ':33:44:55:66:77:88:99:11:22:33:44:55\r\na=setup:actpass\r\na=mid:data\r\n' +
  'a=sctpmap:5000 webrtc-datachannel 1024\r\n','type':'offer'
};

describe('RTCSessionDescription', () => {
  it('should be invoked exclusively with the \'new\' operator', () => {
    assert.throws(() => {
      RTCSessionDescription();
    }, Error, 'Class constructors cannot be invoked without \'new\'');
  });

  it('should throw an Error when invoked with empty parameters', () => {
    assert.throws(() => {
      new RTCSessionDescription();
    }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
      '1 argument required, but only 0 present.');
  });

  it('should throw a TypeError when invoked with an invalid parameter', () => {
    assert.throws(() => {
      new RTCSessionDescription(12);
    }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
      'parameter 1 (\'descriptionInitDict\') is not an object.');
  });

  it('should throw a TypeError when invoked without the \'type\' property',
    () => {
      assert.throws(() => {
        new RTCSessionDescription({});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The \'type\' property is not a string, or is empty.');
    }
  );

  it('should throw a TypeError when invoked with an invalid \'type\' property',
    () => {
      assert.throws(() => {
        new RTCSessionDescription({type: 'anything'});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The provided value \'anything\' is not a valid enum value of type ' +
        'RTCSdpType.');
      assert.throws(() => {
        new RTCSessionDescription({type: 1.56});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The provided value \'1.56\' is not a valid enum value of type ' +
        'RTCSdpType.');
      assert.throws(() => {
        new RTCSessionDescription({type: {}});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The provided value \'[object Object]\' is not a valid enum value of ' +
        'type RTCSdpType.');
    }
  );

  it('should throw a TypeError when invoked without the \'sdp\' property',
    () => {
      assert.throws(() => {
        new RTCSessionDescription({type: 'offer'});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The \'sdp\' property is not a string, or is empty.');
      assert.throws(() => {
        new RTCSessionDescription({type: 'answer'});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The \'sdp\' property is not a string, or is empty.');
      assert.throws(() => {
        new RTCSessionDescription({type: 'pranswer'});
      }, TypeError, 'Failed to construct \'RTCSessionDescription\': ' +
        'The \'sdp\' property is not a string, or is empty.');
    }
  );

  it('should throw a TypeError when invoked with an invalid \'sdp\' property',
    () => {
      assert.throws(() => {
        new RTCSessionDescription({type: 'offer', sdp: 'anything'});
      }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
        'Expect line: v=');
      assert.throws(() => {
        new RTCSessionDescription({type: 'offer', sdp: 'v=0\r\n'});
      }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
        'Expect line: o=');
      assert.throws(() => {
        new RTCSessionDescription({type: 'answer', sdp: 'anything'});
      }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
        'Expect line: v=');
      assert.throws(() => {
        new RTCSessionDescription({type: 'answer', sdp: 'v=0\r\n'});
      }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
        'Expect line: o=');
      assert.throws(() => {
        new RTCSessionDescription({type: 'pranswer', sdp: 'anything'});
      }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
        'Expect line: v=');
      assert.throws(() => {
        new RTCSessionDescription({type: 'pranswer', sdp: 'v=0\r\n'});
      }, Error, 'Failed to construct \'RTCSessionDescription\': ' +
        'Expect line: o=');
    }
  );

  it('should not throw when invoked with an valid \'sdp\' property', () => {
    assert.doesNotThrow(() => {
      new RTCSessionDescription({type: 'offer', sdp: sdp.sdp});
    });
    assert.doesNotThrow(() => {
      new RTCSessionDescription({type: 'answer', sdp: sdp.sdp});
    });
    assert.doesNotThrow(() => {
      new RTCSessionDescription({type: 'pranswer', sdp: sdp.sdp});
    });

    // TODO: Rollback is NOT implemented yet.
    /*assert.doesNotThrow(() => {
      new RTCSessionDescription({type: 'rollback', sdp: sdp.sdp});
    });*/
  });

  it('should convert to JSON properly', () => {
    let sessionDescription = new RTCSessionDescription(sdp);
    const initializer = JSON.parse(JSON.stringify(sessionDescription));

    sessionDescription = new RTCSessionDescription(initializer);
    assert.strictEqual(Object.keys(sessionDescription).length, 2);
    assert.strictEqual(sessionDescription.type, sdp.type);
    assert.strictEqual(sessionDescription.sdp, sdp.sdp);
  });

  it('should have read-only properties', () => {
    const sessionDescription = new RTCSessionDescription(sdp);

    sessionDescription.type = 'answer';
    sessionDescription.sdp = 'invalid-sdp';

    assert.strictEqual(Object.keys(sessionDescription).length, 2);
    assert.strictEqual(sessionDescription.type, sdp.type);
    assert.strictEqual(sessionDescription.sdp, sdp.sdp);
  });
});
