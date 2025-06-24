import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, Navigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    // Only show welcome notification when user is authenticated and component mounts
    if (isAuthenticated && user) {
      const welcomeNotification = document.createElement('div');
      welcomeNotification.className = 'welcome-notification';
      welcomeNotification.textContent = `Welcome back, ${user.name}!`;
      document.body.appendChild(welcomeNotification);

      // Remove notification after 3 seconds
      setTimeout(() => {
        welcomeNotification.classList.add('fade-out');
        setTimeout(() => {
          if (document.body.contains(welcomeNotification)) {
            document.body.removeChild(welcomeNotification);
          }
        }, 500);
      }, 3000);
    }
  }, [isAuthenticated, user]);

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          {user.picture && (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="user-avatar"
            />
          )}
          <div className="user-details">
            <h1 className="welcome-text">Welcome, {user.name}! 👋</h1>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        <button 
          className="logout-button"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Log Out
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Fitness Journey</h2>
          <p>Track your progress and achieve your fitness goals</p>
          <Link to="/exercises" className="dashboard-link">Browse Exercises</Link>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Workouts</h3>
            <p className="stat-number">12</p>
            <p className="stat-label">This month</p>
          </div>
          <div className="stat-card">
            <h3>Calories</h3>
            <p className="stat-number">5,240</p>
            <p className="stat-label">Burned</p>
          </div>
          <div className="stat-card">
            <h3>Minutes</h3>
            <p className="stat-number">320</p>
            <p className="stat-label">Active time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
