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

#ifndef RTCPEERCONNECTION_H_
#define RTCPEERCONNECTION_H_

#include <nan.h>
#include <webrtc/api/jsep.h>
#include <string>

using namespace v8;

class RTCPeerConnection : public Nan::ObjectWrap {
 public:
  static NAN_MODULE_INIT(Init);

 private:
  RTCPeerConnection();
  ~RTCPeerConnection();

  static NAN_METHOD(New);
  static NAN_METHOD(GenerateCertificate);

  class GenerateCertificateWorker : public Nan::AsyncWorker {
   public:
    explicit GenerateCertificateWorker(Persistent<Promise::Resolver> *resolver,
                                       const rtc::KeyParams& params);
    ~GenerateCertificateWorker() {}

    void Execute();
    void WorkComplete();

   private:
    const rtc::KeyParams _params;
    Persistent<Promise::Resolver> *_resolver;
    rtc::scoped_refptr<rtc::RTCCertificate> _certificate;
  };

  static Nan::Persistent<FunctionTemplate> constructor;
};

#endif  // RTCPEERCONNECTION_H_
