// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract DoctorAppointmentSystem {
    uint256 public Count = 0;
    uint256 limit = 3;
    address public owner;
    bool exists = false;
    uint avl=3;

    struct Appointment {
        uint256 timestamp;
        address appointmentId;
        string patient_name;
        uint256 age;
        uint256 phone;
        uint8 appointmentCount;
    }

    struct AvailabilityResult {
        string errorMessage;
        uint256 status;
    }

    mapping(address => address) public userAppointments; // Map user address to their appointmentId
    mapping(address => Appointment) public appointmentDetails; // Map appointmentId to Appointment details

    // Constructor
    constructor() public {
        owner = msg.sender;
    }

    // Check availability function
    function check_availability()view public returns (uint) 
    {
            return (avl);    
      
    }

    // Book appointment function
    function book_appointment(
        string memory _patient_name,
        uint256 _age,
        uint256 _phone
    ) public payable {
        require(Count < limit, "Appointment limit exceeded");
        Appointment memory newAppointment = Appointment({
            timestamp: block.timestamp,
            appointmentId: msg.sender,
            patient_name: _patient_name,
            age: _age,
            phone: _phone,
            appointmentCount: 1
        });
        if(exists == false){
            //newAppointment.appointmentCount++;
            exists = true;
            Count+=newAppointment.appointmentCount;
        }
        userAppointments[msg.sender] = msg.sender;
        appointmentDetails[msg.sender] = newAppointment;
        avl=limit - Count;
    }

    // Cancel appointment function
    function cancel_appointment() external {
        address userAppointmentId = userAppointments[msg.sender];
        require(userAppointmentId != address(0), "No appointment found for this user");
        Count--;
        delete userAppointments[msg.sender];
        delete appointmentDetails[msg.sender];
        exists = false;
    }
}