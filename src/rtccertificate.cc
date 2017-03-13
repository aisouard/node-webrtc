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

#include <iostream>
#include <webrtc/base/rtccertificate.h>
#include "rtccertificate.h"
#include "common.h"

static const char sRTCCertificate[] = "RTCCertificate";

static const char kExpires[] = "expires";
static const char kFingerprints[] = "fingerprints";
static const char kAlgorithm[] = "algorithm";
static const char kValue[] = "value";
static const char kPrivateKey[] = "privateKey";
static const char kCertificate[] = "certificate";
static const char kFromPEM[] = "fromPEM";
static const char kToPEM[] = "toPEM";

NAN_MODULE_INIT(RTCCertificate::Init) {
  Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(New);
  ctor->SetClassName(LOCAL_STRING(sRTCCertificate));
  ctor->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetMethod(ctor, kFromPEM, FromPEM);

  Local<ObjectTemplate> prototype = ctor->PrototypeTemplate();
  Nan::SetAccessor(prototype, LOCAL_STRING(kExpires), GetExpires);
  Nan::SetAccessor(prototype, LOCAL_STRING(kFingerprints), GetFingerprints);

  Nan::SetMethod(prototype, kToPEM, ToPEM);

  constructor().Reset(Nan::GetFunction(ctor).ToLocalChecked());

  Nan::Set(target, LOCAL_STRING(sRTCCertificate), ctor->GetFunction());
}

RTCCertificate::RTCCertificate(
    const rtc::scoped_refptr<rtc::RTCCertificate>& certificate)
    : _certificate(certificate) {
}

RTCCertificate::~RTCCertificate() {
}

Local<Object> RTCCertificate::Create(
    const rtc::scoped_refptr<rtc::RTCCertificate>& certificate) {
  Local<Function> cons = Nan::New(RTCCertificate::constructor());
  Local<Object> instance = Nan::NewInstance(cons, 0, NULL).ToLocalChecked();

  RTCCertificate *rtcCertificate = new RTCCertificate(certificate);
  rtcCertificate->Wrap(instance);

  return instance;
}

NAN_METHOD(RTCCertificate::New) {
}

NAN_GETTER(RTCCertificate::GetExpires) {
  UNWRAP_OBJECT(RTCCertificate, object);

  info.GetReturnValue().Set(
      static_cast<double>(object->_certificate->Expires()));
}

NAN_GETTER(RTCCertificate::GetFingerprints) {
  UNWRAP_OBJECT(RTCCertificate, object);

  const rtc::SSLCertificate &sslCertificate =
      object->_certificate->ssl_certificate();
  const std::string algorithm =
      sslCertificate.GetStats()->fingerprint_algorithm;
  const std::string value =
      sslCertificate.GetStats()->fingerprint;

  Local<Object> fingerprint = Nan::New<Object>();
  Local<Array> array = Nan::New<Array>();

  fingerprint->Set(LOCAL_STRING(kAlgorithm), LOCAL_STRING(algorithm));
  fingerprint->Set(LOCAL_STRING(kValue), LOCAL_STRING(value));
  array->Set(0, fingerprint);

  info.GetReturnValue().Set(array);
}

NAN_METHOD(RTCCertificate::ToPEM) {
  METHOD_HEADER("RTCCertificate", "toPEM");
  UNWRAP_OBJECT(RTCCertificate, object);

  rtc::RTCCertificatePEM _pem = object->_certificate->ToPEM();

  Local<Object> pem = Nan::New<Object>();
  pem->Set(LOCAL_STRING(kPrivateKey), LOCAL_STRING(_pem.private_key()));
  pem->Set(LOCAL_STRING(kCertificate), LOCAL_STRING(_pem.certificate()));

  info.GetReturnValue().Set(pem);
}

NAN_METHOD(RTCCertificate::FromPEM) {
  METHOD_HEADER("RTCCertificate", "fromPEM");

  ASSERT_SINGLE_ARGUMENT;
  ASSERT_OBJECT_ARGUMENT(0, pem);
  ASSERT_OBJECT_PROPERTY(pem, kPrivateKey, privateKeyVal);
  ASSERT_PROPERTY_STRING(kPrivateKey, privateKeyVal, privateKey);

  ASSERT_OBJECT_PROPERTY(pem, kCertificate, certificateVal);
  ASSERT_PROPERTY_STRING(kCertificate, certificateVal, certificate);

  rtc::RTCCertificatePEM _pem(*privateKey, *certificate);

  rtc::scoped_refptr<rtc::RTCCertificate> _certificate;
  _certificate = rtc::RTCCertificate::FromPEM(_pem);

  info.GetReturnValue().Set(RTCCertificate::Create(_certificate));
}
