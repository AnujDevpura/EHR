// MetaMaskConnect.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const MetaMaskConnect = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle MetaMask connection
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Requesting accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        // Set the connected account
        setAccount(accounts[0]);

        // Create a provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log('Connected with signer:', signer);

        // You can also get the current network
        const network = await provider.getNetwork();
        console.log('Network:', network);

        // Navigate to the login page after successful connection
        navigate('/login');
      } catch (err) {
        setError(err.message);
        console.error('Error connecting to MetaMask:', err);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  return (
    <div>
      <h1>MetaMask Connection</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
        </div>
      ) : (
        <div>
          <button onClick={connectMetaMask}>Connect MetaMask</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default MetaMaskConnect;
