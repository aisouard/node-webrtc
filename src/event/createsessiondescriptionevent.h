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

#ifndef EVENT_CREATESESSIONDESCRIPTIONEVENT_H_
#define EVENT_CREATESESSIONDESCRIPTIONEVENT_H_

#include <nan.h>
#include <webrtc/api/jsep.h>
#include "event.h"

using namespace v8;

class CreateSessionDescriptionEvent : public Event {
 public:
  explicit CreateSessionDescriptionEvent(
      Persistent<Promise::Resolver> *resolver);
  CreateSessionDescriptionEvent(Persistent<Function> *successCallback,
                                Persistent<Function> *failureCallback);

  void Handle();
  void SetSucceeded(bool succeeded);
  void SetErrorMessage(const std::string& errorMessage);
  void SetSessionDescription(
      webrtc::SessionDescriptionInterface *sessionDescription);

 private:
  Persistent<Promise::Resolver> *_resolver;
  Persistent<Function> *_successCallback;
  Persistent<Function> *_failureCallback;
  bool _succeeded;
  std::string _errorMessage;
  std::string _type;
  std::string _sdp;
};

#endif  // EVENT_CREATESESSIONDESCRIPTIONEVENT_H_
