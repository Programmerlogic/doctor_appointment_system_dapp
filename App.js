import Web3 from "web3";
import { useEffect, useState } from "react";
import DoctorAppointmentSystem from "./contracts/DoctorAppointmentSystem.json";
import './App.css';
import React from 'react';

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState(0);
  const [phone, setPhone] = useState(0);
  const [appointmentAddress, setAppointmentAddress] = useState("");
  const [appointmentData, setAppointmentData] = useState({});
  const [availability, setAvailability] = useState(0);

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorAppointmentSystem.networks[networkId];

      const contract = new web3.eth.Contract(
        DoctorAppointmentSystem.abi,
        deployedNetwork.address
      );
      setState({ web3: web3, contract: contract });
    }

    provider && template();
  }, []);

  const checkAvailability = async () => {
    const { contract } = state;
    if (contract) {
      const result = await contract.methods.check_availability().call();
      setAvailability(result);
    }
  };

  const bookAppointment = async () => {
    const { contract, web3 } = state;
    if (contract) {
      //const accounts = await web3.eth.getAccounts();
      const data = document.querySelector("#value").value;
      const senderAddress = data;
      
      try {
        await contract.methods.book_appointment(patientName, age, phone).send({ from: senderAddress });
        alert("Appointment booked successfully!");
        //checkAvailability();
      } catch (error) {
        alert("Error booking appointment:", error.message);
      }
    }
  };

  const getAppointmentData = async () => {
    const { contract } = state;
    if (contract) {
      try {
        const result = await contract.methods.appointmentDetails(appointmentAddress).call();
        setAppointmentData(result);
      } catch (error) {
        console.error("Error getting appointment data:", error);
      }
    }
  };

  const cancelAppointment = async () => {
    const { contract, web3 } = state;
    if (contract) {
      //const accounts = await web3.eth.getAccounts();
      const data = document.querySelector("#value").value;
      const senderAddress = data;

      try {
        await contract.methods.cancel_appointment().send({ from: senderAddress });
        alert("Appointment canceled successfully!");
        setAppointmentData({});
        //checkAvailability();
      } catch (error) {
        alert("Error canceling appointment:", error.message);
      }
    }
  };

  return (
    <div>
      <h1>Doctor Appointment System</h1>
      <p>Available Appointments: {availability}</p>
      <button onClick={checkAvailability}>Check Availability</button>
      <div>Enter Account</div>
      <div>
          <input type="text" id="value" required="required"></input>
        </div>

      <h2>Book Appointment</h2>
      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      Age:
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      Ph Number
      <input
        type="number"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={bookAppointment}>Book Appointment</button>

      <h2>Get Appointment Data</h2>
      <input
        type="text"
        placeholder="Appointment Address"
        value={appointmentAddress}
        onChange={(e) => setAppointmentAddress(e.target.value)}
      />
      <button onClick={getAppointmentData}>Get Appointment Data</button>
      <div>
        <h3>Appointment Data</h3>
        <p>Patient Name: {appointmentData.patient_name}</p>
        <p>Age: {appointmentData.age}</p>
        <p>Phone: {appointmentData.phone}</p>
      </div>

      <button onClick={cancelAppointment}>Cancel Appointment</button>
    </div>
  );
}

export default App;
