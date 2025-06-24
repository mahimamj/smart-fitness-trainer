// Helper function to calculate angle between three points
const calculateAngle = (a, b, c) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

// Helper function to check if a point is within a certain range with tolerance
const isWithinRange = (value, target, tolerance) => {
  return value >= (target - tolerance) && value <= (target + tolerance);
};

// Helper function to get the side (left/right) with the worst angle
const getWorstSide = (leftAngle, rightAngle, target) => {
  const leftDiff = Math.abs(leftAngle - target);
  const rightDiff = Math.abs(rightAngle - target);
  return leftDiff > rightDiff ? 'left' : 'right';
};

// Squat detection with enhanced feedback
export const detectSquat = (landmarks) => {
  if (!landmarks) return null;

  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

  let feedback = '';
  let isCorrect = false;
  const targetAngle = 90;
  const tolerance = 15;

  if (isWithinRange(leftKneeAngle, targetAngle, tolerance) && isWithinRange(rightKneeAngle, targetAngle, tolerance)) {
    feedback = 'Perfect squat! Knees at 90° with good symmetry';
    isCorrect = true;
  } else {
    const worstSide = getWorstSide(leftKneeAngle, rightKneeAngle, targetAngle);
    const worstAngle = worstSide === 'left' ? leftKneeAngle : rightKneeAngle;
    
    if (worstAngle < targetAngle - tolerance) {
      feedback = `Your ${worstSide} knee is too bent (${Math.round(worstAngle)}°). Rise slightly to reach 90°`;
    } else if (worstAngle > targetAngle + tolerance) {
      feedback = `Your ${worstSide} knee isn't bent enough (${Math.round(worstAngle)}°). Lower yourself further`;
    }
    
    // Check for asymmetry
    if (Math.abs(leftKneeAngle - rightKneeAngle) > 15) {
      feedback += `. Also, your knees are uneven (L:${Math.round(leftKneeAngle)}° vs R:${Math.round(rightKneeAngle)}°). Focus on equal depth`;
    }
  }

  return {
    label: 'Squat',
    feedback: feedback || 'Adjust your squat depth to reach 90° knee bend',
    isCorrect,
    count: isCorrect ? 1 : 0,
    angles: {
      leftKnee: Math.round(leftKneeAngle),
      rightKnee: Math.round(rightKneeAngle)
    }
  };
};

// Enhanced Push-up detection
export const detectPushUp = (landmarks) => {
  if (!landmarks) return null;

  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];
  const rightShoulder = landmarks[12];
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16];
  const nose = landmarks[0];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const bodyAngle = calculateAngle(nose, leftHip, rightHip); // Check body alignment

  let feedback = '';
  let isCorrect = false;
  const targetAngle = 90;
  const tolerance = 15;

  if (isWithinRange(leftElbowAngle, targetAngle, tolerance) && 
      isWithinRange(rightElbowAngle, targetAngle, tolerance) &&
      isWithinRange(bodyAngle, 180, 10)) {
    feedback = 'Excellent push-up form! Elbows at 90° with straight body';
    isCorrect = true;
  } else {
    // Check elbow angles first
    if (leftElbowAngle > targetAngle + tolerance || rightElbowAngle > targetAngle + tolerance) {
      const worstSide = getWorstSide(leftElbowAngle, rightElbowAngle, targetAngle);
      const worstAngle = worstSide === 'left' ? leftElbowAngle : rightElbowAngle;
      feedback = `Your ${worstSide} arm isn't bent enough (${Math.round(worstAngle)}°). Lower your chest further`;
    } else if (leftElbowAngle < targetAngle - tolerance || rightElbowAngle < targetAngle - tolerance) {
      feedback = 'You\'re too low. Push up slightly to reach 90° elbow bend';
    }

    // Check body alignment
    if (bodyAngle < 170) {
      feedback += feedback ? ' and ' : '';
      feedback += `Your hips are sagging (body angle ${Math.round(bodyAngle)}°). Tighten your core`;
    } else if (bodyAngle > 190) {
      feedback += feedback ? ' and ' : '';
      feedback += `Your hips are too high (body angle ${Math.round(bodyAngle)}°). Lower your hips`;
    }

    // Check asymmetry
    if (Math.abs(leftElbowAngle - rightElbowAngle) > 15) {
      feedback += feedback ? '. Also, ' : '';
      feedback += `your arms are uneven (L:${Math.round(leftElbowAngle)}° vs R:${Math.round(rightElbowAngle)}°)`;
    }
  }

  return {
    label: 'Push-up',
    feedback: feedback || 'Lower your body until elbows reach 90° while keeping body straight',
    isCorrect,
    count: isCorrect ? 1 : 0,
    angles: {
      leftElbow: Math.round(leftElbowAngle),
      rightElbow: Math.round(rightElbowAngle),
      bodyAlignment: Math.round(bodyAngle)
    }
  };
};

