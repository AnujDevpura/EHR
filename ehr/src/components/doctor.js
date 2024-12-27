import React, { useState, useEffect } from 'react';
import Web3 from 'web3';  // Import Web3
import { Abi } from '../abi/DecentralizedEHRAbi'; // Import your contract's ABI

const DoctorDashboard = () => {
  const contractAddress = "0xceDE3455718E1ac3152dFf01f92c5384B3d1f391"; // Replace with your actual contract address
  
  const [patients, setPatients] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientsWithAccess, setPatientsWithAccess] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reason, setReason] = useState('');
  const [contract, setContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState('');

  useEffect(() => {
    // Initialize Web3 and contract instance
    const initWeb3 = async () => {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setDoctorAddress(accounts[0]);

      const contractInstance = new web3Instance.eth.Contract(Abi, contractAddress);
      setContract(contractInstance);
    };

    initWeb3();
  }, []);

  useEffect(() => {
    if (contract && doctorAddress) {
      fetchPatients();
      fetchAccessRequests();
      fetchPatientsWithAccess();
    }
  }, [contract, doctorAddress]);

  const fetchPatients = async () => {
    const patientsList = await contract.methods.getAllPatients().call({ from: doctorAddress });
    setPatients(patientsList);
  };

  const fetchAccessRequests = async () => {
    const requests = [];
    for (let i = 0; i < patients.length; i++) {
      const patientAddress = patients[i];
      const patientRequests = await contract.methods.accessRequests(patientAddress).call();
      requests.push(...patientRequests);
    }
    setAccessRequests(requests);
  };

  const fetchRecords = async (patientAddress) => {
    const records = await contract.methods.getRecords(patientAddress).call({ from: doctorAddress });
    setPatientRecords(records);
  };

  const fetchPatientsWithAccess = async () => {
    const grantedPatients = await contract.methods.providers(doctorAddress).call({ from: doctorAddress });
    setPatientsWithAccess(grantedPatients);
  };

  const requestAccess = async (patientAddress, reason) => {
    await contract.methods.requestAccess(patientAddress, reason).send({ from: doctorAddress });
    alert("Access request sent!");
    fetchAccessRequests(); // Refresh access requests
  };

  const revokeAccess = async (patientAddress) => {
    await contract.methods.revokeAccess(patientAddress).send({ from: doctorAddress });
    alert("Access revoked!");
    fetchPatientsWithAccess(); // Refresh patients with access
  };

  return (
    <div className="dashboard">
      <h1>Doctor Dashboard</h1>

      {/* Section for Viewing All Patients */}
      <div>
        <h2>Patients</h2>
        <ul>
          {patients.map(patient => (
            <li key={patient} onClick={() => fetchRecords(patient)}>
              {patient}
            </li>
          ))}
        </ul>
      </div>

      {/* Section for Access Requests */}
      <div>
        <h2>Access Requests</h2>
        <ul>
          {accessRequests.map((request, index) => (
            <li key={index}>
              <p>Requester: {request.requester}</p>
              <p>Reason: {request.reason}</p>
              <p>Timestamp: {new Date(request.timestamp * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Section for Requesting Access */}
      <div>
        <h2>Request Access to Patient Records</h2>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient} value={patient}>
              {patient}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for access"
        />
        <button onClick={() => requestAccess(selectedPatient, reason)}>Request Access</button>
      </div>

      {/* Section for Viewing Patient Records */}
      <div>
        <h2>Patient Records</h2>
        <ul>
          {patientRecords.map((record, index) => (
            <li key={index}>
              <p>Record Type: {record.recordType}</p>
              <p>IPFS CID: {record.cid}</p>
              <p>Timestamp: {new Date(record.timestamp * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Section for Managing Granted Access */}
      <div>
        <h2>Manage Access</h2>
        <ul>
          {patientsWithAccess.map((patient, index) => (
            <li key={index}>
              {patient}
              <button onClick={() => revokeAccess(patient)}>Revoke Access</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;
