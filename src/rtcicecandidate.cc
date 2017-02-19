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
#include <webrtc/p2p/base/candidate.h>

#include "rtcicecandidate.h"

Nan::Persistent<FunctionTemplate> RTCIceCandidate::constructor;

static const char sRTCIceCandidate[] = "RTCIceCandidate";

static const char kCandidate[] = "candidate";
static const char kSdpMid[] = "sdpMid";
static const char kSdpMLineIndex[] = "sdpMLineIndex";
static const char kFoundation[] = "foundation";
static const char kPriority[] = "priority";
static const char kIp[] = "ip";
static const char kProtocol[] = "protocol";
static const char kPort[] = "port";
static const char kType[] = "type";
static const char kTcpType[] = "tcpType";
static const char kRelatedAddress[] = "relatedAddress";
static const char kRelatedPort[] = "relatedPort";

static const char ePrefix[] =
    "Failed to construct 'RTCIceCandidate': ";
static const char eInvoke[] =
    "Class constructors cannot be invoked without 'new'";
static const char eArguments[] =
    "1 argument required, but only 0 present.";
static const char eNotObject[] =
    "parameter 1 ('candidateInitDict') is not an object.";
static const char eCandidateProperty[] =
    "The 'candidate' property is not a string, or is empty.";
static const char eBothAreNull[] =
    "Both 'sdpMid' and 'sdpMLineIndex' properties are null.";
static const char eSerialize[] =
    "Failed to serialize ICE candidate.";
static const char eExpectedValue[] =
    "Expected value type ";

NAN_MODULE_INIT(RTCIceCandidate::Init) {
  Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(New);

  ctor->SetClassName(Nan::New(sRTCIceCandidate).ToLocalChecked());
  ctor->InstanceTemplate()->SetInternalFieldCount(1);

  Local<ObjectTemplate> instance = ctor->InstanceTemplate();
  Nan::SetAccessor(instance, Nan::New(kCandidate).ToLocalChecked(),
                   GetCandidate);
  Nan::SetAccessor(instance, Nan::New(kSdpMid).ToLocalChecked(), GetSdpMid);
  Nan::SetAccessor(instance, Nan::New(kSdpMLineIndex).ToLocalChecked(),
                   GetSdpMLineIndex);

  Local<ObjectTemplate> prototype = ctor->PrototypeTemplate();
  Nan::SetAccessor(prototype, Nan::New(kFoundation).ToLocalChecked(),
                   GetCandidate);
  Nan::SetAccessor(prototype, Nan::New(kPriority).ToLocalChecked(),
                   GetPriority);
  Nan::SetAccessor(prototype, Nan::New(kIp).ToLocalChecked(), GetIp);
  Nan::SetAccessor(prototype, Nan::New(kProtocol).ToLocalChecked(),
                   GetProtocol);
  Nan::SetAccessor(prototype, Nan::New(kPort).ToLocalChecked(), GetPort);
  Nan::SetAccessor(prototype, Nan::New(kType).ToLocalChecked(), GetType);
  Nan::SetAccessor(prototype, Nan::New(kTcpType).ToLocalChecked(), GetTcpType);
  Nan::SetAccessor(prototype, Nan::New(kRelatedAddress).ToLocalChecked(),
                   GetRelatedAddress);
  Nan::SetAccessor(prototype, Nan::New(kRelatedPort).ToLocalChecked(),
                   GetRelatedPort);

  constructor.Reset(ctor);
  Nan::Set(target, Nan::New(sRTCIceCandidate).ToLocalChecked(),
           ctor->GetFunction());
}

RTCIceCandidate::RTCIceCandidate(webrtc::IceCandidateInterface *iceCandidate)
    : _iceCandidate(iceCandidate) {
}

RTCIceCandidate::~RTCIceCandidate() {
  delete _iceCandidate;
}

NAN_METHOD(RTCIceCandidate::New) {
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

  if (!Nan::HasOwnProperty(obj, Nan::New(kCandidate).ToLocalChecked()).FromJust()) {
    strm << eCandidateProperty;
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  Local<Value> candidateVal =
      obj->Get(Nan::New(kCandidate).ToLocalChecked());

  if (!candidateVal->IsString()) {
    strm << eCandidateProperty;
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  Local<Value> sdpMidVal = obj->Get(Nan::New(kSdpMid).ToLocalChecked());
  Local<Value> sdpMLineIndexVal = obj->Get(
      Nan::New(kSdpMLineIndex).ToLocalChecked());

  if ((sdpMidVal->IsNull() || sdpMidVal->IsUndefined()) &&
      (sdpMLineIndexVal->IsNull() || sdpMLineIndexVal->IsUndefined())) {
    strm << eBothAreNull;
    return Nan::ThrowTypeError(strm.str().c_str());
  }

  String::Utf8Value candidate(candidateVal->ToString());
  String::Utf8Value sdpMid(sdpMidVal->ToString());
  int32_t sdpMLineIndex = sdpMLineIndexVal->Int32Value();

  webrtc::SdpParseError error;
  webrtc::IceCandidateInterface *iceCandidate(
      webrtc::CreateIceCandidate(*sdpMid, sdpMLineIndex, *candidate, &error));

  if (!iceCandidate) {
    strm << error.description;
    return Nan::ThrowError(strm.str().c_str());
  }

  RTCIceCandidate *rtcIceCandidate = new RTCIceCandidate(iceCandidate);
  rtcIceCandidate->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

NAN_GETTER(RTCIceCandidate::GetCandidate) {
  std::string candidate;
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());

  if (!object->_iceCandidate->ToString(&candidate)) {
    return Nan::ThrowError(Nan::New(eSerialize).ToLocalChecked());
  }

  info.GetReturnValue().Set(Nan::New(candidate).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetSdpMid) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());

  info.GetReturnValue().Set(
      Nan::New(object->_iceCandidate->sdp_mid()).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetSdpMLineIndex) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());

  info.GetReturnValue().Set(object->_iceCandidate->sdp_mline_index());
}

NAN_GETTER(RTCIceCandidate::GetFoundation) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  info.GetReturnValue().Set(Nan::New(cand.foundation()).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetPriority) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  info.GetReturnValue().Set(cand.priority());
}

NAN_GETTER(RTCIceCandidate::GetIp) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  info.GetReturnValue().Set(
      Nan::New(cand.address().ipaddr().ToString()).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetProtocol) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  info.GetReturnValue().Set(Nan::New(cand.protocol()).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetPort) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  info.GetReturnValue().Set(cand.address().port());
}

NAN_GETTER(RTCIceCandidate::GetType) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  info.GetReturnValue().Set(Nan::New(cand.type()).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetTcpType) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();
  const std::string &tcptype = cand.tcptype();

  if (!tcptype.length()) {
    info.GetReturnValue().SetNull();
    return;
  }

  info.GetReturnValue().Set(Nan::New(tcptype).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetRelatedAddress) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  if (cand.related_address().IsNil()) {
    info.GetReturnValue().SetNull();
    return;
  }

  info.GetReturnValue().Set(
      Nan::New(cand.related_address().ipaddr().ToString()).ToLocalChecked());
}

NAN_GETTER(RTCIceCandidate::GetRelatedPort) {
  RTCIceCandidate *object = Nan::ObjectWrap::Unwrap<RTCIceCandidate>(
      info.This());
  const cricket::Candidate &cand = object->_iceCandidate->candidate();

  if (cand.related_address().IsNil()) {
    info.GetReturnValue().SetNull();
    return;
  }

  info.GetReturnValue().Set(cand.related_address().port());
}
