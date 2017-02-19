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

#include <memory>
#include <iostream>
#include "common.h"
#include "rtcsessiondescription.h"

Nan::Persistent<FunctionTemplate> RTCSessionDescription::constructor;

static const char sRTCSessionDescription[] = "RTCSessionDescription";

static const char kSdp[] = "sdp";
static const char kType[] = "type";

NAN_MODULE_INIT(RTCSessionDescription::Init) {
  Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(New);

  ctor->SetClassName(Nan::New(sRTCSessionDescription).ToLocalChecked());
  ctor->InstanceTemplate()->SetInternalFieldCount(1);

  Local<ObjectTemplate> tpl = ctor->InstanceTemplate();

  Nan::SetAccessor(tpl, Nan::New(kSdp).ToLocalChecked(), GetSdp);
  Nan::SetAccessor(tpl, Nan::New(kType).ToLocalChecked(), GetType);

  constructor.Reset(ctor);
  Nan::Set(target, Nan::New(sRTCSessionDescription).ToLocalChecked(),
           ctor->GetFunction());
}

RTCSessionDescription::RTCSessionDescription(
    webrtc::SessionDescriptionInterface *sessionDescription)
    : _sessionDescription(sessionDescription) {
}

RTCSessionDescription::~RTCSessionDescription() {
  delete _sessionDescription;
}

NAN_METHOD(RTCSessionDescription::New) {
  CONSTRUCTOR_HEADER(RTCSessionDescription);

  ASSERT_CONSTRUCT_CALL;
  ASSERT_SINGLE_ARGUMENT;

  ASSERT_OBJECT_ARGUMENT(0, descriptionInitDict);

  ASSERT_OBJECT_PROPERTY(descriptionInitDict, kType, typeVal);
  ASSERT_PROPERTY_STRING(kType, typeVal, type);

  if (std::string("answer").compare(*type) &&
      std::string("offer").compare(*type) &&
      std::string("pranswer").compare(*type) &&
      std::string("rollback").compare(*type)) {
    errorStream << "The provided value '";
    errorStream << std::string(*type);
    errorStream << "' is not a valid enum value of type RTCSdpType.";
    return Nan::ThrowTypeError(errorStream.str().c_str());
  }

  ASSERT_OBJECT_PROPERTY(descriptionInitDict, kSdp, sdpVal);
  ASSERT_PROPERTY_STRING(kSdp, sdpVal, sdp);

  webrtc::SdpParseError error;
  webrtc::SessionDescriptionInterface *desc;
  desc = webrtc::CreateSessionDescription(*type, *sdp, &error);

  if (!desc) {
    errorStream << error.description;
    return Nan::ThrowTypeError(errorStream.str().c_str());
  }

  RTCSessionDescription *rtcIceCandidate = new RTCSessionDescription(desc);
  rtcIceCandidate->Wrap(info.This());

  info.GetReturnValue().Set(info.This());
}

NAN_GETTER(RTCSessionDescription::GetType) {
  RTCSessionDescription *object =
      Nan::ObjectWrap::Unwrap<RTCSessionDescription>(info.This());

  info.GetReturnValue().Set(
      Nan::New(object->_sessionDescription->type()).ToLocalChecked());
}

NAN_GETTER(RTCSessionDescription::GetSdp) {
  std::string sdp;
  RTCSessionDescription *object =
      Nan::ObjectWrap::Unwrap<RTCSessionDescription>(info.This());

  object->_sessionDescription->ToString(&sdp);
  info.GetReturnValue().Set(Nan::New(sdp).ToLocalChecked());
}
