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

#include <cstring>
#include <memory>
#include <iostream>
#include "common.h"
#include "globals.h"
#include "rtccertificate.h"
#include "rtcpeerconnection.h"

Nan::Persistent<FunctionTemplate> RTCPeerConnection::constructor;

static const char sRTCPeerConnection[] = "RTCPeerConnection";

static const char kGenerateCertificate[] = "generateCertificate";

static const char kName[] = "name";
static const char kRSA[] = "RSASSA-PKCS1-v1_5";
static const char kHash[] = "hash";
static const char kSHA256[] = "SHA-256";
static const char kModulusLength[] = "modulusLength";
static const char kPublicExponent[] = "publicExponent";
static const char kECDSA[] = "ECDSA";
static const char kNamedCurve[] = "namedCurve";
static const char kP256[] = "P-256";

static const char eCurve[] = "EcKeyGenParams: Unrecognized namedCurve";
static const char eHash[] = "Algorithm: Unrecognized hash";
static const char eName[] = "Algorithm: Unrecognized name";
static const char eUnsupported[] = "The 1st argument provided is an "
    "AlgorithmIdentifier with a supported algorithm name, but the parameters "
    "are not supported.";

static const char eFailure[] = "Failed to generate the certificate.";

NAN_MODULE_INIT(RTCPeerConnection::Init) {
  Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(New);
  ctor->SetClassName(LOCAL_STRING(sRTCPeerConnection));
  ctor->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetMethod(ctor, kGenerateCertificate, GenerateCertificate);

  constructor.Reset(ctor);
  Nan::Set(target, LOCAL_STRING(sRTCPeerConnection), ctor->GetFunction());
}

RTCPeerConnection::RTCPeerConnection() {
}

RTCPeerConnection::~RTCPeerConnection() {
}

NAN_METHOD(RTCPeerConnection::New) {
}

RTCPeerConnection::GenerateCertificateWorker::GenerateCertificateWorker
    (Persistent<Promise::Resolver> *resolver, const rtc::KeyParams& params)
    : Nan::AsyncWorker(nullptr), _params(params), _resolver(resolver) {
}

void RTCPeerConnection::GenerateCertificateWorker::Execute() {
  rtc::RTCCertificateGenerator *generator = Globals::GetCertificateGenerator();

  _certificate = generator->GenerateCertificate(_params,
                                                rtc::Optional<uint64_t>());
}

void RTCPeerConnection::GenerateCertificateWorker::WorkComplete() {
  Nan::HandleScope scope;
  Local<Promise::Resolver> resolver = Nan::New(*_resolver);

  if (!_certificate.get()) {
    std::stringstream errorStream;

    errorStream << eFailure;
    resolver->Reject(Nan::TypeError(errorStream.str().c_str()));
  } else {
    resolver->Resolve(RTCCertificate::Create(_certificate));
  }

  Isolate::GetCurrent()->RunMicrotasks();
  _resolver->Reset();
  delete _resolver;
}

NAN_METHOD(RTCPeerConnection::GenerateCertificate) {
  METHOD_HEADER("RTCPeerConnection", "generateCertificate");
  DECLARE_PROMISE_RESOLVER;

  ASSERT_REJECT_SINGLE_ARGUMENT;
  ASSERT_REJECT_OBJECT_ARGUMENT(0, keygenAlgorithm);
  ASSERT_REJECT_OBJECT_PROPERTY(keygenAlgorithm, kName, nameVal);
  ASSERT_REJECT_PROPERTY_STRING(kName, nameVal, name);

  rtc::KeyParams keyParams;
  if (!stricmp(kECDSA, (*name))) {
    ASSERT_REJECT_OBJECT_PROPERTY(keygenAlgorithm, kNamedCurve, namedCurveVal);
    ASSERT_REJECT_PROPERTY_STRING(kNamedCurve, namedCurveVal, namedCurve);

    if (stricmp(kP256, *namedCurve)) {
      errorStream << eCurve;
      resolver->Reject(Nan::GetCurrentContext(),
                       Nan::Error(errorStream.str().c_str()));
      return;
    }

    keyParams = rtc::KeyParams::ECDSA(rtc::ECCurve::EC_NIST_P256);
  } else if (!stricmp(kRSA, (*name))) {
    ASSERT_REJECT_OBJECT_PROPERTY(keygenAlgorithm, kHash, hashVal);
    ASSERT_REJECT_PROPERTY_STRING(kHash, hashVal, hash);

    if (stricmp(kSHA256, *hash)) {
      errorStream << eHash;
      resolver->Reject(Nan::GetCurrentContext(),
                       Nan::Error(errorStream.str().c_str()));
      return;
    }

    ASSERT_REJECT_OBJECT_PROPERTY(keygenAlgorithm, kModulusLength,
                                  modulusLengthVal);
    ASSERT_REJECT_PROPERTY_NUMBER(kModulusLength, modulusLengthVal,
                                  modulusLength);
    ASSERT_REJECT_OBJECT_PROPERTY(keygenAlgorithm, kPublicExponent,
                                  publicExponentVal);
    ASSERT_REJECT_PROPERTY_UINT8ARRAY(kPublicExponent, publicExponentVal,
                                      publicExponentArray);

    int modulus = modulusLength->Int32Value();
    if (modulus < rtc::kRsaMinModSize || modulus > rtc::kRsaMaxModSize) {
      errorStream << eUnsupported;

      resolver->Reject(Nan::GetCurrentContext(),
                       Nan::Error(errorStream.str().c_str()));
      return;
    }

    size_t publicExponentLength = publicExponentArray->Length();
    if (publicExponentLength < 1 || publicExponentLength > 4) {
      errorStream << eUnsupported;

      resolver->Reject(Nan::GetCurrentContext(),
                       Nan::Error(errorStream.str().c_str()));
      return;
    }

    uint8_t publicExponent[4] = { 0, 0, 0, 0 };
    for (uint32_t i = 0; i < publicExponentLength; ++i) {
      publicExponent[i] =
          static_cast<uint8_t>(publicExponentArray->Get(i)->Uint32Value());
    }

    uint32_t publicExponentValue = (publicExponent[3] << 24)
                                   + (publicExponent[2] << 16)
                                   + (publicExponent[1] << 8)
                                   + publicExponent[0];

    keyParams = rtc::KeyParams::RSA(modulusLength->Int32Value(),
                                    publicExponentValue);
  } else {
    errorStream << eName;
    resolver->Reject(Nan::GetCurrentContext(),
                     Nan::Error(errorStream.str().c_str()));
    return;
  }

  Nan::AsyncQueueWorker(new GenerateCertificateWorker(
      new Nan::Persistent<Promise::Resolver>(resolver), keyParams));
}
