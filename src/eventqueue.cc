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

#include <uv.h>
#include <algorithm>
#include "event.h"
#include "eventqueue.h"

EventQueue::EventQueue() {
  _async = new uv_async_t;
  uv_async_init(uv_default_loop(), _async,
                reinterpret_cast<uv_async_cb>(EventQueue::AsyncCallback));

  _async->data = this;
  uv_mutex_init(&_async_lock);
}

EventQueue::~EventQueue() {
  uv_mutex_destroy(&_async_lock);
}

void EventQueue::AsyncCallback(uv_async_t *handle, int status) {
  EventQueue *self = reinterpret_cast<EventQueue*>(handle->data);

  if (!self) {
    return;
  }

  self->Flush();
}

void EventQueue::HandleEvent(Event *event) {
  event->Handle();
  delete event;
}

void EventQueue::PushEvent(Event *event) {
  uv_mutex_lock(&_async_lock);

  _queue.push_back(event);

  uv_mutex_unlock(&_async_lock);
  uv_async_send(this->_async);
}

void EventQueue::Flush() {
  std::vector<Event*> eventList;

  uv_mutex_lock(&_async_lock);

  if (_queue.empty()) {
    uv_mutex_unlock(&_async_lock);
    return;
  }

  std::copy(_queue.begin(), _queue.end(), std::back_inserter(eventList));
  _queue.clear();

  uv_mutex_unlock(&_async_lock);
  std::for_each(eventList.begin(), eventList.end(), EventQueue::HandleEvent);
  eventList.clear();
}
