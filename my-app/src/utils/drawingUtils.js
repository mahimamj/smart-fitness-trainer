// src/utils/drawingUtils.js

// POSE_CONNECTIONS from Mediapipe
const POSE_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,7],
  [0,4],[4,5],[5,6],[6,8],
  [9,10],
  [11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],
  [11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[27,29],[29,31],[26,28],[28,30],[30,32],
  [27,31],[28,32]
];

export const drawLandmarks = (ctx, landmarks) => {
  // Draw connections
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  POSE_CONNECTIONS.forEach(([start, end]) => {
    if (landmarks[start] && landmarks[end]) {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * ctx.canvas.width, landmarks[start].y * ctx.canvas.height);
      ctx.lineTo(landmarks[end].x * ctx.canvas.width, landmarks[end].y * ctx.canvas.height);
      ctx.stroke();
    }
  });
  // Draw points
  ctx.fillStyle = 'red';
  landmarks.forEach(landmark => {
    const x = landmark.x * ctx.canvas.width;
    const y = landmark.y * ctx.canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
};

// New function to draw angles
export const drawAngles = (ctx, landmarks, angles) => {
  if (!angles) return;

  const jointMap = {
    leftKnee: 25,
    rightKnee: 26,
    leftElbow: 13,
    rightElbow: 14,
    leftShoulder: 11,
    rightShoulder: 12,
    bodyAlignment: 23, // Use hip for body alignment
    torso: 23,
    frontKnee: angles.isLeftForward ? 25 : 26,
    backKnee: angles.isLeftForward ? 26 : 25,
  };

  ctx.fillStyle = 'yellow';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';

  Object.entries(angles).forEach(([joint, angle]) => {
    const jointIndex = jointMap[joint];
    if (jointIndex && landmarks[jointIndex]) {
      const landmark = landmarks[jointIndex];
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      ctx.fillText(`${angle}°`, x + 20, y - 20);
    }
  });
};
