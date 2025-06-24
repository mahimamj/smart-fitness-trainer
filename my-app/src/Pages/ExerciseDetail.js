import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExerciseDetail.css';

// Exercise data
const exercisesList = [
  {
    id: 1,
    name: 'Lunges',
    category: 'Legs',
    image: 'https://images.pexels.com/photos/4775203/pexels-photo-4775203.jpeg',
    description: 'A powerful unilateral leg exercise that builds strength, improves balance, and enhances functional movement patterns.',
    instructions: [
      'Stand with feet hip-width apart',
      'Take a big step forward with one leg',
      'Lower your body until both knees are bent at 90 degrees',
      'Keep your front knee aligned with your ankle',
      'Push back up to starting position and alternate legs'
    ],
    benefits: [
      'Improves balance and stability',
      'Strengthens quadriceps, hamstrings, and glutes',
      'Enhances core strength',
      'Corrects muscle imbalances'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 2,
    name: 'Squats',
    category: 'Legs',
    image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg',
    description: 'The king of all exercises - a compound movement that builds total lower body strength and improves functional fitness.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body as if sitting back into a chair',
      'Keep knees aligned with toes',
      'Push through your heels to return to standing'
    ],
    benefits: [
      'Builds overall lower body strength',
      'Improves mobility and flexibility',
      'Strengthens core muscles',
      'Boosts functional fitness'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 3,
    name: 'Push-Ups',
    category: 'Upper Body',
    image: 'https://images.pexels.com/photos/176782/pexels-photo-176782.jpeg',
    description: 'The ultimate bodyweight exercise for building upper body strength, chest definition, and core stability.',
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Keep your body in a straight line from head to heels',
      'Lower your chest to the ground by bending your elbows',
      'Push back up to the starting position',
      'Keep your core tight throughout the movement'
    ],
    benefits: [
      'Strengthens chest, shoulders, and triceps',
      'Improves core stability',
      'Enhances upper body endurance',
      'No equipment needed'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    name: 'Side Plank',
    category: 'Core',
    image: 'https://images.pexels.com/photos/3756521/pexels-photo-3756521.jpeg',
    description: 'A challenging isometric hold that builds core strength, improves stability, and targets your obliques for a strong, defined core.',
    instructions: [
      'Lie on your side with legs extended',
      'Prop yourself up on your forearm with elbow under shoulder',
      'Raise your hips off the ground creating a straight line',
      'Hold this position while keeping your core engaged',
      'Repeat on the other side'
    ],
    benefits: [
      'Strengthens obliques and core muscles',
      'Improves lateral stability',
      'Enhances posture',
      'Helps prevent lower back pain'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 5,
    name: 'Side Lateral Raises',
    category: 'Shoulders',
    image: 'https://media.istockphoto.com/id/815224148/photo/training-workout-men.jpg?s=2048x2048&w=is&k=20&c=ql_0YSFddTnq9A4MY8X5rWQADP20GagAhfp7JJaYZZM=',
    description: 'An essential shoulder exercise that builds width, strength, and definition in your deltoids for well-rounded shoulder development.',
    instructions: [
      'Stand with feet shoulder-width apart, holding dumbbells at sides',
      'Keep a slight bend in your elbows',
      'Raise arms out to sides until parallel with ground',
      'Pause briefly at the top',
      'Lower weights back down with control'
    ],
    benefits: [
      'Builds shoulder width and strength',
      'Improves shoulder stability',
      'Enhances upper body aesthetics',
      'Better shoulder mobility'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 6,
    name: 'Sit-Ups',
    category: 'Core',
    image: 'https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg',
    description: 'A fundamental core exercise that targets your entire abdominal region, helping build strength and definition in your midsection.',
    instructions: [
      'Lie on your back with knees bent and feet flat',
      'Place hands behind your head, elbows pointing out',
      'Engage your core and lift your upper body off the ground',
      'Lift until your chest meets your knees',
      'Lower back down with control'
    ],
    benefits: [
      'Strengthens abdominal muscles',
      'Improves core stability',
      'Enhances posture',
      'Helps develop six-pack muscles'
    ],
    difficulty: 'Beginner'
  }
];

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    // Find the exercise with the matching ID
    const selectedExercise = exercisesList.find(ex => ex.id === parseInt(id));
    
    if (selectedExercise) {
      setExercise(selectedExercise);
    } else {
      // Handle case where exercise is not found
      navigate('/exercises');
    }
  }, [id, navigate]);

  const handleTryExercise = () => {
    setShowWelcomeMessage(true);
    // Navigate to exercise detection page after showing welcome message
    setTimeout(() => {
      setShowWelcomeMessage(false);
      navigate('/exercise-detection', { state: { exercise } });
    }, 1500);
  };

  if (!exercise) {
    return <div className="loading">Loading exercise details...</div>;
  }

  return (
    <div className="exercise-detail-container">
      {showWelcomeMessage && (
        <div className="welcome-message">
          Welcome to try this exercise!
        </div>
      )}
      
      <button className="back-button" onClick={() => navigate('/exercises')}>
        ← Back to Exercises
      </button>
      
      <div className="exercise-detail-header">
        <h1>{exercise.name}</h1>
        <span className="exercise-detail-category">{exercise.category}</span>
        <span className="exercise-detail-difficulty">{exercise.difficulty}</span>
      </div>
      
      <div className="exercise-detail-content">
        <div className="exercise-detail-image-container">
          <img 
            src={exercise.image} 
            alt={exercise.name} 
            className="exercise-detail-image" 
          />
          <button className="try-button" onClick={handleTryExercise}>
            Try This Exercise
          </button>
        </div>
        
        <div className="exercise-detail-info">
          <div className="exercise-description-block">
            <h2>Description</h2>
            <p>{exercise.description}</p>
          </div>
          
          <div className="exercise-instructions-block">
            <h2>Instructions</h2>
            <ol>
              {exercise.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          
          <div className="exercise-benefits-block">
            <h2>Benefits</h2>
            <ul>
              {exercise.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail; 