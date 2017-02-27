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

#include <webrtc/base/rtccertificate.h>
#include "rtccertificate.h"
#include "common.h"

static const char sRTCCertificate[] = "RTCCertificate";

NAN_MODULE_INIT(RTCCertificate::Init) {
  Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(New);
  ctor->SetClassName(LOCAL_STRING(sRTCCertificate));
  ctor->InstanceTemplate()->SetInternalFieldCount(1);

  constructor().Reset(Nan::GetFunction(ctor).ToLocalChecked());
}

RTCCertificate::RTCCertificate(
    const rtc::scoped_refptr<rtc::RTCCertificate>& certificate)
    : _certificate(certificate) {
}

RTCCertificate::~RTCCertificate() {
}

Local<Object> RTCCertificate::Create(
    const rtc::scoped_refptr<rtc::RTCCertificate>& certificate) {
  const unsigned argc = 0;
  Local<Value> argv[argc] = { };
  Local<Function> cons = Nan::New(RTCCertificate::constructor());
  Local<Object> instance = cons->NewInstance(argc, argv);

  RTCCertificate *rtcCertificate = new RTCCertificate(certificate);
  rtcCertificate->Wrap(instance);

  return instance;
}

NAN_METHOD(RTCCertificate::New) {
}

