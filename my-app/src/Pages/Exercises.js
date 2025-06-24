import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Exercises.css';

const exercisesList = [
  {
    id: 1,
    name: 'Lunges',
    category: 'Legs',
    image: 'https://images.pexels.com/photos/4775203/pexels-photo-4775203.jpeg',
    description: 'A powerful unilateral leg exercise that builds strength, improves balance, and enhances functional movement patterns.'
  },
  {
    id: 2,
    name: 'Squats',
    category: 'Legs',
    image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg',
    description: 'The king of all exercises - a compound movement that builds total lower body strength and improves functional fitness.'
  },
  {
    id: 3,
    name: 'Push-Ups',
    category: 'Upper Body',
    image: 'https://images.pexels.com/photos/176782/pexels-photo-176782.jpeg',
    description: 'The ultimate bodyweight exercise for building upper body strength, chest definition, and core stability.'
  },
  {
    id: 4,
    name: 'Side Plank',
    category: 'Core',
    image: 'https://images.pexels.com/photos/3756521/pexels-photo-3756521.jpeg',
    description: 'A challenging isometric hold that builds core strength, improves stability, and targets your obliques for a strong, defined core.'
  },
  {
    id: 5,
    name: 'Side Lateral Raises',
    category: 'Shoulders',
    image: 'https://media.istockphoto.com/id/815224148/photo/training-workout-men.jpg?s=2048x2048&w=is&k=20&c=ql_0YSFddTnq9A4MY8X5rWQADP20GagAhfp7JJaYZZM=',
    description: 'An essential shoulder exercise that builds width, strength, and definition in your deltoids for well-rounded shoulder development.'
  },
  {
    id: 6,
    name: 'Sit-Ups',
    category: 'Core',
    image: 'https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg',
    description: 'A fundamental core exercise that targets your entire abdominal region, helping build strength and definition in your midsection.'
  }
];

const Exercises = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  const filteredExercises = selectedCategory === 'all' 
    ? exercisesList 
    : exercisesList.filter(exercise => exercise.category === selectedCategory);

  const categories = ['all', ...new Set(exercisesList.map(exercise => exercise.category))];

  return (
    <div className="exercises-container">
      <header className="exercises-header">
        <h1 className="exercises-title">Gym Exercises</h1>
        <p className="exercises-intro">
          Choose an exercise from our collection to get started on your fitness journey
        </p>
      </header>
      
      <div className="filter-container">
        <select 
          className="filter-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="exercises-grid">
        {filteredExercises.map((exercise) => (
          <article 
            key={exercise.id} 
            className="exercise-card"
            onClick={() => handleExerciseClick(exercise.id)}
            aria-label={`${exercise.name} exercise`}
          >
            <div className="exercise-image-container">
              <img 
                src={exercise.image} 
                alt={`Person performing ${exercise.name}`} 
                className="exercise-image" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Exercise+Image';
                  e.target.alt = 'Placeholder exercise image';
                }}
              />
            </div>
            <div className="exercise-info">
              <h2 className="exercise-name">{exercise.name}</h2>
              <span className="exercise-category">{exercise.category}</span>
              <p className="exercise-description">{exercise.description}</p>
              <button className="exercise-button">View Details</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Exercises;