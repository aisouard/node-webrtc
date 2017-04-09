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

#include <iostream>
#include "globals.h"
#include "peerconnectionobserver.h"
#include "event/signalingchangeevent.h"

using namespace v8;

PeerConnectionObserver::PeerConnectionObserver() {
  _onSignalingStateChange = NULL;
}

PeerConnectionObserver::~PeerConnectionObserver() {
  if (_onSignalingStateChange) {
    _onSignalingStateChange->Reset();
    delete _onSignalingStateChange;
  }

  _peerConnection = NULL;
  _onSignalingStateChange = NULL;
}

void PeerConnectionObserver::OnSignalingChange(
    webrtc::PeerConnectionInterface::SignalingState new_state) {
  if (!_onSignalingStateChange) {
    return;
  }

  SignalingChangeEvent *event =
      new SignalingChangeEvent(_onSignalingStateChange);

  Globals::GetEventQueue()->PushEvent(event);
}

void PeerConnectionObserver::OnAddStream(
    rtc::scoped_refptr<webrtc::MediaStreamInterface> stream) {
  std::cout << "OnAddStream" << std::endl;
}

void PeerConnectionObserver::OnRemoveStream(
    rtc::scoped_refptr<webrtc::MediaStreamInterface> stream) {
  std::cout << "OnRemoveStream" << std::endl;
}

void PeerConnectionObserver::OnDataChannel(
    rtc::scoped_refptr<webrtc::DataChannelInterface> data_channel) {
  std::cout << "OnDataChannel" << std::endl;
}

void PeerConnectionObserver::OnRenegotiationNeeded() {
  std::cout << "OnRenegotiationNeeded" << std::endl;
}

void PeerConnectionObserver::OnIceConnectionChange(
    webrtc::PeerConnectionInterface::IceConnectionState new_state) {
  std::cout << "OnIceConnectionChange" << std::endl;
}

void PeerConnectionObserver::OnIceGatheringChange(
    webrtc::PeerConnectionInterface::IceGatheringState new_state) {
  std::cout << "OnIceGatheringChange" << std::endl;
}

void PeerConnectionObserver::OnIceCandidate(
    const webrtc::IceCandidateInterface *candidate) {
  std::cout << "OnIceCandidate" << std::endl;
}

void PeerConnectionObserver::OnIceCandidatesRemoved(
    const std::vector<cricket::Candidate> &candidates) {
  std::cout << "OnIceCandidatesRemoved" << std::endl;
}

void PeerConnectionObserver::OnIceConnectionReceivingChange(bool receiving) {
  std::cout << "OnIceConnectionReceivingChange" << std::endl;
}

PeerConnectionObserver *PeerConnectionObserver::Create() {
  return new rtc::RefCountedObject<PeerConnectionObserver>();
}

void PeerConnectionObserver::SetPeerConnection(
    rtc::scoped_refptr<webrtc::PeerConnectionInterface> peerConnection) {
  _peerConnection = peerConnection;
}

Local<Value> PeerConnectionObserver::GetOnSignalingStateChange() {
  if (!_onSignalingStateChange) {
    return Nan::Null();
  }

  return Nan::New(*_onSignalingStateChange);
}

Local<Value> PeerConnectionObserver::SetOnSignalingStateChange(
    Local<Value> value) {
  if (_onSignalingStateChange) {
    _onSignalingStateChange->Reset();
    delete _onSignalingStateChange;
    _onSignalingStateChange = NULL;
  }

  if (!value->IsFunction()) {
    return Nan::Null();
  }

  _onSignalingStateChange = new Nan::Persistent<Function>(value.As<Function>());
  return Nan::New(*_onSignalingStateChange);
}
