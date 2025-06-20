// // src/components/InterviewQuestion.js
// import React, { useState, useEffect } from 'react';
// import { getInterviewQuestion } from '../../services/api';  // Fetch question from backend

// const InterviewQuestion = ({ previousAnswer }) => {
//   const [question, setQuestion] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [listening, setListening] = useState(false);
//   const [speechResult, setSpeechResult] = useState('');

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const recognition = SpeechRecognition ? new SpeechRecognition() : null;

//   useEffect(() => {
//     const fetchQuestion = async (answerToSend) => {
//       setLoading(true);
//       try {
//         const newQuestion = await getInterviewQuestion(answerToSend);
//         setQuestion(newQuestion);
//       } catch (error) {
//         console.error("Error fetching the question:", error);
//         setQuestion('Error fetching question');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (previousAnswer) {
//       fetchQuestion(previousAnswer);
//     }
//   }, [previousAnswer]);

//   useEffect(() => {
//     if (!recognition) {
//       console.warn('SpeechRecognition API not supported in this browser.');
//       return;
//     }

//     recognition.continuous = false; // only one answer at a time
//     recognition.interimResults = false; // final result only
//     recognition.lang = 'en-US';

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setSpeechResult(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setListening(false);
//     };

//     recognition.onend = () => {
//       setListening(false);
//     };
//   }, [recognition]);

//   const startListening = () => {
//     if (recognition) {
//       setListening(true);
//       recognition.start();
//     }
//   };

//   const sendSpeechAsAnswer = async () => {
//     if (speechResult.trim()) {
//       try {
//         setLoading(true);
//         const newQuestion = await getInterviewQuestion(speechResult);
//         setQuestion(newQuestion);
//         setSpeechResult('');
//       } catch (error) {
//         console.error("Error fetching the question with speech result:", error);
//         setQuestion('Error fetching question');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md text-center">
//       <h2 className="text-lg font-semibold">Current Question:</h2>
//       <p className="mt-2 text-lg font-medium text-gray-700 leading-relaxed">
//         {loading ? 'Loading question...' : question || 'Waiting for answer...'}
//       </p>

//       <div className="mt-6 flex flex-col gap-3">
//         <button
//           onClick={startListening}
//           disabled={listening}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           {listening ? 'Listening...' : 'Start Speaking Answer'}
//         </button>

//         {speechResult && (
//           <div className="mt-2">
//             <p className="text-sm text-gray-600">You said: <strong>{speechResult}</strong></p>
//             <button
//               onClick={sendSpeechAsAnswer}
//               className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
//             >
//               Submit Answer
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InterviewQuestion;
import React, { useState, useEffect, useRef } from 'react';
import { getInterviewQuestion } from '../../services/api';

const InterviewQuestion = ({ previousAnswer }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [speechResult, setSpeechResult] = useState('');
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [listening, setListening] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchQuestion = async (answerToSend) => {
      setLoading(true);
      try {
        const newQuestion = await getInterviewQuestion(answerToSend);
        setQuestion(newQuestion);
      } catch (error) {
        console.error("Error fetching the question:", error);
        setQuestion('Error fetching question');
      } finally {
        setLoading(false);
      }
    };

    if (previousAnswer) {
      fetchQuestion(previousAnswer);
    }
  }, [previousAnswer]);

  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
      };

      mediaRecorder.start();
      setIsInterviewStarted(true);
    } catch (err) {
      console.error('Error accessing webcam/mic:', err);
    }
  };

  const stopInterview = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }

    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsInterviewStarted(false);
    setListening(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    setListening(true);
    recognition.start();
  };

  const sendSpeechAsAnswer = async () => {
    if (speechResult.trim()) {
      try {
        setLoading(true);
        const newQuestion = await getInterviewQuestion(speechResult);
        setQuestion(newQuestion);
        setSpeechResult('');
      } catch (error) {
        console.error("Error fetching the question with speech result:", error);
        setQuestion('Error fetching question');
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'interview-video.webm';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md text-center w-[70%]">
      <h2 className="text-lg font-semibold">Current Question:</h2>
      <p className="mt-2 text-lg font-medium text-gray-700 leading-relaxed">
        {loading ? 'Loading question...' : question || 'Waiting for answer...'}
      </p>

      <div className="mt-4 flex justify-center  ">
        <video ref={videoRef} className="w-[40rem] h-[20rem] rounded-md shadow-md" autoPlay muted />
      </div>

      <div className="mt-6 flex flex-col gap-3 items-center ]">
        {!isInterviewStarted ? (
          <button
            onClick={startInterview}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Start Interview
          </button>
        ) : (
          <>
            <button
              onClick={startListening}
              disabled={listening}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              {listening ? 'Listening...' : 'Start Speaking Answer'}
            </button>

            {speechResult && (
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">You said: <strong>{speechResult}</strong></p>
                <button
                  onClick={sendSpeechAsAnswer}
                  className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Submit Answer
                </button>
              </div>
            )}

            <button
              onClick={stopInterview}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Stop Interview
            </button>
          </>
        )}

        {recordedBlob && (
          <button
            onClick={downloadRecording}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Download Interview Video
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestion;