// Enhanced Lunge detection
export const detectLunge = (landmarks) => {
  if (!landmarks) return null;

  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];
  const nose = landmarks[0];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const torsoAngle = calculateAngle(nose, leftShoulder, rightShoulder); // Check torso lean

  let feedback = '';
  let isCorrect = false;
  const targetAngle = 90;
  const tolerance = 15;
  
  // Determine which leg is forward (smaller knee angle is the forward leg)
  const isLeftForward = leftKneeAngle < rightKneeAngle;
  const forwardKneeAngle = isLeftForward ? leftKneeAngle : rightKneeAngle;
  const backKneeAngle = isLeftForward ? rightKneeAngle : leftKneeAngle;

  if ((isWithinRange(forwardKneeAngle, targetAngle, tolerance) && 
      (isWithinRange(backKneeAngle, 170, 20) || backKneeAngle < 100) && // Back leg should be straight or slightly bent
      isWithinRange(torsoAngle, 180, 10)) ){
    feedback = `Perfect ${isLeftForward ? 'left' : 'right'} lunge! Front knee at 90° with proper torso alignment`;
    isCorrect = true;
  } else {
    // Front knee feedback
    if (forwardKneeAngle < targetAngle - tolerance) {
      feedback = `Your front knee is too bent (${Math.round(forwardKneeAngle)}°). Move your foot forward slightly`;
    } else if (forwardKneeAngle > targetAngle + tolerance) {
      feedback = `Your front knee isn't bent enough (${Math.round(forwardKneeAngle)}°). Lower your hips further`;
    }

    // Back knee feedback
    if (backKneeAngle < 160) {
      feedback += feedback ? ' and ' : '';
      feedback += `your back leg should be straighter (currently ${Math.round(backKneeAngle)}°)`;
    }

    // Torso feedback
    if (torsoAngle < 170) {
      feedback += feedback ? ' and ' : '';
      feedback += `you're leaning too far forward (${Math.round(torsoAngle)}°)`;
    } else if (torsoAngle > 190) {
      feedback += feedback ? ' and ' : '';
      feedback += `you're leaning too far back (${Math.round(torsoAngle)}°)`;
    }

    // Knee alignment check (front knee shouldn't go past toes)
    const frontKnee = isLeftForward ? leftKnee : rightKnee;
    const frontAnkle = isLeftForward ? leftAnkle : rightAnkle;
    if (frontKnee.x < frontAnkle.x) {
      feedback += feedback ? '. Also, ' : '';
      feedback += 'your front knee is past your toes - keep it aligned with your ankle';
    }
  }

  return {
    label: 'Lunge',
    feedback: feedback || `Perform a lunge with front knee at 90° and back leg straight`,
    isCorrect,
    count: isCorrect ? 1 : 0,
    angles: {
      frontKnee: Math.round(forwardKneeAngle),
      backKnee: Math.round(backKneeAngle),
      torso: Math.round(torsoAngle)
    }
  };
};

