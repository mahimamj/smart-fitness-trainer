import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  // If authentication is loading, show a spinner
  if (isLoading) {
    return <Spinner />;
  }

  // Handle authentication errors
  if (error) {
    console.error("Authentication error:", error);
    return (
      <div className="auth-error">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // If user is not authenticated, redirect to the home page
  // The home page has the login button which will trigger Auth0 login
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
