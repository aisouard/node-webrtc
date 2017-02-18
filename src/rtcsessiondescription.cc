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
#include <sstream>
#include "rtcsessiondescription.h"

Nan::Persistent<FunctionTemplate> RTCSessionDescription::constructor;

static const char sRTCSessionDescription[] = "RTCSessionDescription";

static const char kSdp[] = "sdp";
static const char kType[] = "type";

static const char ePrefix[] =
    "Failed to construct 'RTCSessionDescription': ";
static const char eInvoke[] =
    "Class constructors cannot be invoked without 'new'";
static const char eArguments[] =
    "1 argument required, but only 0 present.";
static const char eNotObject[] =
    "parameter 1 ('descriptionInitDict') is not an object.";
static const char eTypeProperty[] =
    "The 'type' property is not a string, or is empty.";
static const char eSdpProperty[] =
    "The 'sdp' property is not a string, or is empty.";

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
  std::stringstream strm;

  strm << ePrefix;
  if (!info.IsConstructCall()) {
    strm << eInvoke;
    return Nan::ThrowError(strm.str().c_str());
  }

  if (info.Length() < 1) {
    strm << eArguments;
    return Nan::ThrowError(strm.str().c_str());
  }

  if (!info[0]->IsObject()) {
    strm << eNotObject;
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  Local<Object> obj = info[0]->ToObject();

  if (!Nan::HasOwnProperty(obj, Nan::New(kType).ToLocalChecked()).FromJust()) {
    strm << eTypeProperty;
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  String::Utf8Value type(
      obj->Get(Nan::New(kType).ToLocalChecked())->ToString());

  if (std::string("answer").compare(*type) &&
      std::string("offer").compare(*type) &&
      std::string("pranswer").compare(*type) &&
      std::string("rollback").compare(*type)) {
    strm << "The provided value '";
    strm << std::string(*type);
    strm << "' is not a valid enum value of type RTCSdpType.";
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  if (!Nan::HasOwnProperty(obj, Nan::New(kSdp).ToLocalChecked()).FromJust()) {
    strm << eSdpProperty;
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  String::Utf8Value sdp(obj->Get(Nan::New(kSdp).ToLocalChecked())->ToString());

  webrtc::SdpParseError error;
  webrtc::SessionDescriptionInterface *desc(
      webrtc::CreateSessionDescription(*type, *sdp, &error));

  if (!desc) {
    return Nan::ThrowError(
        Nan::New(ePrefix + error.description).ToLocalChecked());
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
