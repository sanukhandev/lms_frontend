"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

type JitsiMeetProps = {
  roomName: string;
  displayName: string;
};

export default function JitsiMeet({ roomName, displayName }: JitsiMeetProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the external script
    const loadJitsiScript = () => {
      let script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.body.appendChild(script);
    };

    const initializeJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        console.error('Jitsi Meet API script not loaded');
        return;
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: roomName,
        width: "100%",
        height: 700,
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          DEFAULT_REMOTE_DISPLAY_NAME: 'Guest',
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: true,
          BRAND_WATERMARK_LINK: 'https://your-lms.com', // <-- your site link
          BRAND_WATERMARK: 'https://your-lms.com/logo.png', // <-- your logo image
        },
        userInfo: {
          displayName: displayName,
        },
      };

      // @ts-ignore
      new window.JitsiMeetExternalAPI(domain, options);
    };

    if (window.JitsiMeetExternalAPI) {
      initializeJitsi();
    } else {
      loadJitsiScript();
    }
  }, [roomName, displayName]);

  return (
    <div
      ref={jitsiContainerRef}
      style={{ height: '700px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}
    />
  );
}
