{
    'targets': [
        {
            'target_name': 'webrtc',
            'sources': [
                'src/module.cc',
                'src/globals.cc',
                'src/eventqueue.cc',
                'src/rtccertificate.cc',
                'src/rtccreatesessiondescriptionobserver.cc',
                'src/rtcicecandidate.cc',
                'src/rtcpeerconnection.cc',
                'src/rtcpeerconnectionobserver.cc',
                'src/rtcsessiondescription.cc',
            ],
            'include_dirs' : [
                'build/include',
                '<!(node -e "require(\'nan\')")',
            ],
            'library_dirs': [
                '../build/lib',
            ],
            'conditions': [
                ['os_posix==1', {
                    'defines': [
                        'WEBRTC_POSIX',
                        '_GLIBCXX_USE_CXX11_ABI=0',
                    ],
                    'link_settings': {
                        'libraries': [
                            '-lwebrtc',
                        ],
                    },
                }],
                ['OS=="linux"', {
                    'cflags_cc': [
                        '-std=c++11',
                    ],
                    'link_settings': {
                        'libraries': [
                            '<!@(pkg-config --libs sm)',
                            '<!@(pkg-config --libs ice)',
                            '<!@(pkg-config --libs x11)',
                            '<!@(pkg-config --libs xext)',
                            '-ldl',
                        ],
                    },
                }],
                ['OS=="mac"', {
                    'xcode_settings': {
                        'OTHER_CPLUSPLUSFLAGS': [
                            '-std=c++11',
                            '-stdlib=libc++'
                        ],
                        'OTHER_LDFLAGS': [
                            '-stdlib=libc++'
                        ],
                        'MACOSX_DEPLOYMENT_TARGET': '10.7',
                    },
                    'link_settings': {
                        'libraries': [
                            '$(SDKROOT)/System/Library/Frameworks/AudioToolbox.framework',
                            '$(SDKROOT)/System/Library/Frameworks/CoreAudio.framework',
                            '$(SDKROOT)/System/Library/Frameworks/CoreFoundation.framework',
                            '$(SDKROOT)/System/Library/Frameworks/CoreGraphics.framework',
                            '$(SDKROOT)/System/Library/Frameworks/Foundation.framework',
                        ],
                    },
                }],
                ['OS=="win"', {
                    'defines': [
                        'WEBRTC_WIN',
                        'NOMINMAX',
                        '_CRT_SECURE_NO_WARNINGS',
                    ],
                    'link_settings': {
                        'libraries': [
                            '-l../build/lib/webrtc.lib',
                            '-lmsdmo.lib',
                            '-lwmcodecdspuuid.lib',
                            '-ldmoguids.lib',
                            '-lole32.lib',
                            '-lsecur32.lib',
                            '-lwinmm.lib',
                            '-lws2_32.lib',
                        ],
                    },
                }],
            ],
        },
    ],
}
