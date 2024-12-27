// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState(null); // State to keep track of the role
  const navigate = useNavigate(); // React Router navigation hook

  // Function to handle button click
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole); // Update the role
    if (selectedRole === 'Doctor') {
      navigate('/doctor'); // Navigate to Doctor.js
    } else if (selectedRole === 'Patient') {
      navigate('/patient'); // Navigate to Patient.js
    }
  };

  return (
    <div className="login-container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Choose your role</h1>

      {/* Show role selection buttons */}
      {!role ? (
        <div>
          <button
            onClick={() => handleRoleSelection('Doctor')}
            style={buttonStyle}
          >
            Doctor
          </button>
          <button
            onClick={() => handleRoleSelection('Patient')}
            style={buttonStyle}
          >
            Patient
          </button>
        </div>
      ) : (
        <div>
          <h2>You are logged in as: {role}</h2>
          {/* Additional content for selected role */}
        </div>
      )}
    </div>
  );
};

// Style for the buttons
const buttonStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  margin: '10px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

export default Login;
