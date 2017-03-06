/*
 * Copyright (c) 2017 Axel Isouard <axel@isouard.fr>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const RTCPeerConnection = require('../../').RTCPeerConnection;

chai.use(chaiAsPromised);

describe('RTCPeerConnection#createOffer', () => {
  const errorPrefix = 'Failed to execute \'createOffer\' on ' +
    '\'RTCPeerConnection\': ';
  const pc = new RTCPeerConnection();

  describe('called with no parameters', () => {
    it('should resolve with a descriptionInitDict', (done) => {
      pc.createOffer()
        .then((desc) => {
          assert.isObject(desc);
          assert.equal(Object.keys(desc).length, 2);
          assert.property(desc, 'type');
          assert.typeOf(desc.type, 'string');
          assert.property(desc, 'sdp');
          assert.typeOf(desc.sdp, 'string');
          done();
        });
    });
  });

  describe('called with one parameter', () => {
    describe('not being an Object', () => {
      it('should throw a TypeError', () => {
        return assert.isRejected(
          pc.createOffer(1.25),
          TypeError, errorPrefix + 'parameter 1 (\'options\') ' +
          'is not an object.');
      });
    });

    describe('being an Object', () => {
      it('should resolve with a descriptionInitDict', (done) => {
        pc.createOffer({})
          .then((desc) => {
            assert.isObject(desc);
            assert.equal(Object.keys(desc).length, 2);
            assert.property(desc, 'type');
            assert.typeOf(desc.type, 'string');
            assert.property(desc, 'sdp');
            assert.typeOf(desc.sdp, 'string');
            done();
          });
      });
    });
  });

  describe('called with two parameters', () => {
    describe('first one not being a Function', () => {
      it('should throw a TypeError', () => {
        assert.throw(() => {
          pc.createOffer(undefined, undefined);
        }, TypeError, errorPrefix + 'parameter 1 (\'successCallback\') ' +
          'is not a function.');
      });
    });

    describe('second one not being a Function', () => {
      it('should throw a TypeError', () => {
        assert.throw(() => {
          pc.createOffer(() => {}, undefined);
        }, TypeError, errorPrefix + 'parameter 2 (\'failureCallback\') ' +
          'is not a function.');
      });
    });

    describe('both being functions', () => {
      it('should call the first callback, ' +
        'with a descriptionInitDict as parameter', (done) => {
        pc.createOffer((desc) => {
          assert.isObject(desc);
          assert.equal(Object.keys(desc).length, 2);
          assert.property(desc, 'type');
          assert.typeOf(desc.type, 'string');
          assert.property(desc, 'sdp');
          assert.typeOf(desc.sdp, 'string');
          done();
        }, () => {});
      });
    });
  });

  describe('called with three parameters', () => {
    describe('first one not being an Object', () => {
      it('should throw a TypeError', () => {
        assert.throw(() => {
          pc.createOffer(52, undefined, undefined);
        }, TypeError, errorPrefix + 'parameter 1 (\'options\') ' +
          'is not an object.');
      });
    });

    describe('second one not being a Function', () => {
      it('should throw a TypeError', () => {
        assert.throw(() => {
          pc.createOffer({}, undefined, undefined);
        }, TypeError, errorPrefix + 'parameter 2 (\'successCallback\') ' +
          'is not a function.');
      });
    });

    describe('third one not being a Function', () => {
      it('should throw a TypeError', () => {
        assert.throw(() => {
          pc.createOffer({}, () => {}, undefined);
        }, TypeError, errorPrefix + 'parameter 3 (\'failureCallback\') ' +
          'is not a function.');
      });
    });

    describe('first being an Object, and the others being Functions', () => {
      it('should call the first callback, ' +
        'with a descriptionInitDict as parameter', (done) => {
        pc.createOffer({}, (desc) => {
          assert.isObject(desc);
          assert.equal(Object.keys(desc).length, 2);
          assert.property(desc, 'type');
          assert.typeOf(desc.type, 'string');
          assert.property(desc, 'sdp');
          assert.typeOf(desc.sdp, 'string');
          done();
        }, () => {});
      });
    });
  });
});
