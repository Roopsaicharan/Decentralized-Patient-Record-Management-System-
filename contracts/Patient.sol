// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Patient {
        string name;
        uint256 age;
        string gender;
        string patient_id;
        string record_id;
        string disease;
        string doctor_id;
        uint256 timestamp;
    }

    mapping(string => Patient[]) private doctorToPatients;

    event PatientAdded(string doctorId, string patientId);

    function addPatient(
        string memory _name,
        uint256 _age,
        string memory _gender,
        string memory _patientId,
        string memory _recordId,
        string memory _disease,
        string memory _doctorId
    ) public {
        Patient memory newPatient = Patient({
            name: _name,
            age: _age,
            gender: _gender,
            patient_id: _patientId,
            record_id: _recordId,
            disease: _disease,
            doctor_id: _doctorId,
            timestamp: block.timestamp
        });
        doctorToPatients[_doctorId].push(newPatient);
        emit PatientAdded(_doctorId, _patientId);
    }

    function getPatientsByDoctor(string memory _doctorId)
        public
        view
        returns (Patient[] memory)
    {
        return doctorToPatients[_doctorId];
    }
}
