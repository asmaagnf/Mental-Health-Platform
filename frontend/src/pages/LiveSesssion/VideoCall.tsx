import React, { useEffect, useRef,useState } from 'react';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';

interface VideoCallProps {
  roomName: string;
  displayName: string;
  onLeave: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomName, displayName, onLeave }) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!roomName || !jitsiContainerRef.current) return;

    // Load Jitsi script dynamically
    const loadJitsiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.body.appendChild(script);
    };

    const initializeJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        console.error('Jitsi Meet API not loaded');
        return;
      }

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName.split('/').pop() || 'default-room',
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: isMuted,
          startWithVideoMuted: isVideoOff,
          disableSimulcast: false,
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#f3f4f6',
        },
        userInfo: {
          displayName: displayName,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.executeCommand('subject', 'Therapy Session');

      // Event handlers
      api.on('readyToClose', () => {
        onLeave();
      });
    };

    if (!window.JitsiMeetExternalAPI) {
      loadJitsiScript();
    } else {
      initializeJitsi();
    }

    return () => {
      // Cleanup
      const jitsiScript = document.querySelector('script[src="https://meet.jit.si/external_api.js"]');
      if (jitsiScript) {
        document.body.removeChild(jitsiScript);
      }
    };
  }, [roomName, displayName, onLeave, isMuted, isVideoOff]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
      <div ref={jitsiContainerRef} className="w-full h-full" />
      
      {/* Custom controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}
        >
          {isVideoOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
        </button>
        
        <button
          onClick={onLeave}
          className="p-3 rounded-full bg-red-600 text-white"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;