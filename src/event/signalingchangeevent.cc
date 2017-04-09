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
#include "signalingchangeevent.h"

using namespace v8;

SignalingChangeEvent::SignalingChangeEvent(
    Persistent<Function> *callback) :
    _callback(callback) {
}

void SignalingChangeEvent::Handle() {
  Nan::HandleScope scope;

  if (!_callback) {
    return;
  }

  Local<Function> callback = Nan::New(*_callback);
  Nan::Callback cb(callback);

  const int argc = 0;
  Local<Value> argv[1] = { };

  cb.Call(argc, argv);
}