// Enhanced Side Plank detection
export const detectSidePlank = (landmarks) => {
  if (!landmarks) return null;

  const leftShoulder = landmarks[11];
  const leftHip = landmarks[23];
  const leftAnkle = landmarks[27];
  const rightShoulder = landmarks[12];
  const rightHip = landmarks[24];
  const rightAnkle = landmarks[28];
  const nose = landmarks[0];

  const leftBodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
  const rightBodyAngle = calculateAngle(rightShoulder, rightHip, rightAnkle);
  const isLeftSide = leftBodyAngle < rightBodyAngle; // Determine which side is being worked
  
  const workingSideAngle = isLeftSide ? leftBodyAngle : rightBodyAngle;
  const hipAngle = isLeftSide 
    ? calculateAngle(leftShoulder, leftHip, rightHip)
    : calculateAngle(rightShoulder, rightHip, leftHip);

  let feedback = '';
  let isCorrect = false;
  const targetAngle = 180;
  const tolerance = 10;

  if (isWithinRange(workingSideAngle, targetAngle, tolerance) && 
      isWithinRange(hipAngle, 180, 15)) {
    feedback = `Perfect ${isLeftSide ? 'left' : 'right'} side plank! Body perfectly straight`;
    isCorrect = true;
  } else {
    if (workingSideAngle < targetAngle - tolerance) {
      feedback = `Your hips are sagging (body angle ${Math.round(workingSideAngle)}°). Lift them higher`;
    } else if (workingSideAngle > targetAngle + tolerance) {
      feedback = `Your hips are too high (body angle ${Math.round(workingSideAngle)}°). Lower them slightly`;
    }

    if (hipAngle < 165) {
      feedback += feedback ? ' and ' : '';
      feedback += `you're leaning too far forward (hip angle ${Math.round(hipAngle)}°)`;
    } else if (hipAngle > 195) {
      feedback += feedback ? ' and ' : '';
      feedback += `you're leaning too far backward (hip angle ${Math.round(hipAngle)}°)`;
    }
  }

  return {
    label: 'Side Plank',
    feedback: feedback || `Straighten your body in a line from head to feet`,
    isCorrect,
    count: isCorrect ? 1 : 0,
    angles: {
      bodyAlignment: Math.round(workingSideAngle),
      hipAlignment: Math.round(hipAngle)
    }
  };
};

// Enhanced Lateral Raise detection
export const detectLateralRaise = (landmarks) => {
  if (!landmarks) return null;

  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];
  const rightShoulder = landmarks[12];
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16];
  const nose = landmarks[0];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const leftElevation = calculateAngle(leftHip, leftShoulder, leftWrist);
  const rightElevation = calculateAngle(rightHip, rightShoulder, rightWrist);
  const torsoAngle = calculateAngle(nose, leftShoulder, rightShoulder);

  let feedback = '';
  let isCorrect = false;
  const targetArmAngle = 90;
  const armTolerance = 15;
  const targetElevation = 80;
  const elevationTolerance = 10;

  if (isWithinRange(leftArmAngle, targetArmAngle, armTolerance) && 
      isWithinRange(rightArmAngle, targetArmAngle, armTolerance) &&
      isWithinRange(leftElevation, targetElevation, elevationTolerance) &&
      isWithinRange(rightElevation, targetElevation, elevationTolerance) &&
      isWithinRange(torsoAngle, 180, 5)) {
    feedback = 'Perfect lateral raise! Arms at 90° and raised to shoulder height';
    isCorrect = true;
  } else {
    // Check arm angles
    if (leftArmAngle < targetArmAngle - armTolerance || rightArmAngle < targetArmAngle - armTolerance) {
      const worstSide = getWorstSide(leftArmAngle, rightArmAngle, targetArmAngle);
      feedback = `Your ${worstSide} arm is too bent (${Math.round(worstSide === 'left' ? leftArmAngle : rightArmAngle)}°). Straighten it more`;
    } else if (leftArmAngle > targetArmAngle + armTolerance || rightArmAngle > targetArmAngle + armTolerance) {
      feedback = 'Your arms are too straight. Maintain a slight bend';
    }

    // Check elevation
    if (leftElevation < targetElevation - elevationTolerance || rightElevation < targetElevation - elevationTolerance) {
      const worstSide = leftElevation < rightElevation ? 'left' : 'right';
      feedback += feedback ? ' and ' : '';
      feedback += `your ${worstSide} arm isn't high enough (${Math.round(worstSide === 'left' ? leftElevation : rightElevation)}°). Raise to shoulder level`;
    } else if (leftElevation > targetElevation + elevationTolerance || rightElevation > targetElevation + elevationTolerance) {
      feedback += feedback ? ' and ' : '';
      feedback += 'you\'re raising your arms too high. Lower to shoulder level';
    }

    // Check torso
    if (torsoAngle < 175) {
      feedback += feedback ? ' and ' : '';
      feedback += 'you\'re leaning forward. Stand straight';
    } else if (torsoAngle > 185) {
      feedback += feedback ? ' and ' : '';
      feedback += 'you\'re leaning backward. Stand straight';
    }

    // Check symmetry
    if (Math.abs(leftElevation - rightElevation) > 15) {
      feedback += feedback ? '. Also, ' : '';
      feedback += `your arms are uneven (L:${Math.round(leftElevation)}° vs R:${Math.round(rightElevation)}°)`;
    }
  }

  return {
    label: 'Lateral Raise',
    feedback: feedback || 'Raise arms to shoulder height with slight bend at elbows',
    isCorrect,
    count: isCorrect ? 1 : 0,
    angles: {
      leftArm: Math.round(leftArmAngle),
      rightArm: Math.round(rightArmAngle),
      leftElevation: Math.round(leftElevation),
      rightElevation: Math.round(rightElevation),
      torso: Math.round(torsoAngle)
    }
  };
};

