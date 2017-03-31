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

describe('RTCPeerConnection#setLocalDescription', () => {
  const errorPrefix = 'Failed to execute \'setLocalDescription\' on ' +
    '\'RTCPeerConnection\': ';
  const pc = new RTCPeerConnection();

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
    });
  });
});
