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

'use strict';

const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const RTCPeerConnection = require('../').RTCPeerConnection;

chai.use(chaiAsPromised);

describe('RTCPeerConnection', () => {
  describe('constructor', () => {
    describe('called with no parameters', () => {
      const pc = new RTCPeerConnection();

      it('should resolve with a RTCPeerConnection', () => {
        assert.instanceOf(pc, RTCPeerConnection);
      });
    });
  });

  describe('instance', () => {
    const pc = new RTCPeerConnection();

    describe('signalingState property', () => {
      it('should be set to \'stable\'', () => {
        assert.equal(pc.signalingState, 'stable');
      });

      it('should be read-only', () => {
        pc.signalingState = 'another value';
        assert.equal(pc.signalingState, 'stable');
      });
    });

    describe('iceConnectionState property', () => {
      it('should be set to \'new\'', () => {
        assert.equal(pc.iceConnectionState, 'new');
      });

      it('should be read-only', () => {
        pc.iceConnectionState = 'another value';
        assert.equal(pc.iceConnectionState, 'new');
      });
    });

    describe('iceGatheringState property', () => {
      it('should be set to \'new\'', () => {
        assert.equal(pc.iceGatheringState, 'new');
      });

      it('should be read-only', () => {
        pc.iceGatheringState = 'another value';
        assert.equal(pc.iceGatheringState, 'new');
      });
    });

    describe('connectionState property', () => {
      it('should be set to \'new\'', () => {
        assert.equal(pc.connectionState, 'new');
      });

      it('should be read-only', () => {
        pc.connectionState = 'another value';
        assert.equal(pc.connectionState, 'new');
      });
    });

    describe('pendingLocalDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.pendingLocalDescription);
      });

      it('should be read-only', () => {
        pc.pendingLocalDescription = 'another value';
        assert.isNull(pc.pendingLocalDescription);
      });
    });

    describe('currentLocalDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.currentLocalDescription);
      });

      it('should be read-only', () => {
        pc.currentLocalDescription = 'another value';
        assert.isNull(pc.currentLocalDescription);
      });
    });

    describe('pendingRemoteDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.pendingRemoteDescription);
      });

      it('should be read-only', () => {
        pc.pendingRemoteDescription = 'another value';
        assert.isNull(pc.pendingRemoteDescription);
      });
    });

    describe('currentRemoteDescription property', () => {
      it('should be null', () => {
        assert.isNull(pc.currentRemoteDescription);
      });

      it('should be read-only', () => {
        pc.currentRemoteDescription = 'another value';
        assert.isNull(pc.currentRemoteDescription);
      });
    });
  });

  describe('static method \'generateCertificate\'', () => {
    const errorPrefix = 'Failed to execute \'generateCertificate\' on ' +
      '\'RTCPeerConnection\': ';

    describe('called with no parameters', () => {
      it('should throw a TypeError', () => {
        return assert.isRejected(
          RTCPeerConnection.generateCertificate(),
          TypeError, errorPrefix + '1 argument required, but only 0 present.');
      });
    });

    describe('called with a String', () => {
      it('should throw a TypeError', () => {
        return assert.isRejected(
          RTCPeerConnection.generateCertificate(''),
          TypeError, errorPrefix + 'parameter 1 (\'keygenAlgorithm\') ' +
          'is not an object.');
      });
    });

    describe('called with an Object', () => {
      describe('not having \'name\' property', () => {
        it('should throw a TypeError', () => {
          return assert.isRejected(
            RTCPeerConnection.generateCertificate({}),
            TypeError, errorPrefix + 'The \'name\' property is undefined.');
        });
      });

      describe('having \'name\' property', () => {
        describe('set to undefined', () => {
          it('should throw a TypeError', () => {
            return assert.isRejected(
              RTCPeerConnection.generateCertificate({
                name: undefined
              }),
              TypeError, errorPrefix + 'The \'name\' property ' +
              'is not a string, or is empty.');
          });
        });

        describe('set to a Number', () => {
          it('should throw a TypeError', () => {
            return assert.isRejected(
              RTCPeerConnection.generateCertificate({
                name: 1.26
              }),
              TypeError, errorPrefix + 'The \'name\' property ' +
              'is not a string, or is empty.');
          });
        });

        describe('set to an empty Object', () => {
          it('should throw a TypeError', () => {
            return assert.isRejected(
              RTCPeerConnection.generateCertificate({
                name: {}
              }),
              TypeError, errorPrefix + 'The \'name\' property ' +
              'is not a string, or is empty.');
          });
        });

        describe('set to an empty String', () => {
          it('should throw an Error', () => {
            return assert.isRejected(
              RTCPeerConnection.generateCertificate({
                name: ''
              }),
              Error, errorPrefix + 'Algorithm: Unrecognized name');
          });
        });

        describe('set to a String having an invalid name', () => {
          it('should throw an Error', () => {
            return assert.isRejected(
              RTCPeerConnection.generateCertificate({
                name: 'md5'
              }),
              Error, errorPrefix + 'Algorithm: Unrecognized name');
          });
        });

        describe('set to \'ECDSA\'', () => {
          describe('not having \'namedCurve\' property', () => {
            it('should throw an Error', () => {
              return assert.isRejected(
                RTCPeerConnection.generateCertificate({
                  name: 'ECDSA'
                }),
                TypeError, errorPrefix +
                'The \'namedCurve\' property is undefined.');
            });
          });

          describe('having \'namedCurve\' property', () => {
            describe('not set', () => {
              it('should throw an Error', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'ECDSA'
                  }),
                  TypeError, errorPrefix +
                  'The \'namedCurve\' property is undefined.');
              });
            });

            describe('set to a number', () => {
              it('should throw an Error', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'ECDSA',
                    namedCurve: 1.66
                  }),
                  Error, errorPrefix + 'The \'namedCurve\' property ' +
                  'is not a string, or is empty.');
              });
            });

            describe('set to an unknown value', () => {
              it('should throw an Error', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'ECDSA',
                    namedCurve: 'SHA1withPKCSandRSAoutdatedstuff'
                  }),
                  Error, errorPrefix + 'EcKeyGenParams: ' +
                  'Unrecognized namedCurve');
              });
            });

            describe('set to \'P-256\'', () => {
              it('should resolve with a RTCCertificate', () => {
                return assert.eventually.typeOf(
                  RTCPeerConnection.generateCertificate({
                    name: 'ECDSA',
                    namedCurve: 'P-256'
                  }),
                  'RTCCertificate');
              });
            });
          });
        });

        describe('set to \'RSASSA-PKCS1-v1_5\'', () => {
          describe('not having \'hash\' property', () => {
            it('should throw a TypeError', () => {
              return assert.isRejected(
                RTCPeerConnection.generateCertificate({
                  name: 'RSASSA-PKCS1-v1_5'
                }),
                TypeError, errorPrefix + 'The \'hash\' property is undefined.');
            });
          });

          describe('having \'hash\' property', () => {
            describe('set to undefined', () => {
              it('should throw a TypeError', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: undefined
                  }),
                  TypeError, errorPrefix + 'The \'hash\' property ' +
                  'is not a string, or is empty.');
              });
            });

            describe('set to a Number', () => {
              it('should throw a TypeError', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 1.26
                  }),
                  TypeError, errorPrefix + 'The \'hash\' property ' +
                  'is not a string, or is empty.');
              });
            });

            describe('set to an empty Object', () => {
              it('should throw a TypeError', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: {}
                  }),
                  TypeError, errorPrefix + 'The \'hash\' property ' +
                  'is not a string, or is empty.');
              });
            });

            describe('set to an empty String', () => {
              it('should throw an Error', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: ''
                  }),
                  Error, errorPrefix + 'Algorithm: Unrecognized hash');
              });
            });

            describe('set to a String having an invalid name', () => {
              it('should throw an Error', () => {
                return assert.isRejected(
                  RTCPeerConnection.generateCertificate({
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 'md5'
                  }),
                  Error, errorPrefix + 'Algorithm: Unrecognized hash');
              });
            });

            describe('set to \'SHA-256\'', () => {
              describe('not having \'modulusLength\' property', () => {
                it('should throw an Error', () => {
                  return assert.isRejected(
                    RTCPeerConnection.generateCertificate({
                      name: 'RSASSA-PKCS1-v1_5',
                      hash: 'SHA-256'
                    }),
                    TypeError, errorPrefix +
                    'The \'modulusLength\' property is undefined.');
                });
              });

              describe('having \'modulusLength\' property', () => {
                describe('set to undefined', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: undefined
                      }),
                      TypeError, errorPrefix + 'The \'modulusLength\' ' +
                      'property is not a number.');
                  });
                });

                describe('set to a String', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 'thisisthemodulus'
                      }),
                      TypeError, errorPrefix + 'The \'modulusLength\' ' +
                      'property is not a number.');
                  });
                });

                describe('set to a Number', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 25
                      }),
                      TypeError, errorPrefix + 'The \'publicExponent\' ' +
                      'property is undefined.');
                  });
                });
              });

              describe('having \'publicExponent\' property', () => {
                describe('set to undefined', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 25,
                        publicExponent: undefined
                      }),
                      TypeError, errorPrefix + 'The \'publicExponent\' ' +
                      'property is not a Uint8Array.');
                  });
                });

                describe('set to a Number', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 25,
                        publicExponent: 12
                      }),
                      TypeError, errorPrefix + 'The \'publicExponent\' ' +
                      'property is not a Uint8Array.');
                  });
                });

                describe('set to a String', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 25,
                        publicExponent: 'invalid'
                      }),
                      TypeError, errorPrefix + 'The \'publicExponent\' ' +
                      'property is not a Uint8Array.');
                  });
                });

                describe('set to an empty Uint8Array', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 1024,
                        publicExponent: new Uint8Array([])
                      }),
                      Error, errorPrefix + 'The 1st argument provided is ' +
                      'an AlgorithmIdentifier with a supported algorithm ' +
                      'name, but the parameters are not supported.');
                  });
                });

                describe('set to an invalid Uint8Array', () => {
                  it('should throw a TypeError', () => {
                    return assert.isRejected(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 1024,
                        publicExponent: new Uint8Array([1, 1, 1, 1, 1])
                      }),
                      Error, errorPrefix + 'The 1st argument provided is ' +
                      'an AlgorithmIdentifier with a supported algorithm ' +
                      'name, but the parameters are not supported.');
                  });
                });

                describe('set to a valid Uint8Array', () => {
                  it('should resolve with a RTCCertificate', () => {
                    return assert.eventually.typeOf(
                      RTCPeerConnection.generateCertificate({
                        name: 'RSASSA-PKCS1-v1_5',
                        hash: 'SHA-256',
                        modulusLength: 1024,
                        publicExponent: new Uint8Array([1, 0, 1])
                      }),
                      'RTCCertificate');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