// Enhanced Sit-up detection
export const detectSitUp = (landmarks) => {
  if (!landmarks) return null;

  const leftShoulder = landmarks[11];
  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const rightShoulder = landmarks[12];
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const nose = landmarks[0];

  const leftBodyAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
  const rightBodyAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const torsoAngle = calculateAngle(nose, leftShoulder, rightShoulder); // Check for twisting
  const hipAngle = calculateAngle(leftShoulder, leftHip, rightHip); // Check hip flexion

  let feedback = '';
  let isCorrect = false;
  const targetUpAngle = 60;
  const targetDownAngle = 150;
  const tolerance = 15;

  // Determine if we're in the up or down phase
  const isUpPhase = (leftBodyAngle + rightBodyAngle) / 2 < 100;
  const targetAngle = isUpPhase ? targetUpAngle : targetDownAngle;

  if ((isWithinRange(leftBodyAngle, targetAngle, tolerance) && 
       isWithinRange(rightBodyAngle, targetAngle, tolerance) &&
       isWithinRange(torsoAngle, 180, 5) &&
       (isUpPhase || isWithinRange(hipAngle, 180, 10)))) {
    feedback = `Good ${isUpPhase ? 'up' : 'down'} position!`;
    isCorrect = true;
  } else {
    // Body angle feedback
    if (isUpPhase) {
      if (leftBodyAngle > targetAngle + tolerance || rightBodyAngle > targetAngle + tolerance) {
        feedback = 'Come up higher until your torso is about 60° from the floor';
      } else if (leftBodyAngle < targetAngle - tolerance || rightBodyAngle < targetAngle - tolerance) {
        feedback = 'You\'re coming up too far. Stop when your torso is about 60° from the floor';
      }
    } else {
      if (leftBodyAngle < targetAngle - tolerance || rightBodyAngle < targetAngle - tolerance) {
        feedback = 'Lower your torso further until it\'s nearly flat on the floor';
      }
    }

    // Twisting feedback
    if (torsoAngle < 175 || torsoAngle > 185) {
      feedback += feedback ? ' and ' : '';
      feedback += 'avoid twisting your torso - keep it straight';
    }

    // Hip feedback in down position
    if (!isUpPhase && hipAngle < 170) {
      feedback += feedback ? ' and ' : '';
      feedback += 'fully extend your hips at the bottom';
    }

    // Asymmetry feedback
    if (Math.abs(leftBodyAngle - rightBodyAngle) > 15) {
      feedback += feedback ? '. Also, ' : '';
      feedback += `your sides are uneven (L:${Math.round(leftBodyAngle)}° vs R:${Math.round(rightBodyAngle)}°)`;
    }
  }

  return {
    label: 'Sit-up',
    feedback: feedback || `${isUpPhase ? 'Sit' : 'Lie'} ${isUpPhase ? 'up' : 'down'} with proper form`,
    isCorrect,
    count: isCorrect ? 1 : 0,
    angles: {
      torso: Math.round((leftBodyAngle + rightBodyAngle) / 2),
      twist: Math.round(torsoAngle),
      hips: Math.round(hipAngle)
    }
  };
};