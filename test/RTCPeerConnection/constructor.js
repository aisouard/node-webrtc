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

describe('new RTCPeerConnection', () => {
  describe('called with no parameters', () => {
    const pc = new RTCPeerConnection();

    it('should resolve with a RTCPeerConnection', () => {
      assert.instanceOf(pc, RTCPeerConnection);
    });
  });

  describe('instance', () => {
    const pc = new RTCPeerConnection();

    describe('signalingState property', () => {
      it('should be set to \'stable\'', () => {
        assert.equal(pc.signalingState, 'stable');
      });

      it('should be read-only', () => {
        pc.signalingState = 'another value';
        assert.equal(pc.signalingState, 'stable');
      });
    });

    describe('iceConnectionState property', () => {
      it('should be set to \'new\'', () => {
        assert.equal(pc.iceConnectionState, 'new');
      });

      it('should be read-only', () => {
        pc.iceConnectionState = 'another value';
        assert.equal(pc.iceConnectionState, 'new');
      });
    });

    describe('iceGatheringState property', () => {
      it('should be set to \'new\'', () => {
        assert.equal(pc.iceGatheringState, 'new');
      });

      it('should be read-only', () => {
        pc.iceGatheringState = 'another value';
        assert.equal(pc.iceGatheringState, 'new');
      });
    });

    describe('connectionState property', () => {
      it('should be set to \'new\'', () => {
        assert.equal(pc.connectionState, 'new');
      });

      it('should be read-only', () => {
        pc.connectionState = 'another value';
        assert.equal(pc.connectionState, 'new');
      });
    });

    describe('pendingLocalDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.pendingLocalDescription);
      });

      it('should be read-only', () => {
        pc.pendingLocalDescription = 'another value';
        assert.isNull(pc.pendingLocalDescription);
      });
    });

    describe('currentLocalDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.currentLocalDescription);
      });

      it('should be read-only', () => {
        pc.currentLocalDescription = 'another value';
        assert.isNull(pc.currentLocalDescription);
      });
    });

    describe('pendingRemoteDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.pendingRemoteDescription);
      });

      it('should be read-only', () => {
        pc.pendingRemoteDescription = 'another value';
        assert.isNull(pc.pendingRemoteDescription);
      });
    });

    describe('currentRemoteDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.currentRemoteDescription);
      });

      it('should be read-only', () => {
        pc.currentRemoteDescription = 'another value';
        assert.isNull(pc.currentRemoteDescription);
      });
    });
  });
});
