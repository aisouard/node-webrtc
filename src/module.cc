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

#include <nan.h>
#include "globals.h"
#include "rtccertificate.h"
#include "rtcicecandidate.h"
#include "rtcpeerconnection.h"
#include "rtcsessiondescription.h"

NAN_MODULE_INIT(Init) {
  Globals::Init();

  RTCCertificate::Init(target);
  RTCIceCandidate::Init(target);
  RTCPeerConnection::Init(target);
  RTCSessionDescription::Init(target);

  node::AtExit(Globals::Cleanup);
}

NODE_MODULE(webrtc, Init)
