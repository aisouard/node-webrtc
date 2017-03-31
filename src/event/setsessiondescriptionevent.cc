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
#include "setsessiondescriptionevent.h"
#include "rtcsessiondescription.h"

using namespace v8;

SetSessionDescriptionEvent::SetSessionDescriptionEvent(
    Persistent<Function> *successCallback,
    Persistent<Function> *failureCallback) :
    _resolver(NULL),
    _successCallback(successCallback),
    _failureCallback(failureCallback) {
}

SetSessionDescriptionEvent::SetSessionDescriptionEvent(
    Persistent<Promise::Resolver> *resolver) :
    _resolver(resolver),
    _successCallback(NULL),
    _failureCallback(NULL) {
}

void SetSessionDescriptionEvent::Handle() {
}

void SetSessionDescriptionEvent::SetSucceeded(bool succeeded) {
  _succeeded = succeeded;
}

void SetSessionDescriptionEvent::SetErrorMessage(
    const std::string &errorMessage) {
  _errorMessage = errorMessage;
}
