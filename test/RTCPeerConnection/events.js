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

chai.use(chaiAsPromised);

describe('RTCPeerConnection events', () => {
  const pc = new RTCPeerConnection();

  describe('onsignalingstatechange', () => {
    it('should be set to null', () => {
      assert.isNull(pc.onsignalingstatechange);
    });

    it('should not be set to a number', () => {
      pc.onsignalingstatechange = 1;
      assert.isNull(pc.onsignalingstatechange);
    });

    it('should not be set to a string', () => {
      pc.onsignalingstatechange = 'str';
      assert.isNull(pc.onsignalingstatechange);
    });

    it('should be set to a Function', () => {
      pc.onsignalingstatechange = sinon.spy();
      assert.isUndefined(pc.onsignalingstatechange());
      assert.equal(pc.onsignalingstatechange.calledOnce, true);
    });

    it('should be set to null if set to anything but a function', () => {
      pc.onsignalingstatechange = 'str';
      assert.isNull(pc.onsignalingstatechange);
    });
  });
});
