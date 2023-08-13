const DoctorAppointmentSystem = artifacts.require("DoctorAppointmentSystem");

module.exports = function (deployer) {
  deployer.deploy(DoctorAppointmentSystem);
};