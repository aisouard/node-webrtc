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

const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const RTCPeerConnection = require('../../').RTCPeerConnection;
const RTCSessionDescription = require('../../').RTCSessionDescription;

chai.use(chaiAsPromised);

describe('RTCPeerConnection#setLocalDescription', () => {
  const errorPrefix = 'Failed to execute \'setLocalDescription\' on ' +
    '\'RTCPeerConnection\': ';
  let pc;

  before(() => {
    pc = new RTCPeerConnection();
  });

  describe('called with one parameter', () => {
    describe('not being an Object', () => {
      it('should throw a TypeError', () => {
        const p = pc.setLocalDescription(1.25);

        assert.instanceOf(p, Promise);
        return assert.isRejected(p, TypeError, errorPrefix +
          'parameter 1 (\'description\') is not an object.');
      });
    });

    describe('being an Object', () => {
      describe('not having \'type\' property', () => {
        it('should throw a TypeError', () => {
          const p = pc.setLocalDescription({
            sdp: 'sdp-here'
          });

          assert.instanceOf(p, Promise);
          return assert.isRejected(p, TypeError, errorPrefix +
            'The \'type\' property is undefined.');
        });
      });

      describe('not having \'sdp\' property', () => {
        it('should throw a TypeError', () => {
          const p = pc.setLocalDescription({});

          assert.instanceOf(p, Promise);
          return assert.isRejected(p, TypeError, errorPrefix +
            'The \'sdp\' property is undefined.');
        });
      });

      describe('having \'type\' property', () => {
        describe('set to undefined', () => {
          it('should throw a TypeError', () => {
            const p = pc.setLocalDescription({
              sdp: 'sdp-here',
              type: undefined
            });

            assert.instanceOf(p, Promise);
            return assert.isRejected(p, TypeError, errorPrefix +
              'The \'type\' property is not a string, or is empty.');
          });
        });

        describe('set to a number', () => {
          it('should throw a TypeError', () => {
            const p = pc.setLocalDescription({
              sdp: 'sdp-here',
              type: 25.5
            });

            assert.instanceOf(p, Promise);
            return assert.isRejected(p, TypeError, errorPrefix +
              'The \'type\' property is not a string, or is empty.');
          });
        });
      });

      describe('having \'sdp\' property', () => {
        describe('set to undefined', () => {
          it('should throw a TypeError', () => {
            const p = pc.setLocalDescription({
              sdp: undefined
            });

            assert.instanceOf(p, Promise);
            return assert.isRejected(p, TypeError, errorPrefix +
              'The \'sdp\' property is not a string, or is empty.');
          });
        });

        describe('set to a number', () => {
          it('should throw a TypeError', () => {
            const p = pc.setLocalDescription({
              sdp: 1.68
            });

            assert.instanceOf(p, Promise);
            return assert.isRejected(p, TypeError, errorPrefix +
              'The \'sdp\' property is not a string, or is empty.');
          });
        });

        describe('set to an Object', () => {
          it('should throw a TypeError', () => {
            const p = pc.setLocalDescription({
              sdp: {}
            });

            assert.instanceOf(p, Promise);
            return assert.isRejected(p, TypeError, errorPrefix +
              'The \'sdp\' property is not a string, or is empty.');
          });
        });
      });
    });

    describe('being a valid \'description\' object', () => {
      describe('with an invalid SDP type', () => {
        it('should throw a TypeError', () => {
          const p = pc.setLocalDescription({
            sdp: 'sdp-here',
            type: 'anything'
          });

          assert.instanceOf(p, Promise);
          return assert.isRejected(p, Error, errorPrefix +
            'The provided value \'anything\' ' +
            'is not a valid enum value of type RTCSdpType.');
        });
      });

      describe('with an invalid SDP string', () => {
        it('should throw a TypeError', () => {
          const p = pc.setLocalDescription({
            sdp: 'sdp-here',
            type: 'offer'
          });

          assert.instanceOf(p, Promise);
          return assert.isRejected(p, Error, errorPrefix + 'Expect line: v=');
        });
      });

      describe('with a basic offer SDP', () => {
        const sdp = {
          sdp: 'v=0\r\no=- 2368977456164643196 5 IN IP4 127.0.0.1\r\n' +
          's=-\r\nt=0 0\r\na=msid-semantic: WMS\r\n',
          type: 'offer'
        };

        before(() => {
          pc = new RTCPeerConnection();
          pc.onsignalingstatechange = sinon.spy();
        });

        it('should resolve', (done) => {
          const p = pc.setLocalDescription(sdp).then(done);
          assert.instanceOf(p, Promise);
        });

        /*
         * If connection's signaling state changed above, fire a simple event
         * named signalingstatechange at connection.
         */
        it('should call \'onsignalingstatechange\' event callback', () => {
          assert.equal(pc.onsignalingstatechange.calledOnce, true);
        });

        /*
         * If description is of type "offer", set
         * connection.pendingLocalDescription to description and signaling state
         * to have-local-offer.
         */
        it('should set the \'pendingLocalDescription\' property to the same ' +
          'passed SDP', () => {
          assert.instanceOf(pc.pendingLocalDescription, RTCSessionDescription);
          assert.equal(pc.pendingLocalDescription.sdp, sdp.sdp);
          assert.equal(pc.pendingLocalDescription.type, sdp.type);
        });

        it('should set the \'signalingState\' property to ' +
          '\'have-local-offer\'', () => {
          assert.equal(pc.signalingState, 'have-local-offer');
        });

        /*
         * If description is set as a local description, connection's ICE
         * gathering state is new
         */
        it('should set the \'iceGatheringState\' property to \'new\'', () => {
          assert.equal(pc.iceGatheringState, 'new');
        });
      });

      describe('with a basic answer SDP', () => {
        const sdp = {
          sdp: 'v=0\r\no=- 8931616931805276348 2 IN IP4 127.0.0.1\r\n' +
          's=-\r\nt=0 0\r\na=msid-semantic: WMS\r\n',
          type: 'answer'
        };

        before(() => {
          pc = new RTCPeerConnection();
        });
      });

      describe('with a media offer SDP', () => {

      });
    });
  });
});
