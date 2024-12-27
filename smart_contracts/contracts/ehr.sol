// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedEHR {

    struct Record {
        string cid; // IPFS/Filecoin CID for decentralized storage
        string recordType; // Type of record (e.g., Lab Report, Prescription)
        uint256 timestamp; // Timestamp of upload
        address uploadedBy; // Address of the uploader (patient or provider)
    }

    struct AccessRequest {
        address requester;
        string reason;
        uint256 timestamp;
    }

    address public owner; // Contract owner (e.g., admin or DAO)

    address[] private patients; // List of all patient addresses
    address[] private doctors; // List of all doctor addresses
    mapping(address => bool) private isRegisteredPatient; // Check if an address is a patient
    mapping(address => bool) private isRegisteredDoctor; // Check if an address is a doctor

    mapping(address => address[]) private providers; // Mapping of patients to their approved providers
    mapping(address => Record[]) private ehrData; // Patient address to their medical records
    mapping(address => AccessRequest[]) public accessRequests; // Track access requests for auditing

    event RecordAdded(address indexed patient, string cid, string recordType, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed provider);
    event AccessRevoked(address indexed patient, address indexed provider);
    event AccessRequested(address indexed requester, address indexed patient, string reason);
    event UserRegistered(address indexed user, string role);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyPatient(address _patient) {
        require(msg.sender == _patient, "Only the patient can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerAsPatient() public {
        require(!isRegisteredPatient[msg.sender], "Already registered as a patient");
        require(!isRegisteredDoctor[msg.sender], "Cannot register as a patient if already a doctor");

        patients.push(msg.sender);
        isRegisteredPatient[msg.sender] = true;

        emit UserRegistered(msg.sender, "Patient");
    }

    function registerAsDoctor() public {
        require(!isRegisteredDoctor[msg.sender], "Already registered as a doctor");
        require(!isRegisteredPatient[msg.sender], "Cannot register as a doctor if already a patient");

        doctors.push(msg.sender);
        isRegisteredDoctor[msg.sender] = true;

        emit UserRegistered(msg.sender, "Doctor");
    }

    function getAllPatients() public view returns (address[] memory) {
        require(isRegisteredDoctor[msg.sender], "Only doctors can view the list of patients");
        return patients;
    }

    function addRecord(string memory _cid, string memory _recordType) public {
        require(isRegisteredPatient[msg.sender], "Only registered patients can add records");

        Record memory newRecord = Record({
            cid: _cid,
            recordType: _recordType,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        });

        ehrData[msg.sender].push(newRecord);
        emit RecordAdded(msg.sender, _cid, _recordType, block.timestamp);
    }

    function requestAccess(address _patient, string memory _reason) public {
        require(isRegisteredDoctor[msg.sender], "Only registered doctors can request access");
        require(isRegisteredPatient[_patient], "The target address is not a registered patient");

        AccessRequest memory newRequest = AccessRequest({
            requester: msg.sender,
            reason: _reason,
            timestamp: block.timestamp
        });

        accessRequests[_patient].push(newRequest);
        emit AccessRequested(msg.sender, _patient, _reason);
    }

    function grantAccess(address _provider) public {
        require(isRegisteredPatient[msg.sender], "Only registered patients can grant access");
        require(isRegisteredDoctor[_provider], "The target address is not a registered doctor");

        providers[msg.sender].push(_provider);
        emit AccessGranted(msg.sender, _provider);
    }

    function revokeAccess(address _provider) public {
        require(isRegisteredPatient[msg.sender], "Only registered patients can revoke access");
        require(isRegisteredDoctor[_provider], "The target address is not a registered doctor");

        address[] storage providerList = providers[msg.sender];
        for (uint256 i = 0; i < providerList.length; i++) {
            if (providerList[i] == _provider) {
                providerList[i] = providerList[providerList.length - 1];
                providerList.pop();
                emit AccessRevoked(msg.sender, _provider);
                return;
            }
        }
    }

    function getRecords(address _patient) public view returns (Record[] memory) {
        require(isProviderAuthorized(_patient, msg.sender), "Not authorized to view records");
        return ehrData[_patient];
    }

    function isProviderAuthorized(address _patient, address _provider) internal view returns (bool) {
        address[] storage providerList = providers[_patient];
        for (uint256 i = 0; i < providerList.length; i++) {
            if (providerList[i] == _provider) {
                return true;
            }
        }
        return false;
    }
}
