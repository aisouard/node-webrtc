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

#ifdef WIN32
#include <webrtc/base/win32socketinit.h>
#include <webrtc/base/win32socketserver.h>
#include <Windows.h>
#endif

#include <webrtc/base/ssladapter.h>
#include <iostream>
#include "globals.h"

EventQueue *Globals::_eventQueue = NULL;
rtc::Thread *Globals::_signalingThread = NULL;
rtc::Thread *Globals::_workerThread = NULL;
rtc::RTCCertificateGenerator *Globals::_certificateGenerator = NULL;

bool Globals::Init() {
  _eventQueue = new EventQueue();

#if WEBRTC_WIN
  rtc::EnsureWinsockInit();
#endif

  rtc::InitializeSSL();
  rtc::InitRandom(rtc::Time());

  _signalingThread = new rtc::Thread();
  _workerThread = new rtc::Thread();

  _signalingThread->SetName("signaling_thread", NULL);
  _workerThread->SetName("worker_thread", NULL);

  if (!_signalingThread->Start() ||
      !_workerThread->Start()) {
    return false;
  }

  _certificateGenerator =
      new rtc::RTCCertificateGenerator(_signalingThread, _workerThread);

  return true;
}

void Globals::Cleanup(void* args) {
  delete _certificateGenerator;

  _signalingThread->Stop();
  _workerThread->Stop();

  delete _signalingThread;
  delete _workerThread;

  _signalingThread = NULL;
  _workerThread = NULL;

  rtc::CleanupSSL();

  delete _eventQueue;
  _eventQueue = NULL;
}

EventQueue *Globals::GetEventQueue() {
  return _eventQueue;
}

rtc::RTCCertificateGenerator *Globals::GetCertificateGenerator() {
  return _certificateGenerator;
}

rtc::Thread *Globals::GetSignalingThread() {
  return _signalingThread;
}

rtc::Thread *Globals::GetWorkerThread() {
  return _workerThread;
}
