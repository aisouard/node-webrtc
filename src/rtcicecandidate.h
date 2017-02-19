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

#ifndef RTCICECANDIDATE_H_
#define RTCICECANDIDATE_H_

#include <nan.h>
#include <webrtc/api/jsep.h>

using namespace v8;

class RTCIceCandidate : public Nan::ObjectWrap {
 public:
  static NAN_MODULE_INIT(Init);

 private:
  explicit RTCIceCandidate(webrtc::IceCandidateInterface *iceCandidate);
  ~RTCIceCandidate();

  static NAN_METHOD(New);

  static NAN_GETTER(GetCandidate);
  static NAN_GETTER(GetSdpMid);
  static NAN_GETTER(GetSdpMLineIndex);

  static NAN_GETTER(GetFoundation);
  static NAN_GETTER(GetPriority);
  static NAN_GETTER(GetIp);
  static NAN_GETTER(GetProtocol);
  static NAN_GETTER(GetPort);
  static NAN_GETTER(GetType);
  static NAN_GETTER(GetTcpType);
  static NAN_GETTER(GetRelatedAddress);
  static NAN_GETTER(GetRelatedPort);

  static Nan::Persistent<FunctionTemplate> constructor;

 protected:
  webrtc::IceCandidateInterface *_iceCandidate;
};

#endif  // RTCICECANDIDATE_H_
