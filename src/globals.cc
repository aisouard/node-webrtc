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

#if WEBRTC_WIN
#include <webrtc/base/win32socketinit.h>
#include <webrtc/base/win32socketserver.h>
#endif

#include <webrtc/base/ssladapter.h>
#include "globals.h"

rtc::Thread *Globals::_signalingThread = NULL;
rtc::Thread *Globals::_workerThread = NULL;
webrtc::PeerConnectionFactoryInterface *Globals::_peerConnectionFactory = NULL;

bool Globals::Init() {
#if WEBRTC_WIN
  rtc::EnsureWinsockInit();
#endif

  rtc::InitializeSSL();
  rtc::InitRandom(rtc::Time());
  rtc::ThreadManager::Instance()->WrapCurrentThread();

  _signalingThread = new rtc::Thread();
  _workerThread = new rtc::Thread();

  _signalingThread->SetName("signaling_thread", NULL);
  _workerThread->SetName("worker_thread", NULL);

  if (!_signalingThread->Start() || !_workerThread->Start()) {
    return false;
  }

  rtc::ThreadManager::Instance()->SetCurrentThread(_signalingThread);

  if (rtc::ThreadManager::Instance()->CurrentThread() != _signalingThread) {
    Nan::ThrowError("Failed to set the current thread.");
  }

  _peerConnectionFactory =
      webrtc::CreatePeerConnectionFactory(_signalingThread,
                                          _workerThread,
                                          NULL, NULL, NULL).release();

  return true;
}

bool Globals::Update() {
  return rtc::Thread::Current()->ProcessMessages(0);
}

void Globals::Cleanup(void* args) {
  _peerConnectionFactory->Release();
  _peerConnectionFactory = NULL;

  _signalingThread->SetAllowBlockingCalls(true);
  _signalingThread->Stop();

  _workerThread->SetAllowBlockingCalls(true);
  _workerThread->Stop();

  if (rtc::ThreadManager::Instance()->CurrentThread() == _signalingThread) {
    rtc::ThreadManager::Instance()->SetCurrentThread(NULL);
  }

  delete _signalingThread;
  delete _workerThread;

  _signalingThread = NULL;
  _workerThread = NULL;

  rtc::CleanupSSL();
}

rtc::Thread *Globals::GetSignalingThread() {
  return _signalingThread;
}

rtc::Thread *Globals::GetWorkerThread() {
  return _workerThread;
}

webrtc::PeerConnectionFactoryInterface *Globals::GetPeerConnectionFactory() {
  return _peerConnectionFactory;
}
