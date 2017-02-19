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

#ifndef COMMON_H_
#define COMMON_H_

#include <sstream>
#include <webrtc/base/logging.h>

#define ERROR_INVOKE_WITHOUT_NEW \
  "Class constructors cannot be invoked without 'new'"

#define ERROR_CONSTRUCT_PREFIX(NAME) \
  "Failed to construct '" #NAME "': "

#define ERROR_NOT_SINGLE_ARGUMENT(COUNT) \
  "1 argument required, but only " << COUNT << " present."

#define ERROR_NOT_ENOUGH_ARGUMENTS(I, COUNT) \
  I << " arguments required, but only " << COUNT << " present."

#define ERROR_PROPERTY_NOT_STRING(NAME) \
  "The '" << NAME << "' property is not a string, or is empty."

#define ERROR_PROPERTY_NOT_DEFINED(NAME) \
  "The '" << NAME << "' property is undefined."

#define ERROR_ARGUMENT_NOT_OBJECT(INDEX, NAME) \
  "parameter " << INDEX << " ('" << NAME << "') is not an object."

#ifdef DEBUG
#define CONSTRUCTOR_HEADER(NAME) \
  LOG(LS_INFO) << __PRETTY_FUNCTION__; \
  std::stringstream errorStream; \
  errorStream << ERROR_CONSTRUCT_PREFIX(NAME);
#define METHOD_HEADER(NAME) \
  LOG(LS_INFO) << __PRETTY_FUNCTION__; \
  std::stringstream errorStream;
#else
#define CONSTRUCTOR_HEADER(NAME) \
  std::stringstream errorStream; \
  errorStream << ERROR_CONSTRUCT_PREFIX(NAME);
#define METHOD_HEADER(NAME) \
  std::stringstream errorStream;
#endif

#define ASSERT_CONSTRUCT_CALL \
  if (!info.IsConstructCall()) { \
    errorStream << ERROR_INVOKE_WITHOUT_NEW; \
    return Nan::ThrowError(errorStream.str().c_str()); \
  }

#define ASSERT_SINGLE_ARGUMENT \
  if (info.Length() < 1) { \
    errorStream << ERROR_NOT_SINGLE_ARGUMENT(info.Length()); \
    return Nan::ThrowError(errorStream.str().c_str()); \
  }

#define ASSERT_ARGUMENTS_COUNT(I) \
  if (info.Length() < I) { \
    errorStream << ERROR_NOT_ENOUGH_ARGUMENTS(I, info.Length()); \
    return Nan::ThrowError(errorStream.str().c_str()); \
  }

#define ASSERT_OBJECT_ARGUMENT(I, N) \
  if (!info[0]->IsObject()) { \
    errorStream << ERROR_ARGUMENT_NOT_OBJECT(I + 1, #N); \
    return Nan::ThrowTypeError(errorStream.str().c_str()); \
  } \
  \
  Local<Object> N = info[0]->ToObject();

#define ASSERT_OBJECT_PROPERTY(O, P, V) \
  if (!Nan::HasOwnProperty(O, Nan::New(P).ToLocalChecked()).FromJust()) { \
    errorStream << ERROR_PROPERTY_NOT_DEFINED(P); \
    return Nan::ThrowTypeError(errorStream.str().c_str()); \
  } \
  \
  Local<Value> V = O->Get(Nan::New(P).ToLocalChecked());

#define ASSERT_PROPERTY_STRING(N, V, S) \
  if (!V->IsString()) { \
    errorStream << ERROR_PROPERTY_NOT_STRING(N); \
    return Nan::ThrowTypeError(errorStream.str().c_str()); \
  } \
  \
  String::Utf8Value S(V->ToString());

#define DECLARE_OBJECT_PROPERTY(O, P, V) \
  Local<Value> V = O->Get(LOCAL_STRING(P));

#define LOCAL_STRING(S) \
  Nan::New(S).ToLocalChecked()

#define HAS_OWN_PROPERTY(O, P) \
  Nan::HasOwnProperty(O, LOCAL_STRING(P)).FromJust()

#define IS_STRICTLY_NULL(V) \
  (V->IsNull() || V->IsUndefined())

#endif  // COMMON_H_
