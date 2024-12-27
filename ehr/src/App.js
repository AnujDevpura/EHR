// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MetaMaskConnect from './components/metamask'; // Import MetaMaskConnect component
import Login from './components/login'; // Import Login component
import DoctorDashboard from './components/doctor'; // Import Doctor component
// import Patient from './components/patient'; // Import Patient component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaMaskConnect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        {/* <Route path="/patient" element={<Patient />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
