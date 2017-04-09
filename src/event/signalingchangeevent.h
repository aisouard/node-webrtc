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

#ifndef EVENT_SIGNALINGCHANGEEVENT_H_
#define EVENT_SIGNALINGCHANGEEVENT_H_

#include <nan.h>
#include "event.h"

using namespace v8;

class SignalingChangeEvent : public Event {
 public:
  explicit SignalingChangeEvent(Persistent<Function> *callback);

  void Handle();

 private:
  Persistent<Function> *_callback;
};

#endif  // EVENT_SIGNALINGCHANGEEVENT_H_
