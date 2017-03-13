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

#ifndef RTCCERTIFICATE_H_
#define RTCCERTIFICATE_H_

#include <nan.h>
#include <webrtc/api/jsep.h>
#include <string>

using namespace v8;

class RTCCertificate : public Nan::ObjectWrap {
 public:
  static NAN_MODULE_INIT(Init);

  static NAN_GETTER(GetExpires);
  static NAN_GETTER(GetFingerprints);

  static NAN_METHOD(ToPEM);
  static NAN_METHOD(FromPEM);

  static Local<Object> Create(
      const rtc::scoped_refptr<rtc::RTCCertificate>& certificate);

  static inline Nan::Persistent<v8::Function>& constructor() {
    static Nan::Persistent<v8::Function> _constructor;
    return _constructor;
  }

 private:
  explicit RTCCertificate(
      const rtc::scoped_refptr<rtc::RTCCertificate>& certificate);
  ~RTCCertificate();

  static NAN_METHOD(New);

 protected:
  const rtc::scoped_refptr<rtc::RTCCertificate> _certificate;
};

#endif  // RTCCERTIFICATE_H_
