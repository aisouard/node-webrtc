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
const RTCCertificate = require('../').RTCCertificate;
const RTCPeerConnection = require('../').RTCPeerConnection;

describe('RTCCertificate', () => {
  describe('generated using \'RSASSA-PKCS1-v1_5\' algorithm', () => {
    let certificate;
    const now = (+ new Date());

    before((done) => {
      RTCPeerConnection.generateCertificate({
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1])
      }).then((cert) => {
        certificate = cert;
        done();
      });
    });

    describe('expire property', () => {
      it('should be read-only', () => {
        const value = certificate.expires;

        certificate.expires = 1;
        assert.equal(certificate.expires, value);
      });

      it('should be 30 days higher than now', () => {
        const expected =
          Math.floor((now + (1000 * 60 * 60 * 24 * 30)) / 1000) * 1000;

        assert.closeTo(Math.floor(certificate.expires / 1000) * 1000,
          expected, 10000);
      });
    });

    describe('\'fingerprints\' property', () => {
      it('should be read-only', () => {
        const fingerprint = certificate.fingerprints[0];

        certificate.fingerprints[0] = {
          'algorithm': 'null',
          'value': 'invalid'
        };

        assert.deepEqual(certificate.fingerprints[0], fingerprint);
      });

      it('should be an array of objects having \'algorithm\' and \'value\' ' +
        'properties', () => {
        const fingerprint = certificate.fingerprints[0];

        assert.property(fingerprint, 'algorithm');
        assert.property(fingerprint, 'value');
        assert.typeOf(fingerprint.algorithm, 'string');
        assert.typeOf(fingerprint.value, 'string');
      });
    });

    describe('\'toPEM\' method', () => {
      it('should return an object having \'privateKey\' and \'certificate\'' +
        'properties', () => {
          const pem = certificate.toPEM();

          assert.property(pem, 'privateKey');
          assert.property(pem, 'certificate');
          assert.typeOf(pem.privateKey, 'string');
          assert.typeOf(pem.certificate, 'string');

          assert.include(pem.privateKey, '-----BEGIN PRIVATE KEY-----');
          assert.include(pem.privateKey, '-----END PRIVATE KEY-----');
          assert.include(pem.certificate, '-----BEGIN CERTIFICATE-----');
          assert.include(pem.certificate, '-----END CERTIFICATE-----');
      });
    });
  });

  describe('\'fromPEM\' static method', () => {
    const errorPrefix = 'Failed to execute \'fromPEM\' on ' +
      '\'RTCCertificate\': ';
    let certificateFromPEM;

    describe('called without arguments', () => {
      it('should throw an Error', () => {
        assert.throws(() => {
          RTCCertificate.fromPEM();
        }, Error, errorPrefix + '1 argument required, but only 0 present.');
      });
    });

    describe('called with a single argument', () => {
      describe('not being an Object', () => {
        it('should throw a TypeError', () => {
          assert.throws(() => {
            RTCCertificate.fromPEM('');
          }, TypeError, errorPrefix + 'parameter 1 (\'pemCertificate\') ' +
            'is not an object.');
          assert.throws(() => {
            RTCCertificate.fromPEM(1.26);
          }, TypeError, errorPrefix + 'parameter 1 (\'pemCertificate\') ' +
            'is not an object.');
        });
      });

      describe('being an Object', () => {
        describe('without \'privateKey\' ' +
          'and \'certificate\' properties', () => {
          it('should throw a TypeError', () => {
            assert.throws(() => {
              RTCCertificate.fromPEM({});
            }, TypeError, errorPrefix + 'The \'privateKey\' ' +
              'property is undefined.');
          });
        });

        describe('with \'privateKey\' property', () => {
          describe('not being a String', () => {
            it('should throw a TypeError', () => {
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: undefined
                });
              }, TypeError, errorPrefix + 'The \'privateKey\' ' +
                'property is not a string, or is empty.');
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: 95
                });
              }, TypeError, errorPrefix + 'The \'privateKey\' ' +
                'property is not a string, or is empty.');
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: []
                });
              }, TypeError, errorPrefix + 'The \'privateKey\' ' +
                'property is not a string, or is empty.');
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: {}
                });
              }, TypeError, errorPrefix + 'The \'privateKey\' ' +
                'property is not a string, or is empty.');
            });
          });
        });

        describe('without \'certificate\' property', () => {
          it('should throw a TypeError', () => {
            assert.throws(() => {
              RTCCertificate.fromPEM({
                privateKey: 'my private key'
              });
            }, TypeError, errorPrefix + 'The \'certificate\' ' +
              'property is undefined.');
          });
        });

        describe('with \'certificate\' property', () => {
          describe('not being a String', () => {
            it('should throw a TypeError', () => {
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: 'my private key',
                  certificate: 1.58
                });
              }, TypeError, errorPrefix + 'The \'certificate\' ' +
                'property is not a string, or is empty.');
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: 'my private key',
                  certificate: []
                });
              }, TypeError, errorPrefix + 'The \'certificate\' ' +
                'property is not a string, or is empty.');
              assert.throws(() => {
                RTCCertificate.fromPEM({
                  privateKey: 'my private key',
                  certificate: {}
                });
              }, TypeError, errorPrefix + 'The \'certificate\' ' +
                'property is not a string, or is empty.');
            });
          });
        });
      });
    });

    describe('called with an invalid PEM certificate', () => {
      const privateKey = [
        '-----BEGIN PRIVATE KEY-----',
        'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAPchSTtXMGYyIR/M',
        '-----END PRIVATE KEY-----',
        ''
      ].join('\n');

      const certificate = [
        '-----BEGIN CERTIFICATE-----',
        'MIIBnjCCAQegAwIBAgIJAKtOPw6rAgdiMA0GCSqGSIb3DQEBCwUAMBExDzANBgNV',
        '-----END CERTIFICATE-----',
        ''
      ].join('\n');

      it('should throw an Error', () => {
        assert.throws(() => {
          RTCCertificate.fromPEM({
            privateKey: privateKey,
            certificate: certificate
          });
        }, Error, errorPrefix + 'Failed to import the PEM certificate.');
      });
    });

    describe('called with a valid PEM certificate', () => {
      const privateKey = [
        '-----BEGIN PRIVATE KEY-----',
        'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAPchSTtXMGYyIR/M',
        '8qfHrX4MX7Noz7X3DvXJ8Jl0Ef5Jb7Ujcl8wtUBvHOSzlirNUW+ueZUeySBi93t7',
        'gpVu3+TTyne5oHQ46j4vpWBnLccfZvUkbO7ZT3wWN3cUjCkOtsLZAwrJcMIiQzjT',
        'EcYDTyZzC6rhUqTFnFyNRoBP4OQLAgMBAAECgYBSR6bWNwVKQU5+BAKWkgjVetEy',
        'LqdZclRsyTtuHBMRkum6aX7e6pyuQ1BfZNuOjKWchX69g257dffoCQtFLZElO09F',
        'Ebg2l3Aksx9EjzdVSB29yKA0wZX3gmJIDmOsNGgq54KhGelF4/V7GZmDoEiCyYeV',
        'PRmSJI0aNAQ9wEIxoQJBAP4AB26P0sCvnky452VNPpEzX1tndNaXFPoTurAHSRbZ',
        '8Eff8g/raj8Vq7mmEo/tvix+H9W9xwCm+nQ0/AmwD38CQQD5E2jR4M5WmG9StcG4',
        'Au1FwQISETFXxXu1M83Xr+Dz6oi0LOXMx/BAtzTJ9kTpK/cy3JY02LAtDo1Oig7B',
        'zbF1AkB1InBK9Xqcr6CSAyd7GQ9EiOttzJ0eJRhgZ17NtN5o8mKT0tvfqZIau5Sx',
        'Dbw7scjk3dkyic1PKLIRiym8EfxjAkBSw6lT/EB0M+jh8fVyAL75K75VZJMh2ERY',
        'HOOsZQv54RgVzsl5d4KU7ovDBGs3k91rcDMVUl+QSUKZM3Td30y1AkEAhipHky7f',
        'eFiWBWmhVIimULus2E5ofocUUpmuiRVYt6mBCNKuLFkw0gwS+YOeHXBee7+6wRes',
        'MXgvsg3X0oaowA==',
        '-----END PRIVATE KEY-----',
        ''
      ].join('\n');

      const certificate = [
        '-----BEGIN CERTIFICATE-----',
        'MIIBnjCCAQegAwIBAgIJAKtOPw6rAgdiMA0GCSqGSIb3DQEBCwUAMBExDzANBgNV',
        'BAMMBldlYlJUQzAeFw0xNzAzMTIyMTQxMTNaFw0xNzA0MTIyMTQxMTNaMBExDzAN',
        'BgNVBAMMBldlYlJUQzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA9yFJO1cw',
        'ZjIhH8zyp8etfgxfs2jPtfcO9cnwmXQR/klvtSNyXzC1QG8c5LOWKs1Rb655lR7J',
        'IGL3e3uClW7f5NPKd7mgdDjqPi+lYGctxx9m9SRs7tlPfBY3dxSMKQ62wtkDCslw',
        'wiJDONMRxgNPJnMLquFSpMWcXI1GgE/g5AsCAwEAATANBgkqhkiG9w0BAQsFAAOB',
        'gQDfIHsQ5Bv7KmNVjJ5OQBID/Szuhvlookw7YJn3IxTjpaQbaEyyMsUJc3d7IHKL',
        'zpm9z7qhvaYS5NSQx4zEER3cvQ8pNRGh/dWkR3tVSjGXnx1q/0Fb7OITnl2P9q0q',
        'yzCNE4CfTda7NjR70xp3wBHeaos9Uj4Dad5soYRbtnSrKQ==',
        '-----END CERTIFICATE-----',
        ''
      ].join('\n');

      const fingerprints = [
        {
          algorithm: 'sha-256',
          value: '5D:DC:92:D8:18:73:99:CB:46:B3:73:D3:5A:7E:5A:42:BF:41:3D:' +
          'D8:B4:DC:13:B0:81:41:3A:41:BE:F7:FC:EB'
        }
      ];

      const expires = 1492033273000;

      certificateFromPEM = RTCCertificate.fromPEM({
        privateKey: privateKey,
        certificate: certificate
      });

      it('should return a RTCCertificate', () => {
        assert.instanceOf(certificateFromPEM, RTCCertificate);
      });

      it('should have the same \'fingerprints\' value as provided', () => {
        assert.deepEqual(fingerprints, certificateFromPEM.fingerprints);
      });

      it('should have the same \'expires\' value as provided', () => {
        assert.equal(expires, certificateFromPEM.expires);
      });

      describe('\'toPEM\' method', () => {
        describe('called with no argument', () => {
          let PEMFromCertificate = certificateFromPEM.toPEM();

          it('should return an Object with \'privateKey\' ' +
            'and \'certificate\' properties', () => {
            assert.property(PEMFromCertificate, 'privateKey');
            assert.property(PEMFromCertificate, 'certificate');
          });

          it('should have the same \'privateKey\' value as provided', () => {
            assert.equal(privateKey, PEMFromCertificate.privateKey);
          });

          it('should have the same \'certificate\' value as provided', () => {
            assert.equal(certificate, PEMFromCertificate.certificate);
          });
        });
      });
    });
  });
});
