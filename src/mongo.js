const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/LoginFormPractice")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
});

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    patient_id: { type: String, required: true },
    record_id: { type: String, required: true },
    Disease: { type: String, required: true },
    date: { type: Date, default: Date.now },
    Doctor_id: { type: String, required: false }
});


const LogInCollection = mongoose.model('LogInCollection', logInSchema);
const Patient = mongoose.model('Patient', patientSchema);

module.exports = { LogInCollection, Patient };

