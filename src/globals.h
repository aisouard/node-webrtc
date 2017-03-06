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

#ifndef GLOBALS_H_
#define GLOBALS_H_

#include "event/eventqueue.h"
#include <webrtc/api/peerconnectioninterface.h>
#include <webrtc/base/thread.h>

class Globals {
 public:
  static bool Init();
  static void Cleanup(void* args);

  static EventQueue *GetEventQueue();
  static rtc::RTCCertificateGenerator *GetCertificateGenerator();
  static webrtc::PeerConnectionFactoryInterface *GetPeerConnectionFactory();

 private:
  static EventQueue *_eventQueue;
  static rtc::Thread *_networkThread;
  static rtc::Thread *_signalingThread;
  static rtc::Thread *_workerThread;
  static rtc::RTCCertificateGenerator *_certificateGenerator;
  static rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface>
      _peerConnectionFactory;
};

#endif  // GLOBALS_H_
