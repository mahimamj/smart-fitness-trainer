import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import {
  detectSquat,
  detectPushUp,
  detectLunge,
  detectSidePlank,
  detectLateralRaise,
  detectSitUp
} from '../utils/exerciseUtils';
import { drawLandmarks, drawAngles } from '../utils/drawingUtils';
import './ExerciseDetection.css';
import Webcam from "react-webcam";

const ExerciseDetection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [feedback, setFeedback] = useState('');
  const [repCount, setRepCount] = useState(0);
  const [angles, setAngles] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true); // Start detection automatically
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    if (location.state?.exercise) {
      setExercise(location.state.exercise);
    } else {
      // If no exercise data, redirect back to exercises
      navigate('/exercises');
    }
  }, [location, navigate]);

  const speakFeedback = (message) => {
    const utterance = new window.SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isDetecting || !exercise) return;

    let camera = null;
    const poseDetection = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseDetection.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const onResults = (results) => {
      const canvasCtx = canvasRef.current.getContext('2d');
      const landmarks = results.poseLandmarks;

      if (canvasRef.current && webcamRef.current && webcamRef.current.video) {
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, videoWidth, videoHeight);

        // Draw mirrored video feed
        canvasCtx.save();
        canvasCtx.scale(-1, 1);
        canvasCtx.translate(-videoWidth, 0);
        canvasCtx.drawImage(results.image, 0, 0, videoWidth, videoHeight);
        canvasCtx.restore();

        if (landmarks) {
          // Manually mirror landmarks for drawing on a non-flipped canvas
          const mirroredLandmarks = landmarks.map(landmark => ({
            ...landmark,
            x: 1 - landmark.x,
          }));

          drawLandmarks(canvasCtx, mirroredLandmarks);

          let formCheck;

          // Perform detection on original non-mirrored landmarks
          switch (exercise.name) {
            case 'Squats':
              formCheck = detectSquat(landmarks);
              break;
            case 'Push-Ups':
              formCheck = detectPushUp(landmarks);
              break;
            case 'Lunges':
              formCheck = detectLunge(landmarks);
              break;
            case 'Side Plank':
              formCheck = detectSidePlank(landmarks);
              break;
            case 'Side Lateral Raises':
              formCheck = detectLateralRaise(landmarks);
              break;
            case 'Sit-Ups':
              formCheck = detectSitUp(landmarks);
              break;
            default:
              formCheck = { label: '', feedback: '', count: 0, isCorrect: false };
          }

          if (formCheck) {
            setFeedback(formCheck.feedback || '');
            setRepCount(formCheck.count || 0);
            setAngles(formCheck.angles || null);
            if (formCheck.feedback) speakFeedback(formCheck.feedback);
            
            // Draw angles using mirrored landmarks
            if (formCheck.angles) {
              drawAngles(canvasCtx, mirroredLandmarks, formCheck.angles);
            }
          }
        }

        canvasCtx.restore();
      }
    };

    poseDetection.onResults(onResults);

    // Wait for the video to be ready
    const interval = setInterval(() => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        camera = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            await poseDetection.send({ image: webcamRef.current.video });
          },
          width: 1280,
          height: 720,
        });
        camera.start();
        clearInterval(interval);
      }
    }, 500);

    return () => {
      if (camera) camera.stop();
      clearInterval(interval);
      window.speechSynthesis.cancel(); // 🛑 Cancel voice on stop
    };
  }, [isDetecting, exercise]);

  const containerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "1280px",
    height: "720px",
    margin: "0 auto"
  };

  if (!exercise) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="exercise-detection">
      <div className="exercise-header">
        <h2>{exercise.name}</h2>
        <button className="back-button" onClick={() => navigate('/exercises')}>
          ← Back to Exercises
        </button>
      </div>
      
      <div style={containerStyle}>
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
          videoConstraints={{ 
            width: 1280,
            height: 720,
            facingMode: "user"
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "white",
          padding: 8,
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 10
        }}>
          <p style={{ margin: 0 }}>Feedback: {feedback}</p>
          <p style={{ margin: 0 }}>Reps: {repCount}</p>
        </div>
        {/* Display Angles */}
        {angles && (
          <div style={{
            position: "absolute",
            bottom: 80, // Positioned above the feedback box
            left: 16,
            background: "rgba(255, 255, 255, 0.8)",
            padding: 8,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 10
          }}>
            <h4 style={{ margin: '0 0 5px 0' }}>Angles:</h4>
            {Object.entries(angles).map(([joint, angle]) => (
              <p key={joint} style={{ margin: 0, textTransform: 'capitalize' }}>
                {joint}: {angle}°
              </p>
            ))}
          </div>
        )}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
          {!isDetecting ? (
            <button onClick={() => setIsDetecting(true)} className="control-button start">Start Detection</button>
          ) : (
            <button onClick={() => setIsDetecting(false)} className="control-button stop">Stop Detection</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetection;