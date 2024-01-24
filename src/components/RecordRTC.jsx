import React, { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";

function RTCPage() {
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [timer, setTimer] = useState(0);

  const recordRTCRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (recordedVideo !== null) {
      recordRTCRef.current.src = recordedVideo;
    }
  }, [recordedVideo]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const options = {
          mimeType: "video/x-matroska;codecs=avc1",
          video: {
            width: 1080,
            height: 1920,
          },
          audio: true,
        };
        const recordRTC = RecordRTC(stream, options);
        recordRTCRef.current = recordRTC;
        recordRTC.startRecording(() => {
          const recordedBlob = recordRTCRef.current.getBlob();
          const recordedVideoUrl = URL.createObjectURL(recordedBlob);
          setRecordedVideo(recordedVideoUrl);
        });
        setRecording(true);
        setTimer(0);
        timerIntervalRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
      })
      .catch((error) => console.error(error));
  };

  const stopRecording = () => {
    clearInterval(timerIntervalRef.current);
    recordRTCRef.current.stopRecording(() => {
      const recordedBlob = recordRTCRef.current.getBlob();
      const recordedVideoUrl = URL.createObjectURL(recordedBlob);
      setRecordedVideo(recordedVideoUrl);
      setRecording(false);
    });
  };

  const continueRecording = () => {
    recordRTCRef.current.resumeRecording();
    setRecording(true);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const resetRecording = () => {
    if (recordRTCRef.current) {
      recordRTCRef.current.reset();
      setRecordedVideo(null);
      setRecording(false);
      setTimer(0);
    }
  };

  return (
    <div>
      <h1>Recording Page</h1>
      {!recording && !recordedVideo && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {recording && (
        <div>
          <p>Recording time: {timer} seconds</p>
          {timer >= 60 ? (
            <div>
              <p>Recording paused due to time limit</p>
              <button onClick={continueRecording}>Continue Recording</button>
            </div>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
        </div>
      )}
      {recordedVideo && (
        <div>
          <button onClick={resetRecording}>Record Again</button>
        </div>
      )}
      <video src={recordedVideo} controls />
    </div>
  );
}

export default RTCPage;
