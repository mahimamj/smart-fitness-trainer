import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Your CSS file for styling

const Home = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  // Function to handle login with proper redirect
  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    });
  };

  // Redirect already authenticated users to dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Show loading state while Auth0 is initializing
  if (isLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <h1>Welcome to FitZone Gym</h1>
      
      {isAuthenticated ? (
        <div className="authenticated-container">
          <p className="welcome-back">Welcome back, {user.name}!</p>
          <img 
            src="https://source.unsplash.com/random/400x300/?fitness" 
            alt="Fitness" 
            className="home-image"
          />
          <div className="home-buttons">
            <button className="dashboard-button" onClick={goToDashboard}>
              Go to Dashboard
            </button>
            <Link to="/exercises" className="exercises-button">
              View Exercises
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p>Your fitness journey starts here</p>
          <img 
            src="https://source.unsplash.com/random/400x300/?gym" 
            alt="Gym" 
            className="home-image"
          />
          <div className="home-buttons">
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <Link to="/exercises" className="exercises-button">
              View Exercises
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
