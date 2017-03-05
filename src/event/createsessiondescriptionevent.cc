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

#include "common.h"
#include "createsessiondescriptionevent.h"
#include "rtcsessiondescription.h"

using namespace v8;

CreateSessionDescriptionEvent::CreateSessionDescriptionEvent(
    Persistent<Function> *successCallback,
    Persistent<Function> *failureCallback) :
    _resolver(NULL),
    _successCallback(successCallback),
    _failureCallback(failureCallback) {
}

CreateSessionDescriptionEvent::CreateSessionDescriptionEvent(
    Persistent<Promise::Resolver> *resolver) :
    _resolver(resolver),
    _successCallback(NULL),
    _failureCallback(NULL) {
}

void CreateSessionDescriptionEvent::Handle() {
  Nan::HandleScope scope;

  if (_resolver) {
    Local<Promise::Resolver> resolver = Nan::New(*_resolver);

    if (_succeeded) {
      Local<Object> descriptionInitDict = Nan::New<Object>();

      descriptionInitDict->Set(LOCAL_STRING(RTCSessionDescription::kSdp),
                               LOCAL_STRING(_sdp));
      descriptionInitDict->Set(LOCAL_STRING(RTCSessionDescription::kType),
                               LOCAL_STRING(_type));

      resolver->Resolve(descriptionInitDict);
    } else {
      resolver->Reject(Nan::Error(_errorMessage.c_str()));
    }

    Isolate::GetCurrent()->RunMicrotasks();
    _resolver->Reset();
    delete _resolver;
    return;
  }

  if (_succeeded && _successCallback) {
    Local<Function> successCallback = Nan::New(*_successCallback);
    Nan::Callback cb(successCallback);

    Local<Object> descriptionInitDict = Nan::New<Object>();

    descriptionInitDict->Set(LOCAL_STRING(RTCSessionDescription::kSdp),
                             LOCAL_STRING(_sdp));
    descriptionInitDict->Set(LOCAL_STRING(RTCSessionDescription::kType),
                             LOCAL_STRING(_type));

    const int argc = 1;
    Local<Value> argv[1] = { descriptionInitDict };

    cb.Call(argc, argv);
  } else if (!_succeeded && _failureCallback) {
    Local<Function> failureCallback = Nan::New(*_failureCallback);
    Nan::Callback cb(failureCallback);

    const int argc = 1;
    Local<Value> argv[1] = { Nan::Error(_errorMessage.c_str()) };

    cb.Call(argc, argv);
  }

  _successCallback->Reset();
  _failureCallback->Reset();

  delete _successCallback;
  delete _failureCallback;
}

void CreateSessionDescriptionEvent::SetSucceeded(bool succeeded) {
  _succeeded = succeeded;
}

void CreateSessionDescriptionEvent::SetErrorMessage(
    const std::string &errorMessage) {
  _errorMessage = errorMessage;
}

void CreateSessionDescriptionEvent::SetSessionDescription(
    webrtc::SessionDescriptionInterface *sessionDescription) {
  _type = sessionDescription->type();
  sessionDescription->ToString(&_sdp);
}
