import React, { useEffect, useRef } from 'react';

function VideoStream({ currentQuestion }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function getVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam or microphone: ', err);
      }
    }

    getVideo();
  }, []);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6 p-4">
      
      {/* Question Box */}
      
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg shadow-md"
      />

      {/* Start Speaking Button */}
    
    </div>
  );
}

export default VideoStream;
